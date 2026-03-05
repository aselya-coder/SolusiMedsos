import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface SectionHeaderProps {
  sectionKey: string;
}

interface HeaderData {
  badge_text: string;
  title_part1: string;
  title_gradient: string;
}

export const SectionHeaderAdmin = ({ sectionKey }: SectionHeaderProps) => {

  const { toast } = useToast();

  const [header, setHeader] = useState<HeaderData>({
    badge_text: "",
    title_part1: "",
    title_gradient: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchHeader = useCallback(async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("section_content")
      .select("*")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (error) {

      toast({
        title: "Fetch Error",
        description: error.message,
        variant: "destructive"
      });

    } else if (data) {

      setHeader({
        badge_text: data.badge_text || "",
        title_part1: data.title_part1 || "",
        title_gradient: data.title_gradient || ""
      });

    }

    setLoading(false);

  }, [sectionKey, toast]);

  useEffect(() => {
    fetchHeader();
  }, [fetchHeader]);

  const handleSave = async () => {

    setSaving(true);

    try {

      const payload = {
        section_key: sectionKey,
        badge_text: header.badge_text,
        title_part1: header.title_part1,
        title_gradient: header.title_gradient
      };

      const { error } = await supabase
        .from("section_content")
        .upsert(payload, {
          onConflict: "section_key"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Section header berhasil disimpan"
      });

      fetchHeader();

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      toast({
        title: "Save Error",
        description: message,
        variant: "destructive"
      });

    }

    setSaving(false);

  };

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">

      <CardHeader>
        <CardTitle className="text-lg">
          Section Header (Badge & Title)
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Badge Text
          </label>

          <Input
            value={header.badge_text}
            onChange={(e) =>
              setHeader({
                ...header,
                badge_text: e.target.value
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Title Part 1
          </label>

          <Input
            value={header.title_part1}
            onChange={(e) =>
              setHeader({
                ...header,
                title_part1: e.target.value
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Title Gradient
          </label>

          <Input
            value={header.title_gradient}
            onChange={(e) =>
              setHeader({
                ...header,
                title_gradient: e.target.value
              })
            }
          />
        </div>

        <div className="sm:col-span-3 flex justify-end">

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >

            {saving
              ? <Loader2 className="animate-spin mr-2 h-4 w-4" />
              : <Save className="mr-2 h-4 w-4" />
            }

            Save Header

          </Button>

        </div>

      </CardContent>

    </Card>
  );
};
