import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Users, TrendingUp, Shield, Star, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePremium } from "@/hooks/usePremium";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const whyPremiumFeatures = [
  {
    icon: Zap,
    title: "Sınırsız Erişim",
    description: "Tüm araç yorumlarına ve detaylı analizlere sınırsız erişim",
    bgColor: "bg-amber-50",
    iconColor: "text-blue-500",
    borderColor: "border-amber-200",
  },
  {
    icon: TrendingUp,
    title: "Gelişmiş Analitik",
    description: "Detaylı istatistikler ve trend analizleri ile doğru kararlar",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-200",
  },
  {
    icon: Shield,
    title: "Öncelikli Destek",
    description: "7/24 öncelikli müşteri desteği ve hızlı çözümler",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-500",
    borderColor: "border-violet-200",
  },
  {
    icon: Users,
    title: "Özel Topluluk",
    description: "Premium üyeler arasında özel paylaşım ve tartışma imkanı",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200",
  },
  {
    icon: Star,
    title: "Erken Erişim",
    description: "Yeni özelliklere diğer kullanıcılardan önce erişim hakkı",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-500",
    borderColor: "border-rose-200",
  },
  {
    icon: MessageCircle,
    title: "Uzman Tavsiyeleri",
    description: "Otomotiv uzmanlarından kişiselleştirilmiş öneriler",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-500",
    borderColor: "border-indigo-200",
  },
];

const plans = [
  {
    name: "Basic",
    price: "₺49.99",
    description: "Başlangıç seviyesi kullanıcılar için",
    features: [
      "Aylık 10 yorum yazma hakkı",
      "Temel filtreleme özellikleri",
      "Standart destek",
      "Mobil uygulama erişimi",
    ],
    buttonText: "Basic Planını Seç",
    buttonVariant: "outline" as const,
    popular: false,
    borderColor: "border-border",
    buttonColor: "bg-amber-500 hover:bg-amber-600 text-white border-0",
  },
  {
    name: "Premium",
    price: "₺99.99",
    description: "En popüler plan - tam özellik seti",
    features: [
      "Sınırsız yorum yazma",
      "Gelişmiş filtreleme ve arama",
      "Öncelikli destek",
      "Detaylı istatistikler",
      "Özel rozetler ve profil özellikleri",
      "Erken erişim özellikleri",
      "PDF rapor indirme",
    ],
    buttonText: "Premium Planını Seç",
    buttonVariant: "default" as const,
    popular: true,
    borderColor: "border-primary",
    buttonColor: "",
  },
  {
    name: "Enterprise",
    price: "₺249.99",
    description: "İşletmeler ve profesyoneller için",
    features: [
      "Tüm Premium özellikler",
      "API erişimi",
      "Özel entegrasyonlar",
      "7/24 öncelikli destek",
      "Özel analitik raporları",
      "Marka beyaz etiket çözümü",
      "Özel danışmanlık hizmetleri",
    ],
    buttonText: "Enterprise Planını Seç",
    buttonVariant: "outline" as const,
    popular: false,
    borderColor: "border-violet-300",
    buttonColor: "bg-amber-500 hover:bg-amber-600 text-white border-0",
  },
];

const faqs = [
  {
    question: "Premium üyeliği iptal edebilir miyim?",
    answer: "Evet, istediğiniz zaman üyeliğinizi iptal edebilirsiniz. İptal ettikten sonra mevcut dönem sonuna kadar premium özelliklerden yararlanmaya devam edersiniz.",
  },
  {
    question: "Ödeme güvenli mi?",
    answer: "Tüm ödemeler Stripe üzerinden güvenli şekilde işlenir. Kredi kartı bilgileriniz şifrelenir ve güvenli bir şekilde saklanır.",
  },
  {
    question: "Plan değiştirebilir miyim?",
    answer: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklik bir sonraki faturalama döneminde geçerli olur.",
  },
  {
    question: "Ücretsiz deneme var mı?",
    answer: "Evet, tüm premium planlarında 7 günlük ücretsiz deneme imkanı sunuyoruz. Deneme süresinde istediğiniz zaman iptal edebilirsiniz.",
  },
];

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isPremium, user } = usePremium();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      toast({
        title: "Giriş yapmalısınız",
        description: "Premium üyelik için önce giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      const { data: existingSub } = await supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingSub) {
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            is_premium: true,
            subscribed_at: new Date().toISOString(),
            expires_at: null,
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_subscriptions")
          .insert({
            user_id: user.id,
            is_premium: true,
            subscribed_at: new Date().toISOString(),
            expires_at: null,
          });

        if (error) throw error;
      }

      toast({
        title: "Tebrikler! 🎉",
        description: `${planName} planınız başarıyla aktifleştirildi.`,
      });

      window.location.reload();
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Hata",
        description: "Üyelik işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">
              <Crown className="w-3 h-3 mr-1" />
              Premium Üyelik
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Premium ile Farkı Yaşayın
            </h1>
            <p className="text-lg text-muted-foreground">
              Araç alım kararlarınızı daha bilinçli vermek için gelişmiş özelliklere erişin.
              Premium üyelikle deneyiminizi bir üst seviyeye taşıyın.
            </p>
          </div>

          {/* Why Premium Section */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="font-display text-3xl font-bold text-center mb-10">
              Neden Premium?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {whyPremiumFeatures.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`text-center p-6 border ${feature.borderColor} ${feature.bgColor} transition-all hover:shadow-md`}
                >
                  <div className="flex justify-center mb-4">
                    <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="font-display text-3xl font-bold text-center mb-10">
              Planlar ve Fiyatlar
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden border-2 ${plan.borderColor} ${plan.popular ? 'shadow-lg scale-105' : ''} transition-all`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        En Popüler
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-amber-500">{plan.price}</span>
                      <span className="text-muted-foreground">/ay</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {isPremium ? (
                      <Button disabled className="w-full" size="lg">
                        <Crown className="w-4 h-4 mr-2" />
                        Zaten Premium Üyesiniz
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleSubscribe(plan.name)} 
                        disabled={isLoading}
                        className={`w-full ${plan.buttonColor}`}
                        variant={plan.buttonVariant}
                        size="lg"
                      >
                        {isLoading ? "İşleniyor..." : plan.buttonText}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="font-display text-3xl font-bold text-center mb-10">
              Sıkça Sorulan Sorular
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold mb-3">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl p-10 text-center bg-gradient-to-r from-blue-500 via-blue-600 to-violet-500">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Hemen Başlayın!
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Daha iyi araç kararları için Premium'a geçin
              </p>
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-8"
                onClick={() => !isPremium && handleSubscribe("Premium")}
                disabled={isPremium || isLoading}
              >
                {isPremium ? "Zaten Premium Üyesiniz" : "7 Gün Ücretsiz Dene"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
