import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useFetchData } from "@/hooks/useFetchData";

interface WhatsAppData {
  phone_number: string;
  default_message: string;
  button_text: string;
}

const WhatsAppFloat = () => {
  const { data: wsData, loading } = useFetchData<WhatsAppData>("whatsapp_settings", { single: true });

  if (loading) return null;

  const phoneNumber = wsData?.phone_number || "6285646420488";
  const waMessage = encodeURIComponent(wsData?.default_message || "Halo SolusiMedsos, saya butuh bantuan.");
  const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

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
        {wsData?.button_text || "Butuh Bantuan?"}
      </span>
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
};

export default WhatsAppFloat;
