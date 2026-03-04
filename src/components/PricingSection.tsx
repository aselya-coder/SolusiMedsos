import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type Plan = {
  id?: number;
  name: string;
  price: string;
  is_popular: boolean;
  display_order: number;
  features: { feature: string }[];
};

const PricingSection = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from("pricing")
        .select("*, features:pricing_features(feature)")
        .order("display_order");
      if (data) setPlans(data as unknown as Plan[]);
    };

    fetchPlans();

    const plansSubscription = supabase
      .channel("pricing_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "pricing" }, fetchPlans)
      .on("postgres_changes", { event: "*", schema: "public", table: "pricing_features" }, fetchPlans)
      .subscribe();

    return () => {
      supabase.removeChannel(plansSubscription);
    };
  }, []);

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
            Pilih Paket yang <span className="gradient-text">Sesuai Kebutuhan</span>
          </h2>
        </motion.div>

        {plans.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id || i}
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
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature.feature}
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
                  <a href={`https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20memesan%20paket%20${encodeURIComponent(plan.name)}.`} target="_blank" rel="noopener noreferrer">
                    Pilih Paket
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Belum ada paket harga yang tersedia.</div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
