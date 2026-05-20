import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeftRight, Check, TrendingUp, FileText, BarChart3, Heart, MapPin, Gauge } from "lucide-react";
import { AITrustScore, getVehicleTrustScore } from "@/components/ai/AITrustScore";
import { Vehicle, getActualReviewCount } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompare } from "@/contexts/CompareContext";
import { useFavorites } from "@/hooks/useFavorites";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

// AI verdict generator based on vehicle characteristics
function getAIVerdict(vehicle: Vehicle): string {
  const verdicts: Record<string, string> = {
    SUV: `Asfalt hakimi. Geniş iç hacmi ve yüksek sürüş pozisyonuyla şehir trafiğinde özgüven veriyor; engebeli yollarda ise adeta dans ediyor. Aile dostu yapısıyla uzun yolculuklarda bile konfor sunuyor.`,
    Sedan: `Zarif bir yol arkadaşı. Dinamik sürüş karakteri ve rafine kabin kalitesiyle her kilometre bir zevke dönüşüyor. Yakıt ekonomisi ve düşük bakım maliyetleri bütçe dostunuz olacak.`,
    Hatchback: `Şehrin çevik canavarı. Kompakt boyutları park kolaylığı sağlarken, sürpriz derecede geniş iç hacmi pratikliği ön plana çıkarıyor. Günlük kullanımın şampiyonu.`,
    Crossover: `İki dünyanın en iyisi. SUV duruşunu sedan konforu ile harmanlayan bu araç, hem şehir içi hem şehir dışı maceralarınızda yanınızda. Çok yönlü bir yaşam partneri.`,
    Elektrikli: `Geleceğin sessiz gücü. Sıfır emisyon ve anlık tork ile sürüş deneyimini yeniden tanımlıyor. Düşük işletme maliyetleri uzun vadede cebinizi güldürecek.`,
    Pickup: `Güç ve dayanıklılığın simgesi. İş ve macera arasında köprü kuran bu araç, zorlu arazilerde bile sarsılmaz bir güven sunuyor. Yüksek çekiş kapasitesi ile her yüke hazır.`,
  };
  return verdicts[vehicle.category] || verdicts["Sedan"];
}

// Generate predictive pricing data
function generatePriceData(priceStr: string) {
  const numericPrice = parseInt(priceStr.replace(/[^0-9]/g, ""));
  const base = numericPrice || 1500000;
  const trend = Math.random() > 0.4 ? 1 : -1;
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz"];
  return months.map((month, i) => {
    const change = trend * (i * (base * 0.008 + Math.random() * base * 0.005));
    return {
      month,
      actual: i === 0 ? base : null,
      forecast: Math.round(base + change),
    };
  });
}

