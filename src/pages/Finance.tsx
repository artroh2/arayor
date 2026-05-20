import { useState } from "react";
import { Layout } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Landmark,
  Calculator,
  TrendingDown,
  Clock,
  Shield,
  ChevronRight,
  Search,
  Car,
  Percent,
  Calendar,
  Banknote,
  Info,
  ExternalLink,
  Star,
  CheckCircle2,
} from "lucide-react";

// Bank loan offers data
const bankOffers = [
  {
    id: "1",
    bankName: "Ziraat Bankası",
    logo: bankLogos["Ziraat Bankası"],
    interestRate: 3.29,
    minTerm: 12,
    maxTerm: 60,
    minAmount: 100000,
    maxAmount: 2500000,
    type: "vehicle",
    features: ["Hızlı onay", "Uygun faiz", "Esnek vade"],
    monthlyPayment: 18750,
    specialOffer: true,
    rating: 4.5,
    website: "https://www.ziraatbank.com.tr",
  },
  {
    id: "2",
    bankName: "Garanti BBVA",
    logo: bankLogos["Garanti BBVA"],
    interestRate: 3.49,
    minTerm: 12,
    maxTerm: 48,
    minAmount: 50000,
    maxAmount: 2000000,
    type: "vehicle",
    features: ["Online başvuru", "Anında sonuç", "Bonus puan"],
    monthlyPayment: 19200,
    specialOffer: false,
    rating: 4.3,
    website: "https://www.garantibbva.com.tr",
  },
  {
    id: "3",
    bankName: "İş Bankası",
    logo: bankLogos["İş Bankası"],
    interestRate: 3.39,
    minTerm: 12,
    maxTerm: 60,
    minAmount: 75000,
    maxAmount: 3000000,
    type: "both",
    features: ["Düşük faiz", "Geniş vade", "Kolay ödeme"],
    monthlyPayment: 18950,
    specialOffer: true,
    rating: 4.4,
    website: "https://www.isbank.com.tr",
  },
  {
    id: "4",
    bankName: "Yapı Kredi",
    logo: bankLogos["Yapı Kredi"],
    interestRate: 3.59,
    minTerm: 12,
    maxTerm: 48,
    minAmount: 50000,
    maxAmount: 2500000,
    type: "vehicle",
    features: ["World kart avantajı", "Erken ödeme", "SMS bilgilendirme"],
    monthlyPayment: 19450,
    specialOffer: false,
    rating: 4.2,
    website: "https://www.yapikredi.com.tr",
  },
  {
    id: "5",
    bankName: "Akbank",
    logo: bankLogos["Akbank"],
    interestRate: 3.45,
    minTerm: 12,
    maxTerm: 60,
    minAmount: 100000,
    maxAmount: 2000000,
    type: "both",
    features: ["Axess avantajı", "Masrafsız kredi", "Hızlı değerlendirme"],
    monthlyPayment: 19100,
    specialOffer: true,
    rating: 4.4,
    website: "https://www.akbank.com",
  },
  {
    id: "6",
    bankName: "Halkbank",
    logo: bankLogos["Halkbank"],
    interestRate: 3.25,
    minTerm: 12,
    maxTerm: 60,
    minAmount: 50000,
    maxAmount: 2000000,
    type: "vehicle",
    features: ["En düşük faiz", "Devlet desteği", "Ertelemeli ödeme"],
    monthlyPayment: 18650,
    specialOffer: true,
    rating: 4.6,
    website: "https://www.halkbank.com.tr",
  },
  {
    id: "7",
    bankName: "QNB Finansbank",
    logo: bankLogos["QNB Finansbank"],
    interestRate: 3.55,
    minTerm: 12,
    maxTerm: 48,
    minAmount: 75000,
    maxAmount: 1500000,
    type: "consumer",
    features: ["CardFinans avantajı", "Online başvuru", "7/24 destek"],
    monthlyPayment: 19350,
    specialOffer: false,
    rating: 4.1,
    website: "https://www.qnbfinansbank.com",
  },
  {
    id: "8",
    bankName: "Denizbank",
    logo: bankLogos["Denizbank"],
    interestRate: 3.65,
    minTerm: 12,
    maxTerm: 48,
    minAmount: 50000,
    maxAmount: 1500000,
    type: "both",
    features: ["Bonuslu kart", "Esnek ödeme planı", "Masrafsız işlem"],
    monthlyPayment: 19550,
    specialOffer: false,
    rating: 4.0,
    website: "https://www.denizbank.com",
  },
];

