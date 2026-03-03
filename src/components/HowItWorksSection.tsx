import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type StepRow = {
  id?: number;
  icon_name: string;
  title: string;
  description: string;
  step_number: number;
  display_order: number;
};

const HowItWorksSection = () => {
  const [steps, setSteps] = useState<StepRow[]>([]);

  useEffect(() => {
    const fetchSteps = async () => {
      const { data } = await supabase.from("how_it_works").select("*").order("display_order");
      if (data) setSteps(data as StepRow[]);
    };
    fetchSteps();

    const channel = supabase
      .channel("howitworks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "how_it_works" }, () => fetchSteps())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
            Proses yang <span className="gradient-text">Terstruktur</span>
          </h2>
        </motion.div>

        {steps.length > 0 ? (
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={`${step.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4 relative z-10">
                  <CheckCircle className="h-7 w-7 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
                <h3 className="font-heading font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">Belum ada langkah yang ditampilkan</div>
        )}
      </div>
    </section>
  );
};

export default HowItWorksSection;
