import { useState } from "react";
import { Plus, Car, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brands, categories } from "@/data/mockData";
import { toast } from "sonner";

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddVehicleDialog({ open, onOpenChange }: AddVehicleDialogProps) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    category: "",
    price: "",
    engine: "",
    power: "",
    fuel: "",
    transmission: "",
    description: "",
  });

  const years = ["2025", "2024", "2023", "2022", "2021", "2020"];
  const fuelTypes = ["Benzin", "Dizel", "Elektrik", "Benzin/Elektrik", "LPG"];
  const transmissionTypes = ["Otomatik", "Manuel", "Yarı Otomatik", "CVT"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.brand || !formData.model || !formData.year || !formData.category) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }

    // Here you would typically send the data to your backend
    toast.success("Araç öneriniz başarıyla gönderildi! İncelendikten sonra listeye eklenecektir.");
    
    // Reset form and close dialog
    setFormData({
      brand: "",
      model: "",
      year: "",
      category: "",
      price: "",
      engine: "",
      power: "",
      fuel: "",
      transmission: "",
      description: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Car className="w-5 h-5 text-primary" />
            Yeni Araç Öner
          </DialogTitle>
          <DialogDescription>
            Aradığınız aracı bulamadınız mı? Aşağıdaki formu doldurarak yeni bir araç önerebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Temel Bilgiler
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marka *</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => setFormData({ ...formData, brand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Marka seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="Örn: Corolla, 3 Serisi"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Yıl *</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => setFormData({ ...formData, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yıl seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Tahmini Fiyat</Label>
              <Input
                id="price"
                placeholder="Örn: 1.500.000 ₺"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Teknik Özellikler
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engine">Motor</Label>
                <Input
                  id="engine"
                  placeholder="Örn: 2.0L Turbo"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="power">Güç</Label>
                <Input
                  id="power"
                  placeholder="Örn: 200 HP"
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel">Yakıt Tipi</Label>
                <Select
                  value={formData.fuel}
                  onValueChange={(value) => setFormData({ ...formData, fuel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yakıt tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Şanzıman</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Şanzıman seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissionTypes.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Ek Bilgiler</Label>
            <Textarea
              id="description"
              placeholder="Araç hakkında eklemek istediğiniz bilgileri yazın..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Plus className="w-4 h-4" />
              Araç Öner
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add Vehicle Card Component
export function AddVehicleCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 hover:border-primary/50 hover:bg-card transition-all duration-300 min-h-[320px] cursor-pointer"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-6">
        {/* Plus Icon Circle */}
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <Plus className="w-10 h-10 text-muted-foreground/50 group-hover:text-primary transition-colors duration-300" />
        </div>
        
        {/* Text */}
        <div className="text-center space-y-1">
          <p className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Aradığın aracı bulamadın mı?
          </p>
          <p className="text-sm text-primary font-semibold">
            Yeni araç öner
          </p>
        </div>
      </div>

      {/* Corner Decoration */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Car className="w-5 h-5 text-primary/50" />
      </div>
    </button>
  );
}