const Finance = () => {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [loanType, setLoanType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("rate");

  // Filter and sort offers
  const filteredOffers = bankOffers
    .filter((offer) => {
      const matchesSearch = offer.bankName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = loanType === "all" || offer.type === loanType || offer.type === "both";
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "rate") return a.interestRate - b.interestRate;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "amount") return b.maxAmount - a.maxAmount;
      return 0;
    });

  // Calculate monthly payment
  const calculateMonthlyPayment = (amount: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(payment);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <Landmark className="w-3 h-3 mr-1" />
              {t("finance.badge") || "Araç Finansmanı"}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {t("finance.title") || "En Uygun"}{" "}
              <span className="gradient-text">{t("finance.titleHighlight") || "Araç Kredisi"}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("finance.subtitle") || "Türkiye'nin önde gelen bankalarının araç kredisi tekliflerini karşılaştırın, en uygun faiz oranlarını keşfedin."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Landmark className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{bankOffers.length}+</p>
              <p className="text-sm text-muted-foreground">{t("finance.banks") || "Banka"}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-2">
                <Percent className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold">%3.25</p>
              <p className="text-sm text-muted-foreground">{t("finance.minRate") || "En Düşük Faiz"}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold">60</p>
              <p className="text-sm text-muted-foreground">{t("finance.maxTerm") || "Ay Vade"}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                <Banknote className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">3M</p>
              <p className="text-sm text-muted-foreground">{t("finance.maxAmount") || "TL'ye Kadar"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                {t("finance.calculator") || "Kredi Hesaplama"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Loan Amount */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>{t("finance.loanAmount") || "Kredi Tutarı"}</span>
                    <span className="text-primary font-bold">{formatCurrency(loanAmount)}</span>
                  </label>
                  <Slider
                    value={[loanAmount]}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    min={50000}
                    max={3000000}
                    step={50000}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50.000 ₺</span>
                    <span>3.000.000 ₺</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>{t("finance.loanTerm") || "Vade"}</span>
                    <span className="text-primary font-bold">{loanTerm} {t("finance.months") || "Ay"}</span>
                  </label>
                  <Slider
                    value={[loanTerm]}
                    onValueChange={(value) => setLoanTerm(value[0])}
                    min={12}
                    max={60}
                    step={6}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12 Ay</span>
                    <span>60 Ay</span>
                  </div>
                </div>

                {/* Loan Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">{t("finance.loanType") || "Kredi Türü"}</label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kredi türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("finance.allTypes") || "Tüm Krediler"}</SelectItem>
                      <SelectItem value="vehicle">{t("finance.vehicleLoan") || "Araç Kredisi"}</SelectItem>
                      <SelectItem value="consumer">{t("finance.consumerLoan") || "İhtiyaç Kredisi"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("finance.searchBank") || "Banka ara..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rate">{t("finance.sortByRate") || "En Düşük Faiz"}</SelectItem>
                <SelectItem value="rating">{t("finance.sortByRating") || "En Yüksek Puan"}</SelectItem>
                <SelectItem value="amount">{t("finance.sortByAmount") || "En Yüksek Limit"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredOffers.map((offer) => {
              const monthlyPayment = calculateMonthlyPayment(loanAmount, offer.interestRate, loanTerm);
              const totalPayment = monthlyPayment * loanTerm;
              const totalInterest = totalPayment - loanAmount;

              return (
                <Card
                  key={offer.id}
                  className={`hover:shadow-lg transition-all duration-300 ${
                    offer.specialOffer ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                      {/* Bank Info */}
                      <div className="flex items-center gap-4 lg:w-[220px]">
                        <div className="w-16 h-16 rounded-xl bg-white border border-border flex items-center justify-center p-2 shrink-0">
                          <img
                            src={offer.logo}
                            alt={offer.bankName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/64x64?text=Bank";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{offer.bankName}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span>{offer.rating}</span>
                          </div>
                          {offer.specialOffer && (
                            <Badge variant="secondary" className="mt-1 bg-primary/20 text-primary text-xs">
                              {t("finance.specialOffer") || "Özel Teklif"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Rate & Details */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">{t("finance.interestRate") || "Faiz Oranı"}</p>
                          <p className="text-xl font-bold text-primary">%{offer.interestRate}</p>
                        </div>
                        <div className="text-center p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">{t("finance.monthlyPayment") || "Aylık Taksit"}</p>
                          <p className="text-xl font-bold">{formatCurrency(monthlyPayment)}</p>
                        </div>
                        <div className="text-center p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">{t("finance.totalInterest") || "Toplam Faiz"}</p>
                          <p className="text-lg font-semibold text-orange-500">{formatCurrency(totalInterest)}</p>
                        </div>
                        <div className="text-center p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">{t("finance.totalPayment") || "Toplam Ödeme"}</p>
                          <p className="text-lg font-semibold">{formatCurrency(totalPayment)}</p>
                        </div>
                      </div>

                      {/* Features & CTA */}
                      <div className="lg:w-[200px] space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {offer.features.slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          className="w-full gap-2"
                          onClick={() => window.open(offer.website, '_blank')}
                        >
                          {t("finance.apply") || "Başvur"}
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t("finance.noResults") || "Aradığınız kriterlere uygun kredi bulunamadı."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t("finance.lowRates") || "Düşük Faiz Oranları"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("finance.lowRatesDesc") || "Piyasadaki en uygun faiz oranlarını karşılaştırarak bütçenize en uygun seçeneği bulun."}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t("finance.flexibleTerms") || "Esnek Vade Seçenekleri"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("finance.flexibleTermsDesc") || "12 aydan 60 aya kadar esnek vade seçenekleriyle ödeme planınızı kendiniz belirleyin."}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t("finance.secure") || "Güvenli Başvuru"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("finance.secureDesc") || "Tüm bankalar BDDK lisanslıdır. Bilgileriniz güvenle korunur."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Finance;
