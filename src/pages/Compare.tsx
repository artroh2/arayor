import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeftRight, 
  Plus, 
  X, 
  Check, 
  Minus,
  Star,
  Fuel,
  Gauge,
  Cog,
  Zap,
  Timer,
  Car,
  ChevronDown
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicles, Vehicle, brands } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useCompare } from "@/contexts/CompareContext";

// Extended vehicle data with package features for comparison
const vehiclePackages: Record<string, { standard: string[]; optional: string[] }> = {
  "1": { // Toyota Corolla
    standard: ["LED Farlar", "7 Airbag", "Klima", "Geri Görüş Kamerası", "Bluetooth", "USB Bağlantısı", "Start/Stop Sistemi"],
    optional: ["Sunroof", "Deri Koltuk", "Navigasyon", "Harman Kardon Ses Sistemi", "Kablosuz Şarj", "Head-Up Display"]
  },
  "2": { // BMW 3 Serisi
    standard: ["LED Farlar", "8 Airbag", "Otomatik Klima", "Geri Görüş Kamerası", "Bluetooth", "USB Bağlantısı", "Start/Stop Sistemi", "Sunroof", "Deri Koltuk", "Navigasyon"],
    optional: ["Harman Kardon Ses Sistemi", "Kablosuz Şarj", "Head-Up Display", "M Sport Paket", "Adaptif Süspansiyon", "Lazer Farlar"]
  },
  "3": { // Mercedes GLC
    standard: ["LED Farlar", "9 Airbag", "Otomatik Klima", "360° Kamera", "Bluetooth", "USB Bağlantısı", "Start/Stop Sistemi", "Sunroof", "Deri Koltuk", "Navigasyon", "Kablosuz Şarj"],
    optional: ["Burmester Ses Sistemi", "Head-Up Display", "AMG Paket", "Air Body Control", "MBUX Augmented Reality", "Gece Görüş Asistanı"]
  },
  "4": { // Honda Civic
    standard: ["LED Farlar", "6 Airbag", "Klima", "Geri Görüş Kamerası", "Bluetooth", "USB Bağlantısı", "Start/Stop Sistemi", "Honda Sensing"],
    optional: ["Sunroof", "Deri Koltuk", "Navigasyon", "Bose Ses Sistemi", "Kablosuz Şarj", "Wireless Apple CarPlay"]
  },
  "5": { // VW Tiguan
    standard: ["LED Farlar", "7 Airbag", "Otomatik Klima", "Geri Görüş Kamerası", "Bluetooth", "USB Bağlantısı", "Start/Stop Sistemi", "Digital Cockpit"],
    optional: ["Panoramik Cam Tavan", "Deri Koltuk", "Navigasyon", "Harman Kardon Ses Sistemi", "Kablosuz Şarj", "Head-Up Display", "Matrix LED Farlar"]
  },
  "6": { // Audi A4
    standard: ["LED Farlar", "8 Airbag", "Otomatik Klima", "Geri Görüş Kamerası", "Bluetooth", "USB Bağlantısı", "Start/Stop Sistemi", "Virtual Cockpit", "Deri Koltuk"],
    optional: ["Sunroof", "B&O Ses Sistemi", "Navigasyon", "Matrix LED Farlar", "Kablosuz Şarj", "Head-Up Display", "S Line Paket", "Quattro AWD"]
  }
};

const allFeatures = [
  "LED Farlar", "Lazer Farlar", "Matrix LED Farlar",
  "6 Airbag", "7 Airbag", "8 Airbag", "9 Airbag",
  "Klima", "Otomatik Klima",
  "Geri Görüş Kamerası", "360° Kamera",
  "Bluetooth", "USB Bağlantısı", "Start/Stop Sistemi",
  "Sunroof", "Panoramik Cam Tavan",
  "Deri Koltuk", "Navigasyon",
  "Kablosuz Şarj", "Head-Up Display",
  "Digital Cockpit", "Virtual Cockpit",
  "Honda Sensing", "Harman Kardon Ses Sistemi", "Bose Ses Sistemi", "B&O Ses Sistemi", "Burmester Ses Sistemi",
  "M Sport Paket", "AMG Paket", "S Line Paket",
  "Adaptif Süspansiyon", "Air Body Control", "Quattro AWD",
  "Wireless Apple CarPlay", "MBUX Augmented Reality", "Gece Görüş Asistanı"
];

