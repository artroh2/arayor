import { useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

interface TickerItem {
  text: string;
  trend: "up" | "down" | "neutral";
}

const tickerData: TickerItem[] = [
  { text: "SUV talebi bugün %4.2 arttı", trend: "up" },
  { text: "VW Golf Mk7 ortalama fiyatı %1.5 düştü", trend: "down" },
  { text: "AI Uyarısı: Son 1 saatte 14 yeni piyasa altı fırsat listelendi", trend: "neutral" },
  { text: "Tesla Model Y ikinci el değeri %2.8 yükseldi", trend: "up" },
  { text: "Dizel sedan segmenti %3.1 geriledi", trend: "down" },
  { text: "BMW 3 Serisi ortalama satış süresi: 6 saat", trend: "up" },
  { text: "Elektrikli araç stoku %7.4 arttı", trend: "up" },
  { text: "Togg T10X talep endeksi rekor seviyede", trend: "up" },
  { text: "Renault Clio fiyat ortalaması %0.9 düştü", trend: "down" },
  { text: "AI analizi: Hatchback segmentinde alım fırsatı", trend: "neutral" },
];

export function MarketTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let pos = 0;

    const scroll = () => {
      pos -= 0.5;
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const renderItem = (item: TickerItem, idx: number) => {
    const colorClass =
      item.trend === "up"
        ? "text-emerald-400"
        : item.trend === "down"
        ? "text-rose-500"
        : "text-cyan-400";

    const Icon =
      item.trend === "up"
        ? TrendingUp
        : item.trend === "down"
        ? TrendingDown
        : Zap;

    return (
      <span key={idx} className="inline-flex items-center gap-1.5 mx-6 whitespace-nowrap">
        <Icon className={`w-3 h-3 ${colorClass}`} strokeWidth={2} />
        <span className={`text-xs uppercase tracking-widest font-medium ${colorClass}`}>
          {item.text}
        </span>
        <span className="text-white/20 ml-4">│</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-black/90 backdrop-blur-sm border-b border-white/5 overflow-hidden py-2 relative z-40">
      <div ref={scrollRef} className="flex items-center will-change-transform" style={{ width: "max-content" }}>
        {tickerData.map((item, i) => renderItem(item, i))}
        {tickerData.map((item, i) => renderItem(item, i + tickerData.length))}
      </div>
    </div>
  );
}
