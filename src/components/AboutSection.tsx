import { motion } from "framer-motion";
import { CheckCircle2, Shield, Target, BarChart3, Users } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";

const iconMap: Record<string, any> = {
  Users,
  Target,
  Shield,
  BarChart3,
  CheckCircle2,
};

interface AboutData {
  badge_text: string;
  title_part1: string;
  title_gradient: string;
  description_1: string;
  description_2: string;
  image_url?: string;
}

interface AdvantageData {
  icon_name: string;
  text: string;
}

const AboutSection = () => {
  const { data: aboutData, loading: aboutLoading } = useFetchData<AboutData>("about_section", { single: true });
  const { data: advantages, loading: advantagesLoading } = useFetchData<AdvantageData[]>("about_advantages", { orderBy: "display_order" });

  if (aboutLoading || advantagesLoading) return null;

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{aboutData?.badge_text}</span>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3 mb-6">
              {aboutData?.title_part1}{" "}
              <span className="gradient-text">{aboutData?.title_gradient}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {aboutData?.description_1}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {aboutData?.description_2}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {advantages?.map((item, i) => {
              const IconComponent = iconMap[item.icon_name] || Users;
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="card-gradient rounded-lg p-6 border border-border hover-lift"
                >
                  <IconComponent className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-heading font-semibold text-foreground">{item.text}</h3>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
