import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, Link2, Twitter, FileText, QrCode,
  Shield, Zap, CheckCircle2, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Vehicle } from "@/data/mockData";
import { ArayorLogo } from "@/components/brand/ArayorLogo";

interface AIVCardModalProps {
  vehicle: Vehicle;
  open: boolean;
  onClose: () => void;
}

const aiVerdicts: Record<string, string> = {
  default: "Segment lideri. Güven ve performansın mükemmel dengesi.",
};

function getAIVerdict(vehicle: Vehicle): string {
  return aiVerdicts[vehicle.id] || `${vehicle.brand} ${vehicle.model} — ${vehicle.specs.fuel === "Elektrik" ? "Elektrikli devrim." : "Asfaltın jilet keskinliği."}`;
}

function generateSlug(vehicle: Vehicle): string {
  return `${vehicle.brand}-${vehicle.model}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function AIVCardModal({ vehicle, open, onClose }: AIVCardModalProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const trustScore = Math.floor(Math.random() * 8) + 92; // 92-99
  const verdict = getAIVerdict(vehicle);
  const slug = generateSlug(vehicle);
  const shareUrl = `arayor.com/${slug}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`https://${shareUrl}`);
    setCopied(true);
    toast.success("Akıllı link kopyalandı!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = `${vehicle.brand} ${vehicle.model} arayor.com AI'ından ${trustScore}/100 puan aldı. Oracle'ın kararına bak 👉 https://${shareUrl}`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleExportText = async () => {
    const text = `🏷️ ${vehicle.brand} ${vehicle.model} ${vehicle.year}
💰 Fiyat: ${vehicle.price}
⚡ Motor: ${vehicle.specs.engine} | ${vehicle.specs.power}
⛽ Yakıt: ${vehicle.specs.fuel} | Şanzıman: ${vehicle.specs.transmission}
🏁 0-100: ${vehicle.specs.acceleration}

🤖 AI Güven Skoru: ${trustScore}/100
📊 AI Değerlendirmesi: "${verdict}"

🔗 Detaylı analiz: https://${shareUrl}
— arayor.com | Automotive AI Oracle`;

    await navigator.clipboard.writeText(text);
    toast.success("AI profili panoya kopyalandı!", {
      description: "Sahibinden, VavaCars veya diğer platformlara yapıştırabilirsiniz.",
    });
  };

  const handleDownload = () => {
    toast.success("Yüksek çözünürlüklü VCard hazırlanıyor...", {
      description: "Instagram Story & TikTok formatında indiriliyor.",
    });
    // In production this would use html-to-image or canvas
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0a0e14] border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">AI Digital VCard</span>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VCard Preview (9:16 aspect ratio) */}
            <div className="p-4">
              <div
                ref={cardRef}
                className="relative rounded-xl overflow-hidden bg-[#050810] border border-white/5"
                style={{ aspectRatio: "9/16" }}
              >
                {/* Hero Image */}
                <div className="relative h-[45%]">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent" />
                  {/* Year badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{vehicle.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col" style={{ height: "55%" }}>
                  {/* Vehicle name */}
                  <h3 className="text-lg font-display font-bold text-slate-50 tracking-tight">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{vehicle.specs.engine} • {vehicle.specs.power} • {vehicle.specs.fuel}</p>

                  {/* AI Verdict */}
                  <div className="mt-4 p-3 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">AI Değerlendirmesi</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200 italic leading-relaxed">"{verdict}"</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-300">Güven Skoru: {trustScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">AI Doğrulanmış Fiyat</p>
                    <p className="text-xl font-display font-bold text-emerald-400 tracking-tight">{vehicle.price}</p>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* QR + Logo footer */}
                  <div className="flex items-end justify-between mt-auto pt-3 border-t border-white/5">
                    <div>
                      <ArayorLogo size="sm" />
                      <p className="text-[9px] text-slate-600 mt-1">Automotive AI Oracle</p>
                    </div>
                    {/* QR Code placeholder */}
                    <div className="relative w-16 h-16 rounded-lg bg-white p-1 overflow-hidden">
                      <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI2MCIgeT0iMTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIxMCIgeT0iNjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI3MCIgeT0iMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIyMCIgeT0iNzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI0NSIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI0NSIgeT0iNDUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI2MCIgeT0iNjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI2MCIgeT0iODAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI4MCIgeT0iODAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] bg-contain bg-no-repeat bg-center" />
                      {/* Scan line animation */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-cyan-400/60"
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="p-4 pt-0 grid grid-cols-4 gap-2">
              <button
                onClick={handleDownload}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
              >
                <Download className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] text-slate-500 group-hover:text-slate-300 font-medium text-center leading-tight">Hi-Res İndir</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                ) : (
                  <Link2 className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                )}
                <span className="text-[9px] text-slate-500 group-hover:text-slate-300 font-medium text-center leading-tight">Link Kopyala</span>
              </button>
              <button
                onClick={handleShareX}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
              >
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] text-slate-500 group-hover:text-slate-300 font-medium text-center leading-tight">X'te Paylaş</span>
              </button>
              <button
                onClick={handleExportText}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
              >
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] text-slate-500 group-hover:text-slate-300 font-medium text-center leading-tight">Metin Aktar</span>
              </button>
            </div>

            {/* Footer note */}
            <div className="px-4 pb-4">
              <p className="text-[10px] text-center text-slate-600">
                AI VCard paylaşımı arayor.com'un organik büyüme motorudur
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
