import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

interface NavLinkData {
  id?: number;
  label: string;
  href: string;
  display_order: number;
}

interface NavbarData {
  id?: number;
  brand_name: string;
  brand_gradient_text: string;
  cta_text: string;
  cta_link: string;
}

const NavbarAdmin = () => {
  const { toast } = useToast();
  const [navbarData, setNavbarData] = useState<NavbarData>({
    brand_name: "",
    brand_gradient_text: "",
    cta_text: "",
    cta_link: ""
  });
  const [navLinks, setNavLinks] = useState<NavLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: navData, error: navError } = await supabase.from("navbar").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
    if (navError) {
      toast({ title: "Error", description: navError.message, variant: "destructive" });
    } else if (navData) {
      setNavbarData(navData);
    }

    const { data: linksData, error: linksError } = await supabase.from("nav_links").select("*").order("display_order");
    if (linksError) {
      toast({ title: "Error", description: linksError.message, variant: "destructive" });
    } else if (linksData) {
      setNavLinks(linksData);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleSaveNavbar = async () => {
    setSaving(true);
    const hasId = Boolean(navbarData.id && navbarData.id > 0);
    const { error } = hasId
      ? await supabase.from("navbar").update({
          brand_name: navbarData.brand_name,
          brand_gradient_text: navbarData.brand_gradient_text,
          cta_text: navbarData.cta_text,
          cta_link: navbarData.cta_link,
        }).eq("id", navbarData.id as number)
      : await supabase.from("navbar").insert({
          brand_name: navbarData.brand_name,
          brand_gradient_text: navbarData.brand_gradient_text,
          cta_text: navbarData.cta_text,
          cta_link: navbarData.cta_link,
        });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Navbar updated successfully" });
    }
    setSaving(false);
  };

  const handleAddLink = () => {
    setNavLinks([...navLinks, { label: "", href: "", display_order: navLinks.length + 1 }]);
  };

  const handleRemoveLink = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase.from("nav_links").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    const newLinks = navLinks.filter((_, i) => i !== index);
    setNavLinks(newLinks);
  };

  const handleSaveLinks = async () => {
    setSaving(true);
    const cleaned = navLinks.filter((l) => l.label.trim() !== "" && l.href.trim() !== "");
    const inserts = cleaned.filter((l) => !l.id || l.id <= 0).map((l) => ({
      label: l.label,
      href: l.href,
      display_order: l.display_order ?? 0,
    }));
    const updates = cleaned.filter((l) => l.id && l.id > 0);

    const insertRes = inserts.length
      ? await supabase.from("nav_links").insert(inserts)
      : { error: null };
    const updateResList = await Promise.all(
      updates.map((l) =>
        supabase
          .from("nav_links")
          .update({ label: l.label, href: l.href, display_order: l.display_order ?? 0 })
          .eq("id", l.id as number),
      ),
    );
    const updateError = updateResList.find((r) => r.error)?.error || null;

    if (insertRes.error || updateError) {
      const msg = insertRes.error?.message || updateError?.message || "Unknown error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Navigation links updated" });
      fetchData();
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Navbar</h1>
        <Button onClick={() => { handleSaveNavbar(); handleSaveLinks(); }} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          Save All Changes
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Brand & CTA</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Name (Normal)</label>
            <Input 
              value={navbarData.brand_name} 
              onChange={(e) => setNavbarData({...navbarData, brand_name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Name (Gradient)</label>
            <Input 
              value={navbarData.brand_gradient_text} 
              onChange={(e) => setNavbarData({...navbarData, brand_gradient_text: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Button Text</label>
            <Input 
              value={navbarData.cta_text} 
              onChange={(e) => setNavbarData({...navbarData, cta_text: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Button Link</label>
            <Input 
              value={navbarData.cta_link} 
              onChange={(e) => setNavbarData({...navbarData, cta_link: e.target.value})} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Navigation Links</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddLink}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {navLinks.map((link, idx) => (
            <div key={idx} className="flex gap-4 items-end border-b pb-4 last:border-0">
              <div className="flex-grow grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Label</label>
                  <Input 
                    value={link.label} 
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      newLinks[idx].label = e.target.value;
                      setNavLinks(newLinks);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">HREF (e.g. #about)</label>
                  <Input 
                    value={link.href} 
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      newLinks[idx].href = e.target.value;
                      setNavLinks(newLinks);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Input 
                    type="number"
                    value={Number.isFinite(link.display_order) ? link.display_order : ""} 
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      const parsed = parseInt(e.target.value, 10);
                      newLinks[idx].display_order = Number.isNaN(parsed) ? 0 : parsed;
                      setNavLinks(newLinks);
                    }} 
                  />
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

export default NavbarAdmin;
