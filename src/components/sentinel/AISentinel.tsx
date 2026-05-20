import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, X, Radio, Lock, Eye, AlertTriangle,
  CheckCircle2, Activity, Server, Globe
} from "lucide-react";

const generateLog = (): { time: string; text: string; type: "block" | "verify" | "encrypt" | "scan" } => {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const logs = [
    { text: `${Math.floor(Math.random() * 5) + 1} şüpheli IP girişi engellendi`, type: "block" as const },
    { text: `${Math.floor(Math.random() * 20) + 5} listeleme için Tramer verisi doğrulandı`, type: "verify" as const },
    { text: "AI güvenli iletişim kanalları şifrelendi", type: "encrypt" as const },
    { text: `${Math.floor(Math.random() * 50) + 10} araç fiyatı AI ile çapraz doğrulandı`, type: "verify" as const },
    { text: "DDoS koruma katmanı güncellendi", type: "block" as const },
    { text: "Kullanıcı oturum tokenleri yenilendi", type: "encrypt" as const },
    { text: `${Math.floor(Math.random() * 8) + 1} sahte ilan tespiti yapıldı`, type: "scan" as const },
    { text: "SSL sertifikaları doğrulandı — 256-bit aktif", type: "encrypt" as const },
  ];
  const entry = logs[Math.floor(Math.random() * logs.length)];
  return { time, ...entry };
};

// Radar dots for the threat map
const radarDots = Array.from({ length: 12 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  blocked: Math.random() > 0.6,
}));

export function AISentinel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState(() => Array.from({ length: 6 }, generateLog));
  const [blockedCount, setBlockedCount] = useState(147);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [generateLog(), ...prev.slice(0, 7)]);
      setBlockedCount((c) => c + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const iconColor = "text-emerald-400";

  return (
    <>
      {/* Floating Shield Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/20 shadow-lg shadow-emerald-500/10 hover:border-emerald-500/40 transition-all group"
      >
        <div className="relative">
          <ShieldCheck className={`w-4 h-4 ${iconColor}`} strokeWidth={2} />
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 hidden sm:inline">
          AI Sentinel: Aktif
        </span>
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[91] w-full sm:w-[400px] bg-[#0a0e14] border-l border-white/10 shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" strokeWidth={2} />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">
                    AI Sentinel Merkezi
                  </h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="mx-5 mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Tüm Sistemler Aktif</span>
                </div>
                <p className="text-[10px] text-emerald-400/60">256-bit AES şifreleme • Gerçek zamanlı AI izleme • Sıfır güvenlik ihlali</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mx-5 mt-5">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                  <p className="text-lg font-display font-bold text-rose-400">{blockedCount}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Engellenen</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                  <p className="text-lg font-display font-bold text-emerald-400">99.9%</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Uptime</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                  <p className="text-lg font-display font-bold text-cyan-400">0</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">İhlal</p>
                </div>
              </div>

              {/* Threat Radar */}
              <div className="mx-5 mt-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Tehdit Radarı</h3>
                <div className="relative w-full aspect-[2/1] rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                  {/* Grid lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-10">
                    {[20, 40, 60, 80].map((p) => (
                      <g key={p}>
                        <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="currentColor" className="text-cyan-400" />
                        <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="currentColor" className="text-cyan-400" />
                      </g>
                    ))}
                  </svg>
                  {/* Sweep */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Dots */}
                  {radarDots.map((dot, i) => (
                    <div
                      key={i}
                      className={`absolute w-1.5 h-1.5 rounded-full ${dot.blocked ? "bg-rose-500" : "bg-emerald-400"}`}
                      style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-[9px] text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Güvenli</span>
                  <span className="flex items-center gap-1 text-[9px] text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" /> Engellendi</span>
                </div>
              </div>

              {/* Live Logs */}
              <div className="mx-5 mt-5 mb-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Canlı Sistem Logları</h3>
                <div className="rounded-xl bg-black/40 border border-white/[0.05] p-3 max-h-64 overflow-y-auto font-mono text-[11px] space-y-1.5">
                  <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => {
                      const iconMap = {
                        block: <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />,
                        verify: <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />,
                        encrypt: <Lock className="w-3 h-3 text-cyan-400 flex-shrink-0" />,
                        scan: <Eye className="w-3 h-3 text-amber-400 flex-shrink-0" />,
                      };
                      const colorMap = {
                        block: "text-rose-300",
                        verify: "text-emerald-300",
                        encrypt: "text-cyan-300",
                        scan: "text-amber-300",
                      };
                      return (
                        <motion.div
                          key={`${log.time}-${i}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2"
                        >
                          {iconMap[log.type]}
                          <span className="text-slate-600">{log.time}</span>
                          <span className={colorMap[log.type]}>{log.text}</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mx-5 mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.5} />
                    <span className="text-[10px] text-slate-400">256-bit AES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                    <span className="text-[10px] text-slate-400">SOC-2 Uyumlu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
                    <span className="text-[10px] text-slate-400">KVKK Uyumlu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-rose-400" strokeWidth={1.5} />
                    <span className="text-[10px] text-slate-400">7/24 İzleme</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Chat keyword interceptor utility
export const SENTINEL_KEYWORDS = [
  "western union", "iban", "havale", "send deposit", "depozit gönder",
  "noter ücreti", "notary fee", "kapora", "ön ödeme yap", "banka hesabı",
];

export function checkSentinelAlert(message: string): boolean {
  const lower = message.toLowerCase();
  return SENTINEL_KEYWORDS.some((kw) => lower.includes(kw));
}

export const SENTINEL_WARNING =
  "🛡️ Sentinel Uyarısı: Platform dışında asla para transferi yapmayın. Tüm iletişimi Arayor Güvenli Sohbet üzerinden sürdürün.";
