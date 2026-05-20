import { motion } from "framer-motion";
import { Trophy, ChevronRight, Lock, Unlock, Star } from "lucide-react";
import { PrestigeBadge, getTierConfig, PrestigeTier } from "./PrestigeBadge";

interface OraclesCircleWidgetProps {
  currentTier: PrestigeTier;
  trustScore: number;
  completedSales: number;
  cleanSales: number;
}

export function OraclesCircleWidget({
  currentTier = "honest_broker",
  trustScore = 94,
  completedSales = 7,
  cleanSales = 5,
}: OraclesCircleWidgetProps) {
  const tiers: PrestigeTier[] = ["verified", "honest_broker", "oracle"];
  const currentIdx = tiers.indexOf(currentTier);
  const config = getTierConfig(currentTier);
  const nextTier = currentIdx < 2 ? tiers[currentIdx + 1] : null;
  const nextConfig = nextTier ? getTierConfig(nextTier) : null;

  // Progress calc
  const progressToNext = currentTier === "verified"
    ? Math.min((cleanSales / 3) * 100, 100)
    : currentTier === "honest_broker"
    ? Math.min((trustScore / 98) * 100, 100)
    : 100;

  const progressMessage = currentTier === "verified"
    ? `${3 - cleanSales > 0 ? 3 - cleanSales : 0} temiz satış daha ile "Dürüst Broker" seviyesine ulaşın`
    : currentTier === "honest_broker"
    ? `Güven skorunuzu ${98 - trustScore > 0 ? 98 - trustScore : 0} puan artırarak "The Oracle" seviyesine ulaşın`
    : "En yüksek seviyeye ulaştınız — tebrikler!";

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Oracle's Circle</h3>
            <p className="text-xs text-slate-500">İtibar & Prestij Sistemi</p>
          </div>
        </div>
      </div>

      {/* Current Tier */}
      <div className="p-5 md:p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <PrestigeBadge tier={currentTier} size="lg" showLabel />
          <span className="text-xs text-slate-500 ml-auto">Güven Skoru: <span className="text-emerald-400 font-bold">{trustScore}/100</span></span>
        </div>
        <p className="text-xs text-slate-400">{config.sublabel}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <p className="text-lg font-display font-bold text-slate-100">{completedSales}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Toplam Satış</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <p className="text-lg font-display font-bold text-emerald-400">{cleanSales}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Temiz Satış</p>
          </div>
        </div>
      </div>

      {/* Progress to next tier */}
      {nextTier && (
        <div className="p-5 md:p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">Sonraki Seviye</span>
            <PrestigeBadge tier={nextTier} size="sm" showLabel />
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                nextTier === "oracle"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                  : "bg-gradient-to-r from-cyan-500 to-cyan-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{progressMessage}</p>
        </div>
      )}

      {/* Current Perks */}
      <div className="p-5 md:p-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-3">Mevcut Ayrıcalıklar</h4>
        <ul className="space-y-2">
          {config.perks.map((perk, i) => (
            <li key={i} className="flex items-center gap-2">
              <Unlock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-xs text-slate-300">{perk}</span>
            </li>
          ))}
        </ul>
        {nextConfig && (
          <>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-4 mb-3">Kilitlenen Ayrıcalıklar</h4>
            <ul className="space-y-2">
              {nextConfig.perks.filter(p => !config.perks.includes(p)).map((perk, i) => (
                <li key={i} className="flex items-center gap-2 opacity-40">
                  <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-xs text-slate-500">{perk}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Tier ladder */}
      <div className="px-5 md:px-6 pb-5 md:pb-6">
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          {tiers.map((t, idx) => (
            <div key={t} className="flex items-center gap-1">
              <PrestigeBadge tier={t} size="sm" />
              {idx < tiers.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600 mx-1" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
