import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PriceIntelligenceWidget, PriceHistoryTable, SuggestedPriceRange } from "@/components/pricing";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Fuel,
  Gauge,
  Cog,
  Zap,
  Timer,
  Car,
  MessageSquare,
  PenLine,
  ArrowLeftRight,
  Check,
  Landmark,
  Calculator,
  Percent,
  Calendar,
  ExternalLink,
  Globe,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { ReviewCardInteractive } from "@/components/vehicles/ReviewCardInteractive";
import { ReviewCard, WriteReviewDialog } from "@/components/vehicles";
import { AIVCardModal } from "@/components/vehicles/AIVCardModal";
import { SellerHoverCard } from "@/components/prestige/SellerHoverCard";
import { PrestigeBadge } from "@/components/prestige/PrestigeBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { getVehicleById, getReviewsByVehicleId, vehicles } from "@/data/mockData";
import { useReviews } from "@/hooks/useReviews";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompare } from "@/contexts/CompareContext";
import { getModelPageUrl } from "@/data/officialWebsites";
import toggT10xVideo from "@/assets/vehicles/togg-t10x-longrange.mp4";

const bankLogos: Record<string, string> = {
  "Halkbank": "",
  "Ziraat Bankası": "",
  "İş Bankası": "",
  "Akbank": "",
  "Garanti BBVA": "",
  "Yapı Kredi": "",
  "QNB Finansbank": "",
  "Denizbank": "",
};

// Bank offers for comparison
const bankOffers = [
  { name: "Halkbank", logo: bankLogos["Halkbank"], rate: 3.25 },
  { name: "Ziraat Bankası", logo: bankLogos["Ziraat Bankası"], rate: 3.29 },
  { name: "İş Bankası", logo: bankLogos["İş Bankası"], rate: 3.39 },
  { name: "Akbank", logo: bankLogos["Akbank"], rate: 3.45 },
];

const VehicleDetail = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const vehicle = getVehicleById(id || "");
  const mockReviews = getReviewsByVehicleId(id || "");
  const { reviews: dbReviews, loading, user, addReview, toggleLike, deleteReview } = useReviews(id || "");
  const { addToCompare, isInCompare, getCompareSlot, vehicle1, vehicle2 } = useCompare();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVCard, setShowVCard] = useState(false);
  const [showWriteReviewDialog, setShowWriteReviewDialog] = useState(false);
  const [loanTerm, setLoanTerm] = useState(36);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  
  const inCompare = vehicle ? isInCompare(vehicle.id) : false;
  const slot = vehicle ? getCompareSlot(vehicle.id) : null;
  
  // Parse vehicle price and calculate loan
  const vehicleNumericPrice = useMemo(() => {
    if (!vehicle) return 0;
    const priceStr = vehicle.price.replace(/[^\d]/g, '');
    return parseInt(priceStr, 10) || 0;
  }, [vehicle]);
  
  const loanCalculation = useMemo(() => {
    const downPayment = (vehicleNumericPrice * downPaymentPercent) / 100;
    const loanAmount = vehicleNumericPrice - downPayment;
    const interestRate = 3.29; // Best available rate
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;
    
    return {
      downPayment,
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      interestRate,
    };
  }, [vehicleNumericPrice, loanTerm, downPaymentPercent]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const handleCompareClick = () => {
    if (!vehicle) return;
    addToCompare(vehicle);
    
    // If this is the second vehicle, navigate to compare page
    if (vehicle1 && !vehicle2) {
      setTimeout(() => {
        navigate("/karsilastir");
      }, 500);
    }
  };

  if (!vehicle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("vehicle.notFound")}</h1>
          <Link to="/araclar">
            <Button>{t("vehicle.backToVehicles")}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const similarVehicles = vehicles
    .filter((v) => v.category === vehicle.category && v.id !== vehicle.id)
    .slice(0, 3);

  const specItems = [
    { icon: Cog, label: t("specs.engine"), value: vehicle.specs.engine },
    { icon: Zap, label: t("specs.power"), value: vehicle.specs.power },
    { icon: Fuel, label: t("specs.fuel"), value: vehicle.specs.fuel },
    { icon: Gauge, label: t("specs.transmission"), value: vehicle.specs.transmission },
    { icon: Timer, label: t("specs.acceleration"), value: vehicle.specs.acceleration },
    { icon: Car, label: t("specs.bodyType"), value: vehicle.specs.bodyType },
  ];

  const specLabels: Record<string, string> = {
    engine: t("specs.engine"),
    power: t("specs.power"),
    fuel: t("specs.fuelType"),
    transmission: t("specs.transmission"),
    acceleration: t("specs.acceleration"),
    topSpeed: t("specs.topSpeed"),
    fuelConsumption: t("specs.fuelConsumption"),
    bodyType: t("specs.bodyType"),
  };

  const handleAddReply = async (data: {
    title: string;
    content: string;
    rating: number;
    pros: string[];
    cons: string[];
    parentId?: string;
  }) => {
    const success = await addReview(data);
    return success;
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              {t("nav.home")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/araclar" className="hover:text-foreground transition-colors">
              {t("nav.vehicles")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{vehicle.brand} {vehicle.model}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-secondary">
              <img
                src={vehicle.images[currentImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm text-sm font-medium">
                {currentImageIndex + 1} / {vehicle.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-1 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${vehicle.brand} ${vehicle.model} - ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Official Video for TOGG T10X Long Range */}
            {vehicle.brand === "Togg" && vehicle.model === "T10X Long Range" && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Resmi Tanıtım Videosu
                </h3>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    src={toggT10xVideo}
                    controls
                    className="w-full h-full object-cover"
                    poster={vehicle.image}
                  >
                    Tarayıcınız video etiketini desteklemiyor.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <Badge className="mb-3">{t(`category.${vehicle.category.toLowerCase()}`) || vehicle.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-muted-foreground mt-1">{vehicle.year} {t("vehicle.model")}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(vehicle.rating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold">{vehicle.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({dbReviews.length + mockReviews.length || vehicle.reviewCount} {t("vehicle.evaluation")})
              </span>
            </div>

            {/* Price */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm text-muted-foreground">{t("vehicle.startingPrice")}</p>
              <p className="text-3xl font-display font-bold text-primary">
                {vehicle.price}
              </p>
            </div>

            {/* Market Comparison Widget */}
            <PriceIntelligenceWidget
              vehiclePrice={vehicleNumericPrice}
              brand={vehicle.brand}
              model={vehicle.model}
              year={vehicle.year}
            />

            {/* Suggested Price Range */}
            <SuggestedPriceRange
              vehiclePrice={vehicleNumericPrice}
              brand={vehicle.brand}
              model={vehicle.model}
              year={vehicle.year}
            />

            {/* Official Website Link - Model Specific */}
            {getModelPageUrl(vehicle.brand, vehicle.model) && (
              <a 
                href={getModelPageUrl(vehicle.brand, vehicle.model)!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-400">
                      {vehicle.brand} {vehicle.model} Resmi Sayfası
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Model detayları, fiyatlar ve konfigürasyon için resmi siteyi ziyaret edin
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </a>
            )}


            {/* Seller Info with Prestige */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <SellerHoverCard
                sellerName="Mehmet K."
                tier="honest_broker"
                trustScore={94}
                memberSince="Ocak 2023"
                cleanSales={5}
                totalSales={7}
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-amber-500/20 flex items-center justify-center text-sm font-bold text-slate-200">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-100">Mehmet K.</span>
                      <PrestigeBadge tier="honest_broker" size="sm" />
                    </div>
                    <span className="text-xs text-slate-500">Doğrulanmış Satıcı • 7 işlem</span>
                  </div>
                </div>
              </SellerHoverCard>
              <div className="ml-auto text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">AI Güven</span>
                <p className="text-sm font-bold text-emerald-400">94/100</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 gap-2 h-12 gradient-primary border-0"
                onClick={() => setShowWriteReviewDialog(true)}
              >
                <PenLine className="w-5 h-5" />
                {t("vehicle.writeReview")}
              </Button>
              <Button
                variant={inCompare ? "default" : "outline"}
                className={`h-12 gap-2 ${inCompare ? "bg-primary text-primary-foreground" : ""}`}
                onClick={handleCompareClick}
              >
                {inCompare ? (
                  <>
                    <Check className="w-5 h-5" />
                    {slot}. Araç
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="w-5 h-5" />
                    Karşılaştır
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12"
                onClick={async () => {
                  const shareData = {
                    title: `${vehicle.brand} ${vehicle.model}`,
                    text: `${vehicle.brand} ${vehicle.model} - ${vehicle.price} | ${vehicle.specs.power}, ${vehicle.specs.fuel}`,
                    url: window.location.href,
                  };
                  
                  if (navigator.share && navigator.canShare?.(shareData)) {
                    try {
                      await navigator.share(shareData);
                    } catch (err) {
                      // User cancelled or error
                    }
                  } else {
                    // Fallback: copy to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success("Link kopyalandı!", {
                      description: "Araç linki panoya kopyalandı.",
                    });
                  }
                }}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="h-12 gap-2 bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                onClick={() => setShowVCard(true)}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Profil Aktar</span>
              </Button>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {specItems.map((spec) => (
                <div
                  key={spec.label}
                  className="p-3 bg-card border border-border rounded-xl"
                >
                  <spec.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                  <p className="font-medium text-sm">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mt-12">
          <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
            <TabsTrigger
              value="specs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {t("vehicle.specs")}
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {t("vehicle.reviews.tab")} ({dbReviews.length + mockReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description */}
              <div>
                <h3 className="text-xl font-display font-bold mb-4">{t("vehicle.overview")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Features */}
                <h4 className="text-lg font-semibold mt-6 mb-3">{t("vehicle.featuredFeatures")}</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Specs Table */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <h3 className="text-lg font-semibold p-4 border-b border-border bg-secondary/30">
                  {t("vehicle.technicalSpecs")}
                </h3>
                <div className="divide-y divide-border">
                  {Object.entries(vehicle.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-4">
                      <span className="text-muted-foreground capitalize">
                        {specLabels[key] || key}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price History */}
            <div className="mt-8">
              <PriceHistoryTable basePrice={vehicleNumericPrice} />
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-display font-bold">
                    {t("vehicle.userReviews")}
                  </h3>
                  <Button onClick={() => setShowWriteReviewDialog(true)} className="gap-2">
                    <PenLine className="w-4 h-4" />
                    {t("vehicle.writeReview")}
                  </Button>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-32 h-3" />
                          </div>
                        </div>
                        <Skeleton className="w-full h-16" />
                      </div>
                    ))}
                  </div>
                ) : (dbReviews.length > 0 || mockReviews.length > 0) ? (
                  <>
                    {/* Database reviews with interactive features */}
                    {dbReviews.map((review) => (
                      <ReviewCardInteractive
                        key={review.id}
                        review={review}
                        onLike={toggleLike}
                        onReply={handleAddReply}
                        onDelete={deleteReview}
                        currentUserId={user?.id}
                      />
                    ))}
                    {/* Mock reviews */}
                    {mockReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12 bg-secondary/30 rounded-2xl">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {t("vehicle.noReviews")}
                    </p>
                    <Button onClick={() => setShowWriteReviewDialog(true)} className="gap-2">
                      <PenLine className="w-4 h-4" />
                      {t("vehicle.writeFirstReview")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">{t("vehicle.reviewStats")}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("vehicle.totalReviews")}</span>
                      <span className="font-medium">{dbReviews.length + mockReviews.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("vehicle.averageRating")}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-medium">
                          {(dbReviews.length + mockReviews.length) > 0
                            ? (([...dbReviews, ...mockReviews].reduce((sum, r) => sum + r.rating, 0)) / (dbReviews.length + mockReviews.length)).toFixed(1)
                            : vehicle.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!user && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        {t("vehicle.loginToReview")}
                      </p>
                      <Link to="/auth">
                        <Button variant="outline" className="w-full">
                          {t("auth.login")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Finance Calculator Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-display font-bold mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
              {t("vehicle.loanCalculator") || "Kredi Hesaplama"}
            </div>
          </h2>
          
          <div className="p-6 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 border border-green-500/20 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Sliders and Summary */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("vehicle.downPayment") || "Peşinat"}</span>
                      <span className="font-medium">%{downPaymentPercent} ({formatCurrency(loanCalculation.downPayment)})</span>
                    </div>
                    <Slider
                      value={[downPaymentPercent]}
                      onValueChange={(value) => setDownPaymentPercent(value[0])}
                      min={0}
                      max={50}
                      step={5}
                      className="py-1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("vehicle.term") || "Vade"}</span>
                      <span className="font-medium">{loanTerm} {t("finance.months") || "Ay"}</span>
                    </div>
                    <Slider
                      value={[loanTerm]}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      min={12}
                      max={60}
                      step={6}
                      className="py-1"
                    />
                  </div>
                </div>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-xl p-4 text-center border border-border">
                    <p className="text-sm text-muted-foreground">{t("vehicle.loanAmount") || "Kredi Tutarı"}</p>
                    <p className="text-xl font-bold mt-1">{formatCurrency(loanCalculation.loanAmount)}</p>
                  </div>
                  <div className="bg-card rounded-xl p-4 text-center border border-border">
                    <p className="text-sm text-muted-foreground">{t("vehicle.savingsRange") || "Tasarruf Farkı"}</p>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      {formatCurrency(
                        (() => {
                          const rates = bankOffers.slice(0, 4).map(b => b.rate);
                          const minRate = Math.min(...rates);
                          const maxRate = Math.max(...rates);
                          const minMonthly = Math.round((loanCalculation.loanAmount * (minRate/100/12) * Math.pow(1 + minRate/100/12, loanTerm)) / (Math.pow(1 + minRate/100/12, loanTerm) - 1));
                          const maxMonthly = Math.round((loanCalculation.loanAmount * (maxRate/100/12) * Math.pow(1 + maxRate/100/12, loanTerm)) / (Math.pow(1 + maxRate/100/12, loanTerm) - 1));
                          return (maxMonthly - minMonthly) * loanTerm;
                        })()
                      )}
                    </p>
                  </div>
                </div>
                
                {/* CTA */}
                <Link to="/finans" className="block">
                  <Button className="w-full gap-2 h-12 bg-green-600 hover:bg-green-700 text-white">
                    <Landmark className="w-5 h-5" />
                    {t("vehicle.compareLoans") || "Tüm Kredi Tekliflerini Karşılaştır"}
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              {/* Right Column - Bank Comparison */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {t("vehicle.bankComparison") || "Banka Karşılaştırması"}
                </p>
                <div className="space-y-2">
                  {bankOffers.slice(0, 4).map((bank, index) => {
                    const monthlyRate = bank.rate / 100 / 12;
                    const monthlyPayment = Math.round(
                      (loanCalculation.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                      (Math.pow(1 + monthlyRate, loanTerm) - 1)
                    );
                    const totalInterest = (monthlyPayment * loanTerm) - loanCalculation.loanAmount;
                    const isBest = index === 0;
                    
                    return (
                      <div 
                        key={bank.name}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isBest 
                            ? "bg-green-500/10 border-green-500/30" 
                            : "bg-card border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center p-1.5 shrink-0">
                            <img 
                              src={bank.logo} 
                              alt={bank.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/32x32?text=B";
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{bank.name}</p>
                              {isBest && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  {t("vehicle.bestRate") || "En Uygun"}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              %{bank.rate} {t("vehicle.annualRate") || "yıllık faiz"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${isBest ? "text-green-600" : "text-foreground"}`}>
                            {formatCurrency(monthlyPayment)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("vehicle.totalInterestShort") || "Faiz:"} {formatCurrency(totalInterest)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {similarVehicles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-6">
              {t("vehicle.similarVehicles")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((v) => (
                <Link
                  key={v.id}
                  to={`/arac/${v.id}`}
                  className="group block bg-card rounded-2xl border border-border overflow-hidden hover-lift"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={v.image}
                      alt={`${v.brand} ${v.model}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {v.brand} {v.model}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm">{v.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        · {v.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Write Review Dialog */}
      <WriteReviewDialog
        open={showWriteReviewDialog}
        onOpenChange={setShowWriteReviewDialog}
        preselectedVehicle={vehicle}
      />

      {/* AI VCard Modal */}
      <AIVCardModal vehicle={vehicle} open={showVCard} onClose={() => setShowVCard(false)} />
    </Layout>
  );
};

export default VehicleDetail;
