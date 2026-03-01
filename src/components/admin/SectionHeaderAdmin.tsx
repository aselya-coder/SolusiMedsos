import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface SectionHeaderProps {
  sectionKey: string;
}

export const SectionHeaderAdmin = ({ sectionKey }: SectionHeaderProps) => {
  const { toast } = useToast();
  const [header, setHeader] = useState({
    badge_text: "",
    title_part1: "",
    title_gradient: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHeader();
  }, [sectionKey]);

  const fetchHeader = async () => {
    setLoading(true);
    const { data } = await supabase.from("section_content").select("*").eq("section_key", sectionKey).single();
    if (data) setHeader(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("section_content").upsert({ section_key: sectionKey, ...header });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Section header updated" });
    }
    setSaving(false);
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader><CardTitle className="text-lg">Section Header (Badge & Title)</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Badge Text</label>
          <Input value={header.badge_text} onChange={(e) => setHeader({...header, badge_text: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Title Part 1</label>
          <Input value={header.title_part1} onChange={(e) => setHeader({...header, title_part1: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Title Gradient</label>
          <Input value={header.title_gradient} onChange={(e) => setHeader({...header, title_gradient: e.target.value})} />
        </div>
        <div className="sm:col-span-3 flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Save Header
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
