import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionHeaderAdmin } from "@/components/admin/SectionHeaderAdmin";

interface PricingData {
  id?: number;
  name: string;
  price: string;
  is_popular: boolean;
  display_order: number;
}

interface FeatureData {
  id?: number;
  pricing_id: number;
  feature: string;
  display_order: number;
}

const PricingAdmin = () => {
  const { toast } = useToast();

  const [plans, setPlans] = useState<PricingData[]>([]);
  const [allFeatures, setAllFeatures] = useState<FeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: plansData, error: plansError } = await supabase
      .from("pricing")
      .select("*")
      .order("display_order", { ascending: true });

    if (plansError) {
      toast({
        title: "Error",
        description: plansError.message,
        variant: "destructive",
      });
    } else {
      setPlans(plansData || []);
    }

    const { data: featuresData, error: featuresError } = await supabase
      .from("pricing_features")
      .select("*")
      .order("display_order", { ascending: true });

    if (featuresError) {
      toast({
        title: "Error",
        description: featuresError.message,
        variant: "destructive",
      });
    } else {
      setAllFeatures(featuresData || []);
    }

    setLoading(false);
  };

  const handleAddPlan = () => {
    setPlans([
      ...plans,
      {
        name: "",
        price: "",
        is_popular: false,
        display_order: plans.length + 1,
      },
    ]);
  };

  const handleRemovePlan = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase.from("pricing").delete().eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }

    setPlans(plans.filter((_, i) => i !== index));
  };

  const handleAddFeature = (pricingId: number) => {
    setAllFeatures([
      ...allFeatures,
      {
        pricing_id: pricingId,
        feature: "",
        display_order:
          allFeatures.filter((f) => f.pricing_id === pricingId).length + 1,
      },
    ]);
  };

  const handleRemoveFeature = async (idx: number, id?: number) => {
    if (id) {
      await supabase.from("pricing_features").delete().eq("id", id);
    }

    setAllFeatures(allFeatures.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      for (const plan of plans) {
        const payload = {
          name: plan.name,
          price: plan.price,
          is_popular: plan.is_popular,
          display_order: Number(plan.display_order),
        };

        let error;

        if (plan.id) {
          ({ error } = await supabase
            .from("pricing")
            .update(payload)
            .eq("id", plan.id));
        } else {
          ({ error } = await supabase.from("pricing").insert(payload));
        }

        if (error) throw error;
      }

      for (const feature of allFeatures) {
        const payload = {
          pricing_id: feature.pricing_id,
          feature: feature.feature,
          display_order: Number(feature.display_order),
        };

        let error;

        if (feature.id) {
          ({ error } = await supabase
            .from("pricing_features")
            .update(payload)
            .eq("id", feature.id));
        } else {
          ({ error } = await supabase
            .from("pricing_features")
            .insert(payload));
        }

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });

      fetchData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }

    setSaving(false);
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
        <h1 className="text-3xl font-bold">Manage Pricing</h1>

        <div className="space-x-4">
          <Button variant="outline" onClick={handleAddPlan}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
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

      <SectionHeaderAdmin sectionKey="pricing" />

      <div className="grid gap-8">
        {plans.map((plan, pIdx) => (
          <Card key={pIdx}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{plan.name || "Unnamed Plan"}</CardTitle>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => handleRemovePlan(pIdx, plan.id)}
              >
                <Trash2 size={18} />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3 items-end">
                <div>
                  <label className="text-sm font-medium">Plan Name</label>

                  <Input
                    value={plan.name}
                    onChange={(e) => {
                      const newPlans = [...plans];
                      newPlans[pIdx].name = e.target.value;
                      setPlans(newPlans);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Price</label>

                  <Input
                    value={plan.price}
                    onChange={(e) => {
                      const newPlans = [...plans];
                      newPlans[pIdx].price = e.target.value;
                      setPlans(newPlans);
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={plan.is_popular}
                    onCheckedChange={(checked) => {
                      const newPlans = [...plans];
                      newPlans[pIdx].is_popular = !!checked;
                      setPlans(newPlans);
                    }}
                  />

                  <label className="text-sm">Popular</label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Features</label>

                {allFeatures
                  .filter((f) => f.pricing_id === plan.id)
                  .map((feature, fIdx) => {
                    const actualIdx = allFeatures.findIndex(
                      (af) => af === feature
                    );

                    return (
                      <div key={fIdx} className="flex gap-2">
                        <Input
                          value={feature.feature}
                          onChange={(e) => {
                            const newFeatures = [...allFeatures];
                            newFeatures[actualIdx].feature =
                              e.target.value;
                            setAllFeatures(newFeatures);
                          }}
                        />

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveFeature(actualIdx, feature.id)
                          }
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    );
                  })}

                {plan.id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddFeature(plan.id!)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingAdmin;