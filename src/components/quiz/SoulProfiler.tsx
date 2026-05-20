import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronRight, Music, MapPin, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { vehicles } from "@/data/mockData";
import { VehicleCard } from "@/components/vehicles";

import neonCityBg from "@/assets/quiz/neon-city.jpg";
import mountainRoadBg from "@/assets/quiz/mountain-road.jpg";
import autobahnBg from "@/assets/quiz/autobahn.jpg";
import scanningBg from "@/assets/quiz/scanning-bg.jpg";

type QuizPhase = "quiz" | "scanning" | "result";

interface QuizOption {
  id: string;
  label: string;
  image: string;
  icon: React.ReactNode;
}

interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  background: string;
  icon: React.ReactNode;
  options: QuizOption[];
}

const questions: QuizQuestion[] = [
  {
    id: "vibe",
    title: "Zihniniz nereye kayıyor?",
    subtitle: "Hayal gücünüzü serbest bırakın",
    background: neonCityBg,
    icon: <MapPin className="w-5 h-5" />,
    options: [
      { id: "city", label: "Neon Şehir Geceleri", image: neonCityBg, icon: <Zap className="w-6 h-6" /> },
      { id: "mountain", label: "Sessiz Dağ Yolları", image: mountainRoadBg, icon: <MapPin className="w-6 h-6" /> },
      { id: "speed", label: "Yüksek Hız Otobahınları", image: autobahnBg, icon: <ChevronRight className="w-6 h-6" /> },
    ],
  },
  {
    id: "soundtrack",
    title: "Stereoda ne çalıyor?",
    subtitle: "Müziğiniz, ruhunuzu ele verir",
    background: autobahnBg,
    icon: <Music className="w-5 h-5" />,
    options: [
      { id: "bass", label: "Ağır Bas / Techno", image: neonCityBg, icon: <Zap className="w-6 h-6" /> },
      { id: "classical", label: "Klasik / Jazz", image: mountainRoadBg, icon: <Music className="w-6 h-6" /> },
      { id: "rock", label: "Yüksek Rock", image: autobahnBg, icon: <Sparkles className="w-6 h-6" /> },
    ],
  },
  {
    id: "companion",
    title: "Yolcu koltuğunda kim var?",
    subtitle: "Yolculuğunuzu tanımlayın",
    background: mountainRoadBg,
    icon: <Users className="w-5 h-5" />,
    options: [
      { id: "family", label: "Ailem", image: mountainRoadBg, icon: <Users className="w-6 h-6" /> },
      { id: "partner", label: "Partnerim", image: neonCityBg, icon: <Sparkles className="w-6 h-6" /> },
      { id: "solo", label: "Ben ve Yol", image: autobahnBg, icon: <Zap className="w-6 h-6" /> },
    ],
  },
];

interface ProfileResult {
  title: string;
  quote: string;
  vehicleIds: string[];
}

function getResult(answers: Record<string, string>): ProfileResult {
  const { vibe, companion } = answers;

  if (companion === "family") {
    return {
      title: "Aile Kaptanı",
      quote: "Güvenliğin gücünü ve estetiğin zarafetini arıyorsunuz. Ailenizi premium bir deneyimle taşıyan bu SUV, sizin mükemmel eşleşmeniz.",
      vehicleIds: ["5", "8", "18"],
    };
  }
  if (vibe === "city" || vibe === "speed") {
    return {
      title: "Yalnız Kurt",
      quote: "Dinamizmi, estetiği ve gecenin heyecanını arzuluyorsunuz. Karanlıkta parıldayan bu makine, ruhunuzun yansıması.",
      vehicleIds: ["2", "10", "14"],
    };
  }
  return {
    title: "Zen Gezgin",
    quote: "Huzur, doğa ve mükemmel yol tutuşu arıyorsunuz. Bu araç sizi ufuklara taşırken iç huzurunuzu koruyacak.",
    vehicleIds: ["3", "11", "9"],
  };
}

