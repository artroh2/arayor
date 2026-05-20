import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Search, Brain, Target, RefreshCw, Sparkles, Clock, DollarSign,
  ArrowUpRight, ArrowDownRight, Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface ListingItem {
  id: string;
  vehicle: string;
  brand: string;
  year: number;
  km: string;
  listedPrice: number;
  marketPrice: number;
  trendData: { d: number; v: number }[];
  lastUpdated: string;
}

function genMiniTrend(base: number) {
  const data = [];
  let v = base * 0.97;
  for (let i = 0; i < 30; i++) {
    v += (Math.random() - 0.45) * base * 0.006;
    data.push({ d: i, v: Math.round(v) });
  }
  return data;
}

const listings: ListingItem[] = [
  { id: "1", vehicle: "BMW 320i ED Sport", brand: "BMW", year: 2021, km: "42.000", listedPrice: 1_520_000, marketPrice: 1_485_000, trendData: genMiniTrend(1_485_000), lastUpdated: "2 saat önce" },
  { id: "2", vehicle: "Mercedes C200d AMG", brand: "Mercedes", year: 2022, km: "28.000", listedPrice: 2_100_000, marketPrice: 2_050_000, trendData: genMiniTrend(2_050_000), lastUpdated: "1 saat önce" },
  { id: "3", vehicle: "Peugeot 3008 Allure", brand: "Peugeot", year: 2021, km: "55.000", listedPrice: 1_500_000, marketPrice: 1_200_000, trendData: genMiniTrend(1_200_000), lastUpdated: "4 saat önce" },
  { id: "4", vehicle: "VW Tiguan 1.5 TSI", brand: "VW", year: 2023, km: "12.000", listedPrice: 1_850_000, marketPrice: 1_870_000, trendData: genMiniTrend(1_870_000), lastUpdated: "30 dk önce" },
  { id: "5", vehicle: "Toyota Corolla Hybrid", brand: "Toyota", year: 2022, km: "35.000", listedPrice: 1_280_000, marketPrice: 1_310_000, trendData: genMiniTrend(1_310_000), lastUpdated: "1 saat önce" },
  { id: "6", vehicle: "Renault Megane E-Tech", brand: "Renault", year: 2023, km: "8.000", listedPrice: 1_650_000, marketPrice: 1_350_000, trendData: genMiniTrend(1_350_000), lastUpdated: "6 saat önce" },
  { id: "7", vehicle: "Hyundai Tucson 1.6", brand: "Hyundai", year: 2022, km: "40.000", listedPrice: 1_420_000, marketPrice: 1_450_000, trendData: genMiniTrend(1_450_000), lastUpdated: "45 dk önce" },
  { id: "8", vehicle: "Skoda Superb 1.5 TSI", brand: "Skoda", year: 2023, km: "15.000", listedPrice: 1_380_000, marketPrice: 1_350_000, trendData: genMiniTrend(1_350_000), lastUpdated: "3 saat önce" },
  { id: "9", vehicle: "Ford Kuga ST-Line", brand: "Ford", year: 2022, km: "32.000", listedPrice: 1_320_000, marketPrice: 1_290_000, trendData: genMiniTrend(1_290_000), lastUpdated: "2 saat önce" },
  { id: "10", vehicle: "Volvo XC40 T3", brand: "Volvo", year: 2021, km: "48.000", listedPrice: 1_680_000, marketPrice: 1_710_000, trendData: genMiniTrend(1_710_000), lastUpdated: "5 saat önce" },
];

function formatTL(v: number) {
  return new Intl.NumberFormat("tr-TR").format(v) + " ₺";
}

function getDeviation(listed: number, market: number) {
  return ((listed - market) / market) * 100;
}

