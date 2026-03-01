import { Mail, Instagram, MessageCircle } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";

interface FooterData {
  brand_name_part1: string;
  brand_name_part2: string;
  description: string;
  copyright_text: string;
  email: string;
  phone: string;
  instagram_username: string;
}

interface FooterLinkData {
  label: string;
  href: string;
  category: string;
}

const FooterSection = () => {
  const { data: footerData, loading: footerLoading } = useFetchData<FooterData>("footer", { single: true });
  const { data: footerLinks, loading: linksLoading } = useFetchData<FooterLinkData[]>("footer_links", { orderBy: "display_order" });
  const { data: wsData } = useFetchData<any>("whatsapp_settings", { single: true });

  if (footerLoading || linksLoading) return null;

  const navigasiLinks = footerLinks?.filter(l => l.category === 'Navigasi') || [];
  const layananLinks = footerLinks?.filter(l => l.category === 'Layanan') || [];
  
  const phoneNumber = wsData?.phone_number || "6285646420488";
  const waMessage = encodeURIComponent(`Halo SolusiMedsos, saya butuh bantuan.`);
  const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

  return (
    <footer className="border-t border-border py-16">
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="font-heading text-xl font-bold mb-4">
              <span className="gradient-text">{footerData?.brand_name_part1}</span>
              <span className="text-foreground">{footerData?.brand_name_part2}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {footerData?.description}
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navigasiLinks.map((link, idx) => (
                <li key={idx}><a href={link.href} className="hover:text-primary transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {layananLinks.map((link, idx) => (
                <li key={idx}><a href={link.href} className="hover:text-primary transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{footerData?.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <span>@{footerData?.instagram_username}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            {footerData?.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
