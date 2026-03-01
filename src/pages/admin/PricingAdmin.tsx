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
    const { data: plansData } = await supabase.from("pricing").select("*").order("display_order");
    if (plansData) setPlans(plansData);

    const { data: featuresData } = await supabase.from("pricing_features").select("*").order("display_order");
    if (featuresData) setAllFeatures(featuresData);
    setLoading(false);
  };

  const handleAddPlan = () => {
    setPlans([...plans, { name: "", price: "", is_popular: false, display_order: plans.length + 1 }]);
  };

  const handleRemovePlan = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase.from("pricing").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    setPlans(plans.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error: plansError } = await supabase.from("pricing").upsert(plans);
    const { error: featuresError } = await supabase.from("pricing_features").upsert(allFeatures);

    if (plansError || featuresError) {
      toast({ title: "Error", description: (plansError || featuresError)?.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Pricing updated" });
      fetchData();
    }
    setSaving(false);
  };

  const handleAddFeature = (pricingId: number) => {
    setAllFeatures([...allFeatures, { pricing_id: pricingId, feature: "", display_order: allFeatures.filter(f => f.pricing_id === pricingId).length + 1 }]);
  };

  const handleRemoveFeature = async (idx: number, id?: number) => {
    if (id) {
      await supabase.from("pricing_features").delete().eq("id", id);
    }
    setAllFeatures(allFeatures.filter((_, i) => i !== idx));
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Pricing</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleAddPlan}><Plus className="mr-2 h-4 w-4" /> Add Plan</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
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
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemovePlan(pIdx, plan.id)}>
                <Trash2 size={18} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3 items-end">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Label</label>
                  <Input 
                    value={plan.price} 
                    onChange={(e) => {
                      const newPlans = [...plans];
                      newPlans[pIdx].price = e.target.value;
                      setPlans(newPlans);
                    }} 
                  />
                </div>
                <div className="flex items-center space-x-2 pb-3">
                  <Checkbox 
                    id={`pop-${pIdx}`} 
                    checked={plan.is_popular} 
                    onCheckedChange={(checked) => {
                      const newPlans = [...plans];
                      newPlans[pIdx].is_popular = !!checked;
                      setPlans(newPlans);
                    }}
                  />
                  <label htmlFor={`pop-${pIdx}`} className="text-sm font-medium">Popular / Best Seller</label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Features</label>
                  {plan.id && (
                    <Button variant="ghost" size="sm" onClick={() => handleAddFeature(plan.id!)}>
                      <Plus className="h-4 w-4 mr-1" /> Add Feature
                    </Button>
                  )}
                </div>
                <div className="grid gap-2">
                  {!plan.id && <p className="text-xs text-muted-foreground italic">Save plan first to add features.</p>}
                  {allFeatures.filter(f => f.pricing_id === plan.id).map((feature, fIdx) => {
                    const actualIdx = allFeatures.findIndex(af => af === feature);
                    return (
                      <div key={fIdx} className="flex gap-2">
                        <Input 
                          value={feature.feature} 
                          onChange={(e) => {
                            const newFeatures = [...allFeatures];
                            newFeatures[actualIdx].feature = e.target.value;
                            setAllFeatures(newFeatures);
                          }} 
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(actualIdx, feature.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingAdmin;
