import { Mail, Phone, Instagram, MessageCircle } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="font-heading text-xl font-bold mb-4">
              <span className="gradient-text">Solusi</span>
              <span className="text-foreground">Medsos</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Agency jasa buzzer & social media campaign terpercaya di Indonesia. Solusi digital marketing untuk brand, politik, dan personal branding.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">Tentang Kami</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Layanan</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Harga</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Buzzer Twitter/X</li>
              <li>Buzzer Instagram</li>
              <li>Buzzer TikTok</li>
              <li>Campaign Politik</li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href="https://wa.me/6281234567890" className="hover:text-primary transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@solusimedsos.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <span>@solusimedsos</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 SolusiMedsos. All rights reserved. Disclaimer: Semua layanan yang kami berikan bersifat profesional dan bertanggung jawab.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
