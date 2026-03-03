import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const CTASection = () => {
  const [cta, setCta] = useState<{
    title_part1: string;
    title_gradient: string;
    description: string;
    primary_btn_text: string;
    primary_btn_link: string;
    secondary_btn_text: string;
    secondary_btn_link: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("cta_section").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      if (data) {
        setCta({
          title_part1: data.title_part1,
          title_gradient: data.title_gradient,
          description: data.description,
          primary_btn_text: data.primary_btn_text,
          primary_btn_link: data.primary_btn_link,
          secondary_btn_text: data.secondary_btn_text,
          secondary_btn_link: data.secondary_btn_link,
        });
      }
    };
    fetchData();

    const channel = supabase
      .channel("cta-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "cta_section" }, () => fetchData())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-6xl font-heading font-bold mb-6">
            {(cta?.title_part1 || "Siap Membuat Campaign Anda") + " "}
            <span className="gradient-text">{cta?.title_gradient || "Viral?"}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {cta?.description || "Konsultasikan kebutuhan campaign Anda sekarang juga. Tim kami siap membantu 24/7."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 animate-pulse-glow"
            >
              <a href={`https://wa.me/6285646420488?text=${encodeURIComponent(cta?.primary_btn_text ? `Halo SolusiMedsos, saya ingin ${cta.primary_btn_text.toLowerCase()}` : "Halo SolusiMedsos, saya ingin membuat campaign viral.")}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                {cta?.primary_btn_text || "Hubungi Kami via WhatsApp"}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted font-semibold text-lg px-10"
            >
              <a href={`https://wa.me/6285646420488?text=${encodeURIComponent(cta?.secondary_btn_text ? `Halo SolusiMedsos, saya ingin ${cta.secondary_btn_text.toLowerCase()}` : "Halo SolusiMedsos, saya ingin konsultasi.")}`} target="_blank" rel="noopener noreferrer">
                {cta?.secondary_btn_text || "Konsultasi Gratis"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
