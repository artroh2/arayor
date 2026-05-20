import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Brain, Shield, Wrench, TrendingUp, TrendingDown,
  Clock, BarChart3, Car, ChevronLeft, DollarSign, Activity,
  Gauge, Heart, AlertTriangle, ThumbsUp, ThumbsDown, Zap, Store,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { getVehicleById, vehicles } from "@/data/mockData";

// AI character subtitles per category
const characterMap: Record<string, { subtitle: string; soul: string; verdict: string }> = {
  SUV: {
    subtitle: "Asfalt Gladyatörü",
    soul: "Şehir ormanlarının tartışmasız hakimi. Yüksek sürüş pozisyonu ve geniş görüş açısıyla trafikte güven, toprak yollarda ise cesaret veriyor. Aileler için taşınmaz bir kale; maceraperestler için sınır tanımaz bir yol arkadaşı.",
    verdict: "Bu araç güvenlik ve güç arayanlar için üretildi. Yakıt tüketimi yüksek olabilir, ama karşılığında aldığınız özgüven ve konfor, her kuruşa değer.",
  },
  Sedan: {
    subtitle: "Bavyera Bıçağı",
    soul: "Asfaltta bir neşter. Direksiyonu bir sinir ucu gibi hassas, virajlarda yeri yakar. Motor bakımı acımasız olabilir ama dinamik sürüşe değer veren ruhlar için biçilmiş kaftan.",
    verdict: "Sürüş tutkunlarının rüyası, muhasebecilerin kabusu. Bu arabayı almak bir yaşam tarzı beyanıdır — ya seversiniz, ya da anlayamazsınız.",
  },
  Hatchback: {
    subtitle: "Şehir Ninası",
    soul: "Kompakt bedende dev kalp. Dar sokaklarda dans eder, park yerlerini fısıldar. Görünüşe aldanmayın — bu küçük savaşçı, şehir hayatının tüm zorluklarına meydan okur.",
    verdict: "Pratiklik şampiyonu. Yakıt cimrisi, bakım dostu ve şaşırtıcı derecede eğlenceli. İlk aracını alan gençten tecrübeli şehir sürücüsüne kadar herkese hitap eder.",
  },
  Crossover: {
    subtitle: "Kameleon Savaşçı",
    soul: "SUV cesareti, sedan zarafeti. İki dünyanın en iyisini harmanlayan bu melez, hem ofis önünde hem dağ yolunda kendini evinde hisseder.",
    verdict: "Karar veremeyen değil, her şeyi isteyen için. Pratik, şık ve yeterince güçlü. Modern yaşamın gerçek cevabı.",
  },
  Elektrikli: {
    subtitle: "Sessiz Devrim",
    soul: "Geleceğin sesi: sessizlik. Anlık tork ile sırtınızı koltuğa yapıştırır, sıfır emisyon ile vicdanınızı rahatlatır. Şarj altyapısı gelişiyor, sabırlı olanlar kazanacak.",
    verdict: "Erken adaptörler için altın fırsat. Düşük işletme maliyetleri 3 yılda farkını ortaya koyuyor. Cesur olun, geleceğe yatırım yapın.",
  },
};

function getCharacter(category: string) {
  return characterMap[category] || characterMap["Sedan"];
}

// Radar data for "The Wallet"
function getWalletData() {
  return [
    { subject: "Bakım", value: 60 + Math.floor(Math.random() * 30), fullMark: 100 },
    { subject: "Değer Kaybı", value: 40 + Math.floor(Math.random() * 40), fullMark: 100 },
    { subject: "Sigorta", value: 50 + Math.floor(Math.random() * 35), fullMark: 100 },
    { subject: "Yakıt", value: 30 + Math.floor(Math.random() * 50), fullMark: 100 },
    { subject: "Yedek Parça", value: 45 + Math.floor(Math.random() * 40), fullMark: 100 },
    { subject: "Vergi", value: 50 + Math.floor(Math.random() * 30), fullMark: 100 },
  ];
}

// 12-month price history
function getPriceHistory(basePrice: number) {
  const months = ["Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara","Oca","Şub","Mar"];
  let p = basePrice * 0.9;
  return months.map(m => {
    p += (Math.random() - 0.35) * basePrice * 0.02;
    return { month: m, value: Math.round(p) };
  });
}

