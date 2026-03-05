import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type CtaData = {
  id?: number;
  title_part1: string;
  title_gradient: string;
  description: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
};

const CTASection = () => {
  const [cta, setCta] = useState<CtaData | null>(null);

  useEffect(() => {
    const fetchCtaData = async () => {
      const { data } = await supabase.from("cta_section").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      if (data) setCta(data);
    };

    fetchCtaData();

    const ctaSubscription = supabase
      .channel("cta_section_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "cta_section" }, (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          setCta(payload.new as CtaData);
        } else if (payload.eventType === "DELETE") {
          setCta(null);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ctaSubscription);
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
              <a href={`https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20${encodeURIComponent(cta?.primary_btn_text?.toLowerCase() || 'membuat campaign viral')}`} target="_blank" rel="noopener noreferrer">
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
              <a href={`https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20${encodeURIComponent(cta?.secondary_btn_text?.toLowerCase() || 'konsultasi')}`} target="_blank" rel="noopener noreferrer">
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
