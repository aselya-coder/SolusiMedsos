import { motion } from "framer-motion";
import { MessageSquare, Search, Rocket, BarChart3, CheckCircle } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";

const iconMap: Record<string, any> = {
  MessageSquare,
  Search,
  Rocket,
  BarChart3,
  CheckCircle,
};

interface StepData {
  icon_name: string;
  title: string;
  description: string;
  step_number: number;
}

const HowItWorksSection = () => {
  const { data: steps, loading } = useFetchData<StepData[]>("how_it_works", { orderBy: "display_order" });

  if (loading) return null;

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Cara Kerja</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            Proses yang{" "}
            <span className="gradient-text">Terstruktur</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps?.map((step, i) => {
              const IconComponent = iconMap[step.icon_name] || Search;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center relative"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4 relative z-10">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-2">STEP {step.step_number}</div>
                  <h3 className="font-heading font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
