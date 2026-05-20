import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CheckCircle, Mail, Phone, User, Briefcase, MessageSquare, ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://bvhwrsvtdbbcotsaxkhh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2aHdyc3Z0ZGJiY290c2F4a2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTA0MzEsImV4cCI6MjA5NDYyNjQzMX0.4VpeY7ZUAWjGjv9uIVRp5Ii-Bj_YJHSBvjLb-btCdSk";

const features = [
  { icon: Shield, title: "Premium İlan Yönetimi", desc: "Galerinizin tüm araçlarını tek panelden yönetin." },
  { icon: Zap, title: "AI Destekli Fiyatlama", desc: "Yapay zeka ile rekabetçi fiyat önerileri alın." },
  { icon: TrendingUp, title: "Analitik & Raporlama", desc: "Satış ve izlenme istatistiklerinizi anlık takip edin." },
];

export default function Kurumsal() {
  const [form, setForm] = useState({ firma_adi: "", yetkili_adi: "", email: "", telefon: "", mesaj: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/kurumsal_basvurular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ ...form, site: "arayor" }),
      });
      if (!res.ok) throw new Error("Gönderim başarısız");
      setSuccess(true);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Kurumsal İş Birliği
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            Galerinizi Platforma Taşıyın
            <span className="block text-primary mt-2">Aylık Premium İlan Paketi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Türkiye'nin en gelişmiş araç platformunda galerinizi büyütün. AI destekli araçlar, premium görünürlük ve kurumsal destek ile fark yaratın.
          </p>
          <a href="#form" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Hemen Başvurun <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-card border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="form" className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">Kurumsal Başvuru Formu</h2>
            <p className="text-muted-foreground">Formu doldurun, ekibimiz 24 saat içinde sizinle iletişime geçsin.</p>
          </div>

          {success ? (
            <Card className="bg-card border-primary/30">
              <CardContent className="p-10 text-center">
                <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Başvurunuz Alındı!</h3>
                <p className="text-muted-foreground mb-6">Ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
                <Link to="/">
                  <Button variant="outline">Ana Sayfaya Dön</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="firma_adi" className="flex items-center gap-2 text-foreground">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Firma Adı *
                    </Label>
                    <Input id="firma_adi" name="firma_adi" required placeholder="Şirketinizin adı" value={form.firma_adi} onChange={handleChange} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yetkili_adi" className="flex items-center gap-2 text-foreground">
                      <User className="w-3.5 h-3.5 text-muted-foreground" /> Yetkili Adı *
                    </Label>
                    <Input id="yetkili_adi" name="yetkili_adi" required placeholder="Ad Soyad" value={form.yetkili_adi} onChange={handleChange} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" /> E-posta *
                    </Label>
                    <Input id="email" name="email" type="email" required placeholder="ornek@galeri.com" value={form.email} onChange={handleChange} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefon" className="flex items-center gap-2 text-foreground">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Telefon
                    </Label>
                    <Input id="telefon" name="telefon" type="tel" placeholder="+90 5XX XXX XX XX" value={form.telefon} onChange={handleChange} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mesaj" className="flex items-center gap-2 text-foreground">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /> Mesaj
                    </Label>
                    <Textarea id="mesaj" name="mesaj" placeholder="Beklentileriniz veya sorularınız..." rows={4} value={form.mesaj} onChange={handleChange} className="bg-secondary border-border resize-none" />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
