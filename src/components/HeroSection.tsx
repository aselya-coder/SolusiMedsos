import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useFetchData";

interface HeroData {
  badge_text: string;
  title_part1: string;
  title_gradient: string;
  title_part2: string;
  subtitle: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
  background_image_url?: string;
}

const HeroSection = () => {
  const { data: heroData, loading: heroLoading } = useFetchData<HeroData>("hero_section", { single: true });
  const { data: wsData } = useFetchData<any>("whatsapp_settings", { single: true });

  if (heroLoading) return null;

  const phoneNumber = wsData?.phone_number || "6285646420488";
  const waMessage = encodeURIComponent(`Halo SolusiMedsos, saya ingin konsultasi mengenai campaign.`);
  const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {heroData?.background_image_url && (
          <img src={heroData.background_image_url} alt="" className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="section-container relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              {heroData?.badge_text}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6 text-balance"
          >
            {heroData?.title_part1}{" "}
            <span className="gradient-text">{heroData?.title_gradient}</span>{" "}
            {heroData?.title_part2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            {heroData?.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-8 animate-pulse-glow"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                {heroData?.primary_btn_text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted font-semibold text-base px-8"
            >
              <a href={heroData?.secondary_btn_link}>
                <Play className="mr-2 h-4 w-4" />
                {heroData?.secondary_btn_text}
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-lg"
          >
            <div key="stats-1">
              <div className="text-2xl lg:text-3xl font-heading font-bold gradient-text">10.000+</div>
              <div className="text-sm text-muted-foreground mt-1">Akun Jaringan</div>
            </div>
            <div key="stats-2">
              <div className="text-2xl lg:text-3xl font-heading font-bold gradient-text">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Campaign Sukses</div>
            </div>
            <div key="stats-3">
              <div className="text-2xl lg:text-3xl font-heading font-bold gradient-text">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Klien Terpercaya</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
