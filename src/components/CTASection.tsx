import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
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
            Siap Membuat Campaign Anda <span className="gradient-text">Viral?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Konsultasikan kebutuhan campaign Anda sekarang juga. Tim kami siap membantu 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 animate-pulse-glow"
            >
              <a href="https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20membuat%20campaign%20viral." target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Hubungi Kami via WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted font-semibold text-lg px-10"
            >
              <a href="https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20konsultasi%20gratis." target="_blank" rel="noopener noreferrer">
                Konsultasi Gratis
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
