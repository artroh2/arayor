import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Brain, Fuel, Users, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Dummy AI recommendations
const dummyResults = [
  {
    id: 1,
    name: "Hyundai Tucson 1.6 T-GDI",
    price: "1.420.000 ₺",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop",
    reason: "Tepeli şehir sürüşüne ideal AWD sistemi ve yeni sürücüler için güven veren geniş güvenlik paketi. 4 kişilik aileniz için ferah iç hacim sunuyor.",
  },
  {
    id: 2,
    name: "Skoda Kodiaq 1.5 TSI",
    price: "1.380.000 ₺",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    reason: "Sınıfının en geniş bagaj hacmi ile aile tatillerine hazır. Park sensörleri ve geri görüş kamerası yeni sürücü eşiniz için büyük kolaylık.",
  },
  {
    id: 3,
    name: "Toyota Corolla Cross Hybrid",
    price: "1.490.000 ₺",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=600&h=400&fit=crop",
    reason: "Hibrit motor ile engebeli şehirde bile düşük yakıt tüketimi. Toyota güvenilirliği ve yüksek ikinci el değeri bütçenizi koruyor.",
  },
];

const placeholderText =
  "Örn: 4 kişilik bir aileyim, eşim yeni sürücü, engebeli bir şehirde yaşıyoruz ve bütçemiz 1.5M TL...";

export function AIHeroSection() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter placeholder effect
  useEffect(() => {
    if (isFocused || query) return;
    let i = 0;
    setDisplayedPlaceholder("");
    const interval = setInterval(() => {
      if (i < placeholderText.length) {
        setDisplayedPlaceholder(placeholderText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isFocused, query]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    setIsThinking(true);
    setShowResults(false);
    setTimeout(() => {
      setIsThinking(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Deep dark background with gradient fill */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c16] via-[#0a1128] to-background" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/4 rounded-full blur-[80px]" />

      {/* Dimming overlay when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-10"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary/90 tracking-wide">
                AI Automotive Oracle
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-center font-display font-bold leading-[1.1] mb-6 break-words"
          >
            <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white/90 block">
              Araç aramayı bırakın.
            </span>
            <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl block mt-2 gradient-text">
              Hayatınızı anlatın, mükemmel aracı bulayım.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-white/40 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-12 px-2"
          >
            Yapay zekâ destekli arac danışmanınız, ihtiyaçlarınıza göre en uygun aracı saniyeler içinde önerir.
          </motion.p>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div
              className={`relative rounded-2xl transition-all duration-500 ${
                isFocused
                  ? "shadow-[0_0_60px_rgba(59,130,246,0.15)]"
                  : "shadow-[0_0_30px_rgba(59,130,246,0.06)]"
              }`}
            >
              {/* Gradient border */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-indigo-500/30 opacity-60" />

              <div className="relative rounded-2xl bg-[#0c1222]/90 backdrop-blur-xl p-1">
                <Textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={displayedPlaceholder || placeholderText}
                  className="w-full min-h-[80px] md:min-h-[120px] resize-none border-0 bg-transparent text-white/90 text-sm sm:text-base md:text-lg placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 sm:px-5 py-4"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 pb-3">
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/25 text-sm min-w-[44px] min-h-[44px] justify-center">
                      <Users className="w-4.5 h-4.5" />
                      <span className="font-medium">Aile</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/25 text-sm min-w-[44px] min-h-[44px] justify-center">
                      <MapPin className="w-4.5 h-4.5" />
                      <span className="font-medium">Şehir</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/25 text-sm min-w-[44px] min-h-[44px] justify-center">
                      <Fuel className="w-4.5 h-4.5" />
                      <span className="font-medium">Bütçe</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!query.trim() || isThinking}
                    className="relative group flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {/* Button glow background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl" />
                    <motion.div
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="relative flex items-center gap-2 px-1">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">AI'ya Danış</span>
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Thinking state */}
          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 mt-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-5 h-5 text-blue-400" />
                </motion.div>
                <span className="text-blue-300/70 text-sm font-medium">
                  Yapay zekâ analiz ediyor...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6 }}
                className="mt-12"
              >
                <div className="flex items-center justify-center gap-2 mb-8">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white/50 tracking-wide uppercase">
                    Sizin İçin Önerilen Araçlar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                  {dummyResults.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-md hover:border-blue-500/30 transition-all duration-500"
                    >
                      {/* Card glow on hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
                        </div>

                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-display font-bold text-white/90 text-lg leading-tight">
                              {car.name}
                            </h3>
                            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap ml-2">
                              {car.price}
                            </span>
                          </div>

                          <p className="text-sm text-white/40 leading-relaxed">
                            {car.reason}
                          </p>

                          <div className="mt-4 flex items-center gap-1.5 text-blue-400/60 text-xs">
                            <Brain className="w-3.5 h-3.5" />
                            <span>AI Kişiselleştirilmiş Öneri</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
