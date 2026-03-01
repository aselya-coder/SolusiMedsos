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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: mainData } = await supabase.from("footer").select("*").single();
    if (mainData) setFooterData(mainData);

    const { data: linksData } = await supabase.from("footer_links").select("*").order("display_order");
    if (linksData) setLinks(linksData);
    setLoading(false);
  };

  const handleSaveMain = async () => {
    setSaving(true);
    const { error } = await supabase.from("footer").upsert(footerData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Footer updated" });
    }
    setSaving(false);
  };

  const handleAddLink = () => {
    setLinks([...links, { label: "", href: "", category: "Navigasi", display_order: links.length + 1 }]);
  };

  const handleRemoveLink = async (index: number, id?: number) => {
    if (id) {
      await supabase.from("footer_links").delete().eq("id", id);
    }
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSaveLinks = async () => {
    setSaving(true);
    const { error } = await supabase.from("footer_links").upsert(links);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Footer links updated" });
      fetchData();
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Footer</h1>
        <Button onClick={() => { handleSaveMain(); handleSaveLinks(); }} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Save All Changes
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Brand & Contact</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Part 1</label>
              <Input value={footerData.brand_name_part1} onChange={(e) => setFooterData({...footerData, brand_name_part1: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Part 2</label>
              <Input value={footerData.brand_name_part2} onChange={(e) => setFooterData({...footerData, brand_name_part2: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea value={footerData.description} onChange={(e) => setFooterData({...footerData, description: e.target.value})} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={footerData.email} onChange={(e) => setFooterData({...footerData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone (e.g. 628...)</label>
              <Input value={footerData.phone} onChange={(e) => setFooterData({...footerData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram Username</label>
              <Input value={footerData.instagram_username} onChange={(e) => setFooterData({...footerData, instagram_username: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Copyright Text</label>
            <Input value={footerData.copyright_text} onChange={(e) => setFooterData({...footerData, copyright_text: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Footer Links</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddLink}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-4 items-end border-b pb-4 last:border-0">
              <div className="flex-grow grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Label</label>
                  <Input value={link.label} onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].label = e.target.value;
                    setLinks(newLinks);
                  }} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">HREF</label>
                  <Input value={link.href} onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].href = e.target.value;
                    setLinks(newLinks);
                  }} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input value={link.category} onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].category = e.target.value;
                    setLinks(newLinks);
                  }} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Input type="number" value={link.display_order} onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].display_order = parseInt(e.target.value);
                    setLinks(newLinks);
                  }} />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveLink(idx, link.id)}>
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
