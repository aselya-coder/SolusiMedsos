import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Jasa Buzzer Twitter (X)",
    desc: "Dominasi percakapan di Twitter/X dengan jaringan akun real yang siap mendukung campaign Anda.",
    benefits: ["Trending organik", "Engagement tinggi", "Targeting keyword"],
  },
  {
    title: "Jasa Buzzer Instagram",
    desc: "Tingkatkan visibility brand di Instagram melalui likes, komentar, dan share dari akun berkualitas.",
    benefits: ["Boost engagement", "Real followers", "Story & reels support"],
  },
  {
    title: "Jasa Buzzer TikTok",
    desc: "Viralkan konten TikTok Anda dengan dukungan views, likes, dan komentar dari akun aktif.",
    benefits: ["FYP strategy", "Mass engagement", "Konten viral"],
  },
  {
    title: "Trending Topic Campaign",
    desc: "Buat topik trending secara organik di platform sosial media pilihan Anda.",
    benefits: ["Trending nasional", "Multi-platform", "Real-time monitoring"],
  },
  {
    title: "Viral Marketing",
    desc: "Strategi pemasaran viral yang dirancang untuk memaksimalkan jangkauan brand Anda.",
    benefits: ["Content seeding", "Influencer network", "Amplifikasi masif"],
  },
  {
    title: "Personal Branding",
    desc: "Bangun citra personal yang kuat dan konsisten di seluruh platform digital.",
    benefits: ["Konsistensi citra", "Thought leadership", "Media handling"],
  },
  {
    title: "Manajemen Opini Publik",
    desc: "Kelola dan arahkan narasi publik untuk melindungi reputasi dan citra brand Anda.",
    benefits: ["Sentiment control", "Counter narasi", "Crisis management"],
  },
  {
    title: "Campaign Politik",
    desc: "Dukungan campaign politik yang strategis, terukur, dan berpengalaman di pemilu Indonesia.",
    benefits: ["Ground game digital", "Elektabilitas", "Survey & monitoring"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 lg:py-32 bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Layanan Kami</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            Solusi Lengkap untuk <span className="gradient-text">Campaign Digital</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
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
                {service.desc}
              </p>
              <ul className="space-y-2 mb-6">
                {service.benefits.map((b) => (
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
                <a href={`https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20bertanya%20tentang%20layanan%20${encodeURIComponent(service.title)}.`} target="_blank" rel="noopener noreferrer">
                  Pesan Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
