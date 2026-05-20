import { Link } from "react-router-dom";
import { Star, MessageSquare, TrendingUp, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { VehicleCard } from "@/components/vehicles";
import { vehicles, reviews } from "@/data/mockData";

const MostPopular = () => {
  // Sort vehicles by review count (most reviewed first)
  const sortedVehicles = [...vehicles].sort((a, b) => b.reviewCount - a.reviewCount);
  const mostPopularVehicle = sortedVehicles[0];
  const otherPopularVehicles = sortedVehicles.slice(1, 9);

  // Get reviews for the most popular vehicle
  const vehicleReviews = reviews.filter(r => r.vehicleId === mostPopularVehicle.id).slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">En Popüler</span>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">En Popüler Araç</h1>
              <p className="text-muted-foreground">En çok yorum alan ve beğenilen model</p>
            </div>
          </div>

          {/* Most Popular Vehicle Hero */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={mostPopularVehicle.image}
                alt={`${mostPopularVehicle.brand} ${mostPopularVehicle.model}`}
                className="relative w-full aspect-video object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-accent text-accent-foreground font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                #1 En Popüler
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium mb-2">{mostPopularVehicle.brand}</p>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  {mostPopularVehicle.model}
                </h2>
                <p className="text-muted-foreground text-lg">{mostPopularVehicle.description}</p>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(mostPopularVehicle.rating) ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{mostPopularVehicle.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{mostPopularVehicle.reviewCount} Yorum</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Fiyat</p>
                  <p className="text-xl font-bold gradient-text">{mostPopularVehicle.price}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Yıl</p>
                  <p className="text-xl font-bold">{mostPopularVehicle.year}</p>
                </div>
              </div>

              <Link
                to={`/arac/${mostPopularVehicle.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Detayları İncele
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      {vehicleReviews.length > 0 && (
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-display font-bold mb-8">Son Yorumlar</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {vehicleReviews.map((review) => (
                <div key={review.id} className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{review.userName}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
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
                  <p className="text-sm text-muted-foreground line-clamp-3">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Popular Vehicles */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-display font-bold mb-2">Diğer Popüler Araçlar</h3>
          <p className="text-muted-foreground mb-8">En çok incelenen diğer modeller</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherPopularVehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-10">
                  #{index + 2}
                </div>
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MostPopular;
