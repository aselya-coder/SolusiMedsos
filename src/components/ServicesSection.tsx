import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useFetchData";

// Data default tetap ada di file ini agar tidak terhapus
const DEFAULT_SERVICES = [
  {
    title: "Jasa Buzzer Twitter (X)",
    description: "Dominasi percakapan di Twitter/X dengan jaringan akun real yang siap mendukung campaign Anda.",
    benefits: ["Trending organik", "Engagement tinggi", "Targeting keyword"],
    cta_text: "Pesan Sekarang",
    cta_link: "#"
  },
  {
    title: "Jasa Buzzer Instagram",
    description: "Tingkatkan visibility brand di Instagram melalui likes, komentar, dan share dari akun berkualitas.",
    benefits: ["Boost engagement", "Real followers", "Story & reels support"],
    cta_text: "Pesan Sekarang",
    cta_link: "#"
  },
  {
    title: "Jasa Buzzer TikTok",
    description: "Viralkan konten TikTok Anda dengan dukungan views, likes, dan komentar dari akun aktif.",
    benefits: ["FYP strategy", "Mass engagement", "Konten viral"],
    cta_text: "Pesan Sekarang",
    cta_link: "#"
  },
  {
    title: "Trending Topic Campaign",
    description: "Buat topik trending secara organik di platform sosial media pilihan Anda.",
    benefits: ["Trending nasional", "Multi-platform", "Real-time monitoring"],
    cta_text: "Pesan Sekarang",
    cta_link: "#"
  },
];

interface ServiceData {
  title: string;
  description: string;
  benefits: string[];
  cta_text: string;
  cta_link: string;
}

interface HeaderData {
  badge_text: string;
  title_part1: string;
  title_gradient: string;
}

const ServicesSection = () => {
  const { data: allHeaders } = useFetchData<any[]>("section_content");
  const { data: fetchedServices, loading } = useFetchData<ServiceData[]>("services", { orderBy: "display_order" });
  const { data: wsData } = useFetchData<any>("whatsapp_settings", { single: true });

  const header = allHeaders?.find(h => h.section_key === 'services') || {
    badge_text: "Layanan Kami",
    title_part1: "Solusi Lengkap untuk",
    title_gradient: "Campaign Digital"
  };

  const phoneNumber = wsData?.phone_number || "6285646420488";

  // Gunakan data dari database jika ada, jika tidak gunakan DEFAULT_SERVICES
  const displayServices = (fetchedServices && fetchedServices.length > 0) ? fetchedServices : DEFAULT_SERVICES;

  if (loading) return null;

  return (
    <section id="services" className="py-20 lg:py-32 bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">{header.badge_text}</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            {header.title_part1}{" "}
            <span className="gradient-text">{header.title_gradient}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices?.map((service, i) => {
            const waMessage = encodeURIComponent(`Halo SolusiMedsos, saya ingin bertanya tentang layanan ${service.title}.`);
            const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-gradient rounded-lg border border-border p-6 flex flex-col hover-lift group"
              >
                <h3 className="font-heading font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.benefits?.map((b) => (
                    <li key={b} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all w-full"
                >
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    {service.cta_text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
