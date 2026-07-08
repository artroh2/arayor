import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, X } from "lucide-react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "arayor-consent-v2";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="relative bg-card/95 backdrop-blur border border-border rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1 pr-8 md:pr-0">
              <h4 className="font-semibold text-sm">Bilgilendirme &amp; Çerez Politikası</h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Arayor'da sunulan araç fiyatları, değerleme sonuçları, piyasa analizleri ve
                yapay zeka tahminleri bilgilendirme amaçlıdır; <strong className="text-foreground">%100 doğruluk garanti edilmez</strong>.
                Kesin bilgi için ilgili banka, sigorta şirketi veya satıcı ile doğrulama yapmanızı öneririz.
                Siteyi kullanarak{" "}
                <Link to="/sozlesme" className="text-primary hover:underline">kullanıcı sözleşmesini</Link>
                {" "}ve çerez politikamızı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Button variant="outline" size="sm" onClick={handleDecline} className="flex-1 md:flex-none">
              Reddet
            </Button>
            <Button size="sm" onClick={handleAccept} className="flex-1 md:flex-none">
              Kabul Ediyorum
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleDecline}
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
