import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/uploadHelper";

interface AboutData {
  id?: number;
  badge_text: string;
  title_part1: string;
  title_gradient: string;
  description_1: string;
  description_2: string;
  image_url?: string;
}

interface AdvantageData {
  id?: number;
  icon_name: string;
  text: string;
  display_order: number;
}

const AboutAdmin = () => {
  const { toast } = useToast();
  const [aboutData, setAboutData] = useState<AboutData>({
    badge_text: "",
    title_part1: "",
    title_gradient: "",
    description_1: "",
    description_2: ""
  });
  const [advantages, setAdvantages] = useState<AdvantageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: mainData } = await supabase.from("about_section").select("*").single();
    if (mainData) setAboutData(mainData);

    const { data: advData } = await supabase.from("about_advantages").select("*").order("display_order");
    if (advData) setAdvantages(advData);
    setLoading(false);
  };

  const handleSaveMain = async () => {
    setSaving(true);
    const { error } = await supabase.from("about_section").upsert(aboutData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "About section updated" });
    }
    setSaving(false);
  };

  const handleAddAdvantage = () => {
    setAdvantages([...advantages, { icon_name: "Users", text: "", display_order: advantages.length + 1 }]);
  };

  const handleRemoveAdvantage = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase.from("about_advantages").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    setAdvantages(advantages.filter((_, i) => i !== index));
  };

  const handleSaveAdvantages = async () => {
    setSaving(true);
    const { error } = await supabase.from("about_advantages").upsert(advantages);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Advantages updated" });
      fetchData();
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadImage(e.target.files[0]);
      setAboutData({ ...aboutData, image_url: url });
      toast({ title: "Success", description: "Image uploaded" });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage About Section</h1>
        <Button onClick={() => { handleSaveMain(); handleSaveAdvantages(); }} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Save All Changes
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Content</CardTitle></CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Badge Text</label>
            <Input value={aboutData.badge_text} onChange={(e) => setAboutData({...aboutData, badge_text: e.target.value})} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Part 1</label>
              <Input value={aboutData.title_part1} onChange={(e) => setAboutData({...aboutData, title_part1: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Gradient</label>
              <Input value={aboutData.title_gradient} onChange={(e) => setAboutData({...aboutData, title_gradient: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description 1</label>
            <Textarea value={aboutData.description_1} onChange={(e) => setAboutData({...aboutData, description_1: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description 2</label>
            <Textarea value={aboutData.description_2} onChange={(e) => setAboutData({...aboutData, description_2: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Advantages (Icons)</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddAdvantage}><Plus className="mr-2 h-4 w-4" /> Add Advantage</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {advantages.map((adv, idx) => (
            <div key={idx} className="flex gap-4 items-end border-b pb-4 last:border-0">
              <div className="flex-grow grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon Name (Lucide)</label>
                  <Input 
                    value={adv.icon_name} 
                    onChange={(e) => {
                      const newAdv = [...advantages];
                      newAdv[idx].icon_name = e.target.value;
                      setAdvantages(newAdv);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text</label>
                  <Input 
                    value={adv.text} 
                    onChange={(e) => {
                      const newAdv = [...advantages];
                      newAdv[idx].text = e.target.value;
                      setAdvantages(newAdv);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Input 
                    type="number"
                    value={adv.display_order} 
                    onChange={(e) => {
                      const newAdv = [...advantages];
                      newAdv[idx].display_order = parseInt(e.target.value);
                      setAdvantages(newAdv);
                    }} 
                  />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveAdvantage(idx, adv.id)}>
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutAdmin;
