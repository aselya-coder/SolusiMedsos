import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "@/lib/uploadHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

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
    background_image_url: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("hero_section")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) setHeroData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (heroData.id) {
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
            background_image_url: heroData.background_image_url ?? null,
          })
          .eq("id", heroData.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("hero_section").insert({
          badge_text: heroData.badge_text,
          title_part1: heroData.title_part1,
          title_gradient: heroData.title_gradient,
          title_part2: heroData.title_part2,
          subtitle: heroData.subtitle,
          primary_btn_text: heroData.primary_btn_text,
          primary_btn_link: heroData.primary_btn_link,
          secondary_btn_text: heroData.secondary_btn_text,
          secondary_btn_link: heroData.secondary_btn_link,
          background_image_url: heroData.background_image_url ?? null,
        });
        if (error) throw new Error(error.message);
      }
      alert("Berhasil disimpan!");
      // refresh to capture generated id
      const { data } = await supabase.from("hero_section").select("*").order("id").limit(1).maybeSingle();
      if (data) setHeroData(data);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    try {
      const url = await uploadImage(e.target.files[0]);
      setHeroData({
        ...heroData,
        background_image_url: url,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">Manage Hero Section</h1>

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

      {heroData.background_image_url && (
        <img
          src={heroData.background_image_url}
          className="w-40 rounded"
        />
      )}

      <Input type="file" onChange={handleUpload} />

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};

export default HeroAdmin;
