import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";

interface TestimonialData {
  name: string;
  company: string;
  content: string;
  rating: number;
}

const TestimonialsSection = () => {
  const { data: testimonials, loading } = useFetchData<TestimonialData[]>("testimonials", { orderBy: "display_order" });

  if (loading) return null;

  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimoni</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            Dipercaya oleh{" "}
            <span className="gradient-text">Ratusan Klien</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials?.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-gradient rounded-lg border border-border p-6 hover-lift"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-foreground mb-6 leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="font-heading font-semibold text-foreground">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.company}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
