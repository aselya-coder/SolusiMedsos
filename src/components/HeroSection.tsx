import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import heroBg from "@/assets/hero-bg.jpg";

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
  background_image_url?: string | null;
};

type HeroStat = {
  id?: number;
  value: string;
  label: string;
  display_order: number;
};

const HeroSection = () => {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [stats, setStats] = useState<HeroStat[]>([]);

  // ================= FETCH HERO =================
  const fetchHero = useCallback(async () => {
    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("HERO FETCH ERROR:", error);
      return;
    }

    setHero(data);
  }, []);

  // ================= FETCH STATS =================
  const fetchStats = useCallback(async () => {
    const { data, error } = await supabase
      .from("hero_stats")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("STATS FETCH ERROR:", error);
      return;
    }

    setStats(data || []);
  }, []);

  // ================= EFFECT =================
  useEffect(() => {
    fetchHero();
    fetchStats();

    const heroChannel = supabase
      .channel("hero_section_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hero_section" },
        () => fetchHero()
      )
      .subscribe();

    const statsChannel = supabase
      .channel("hero_stats_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hero_stats" },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(heroChannel);
      supabase.removeChannel(statsChannel);
    };
  }, [fetchHero, fetchStats]);

  // ================= SAFE IMAGE =================
  const backgroundImage =
    hero?.background_image_url && hero.background_image_url.includes("http")
      ? hero.background_image_url
      : heroBg;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, hsl(var(--background)/0.6), hsl(var(--background)/0.8), hsl(var(--background))), url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "saturate(95%)",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            {hero?.badge_text ||
              "#1 Agency Buzzer Terpercaya di Indonesia"}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6"
          >
            {(hero?.title_part1 || "Solusi Jasa Buzzer &") + " "}
            <span className="gradient-text">
              {hero?.title_gradient || "Campaign Sosial Media"}
            </span>{" "}
            {hero?.title_part2 || "Terpercaya"}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            {hero?.subtitle ||
              "Tingkatkan branding, engagement, dan opini publik dengan strategi digital yang terukur dan aman."}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button asChild size="lg" className="px-8">
              <a
                href={`https://wa.me/6285646420488?text=${encodeURIComponent(
                  `Halo SolusiMedsos, saya ingin ${(
                    hero?.primary_btn_text?.toLowerCase() || "konsultasi"
                  )}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hero?.primary_btn_text ||
                  "Konsultasi Sekarang"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8"
            >
              <a href={hero?.secondary_btn_link || "#pricing"}>
                <Play className="mr-2 h-4 w-4" />
                {hero?.secondary_btn_text ||
                  "Lihat Paket Harga"}
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
                <div key={stat.id}>
                  <div className="text-2xl lg:text-3xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
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