function formatTL(v: number) {
  return new Intl.NumberFormat("tr-TR").format(v) + " ₺";
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function AIVehicleDossier() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vehicle = getVehicleById(id || "");

  const character = useMemo(() => getCharacter(vehicle?.category || "Sedan"), [vehicle?.category]);
  const walletData = useMemo(() => getWalletData(), []);
  const numericPrice = useMemo(() => parseInt((vehicle?.price || "0").replace(/[^0-9]/g, "")) || 1500000, [vehicle?.price]);
  const priceHistory = useMemo(() => getPriceHistory(numericPrice), [numericPrice]);
  const lastPrice = priceHistory[priceHistory.length - 1]?.value ?? 0;
  const trendUp = lastPrice >= numericPrice * 0.9;

  if (!vehicle) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-[#070b14]">
          <div className="text-center">
            <p className="text-white/40 mb-4">Araç bulunamadı.</p>
            <Button variant="outline" onClick={() => navigate("/araclar")} className="border-white/10 text-white/50">
              Araçlara Dön
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Market reality dummy stats
  const activeListings = 127 + Math.floor(Math.random() * 200);
  const avgDaysToSell = 18 + Math.floor(Math.random() * 25);
  const priceRange = { low: Math.round(numericPrice * 0.88), high: Math.round(numericPrice * 1.12) };

  return (
    <Layout>
      <div className="bg-[#070b14] min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/40 to-transparent" />

          {/* Back button */}
          <div className="absolute top-6 left-6 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1.5 bg-black/40 backdrop-blur-md border-white/10 text-white/70 hover:bg-black/60 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" /> Geri
            </Button>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-16">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm mb-4">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-blue-300/80">AI Vehicle Dossier</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] break-words">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="font-display text-base sm:text-xl md:text-2xl mt-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent font-semibold italic">
                "{character.subtitle}"
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-white/30">
                <span>{vehicle.year}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{vehicle.specs.engine}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{vehicle.specs.fuel}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="font-semibold text-white/50">{vehicle.price}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Column 1: The Soul */}
            <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <h2 className="font-display text-lg font-bold text-white/80">The Soul</h2>
                </div>

                <p className="text-sm text-white/40 leading-relaxed mb-6">
                  {character.soul}
                </p>

                {/* Pros */}
                <div className="mb-5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300/70 uppercase tracking-wider">Güçlü Yanlar</span>
                  </div>
                  <ul className="space-y-2">
                    {vehicle.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/35">
                        <span className="text-emerald-400 mt-0.5">+</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <ThumbsDown className="w-3.5 h-3.5 text-red-400/60" />
                    <span className="text-xs font-semibold text-red-300/50 uppercase tracking-wider">Dikkat Edilmeli</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs text-white/35">
                      <span className="text-red-400/60 mt-0.5">−</span> Yedek parça maliyeti ortalamanın üstünde
                    </li>
                    <li className="flex items-start gap-2 text-xs text-white/35">
                      <span className="text-red-400/60 mt-0.5">−</span> Servis randevu süreleri uzun olabiliyor
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Column 2: The Wallet */}
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <h2 className="font-display text-lg font-bold text-white/80">The Wallet</h2>
                </div>
                <p className="text-xs text-white/25 mb-6">Tahmini sahip olma maliyeti analizi (AI skorları)</p>

                <div className="h-[200px] sm:h-[220px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={walletData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
                      />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Cost breakdown */}
                <div className="space-y-3 mt-4">
                  {[
                    { label: "Yıllık Bakım", value: "18.500 ₺", icon: Wrench, color: "text-blue-400" },
                    { label: "Tahmini Değer Kaybı", value: "%12/yıl", icon: TrendingDown, color: "text-red-400/60" },
                    { label: "Kasko Primi", value: "32.000 ₺/yıl", icon: Shield, color: "text-amber-400" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                        <span className="text-xs text-white/35">{item.label}</span>
                      </div>
                      <span className="text-xs font-medium text-white/50">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Column 3: The Market Reality */}
            <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.6 }}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h2 className="font-display text-lg font-bold text-white/80">The Market Reality</h2>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: "Aktif İlan", value: activeListings.toString(), icon: Car },
                    { label: "Ort. Satış Süresi", value: `${avgDaysToSell} gün`, icon: Clock },
                    { label: "En Düşük", value: formatTL(priceRange.low), icon: TrendingDown },
                    { label: "En Yüksek", value: formatTL(priceRange.high), icon: TrendingUp },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <s.icon className="w-3.5 h-3.5 text-white/20 mb-2" />
                      <p className="font-display font-bold text-lg text-white/70">{s.value}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Mini price chart */}
                <div className="h-[100px] sm:h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                      <defs>
                        <linearGradient id="dossierGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.15)" }} />
                      <YAxis hide domain={["dataMin - 30000", "dataMax + 30000"]} />
                      <Tooltip
                        contentStyle={{ background: "rgba(10,15,28,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
                        formatter={(v: number) => [formatTL(v), "Değer"]}
                      />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} fill="url(#dossierGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
            </motion.div>
          </div>

          {/* The Verdict */}
          <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.6 }} className="mt-10">
            <div className="relative rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-500/[0.05] to-indigo-500/[0.03] p-6 sm:p-8 md:p-12 text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/5 rounded-full blur-[100px]" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300/70 tracking-wider uppercase">The Verdict</span>
                </div>
                <blockquote className="font-display text-base sm:text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto italic">
                  "{character.verdict}"
                </blockquote>
                <p className="text-xs text-white/20 mt-4">— Arayor AI Automotive Oracle</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp} transition={{ delay: 0.7, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 mt-10 max-w-2xl mx-auto">
            <Button
              onClick={() => navigate(`/araclar?marka=${vehicle.brandId}`)}
              className="flex-1 h-14 gap-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            >
              <Car className="w-5 h-5" />
              En Temiz {vehicle.brand} {vehicle.model}'ları Göster
            </Button>
            <Button
              onClick={() => navigate("/degerleme")}
              variant="outline"
              className="flex-1 h-14 gap-2 text-base border-white/[0.08] bg-transparent text-white/50 hover:bg-white/5 hover:text-white rounded-xl"
            >
              <Gauge className="w-5 h-5" />
              Değerleme Yap
            </Button>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}
