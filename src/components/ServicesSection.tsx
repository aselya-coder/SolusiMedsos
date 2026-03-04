import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type Service = {
  id?: number;
  title: string;
  description: string;
  benefits: string[];
  cta_text: string;
  cta_link: string;
  display_order: number;
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialServices = async () => {
      setLoading(true);
      const { data } = await supabase.from("services").select("*").order("display_order");
      if (data) {
        setServices(data as Service[]);
      }
      setLoading(false);
    };

    fetchInitialServices();

    const channel = supabase
      .channel("services-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setServices((prev) => [...prev, payload.new as Service].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
        } else if (payload.eventType === "UPDATE") {
          setServices((prev) =>
            prev.map((service) => (service.id === (payload.new as Service).id ? (payload.new as Service) : service)).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          );
        } else if (payload.eventType === "DELETE") {
          setServices((prev) => prev.filter((service) => service.id !== (payload.old as Service).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">Memuat layanan...</div>
        ) : services.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">Belum ada layanan tersedia</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={`${service.id ?? service.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-gradient rounded-lg border border-border p-6 flex flex-col hover-lift group"
              >
                <h3 className="font-heading font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title || "Layanan"}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {(service.benefits || []).map((b, idx) => (
                    <li key={`${idx}-${b}`} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {b || `Benefit ${idx + 1}`}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all w-full"
                >
                  <a href={`https://wa.me/6285646420488?text=${encodeURIComponent(`Halo SolusiMedsos, saya ingin bertanya tentang layanan ${service.title}`)}`} target="_blank" rel="noopener noreferrer">
                    {service.cta_text || "Pesan Sekarang"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