function getStatusConfig(deviation: number) {
  const abs = Math.abs(deviation);
  if (abs <= 10) return { label: "Uyumlu", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500", icon: CheckCircle, strokeColor: "#10b981" };
  if (abs <= 20) return { label: "Sapma", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500", icon: AlertTriangle, strokeColor: "#f59e0b" };
  return { label: "Kritik", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500", icon: AlertTriangle, strokeColor: "#ef4444" };
}

const glass = "bg-[rgba(30,41,59,0.4)] border border-[rgba(148,163,184,0.15)] backdrop-blur-md";

export function AdminPriceIntelDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter(i => i.vehicle.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q));
  }, [searchQuery]);

  const stats = useMemo(() => {
    const aligned = listings.filter(l => Math.abs(getDeviation(l.listedPrice, l.marketPrice)) <= 10).length;
    const warning = listings.filter(l => { const d = Math.abs(getDeviation(l.listedPrice, l.marketPrice)); return d > 10 && d <= 20; }).length;
    const critical = listings.filter(l => Math.abs(getDeviation(l.listedPrice, l.marketPrice)) > 20).length;
    return { aligned, warning, critical };
  }, []);

  const handleReprice = (item: ListingItem) => {
    toast.success(`${item.vehicle} fiyatı güncellendi!`, {
      description: `Yeni fiyat: ${formatTL(item.marketPrice)}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <BarChart3 className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white/90 tracking-tight">Fiyat İstihbarat Paneli</h2>
            <p className="text-[10px] text-white/25 font-mono uppercase tracking-[0.15em]">AI MARKET INTELLIGENCE</p>
          </div>
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İlan ara..."
            className="h-8 pl-9 text-xs bg-[rgba(30,41,59,0.3)] border-[rgba(148,163,184,0.1)] text-white/70 placeholder:text-white/20 focus-visible:ring-blue-500/30 rounded-lg"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Piyasa Uyumlu", count: stats.aligned, color: "emerald", icon: CheckCircle },
          { label: "Sapma (%10-20)", count: stats.warning, color: "amber", icon: AlertTriangle },
          { label: "Kritik Sapma (%20+)", count: stats.critical, color: "red", icon: AlertTriangle },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl ${glass} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 text-${s.color}-400`} />
              <span className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold text-${s.color}-400`}>{s.count}</p>
            <p className="text-[10px] text-white/20 mt-1">ilan</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-xl ${glass} overflow-hidden`}>
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 border-b border-white/[0.06] text-[10px] font-mono font-semibold text-white/25 uppercase tracking-[0.15em]">
          <div className="col-span-3">Araç</div>
          <div className="col-span-2 text-right">İlan Fiyatı</div>
          <div className="col-span-2 text-right">Piyasa Fiyatı</div>
          <div className="col-span-1 text-center">Sapma</div>
          <div className="col-span-2 text-center">30 Gün Trend</div>
          <div className="col-span-2 text-center">İşlem</div>
        </div>

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4 border-b border-white/[0.03]">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-40 bg-white/[0.06]" />
                <Skeleton className="h-4 w-20 bg-white/[0.06]" />
                <Skeleton className="h-4 w-20 bg-white/[0.06]" />
              </div>
            </div>
          ))
        ) : (
          filtered.map((item) => {
            const deviation = getDeviation(item.listedPrice, item.marketPrice);
            const status = getStatusConfig(deviation);
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:grid md:grid-cols-12 flex flex-col gap-2 px-4 sm:px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all group"
              >
                {/* Vehicle */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${status.dot} shadow-[0_0_6px]`} />
                  <div>
                    <p className="text-sm font-medium text-white/80">{item.vehicle}</p>
                    <p className="text-[10px] text-white/25">{item.year} · {item.km} KM</p>
                  </div>
                </div>

                {/* Listed Price */}
                <div className="col-span-2 flex items-center justify-end">
                  <span className="text-sm font-semibold text-white/70">{formatTL(item.listedPrice)}</span>
                </div>

                {/* Market Price */}
                <div className="col-span-2 flex items-center justify-end">
                  <span className="text-sm text-blue-400 font-medium">{formatTL(item.marketPrice)}</span>
                </div>

                {/* Deviation */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className={`text-xs font-bold ${status.color} flex items-center gap-0.5`}>
                    {deviation > 0 ? <ArrowUpRight className="w-3 h-3" /> : deviation < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
                    {deviation > 0 ? "+" : ""}{deviation.toFixed(1)}%
                  </span>
                </div>

                {/* Mini Chart */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="w-20 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.trendData}>
                        <Line type="monotone" dataKey="v" stroke={status.strokeColor} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Action */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  {Math.abs(deviation) > 10 ? (
                    <Button
                      size="sm"
                      onClick={() => handleReprice(item)}
                      className="h-7 text-[10px] gap-1 bg-blue-600/80 hover:bg-blue-500 text-white border-0 rounded-md px-2.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Güncelle
                    </Button>
                  ) : (
                    <span className="text-[10px] text-emerald-400/50 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Optimal
                    </span>
                  )}
                  <span className="text-[9px] text-white/15 hidden lg:block">{item.lastUpdated}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
