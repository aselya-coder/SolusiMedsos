import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { SectionHeaderAdmin } from "@/components/admin/SectionHeaderAdmin";

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

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (data) {
      setServices(
        data.map((service) => ({
          ...service,
          benefits: service.benefits || [],
        }))
      );
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ ADD SERVICE
  const handleAddService = () => {
    setServices([
      ...services,
      {
        title: "",
        description: "",
        benefits: [""],
        cta_text: "Pesan Sekarang",
        cta_link: "https://wa.me/6281234567890",
        display_order: services.length + 1,
      },
    ]);
  };

  // ✅ REMOVE SERVICE
  const handleRemoveService = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }

    setServices(services.filter((_, i) => i !== index));
  };

  // ✅ SAVE ALL (FIXED)
  const handleSave = async () => {
    setSaving(true);

    for (const service of services) {
      const payload = {
        title: service.title,
        description: service.description,
        benefits: service.benefits, // ✅ kirim array langsung
        cta_text: service.cta_text,
        cta_link: service.cta_link,
        display_order: Number(service.display_order),
      };

      let error;

      if (service.id) {
        ({ error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", service.id));
      } else {
        ({ error } = await supabase
          .from("services")
          .insert(payload));
      }

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    toast({
      title: "Success",
      description: "Services updated successfully",
    });

    fetchData();
    setSaving(false);
  };

  // ✅ BENEFITS HANDLER
  const handleAddBenefit = (sIdx: number) => {
    const newServices = [...services];
    newServices[sIdx].benefits.push("");
    setServices(newServices);
  };

  const handleRemoveBenefit = (sIdx: number, bIdx: number) => {
    const newServices = [...services];
    newServices[sIdx].benefits =
      newServices[sIdx].benefits.filter((_, i) => i !== bIdx);
    setServices(newServices);
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
        <h1 className="text-3xl font-bold">Manage Services</h1>

        <div className="space-x-4">
          <Button variant="outline" onClick={handleAddService}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save className="mr-2" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>

      <SectionHeaderAdmin sectionKey="services" />

      <div className="grid gap-6">
        {services.map((service, sIdx) => (
          <Card key={sIdx}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Service #{sIdx + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() =>
                  handleRemoveService(sIdx, service.id)
                }
              >
                <Trash2 size={18} />
              </Button>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
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

                <div>
                  <label className="text-sm font-medium">Order</label>
                  <Input
                    type="number"
                    value={service.display_order}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[sIdx].display_order =
                        Number(e.target.value);
                      setServices(newServices);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  value={service.description}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[sIdx].description =
                      e.target.value;
                    setServices(newServices);
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Benefits
                </label>

                {service.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex gap-2 mb-2">
                    <Input
                      value={benefit}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[sIdx].benefits[bIdx] =
                          e.target.value;
                        setServices(newServices);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleRemoveBenefit(sIdx, bIdx)
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBenefit(sIdx)}
                >
                  Add Benefit
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    CTA Text
                  </label>
                  <Input
                    value={service.cta_text}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[sIdx].cta_text =
                        e.target.value;
                      setServices(newServices);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    CTA Link
                  </label>
                  <Input
                    value={service.cta_link}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[sIdx].cta_link =
                        e.target.value;
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
