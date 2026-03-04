import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/lib/supabaseClient";

type FAQ = {
  id?: number;
  question: string;
  answer: string;
  display_order: number;
};

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase.from("faq").select("*").order("display_order").limit(4);
      if (data) setFaqs(data);
    };

    fetchFaqs();

    const faqsSubscription = supabase
      .channel("faq_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "faq" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setFaqs((prev) => [...prev, payload.new as FAQ].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).slice(0, 4));
        } else if (payload.eventType === "UPDATE") {
          setFaqs((prev) =>
            prev.map((faq) => (faq.id === (payload.new as FAQ).id ? (payload.new as FAQ) : faq)).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).slice(0, 4)
          );
        } else if (payload.eventType === "DELETE") {
          setFaqs((prev) => prev.filter((faq) => faq.id !== (payload.old as FAQ).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(faqsSubscription);
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

        {faqs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.id || i}
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
        ) : (
          <div className="text-center text-muted-foreground">Belum ada FAQ yang tersedia.</div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
