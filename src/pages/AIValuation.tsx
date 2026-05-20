import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Store,
  Zap,
  Brain,
  BarChart3,
  Car,
  Paintbrush,
  Camera,
  Upload,
  X,
  Check,
  ChevronDown,
  Fuel,
  Settings2,
  Palette,
  Calendar,
  Shield,
  AlertTriangle,
  ImagePlus,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { brands } from "@/data/mockData";

type WizardStep = 1 | 2 | 3 | 4;

// Brand → Model mapping
const brandModels: Record<string, string[]> = {
  Toyota: ["Corolla", "Corolla Cross", "C-HR", "RAV4", "Yaris", "Camry", "Land Cruiser"],
  Honda: ["Civic", "CR-V", "HR-V", "Jazz", "Accord", "Prelude"],
  BMW: ["3 Serisi", "5 Serisi", "X1", "X3", "X5", "X7", "4 Serisi", "i4", "iX"],
  Mercedes: ["A Serisi", "C Serisi", "E Serisi", "GLA", "GLC", "GLE", "S Serisi", "EQE"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  Volkswagen: ["Golf", "Passat", "Tiguan", "T-Roc", "Polo", "ID.4", "ID.7"],
  Ford: ["Focus", "Kuga", "Puma", "Ranger", "Mustang", "Capri"],
  Hyundai: ["Tucson", "Kona", "i20", "i30", "Ioniq 5", "Ioniq 6", "Bayon", "Santa Fe"],
  Renault: ["Clio", "Megane", "Captur", "Austral", "Koleos", "Taliant", "Megane E-Tech"],
  Peugeot: ["208", "308", "2008", "3008", "408", "508", "e-208"],
  Kia: ["Sportage", "Ceed", "Niro", "Stonic", "EV6", "Sorento", "Picanto"],
  Volvo: ["XC40", "XC60", "XC90", "S60", "V60", "C40", "EX30"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Togg: ["T10X", "T10F"],
  Skoda: ["Octavia", "Superb", "Kodiaq", "Karoq", "Kamiq", "Fabia"],
  Nissan: ["Qashqai", "Juke", "X-Trail", "Leaf", "Ariya"],
  Mazda: ["CX-5", "CX-30", "3", "CX-60", "MX-5", "CX-80"],
  Dacia: ["Duster", "Jogger", "Sandero", "Spring"],
  Porsche: ["Cayenne", "Macan", "Taycan", "911", "Panamera"],
  Opel: ["Corsa", "Astra", "Mokka", "Crossland", "Grandland", "Frontera"],
  Citroen: ["C3", "C4", "C5 Aircross", "Berlingo", "ë-C3"],
  BYD: ["Dolphin", "Seal", "Atto 3", "Han", "Tang"],
  Chery: ["Tiggo 7 Pro", "Tiggo 8 Pro", "Omoda 5", "Arrizo 6"],
  Ferrari: ["Roma", "SF90", "296 GTB", "F80"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Junior"],
  Chevrolet: ["Corvette"],
};

const fuelTypes = ["Benzin", "Dizel", "Hybrid", "Elektrik", "LPG"];
const transmissions = ["Manuel", "Otomatik"];
const colors = ["Beyaz", "Siyah", "Gri", "Kırmızı", "Mavi", "Yeşil", "Lacivert", "Gümüş", "Kahverengi", "Turuncu"];
const paintOptions = ["Orijinal", "Kısmi Boyalı", "Tam Boyalı"];

const photoSlots = [
  { id: "front", label: "Ön Görünüm", required: true },
  { id: "rear", label: "Arka Görünüm", required: true },
  { id: "right", label: "Sağ Yan", required: true },
  { id: "left", label: "Sol Yan", required: true },
  { id: "interior", label: "İç Mekan", required: false },
  { id: "dashboard", label: "Gösterge Paneli", required: false },
];

const processingPhrases = [
  "14.203 aktif ilan taranıyor...",
  "Enflasyon oranları hesaplanıyor...",
  "Fotoğraflar AI ile analiz ediliyor...",
  "6 aylık değer kaybı eğrileri kontrol ediliyor...",
  "Hasar geçmişi verileri eşleştiriliyor...",
  "Piyasa karşılaştırması yapılıyor...",
  "Benzer araç ilanları bulunuyor...",
  "AI modeli değerleme sonucunu hesaplıyor...",
];

function generateHistoricalData(basePrice: number) {
  const months = [
    "Nis'24","May'24","Haz'24","Tem'24","Ağu'24","Eyl'24",
    "Eki'24","Kas'24","Ara'24","Oca'25","Şub'25","Mar'25",
  ];
  let price = basePrice * 0.88;
  return months.map((month) => {
    price += (Math.random() - 0.35) * basePrice * 0.025;
    return { month, value: Math.round(price) };
  });
}

function formatTL(val: number) {
  return new Intl.NumberFormat("tr-TR").format(val) + " TL";
}

const similarListings = [
  { title: "2023 Peugeot 3008 1.6 PureTech", km: "32.000", price: "1.520.000 ₺", location: "İstanbul", img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=200&fit=crop" },
  { title: "2022 Peugeot 3008 1.5 BlueHDi", km: "58.000", price: "1.380.000 ₺", location: "Ankara", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop" },
  { title: "2024 Peugeot 3008 Hybrid", km: "12.000", price: "1.690.000 ₺", location: "İzmir", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=300&h=200&fit=crop" },
];

// Step labels for progress
const stepLabels = [
  { num: 1, label: "Araç Bilgileri", icon: Car },
  { num: 2, label: "Durum Bilgisi", icon: Shield },
  { num: 3, label: "Fotoğraflar", icon: Camera },
  { num: 4, label: "AI Sonuç", icon: Brain },
];

export default function AIValuation() {
  const [step, setStep] = useState<WizardStep>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Step 1 state
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [version, setVersion] = useState("");
  const [km, setKm] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");

  // Step 2 state
  const [hasDamage, setHasDamage] = useState<boolean | null>(null);
  const [paintStatus, setPaintStatus] = useState("");
  const [hasReplacedParts, setHasReplacedParts] = useState<boolean | null>(null);
  const [replacedPartsDetail, setReplacedPartsDetail] = useState("");
  const [lastInspection, setLastInspection] = useState("");

  // Step 3 state
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoSlot, setActivePhotoSlot] = useState<string | null>(null);

  // Result data
  const trueValueMin = 1_420_000;
  const trueValueMax = 1_550_000;
  const trueValue = 1_485_000;
  const dealerOffer = 1_350_000;
  const difference = trueValue - dealerOffer;
  const historicalData = generateHistoricalData(trueValue);

  const availableModels = selectedBrand ? (brandModels[selectedBrand] || []) : [];
  const years = Array.from({ length: 15 }, (_, i) => (2026 - i).toString());

  // Processing animation
  useEffect(() => {
    if (!isProcessing) return;
    if (processingIndex >= processingPhrases.length) {
      const t = setTimeout(() => {
        setIsProcessing(false);
        setShowResult(true);
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProcessingIndex((i) => i + 1), 600);
    return () => clearTimeout(t);
  }, [isProcessing, processingIndex]);

  const handlePhotoUpload = (slotId: string) => {
    setActivePhotoSlot(slotId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activePhotoSlot) {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => ({ ...prev, [activePhotoSlot]: url }));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (slotId: string) => {
    setPhotos((prev) => {
      const next = { ...prev };
      if (next[slotId]) {
        URL.revokeObjectURL(next[slotId]);
        delete next[slotId];
      }
      return next;
    });
  };

  const startProcessing = () => {
    setProcessingIndex(0);
    setIsProcessing(true);
    setStep(4);
  };

  const resetForm = () => {
    setStep(1);
    setShowResult(false);
    setIsProcessing(false);
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
    setVersion("");
    setKm("");
    setFuelType("");
    setTransmission("");
    setColor("");
    setHasDamage(null);
    setPaintStatus("");
    setHasReplacedParts(null);
    setReplacedPartsDetail("");
    setLastInspection("");
    setPhotos({});
  };

  const isStep1Valid = selectedBrand && selectedModel && selectedYear && km && fuelType && transmission;
  const isStep2Valid = hasDamage !== null && paintStatus && hasReplacedParts !== null;
  const uploadedCount = Object.keys(photos).length;
  const isStep3Valid = uploadedCount >= 4;

  const stepVariants = {
    initial: { opacity: 0, y: 40, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.97 },
  };

  return (
    <Layout>
      <div className="min-h-[90vh] bg-[#070b14] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px]" />

        <div className="relative container mx-auto px-4 py-10 md:py-16">
          {/* Header */}
          {!showResult && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm mb-5">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300/90 tracking-wide">AI Valuation Studio</span>
              </div>
              <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-4">
                <span className="text-white/90 block">Aracınızın gerçek değerini</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent pb-[0.15em]">
                  yapay zekâ ile keşfedin.
                </span>
              </h1>
            </motion.div>
          )}

          {/* Progress Indicator */}
          {!showResult && !isProcessing && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex items-center justify-between">
                {stepLabels.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = step === s.num;
                  const isDone = step > s.num;
                  return (
                    <div key={s.num} className="flex items-center flex-1 last:flex-initial">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isDone ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
                          isActive ? "bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]" :
                          "bg-white/[0.03] border-white/10 text-white/25"
                        }`}>
                          {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-[10px] md:text-xs font-medium hidden sm:block ${
                          isActive ? "text-blue-300" : isDone ? "text-emerald-300/60" : "text-white/20"
                        }`}>{s.label}</span>
                      </div>
                      {i < stepLabels.length - 1 && (
                        <div className={`flex-1 h-[2px] mx-2 md:mx-4 rounded-full transition-colors ${
                          step > s.num ? "bg-emerald-500/40" : "bg-white/[0.06]"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Wizard Container */}
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">

              {/* STEP 1: Vehicle Info */}
              {step === 1 && !isProcessing && !showResult && (
                <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 md:p-10">
                    <div className="flex items-center gap-2 mb-1 text-white/30 text-xs font-medium tracking-widest uppercase">
                      <Car className="w-4 h-4 text-blue-400" />
                      Adım 1 / 4
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white/90 mb-1">Araç Bilgileri</h2>
                    <p className="text-white/35 text-sm mb-8">Aracınızın temel bilgilerini giriniz.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                      {/* Brand */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Marka *</Label>
                        <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel(""); }}>
                          <SelectTrigger className="h-12 bg-[#0c1222] border-white/[0.08] text-white">
                            <SelectValue placeholder="Marka seçin" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c1222] border-white/[0.1]">
                            {brands.map((b) => (
                              <SelectItem key={b.id} value={b.name} className="text-white/80 focus:bg-white/10 focus:text-white">{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Model */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Model *</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                          <SelectTrigger className="h-12 bg-[#0c1222] border-white/[0.08] text-white disabled:opacity-30">
                            <SelectValue placeholder={selectedBrand ? "Model seçin" : "Önce marka seçin"} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c1222] border-white/[0.1]">
                            {availableModels.map((m) => (
                              <SelectItem key={m} value={m} className="text-white/80 focus:bg-white/10 focus:text-white">{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Year */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Yıl *</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger className="h-12 bg-[#0c1222] border-white/[0.08] text-white">
                            <SelectValue placeholder="Yıl seçin" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c1222] border-white/[0.1]">
                            {years.map((y) => (
                              <SelectItem key={y} value={y} className="text-white/80 focus:bg-white/10 focus:text-white">{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Version */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Versiyon / Donanım Paketi</Label>
                        <Input
                          value={version}
                          onChange={(e) => setVersion(e.target.value)}
                          placeholder="Örn: Allure, Elegance"
                          className="h-12 bg-[#0c1222] border-white/[0.08] text-white placeholder:text-white/15"
                        />
                      </div>

                      {/* KM */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Kilometre *</Label>
                        <Input
                          type="number"
                          value={km}
                          onChange={(e) => setKm(e.target.value)}
                          placeholder="Örn: 45000"
                          className="h-12 bg-[#0c1222] border-white/[0.08] text-white placeholder:text-white/15"
                        />
                      </div>

                      {/* Fuel Type */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Yakıt Tipi *</Label>
                        <Select value={fuelType} onValueChange={setFuelType}>
                          <SelectTrigger className="h-12 bg-[#0c1222] border-white/[0.08] text-white">
                            <SelectValue placeholder="Yakıt tipi seçin" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c1222] border-white/[0.1]">
                            {fuelTypes.map((f) => (
                              <SelectItem key={f} value={f} className="text-white/80 focus:bg-white/10 focus:text-white">{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Transmission */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Şanzıman *</Label>
                        <Select value={transmission} onValueChange={setTransmission}>
                          <SelectTrigger className="h-12 bg-[#0c1222] border-white/[0.08] text-white">
                            <SelectValue placeholder="Şanzıman seçin" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c1222] border-white/[0.1]">
                            {transmissions.map((t) => (
                              <SelectItem key={t} value={t} className="text-white/80 focus:bg-white/10 focus:text-white">{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Color */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Renk</Label>
                        <Select value={color} onValueChange={setColor}>
                          <SelectTrigger className="h-12 bg-[#0c1222] border-white/[0.08] text-white">
                            <SelectValue placeholder="Renk seçin" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c1222] border-white/[0.1]">
                            {colors.map((c) => (
                              <SelectItem key={c} value={c} className="text-white/80 focus:bg-white/10 focus:text-white">{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className="w-full mt-8 h-12 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold border-0 rounded-xl disabled:opacity-30"
                    >
                      Devam Et <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Condition */}
              {step === 2 && !isProcessing && !showResult && (
                <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 md:p-10">
                    <div className="flex items-center gap-2 mb-1 text-white/30 text-xs font-medium tracking-widest uppercase">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Adım 2 / 4
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white/90 mb-1">Durum Bilgisi</h2>
                    <p className="text-white/35 text-sm mb-8">Aracınızın mevcut durumunu belirtin.</p>

                    <div className="space-y-6">
                      {/* Damage Record */}
                      <div>
                        <Label className="text-white/50 text-sm mb-3 block">Hasar kaydı var mı? *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[{ val: true, label: "Evet", icon: AlertTriangle }, { val: false, label: "Hayır", icon: Check }].map((opt) => {
                            const Icon = opt.icon;
                            const selected = hasDamage === opt.val;
                            return (
                              <button
                                key={String(opt.val)}
                                onClick={() => setHasDamage(opt.val)}
                                className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                                  selected
                                    ? "border-blue-500/40 bg-blue-500/[0.08] shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                                }`}
                              >
                                <Icon className={`w-5 h-5 ${selected ? "text-blue-400" : "text-white/25"}`} />
                                <span className={`font-medium text-sm ${selected ? "text-white" : "text-white/50"}`}>{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Paint Status */}
                      <div>
                        <Label className="text-white/50 text-sm mb-3 block">Boya Durumu *</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {paintOptions.map((opt) => {
                            const selected = paintStatus === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => setPaintStatus(opt)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                                  selected
                                    ? "border-blue-500/40 bg-blue-500/[0.08]"
                                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                                }`}
                              >
                                <Paintbrush className={`w-5 h-5 ${selected ? "text-blue-400" : "text-white/25"}`} />
                                <span className={`text-xs font-medium text-center ${selected ? "text-white" : "text-white/50"}`}>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Replaced Parts */}
                      <div>
                        <Label className="text-white/50 text-sm mb-3 block">Değişen parça var mı? *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[{ val: true, label: "Evet" }, { val: false, label: "Hayır" }].map((opt) => {
                            const selected = hasReplacedParts === opt.val;
                            return (
                              <button
                                key={String(opt.val)}
                                onClick={() => setHasReplacedParts(opt.val)}
                                className={`p-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                                  selected
                                    ? "border-blue-500/40 bg-blue-500/[0.08] text-white"
                                    : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.12]"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                        {hasReplacedParts && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                            <Input
                              value={replacedPartsDetail}
                              onChange={(e) => setReplacedPartsDetail(e.target.value)}
                              placeholder="Hangi parçalar değişti? (Örn: Ön tampon, sol çamurluk)"
                              className="h-12 bg-[#0c1222] border-white/[0.08] text-white placeholder:text-white/15"
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Last Inspection */}
                      <div className="space-y-2">
                        <Label className="text-white/50 text-sm">Son Muayene Tarihi</Label>
                        <Input
                          type="month"
                          value={lastInspection}
                          onChange={(e) => setLastInspection(e.target.value)}
                          className="h-12 bg-[#0c1222] border-white/[0.08] text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 h-12 border-white/[0.08] bg-transparent text-white/50 hover:bg-white/5 hover:text-white rounded-xl gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Geri
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                        className="flex-[2] h-12 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold border-0 rounded-xl disabled:opacity-30"
                      >
                        Devam Et <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Photos */}
              {step === 3 && !isProcessing && !showResult && (
                <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 md:p-10">
                    <div className="flex items-center gap-2 mb-1 text-white/30 text-xs font-medium tracking-widest uppercase">
                      <Camera className="w-4 h-4 text-blue-400" />
                      Adım 3 / 4
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white/90 mb-1">Fotoğraf Yükleme</h2>
                    <p className="text-white/35 text-sm mb-2">Aracınızın fotoğraflarını yükleyin. Minimum 4 fotoğraf gereklidir.</p>
                    <p className="text-blue-400/60 text-xs mb-8">{uploadedCount} / 4 zorunlu fotoğraf yüklendi</p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                      {photoSlots.map((slot) => {
                        const hasPhoto = !!photos[slot.id];
                        return (
                          <div key={slot.id} className="relative group">
                            <button
                              onClick={() => hasPhoto ? undefined : handlePhotoUpload(slot.id)}
                              className={`w-full aspect-[4/3] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden ${
                                hasPhoto
                                  ? "border-emerald-500/30 bg-emerald-500/5"
                                  : "border-white/[0.08] bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/[0.03] cursor-pointer"
                              }`}
                            >
                              {hasPhoto ? (
                                <img src={photos[slot.id]} alt={slot.label} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <>
                                  <ImagePlus className="w-6 h-6 text-white/20" />
                                  <span className="text-xs text-white/25 text-center px-2">{slot.label}</span>
                                  {slot.required && <span className="text-[10px] text-blue-400/50">Zorunlu</span>}
                                </>
                              )}
                            </button>
                            {hasPhoto && (
                              <button
                                onClick={() => removePhoto(slot.id)}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3.5 h-3.5 text-white" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1 h-12 border-white/[0.08] bg-transparent text-white/50 hover:bg-white/5 hover:text-white rounded-xl gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Geri
                      </Button>
                      <Button
                        onClick={startProcessing}
                        disabled={!isStep3Valid}
                        className="flex-[2] h-12 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold border-0 rounded-xl disabled:opacity-30"
                      >
                        <Zap className="w-4 h-4" />
                        Aracınızı Değerlendir
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PROCESSING */}
              {isProcessing && (
                <motion.div key="processing" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <div className="rounded-2xl border border-blue-500/10 bg-[#0a0f1e]/80 backdrop-blur-xl p-10 md:p-14 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-cyan-400"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border-2 border-transparent border-b-indigo-500 border-l-blue-400"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>

                    <div className="h-8 mb-6">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={processingIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-blue-300/70 font-medium text-sm"
                        >
                          {processingPhrases[Math.min(processingIndex, processingPhrases.length - 1)]}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <div className="max-w-xs mx-auto h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "easeInOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RESULT DASHBOARD */}
              {showResult && (
                <motion.div key="result" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
                  {/* Result Header */}
                  <div className="text-center mb-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-300/90">Değerleme Tamamlandı</span>
                    </motion.div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white/80 mb-2">
                      {selectedYear} {selectedBrand} {selectedModel} {version && `· ${version}`}
                    </h2>
                    <p className="text-white/30 text-sm">
                      {new Intl.NumberFormat("tr-TR").format(Number(km))} KM · {fuelType} · {transmission} · {paintStatus}
                    </p>
                  </div>

                  {/* Value Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-6 md:p-8 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-300/60 tracking-wider uppercase">AI Piyasa Değeri</span>
                      </div>
                      <motion.p
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent pb-[0.1em]"
                      >
                        {formatTL(trueValue)}
                      </motion.p>
                      <p className="text-white/25 text-xs mt-2">{formatTL(trueValueMin)} – {formatTL(trueValueMax)} aralığı</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-6 md:p-8 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Store className="w-4 h-4 text-red-400/60" />
                        <span className="text-xs font-medium text-red-300/40 tracking-wider uppercase">Ortalama Bayi Teklifi</span>
                      </div>
                      <p className="font-display text-3xl md:text-5xl font-bold text-red-400/50">
                        {formatTL(dealerOffer)}
                      </p>
                      <p className="text-emerald-400 text-xs mt-2 font-medium">
                        Bayiler {formatTL(difference)} daha az teklif ediyor
                      </p>
                    </motion.div>
                  </div>

                  {/* Advantage banner */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-xl bg-gradient-to-r from-emerald-500/[0.08] to-blue-500/[0.05] border border-emerald-500/10 p-4 mb-6 flex items-center justify-center gap-3"
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <p className="text-sm text-white/50">
                      Arayor AI ile satarak <span className="text-emerald-400 font-bold">{formatTL(difference)}</span> daha fazla kazanabilirsiniz
                    </p>
                  </motion.div>

                  {/* Trend Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white/50">12 Aylık Değer Trendi</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +%8.2 yıllık
                      </div>
                    </div>
                    <div className="h-[200px] md:h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                          <defs>
                            <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)" }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.15)" }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                          <Tooltip
                            contentStyle={{ background: "rgba(10,15,28,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
                            formatter={(value: number) => [formatTL(value), "Değer"]}
                          />
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#valGrad)" dot={false} activeDot={{ r: 5, fill: "#3b82f6", stroke: "#0a0f1c", strokeWidth: 3 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Similar Listings */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-6"
                  >
                    <h3 className="text-sm font-medium text-white/50 mb-4 flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-400" />
                      Benzer Araç İlanları
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {similarListings.map((listing, i) => (
                        <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-blue-500/20 transition-colors">
                          <div className="aspect-[16/10] overflow-hidden">
                            <img src={listing.img} alt={listing.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <p className="text-xs font-medium text-white/70 truncate">{listing.title}</p>
                            <p className="text-[10px] text-white/30 mt-1">{listing.km} KM · {listing.location}</p>
                            <p className="text-sm font-bold text-blue-400 mt-2">{listing.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-3 mt-8"
                  >
                    <Button className="flex-1 h-14 gap-2 text-base font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-0 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <Zap className="w-5 h-5" />
                      İlanımı Yayınla
                    </Button>
                    <Button variant="outline" className="flex-1 h-14 gap-2 text-base border-white/[0.08] bg-transparent text-white/50 hover:bg-white/5 hover:text-white rounded-xl">
                      <Store className="w-5 h-5" />
                      Arayor Onaylı Bayilerle Bağlan
                    </Button>
                  </motion.div>

                  {/* Reset */}
                  <div className="text-center mt-6">
                    <button onClick={resetForm} className="text-xs text-white/20 hover:text-white/40 transition-colors">
                      Yeni değerleme yap →
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
