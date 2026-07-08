import { useState } from "react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  ShieldCheck,
  Car,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const insurers = [
  { name: "Anadolu Sigorta", domain: "anadolusigorta.com.tr", url: "https://www.anadolusigorta.com.tr", rating: 4.5, features: ["Türkiye'nin ilk sigortası", "3500+ acente"] },
  { name: "Allianz Türkiye", domain: "allianz.com.tr", url: "https://www.allianz.com.tr", rating: 4.4, features: ["Global marka", "7/24 asistans"] },
  { name: "AXA Sigorta", domain: "axasigorta.com.tr", url: "https://www.axasigorta.com.tr", rating: 4.3, features: ["Hızlı hasar ödeme", "Online işlem"] },
  { name: "Aksigorta", domain: "aksigorta.com.tr", url: "https://www.aksigorta.com.tr", rating: 4.4, features: ["Sabancı grubu", "Geniş servis ağı"] },
  { name: "Türkiye Sigorta", domain: "turkiyesigorta.com.tr", url: "https://www.turkiyesigorta.com.tr", rating: 4.2, features: ["Yerli ve milli", "Uygun prim"] },
  { name: "HDI Sigorta", domain: "hdisigorta.com.tr", url: "https://www.hdisigorta.com.tr", rating: 4.1, features: ["Alman kalitesi", "Detaylı poliçe"] },
  { name: "Ray Sigorta", domain: "raysigorta.com.tr", url: "https://www.raysigorta.com.tr", rating: 4.0, features: ["100+ yıllık tecrübe", "Özel indirimler"] },
  { name: "Sompo Sigorta", domain: "sompo.com.tr", url: "https://www.sompo.com.tr", rating: 4.2, features: ["Japon güvencesi", "Yenilikçi ürünler"] },
];

type QuoteType = "kasko" | "trafik";

interface QuoteForm {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  plate: string;
  brand: string;
  model: string;
  year: string;
  fuel_type: string;
  usage_type: string;
  notes: string;
}

const emptyForm: QuoteForm = {
  full_name: "",
  phone: "",
  email: "",
  city: "",
  plate: "",
  brand: "",
  model: "",
  year: "",
  fuel_type: "",
  usage_type: "",
  notes: "",
};

function QuoteFormCard({ type }: { type: QuoteType }) {
  const [form, setForm] = useState<QuoteForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const update = (key: keyof QuoteForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({
        title: "Eksik bilgi",
        description: "Ad soyad ve telefon zorunludur.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const payload = {
        quote_type: type,
        user_id: userData.user?.id ?? null,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        city: form.city.trim() || null,
        plate: form.plate.trim() || null,
        brand: form.brand.trim() || null,
        model: form.model.trim() || null,
        year: form.year ? parseInt(form.year, 10) : null,
        fuel_type: form.fuel_type || null,
        usage_type: form.usage_type || null,
        notes: form.notes.trim() || null,
      };
      const { error } = await supabase.from("insurance_quotes").insert(payload);
      if (error) throw error;
      setSubmitted(true);
      setForm(emptyForm);
      toast({
        title: "Talebiniz alındı",
        description: "Uzman ekibimiz kısa süre içinde sizinle iletişime geçecek.",
      });
    } catch (err: any) {
      console.error("Insurance quote error:", err);
      toast({
        title: "Bir hata oluştu",
        description: err?.message || "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-emerald-500/40 bg-emerald-500/5">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold">Talebiniz Alındı</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {type === "kasko" ? "Kasko" : "Trafik sigortası"} teklifiniz için başvurunuz kaydedildi.
            Uzman ekibimiz en uygun teklifleri hazırlayarak sizinle iletişime geçecek.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Yeni teklif iste
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {type === "kasko" ? <ShieldCheck className="w-5 h-5 text-primary" /> : <Shield className="w-5 h-5 text-primary" />}
            {type === "kasko" ? "Kasko Teklifi Al" : "Trafik Sigortası Teklifi Al"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ad Soyad *</Label>
              <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Telefon *</Label>
              <Input type="tel" placeholder="+90 5xx xxx xx xx" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>E-posta</Label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Şehir</Label>
              <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" /> Araç Bilgileri
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plaka</Label>
                <Input placeholder="34 ABC 123" value={form.plate} onChange={(e) => update("plate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Yıl</Label>
                <Input type="number" min="1990" max="2026" value={form.year} onChange={(e) => update("year", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Marka</Label>
                <Input value={form.brand} onChange={(e) => update("brand", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input value={form.model} onChange={(e) => update("model", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Yakıt Tipi</Label>
                <Select value={form.fuel_type} onValueChange={(v) => update("fuel_type", v)}>
                  <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Benzin">Benzin</SelectItem>
                    <SelectItem value="Dizel">Dizel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Elektrik">Elektrik</SelectItem>
                    <SelectItem value="LPG">LPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kullanım Şekli</Label>
                <Select value={form.usage_type} onValueChange={(v) => update("usage_type", v)}>
                  <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hususi">Hususi</SelectItem>
                    <SelectItem value="Ticari">Ticari</SelectItem>
                    <SelectItem value="Taksi">Taksi</SelectItem>
                    <SelectItem value="Kiralık">Kiralık</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notlar (opsiyonel)</Label>
            <Textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Ek talepleriniz varsa belirtebilirsiniz" />
          </div>

          <Button type="submit" className="w-full h-12 gradient-primary border-0" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Teklif İste"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Talebiniz güvenli şekilde saklanır. Verileriniz üçüncü kişilerle paylaşılmaz.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}

const Insurance = () => {
  return (
    <Layout>
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <ShieldCheck className="w-3 h-3 mr-1" /> Sigorta Teklifi
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              En Uygun <span className="gradient-text">Sigorta Teklifleri</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Kasko ve trafik sigortası için Türkiye'nin önde gelen sigorta şirketlerinden teklif alın.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="kasko" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="kasko">Kasko</TabsTrigger>
              <TabsTrigger value="trafik">Trafik Sigortası</TabsTrigger>
              <TabsTrigger value="sirketler">Sigorta Şirketleri</TabsTrigger>
            </TabsList>

            <TabsContent value="kasko"><QuoteFormCard type="kasko" /></TabsContent>
            <TabsContent value="trafik"><QuoteFormCard type="trafik" /></TabsContent>

            <TabsContent value="sirketler">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insurers.map((ins) => (
                  <Card key={ins.domain} className="hover:shadow-lg transition-all">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white border border-border flex items-center justify-center p-2 shrink-0">
                        <img
                          src={`https://logo.clearbit.com/${ins.domain}`}
                          alt={ins.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{ins.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{ins.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ins.features.map((f) => (
                            <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => window.open(ins.url, "_blank")}>
                        Git <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Insurance;
