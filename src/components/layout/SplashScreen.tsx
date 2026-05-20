import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"dot" | "line" | "logo" | "exit">("dot");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("line"), 400),
      setTimeout(() => setPhase("logo"), 900),
      setTimeout(() => setPhase("exit"), 2200),
      setTimeout(() => onComplete(), 2700),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "#050810" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient glow */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* ── Phase 1: Glowing dot ── */}
            <motion.div
              className="absolute"
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase === "dot" ? 1 : 0,
                scale: phase === "dot" ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: "#06b6d4",
                  boxShadow: "0 0 20px rgba(6,182,212,0.8), 0 0 60px rgba(6,182,212,0.4)",
                }}
              />
            </motion.div>

            {/* ── Phase 2: Laser line ── */}
            <motion.div
              className="absolute"
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: phase === "line" || phase === "logo" ? 280 : 0,
                opacity: phase === "line" ? 1 : phase === "logo" ? 0.3 : 0,
                height: 2,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, #06b6d4, #fbbf24, #06b6d4, transparent)",
                  boxShadow: "0 0 15px rgba(6,182,212,0.6), 0 0 40px rgba(6,182,212,0.2)",
                }}
              />
            </motion.div>

            {/* ── Phase 3: Logo reveal ── */}
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: phase === "logo" ? 1 : 0,
                y: phase === "logo" ? 0 : 20,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Abstract A icon */}
              <svg
                width="72"
                height="72"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="splashGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <filter id="splashGlow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M8 38 L24 8 L40 38"
                  stroke="url(#splashGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#splashGlow)"
                />
                <path
                  d="M14 28 L34 28"
                  stroke="url(#splashGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <circle cx="24" cy="8" r="2.5" fill="#06b6d4" opacity="0.9" />
                <circle cx="14" cy="28" r="1.8" fill="#0891b2" opacity="0.6" />
                <circle cx="34" cy="28" r="1.8" fill="#fbbf24" opacity="0.6" />
              </svg>

              {/* Brand text */}
              <div className="flex items-baseline gap-0">
                <span
                  className="font-display text-4xl md:text-5xl font-bold tracking-tight"
                  style={{ color: "#f8fafc" }}
                >
                  arayor
                </span>
                <span
                  className="inline-block w-2 h-2 rounded-full mx-1"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #fbbf24)",
                    boxShadow: "0 0 10px rgba(6,182,212,0.7)",
                    marginBottom: "0.2em",
                  }}
                />
                <span
                  className="font-display text-4xl md:text-5xl font-bold tracking-tight"
                  style={{ color: "rgba(248,250,252,0.35)" }}
                >
                  com
                </span>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "logo" ? 0.4 : 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xs font-mono tracking-[0.25em] uppercase"
                style={{ color: "rgba(6,182,212,0.5)" }}
              >
                Initializing Automotive AI Oracle...
              </motion.p>
            </motion.div>
          </div>

          {/* Scan line ambient effect */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent)",
            }}
            initial={{ top: "40%" }}
            animate={{ top: "60%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
