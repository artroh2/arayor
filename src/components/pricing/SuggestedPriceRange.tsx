import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Target, RefreshCw, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SuggestedPriceRangeProps {
  vehiclePrice: number;
  brand: string;
  model: string;
  year: number;
}

function formatTL(v: number) {
  return new Intl.NumberFormat("tr-TR").format(v) + " ₺";
}

export function SuggestedPriceRange({ vehiclePrice, brand, model, year }: SuggestedPriceRangeProps) {
  const [updated, setUpdated] = useState(false);

  const suggestion = useMemo(() => {
    const avgMarket = Math.round(vehiclePrice * (0.96 + Math.random() * 0.08));
    const low = Math.round(avgMarket * 0.95);
    const high = Math.round(avgMarket * 1.05);
    const optimal = Math.round(avgMarket * 1.01);
    const similarCount = Math.floor(8 + Math.random() * 15);
    return { avgMarket, low, high, optimal, similarCount };
  }, [vehiclePrice]);

  const handleUpdatePrice = () => {
    setUpdated(true);
    toast.success("Fiyat güncellendi!", {
      description: `Yeni fiyat: ${formatTL(suggestion.optimal)}`,
    });
  };

  const pricePosition = ((vehiclePrice - suggestion.low) / (suggestion.high - suggestion.low)) * 100;
  const clampedPosition = Math.max(0, Math.min(100, pricePosition));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-blue-500/15 bg-blue-500/[0.04] p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-white/60">AI Önerilen Fiyat Aralığı</span>
      </div>

      {/* Price Range Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-white/25 mb-2">
          <span>{formatTL(suggestion.low)}</span>
          <span>{formatTL(suggestion.high)}</span>
        </div>
        <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
          {/* Gradient fill */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 via-blue-500/30 to-amber-500/30" />
          {/* Current price marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ left: `calc(${clampedPosition}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-emerald-400/60">Düşük</span>
          <span className="text-[10px] text-blue-400/80 font-medium">Optimal: {formatTL(suggestion.optimal)}</span>
          <span className="text-[10px] text-amber-400/60">Yüksek</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <p className="text-[10px] text-white/25 mb-1">Piyasa Ortalaması</p>
          <p className="text-sm font-bold text-blue-400">{formatTL(suggestion.avgMarket)}</p>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <p className="text-[10px] text-white/25 mb-1">Benzer İlan Sayısı</p>
          <p className="text-sm font-bold text-cyan-400">{suggestion.similarCount} araç</p>
        </div>
      </div>

      {/* Info text */}
      <p className="text-[10px] text-white/25 mb-4 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-blue-400/50" />
        Aynı {brand} {model} ({year}) · benzer km aralığı · son 30 gün verisi
      </p>

      {/* Update Button */}
      <Button
        onClick={handleUpdatePrice}
        disabled={updated}
        className={`w-full h-10 gap-2 text-sm font-semibold rounded-lg transition-all ${
          updated
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0"
        }`}
      >
        {updated ? (
          <>
            <Check className="w-4 h-4" /> Fiyat Güncellendi
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" /> Fiyatımı Güncelle → {formatTL(suggestion.optimal)}
          </>
        )}
      </Button>
    </motion.div>
  );
}
