import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { SectionHeaderAdmin } from "@/components/admin/SectionHeaderAdmin";

interface FAQData {
  id?: number;
  question: string;
  answer: string;
  display_order: number;
}

const FAQAdmin = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("faq").select("*").order("display_order");
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    if (data) setFaqs(data);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setFaqs([...faqs, { question: "", answer: "", display_order: faqs.length + 1 }]);
  };

  const handleRemove = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase.from("faq").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const cleaned = faqs.filter((f) => f.question.trim() !== "" && f.answer.trim() !== "");
    const inserts = cleaned.filter((f) => !f.id || f.id <= 0).map((f) => ({
      question: f.question,
      answer: f.answer,
      display_order: f.display_order ?? 0,
    }));
    const updates = cleaned.filter((f) => f.id && f.id > 0);

    const insertRes = inserts.length ? await supabase.from("faq").insert(inserts) : { error: null };
    const updateResList = await Promise.all(
      updates.map((f) =>
        supabase
          .from("faq")
          .update({ question: f.question, answer: f.answer, display_order: f.display_order ?? 0 })
          .eq("id", f.id as number),
      ),
    );
    const updateError = updateResList.find((r) => r.error)?.error || null;

    if (insertRes.error || updateError) {
      const msg = insertRes.error?.message || updateError?.message || "Unknown error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "FAQ updated" });
      fetchData();
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage FAQ</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Add FAQ</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save All Changes
          </Button>
        </div>
      </div>

      <SectionHeaderAdmin sectionKey="faq" />

      <div className="grid gap-6">
        {faqs.map((faq, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>FAQ #{idx + 1}</CardTitle>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemove(idx, faq.id)}>
                <Trash2 size={18} />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Input 
                  value={faq.question} 
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[idx].question = e.target.value;
                    setFaqs(newFaqs);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Answer</label>
                <Textarea 
                  value={faq.answer} 
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[idx].answer = e.target.value;
                    setFaqs(newFaqs);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Input 
                  type="number"
                  value={Number.isFinite(faq.display_order) ? faq.display_order : ""} 
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    const parsed = parseInt(e.target.value, 10);
                    newFaqs[idx].display_order = Number.isNaN(parsed) ? 0 : parsed;
                    setFaqs(newFaqs);
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQAdmin;
