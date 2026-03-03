import { useEffect, useState } from "react";
import { Mail, Instagram, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type FooterRow = {
  id?: number;
  brand_name_part1: string;
  brand_name_part2: string;
  description: string;
  copyright_text: string;
  email: string | null;
  phone: string | null;
  instagram_username: string | null;
};

type FooterLinkRow = { id?: number; label: string; href: string; category: string; display_order: number };

const FooterSection = () => {
  const [footer, setFooter] = useState<FooterRow | null>(null);
  const [links, setLinks] = useState<FooterLinkRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: f } = await supabase.from("footer").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
      const { data: l } = await supabase.from("footer_links").select("*").order("display_order");
      if (f) setFooter(f as FooterRow);
      if (l) setLinks(l as FooterLinkRow[]);
    };
    fetchData();

    const channel = supabase
      .channel("footer-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "footer" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "footer_links" }, () => fetchData())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const navLinks = links.filter((l) => l.category.toLowerCase() === "navigasi");
  const serviceLinks = links.filter((l) => l.category.toLowerCase() === "layanan");
  const navLinksFallback = [
    { label: "Tentang Kami", href: "#about" },
    { label: "Layanan", href: "#services" },
    { label: "Harga", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];
  const serviceLinksFallback = [
    { label: "Buzzer Twitter/X", href: "#" },
    { label: "Buzzer Instagram", href: "#" },
    { label: "Buzzer TikTok", href: "#" },
    { label: "Campaign Politik", href: "#" },
  ];

  return (
    <footer className="border-t border-border py-16">
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="font-heading text-xl font-bold mb-4">
              <span className="gradient-text">{footer?.brand_name_part1 || "Solusi"}</span>
              <span className="text-foreground">{footer?.brand_name_part2 || "Medsos"}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {footer?.description ||
                "Agency jasa buzzer & social media campaign terpercaya di Indonesia. Solusi digital marketing untuk brand, politik, dan personal branding."}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(navLinks.length > 0 ? navLinks : navLinksFallback).map((l, idx) => (
                <li key={`${idx}-${l.label}`}>
                  <a href={l.href} className="hover:text-primary transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(serviceLinks.length > 0 ? serviceLinks : serviceLinksFallback).map((l, idx) => (
                <li key={`${idx}-${l.label}`}>
                  <a href={l.href} className="hover:text-primary transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href="https://wa.me/6285646420488?text=Halo%20SolusiMedsos,%20saya%20ingin%20bertanya%20lebih%20lanjut." target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{footer?.email || "info@solusimedsos.id"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <span>{footer?.instagram_username ? `@${footer.instagram_username}` : "@solusimedsos"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            {footer?.copyright_text ||
              "© 2025 SolusiMedsos. All rights reserved. Disclaimer: Semua layanan yang kami berikan bersifat profesional dan bertanggung jawab."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
