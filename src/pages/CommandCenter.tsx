import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, TrendingUp, TrendingDown, Car, BarChart3,
  RefreshCw, Eye, Zap, Target, Clock, ArrowRight, MessageSquare,
  Send, Bot, Shield,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AITrustScore, getVehicleTrustScore } from "@/components/ai/AITrustScore";
import { vehicles } from "@/data/mockData";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";

// Generate sparkline data
function genSparkline(trend: "up" | "down") {
  const data = [];
  let v = 1400000 + Math.random() * 200000;
  for (let i = 0; i < 30; i++) {
    v += (trend === "up" ? 1 : -1) * (Math.random() * 8000 - 3000);
    data.push({ d: i, v: Math.round(v) });
  }
  return data;
}

// Stealth match badges
const matchBadges = ["Yüksek ROI Potansiyeli", "Piyasa Altı Fiyat", "Yeni İlan", "Hızlı Değer Artışı"];

// Dummy garage cars
const garageCars = [
  { id: "peugeot-3008", brand: "Peugeot", model: "3008 Allure", year: 2022, price: "1.450.000 ₺", image: vehicles[0]?.image, trend: "up" as const },
];

// AI Oracle hints for negotiation
const oracleHints = [
  { type: "info" as const, text: "Bu teklif adil piyasa değerinin %4 altında. Satıcının kabul etme olasılığı yüksek." },
  { type: "warning" as const, text: "Bu araçın benzer kilometredeki ortalama fiyatı 1.520.000 ₺. Mevcut fiyat avantajlı." },
  { type: "success" as const, text: "Satıcının güven skoru 94/100. Hızlı ve güvenilir bir işlem bekleniyor." },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function formatTL(v: number) {
  return new Intl.NumberFormat("tr-TR").format(v) + " ₺";
}

export default function CommandCenter() {
  const navigate = useNavigate();
  const stealthMatches = useMemo(() => vehicles.slice(5, 9), []);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "seller", text: "Merhaba, araç hâlâ satılık mı?", time: "14:02" },
    { id: 2, sender: "buyer", text: "Evet, son fiyat 1.450.000 TL.", time: "14:05" },
    { id: 3, sender: "oracle", text: oracleHints[0].text, type: oracleHints[0].type },
    { id: 4, sender: "seller", text: "1.400.000 TL olur mu?", time: "14:08" },
    { id: 5, sender: "oracle", text: oracleHints[1].text, type: oracleHints[1].type },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { id: prev.length + 1, sender: "buyer", text: chatInput, time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setChatInput("");
    // Add AI hint after a delay
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { id: prev.length + 1, sender: "oracle", text: oracleHints[2].text, type: oracleHints[2].type },
      ]);
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-[#070b14] min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
          {/* Header */}
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm mb-4">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300/90 tracking-wide">Personal AI Command Center</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 break-words">
              Hoş Geldiniz, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Komutan</span>
            </h1>
            <p className="text-white/30 mt-2">AI portföy yöneticiniz hazır. Piyasa sürekli taranıyor.</p>
          </motion.div>

          {/* Section 1: AI Stealth Matches */}
          <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <h2 className="font-display text-lg font-bold text-white/70">AI Stealth Matches</h2>
              </div>
              <span className="text-xs text-white/20">Son güncelleme: 3 dk önce</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stealthMatches.map((vehicle, i) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                >
                  <Link
                    to={`/dosya/${vehicle.id}`}
                    className="block rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-blue-500/20 transition-all group"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
                        {matchBadges[i % matchBadges.length]}
                      </span>
                      <div className="absolute top-2 right-2">
                        <AITrustScore score={getVehicleTrustScore(vehicle.id)} size="sm" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-blue-400/60 font-medium">{vehicle.brand}</p>
                      <p className="font-display font-bold text-sm text-white/80 truncate">{vehicle.model} <span className="text-white/30 font-normal">{vehicle.year}</span></p>
                      <p className="text-sm font-semibold mt-1 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{vehicle.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Section 2: My Garage */}
          <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.5 }} className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Car className="w-4 h-4 text-amber-400" />
              <h2 className="font-display text-lg font-bold text-white/70">Garajım (Portföy)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {garageCars.map((car) => {
                const sparkData = genSparkline(car.trend);
                const lastVal = sparkData[sparkData.length - 1].v;
                const firstVal = sparkData[0].v;
                const diff = lastVal - firstVal;
                const isUp = diff >= 0;

                return (
                  <div key={car.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5">
                    <div className="w-full sm:w-32 h-40 sm:h-24 rounded-xl overflow-hidden bg-white/[0.03] shrink-0">
                      <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/30">{car.brand}</p>
                      <p className="font-display font-bold text-white/80">{car.model} <span className="text-white/30 font-normal">{car.year}</span></p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-display font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{car.price}</span>
                        <span className={`text-xs font-medium flex items-center gap-0.5 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isUp ? "+" : ""}{formatTL(Math.abs(diff))}
                        </span>
                      </div>
                      {/* Sparkline */}
                      <div className="h-[40px] mt-2 -mx-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparkData}>
                            <Line type="monotone" dataKey="v" stroke={isUp ? "#10b981" : "#f87171"} strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col justify-start sm:justify-center shrink-0">
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 rounded-lg"
                        onClick={() => navigate("/degerleme")}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Yeniden Değerle
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Add car placeholder */}
              <button
                onClick={() => navigate("/degerleme")}
                className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-500/20 hover:bg-white/[0.02] transition-all"
              >
                <Car className="w-8 h-8 text-white/10" />
                <span className="text-sm text-white/20 font-medium">Araç Ekle</span>
              </button>
            </div>
          </motion.div>

          {/* Section 3: Negotiation Room */}
          <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h2 className="font-display text-lg font-bold text-white/70">AI Müzakere Odası</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/15 ml-2">Güvenli Kanal</span>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f1c]/80 backdrop-blur-xl overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">Ahmet Y. · Peugeot 3008</p>
                    <p className="text-[10px] text-white/25">Trust Score: 94 · Son görülme: 2 dk</p>
                  </div>
                </div>
                <AITrustScore score={94} size="sm" />
              </div>

              {/* Messages */}
              <div className="h-[320px] overflow-y-auto p-5 space-y-3 custom-scrollbar">
                {chatMessages.map((msg) => {
                  if (msg.sender === "oracle") {
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center"
                      >
                        <div className="inline-flex items-start gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/[0.06] to-indigo-500/[0.04] border border-blue-500/[0.1] max-w-[90%]">
                          <Bot className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-300/60 leading-relaxed">{msg.text}</p>
                        </div>
                      </motion.div>
                    );
                  }
                  const isBuyer = msg.sender === "buyer";
                  return (
                    <div key={msg.id} className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                        isBuyer
                          ? "bg-blue-600/20 border border-blue-500/15 rounded-br-md"
                          : "bg-white/[0.04] border border-white/[0.06] rounded-bl-md"
                      }`}>
                        <p className="text-sm text-white/60">{msg.text}</p>
                        <p className="text-[10px] text-white/15 mt-1 text-right">{msg.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="border-t border-white/[0.06] p-3 flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 border-white/[0.06] bg-white/[0.02] text-white/70 placeholder:text-white/15 focus-visible:ring-blue-500/30 focus-visible:ring-1 h-10"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
