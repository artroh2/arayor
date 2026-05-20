import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Search, ChevronRight, Car, Loader2, Plus, X, Link as LinkIcon, Crown, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { vehicles, Vehicle } from "@/data/mockData";
import { BrandLogo } from "@/components/brands";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscriptionTier } from "@/hooks/useSubscriptionTier";
import { usePremium } from "@/hooks/usePremium";
import { ReviewImageUpload } from "./ReviewImageUpload";
import { useReviewImages } from "@/hooks/useReviewImages";

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedVehicle?: Vehicle;
}

export function WriteReviewDialog({ open, onOpenChange, preselectedVehicle }: WriteReviewDialogProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isEnterprise } = useSubscriptionTier();
  const { isPremium } = usePremium();
  const { uploadImage, addImageToReview } = useReviewImages();
  const [step, setStep] = useState<"select" | "review">("select");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle preselected vehicle
  useEffect(() => {
    if (open && preselectedVehicle) {
      setSelectedVehicle(preselectedVehicle);
      setStep("review");
    }
  }, [open, preselectedVehicle]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        if (!preselectedVehicle) {
          setStep("select");
          setSelectedVehicle(null);
        }
        setSearchQuery("");
        setRating(0);
        setTitle("");
        setContent("");
        setPros([]);
        setCons([]);
        setNewPro("");
        setNewCon("");
        setLinkUrl("");
        setReviewImages([]);
      }, 300);
    }
  }, [open, preselectedVehicle]);

  const handleAddPro = () => {
    if (newPro.trim() && pros.length < 5) {
      setPros([...pros, newPro.trim()]);
      setNewPro("");
    }
  };

  const handleAddCon = () => {
    if (newCon.trim() && cons.length < 5) {
      setCons([...cons, newCon.trim()]);
      setNewCon("");
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.brand.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query)
    );
  });

  const handleSelectVehicle = (vehicle: Vehicle) => {
    if (!user) {
      toast.error(t("review.loginRequired"));
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    setSelectedVehicle(vehicle);
    setStep("review");
  };

  const handleSubmit = async () => {
    if (!user || !selectedVehicle) {
      toast.error(t("review.loginRequired"));
      return;
    }

    if (!rating || !title.trim() || !content.trim()) {
      toast.error("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: reviewData, error } = await supabase.from("reviews").insert({
        vehicle_id: selectedVehicle.id,
        user_id: user.id,
        user_name: user.user_metadata?.display_name || user.user_metadata?.full_name || "Anonim",
        user_avatar: user.user_metadata?.avatar_url,
        user_email: user.email || "",
        rating,
        title,
        content,
        pros: pros.length > 0 ? pros : [],
        cons: cons.length > 0 ? cons : [],
        link_url: isEnterprise && linkUrl.trim() ? linkUrl.trim() : null,
      }).select("id").single();

      if (error) throw error;

      // Upload images for premium users
      if (isPremium && reviewImages.length > 0 && reviewData?.id) {
        for (const imageFile of reviewImages) {
          const imageUrl = await uploadImage(imageFile, reviewData.id, user.id);
          if (imageUrl) {
            await addImageToReview(reviewData.id, user.id, imageUrl);
          }
        }
      }

      toast.success(
        reviewImages.length > 0 
          ? "Yorumunuz gönderildi! Fotoğraflarınız onay bekliyor." 
          : "Yorumunuz başarıyla gönderildi!"
      );
      onOpenChange(false);
      navigate(`/arac/${selectedVehicle.id}`);
    } catch (error: any) {
      toast.error("Yorum gönderilirken bir hata oluştu");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold text-left">
            {step === "select" ? (
              "Araç Seçin"
            ) : (
              `${selectedVehicle?.brand} ${selectedVehicle?.model} (${selectedVehicle?.year}) - Kullanıcı Yorumları`
            )}
          </SheetTitle>
        </SheetHeader>

        {step === "select" ? (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Marka veya model ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Vehicle List */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-2 pb-4">
                {filteredVehicles.slice(0, 20).map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <BrandLogo brandId={vehicle.brandId} className="h-4 w-6" />
                        <span className="font-medium truncate">
                          {vehicle.brand} {vehicle.model}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year} • {vehicle.category}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
                {filteredVehicles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Araç bulunamadı
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Review Form Card */}
              <div className="rounded-xl border border-accent/50 bg-card p-6 space-y-5">
                <h3 className="text-xl font-bold">Yorum Yaz</h3>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Puanınız</label>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className="focus:outline-none"
                          onMouseEnter={() => setHoverRating(i + 1)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(i + 1)}
                        >
                          <Star
                            className={cn(
                              "w-8 h-8 transition-colors",
                              (hoverRating || rating) > i
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{rating}/5</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Yorum Başlığı</label>
                  <Input
                    placeholder="Örn: Harika bir araç, tavsiye ederim"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Yorumunuz</label>
                  <Textarea
                    placeholder="Araç hakkındaki deneyimlerinizi, artı ve eksilerini paylaşın..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[140px] resize-none"
                    maxLength={2000}
                  />
                </div>

                {/* Premium YouTube Link */}
                {isEnterprise && (
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <label className="text-sm font-medium">YouTube Video Linki (Premium Özelliği)</label>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="pl-9"
                          type="url"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Araç inceleme videonuzun YouTube linkini ekleyin. Video, yorum kartında görüntülenecektir.
                    </p>
                  </div>
                )}

                {/* Premium Photo Upload */}
                {isPremium && (
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <ImagePlus className="w-4 h-4 text-blue-500" />
                      <label className="text-sm font-medium">Fotoğraf Ekle (Premium Özelliği)</label>
                    </div>
                    <ReviewImageUpload
                      images={reviewImages}
                      onImagesChange={setReviewImages}
                      maxImages={3}
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {/* Pros */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Artıları (Opsiyonel)</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Örn: Yakıt tasarrufu"
                      value={newPro}
                      onChange={(e) => setNewPro(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPro())}
                      maxLength={50}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddPro} className="flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {pros.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pros.map((pro, i) => (
                        <Badge key={i} variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 bg-emerald-50">
                          + {pro}
                          <button onClick={() => setPros(pros.filter((_, idx) => idx !== i))}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cons */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Eksileri (Opsiyonel)</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Örn: Yedek parça pahalı"
                      value={newCon}
                      onChange={(e) => setNewCon(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCon())}
                      maxLength={50}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddCon} className="flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {cons.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cons.map((con, i) => (
                        <Badge key={i} variant="outline" className="gap-1 border-red-500/30 text-red-600 bg-red-50">
                          - {con}
                          <button onClick={() => setCons(cons.filter((_, idx) => idx !== i))}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !rating || !title.trim() || !content.trim()}
                    className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      "Yorum Gönder"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="h-12 px-6"
                  >
                    İptal
                  </Button>
                </div>
              </div>

              {/* Change vehicle link */}
              {!preselectedVehicle && (
                <button
                  onClick={() => setStep("select")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Farklı bir araç seç
                </button>
              )}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
