import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type FooterData = {
  id?: number;
  brand_name: string;
  brand_gradient_text: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  copyright_text: string;
};

type FooterLink = { id?: number; label: string; href: string; category: string; display_order: number };

const FooterSection = () => {
  const [footer, setFooter] = useState<FooterData | null>(null);
  const [links, setLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      const { data } = await supabase.from("footer").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      if (data) setFooter(data);
    };

    const fetchLinks = async () => {
      const { data } = await supabase.from("footer_links").select("*").order("display_order");
      if (data) setLinks(data);
    };

    fetchFooterData();
    fetchLinks();

    const footerSubscription = supabase
      .channel("footer_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "footer" }, (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          setFooter(payload.new as FooterData);
        } else if (payload.eventType === "DELETE") {
          setFooter(null);
        }
      })
      .subscribe();

    const linksSubscription = supabase
      .channel("footer_links_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "footer_links" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setLinks((prev) => [...prev, payload.new as FooterLink].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
        } else if (payload.eventType === "UPDATE") {
          setLinks((prev) =>
            prev.map((link) => (link.id === (payload.new as FooterLink).id ? (payload.new as FooterLink) : link)).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          );
        } else if (payload.eventType === "DELETE") {
          setLinks((prev) => prev.filter((link) => link.id !== (payload.old as FooterLink).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(footerSubscription);
      supabase.removeChannel(linksSubscription);
    };
  }, []);

  const defaultNavLinks = [
    { label: "Beranda", href: "#hero" },
    { label: "Tentang", href: "#about" },
    { label: "Layanan", href: "#services" },
    { label: "Harga", href: "#pricing" },
  ];

  const defaultServiceLinks = [
    { label: "Buzzer Campaign", href: "#services" },
    { label: "Trending Topic", href: "#services" },
    { label: "Manajemen Opini", href: "#services" },
    { label: "Personal Branding", href: "#services" },
  ];

  const navLinks = links.filter((l) => l.category === "Navigasi");
  const serviceLinks = links.filter((l) => l.category === "Layanan");

  const displayedNavLinks = navLinks.length > 0 ? navLinks : defaultNavLinks;
  const displayedServiceLinks = serviceLinks.length > 0 ? serviceLinks : defaultServiceLinks;

  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Desc */}
          <div className="md:col-span-2">
            <a href="#hero" className="font-heading text-2xl font-bold">
              <span className="gradient-text">{footer?.brand_name || "Solusi"}</span>
              <span className="text-foreground">{footer?.brand_gradient_text || "Medsos"}</span>
            </a>
            <p className="text-muted-foreground mt-4 max-w-sm">
              {footer?.description || "Agency buzzer & campaign sosial media terpercaya di Indonesia."}
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {displayedNavLinks.map((l, i) => (
                <li key={l.id || i}>
                  <a href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Layanan</h4>
            <ul className="space-y-2">
              {displayedServiceLinks.map((l, i) => (
                <li key={l.id || i}>
                  <a href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {footer?.copyright_text || "© 2024 SolusiMedsos. All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href={`https://wa.me/${(footer?.phone || "6285646420488").replace(/\D/g, "")}?text=Halo%20SolusiMedsos`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              {footer?.phone || "+62 856-4642-0488"}
            </a>
            <span>|</span>
            <a href={`mailto:${footer?.email || "kontak@solusimedsos.com"}`} className="hover:text-primary">
              {footer?.email || "kontak@solusimedsos.com"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