interface SoulProfilerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SoulProfiler({ isOpen, onClose }: SoulProfilerProps) {
  const [phase, setPhase] = useState<QuizPhase>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ProfileResult | null>(null);

  const handleSelect = useCallback(
    (questionId: string, optionId: string) => {
      const newAnswers = { ...answers, [questionId]: optionId };
      setAnswers(newAnswers);

      if (currentQ < questions.length - 1) {
        setTimeout(() => setCurrentQ((p) => p + 1), 400);
      } else {
        setPhase("scanning");
        setTimeout(() => {
          setResult(getResult(newAnswers));
          setPhase("result");
        }, 3000);
      }
    },
    [answers, currentQ]
  );

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPhase("quiz");
      setCurrentQ(0);
      setAnswers({});
      setResult(null);
    }, 300);
  };

  if (!isOpen) return null;

  const question = questions[currentQ];
  const matchedVehicles = result ? result.vehicleIds.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean) : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={handleClose} />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-[110] p-2 rounded-full bg-secondary/80 border border-border hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Progress */}
        {phase === "quiz" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[110] flex gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= currentQ ? "w-12 bg-primary" : "w-8 bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* QUIZ PHASE */}
        {phase === "quiz" && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-[105] w-full max-w-5xl mx-4 flex flex-col items-center"
          >
            {/* Background image */}
            <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden">
              <img
                src={question.background}
                alt=""
                className="w-full h-full object-cover opacity-20 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            <div className="flex items-center gap-2 mb-3 text-primary">
              {question.icon}
              <span className="text-sm font-medium uppercase tracking-widest">
                Soru {currentQ + 1} / {questions.length}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground text-center mb-2">
              {question.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-10">{question.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4">
              {question.options.map((opt) => {
                const selected = answers[question.id] === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(question.id, opt.id)}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-300 h-56 md:h-72 ${
                      selected
                        ? "border-primary shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={opt.image}
                      alt={opt.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="relative z-10 flex flex-col items-center justify-end h-full p-6">
                      <div className={`p-3 rounded-full mb-3 transition-colors ${
                        selected ? "bg-primary/30" : "bg-secondary/60"
                      }`}>
                        {opt.icon}
                      </div>
                      <span className="text-lg font-bold text-foreground">{opt.label}</span>
                    </div>
                    {selected && (
                      <motion.div
                        layoutId="selected-glow"
                        className="absolute inset-0 border-2 border-primary rounded-2xl"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SCANNING PHASE */}
        {phase === "scanning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-[105] flex flex-col items-center"
          >
            <img
              src={scanningBg}
              alt=""
              className="absolute inset-0 w-screen h-screen object-cover opacity-15 -z-10"
              style={{ position: "fixed", top: 0, left: 0 }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-2 border-primary/40 border-t-primary mb-8"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-[3.5rem] w-8 h-8 rounded-full bg-primary/30"
            />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Profil Oluşturuluyor...
            </h3>
            <p className="text-muted-foreground text-center">
              AI motorumuz sürüş ruhunuzu analiz ediyor
            </p>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULT PHASE */}
        {phase === "result" && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-[105] w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            {/* Hero match */}
            <div className="relative rounded-3xl overflow-hidden mb-8">
              <img
                src={matchedVehicles[0]?.image || ""}
                alt={matchedVehicles[0]?.model || ""}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-accent font-semibold uppercase tracking-widest text-sm">
                    Mükemmel Eşleşme
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-3">
                  {result.title}
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl italic">
                  "{result.quote}"
                </p>
              </div>
            </div>

            {/* Matched listings */}
            <div className="px-2">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Size Özel Aktif İlanlar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {matchedVehicles.map((v) =>
                  v ? <VehicleCard key={v.id} vehicle={v} /> : null
                )}
              </div>
              <div className="flex justify-center gap-4">
                <Link
                  to="/araclar"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  onClick={handleClose}
                >
                  Tüm Araçları Gör
                </Link>
                <button
                  onClick={() => {
                    setPhase("quiz");
                    setCurrentQ(0);
                    setAnswers({});
                    setResult(null);
                  }}
                  className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