const Compare = () => {
  const { vehicle1: contextVehicle1, vehicle2: contextVehicle2, clearCompare } = useCompare();
  
  // Vehicle 1 filters
  const [brand1, setBrand1] = useState<string>("");
  const [model1, setModel1] = useState<string>("");
  const [year1, setYear1] = useState<string>("");
  
  // Vehicle 2 filters
  const [brand2, setBrand2] = useState<string>("");
  const [model2, setModel2] = useState<string>("");
  const [year2, setYear2] = useState<string>("");
  
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Initialize filters from context
  useEffect(() => {
    if (contextVehicle1) {
      setBrand1(contextVehicle1.brandId);
      setModel1(contextVehicle1.model);
      setYear1(contextVehicle1.year.toString());
    }
  }, [contextVehicle1]);

  useEffect(() => {
    if (contextVehicle2) {
      setBrand2(contextVehicle2.brandId);
      setModel2(contextVehicle2.model);
      setYear2(contextVehicle2.year.toString());
    }
  }, [contextVehicle2]);

  // Get unique brands from vehicles
  const availableBrands = useMemo(() => {
    const brandSet = new Set(vehicles.map(v => v.brandId));
    return brands.filter(b => brandSet.has(b.id));
  }, []);

  // Get models for selected brand
  const getModelsForBrand = (brandId: string) => {
    if (!brandId) return [];
    const models = vehicles.filter(v => v.brandId === brandId);
    const uniqueModels = Array.from(new Set(models.map(v => v.model)));
    return uniqueModels;
  };

  // Get years for selected brand and model
  const getYearsForModel = (brandId: string, modelName: string) => {
    if (!brandId || !modelName) return [];
    const years = vehicles
      .filter(v => v.brandId === brandId && v.model === modelName)
      .map(v => v.year.toString());
    return Array.from(new Set(years)).sort((a, b) => parseInt(b) - parseInt(a));
  };

  // Find vehicle based on filters
  const findVehicle = (brandId: string, modelName: string, yearStr: string): Vehicle | undefined => {
    if (!brandId || !modelName) return undefined;
    return vehicles.find(v => 
      v.brandId === brandId && 
      v.model === modelName && 
      (yearStr ? v.year.toString() === yearStr : true)
    );
  };

  const vehicle1 = findVehicle(brand1, model1, year1);
  const vehicle2 = findVehicle(brand2, model2, year2);

  // Reset dependent filters when parent changes
  const handleBrand1Change = (value: string) => {
    setBrand1(value);
    setModel1("");
    setYear1("");
  };

  const handleModel1Change = (value: string) => {
    setModel1(value);
    setYear1("");
  };

  const handleBrand2Change = (value: string) => {
    setBrand2(value);
    setModel2("");
    setYear2("");
  };

  const handleModel2Change = (value: string) => {
    setModel2(value);
    setYear2("");
  };

  const clearVehicle1 = () => {
    setBrand1("");
    setModel1("");
    setYear1("");
    clearCompare();
  };

  const clearVehicle2 = () => {
    setBrand2("");
    setModel2("");
    setYear2("");
  };

  const getFeatureStatus = (vehicleId: string, feature: string): "standard" | "optional" | "none" => {
    const packages = vehiclePackages[vehicleId];
    if (!packages) return "none";
    if (packages.standard.includes(feature)) return "standard";
    if (packages.optional.includes(feature)) return "optional";
    return "none";
  };

  const getRelevantFeatures = () => {
    if (!vehicle1 && !vehicle2) return [];
    
    const features = new Set<string>();
    
    if (vehicle1?.id && vehiclePackages[vehicle1.id]) {
      vehiclePackages[vehicle1.id].standard.forEach(f => features.add(f));
      vehiclePackages[vehicle1.id].optional.forEach(f => features.add(f));
    }
    
    if (vehicle2?.id && vehiclePackages[vehicle2.id]) {
      vehiclePackages[vehicle2.id].standard.forEach(f => features.add(f));
      vehiclePackages[vehicle2.id].optional.forEach(f => features.add(f));
    }
    
    return Array.from(features);
  };

  const displayFeatures = showAllFeatures ? allFeatures : getRelevantFeatures();

  const specs = [
    { key: "engine", label: "Motor", icon: Cog },
    { key: "power", label: "Güç", icon: Zap },
    { key: "fuel", label: "Yakıt Tipi", icon: Fuel },
    { key: "transmission", label: "Şanzıman", icon: Gauge },
    { key: "acceleration", label: "Hızlanma", icon: Timer },
    { key: "topSpeed", label: "Maks. Hız", icon: Car },
    { key: "fuelConsumption", label: "Yakıt Tüketimi", icon: Fuel },
  ];

  const compareValue = (val1: string | undefined, val2: string | undefined, key: string): { better1: boolean; better2: boolean } => {
    if (!val1 || !val2) return { better1: false, better2: false };
    
    // Extract numbers for comparison
    const num1 = parseFloat(val1.replace(/[^\d.]/g, ''));
    const num2 = parseFloat(val2.replace(/[^\d.]/g, ''));
    
    if (isNaN(num1) || isNaN(num2)) return { better1: false, better2: false };
    
    // For these, lower is better
    if (key === "fuelConsumption" || key === "acceleration") {
      return { better1: num1 < num2, better2: num2 < num1 };
    }
    
    // For these, higher is better
    return { better1: num1 > num2, better2: num2 > num1 };
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-sm font-medium">Araç Karşılaştırma</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Araçları Karşılaştır
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            İki aracı yan yana karşılaştırarak özellikler, teknik detaylar ve donanım paketleri arasındaki farkları keşfedin.
          </p>
        </div>
      </section>

      {/* Vehicle Selection */}
      <section className="py-6 border-b border-border sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
            {/* Vehicle 1 Selector */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">1. Araç</span>
                {(brand1 || model1 || year1) && (
                  <Button variant="ghost" size="sm" onClick={clearVehicle1} className="h-7 text-xs">
                    <X className="w-3 h-3 mr-1" /> Temizle
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select value={brand1} onValueChange={handleBrand1Change}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Marka" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={model1} onValueChange={handleModel1Change} disabled={!brand1}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {getModelsForBrand(brand1).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={year1} onValueChange={setYear1} disabled={!model1}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Yıl" />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearsForModel(brand1, model1).map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {vehicle1 && (
                <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
                  <img src={vehicle1.image} alt={vehicle1.model} className="w-16 h-10 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{vehicle1.brand} {vehicle1.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle1.year} • {vehicle1.price}</p>
                  </div>
                </div>
              )}
            </div>

            {/* VS Badge */}
            <div className="hidden md:flex items-center justify-center pt-8">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                VS
              </div>
            </div>

            {/* Vehicle 2 Selector */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">2. Araç</span>
                {(brand2 || model2 || year2) && (
                  <Button variant="ghost" size="sm" onClick={clearVehicle2} className="h-7 text-xs">
                    <X className="w-3 h-3 mr-1" /> Temizle
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select value={brand2} onValueChange={handleBrand2Change}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Marka" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={model2} onValueChange={handleModel2Change} disabled={!brand2}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {getModelsForBrand(brand2).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={year2} onValueChange={setYear2} disabled={!model2}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Yıl" />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearsForModel(brand2, model2).map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {vehicle2 && (
                <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
                  <img src={vehicle2.image} alt={vehicle2.model} className="w-16 h-10 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{vehicle2.brand} {vehicle2.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle2.year} • {vehicle2.price}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Content */}
      {(vehicle1 || vehicle2) ? (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Vehicle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Vehicle 1 Card */}
              <div className={cn(
                "rounded-2xl border-2 overflow-hidden transition-all",
                vehicle1 ? "border-primary bg-card" : "border-dashed border-border bg-secondary/30"
              )}>
                {vehicle1 ? (
                  <>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={vehicle1.image} 
                        alt={`${vehicle1.brand} ${vehicle1.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className="mb-2">{vehicle1.category}</Badge>
                          <h3 className="text-xl font-display font-bold">
                            {vehicle1.brand} {vehicle1.model}
                          </h3>
                          <p className="text-muted-foreground">{vehicle1.year} Model</p>
                        </div>
                        <div className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-accent" />
                          <span className="font-bold">{vehicle1.rating}</span>
                        </div>
                      </div>
                      <div className="text-2xl font-display font-bold text-primary">
                        {vehicle1.price}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Karşılaştırmak için araç seçin</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle 2 Card */}
              <div className={cn(
                "rounded-2xl border-2 overflow-hidden transition-all",
                vehicle2 ? "border-primary bg-card" : "border-dashed border-border bg-secondary/30"
              )}>
                {vehicle2 ? (
                  <>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={vehicle2.image} 
                        alt={`${vehicle2.brand} ${vehicle2.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className="mb-2">{vehicle2.category}</Badge>
                          <h3 className="text-xl font-display font-bold">
                            {vehicle2.brand} {vehicle2.model}
                          </h3>
                          <p className="text-muted-foreground">{vehicle2.year} Model</p>
                        </div>
                        <div className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-accent" />
                          <span className="font-bold">{vehicle2.rating}</span>
                        </div>
                      </div>
                      <div className="text-2xl font-display font-bold text-primary">
                        {vehicle2.price}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Karşılaştırmak için araç seçin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specs Comparison */}
            {(vehicle1 && vehicle2) && (
              <>
                <div className="mb-12">
                  <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-primary" />
                    Teknik Özellikler
                  </h2>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    {specs.map((spec, idx) => {
                      const val1 = vehicle1.specs[spec.key as keyof typeof vehicle1.specs];
                      const val2 = vehicle2.specs[spec.key as keyof typeof vehicle2.specs];
                      const comparison = compareValue(val1, val2, spec.key);
                      
                      return (
                        <div 
                          key={spec.key}
                          className={cn(
                            "grid grid-cols-[1fr,auto,1fr] items-center",
                            idx !== specs.length - 1 && "border-b border-border"
                          )}
                        >
                          <div className={cn(
                            "p-4 text-center",
                            comparison.better1 && "bg-success/10"
                          )}>
                            <span className={cn(
                              "font-medium",
                              comparison.better1 && "text-success"
                            )}>
                              {val1}
                            </span>
                            {comparison.better1 && (
                              <Badge variant="outline" className="ml-2 text-xs border-success text-success">
                                Daha İyi
                              </Badge>
                            )}
                          </div>
                          <div className="px-4 py-4 bg-secondary/50 flex items-center gap-2 min-w-[160px] justify-center">
                            <spec.icon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{spec.label}</span>
                          </div>
                          <div className={cn(
                            "p-4 text-center",
                            comparison.better2 && "bg-success/10"
                          )}>
                            <span className={cn(
                              "font-medium",
                              comparison.better2 && "text-success"
                            )}>
                              {val2}
                            </span>
                            {comparison.better2 && (
                              <Badge variant="outline" className="ml-2 text-xs border-success text-success">
                                Daha İyi
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Features/Packages Comparison */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Donanım Paketleri
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                    >
                      {showAllFeatures ? "Sadece Mevcut Özellikler" : "Tüm Özellikleri Göster"}
                    </Button>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                      <span>Standart</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-accent" />
                      </div>
                      <span>Opsiyonel</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span>Mevcut Değil</span>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr,auto,1fr] border-b border-border bg-secondary/30">
                      <div className="p-4 text-center font-semibold">
                        {vehicle1.brand} {vehicle1.model}
                      </div>
                      <div className="px-4 py-4 min-w-[200px] text-center font-semibold">
                        Özellik
                      </div>
                      <div className="p-4 text-center font-semibold">
                        {vehicle2.brand} {vehicle2.model}
                      </div>
                    </div>

                    {/* Features */}
                    {displayFeatures.map((feature, idx) => {
                      const status1 = getFeatureStatus(vehicle1?.id || "", feature);
                      const status2 = getFeatureStatus(vehicle2?.id || "", feature);
                      
                      return (
                        <div 
                          key={feature}
                          className={cn(
                            "grid grid-cols-[1fr,auto,1fr] items-center",
                            idx !== displayFeatures.length - 1 && "border-b border-border"
                          )}
                        >
                          <div className="p-4 flex justify-center">
                            {status1 === "standard" && (
                              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                                <Check className="w-5 h-5 text-success" />
                              </div>
                            )}
                            {status1 === "optional" && (
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-accent" />
                              </div>
                            )}
                            {status1 === "none" && (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <Minus className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="px-4 py-3 bg-secondary/30 min-w-[200px] text-center text-sm">
                            {feature}
                          </div>
                          <div className="p-4 flex justify-center">
                            {status2 === "standard" && (
                              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                                <Check className="w-5 h-5 text-success" />
                              </div>
                            )}
                            {status2 === "optional" && (
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-accent" />
                              </div>
                            )}
                            {status2 === "none" && (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <Minus className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to={`/arac/${vehicle1.id}`}>
                    <Button variant="outline" className="w-full h-12 gap-2">
                      {vehicle1.brand} {vehicle1.model} Detayları
                    </Button>
                  </Link>
                  <Link to={`/arac/${vehicle2.id}`}>
                    <Button variant="outline" className="w-full h-12 gap-2">
                      {vehicle2.brand} {vehicle2.model} Detayları
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      ) : (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <ArrowLeftRight className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-display font-bold mb-3">
                Karşılaştırma Başlatın
              </h2>
              <p className="text-muted-foreground mb-6">
                Yukarıdan iki araç seçerek detaylı karşılaştırma yapabilirsiniz.
              </p>
              
              {/* Popular Comparisons */}
              <div className="text-left mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Popüler Karşılaştırmalar</h3>
                <div className="space-y-2">
                  {[
                    { brandId1: "4", model1: "GLC 300", brandId2: "3", model2: "X5 xDrive40i", label: "Mercedes GLC 300 vs BMW X5 xDrive40i" },
                    { brandId1: "7", model1: "XC60 B5", brandId2: "3", model2: "X5 xDrive40i", label: "Volvo XC60 B5 vs BMW X5 xDrive40i" },
                    { brandId1: "8", model1: "T10X Long Range", brandId2: "9", model2: "Model 3 Long Range", label: "Togg T10X Long Range vs Tesla Model 3 Long Range" },
                  ].map((comp) => (
                    <button
                      key={comp.label}
                      onClick={() => {
                        setBrand1(comp.brandId1);
                        setModel1(comp.model1);
                        setBrand2(comp.brandId2);
                        setModel2(comp.model2);
                      }}
                      className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors text-left flex items-center justify-between group"
                    >
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {comp.label}
                      </span>
                      <ArrowLeftRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Compare;
