import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck, AlertTriangle, User, DollarSign, FileCheck } from "lucide-react";

interface TrustScoreBreakdown {
  sellerHistory: number;
  priceFairness: number;
  damageVerification: number;
}

interface AITrustScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  breakdown?: TrustScoreBreakdown;
  className?: string;
}

function getScoreColor(score: number) {
  if (score >= 90) return { stroke: "#10b981", glow: "rgba(16,185,129,0.3)", label: "Mükemmel", bg: "from-emerald-500/10 to-emerald-500/5" };
  if (score >= 70) return { stroke: "#3b82f6", glow: "rgba(59,130,246,0.3)", label: "İyi", bg: "from-blue-500/10 to-blue-500/5" };
  return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.3)", label: "Dikkat", bg: "from-amber-500/10 to-amber-500/5" };
}

const sizes = {
  sm: { ring: 36, stroke: 3, text: "text-xs", icon: 12 },
  md: { ring: 52, stroke: 3.5, text: "text-sm", icon: 14 },
  lg: { ring: 72, stroke: 4, text: "text-lg", icon: 18 },
};

export function AITrustScore({ score, size = "sm", breakdown, className = "" }: AITrustScoreProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const color = getScoreColor(score);
  const s = sizes[size];
  const radius = (s.ring - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const defaultBreakdown: TrustScoreBreakdown = breakdown || {
    sellerHistory: Math.min(100, score + Math.floor(Math.random() * 8 - 3)),
    priceFairness: Math.min(100, score + Math.floor(Math.random() * 10 - 5)),
    damageVerification: Math.min(100, score + Math.floor(Math.random() * 6 - 2)),
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onMouseEnter={() => setShowBreakdown(true)}
        onMouseLeave={() => setShowBreakdown(false)}
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="relative flex items-center justify-center cursor-pointer"
        style={{ width: s.ring, height: s.ring }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40"
          style={{ background: color.glow }}
        />

        <svg width={s.ring} height={s.ring} className="absolute inset-0 -rotate-90">
          {/* Background track */}
          <circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={s.stroke}
          />
          {/* Progress */}
          <motion.circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          />
        </svg>

        <span className={`relative font-display font-bold ${s.text}`} style={{ color: color.stroke }}>
          {score}
        </span>
      </button>

      {/* Breakdown Tooltip */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-white/[0.08] bg-[#0c1222]/95 backdrop-blur-xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
              <ShieldCheck className="w-4 h-4" style={{ color: color.stroke }} />
              <span className="text-xs font-semibold text-white/70">AI Trust Score: {score}/100</span>
              <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${color.stroke}15`, color: color.stroke }}>
                {color.label}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Satıcı Geçmişi", value: defaultBreakdown.sellerHistory, icon: User },
                { label: "Fiyat Adaleti", value: defaultBreakdown.priceFairness, icon: DollarSign },
                { label: "Tramer/Hasar Doğrulama", value: defaultBreakdown.damageVerification, icon: FileCheck },
              ].map((item) => {
                const itemColor = getScoreColor(item.value);
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-white/25 shrink-0" />
                    <span className="text-[11px] text-white/40 flex-1">{item.label}</span>
                    <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: itemColor.stroke }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold w-8 text-right" style={{ color: itemColor.stroke }}>
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[9px] text-white/15 mt-3 text-center">AI güvenilirlik analizi · Arayor Oracle</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generate a deterministic-ish score from vehicle ID
export function getVehicleTrustScore(vehicleId: string): number {
  let hash = 0;
  for (let i = 0; i < vehicleId.length; i++) {
    hash = ((hash << 5) - hash + vehicleId.charCodeAt(i)) | 0;
  }
  return 72 + Math.abs(hash % 28); // Range 72-99
}
