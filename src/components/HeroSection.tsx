import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type HeroData = {
  id?: number;
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
};

type HeroStat = { id?: number; value: string; label: string; display_order: number };

const HeroSection = () => {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [stats, setStats] = useState<HeroStat[]>([]);

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data } = await supabase.from("hero_section").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      if (data) setHero(data);
    };

    const fetchStats = async () => {
      const { data } = await supabase.from("hero_stats").select("*").order("display_order");
      if (data) setStats(data);
    };

    fetchHeroData();
    fetchStats();

    const heroSubscription = supabase
      .channel("hero_section_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "hero_section" }, (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          setHero(payload.new as HeroData);
        } else if (payload.eventType === "DELETE") {
          setHero(null);
        }
      })
      .subscribe();

    const statsSubscription = supabase
      .channel("hero_stats_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "hero_stats" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setStats((prev) => [...prev, payload.new as HeroStat].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
        } else if (payload.eventType === "UPDATE") {
          setStats((prev) =>
            prev.map((stat) => (stat.id === (payload.new as HeroStat).id ? (payload.new as HeroStat) : stat)).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          );
        } else if (payload.eventType === "DELETE") {
          setStats((prev) => prev.filter((stat) => stat.id !== (payload.old as HeroStat).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(heroSubscription);
      supabase.removeChannel(statsSubscription);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={hero?.background_image_url || "/hero-bg.jpg"} alt="" className="w-full h-full object-cover opacity-40" />
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
              {hero?.badge_text || "#1 Agency Buzzer Terpercaya di Indonesia"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6 text-balance"
          >
            {(hero?.title_part1 || "Solusi Jasa Buzzer &") + " "}
            <span className="gradient-text">{hero?.title_gradient || "Campaign Sosial Media"}</span>{" "}
            {hero?.title_part2 || "Terpercaya"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            {hero?.subtitle || "Tingkatkan branding, engagement, dan opini publik dengan strategi digital yang terukur dan aman."}
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
              <a href={hero?.primary_btn_link || "https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20konsultasi%20mengenai%20campaign."} target="_blank" rel="noopener noreferrer">
                {hero?.primary_btn_text || "Konsultasi Sekarang"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted font-semibold text-base px-8"
            >
              <a href={hero?.secondary_btn_link || "#pricing"}>
                <Play className="mr-2 h-4 w-4" />
                {hero?.secondary_btn_text || "Lihat Paket Harga"}
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 max-w-lg"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl lg:text-3xl font-heading font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
