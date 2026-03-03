import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Upload } from "lucide-react";
import { uploadImage } from "@/lib/uploadHelper";

interface HeroData {
  id?: number;
  badge_text: string;
  title_part1: string;
  title_gradient: string;
  title_part2: string;
  subtitle: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
  background_image_url?: string;
}

const HeroAdmin = () => {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState<HeroData>({
    badge_text: "",
    title_part1: "",
    title_gradient: "",
    title_part2: "",
    subtitle: "",
    primary_btn_text: "",
    primary_btn_link: "",
    secondary_btn_text: "",
    secondary_btn_link: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("hero_section").select("*").single();
    if (data) setHeroData(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("hero_section").upsert(heroData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Hero section updated" });
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadImage(e.target.files[0]);
      setHeroData({ ...heroData, background_image_url: url });
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
        <h1 className="text-3xl font-bold">Manage Hero Section</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Content</CardTitle></CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Badge Text</label>
            <Input value={heroData.badge_text} onChange={(e) => setHeroData({...heroData, badge_text: e.target.value})} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Part 1</label>
              <Input value={heroData.title_part1} onChange={(e) => setHeroData({...heroData, title_part1: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Gradient</label>
              <Input value={heroData.title_gradient} onChange={(e) => setHeroData({...heroData, title_gradient: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Part 2</label>
              <Input value={heroData.title_part2} onChange={(e) => setHeroData({...heroData, title_part2: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle</label>
            <Textarea value={heroData.subtitle} onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Button Text</label>
              <Input value={heroData.primary_btn_text} onChange={(e) => setHeroData({...heroData, primary_btn_text: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Button Link</label>
              <Input value={heroData.primary_btn_link} onChange={(e) => setHeroData({...heroData, primary_btn_link: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Button Text</label>
              <Input value={heroData.secondary_btn_text} onChange={(e) => setHeroData({...heroData, secondary_btn_text: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Button Link</label>
              <Input value={heroData.secondary_btn_link} onChange={(e) => setHeroData({...heroData, secondary_btn_link: e.target.value})} />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium">Background Image</label>
            <div className="flex items-center gap-4">
              {heroData.background_image_url && (
                <img src={heroData.background_image_url} alt="Preview" className="w-32 h-20 object-cover rounded-md border" />
              )}
              <div className="flex-grow">
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" id="hero-img" />
                <Button asChild variant="outline" disabled={uploading}>
                  <label htmlFor="hero-img" className="cursor-pointer">
                    {uploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload New Image
                  </label>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroAdmin;
