import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, User, Star, ChevronRight, BookOpen, TrendingUp, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { editorialReviews, getFeaturedEditorials } from "@/data/editorialData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EditorialReviews = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const categories = [
    { id: "all", name: "Tümü" },
    { id: "Detaylı İnceleme", name: "Detaylı İnceleme" },
    { id: "Karşılaştırma", name: "Karşılaştırma" },
    { id: "Rehber", name: "Rehber" },
    { id: "Pist Testi", name: "Pist Testi" },
  ];

  const filteredReviews = selectedCategory === "all" 
    ? editorialReviews 
    : editorialReviews.filter(r => r.category === selectedCategory);

  const featuredReviews = getFeaturedEditorials();
  const mainFeatured = featuredReviews[0];
  const sideFeatured = featuredReviews.slice(1, 3);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Lütfen geçerli bir e-posta adresi girin");
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast.info("Bu e-posta adresi zaten kayıtlı!");
        } else {
          throw error;
        }
      } else {
        toast.success("Bültenimize başarıyla abone oldunuz!");
        setEmail("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Bir hata oluştu, lütfen tekrar deneyin");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Editöryal İçerikler</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Uzman İncelemeleri
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Deneyimli otomotiv editörlerimizin hazırladığı detaylı incelemeler, karşılaştırmalar ve satın alma rehberleri.
          </p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Öne Çıkanlar</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Featured */}
            {mainFeatured && (
              <Link 
                to={`/inceleme/${mainFeatured.slug}`}
                className="lg:col-span-2 group relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:min-h-[400px]"
              >
                <img 
                  src={mainFeatured.coverImage} 
                  alt={mainFeatured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <Badge className="mb-3 bg-primary">{mainFeatured.category}</Badge>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3 group-hover:text-accent transition-colors">
                    {mainFeatured.title}
                  </h3>
                  <p className="text-primary-foreground/80 mb-4 line-clamp-2 max-w-2xl">
                    {mainFeatured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-primary-foreground/70 text-sm">
                    <div className="flex items-center gap-2">
                      <img 
                        src={mainFeatured.author.avatar} 
                        alt={mainFeatured.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{mainFeatured.author.name}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mainFeatured.readTime}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      {mainFeatured.rating}/10
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Side Featured */}
            <div className="flex flex-col gap-6">
              {sideFeatured.map((review) => (
                <Link
                  key={review.id}
                  to={`/inceleme/${review.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-video lg:flex-1"
                >
                  <img 
                    src={review.coverImage} 
                    alt={review.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <Badge variant="secondary" className="mb-2 text-xs">{review.category}</Badge>
                    <h3 className="text-lg font-display font-bold text-primary-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {review.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-primary-foreground/70 text-xs">
                      <span>{review.author.name}</span>
                      <span>•</span>
                      <span>{review.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Reviews */}
      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="rounded-full"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <Link
                key={review.id}
                to={`/inceleme/${review.slug}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={review.coverImage}
                    alt={review.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {review.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <Star className="w-3 h-3 fill-accent" />
                      {review.rating}/10
                    </div>
                  </div>
                  
                  <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {review.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {review.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <img 
                        src={review.author.avatar} 
                        alt={review.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{review.author.name}</p>
                        <p className="text-xs text-muted-foreground">{review.author.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {review.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Yeni İncelemelerden Haberdar Olun
            </h2>
            <p className="text-muted-foreground mb-6">
              Haftalık bültenimize abone olun, en son incelemeleri ve otomotiv haberlerini kaçırmayın.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubscribing}
              />
              <Button type="submit" className="gradient-primary border-0 px-6" disabled={isSubscribing}>
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  "Abone Ol"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditorialReviews;
