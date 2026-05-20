import { motion } from "framer-motion";
import { Shield, CheckCircle2, Sparkles } from "lucide-react";

export type PrestigeTier = "verified" | "honest_broker" | "oracle";

interface PrestigeBadgeProps {
  tier: PrestigeTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const tierConfig: Record<PrestigeTier, { label: string; sublabel: string; perks: string[] }> = {
  verified: {
    label: "Doğrulanmış",
    sublabel: "Kimlik doğrulaması tamamlandı",
    perks: ["Doğrulanmış profil rozeti", "Topluluk erişimi", "Temel AI değerleme"],
  },
  honest_broker: {
    label: "Dürüst Broker",
    sublabel: "3+ AI doğrulamalı temiz satış",
    perks: ["AI Değerleme %50 indirim", "Öncelikli listeleme", "Genişletilmiş analitik", "Topluluk moderatörü"],
  },
  oracle: {
    label: "The Oracle",
    sublabel: "Kusursuz güven skoru — elit seviye",
    perks: ["Ücretsiz AI değerleme", "Kuyruk atlama — anında listeleme", "VIP destek hattı", "Özel Oracle rozeti", "Komisyon indirimi"],
  },
};

export function getTierConfig(tier: PrestigeTier) {
  return tierConfig[tier];
}

export function PrestigeBadge({ tier, size = "md", showLabel = false }: PrestigeBadgeProps) {
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };
  const textSizes = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" };
  const iconSize = sizes[size];

  if (tier === "verified") {
    return (
      <span className="inline-flex items-center gap-1">
        <span className={`${iconSize} relative`}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="verified-grad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            <path d="M12 2L14.5 4.5L18 3.5L18 7L21 9L19.5 12L21 15L18 17L18 20.5L14.5 19.5L12 22L9.5 19.5L6 20.5L6 17L3 15L4.5 12L3 9L6 7L6 3.5L9.5 4.5L12 2Z" fill="url(#verified-grad)" opacity="0.2" stroke="url(#verified-grad)" strokeWidth="1.2" />
            <path d="M9 12L11 14L15 10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {showLabel && <span className={`${textSizes[size]} font-semibold text-slate-400 uppercase tracking-wider`}>Doğrulanmış</span>}
      </span>
    );
  }

  if (tier === "honest_broker") {
    return (
      <span className="inline-flex items-center gap-1">
        <span className={`${iconSize} relative`}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="broker-grad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <filter id="broker-glow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d="M12 2L14.5 4.5L18 3.5L18 7L21 9L19.5 12L21 15L18 17L18 20.5L14.5 19.5L12 22L9.5 19.5L6 20.5L6 17L3 15L4.5 12L3 9L6 7L6 3.5L9.5 4.5L12 2Z" fill="url(#broker-grad)" opacity="0.15" stroke="url(#broker-grad)" strokeWidth="1.2" filter="url(#broker-glow)" />
            <path d="M9 12L11 14L15 10" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {showLabel && <span className={`${textSizes[size]} font-bold text-cyan-400 uppercase tracking-wider`}>Dürüst Broker</span>}
      </span>
    );
  }

  // Oracle — holographic gold with shimmer
  return (
    <span className="inline-flex items-center gap-1">
      <motion.span
        className={`${iconSize} relative`}
        style={{ display: "inline-block" }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="oracle-grad" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="oracle-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M12 2L14.5 4.5L18 3.5L18 7L21 9L19.5 12L21 15L18 17L18 20.5L14.5 19.5L12 22L9.5 19.5L6 20.5L6 17L3 15L4.5 12L3 9L6 7L6 3.5L9.5 4.5L12 2Z" fill="url(#oracle-grad)" opacity="0.25" stroke="url(#oracle-grad)" strokeWidth="1.3" filter="url(#oracle-glow)" />
          <path d="M9 12L11 14L15 10" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Shimmer overlay */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.4) 50%, transparent 60%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />
      </motion.span>
      {showLabel && (
        <span className={`${textSizes[size]} font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent`}>
          The Oracle
        </span>
      )}
    </span>
  );
}
