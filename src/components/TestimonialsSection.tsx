import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";

// Data default tetap ada di file ini agar tidak terhapus
const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  {
    name: "Direktur Marketing",
    company: "PT. *** Indonesia",
    content: "Campaign yang dijalankan sangat efektif. Engagement naik 300% dalam waktu 1 minggu. Tim sangat profesional dan responsif.",
    rating: 5,
  },
  {
    name: "Tim Sukses",
    company: "Partai ***",
    content: "Strategi buzzer untuk kampanye politik kami berjalan mulus dan terkoordinasi. Elektabilitas kandidat naik signifikan.",
    rating: 5,
  },
  {
    name: "Owner UMKM",
    company: "Brand Fashion Lokal",
    content: "Produk kami viral di TikTok berkat campaign dari tim ini. Penjualan meningkat 5x lipat. Sangat recommended!",
    rating: 5,
  },
  {
    name: "Public Relations",
    company: "Perusahaan BUMN",
    content: "Manajemen opini publik yang sangat terukur. Berhasil meredam isu negatif dan membangun narasi positif.",
    rating: 5,
  },
];

interface TestimonialData {
  name: string;
  company: string;
  content: string;
  rating: number;
}

const TestimonialsSection = () => {
  const { data: allHeaders } = useFetchData<any[]>("section_content");
  const { data: fetchedTestimonials, loading } = useFetchData<TestimonialData[]>("testimonials", { orderBy: "display_order" });

  const header = allHeaders?.find(h => h.section_key === 'testimonials') || {
    badge_text: "Testimoni",
    title_part1: "Dipercaya oleh",
    title_gradient: "Ratusan Klien"
  };

  // Gunakan data dari database jika ada, jika tidak gunakan DEFAULT_TESTIMONIALS
  const displayTestimonials = (fetchedTestimonials && fetchedTestimonials.length > 0) ? fetchedTestimonials : DEFAULT_TESTIMONIALS;

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
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">{header.badge_text}</span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mt-3">
            {header.title_part1}{" "}
            <span className="gradient-text">{header.title_gradient}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {displayTestimonials?.map((t, i) => (
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
