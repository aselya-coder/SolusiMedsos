import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface WhatsAppData {
  id?: number;
  phone_number: string;
  default_message: string;
  button_text: string;
}

const WhatsAppAdmin = () => {
  const { toast } = useToast();

  const [wsData, setWsData] = useState<WhatsAppData>({
    phone_number: "",
    default_message: "",
    button_text: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("whatsapp_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
    }

    if (data) {
      setWsData(data);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    // hapus id supaya tidak error identity column
    const { id, ...dataWithoutId } = wsData;

    const { error } = await supabase
      .from("whatsapp_settings")
      .upsert(dataWithoutId);

    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "WhatsApp settings updated"
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
        <h1 className="text-3xl font-bold">Manage WhatsApp</h1>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save className="mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Settings</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Phone Number (e.g. 628...)
            </label>

            <Input
              value={wsData.phone_number}
              onChange={(e) =>
                setWsData({
                  ...wsData,
                  phone_number: e.target.value
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Message</label>

            <Input
              value={wsData.default_message}
              onChange={(e) =>
                setWsData({
                  ...wsData,
                  default_message: e.target.value
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Float Button Text</label>

            <Input
              value={wsData.button_text}
              onChange={(e) =>
                setWsData({
                  ...wsData,
                  button_text: e.target.value
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppAdmin;