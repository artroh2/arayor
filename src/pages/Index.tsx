import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, ChevronRight, MessageSquarePlus, Car, ThumbsUp, Calendar, CarFront, Mountain, Box, Zap, Truck, Users, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout";
import { VehicleCard } from "@/components/vehicles";
import { BrandLogo } from "@/components/brands";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { AIHeroSection } from "@/components/hero/AIHeroSection";
import { LiveAIDeals } from "@/components/ticker/LiveAIDeals";
import { SoulProfiler } from "@/components/quiz/SoulProfiler";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { vehicles, brands, categories, reviews, Review } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isSoulProfilerOpen, setIsSoulProfilerOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    return !hasSeenSplash;
  });
  const navigate = useNavigate();
  const { t } = useLanguage();
  const popularVehicles = vehicles.slice(0, 4);
  const latestReviews = reviews.slice(0, 3);
  
  // Show 8 brands initially, all when expanded
  const displayedBrands = showAllBrands ? brands : brands.slice(0, 8);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasSeenSplash", "true");
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Layout>
      <AIHeroSection />

      {/* Soul Profiler Banner */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setIsSoulProfilerOpen(true)}
            className="w-full group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 p-6 md:p-8 hover:border-primary/60 transition-all duration-500 hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">
                    Ne istediğinizi bilmiyor musunuz?
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    AI'ın sürüş ruhunuzu profillemesine izin verin — mükemmel aracınızı bulalım.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      <SoulProfiler isOpen={isSoulProfilerOpen} onClose={() => setIsSoulProfilerOpen(false)} />

      {/* Premium Brands Section */}
      <section id="markalar" className="py-12 md:py-16 border-y border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          {/* Luxury & Premium Brands */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                <span className="text-amber-500 text-sm">★</span>
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Premium & Lüks Markalar</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
              {brands.filter(b => b.isPremium).map((brand) => (
                <Link
                  key={brand.id}
                  to={`/araclar?marka=${brand.id}`}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all group relative overflow-hidden ${
                    brand.tier === "luxury" 
                      ? "bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 border-amber-500/30 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10" 
                      : "bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
                  }`}
                >
                  {brand.tier === "luxury" && (
                    <div className="absolute top-1 right-1">
                      <span className="text-amber-500 text-xs">★</span>
                    </div>
                  )}
                  <BrandLogo brandId={brand.id} brandName={brand.name} className="h-8 w-auto group-hover:scale-110 transition-transform text-foreground" />
                  <span className="text-sm font-medium text-center">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Standard Brands */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg md:text-xl font-bold text-muted-foreground">Diğer Markalar</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-muted-foreground"
              >
                {showAllBrands ? "Daha Az Göster" : `Tümünü Göster`}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {(showAllBrands ? brands.filter(b => !b.isPremium) : brands.filter(b => !b.isPremium).slice(0, 8)).map((brand) => (
                <Link
                  key={brand.id}
                  to={`/araclar?marka=${brand.id}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <BrandLogo brandId={brand.id} brandName={brand.name} className="h-6 w-auto group-hover:scale-110 transition-transform text-foreground opacity-70 group-hover:opacity-100" />
                  <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-xl md:text-2xl font-bold">{t("section.categories")}</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const iconMap: Record<string, React.ReactNode> = {
                sedan: <CarFront className="w-8 h-8" strokeWidth={1.2} />,
                suv: <Mountain className="w-8 h-8" strokeWidth={1.2} />,
                hatchback: <Box className="w-8 h-8" strokeWidth={1.2} />,
                coupe: <Zap className="w-8 h-8" strokeWidth={1.2} />,
                pickup: <Truck className="w-8 h-8" strokeWidth={1.2} />,
                mpv: <Users className="w-8 h-8" strokeWidth={1.2} />,
              };
              return (
                <Link
                  key={cat.id}
                  to={`/araclar?kategori=${cat.id}`}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <span className="text-slate-300 group-hover:text-cyan-400 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                    {iconMap[cat.id] || <CarFront className="w-8 h-8" strokeWidth={1.2} />}
                  </span>
                  <span className="font-medium text-slate-300 group-hover:text-slate-50 transition-colors">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Vehicles + Live AI Deals */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Popular Vehicles */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{t("section.popularVehicles")}</h2>
                  <p className="text-muted-foreground mt-1">{t("section.popularVehiclesDesc")}</p>
                </div>
                <Link to="/araclar">
                  <Button variant="outline" className="gap-2">
                    {t("section.viewAll")} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {popularVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>

            {/* Live AI Deals Sidebar */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <LiveAIDeals />
            </div>
          </div>
        </div>
      </section>


      {/* Latest Reviews */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold">{t("section.latestReviews")}</h2>
              <p className="text-muted-foreground mt-1">{t("section.latestReviewsDesc")}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestReviews.map((review) => {
              const vehicle = vehicles.find(v => v.id === review.vehicleId);
              return (
                <div
                  key={review.id}
                  className="block bg-card rounded-2xl border border-border p-6 hover-lift"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="relative group"
                    >
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary transition-all cursor-pointer"
                      />
                      <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div>
                      <p className="font-medium">{review.userName}</p>
                      <Link 
                        to={`/arac/${review.vehicleId}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {vehicle?.brand} {vehicle?.model}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
                  <button 
                    onClick={() => setSelectedReview(review)}
                    className="text-sm text-primary mt-3 hover:underline"
                  >
                    {t("section.readMore")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden gradient-primary p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                {t("cta.title")}
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                {t("cta.subtitle")}
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="gap-2"
                onClick={() => setIsReviewDialogOpen(true)}
              >
                <MessageSquarePlus className="w-5 h-5" />
                {t("cta.button")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-primary" />
              {t("review.writeTitle")}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t("review.writeDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button 
              className="w-full gap-2" 
              onClick={() => {
                setIsReviewDialogOpen(false);
                navigate('/araclar');
              }}
            >
              <Car className="w-4 h-4" />
              {t("review.goToList")}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {t("review.hint")}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedReview && (() => {
            const vehicle = vehicles.find(v => v.id === selectedReview.vehicleId);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={selectedReview.userAvatar}
                      alt={selectedReview.userName}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <DialogTitle className="text-left">{selectedReview.userName}</DialogTitle>
                      <Link 
                        to={`/arac/${selectedReview.vehicleId}`}
                        className="text-sm text-primary hover:underline"
                        onClick={() => setSelectedReview(null)}
                      >
                        {vehicle?.brand} {vehicle?.model} {vehicle?.year}
                      </Link>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Rating & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < selectedReview.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                        />
                      ))}
                      <span className="ml-2 font-semibold">{selectedReview.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {selectedReview.date}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg">{selectedReview.title}</h3>

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed">{selectedReview.content}</p>

                  {/* Pros & Cons */}
                  {(selectedReview.pros.length > 0 || selectedReview.cons.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {selectedReview.pros.length > 0 && (
                        <div className="bg-green-500/10 rounded-xl p-4">
                          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">👍 {t("review.pros")}</h4>
                          <ul className="space-y-1">
                            {selectedReview.pros.map((pro, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedReview.cons.length > 0 && (
                        <div className="bg-red-500/10 rounded-xl p-4">
                          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">👎 {t("review.cons")}</h4>
                          <ul className="space-y-1">
                            {selectedReview.cons.map((con, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Helpful */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedReview.helpful} {t("review.helpful")}
                    </span>
                  </div>

                  {/* Action */}
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => {
                      setSelectedReview(null);
                      navigate(`/arac/${selectedReview.vehicleId}`);
                    }}
                  >
                    <Car className="w-4 h-4" />
                    {t("review.viewVehicle")}
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </Layout>
    </>
  );
};

export default Index;
