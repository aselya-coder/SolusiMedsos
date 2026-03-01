import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useFetchData";

interface CTAData {
  title_part1: string;
  title_gradient: string;
  description: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
}

const CTASection = () => {
  const { data: ctaData, loading } = useFetchData<CTAData>("cta_section", { single: true });

  if (loading) return null;

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
            {ctaData?.title_part1}{" "}
            <span className="gradient-text">{ctaData?.title_gradient}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {ctaData?.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 animate-pulse-glow"
            >
              <a href={ctaData?.primary_btn_link} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                {ctaData?.primary_btn_text}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted font-semibold text-lg px-10"
            >
              <a href={ctaData?.secondary_btn_link} target="_blank" rel="noopener noreferrer">
                {ctaData?.secondary_btn_text}
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
