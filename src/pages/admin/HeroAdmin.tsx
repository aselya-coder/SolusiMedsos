import { useState, useEffect, useCallback } from "react";
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
  background_image_url?: string | null;
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
    secondary_btn_link: "",
    background_image_url: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("FETCH ERROR:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (data) {
      setHeroData(data);
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!heroData.id) {
      toast({
        title: "Error",
        description: "ID tidak ditemukan",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("hero_section")
      .update({
        badge_text: heroData.badge_text,
        title_part1: heroData.title_part1,
        title_gradient: heroData.title_gradient,
        title_part2: heroData.title_part2,
        subtitle: heroData.subtitle,
        primary_btn_text: heroData.primary_btn_text,
        primary_btn_link: heroData.primary_btn_link,
        secondary_btn_text: heroData.secondary_btn_text,
        secondary_btn_link: heroData.secondary_btn_link,
        background_image_url: heroData.background_image_url
      })
      .eq("id", heroData.id);

    if (error) {
      console.error("SAVE ERROR:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Hero section berhasil diupdate"
      });
    }

    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);

    try {
      const url = await uploadImage(e.target.files[0]);

      setHeroData({
        ...heroData,
        background_image_url: url
      });

      toast({
        title: "Success",
        description: "Image uploaded"
      });

    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Hero Section</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save className="mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">

          <Input
            placeholder="Badge Text"
            value={heroData.badge_text}
            onChange={(e) =>
              setHeroData({ ...heroData, badge_text: e.target.value })
            }
          />

          <Input
            placeholder="Title Part 1"
            value={heroData.title_part1}
            onChange={(e) =>
              setHeroData({ ...heroData, title_part1: e.target.value })
            }
          />

          <Input
            placeholder="Title Gradient"
            value={heroData.title_gradient}
            onChange={(e) =>
              setHeroData({ ...heroData, title_gradient: e.target.value })
            }
          />

          <Input
            placeholder="Title Part 2"
            value={heroData.title_part2}
            onChange={(e) =>
              setHeroData({ ...heroData, title_part2: e.target.value })
            }
          />

          <Textarea
            placeholder="Subtitle"
            value={heroData.subtitle}
            onChange={(e) =>
              setHeroData({ ...heroData, subtitle: e.target.value })
            }
          />

          <Input
            placeholder="Primary Button Text"
            value={heroData.primary_btn_text}
            onChange={(e) =>
              setHeroData({ ...heroData, primary_btn_text: e.target.value })
            }
          />

          <Input
            placeholder="Primary Button Link"
            value={heroData.primary_btn_link}
            onChange={(e) =>
              setHeroData({ ...heroData, primary_btn_link: e.target.value })
            }
          />

          <Input
            placeholder="Secondary Button Text"
            value={heroData.secondary_btn_text}
            onChange={(e) =>
              setHeroData({ ...heroData, secondary_btn_text: e.target.value })
            }
          />

          <Input
            placeholder="Secondary Button Link"
            value={heroData.secondary_btn_link}
            onChange={(e) =>
              setHeroData({ ...heroData, secondary_btn_link: e.target.value })
            }
          />

          {heroData.background_image_url && (
            <img
              src={heroData.background_image_url}
              alt="Preview"
              className="w-40 rounded-md"
            />
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroAdmin;