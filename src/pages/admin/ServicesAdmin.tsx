import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

interface ServiceData {
  id?: number;
  title: string;
  description: string;
  benefits: string[];
  cta_text: string;
  cta_link: string;
  display_order: number;
}

const ServicesAdmin = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("display_order");
    if (data) setServices(data);
    setLoading(false);
  };

  const handleAddService = () => {
    setServices([...services, { 
      title: "", 
      description: "", 
      benefits: [""], 
      cta_text: "Pesan Sekarang", 
      cta_link: "https://wa.me/6281234567890", 
      display_order: services.length + 1 
    }]);
  };

  const handleRemoveService = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("services").upsert(services);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Services updated" });
      fetchData();
    }
    setSaving(false);
  };

  const handleAddBenefit = (sIdx: number) => {
    const newServices = [...services];
    newServices[sIdx].benefits.push("");
    setServices(newServices);
  };

  const handleRemoveBenefit = (sIdx: number, bIdx: number) => {
    const newServices = [...services];
    newServices[sIdx].benefits = newServices[sIdx].benefits.filter((_, i) => i !== bIdx);
    setServices(newServices);
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleAddService}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {services.map((service, sIdx) => (
          <Card key={sIdx}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Service #{sIdx + 1}</CardTitle>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveService(sIdx, service.id)}>
                <Trash2 size={18} />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={service.title} 
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[sIdx].title = e.target.value;
                      setServices(newServices);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Input 
                    type="number"
                    value={service.display_order} 
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[sIdx].display_order = parseInt(e.target.value);
                      setServices(newServices);
                    }} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={service.description} 
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[sIdx].description = e.target.value;
                    setServices(newServices);
                  }} 
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium">Benefits</label>
                <div className="space-y-2">
                  {service.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex gap-2">
                      <Input 
                        value={benefit} 
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[sIdx].benefits[bIdx] = e.target.value;
                          setServices(newServices);
                        }} 
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveBenefit(sIdx, bIdx)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => handleAddBenefit(sIdx)}>Add Benefit</Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA Text</label>
                  <Input 
                    value={service.cta_text} 
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[sIdx].cta_text = e.target.value;
                      setServices(newServices);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA Link</label>
                  <Input 
                    value={service.cta_link} 
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[sIdx].cta_link = e.target.value;
                      setServices(newServices);
                    }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesAdmin;
