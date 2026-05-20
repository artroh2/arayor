import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, TrendingUp, TrendingDown, Clock, Zap, Target,
  AlertTriangle, CheckCircle, ChevronRight, X,
  Package, DollarSign, Activity, Eye, ShoppingCart, Brain, Gauge,
  ArrowUpRight, ArrowDownRight, Car, Search, Filter, Radio,
  Shield, Crosshair, Flame, Sparkles, Check,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { AdminPriceIntelDashboard } from "@/components/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

/* ── Data ─────────────────────────────────────────────────── */
interface InventoryItem {
  id: string;
  vehicle: string;
  brand: string;
  year: number;
  km: string;
  listedPrice: number;
  aiMarketValue: number;
  demandScore: "high" | "medium" | "low";
  daysListed: number;
  status: "optimal" | "action" | "warning";
  trustScore: number;
}

const inventory: InventoryItem[] = [
  { id: "1", vehicle: "BMW 320i ED Sport", brand: "BMW", year: 2021, km: "42.000", listedPrice: 1_520_000, aiMarketValue: 1_485_000, demandScore: "high", daysListed: 5, status: "optimal", trustScore: 96 },
  { id: "2", vehicle: "Mercedes C200d AMG", brand: "Mercedes", year: 2022, km: "28.000", listedPrice: 2_100_000, aiMarketValue: 2_050_000, demandScore: "high", daysListed: 3, status: "optimal", trustScore: 94 },
  { id: "3", vehicle: "Peugeot 3008 Allure", brand: "Peugeot", year: 2021, km: "55.000", listedPrice: 1_500_000, aiMarketValue: 1_390_000, demandScore: "medium", daysListed: 18, status: "warning", trustScore: 88 },
  { id: "4", vehicle: "Volkswagen Tiguan 1.5 TSI", brand: "VW", year: 2023, km: "12.000", listedPrice: 1_850_000, aiMarketValue: 1_870_000, demandScore: "high", daysListed: 2, status: "action", trustScore: 97 },
  { id: "5", vehicle: "Toyota Corolla Hybrid", brand: "Toyota", year: 2022, km: "35.000", listedPrice: 1_280_000, aiMarketValue: 1_310_000, demandScore: "medium", daysListed: 9, status: "optimal", trustScore: 92 },
  { id: "6", vehicle: "Renault Megane E-Tech", brand: "Renault", year: 2023, km: "8.000", listedPrice: 1_650_000, aiMarketValue: 1_580_000, demandScore: "low", daysListed: 24, status: "warning", trustScore: 85 },
  { id: "7", vehicle: "Hyundai Tucson 1.6 T-GDI", brand: "Hyundai", year: 2022, km: "40.000", listedPrice: 1_420_000, aiMarketValue: 1_450_000, demandScore: "high", daysListed: 4, status: "action", trustScore: 93 },
  { id: "8", vehicle: "Skoda Superb 1.5 TSI", brand: "Skoda", year: 2023, km: "15.000", listedPrice: 1_380_000, aiMarketValue: 1_350_000, demandScore: "low", daysListed: 31, status: "warning", trustScore: 87 },
];

const sourcingFeed = [
  { id: "s1", vehicle: "2020 Honda Civic 1.5 Turbo", km: "62.000", aiValue: 1_120_000, location: "İstanbul", time: "3 dk" },
  { id: "s2", vehicle: "2021 Ford Focus ST-Line", km: "38.000", aiValue: 1_240_000, location: "Ankara", time: "8 dk" },
  { id: "s3", vehicle: "2019 Dacia Duster 1.3 TCe", km: "75.000", aiValue: 890_000, location: "İzmir", time: "12 dk" },
  { id: "s4", vehicle: "2022 Kia Sportage GT", km: "22.000", aiValue: 1_560_000, location: "Bursa", time: "18 dk" },
  { id: "s5", vehicle: "2021 Volvo XC60 T5", km: "31.000", aiValue: 2_340_000, location: "Antalya", time: "24 dk" },
];

function formatTL(v: number) {
  return new Intl.NumberFormat("tr-TR").format(v) + " ₺";
}

function genPricingData(base: number) {
  const data = [];
  for (let i = 0; i <= 30; i++) {
    const fast = base * (1 - i * 0.003 + Math.random() * 0.005);
    const patient = base * (1 + 0.02 - i * 0.001 + Math.random() * 0.004);
    data.push({ day: i, fast: Math.round(fast), patient: Math.round(patient) });
  }
  return data;
}

