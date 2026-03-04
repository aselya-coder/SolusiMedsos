import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Target, BarChart3, Users } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  Target,
  Shield,
  BarChart3,
  CheckCircle2,
};

type AboutData = {
  id?: number;
  badge_text: string;
  title_part1: string;
  title_gradient: string;
  description_1: string;
  description_2: string;
  image_url?: string;
};

type Advantage = { id?: number; icon_name: string; text: string; display_order: number };

const AboutSection = () => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [advantages, setAdvantages] = useState<Advantage[]>([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data } = await supabase.from("about_section").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      if (data) setAbout(data);
    };

    const fetchAdvantages = async () => {
      const { data } = await supabase.from("about_advantages").select("*").order("display_order");
      if (data) setAdvantages(data);
    };

    fetchAboutData();
    fetchAdvantages();

    const aboutSubscription = supabase
      .channel("about_section_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "about_section" }, (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          setAbout(payload.new as AboutData);
        } else if (payload.eventType === "DELETE") {
          setAbout(null);
        }
      })
      .subscribe();

    const advantagesSubscription = supabase
      .channel("about_advantages_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "about_advantages" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setAdvantages((prev) => [...prev, payload.new as Advantage].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
        } else if (payload.eventType === "UPDATE") {
          setAdvantages((prev) =>
            prev.map((adv) => (adv.id === (payload.new as Advantage).id ? (payload.new as Advantage) : adv)).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          );
        } else if (payload.eventType === "DELETE") {
          setAdvantages((prev) => prev.filter((adv) => adv.id !== (payload.old as Advantage).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(aboutSubscription);
      supabase.removeChannel(advantagesSubscription);
    };
  }, []);

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{about?.badge_text || "Tentang Kami"}</span>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3 mb-6">
              {(about?.title_part1 || "Agency Buzzer") + " "}
              <span className="gradient-text">{about?.title_gradient || "Profesional"}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {about?.description_1 ||
                "Kami adalah agency jasa buzzer profesional yang berpengalaman menangani campaign politik, brand awareness, UMKM, dan personal branding. Dengan jaringan akun real & aktif serta strategi organik yang sistematis, kami memastikan setiap campaign berjalan efektif dan terukur."}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {about?.description_2 ||
                "Didukung oleh tim strategis berpengalaman dan teknologi monitoring terkini, kami membantu klien mencapai tujuan digital mereka dengan cara yang aman dan profesional."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {advantages.map((item, i) => {
              const Icon = iconMap[item.icon_name] || CheckCircle2;
              return (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="card-gradient rounded-lg p-6 border border-border hover-lift"
                >
                  <Icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-heading font-semibold text-foreground">{item.text}</h3>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
