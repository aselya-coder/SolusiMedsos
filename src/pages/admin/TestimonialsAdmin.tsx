import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { SectionHeaderAdmin } from "@/components/admin/SectionHeaderAdmin";

interface TestimonialData {
  id?: number;
  name: string;
  company: string;
  content: string;
  rating: number;
  display_order: number;
}

const TestimonialsAdmin = () => {
  const { toast } = useToast();

  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order");

    if (error) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    }

    if (data) setTestimonials(data);

    setLoading(false);
  };

  const handleAdd = () => {
    setTestimonials([
      ...testimonials,
      {
        name: "",
        company: "",
        content: "",
        rating: 5,
        display_order: testimonials.length + 1,
      },
    ]);
  };

  const handleRemove = async (index: number, id?: number) => {
    try {
      if (id) {
        const { error } = await supabase
          .from("testimonials")
          .delete()
          .eq("id", id);

        if (error) throw error;
      }

      setTestimonials(testimonials.filter((_, i) => i !== index));

    } catch (error: any) {
      toast({
        title: "Delete Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {

      // DATA BARU
      const inserts = testimonials
        .filter((t) => !t.id)
        .map(({ id, ...rest }) => rest);

      // DATA LAMA
      const updates = testimonials.filter((t) => t.id);

      // INSERT DATA BARU
      if (inserts.length > 0) {
        const { error } = await supabase
          .from("testimonials")
          .insert(inserts);

        if (error) throw error;
      }

      // UPDATE DATA LAMA
      for (const item of updates) {
        const { id, ...data } = item;

        const { error } = await supabase
          .from("testimonials")
          .update(data)
          .eq("id", id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Testimonials updated successfully",
      });

      fetchData();

    } catch (error: any) {

      toast({
        title: "Save Error",
        description: error.message,
        variant: "destructive",
      });

    }

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

        <h1 className="text-3xl font-bold">
          Manage Testimonials
        </h1>

        <div className="space-x-4">

          <Button
            variant="outline"
            onClick={handleAdd}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>

          <Button
            onClick={handleSave}
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
      </div>

      <SectionHeaderAdmin sectionKey="testimonials" />

      <div className="grid gap-6">

        {testimonials.map((t, idx) => (
          <Card key={idx}>

            <CardHeader className="flex flex-row items-center justify-between">

              <CardTitle>
                Testimonial #{idx + 1}
              </CardTitle>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => handleRemove(idx, t.id)}
              >
                <Trash2 size={18} />
              </Button>

            </CardHeader>

            <CardContent className="grid gap-4">

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Name
                  </label>

                  <Input
                    value={t.name}
                    onChange={(e) => {
                      const newData = [...testimonials];
                      newData[idx].name = e.target.value;
                      setTestimonials(newData);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Company / Role
                  </label>

                  <Input
                    value={t.company}
                    onChange={(e) => {
                      const newData = [...testimonials];
                      newData[idx].company = e.target.value;
                      setTestimonials(newData);
                    }}
                  />
                </div>

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Content
                </label>

                <Textarea
                  value={t.content}
                  onChange={(e) => {
                    const newData = [...testimonials];
                    newData[idx].content = e.target.value;
                    setTestimonials(newData);
                  }}
                />

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rating (1-5)
                  </label>

                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={t.rating}
                    onChange={(e) => {
                      const newData = [...testimonials];
                      newData[idx].rating = parseInt(e.target.value) || 5;
                      setTestimonials(newData);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Order
                  </label>

                  <Input
                    type="number"
                    value={t.display_order}
                    onChange={(e) => {
                      const newData = [...testimonials];
                      newData[idx].display_order =
                        parseInt(e.target.value) || 1;
                      setTestimonials(newData);
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

export default TestimonialsAdmin;