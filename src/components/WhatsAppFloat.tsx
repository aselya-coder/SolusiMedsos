import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type WhatsAppSettings = {
  id?: number;
  phone_number: string;
  default_message: string;
  is_active: boolean;
};

const WhatsAppFloat = () => {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("whatsapp_settings")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (data) setSettings(data);
    };

    fetchSettings();

    const settingsSubscription = supabase
      .channel("whatsapp_settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_settings" }, (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          setSettings(payload.new as WhatsAppSettings);
        } else if (payload.eventType === "DELETE") {
          setSettings(null);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(settingsSubscription);
    };
  }, []);

  if (!settings?.is_active) return null;

  const phoneNumber = (settings?.phone_number || "6285646420488").replace(/\D/g, "");
  const message = encodeURIComponent(settings?.default_message || "Halo SolusiMedsos, saya ingin bertanya lebih lanjut.");

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
};

export default WhatsAppFloat;
