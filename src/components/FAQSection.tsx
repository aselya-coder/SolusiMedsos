import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/lib/supabaseClient";

type FAQRow = { id?: number; question: string; answer: string; display_order: number };

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("faq").select("*").order("display_order").limit(4);
      if (data) setFaqs(data as FAQRow[]);
    };
    fetchData();

    const channel = supabase
      .channel("faq-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "faq" }, () => fetchData())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
            Pertanyaan <span className="gradient-text">Umum</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {faqs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Belum ada FAQ</div>
          ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={`${faq.id ?? i}`}
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
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
