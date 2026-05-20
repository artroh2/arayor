import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, BarChart3, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface PriceIntelligenceWidgetProps {
  vehiclePrice: number;
  brand: string;
  model: string;
  year: number;
}

function genTrendData(base: number) {
  const data = [];
  let v = base * 0.97;
  for (let i = 0; i < 30; i++) {
    v += (Math.random() - 0.45) * base * 0.008;
    data.push({ d: i, v: Math.round(v) });
  }
  return data;
}

function formatTL(v: number) {
  return new Intl.NumberFormat("tr-TR").format(v) + " ₺";
}

export function PriceIntelligenceWidget({ vehiclePrice, brand, model, year }: PriceIntelligenceWidgetProps) {
  const marketAvg = useMemo(() => Math.round(vehiclePrice * (0.95 + Math.random() * 0.1)), [vehiclePrice]);
  const deviation = ((vehiclePrice - marketAvg) / marketAvg) * 100;
  const absDeviation = Math.abs(deviation);
  const trendData = useMemo(() => genTrendData(marketAvg), [marketAvg]);

  const getStatusConfig = () => {
    if (absDeviation <= 10) return { color: "emerald", label: "Piyasa ile Uyumlu", icon: Minus, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" };
    if (absDeviation <= 20) return { color: "amber", label: "Piyasadan Sapma", icon: deviation > 0 ? ArrowUpRight : ArrowDownRight, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
    return { color: "red", label: "Yüksek Sapma", icon: deviation > 0 ? ArrowUpRight : ArrowDownRight, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${status.border} ${status.bg} p-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className={`w-4 h-4 ${status.text}`} />
          <span className="text-xs font-medium text-white/50">Piyasa Karşılaştırması</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${status.bg}`}>
          <StatusIcon className={`w-3 h-3 ${status.text}`} />
          <span className={`text-[10px] font-semibold ${status.text}`}>{status.label}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Bu araç piyasanın</p>
          <p className={`text-lg font-bold ${status.text}`}>
            %{absDeviation.toFixed(1)} {deviation > 0 ? "üstünde" : deviation < 0 ? "altında" : "ortalamasında"}
          </p>
          <p className="text-[10px] text-white/25 mt-1">
            Piyasa ort: {formatTL(marketAvg)}
          </p>
        </div>
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={status.color === "emerald" ? "#10b981" : status.color === "amber" ? "#f59e0b" : "#ef4444"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2 text-[10px] text-white/20">
        <Clock className="w-3 h-3" />
        Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
      </div>
    </motion.div>
  );
}
