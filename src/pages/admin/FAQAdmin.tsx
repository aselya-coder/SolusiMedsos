import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("faq").select("*").order("display_order");
    if (data) setFaqs(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setFaqs([...faqs, { question: "", answer: "", display_order: faqs.length + 1 }]);
  };

  const handleRemove = async (index: number, id?: number) => {
    if (id) {
      await supabase.from("faq").delete().eq("id", id);
    }
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("faq").upsert(faqs);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
            Save Changes
          </Button>
        </div>
      </div>

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
                  value={faq.display_order} 
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[idx].display_order = parseInt(e.target.value);
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
