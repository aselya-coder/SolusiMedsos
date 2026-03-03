import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

const WhatsAppFloat = () => {
  const [phone, setPhone] = useState<string>("6281234567890");
  const [message, setMessage] = useState<string>("Halo SolusiMedsos, saya butuh bantuan.");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("whatsapp_settings").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      if (data?.phone_number) setPhone(data.phone_number);
      if (data?.default_message) setMessage(data.default_message);
    };
    fetchData();

    const channel = supabase
      .channel("whatsapp-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_settings" }, () => fetchData())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const waUrl = `https://wa.me/6285646420488?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full p-4 shadow-lg transition-colors flex items-center gap-2 group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      aria-label="Chat WhatsApp"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium text-sm">
        Butuh Bantuan?
      </span>
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
};

export default WhatsAppFloat;