/* ── Styles ───────────────────────────────────────────────── */
const glass = "bg-[rgba(30,41,59,0.4)] border border-[rgba(148,163,184,0.15)] backdrop-blur-md";
const glassSubtle = "bg-[rgba(30,41,59,0.25)] border border-[rgba(148,163,184,0.08)] backdrop-blur-sm";

/* ── Component ────────────────────────────────────────────── */
export default function DealershipDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [autoReprice, setAutoReprice] = useState(false);

  // Offer modal state
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerTarget, setOfferTarget] = useState<typeof sourcingFeed[0] | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerNote, setOfferNote] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [submittedOffers, setSubmittedOffers] = useState<Set<string>>(new Set());

  // Load existing offers on mount
  useEffect(() => {
    const loadOffers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('offers')
        .select('vehicle_id')
        .eq('dealer_id', user.id);
      if (data) {
        setSubmittedOffers(new Set(data.map(o => o.vehicle_id)));
      }
    };
    loadOffers();
  }, []);

  const handleOpenOffer = useCallback((item: typeof sourcingFeed[0]) => {
    setOfferTarget(item);
    setOfferPrice("");
    setOfferNote("");
    setOfferModalOpen(true);
  }, []);

  const handleSubmitOffer = useCallback(async () => {
    if (!offerTarget) return;
    const price = Number(offerPrice);
    if (!price || price <= 0) {
      toast.error("Lütfen geçerli bir teklif fiyatı girin.");
      return;
    }

    setOfferLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Teklif vermek için giriş yapmalısınız.");
        setOfferLoading(false);
        return;
      }

      const { error } = await supabase.from('offers').insert({
        vehicle_id: offerTarget.id,
        dealer_id: user.id,
        offer_price: price,
        note: offerNote.trim() || null,
      });

      if (error) throw error;

      setSubmittedOffers(prev => new Set(prev).add(offerTarget.id));
      toast.success("Teklifiniz gönderildi!");
      setOfferModalOpen(false);
    } catch (e: any) {
      toast.error("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setOfferLoading(false);
    }
  }, [offerTarget, offerPrice, offerNote]);

  const totalValue = useMemo(() => inventory.reduce((s, i) => s + i.aiMarketValue, 0), []);
  const avgDays = useMemo(() => Math.round(inventory.reduce((s, i) => s + i.daysListed, 0) / inventory.length), []);
  const actionCount = inventory.filter(i => i.status !== "optimal").length;

  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return inventory;
    const q = searchQuery.toLowerCase();
    return inventory.filter(i => i.vehicle.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q));
  }, [searchQuery]);

  const pricingData = useMemo(() => selectedItem ? genPricingData(selectedItem.aiMarketValue) : [], [selectedItem]);

  const demandColors = { high: "text-emerald-400", medium: "text-cyan-400", low: "text-amber-400" };
  const demandBg = { high: "bg-emerald-500/10", medium: "bg-cyan-500/10", low: "bg-amber-500/10" };
  const demandLabels = { high: "Yüksek", medium: "Orta", low: "Düşük" };
  const statusConfig = {
    optimal: { label: "Optimal", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle },
    action: { label: "Fırsat", color: "text-cyan-400", bg: "bg-cyan-500/10", icon: ArrowUpRight },
    warning: { label: "Aksiyon Gerekli", color: "text-amber-400", bg: "bg-amber-500/10", icon: AlertTriangle },
  };

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #080c16 0%, #0f172a 100%)" }}>

        {/* ═══════ TOP METRICS BAR ═══════ */}
        <div className="border-b border-[rgba(148,163,184,0.08)]" style={{ background: "rgba(8,12,22,0.85)", backdropFilter: "blur(16px)" }}>
          <div className="container mx-auto px-4 sm:px-6 py-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
                  <BarChart3 className="w-4.5 h-4.5 text-[#f8fafc]" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-[#f8fafc] tracking-tight">Bayi Komut Merkezi</h1>
                  <p className="text-[10px] text-[rgba(148,163,184,0.4)] font-mono tracking-[0.2em] uppercase">ARAYOR PRO · B2B TERMINAL v2.0</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 8px rgba(16,185,129,0.6)" }} />
                  <span className="text-[10px] text-emerald-400/70 font-mono">CANLI</span>
                </motion.div>
                <span className="text-[10px] text-[rgba(148,163,184,0.25)] font-mono">{new Date().toLocaleTimeString("tr-TR")}</span>
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Toplam Envanter AI Değeri", value: formatTL(totalValue), icon: DollarSign, accent: "#fbbf24", glow: "rgba(251,191,36,0.15)", change: "+2.4%", changePositive: true },
                { label: "Ort. Satış Süresi", value: `${avgDays} gün`, icon: Clock, accent: "#06b6d4", glow: "rgba(6,182,212,0.15)", change: "-3 gün", changePositive: true },
                { label: "Piyasa Isı Endeksi", value: "88/100", icon: Flame, accent: "#f97316", glow: "rgba(249,115,22,0.12)", change: "Sıcak", changePositive: true },
                { label: "Aksiyon Gereken", value: `${actionCount} araç`, icon: AlertTriangle, accent: "#ef4444", glow: "rgba(239,68,68,0.12)", change: "Acil", changePositive: false },
              ].map((m) => (
                <motion.div
                  key={m.label}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className={`rounded-xl ${glass} p-4 relative overflow-hidden group cursor-default`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 50% 0%, ${m.glow}, transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <m.icon className="w-4 h-4" style={{ color: m.accent }} />
                      <span className="text-[10px] font-mono font-semibold" style={{ color: m.changePositive ? "#34d399" : "#f87171" }}>{m.change}</span>
                    </div>
                    <p className="font-bold text-lg text-[#f8fafc]" style={m.accent === "#fbbf24" ? { color: "#fbbf24", textShadow: "0 0 20px rgba(251,191,36,0.3)" } : {}}>{m.value}</p>
                    <p className="text-[10px] text-[rgba(148,163,184,0.4)] mt-1 tracking-wide">{m.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ MAIN CONTENT ═══════ */}
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── LEFT: SMART INVENTORY TABLE ── */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-[#f8fafc]/80 tracking-tight">Akıllı Envanter</h2>
                  <span className="text-[10px] text-[rgba(148,163,184,0.3)] font-mono">({inventory.length} araç)</span>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(148,163,184,0.3)]" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Araç ara..."
                    className="h-8 pl-9 text-xs bg-[rgba(30,41,59,0.3)] border-[rgba(148,163,184,0.1)] text-[#f8fafc]/70 placeholder:text-[rgba(148,163,184,0.25)] focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/30 rounded-lg"
                  />
                </div>
              </div>

              <div className={`rounded-xl ${glass} overflow-x-auto`}>
                {/* Table Header — hide some cols on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 border-b border-[rgba(148,163,184,0.08)] text-[10px] font-mono font-semibold text-[rgba(148,163,184,0.35)] uppercase tracking-[0.15em] min-w-[700px]">
                  <div className="col-span-4">Araç</div>
                  <div className="col-span-2 text-right">İlan Fiyatı</div>
                  <div className="col-span-2 text-right">AI Piyasa Değeri</div>
                  <div className="col-span-1 text-center">Talep</div>
                  <div className="col-span-1 text-center">Gün</div>
                  <div className="col-span-2 text-center">AI Durum</div>
                </div>

                {/* Rows */}
                {filteredInventory.map((item) => {
                  const priceDiff = item.aiMarketValue - item.listedPrice;
                  const isOverpriced = priceDiff < -50000;
                  const isUnderpriced = priceDiff > 20000;
                  const sc = statusConfig[item.status];
                  const StatusIcon = sc.icon;
                  const isSelected = selectedItem?.id === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`md:grid md:grid-cols-12 flex flex-col gap-2 px-4 sm:px-5 py-3.5 w-full text-left border-b border-[rgba(148,163,184,0.04)] transition-all duration-300 group ${
                        isSelected
                          ? "bg-cyan-500/[0.06] md:border-l-2 md:border-l-cyan-500"
                          : "hover:bg-[rgba(148,163,184,0.04)]"
                      }`}
                      style={isOverpriced ? { background: "rgba(245,158,11,0.03)" } : undefined}
                      animate={isOverpriced ? { opacity: [1, 0.8, 1] } : {}}
                      transition={isOverpriced ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
                    >
                      {/* Vehicle */}
                      <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.12)" }}>
                          <Car className="w-3.5 h-3.5 text-cyan-400/60" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#f8fafc]/80 truncate group-hover:text-cyan-300/90 transition-colors">{item.vehicle}</p>
                          <p className="text-[10px] text-[rgba(148,163,184,0.35)] font-mono">{item.year} · {item.km} km</p>
                        </div>
                      </div>

                      {/* Prices and status - shown inline on mobile */}
                      <div className="flex flex-wrap items-center gap-3 md:contents">
                        <div className="md:col-span-2 md:text-right flex flex-col justify-center">
                          <p className="text-xs font-mono text-[#f8fafc]/45">{formatTL(item.listedPrice)}</p>
                        </div>

                      {/* AI Market Value */}
                      <div className="md:col-span-2 md:text-right flex flex-col justify-center">
                        <p className={`text-xs font-mono font-bold ${isOverpriced ? "text-amber-400" : isUnderpriced ? "text-emerald-400" : "text-[#f8fafc]/60"}`}
                          style={isOverpriced ? { textShadow: "0 0 8px rgba(245,158,11,0.3)" } : isUnderpriced ? { textShadow: "0 0 8px rgba(16,185,129,0.3)" } : {}}
                        >
                          {formatTL(item.aiMarketValue)}
                        </p>
                        {priceDiff !== 0 && (
                          <p className={`text-[9px] font-mono flex items-center justify-end gap-0.5 mt-0.5 ${priceDiff > 0 ? "text-emerald-400/50" : "text-red-400/50"}`}>
                            {priceDiff > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                            {formatTL(Math.abs(priceDiff))}
                          </p>
                        )}
                      </div>

                      {/* Demand */}
                      <div className="md:col-span-1 flex items-center md:justify-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${demandBg[item.demandScore]} ${demandColors[item.demandScore]}`}>
                          {demandLabels[item.demandScore]}
                        </span>
                      </div>

                      {/* Days */}
                      <div className="hidden md:flex md:col-span-1 items-center justify-center">
                        <span className={`text-xs font-mono ${item.daysListed > 20 ? "text-amber-400/80" : "text-[rgba(148,163,184,0.45)]"}`}>{item.daysListed}</span>
                      </div>

                      {/* Status */}
                      <div className="md:col-span-2 flex items-center md:justify-center">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}
                          style={item.status === "warning" ? { boxShadow: "0 0 12px rgba(245,158,11,0.15)" } : item.status === "action" ? { boxShadow: "0 0 12px rgba(6,182,212,0.15)" } : {}}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                       </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="w-full lg:w-[400px] shrink-0 space-y-5">

              {/* ═══ AI PRICING STRATEGY PANEL ═══ */}
              <AnimatePresence mode="wait">
                {selectedItem ? (
                  <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, x: 30, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`rounded-xl ${glass} overflow-hidden`}
                    style={{ boxShadow: "0 0 40px rgba(6,182,212,0.06)" }}
                  >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(148,163,184,0.08)]">
                      <div className="flex items-center gap-2.5">
                        <Brain className="w-4 h-4 text-cyan-400" style={{ filter: "drop-shadow(0 0 6px rgba(6,182,212,0.5))" }} />
                        <span className="text-xs font-bold text-[#f8fafc]/70 tracking-tight">AI Fiyat Stratejisi</span>
                      </div>
                      <button onClick={() => setSelectedItem(null)} className="text-[rgba(148,163,184,0.3)] hover:text-[#f8fafc]/50 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 space-y-5">
                      {/* Vehicle info */}
                      <div>
                        <p className="font-bold text-[#f8fafc]/90 text-sm tracking-tight">{selectedItem.vehicle}</p>
                        <p className="text-[10px] text-[rgba(148,163,184,0.4)] font-mono mt-1">{selectedItem.year} · {selectedItem.km} km · Trust Score: {selectedItem.trustScore}/100</p>
                      </div>

                      {/* Price boxes */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3.5 rounded-lg ${glassSubtle}`}>
                          <p className="text-[10px] text-[rgba(148,163,184,0.4)] mb-1.5 font-mono uppercase tracking-wider">İlan Fiyatı</p>
                          <p className="font-mono font-bold text-sm text-[#f8fafc]/60">{formatTL(selectedItem.listedPrice)}</p>
                        </div>
                        <div className="p-3.5 rounded-lg" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)" }}>
                          <p className="text-[10px] text-cyan-400/50 mb-1.5 font-mono uppercase tracking-wider">AI Değer</p>
                          <p className="font-mono font-bold text-sm text-cyan-400" style={{ textShadow: "0 0 12px rgba(6,182,212,0.4)" }}>{formatTL(selectedItem.aiMarketValue)}</p>
                        </div>
                      </div>

                      {/* Pricing chart */}
                      <div>
                        <p className="text-[10px] text-[rgba(148,163,184,0.35)] mb-3 font-mono uppercase tracking-[0.15em]">Optimal Satış Tahmini</p>
                        <div className="h-[160px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={pricingData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "rgba(148,163,184,0.2)" }} />
                              <YAxis hide domain={["dataMin - 30000", "dataMax + 30000"]} />
                              <Tooltip
                                contentStyle={{
                                  background: "rgba(8,12,22,0.95)",
                                  border: "1px solid rgba(148,163,184,0.12)",
                                  borderRadius: "10px",
                                  fontSize: "11px",
                                  color: "#f8fafc",
                                  backdropFilter: "blur(12px)",
                                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                                }}
                                formatter={(v: number, name: string) => [formatTL(v), name === "fast" ? "Hızlı Satış (7g)" : "Sabırlı (30g)"]}
                                labelFormatter={(l) => `Gün ${l}`}
                              />
                              <Line type="monotone" dataKey="fast" stroke="#fbbf24" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
                              <Line
                                type="monotone"
                                dataKey="patient"
                                stroke="#06b6d4"
                                strokeWidth={2.5}
                                dot={false}
                                style={{ filter: "drop-shadow(0 0 6px rgba(6,182,212,0.5))" }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-5 mt-3">
                          <span className="flex items-center gap-2 text-[10px] text-[#fbbf24]/70 font-mono">
                            <span className="w-4 h-[2px] inline-block border-t-2 border-dashed border-[#fbbf24]" />
                            Hızlı Satış (7g)
                          </span>
                          <span className="flex items-center gap-2 text-[10px] text-cyan-400/70 font-mono">
                            <span className="w-4 h-[2px] bg-cyan-400 inline-block rounded-full" style={{ boxShadow: "0 0 4px rgba(6,182,212,0.6)" }} />
                            Sabırlı Strateji (30g)
                          </span>
                        </div>
                      </div>

                      {/* Autonomous repricing toggle */}
                      <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.12)" }}>
                        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.15), transparent 60%)" }} />
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[#f8fafc]/70 tracking-tight">Otonom AI Yeniden Fiyatlama</p>
                            <p className="text-[10px] text-[rgba(148,163,184,0.4)] mt-0.5">Piyasayı anında eşle</p>
                          </div>
                          <Switch
                            checked={autoReprice}
                            onCheckedChange={setAutoReprice}
                            className="data-[state=checked]:bg-cyan-600"
                          />
                        </div>
                        <AnimatePresence>
                          {autoReprice && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-[10px] text-cyan-400/60 mt-3 pt-3 border-t border-cyan-500/10 font-mono">
                                <Sparkles className="w-3 h-3 inline mr-1 text-cyan-400" />
                                AI motoru aktif — fiyat, piyasa değişimlerine göre anlık güncellenir.
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Action button */}
                      <Button
                        className="w-full h-11 gap-2 text-xs font-bold border-0 rounded-lg text-[#080c16]"
                        style={{
                          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                          boxShadow: "0 0 24px rgba(6,182,212,0.25), 0 4px 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Optimal Fiyata Güncelle
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`rounded-xl border border-dashed border-[rgba(148,163,184,0.1)] p-10 text-center`}
                    style={{ background: "rgba(30,41,59,0.15)" }}
                  >
                    <Brain className="w-10 h-10 text-[rgba(148,163,184,0.1)] mx-auto mb-3" />
                    <p className="text-xs text-[rgba(148,163,184,0.25)] leading-relaxed">
                      Fiyat stratejisi görüntülemek için<br />envanterdeki bir aracı seçin
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ═══ SOURCING RADAR ═══ */}
              <div className={`rounded-xl ${glass} overflow-hidden`}>
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(148,163,184,0.08)]">
                  <div className="flex items-center gap-2.5">
                    <Crosshair className="w-4 h-4 text-cyan-400" style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.5))" }} />
                    <span className="text-xs font-bold text-[#f8fafc]/70 tracking-tight">Alım Radarı</span>
                    <span className="text-[9px] font-mono text-[rgba(148,163,184,0.25)] uppercase tracking-wider">Canlı</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    style={{ boxShadow: "0 0 8px rgba(16,185,129,0.6)" }}
                  />
                </div>

                <div className="divide-y divide-[rgba(148,163,184,0.04)]">
                  {sourcingFeed.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="px-5 py-3.5 hover:bg-[rgba(6,182,212,0.02)] transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#f8fafc]/70 truncate group-hover:text-cyan-300/80 transition-colors">{item.vehicle}</p>
                          <p className="text-[10px] text-[rgba(148,163,184,0.35)] font-mono mt-0.5">{item.km} km · {item.location} · {item.time} önce</p>
                          <p className="text-xs font-mono font-bold text-cyan-400 mt-1.5" style={{ textShadow: "0 0 10px rgba(6,182,212,0.3)" }}>
                            {formatTL(item.aiValue)}
                          </p>
                        </div>
                        {submittedOffers.has(item.id) ? (
                          <Button
                            size="sm"
                            disabled
                            className="h-8 px-3.5 text-[10px] font-bold shrink-0 ml-3 rounded-lg border-0 opacity-60"
                            style={{ background: "rgba(148,163,184,0.15)" }}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Teklif Verildi
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleOpenOffer(item)}
                            className="h-8 px-3.5 text-[10px] font-bold shrink-0 ml-3 rounded-lg border-0 text-[#080c16]"
                            style={{
                              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                              boxShadow: "0 0 16px rgba(6,182,212,0.2)",
                            }}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Teklif Ver
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="px-5 py-3 border-t border-[rgba(148,163,184,0.06)]">
                  <button className="text-[10px] text-cyan-400/50 hover:text-cyan-400/80 transition-colors font-semibold font-mono tracking-wide">
                    Tüm değerleme taleplerini gör →
                  </button>
                </div>
              </div>
            </div>

            {/* Price Intelligence Dashboard */}
            <div className="mt-8">
              <AdminPriceIntelDashboard />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ OFFER MODAL ═══ */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="sm:max-w-md bg-[hsl(220,40%,6%)] border-[rgba(148,163,184,0.12)] text-[#f8fafc]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#f8fafc]">Teklif Ver</DialogTitle>
            <DialogDescription className="text-[rgba(148,163,184,0.5)] text-xs">
              Araç sahibine teklif fiyatınızı gönderin.
            </DialogDescription>
          </DialogHeader>

          {offerTarget && (
            <div className="space-y-4 pt-2">
              {/* Vehicle info - readonly */}
              <div className="rounded-lg p-3.5" style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.12)" }}>
                <p className="text-sm font-semibold text-[#f8fafc]/80">{offerTarget.vehicle}</p>
                <p className="text-[10px] text-[rgba(148,163,184,0.4)] font-mono mt-1">
                  {offerTarget.km} km · {offerTarget.location}
                </p>
                <p className="text-xs font-mono font-bold text-cyan-400 mt-1.5">
                  AI Değer: {formatTL(offerTarget.aiValue)}
                </p>
              </div>

              {/* Offer price */}
              <div>
                <label className="text-[11px] font-semibold text-[#f8fafc]/60 block mb-1.5">
                  Teklif Fiyatınız (TL) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="Örn: 1.150.000"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="h-10 bg-[rgba(30,41,59,0.4)] border-[rgba(148,163,184,0.12)] text-[#f8fafc] placeholder:text-[rgba(148,163,184,0.25)] focus-visible:ring-cyan-500/30"
                />
              </div>

              {/* Note */}
              <div>
                <label className="text-[11px] font-semibold text-[#f8fafc]/60 block mb-1.5">
                  Not ekleyin (opsiyonel)
                </label>
                <Textarea
                  placeholder="Ek bilgi veya koşullarınızı yazın..."
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  className="min-h-[80px] bg-[rgba(30,41,59,0.4)] border-[rgba(148,163,184,0.12)] text-[#f8fafc] placeholder:text-[rgba(148,163,184,0.25)] focus-visible:ring-cyan-500/30 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setOfferModalOpen(false)}
                  className="flex-1 h-10 text-xs border-[rgba(148,163,184,0.15)] text-[#f8fafc]/60 hover:bg-[rgba(148,163,184,0.08)] bg-transparent"
                >
                  İptal
                </Button>
                <Button
                  onClick={handleSubmitOffer}
                  disabled={offerLoading}
                  className="flex-1 h-10 text-xs font-bold border-0 text-[#080c16]"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    boxShadow: "0 0 20px rgba(6,182,212,0.2)",
                  }}
                >
                  {offerLoading ? "Gönderiliyor..." : "Teklif Gönder"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </Layout>
  );
}
