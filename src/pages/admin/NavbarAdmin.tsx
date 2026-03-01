import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: navData } = await supabase.from("navbar").select("*").single();
    if (navData) setNavbarData(navData);

    const { data: linksData } = await supabase.from("nav_links").select("*").order("display_order");
    if (linksData) setNavLinks(linksData);
    setLoading(false);
  };

  const handleSaveNavbar = async () => {
    setSaving(true);
    const { error } = await supabase.from("navbar").upsert(navbarData);
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
    const { error } = await supabase.from("nav_links").upsert(navLinks);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
                    value={link.display_order} 
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      newLinks[idx].display_order = parseInt(e.target.value);
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
