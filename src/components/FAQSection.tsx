import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFetchData } from "@/hooks/useFetchData";

interface FAQData {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const { data: faqs, loading } = useFetchData<FAQData[]>("faq", { orderBy: "display_order" });

  if (loading) return null;

  return (
    <section id="faq" className="py-20 lg:py-32 bg-muted/30">
      <div className="section-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            Pertanyaan{" "}
            <span className="gradient-text">Umum</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs?.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="card-gradient border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-foreground font-heading font-semibold hover:text-primary text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
