import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, Calendar } from "lucide-react";
import { Layout } from "@/components/layout";
import { VehicleCard } from "@/components/vehicles";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/mockData";

const NewModels = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const years = [2026, 2025, 2024, 2023];

  // Filter vehicles by year (2023, 2024, 2025, 2026)
  const newVehicles = vehicles.filter(v => v.year >= 2023);
  
  const filteredVehicles = selectedYear 
    ? newVehicles.filter(v => v.year === selectedYear)
    : newVehicles;

  // Group by year for display
  const vehiclesByYear = years.map(year => ({
    year,
    vehicles: newVehicles.filter(v => v.year === year)
  })).filter(group => group.vehicles.length > 0);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Yeni Modeller</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Yeni Modeller</h1>
              <p className="text-muted-foreground">2023, 2024, 2025 ve 2026 model araçlar</p>
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button
              variant={selectedYear === null ? "default" : "outline"}
              onClick={() => setSelectedYear(null)}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Tümü ({newVehicles.length})
            </Button>
            {years.map(year => {
              const count = newVehicles.filter(v => v.year === year).length;
              return (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  onClick={() => setSelectedYear(year)}
                >
                  {year} ({count})
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {selectedYear ? (
            // Show filtered results
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">{selectedYear} Model Araçlar</h2>
                <span className="text-muted-foreground">{filteredVehicles.length} araç</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Bu yıla ait araç bulunamadı.</p>
                </div>
              )}
            </div>
          ) : (
            // Show grouped by year
            <div className="space-y-12">
              {vehiclesByYear.map(({ year, vehicles: yearVehicles }) => (
                <div key={year} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-display font-bold">{year} Model</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground">{yearVehicles.length} araç</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {yearVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewModels;