function formatTL(val: number) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M ₺`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K ₺`;
  return `${val} ₺`;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCompare, isInCompare, getCompareSlot, vehicle1, vehicle2 } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const reviewCount = getActualReviewCount(vehicle.id);
  const [isHovered, setIsHovered] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavLoading(true);
    const result = await toggleFavorite(vehicle.id);
    setFavLoading(false);
    if (result.needsLogin) {
      toast.error("Favorilere eklemek için giriş yapmalısınız.");
    } else if (result.success) {
      if (isFavorite(vehicle.id)) {
        toast.success("Favorilerden kaldırıldı.");
      } else {
        toast.success("Favorilere eklendi! ❤️");
      }
    }
  };

  const inCompare = isInCompare(vehicle.id);
  const slot = getCompareSlot(vehicle.id);

  const priceData = useMemo(() => generatePriceData(vehicle.price), [vehicle.price]);
  const aiVerdict = useMemo(() => getAIVerdict(vehicle), [vehicle.category]);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(vehicle);
    if (vehicle1 && !vehicle2) {
      setTimeout(() => navigate("/karsilastir"), 500);
    }
  };

  const lastForecast = priceData[priceData.length - 1]?.forecast ?? 0;
  const firstForecast = priceData[0]?.forecast ?? 0;
  const trendUp = lastForecast >= firstForecast;

  return (
    <motion.div
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
    >
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-500",
          "bg-card border border-border",
          isHovered && "border-primary/30 shadow-glow"
        )}
      >
        {/* Favorite Button */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute top-3 left-3 z-10 w-8 h-8",
            isFavorite(vehicle.id)
              ? "bg-red-500/90 text-white border-red-400 hover:bg-red-600"
              : "bg-black/60 backdrop-blur-sm border-white/10 text-white/70 hover:bg-white/10 hover:text-red-400"
          )}
          onClick={handleFavoriteClick}
          disabled={favLoading}
        >
          <Heart className={cn("w-4 h-4", isFavorite(vehicle.id) && "fill-current")} />
        </Button>

        {/* Compare Button */}
        <Button
          variant={inCompare ? "default" : "outline"}
          size="sm"
          className={cn(
            "absolute top-3 right-3 z-10 gap-1.5 text-xs",
            inCompare
              ? "bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
              : "bg-black/60 backdrop-blur-sm border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          )}
          onClick={handleCompareClick}
        >
          {inCompare ? (
            <>
              <Check className="w-3.5 h-3.5" />
              {slot}. Araç
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Karşılaştır
            </>
          )}
        </Button>

        <Link to={`/arac/${vehicle.id}`} className="block">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className={cn(
                "w-full h-full object-cover transition-transform duration-700",
                isHovered && "scale-105"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white/80 border border-white/[0.08]">
                {vehicle.category}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary/70 font-medium tracking-wider uppercase">
                  {vehicle.brand}
                </p>
                <h3 className="font-display font-bold text-lg text-white/90 mt-0.5 leading-tight">
                  {vehicle.model}{" "}
                  <span className="font-normal text-white/40">{vehicle.year}</span>
                </h3>
              </div>
              <AITrustScore score={getVehicleTrustScore(vehicle.id)} size="sm" />
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-white/35">
              <span>{vehicle.specs.engine}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{vehicle.specs.transmission}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{vehicle.specs.fuel}</span>
            </div>
            <p className="font-display font-bold text-xl mt-3 text-accent">
              {vehicle.price}
            </p>
            {(vehicle.km || vehicle.city) && (
              <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30">
                {vehicle.km && (
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    {vehicle.km.toLocaleString("tr-TR")} km
                  </span>
                )}
                {vehicle.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {vehicle.city}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* AI Verdict */}
          <div className="mx-4 mb-3 p-4 rounded-xl bg-primary/[0.06] border border-primary/[0.1]">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary/80 tracking-wide">
                AI Verdict
              </span>
            </div>
            <p className="text-xs text-white/45 leading-relaxed line-clamp-3">
              {aiVerdict}
            </p>
          </div>

          {/* Predictive Pricing Chart */}
          <div className="mx-4 mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingUp className={cn("w-3.5 h-3.5", trendUp ? "text-emerald-400" : "text-red-400")} />
                <span className="text-xs font-medium text-white/40">
                  AI 6 Aylık Değer Tahmini
                </span>
              </div>
              <span className={cn("text-xs font-semibold", trendUp ? "text-emerald-400" : "text-red-400")}>
                {trendUp ? "↑" : "↓"} {formatTL(Math.abs(lastForecast - firstForecast))}
              </span>
            </div>
            <div className="h-[80px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)" }}
                  />
                  <YAxis hide domain={["dataMin - 20000", "dataMax + 20000"]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,15,28,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.7)",
                    }}
                    formatter={(value: number) => [formatTL(value), "Tahmin"]}
                    labelStyle={{ color: "rgba(255,255,255,0.4)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke={trendUp ? "#34d399" : "#f87171"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: trendUp ? "#34d399" : "#f87171",
                      stroke: "rgba(0,0,0,0.3)",
                      strokeWidth: 2,
                    }}
                    isAnimationActive={isHovered}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="px-4 pb-5 flex flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 border-0 text-primary-foreground shadow-glow h-10 sm:h-9"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/dosya/${vehicle.id}`);
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            AI Rapor & İletişim
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs border-white/[0.08] bg-transparent text-white/50 hover:bg-white/5 hover:text-white/80 hover:border-white/15 h-10 sm:h-9"
            onClick={handleCompareClick}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Piyasa Karşılaştır
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
