import { PrestigeBadge, PrestigeTier } from "./PrestigeBadge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Shield, TrendingUp, Calendar } from "lucide-react";

interface SellerHoverCardProps {
  children: React.ReactNode;
  sellerName: string;
  tier: PrestigeTier;
  trustScore: number;
  memberSince: string;
  cleanSales: number;
  totalSales: number;
}

export function SellerHoverCard({
  children,
  sellerName,
  tier,
  trustScore,
  memberSince,
  cleanSales,
  totalSales,
}: SellerHoverCardProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className="w-72 p-0 bg-[#0a0e14] border border-white/10 shadow-2xl shadow-black/50"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-amber-500/20 flex items-center justify-center text-sm font-bold text-slate-200">
              {sellerName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-100 truncate">{sellerName}</span>
                <PrestigeBadge tier={tier} size="sm" />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
                <span className="text-[10px] text-slate-500">Üye: {memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-3">
          {/* Trust Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.5} />
              <span className="text-xs text-slate-400">AI Güven Skoru</span>
            </div>
            <span className={`text-sm font-bold ${trustScore >= 95 ? "text-emerald-400" : trustScore >= 85 ? "text-cyan-400" : "text-slate-300"}`}>
              {trustScore}/100
            </span>
          </div>

          {/* Clean Sales */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
              <span className="text-xs text-slate-400">Temiz Satış</span>
            </div>
            <span className="text-sm font-bold text-slate-200">{cleanSales}/{totalSales}</span>
          </div>

          {/* AI Discrepancy */}
          <div className="px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/15">
            <p className="text-[10px] font-medium text-emerald-300 text-center">
              Son {Math.min(totalSales, 5)} satışta sıfır AI tutarsızlığı
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
