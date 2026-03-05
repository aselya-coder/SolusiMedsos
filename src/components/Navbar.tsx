import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type NavLinkData = {
  id?: number;
  label: string;
  href: string;
  display_order: number;
};

type NavbarData = {
  id?: number;
  brand_name: string;
  brand_gradient_text: string;
  cta_text: string;
  cta_link: string;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);
  const [navLinks, setNavLinks] = useState<NavLinkData[]>([]);

  useEffect(() => {
    const fetchNavbarData = async () => {
      const { data } = await supabase.from("navbar").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      if (data) setNavbarData(data);
    };

    const fetchNavLinks = async () => {
      const { data } = await supabase.from("nav_links").select("*").order("display_order");
      if (data) setNavLinks(data);
    };

    fetchNavbarData();
    fetchNavLinks();

    const navbarSubscription = supabase
      .channel("navbar_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "navbar" }, (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          setNavbarData(payload.new as NavbarData);
        } else if (payload.eventType === "DELETE") {
          setNavbarData(null);
        }
      })
      .subscribe();

    const navLinksSubscription = supabase
      .channel("nav_links_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "nav_links" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setNavLinks((prev) => [...prev, payload.new as NavLinkData].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
        } else if (payload.eventType === "UPDATE") {
          setNavLinks((prev) =>
            prev.map((link) => (link.id === (payload.new as NavLinkData).id ? (payload.new as NavLinkData) : link)).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          );
        } else if (payload.eventType === "DELETE") {
          setNavLinks((prev) => prev.filter((link) => link.id !== (payload.old as NavLinkData).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(navbarSubscription);
      supabase.removeChannel(navLinksSubscription);
    };
  }, []);

  const defaultNavLinks = [
    { label: "Beranda", href: "#hero" },
    { label: "Tentang", href: "#about" },
    { label: "Layanan", href: "#services" },
    { label: "Harga", href: "#pricing" },
    { label: "Cara Kerja", href: "#how-it-works" },
    { label: "Testimoni", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  const displayedNavLinks = navLinks.length > 0 ? navLinks : defaultNavLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="section-container flex items-center justify-between h-16 lg:h-20">
        <a href="#hero" className="font-heading text-xl lg:text-2xl font-bold">
          <span className="gradient-text">{navbarData?.brand_name || "Solusi"}</span>
          <span className="text-foreground">{navbarData?.brand_gradient_text || "Medsos"}</span>
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {displayedNavLinks.map((link, i) => (
            <a
              key={`${link.href}-${i}`}
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
            <a href={navbarData?.cta_link || "https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20konsultasi."} target="_blank" rel="noopener noreferrer">
              {navbarData?.cta_text || "Konsultasi Gratis"}
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="section-container py-4 flex flex-col gap-4">
              {displayedNavLinks.map((link, i) => (
                <a
                  key={`${link.href}-${i}`}
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
                <a href={navbarData?.cta_link || "https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20konsultasi%20gratis."} target="_blank" rel="noopener noreferrer">
                  {navbarData?.cta_text || "Konsultasi Gratis"}
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
