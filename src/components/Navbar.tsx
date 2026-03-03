import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type NavbarRow = {
  id?: number;
  brand_name: string;
  brand_gradient_text: string;
  cta_text: string;
  cta_link: string;
};

type NavLinkRow = {
  id?: number;
  label: string;
  href: string;
  display_order: number;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navbar, setNavbar] = useState<NavbarRow | null>(null);
  const [links, setLinks] = useState<NavLinkRow[]>([]);
  const defaultLinks: NavLinkRow[] = [
    { label: "Beranda", href: "#hero", display_order: 1 },
    { label: "Tentang", href: "#about", display_order: 2 },
    { label: "Layanan", href: "#services", display_order: 3 },
    { label: "Harga", href: "#pricing", display_order: 4 },
    { label: "Cara Kerja", href: "#how-it-works", display_order: 5 },
    { label: "Testimoni", href: "#testimonials", display_order: 6 },
    { label: "FAQ", href: "#faq", display_order: 7 },
  ];

  const fetchData = async () => {
    const { data: navData } = await supabase.from("navbar").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
    const { data: linksData } = await supabase.from("nav_links").select("*").order("display_order");
    if (navData) setNavbar(navData as NavbarRow);
    if (linksData) setLinks(linksData as NavLinkRow[]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("navbar-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "navbar" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "nav_links" }, () => fetchData())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="section-container flex items-center justify-between h-16 lg:h-20">
        <a href="#hero" className="font-heading text-xl lg:text-2xl font-bold">
          <span className="gradient-text">{navbar?.brand_name ?? "Solusi"}</span>
          <span className="text-foreground">{navbar?.brand_gradient_text ?? "Medsos"}</span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {(links.length > 0 ? links : defaultLinks).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <a href={`https://wa.me/6285646420488?text=${encodeURIComponent(navbar?.cta_text ? `Halo SolusiMedsos, saya ingin ${navbar.cta_text.toLowerCase()}` : "Halo SolusiMedsos, saya ingin konsultasi")}`} target="_blank" rel="noopener noreferrer">
              {navbar?.cta_text || "Konsultasi Gratis"}
            </a>
          </Button>
        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="section-container py-4 flex flex-col gap-4">
              {(links.length > 0 ? links : defaultLinks).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full"
              >
                <a href={(navbar?.cta_link || "https://wa.me/6281234567890")} target="_blank" rel="noopener noreferrer">
                  {navbar?.cta_text || "Konsultasi Gratis"}
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
