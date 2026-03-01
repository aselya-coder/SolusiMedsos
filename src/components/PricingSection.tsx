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
  const { data: allHeaders } = useFetchData<any[]>("section_content");
  const { data: plans, loading: pricingLoading } = useFetchData<PricingData[]>("pricing", { orderBy: "display_order" });
  const { data: allFeatures, loading: featuresLoading } = useFetchData<FeatureData[]>("pricing_features", { orderBy: "display_order" });
  const { data: wsData } = useFetchData<any>("whatsapp_settings", { single: true });

  if (pricingLoading || featuresLoading) return null;

  const header = allHeaders?.find(h => h.section_key === 'pricing');
  const phoneNumber = wsData?.phone_number || "6285646420488";

  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">{header?.badge_text}</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            {header?.title_part1}{" "}
            <span className="gradient-text">{header?.title_gradient}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans?.map((plan, i) => {
            const features = allFeatures?.filter(f => f.pricing_id === plan.id) || [];
            const waMessage = encodeURIComponent(`Halo SolusiMedsos, saya ingin memesan paket ${plan.name}.`);
            const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

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
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
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
