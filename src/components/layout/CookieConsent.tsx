import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Çerez Politikası</h4>
              <p className="text-sm text-muted-foreground">
                Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz. Sitemizi kullanarak{" "}
                <a href="/gizlilik" className="text-primary hover:underline">
                  çerez politikamızı
                </a>{" "}
                kabul etmiş olursunuz.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 md:flex-none"
            >
              Reddet
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 md:flex-none"
            >
              Kabul Et
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 md:static h-8 w-8"
            onClick={handleDecline}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
