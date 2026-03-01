import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface CTAData {
  id?: number;
  title_part1: string;
  title_gradient: string;
  description: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
}

const CTAAdmin = () => {
  const { toast } = useToast();
  const [ctaData, setCtaData] = useState<CTAData>({
    title_part1: "",
    title_gradient: "",
    description: "",
    primary_btn_text: "",
    primary_btn_link: "",
    secondary_btn_text: "",
    secondary_btn_link: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("cta_section").select("*").single();
    if (data) setCtaData(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("cta_section").upsert(ctaData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "CTA updated" });
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage CTA</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>CTA Content</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Part 1</label>
              <Input value={ctaData.title_part1} onChange={(e) => setCtaData({...ctaData, title_part1: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Gradient</label>
              <Input value={ctaData.title_gradient} onChange={(e) => setCtaData({...ctaData, title_gradient: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea value={ctaData.description} onChange={(e) => setCtaData({...ctaData, description: e.target.value})} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Button Text</label>
              <Input value={ctaData.primary_btn_text} onChange={(e) => setCtaData({...ctaData, primary_btn_text: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Button Link</label>
              <Input value={ctaData.primary_btn_link} onChange={(e) => setCtaData({...ctaData, primary_btn_link: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Button Text</label>
              <Input value={ctaData.secondary_btn_text} onChange={(e) => setCtaData({...ctaData, secondary_btn_text: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Button Link</label>
              <Input value={ctaData.secondary_btn_link} onChange={(e) => setCtaData({...ctaData, secondary_btn_link: e.target.value})} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTAAdmin;
