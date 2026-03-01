import { motion } from "framer-motion";
import { CheckCircle2, Shield, Target, BarChart3, Users } from "lucide-react";

const advantages = [
  { icon: Users, text: "Akun Real & Aktif" },
  { icon: Target, text: "Targeting Sesuai Segmentasi" },
  { icon: Shield, text: "Aman & Rahasia" },
  { icon: BarChart3, text: "Reporting Transparan" },
];

const AboutSection = () => {
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
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Tentang Kami</span>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3 mb-6">
              Agency Buzzer{" "}
              <span className="gradient-text">Profesional</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Kami adalah agency jasa buzzer profesional yang berpengalaman menangani campaign politik, brand awareness, UMKM, dan personal branding. Dengan jaringan akun real & aktif serta strategi organik yang sistematis, kami memastikan setiap campaign berjalan efektif dan terukur.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Didukung oleh tim strategis berpengalaman dan teknologi monitoring terkini, kami membantu klien mencapai tujuan digital mereka dengan cara yang aman dan profesional.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {advantages.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="card-gradient rounded-lg p-6 border border-border hover-lift"
              >
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold text-foreground">{item.text}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
