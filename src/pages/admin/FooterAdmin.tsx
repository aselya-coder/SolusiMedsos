import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

interface FooterData {
  id?: number;
  brand_name_part1: string;
  brand_name_part2: string;
  description: string;
  copyright_text: string;
  email: string;
  phone: string;
  instagram_username: string;
}

interface FooterLinkData {
  id?: number;
  label: string;
  href: string;
  category: string;
  display_order: number;
}

const FooterAdmin = () => {
  const { toast } = useToast();

  const [footerData, setFooterData] = useState<FooterData>({
    id: 1,
    brand_name_part1: "",
    brand_name_part2: "",
    description: "",
    copyright_text: "",
    email: "",
    phone: "",
    instagram_username: ""
  });

  const [links, setLinks] = useState<FooterLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    setLoading(true);

    const { data: mainData, error: mainError } = await supabase
      .from("footer")
      .select("*")
      .eq("id", 1)
      .single();

    if (mainError && mainError.code !== "PGRST116") {
      console.error(mainError);
    }

    if (mainData) {
      setFooterData(mainData);
    }

    const { data: linksData, error: linksError } = await supabase
      .from("footer_links")
      .select("*")
      .order("display_order", { ascending: true });

    if (linksError) {
      console.error(linksError);
    }

    if (linksData) {
      setLinks(linksData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SAVE MAIN FOOTER =================
  const handleSaveMain = async () => {
    setSaving(true);

    const payload = {
      id: footerData.id || 1,
      brand_name_part1: footerData.brand_name_part1,
      brand_name_part2: footerData.brand_name_part2,
      description: footerData.description,
      copyright_text: footerData.copyright_text,
      email: footerData.email,
      phone: footerData.phone,
      instagram_username: footerData.instagram_username
    };

    const { error } = await supabase
      .from("footer")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error(error);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });

      setSaving(false);
      return;
    }

    toast({
      title: "Success",
      description: "Footer updated successfully"
    });

    setSaving(false);
  };

  // ================= ADD LINK =================
  const handleAddLink = () => {
    setLinks([
      ...links,
      {
        label: "",
        href: "",
        category: "Navigasi",
        display_order: links.length + 1
      }
    ]);
  };

  // ================= REMOVE LINK =================
  const handleRemoveLink = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase
        .from("footer_links")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
      }
    }

    setLinks(links.filter((_, i) => i !== index));
  };

  // ================= SAVE LINKS =================
  const handleSaveLinks = async () => {
    setSaving(true);

    const payload = links.map((link) => ({
      id: link.id,
      label: link.label,
      href: link.href,
      category: link.category,
      display_order: link.display_order
    }));

    const { error } = await supabase
      .from("footer_links")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error(error);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });

      setSaving(false);
      return;
    }

    toast({
      title: "Success",
      description: "Footer links updated"
    });

    fetchData();

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Footer</h1>

        <Button
          onClick={() => {
            handleSaveMain();
            handleSaveLinks();
          }}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save className="mr-2" />
          )}
          Save All Changes
        </Button>
      </div>

      {/* ================= BRAND ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Brand & Contact</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Brand Part 1
              </label>

              <Input
                value={footerData.brand_name_part1}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    brand_name_part1: e.target.value
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Brand Part 2
              </label>

              <Input
                value={footerData.brand_name_part2}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    brand_name_part2: e.target.value
                  })
                }
              />
            </div>

          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Textarea
              value={footerData.description}
              onChange={(e) =>
                setFooterData({
                  ...footerData,
                  description: e.target.value
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>

              <Input
                value={footerData.email}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    email: e.target.value
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phone
              </label>

              <Input
                value={footerData.phone}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    phone: e.target.value
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Instagram
              </label>

              <Input
                value={footerData.instagram_username}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    instagram_username: e.target.value
                  })
                }
              />
            </div>

          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Copyright Text
            </label>

            <Input
              value={footerData.copyright_text}
              onChange={(e) =>
                setFooterData({
                  ...footerData,
                  copyright_text: e.target.value
                })
              }
            />
          </div>

        </CardContent>
      </Card>

      {/* ================= FOOTER LINKS ================= */}
      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle>Footer Links</CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddLink}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>

        </CardHeader>

        <CardContent className="space-y-4">

          {links.map((link, idx) => (

            <div
              key={idx}
              className="flex gap-4 items-end border-b pb-4 last:border-0"
            >

              <div className="flex-grow grid gap-4 sm:grid-cols-4">

                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].label = e.target.value;
                    setLinks(newLinks);
                  }}
                />

                <Input
                  placeholder="HREF"
                  value={link.href}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].href = e.target.value;
                    setLinks(newLinks);
                  }}
                />

                <Input
                  placeholder="Category"
                  value={link.category}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].category = e.target.value;
                    setLinks(newLinks);
                  }}
                />

                <Input
                  type="number"
                  value={link.display_order}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].display_order =
                      Number(e.target.value);
                    setLinks(newLinks);
                  }}
                />

              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() =>
                  handleRemoveLink(idx, link.id)
                }
              >
                <Trash2 size={18} />
              </Button>

            </div>

          ))}

        </CardContent>

      </Card>

    </div>
  );
};

export default FooterAdmin;