import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFetchData } from "@/hooks/useFetchData";

// Data default tetap ada di file ini agar tidak terhapus
const DEFAULT_FAQS: FAQData[] = [
  {
    question: "Apakah akun yang digunakan real?",
    answer: "Ya, semua akun yang kami gunakan adalah akun real dan aktif. Kami tidak menggunakan bot sehingga engagement yang dihasilkan terlihat natural dan organik.",
  },
  {
    question: "Apakah aman dan rahasia?",
    answer: "Keamanan dan kerahasiaan klien adalah prioritas utama kami. Kami siap menandatangani NDA dan semua data campaign dijaga kerahasiaannya.",
  },
  {
    question: "Apakah bisa custom campaign?",
    answer: "Tentu! Kami menyediakan paket custom yang bisa disesuaikan dengan kebutuhan, budget, dan target spesifik Anda.",
  },
  {
    question: "Berapa lama hasil terlihat?",
    answer: "Hasil bisa terlihat dalam 1-3 hari setelah campaign dimulai, tergantung skala dan jenis campaign yang dipilih.",
  },
];

interface FAQData {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const { data: allHeaders } = useFetchData<any[]>("section_content");
  const { data: fetchedFaqs, loading } = useFetchData<FAQData[]>("faq", { orderBy: "display_order" });

  const header = allHeaders?.find(h => h.section_key === 'faq') || {
    badge_text: "FAQ",
    title_part1: "Pertanyaan",
    title_gradient: "Umum"
  };

  // Gunakan data dari database jika ada, jika tidak gunakan DEFAULT_FAQS
  const displayFaqs = (fetchedFaqs && fetchedFaqs.length > 0) ? fetchedFaqs : DEFAULT_FAQS;

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
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">{header.badge_text}</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            {header.title_part1}{" "}
            <span className="gradient-text">{header.title_gradient}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {displayFaqs.map((faq, i) => (
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
