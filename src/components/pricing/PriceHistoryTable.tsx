import { useMemo } from "react";
import { motion } from "framer-motion";
import { History, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PriceChange {
  date: string;
  oldPrice: number;
  newPrice: number;
}

interface PriceHistoryTableProps {
  basePrice: number;
}

function formatTL(v: number) {
  return new Intl.NumberFormat("tr-TR").format(v) + " ₺";
}

export function PriceHistoryTable({ basePrice }: PriceHistoryTableProps) {
  const history = useMemo(() => {
    const changes: PriceChange[] = [];
    let price = Math.round(basePrice * 0.88);
    const months = ["Ekim 2024", "Kasım 2024", "Aralık 2024", "Ocak 2025", "Şubat 2025", "Mart 2025"];
    for (const month of months) {
      const oldPrice = price;
      price = Math.round(price * (1 + (Math.random() * 0.06 - 0.01)));
      changes.push({ date: month, oldPrice, newPrice: price });
    }
    return changes;
  }, [basePrice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <History className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-white/60">Fiyat Değişim Geçmişi</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-4 gap-2 px-4 py-2 text-[10px] font-mono font-semibold text-white/25 uppercase tracking-wider border-b border-white/[0.04]">
        <div>Tarih</div>
        <div className="text-right">Eski Fiyat</div>
        <div className="text-right">Yeni Fiyat</div>
        <div className="text-right">Değişim</div>
      </div>

      {/* Rows */}
      {history.map((change, i) => {
        const diff = change.newPrice - change.oldPrice;
        const pct = ((diff / change.oldPrice) * 100).toFixed(1);
        const isUp = diff > 0;
        const isFlat = diff === 0;
        return (
          <div
            key={i}
            className="grid grid-cols-4 gap-2 px-4 py-2.5 border-b border-white/[0.03] text-xs hover:bg-white/[0.02] transition-colors"
          >
            <div className="text-white/50">{change.date}</div>
            <div className="text-right text-white/35">{formatTL(change.oldPrice)}</div>
            <div className="text-right text-white/70 font-medium">{formatTL(change.newPrice)}</div>
            <div className={`text-right font-semibold flex items-center justify-end gap-1 ${
              isFlat ? "text-white/30" : isUp ? "text-emerald-400" : "text-red-400"
            }`}>
              {isFlat ? <Minus className="w-3 h-3" /> : isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isFlat ? "—" : `${isUp ? "+" : ""}${pct}%`}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
