import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, CheckCircle2 } from "lucide-react";

// Import actual vehicle images
import audiA4 from "@/assets/vehicles/audi-a4.jpeg";
import bmw3 from "@/assets/vehicles/bmw-3-series.jpg";
import teslaModel3 from "@/assets/vehicles/tesla-model3.jpg";
import volkswagenPassat from "@/assets/vehicles/volkswagen-passat.jpg";
import toyotaCorolla from "@/assets/vehicles/toyota-corolla.jpg";
import hyundaiTucson from "@/assets/vehicles/hyundai-tucson.jpg";
import mercedesGlc from "@/assets/vehicles/mercedes-glc.webp";
import renaultMegane from "@/assets/vehicles/renault-megane.jpg";

interface Deal {
  id: number;
  car: string;
  image: string;
  timeAgo: string;
  trustScore: number;
  advantage: string;
}

const initialDeals: Deal[] = [
  { id: 1, car: "2023 Audi A4 40 TFSI", image: audiA4, timeAgo: "4 saat", trustScore: 96, advantage: "Piyasa ortalamasının %3 altında" },
  { id: 2, car: "2022 BMW 320i", image: bmw3, timeAgo: "2 saat", trustScore: 91, advantage: "Segment ortalamasının %5 altında" },
  { id: 3, car: "2024 Tesla Model 3", image: teslaModel3, timeAgo: "47 dk", trustScore: 98, advantage: "En düşük km — segment lideri" },
  { id: 4, car: "2023 VW Passat 1.5 TSI", image: volkswagenPassat, timeAgo: "6 saat", trustScore: 88, advantage: "Piyasa ortalamasının %2 altında" },
  { id: 5, car: "2022 Toyota Corolla Hybrid", image: toyotaCorolla, timeAgo: "1 saat", trustScore: 94, advantage: "Servis bakımlı, tek sahibinden" },
  { id: 6, car: "2023 Hyundai Tucson 1.6T", image: hyundaiTucson, timeAgo: "3 saat", trustScore: 92, advantage: "Segment ortalamasının %4 altında" },
  { id: 7, car: "2024 Mercedes GLC 200", image: mercedesGlc, timeAgo: "28 dk", trustScore: 97, advantage: "Premium segmentte en iyi fiyat" },
  { id: 8, car: "2023 Renault Megane E-Tech", image: renaultMegane, timeAgo: "5 saat", trustScore: 89, advantage: "Elektrikli segmentte fırsat" },
];

const incomingDeals: Deal[] = [
  { id: 100, car: "2024 Togg T10X", image: audiA4, timeAgo: "Şimdi", trustScore: 99, advantage: "Yeni listelendi — AI öncelikli eşleşme" },
  { id: 101, car: "2023 Skoda Superb 1.5 TSI", image: volkswagenPassat, timeAgo: "Şimdi", trustScore: 93, advantage: "Piyasa ortalamasının %6 altında" },
  { id: 102, car: "2024 Kia Sportage HEV", image: hyundaiTucson, timeAgo: "Şimdi", trustScore: 95, advantage: "Hibrit segmentte en iyi değer" },
];

export function LiveAIDeals() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals.slice(0, 5));
  const [flashId, setFlashId] = useState<number | null>(null);
  const incomingIdx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDeal = {
        ...incomingDeals[incomingIdx.current % incomingDeals.length],
        id: Date.now(),
        timeAgo: "Şimdi",
      };
      incomingIdx.current++;
      setFlashId(newDeal.id);
      setDeals((prev) => [newDeal, ...prev.slice(0, 4)]);
      setTimeout(() => setFlashId(null), 1500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 md:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">
          Live: AI Eşleşmeleri
        </h3>
        <Zap className="w-3.5 h-3.5 text-cyan-400 ml-auto" strokeWidth={2} />
      </div>

      {/* Feed */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {deals.map((deal) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-500 ${
                flashId === deal.id
                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                  : "bg-white/[0.03] border-white/[0.06] hover:border-white/10"
              }`}
            >
              {/* Thumbnail */}
              <img
                src={deal.image}
                alt={deal.car}
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0 border border-white/10"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" strokeWidth={2} />
                  <p className="text-sm font-semibold text-slate-100 truncate">{deal.car}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3 text-slate-500" strokeWidth={1.5} />
                  <span className="text-xs text-slate-400">{deal.timeAgo} içinde satıldı</span>
                </div>

                {/* AI Badge */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <Zap className="w-3 h-3 text-cyan-400" strokeWidth={2} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    AI Skor: {deal.trustScore}/100
                  </span>
                  <span className="text-[10px] text-cyan-400/60 hidden sm:inline">• {deal.advantage}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-500">
          Son 24 saatte <span className="text-emerald-400 font-bold">847</span> AI eşleşme gerçekleşti
        </p>
      </div>
    </div>
  );
}
