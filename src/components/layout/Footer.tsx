import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { ArayorLogo } from "@/components/brand/ArayorLogo";

const quickLinks = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/degerleme", label: "Araç Değerleme" },
  { to: "/araclar", label: "İlanlar" },
  { to: "/incelemeler", label: "Blog" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/iletisim", label: "İletişim" },
  { to: "/gizlilik", label: "Gizlilik Politikası" },
  { to: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { to: "/kvkk", label: "KVKK" },
  { to: "/sss", label: "Sıkça Sorulan Sorular" },
  { to: "/karsilastir", label: "Araç Karşılaştırma" },
  { to: "/galeri", label: "Galeri" },
];

const legalLinks = [
  { to: "/gizlilik", label: "Gizlilik Politikası" },
  { to: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { to: "/kvkk", label: "KVKK" },
];

export function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const midpoint = Math.ceil(quickLinks.length / 2);
  const col1 = quickLinks.slice(0, midpoint);
  const col2 = quickLinks.slice(midpoint);

  return (
    <footer className="relative bg-[hsl(220,40%,4%)] border-t border-[hsl(var(--border))]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary)/0.4)] to-transparent" />

      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" onClick={handleScrollToTop} className="inline-block">
              <ArayorLogo size="md" />
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs">
              Türkiye'nin en akıllı araç platformu
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground)/0.5)] leading-relaxed max-w-xs">
              Arayor — Aracını akıllıca sat, gerçek değerini öğren. Yapay zeka destekli fiyat analizi, uzman yorumları ve Türkiye'nin en kapsamlı araç veritabanı tek platformda.
            </p>
          </div>

          {/* Quick Links — 2 sub-columns */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-5 tracking-wide uppercase">
              Hızlı Linkler
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mx-auto">
              {[col1, col2].map((col, ci) => (
                <ul key={ci} className="space-y-3">
                  {col.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        onClick={handleScrollToTop}
                        className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-5 tracking-wide uppercase">
              İletişim
            </h4>
            <a
              href="mailto:info@arayor.com"
              className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
            >
              <Mail className="w-4 h-4 text-[hsl(var(--primary))]" />
              info@arayor.com
            </a>

            <a
              href="tel:+905457929876"
              className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
            >
              <Phone className="w-4 h-4 text-[hsl(var(--primary))]" />
              +90 545 792 98 76
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[hsl(var(--border)/0.5)]">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[hsl(var(--muted-foreground)/0.6)]">
            © 2026 Arayor.com. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 text-xs">
            {legalLinks.map((link, i) => (
              <span key={link.to} className="flex items-center gap-4">
                {i > 0 && <span className="text-[hsl(var(--border))]">|</span>}
                <Link
                  to={link.to}
                  className="text-[hsl(var(--muted-foreground)/0.6)] hover:text-[hsl(var(--muted-foreground))] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
