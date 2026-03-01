import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { SectionHeaderAdmin } from "@/components/admin/SectionHeaderAdmin";

interface StepData {
  id?: number;
  icon_name: string;
  title: string;
  description: string;
  step_number: number;
  display_order: number;
}

const HowItWorksAdmin = () => {
  const { toast } = useToast();
  const [steps, setSteps] = useState<StepData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("how_it_works").select("*").order("display_order");
    if (data) setSteps(data);
    setLoading(false);
  };

  const handleAddStep = () => {
    setSteps([...steps, { 
      icon_name: "Search", 
      title: "", 
      description: "", 
      step_number: steps.length + 1, 
      display_order: steps.length + 1 
    }]);
  };

  const handleRemoveStep = async (index: number, id?: number) => {
    if (id) {
      const { error } = await supabase.from("how_it_works").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("how_it_works").upsert(steps);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Steps updated" });
      fetchData();
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage How It Works</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleAddStep}><Plus className="mr-2 h-4 w-4" /> Add Step</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save All Changes
          </Button>
        </div>
      </div>

      <SectionHeaderAdmin sectionKey="how_it_works" />

      <div className="grid gap-6">
        {steps.map((step, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Step #{step.step_number}</CardTitle>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveStep(idx, step.id)}>
                <Trash2 size={18} />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon Name (Lucide)</label>
                <Input 
                  value={step.icon_name} 
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[idx].icon_name = e.target.value;
                    setSteps(newSteps);
                  }} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Step Number</label>
                <Input 
                  type="number"
                  value={step.step_number} 
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[idx].step_number = parseInt(e.target.value);
                    setSteps(newSteps);
                  }} 
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={step.title} 
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[idx].title = e.target.value;
                    setSteps(newSteps);
                  }} 
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={step.description} 
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[idx].description = e.target.value;
                    setSteps(newSteps);
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksAdmin;
