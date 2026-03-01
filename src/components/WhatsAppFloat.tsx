import { MessageCircle } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";

interface WhatsAppData {
  phone_number: string;
  default_message: string;
  button_text: string;
}

const WhatsAppFloat = () => {
  const { data: wsData, loading } = useFetchData<WhatsAppData>("whatsapp_settings", { single: true });

  if (loading) return null;

  const waUrl = `https://wa.me/${wsData?.phone_number}?text=${encodeURIComponent(wsData?.default_message || "")}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
    >
      <div className="bg-background border border-border px-4 py-2 rounded-full shadow-xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        <span className="text-sm font-semibold">{wsData?.button_text}</span>
      </div>
      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300 animate-bounce-slow">
        <MessageCircle className="h-7 w-7 fill-white" />
      </div>
    </a>
  );
};

export default WhatsAppFloat;
