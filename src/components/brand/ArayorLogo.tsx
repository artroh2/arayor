import { cn } from "@/lib/utils";

interface ArayorLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function ArayorLogo({ size = "md", showText = true, className }: ArayorLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 34, text: "text-xl" },
    lg: { icon: 48, text: "text-3xl" },
    xl: { icon: 72, text: "text-5xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Abstract "A" icon — upward trend + neural node */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="arayorGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <filter id="arayorGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main abstract "A" — ascending trend line with node */}
        <path
          d="M8 38 L24 8 L40 38"
          stroke="url(#arayorGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#arayorGlow)"
        />

        {/* Crossbar — horizontal data line */}
        <path
          d="M14 28 L34 28"
          stroke="url(#arayorGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Neural nodes at key intersections */}
        <circle cx="24" cy="8" r="2.5" fill="#06b6d4" opacity="0.9" />
        <circle cx="14" cy="28" r="1.8" fill="#0891b2" opacity="0.6" />
        <circle cx="34" cy="28" r="1.8" fill="#fbbf24" opacity="0.6" />

        {/* Subtle connecting lines — neural network feel */}
        <line x1="24" y1="8" x2="14" y2="28" stroke="#06b6d4" strokeWidth="0.5" opacity="0.2" />
        <line x1="24" y1="8" x2="34" y2="28" stroke="#fbbf24" strokeWidth="0.5" opacity="0.2" />
      </svg>

      {/* Text mark */}
      {showText && (
        <span className={cn("font-display font-bold tracking-tight text-foreground", s.text)}>
          arayor
          <span
            className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 align-middle"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #fbbf24)",
              boxShadow: "0 0 8px rgba(6,182,212,0.6)",
              marginBottom: "0.15em",
            }}
          />
        </span>
      )}
    </div>
  );
}
