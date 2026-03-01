import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useFetchData";

interface PricingData {
  id: number;
  name: string;
  price: string;
  is_popular: boolean;
}

interface FeatureData {
  pricing_id: number;
  feature: string;
}

const PricingSection = () => {
  const { data: plans, loading: pricingLoading } = useFetchData<PricingData[]>("pricing", { orderBy: "display_order" });
  const { data: allFeatures, loading: featuresLoading } = useFetchData<FeatureData[]>("pricing_features", { orderBy: "display_order" });

  if (pricingLoading || featuresLoading) return null;

  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Paket Harga</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            Pilih Paket yang{" "}
            <span className="gradient-text">Sesuai Kebutuhan</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans?.map((plan, i) => {
            const features = allFeatures?.filter(f => f.pricing_id === plan.id) || [];
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card-gradient rounded-lg border p-6 flex flex-col relative ${
                  plan.is_popular ? "border-primary glow-border" : "border-border"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Paling Laris
                  </div>
                )}
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">{plan.name}</h3>
                <div className="text-2xl font-heading font-bold gradient-text mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {f.feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full font-semibold ${
                    plan.is_popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                    Pilih Paket
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
