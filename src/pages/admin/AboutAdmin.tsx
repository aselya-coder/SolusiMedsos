import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/uploadHelper";

interface AboutData {
  id?: number;
  badge_text: string;
  title_part1: string;
  title_gradient: string;
  description_1: string;
  description_2: string;
  image_url?: string | null;
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
    description_2: "",
    image_url: null
  });

  const [advantages, setAdvantages] = useState<AdvantageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: aboutRows, error: aboutError } = await supabase
        .from("about_section")
        .select("*")
        .order("id", { ascending: true });

      if (aboutError) {
        console.error(aboutError);
      } else if (aboutRows && aboutRows.length > 0) {
        setAboutData(aboutRows[0]);
      }

      const { data: advData, error: advError } = await supabase
        .from("about_advantages")
        .select("*")
        .order("display_order");

      if (advError) {
        console.error(advError);
      } else if (advData) {
        setAdvantages(advData);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE MAIN ================= */

  const handleSaveMain = async () => {
    if (!aboutData.id) return;

    const { error } = await supabase
      .from("about_section")
      .update({
        badge_text: aboutData.badge_text,
        title_part1: aboutData.title_part1,
        title_gradient: aboutData.title_gradient,
        description_1: aboutData.description_1,
        description_2: aboutData.description_2,
        image_url: aboutData.image_url
      })
      .eq("id", aboutData.id);

    if (error) throw error;
  };

  /* ================= SAVE ADVANTAGES ================= */

  const handleSaveAdvantages = async () => {
    for (const adv of advantages) {
      if (!adv.icon_name || !adv.text) {
        throw new Error("Icon dan Text tidak boleh kosong");
      }

      if (adv.id) {
        await supabase
          .from("about_advantages")
          .update({
            icon_name: adv.icon_name,
            text: adv.text,
            display_order: adv.display_order
          })
          .eq("id", adv.id);
      } else {
        await supabase
          .from("about_advantages")
          .insert({
            icon_name: adv.icon_name,
            text: adv.text,
            display_order: adv.display_order
          });
      }
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await handleSaveMain();
      await handleSaveAdvantages();
      toast({ title: "Success", description: "About section updated" });
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= ADVANTAGE CRUD ================= */

  const handleAdvantageChange = (
    index: number,
    field: keyof AdvantageData,
    value: string | number
  ) => {
    const updated = [...advantages];
    updated[index] = { ...updated[index], [field]: value };
    setAdvantages(updated);
  };

  const handleAddAdvantage = () => {
    setAdvantages([
      ...advantages,
      {
        icon_name: "Users",
        text: "",
        display_order: advantages.length + 1
      }
    ]);
  };

  const handleRemoveAdvantage = async (index: number, id?: number) => {
    if (id) {
      await supabase.from("about_advantages").delete().eq("id", id);
    }
    setAdvantages(advantages.filter((_, i) => i !== index));
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    try {
      const url = await uploadImage(e.target.files[0]);
      setAboutData({ ...aboutData, image_url: url });
      toast({ title: "Success", description: "Image uploaded" });
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

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage About Section</h1>
        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Save All Changes
        </Button>
      </div>

      {/* ABOUT MAIN */}
      <Card>
        <CardHeader>
          <CardTitle>Main About Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <Input
            placeholder="Badge Text"
            value={aboutData.badge_text}
            onChange={(e) =>
              setAboutData({ ...aboutData, badge_text: e.target.value })
            }
          />

          <Input
            placeholder="Title Part 1"
            value={aboutData.title_part1}
            onChange={(e) =>
              setAboutData({ ...aboutData, title_part1: e.target.value })
            }
          />

          <Input
            placeholder="Title Gradient"
            value={aboutData.title_gradient}
            onChange={(e) =>
              setAboutData({ ...aboutData, title_gradient: e.target.value })
            }
          />

          <Textarea
            placeholder="Description 1"
            value={aboutData.description_1}
            onChange={(e) =>
              setAboutData({ ...aboutData, description_1: e.target.value })
            }
          />

          <Textarea
            placeholder="Description 2"
            value={aboutData.description_2}
            onChange={(e) =>
              setAboutData({ ...aboutData, description_2: e.target.value })
            }
          />

          <div className="space-y-2">
            <Input type="file" onChange={handleImageUpload} />
            {uploading && <Loader2 className="animate-spin" />}
            {aboutData.image_url && (
              <img
                src={aboutData.image_url}
                alt="Preview"
                className="w-48 rounded"
              />
            )}
          </div>

        </CardContent>
      </Card>

      {/* ADVANTAGES */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Advantages</CardTitle>
          <Button onClick={handleAddAdvantage}>
            <Plus className="mr-2" /> Add
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {advantages.map((adv, index) => (
            <div key={index} className="border p-4 rounded space-y-2">

              <Input
                placeholder="Icon Name"
                value={adv.icon_name}
                onChange={(e) =>
                  handleAdvantageChange(index, "icon_name", e.target.value)
                }
              />

              <Input
                placeholder="Text"
                value={adv.text}
                onChange={(e) => handleAdvantageChange(index, "text", e.target.value)}
              />

              <Button
                variant="destructive"
                onClick={() => handleRemoveAdvantage(index, adv.id)}
              >
                <Trash2 className="mr-2" /> Remove
              </Button>

            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

export default AboutAdmin;
