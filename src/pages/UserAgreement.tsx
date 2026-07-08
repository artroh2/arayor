import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Info, Scale, Database, AlertTriangle } from "lucide-react";

export default function UserAgreement() {
  return (
    <Layout>
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">Kullanıcı Sözleşmesi &amp; Bilgi Doğruluğu Bildirimi</h1>
              <p className="text-sm text-muted-foreground">Son güncelleme: 8 Temmuz 2026</p>
            </div>
          </div>

          <Card className="mb-4 border-primary/30 bg-primary/5">
            <CardContent className="p-5 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">
                Arayor bir <strong>bilgi ve karşılaştırma platformudur</strong>. Sunulan verilerin
                <strong> %100 doğruluğu garanti edilmez</strong>. Nihai karar öncesi ilgili banka,
                sigorta şirketi, bayi veya satıcıyla doğrulama yapmanız gerekmektedir.
              </p>
            </CardContent>
          </Card>

          <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <Info className="w-5 h-5 text-primary" /> 1. Platformun Amacı
              </h2>
              <p className="text-muted-foreground">
                Arayor; araç ilanlarını, değerleme sonuçlarını, kredi tekliflerini, sigorta
                karşılaştırmalarını ve editöryel içerikleri tek çatı altında toplayan bir
                bilgilendirme platformudur. Herhangi bir finansal, hukuki veya profesyonel danışmanlık
                niteliği taşımaz.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <Database className="w-5 h-5 text-primary" /> 2. Veri Kaynakları ve Doğruluk
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Fiyat, kilometre, donanım ve teknik özellikler ilan sahipleri veya üçüncü taraflardan alınır.</li>
                <li>Yapay zeka destekli değerleme ve piyasa tahminleri istatistiksel modellere dayanır; gerçek satış fiyatı farklılık gösterebilir.</li>
                <li>Banka faiz oranları, kredi koşulları ve sigorta primleri anlık olarak değişebilir; kesin teklif için ilgili kurumla iletişime geçilmelidir.</li>
                <li>Marka logoları ve görseller ilgili hak sahiplerine aittir; yalnızca tanıtım/karşılaştırma amaçlı kullanılır.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <AlertTriangle className="w-5 h-5 text-primary" /> 3. Sorumluluk Reddi
              </h2>
              <p className="text-muted-foreground">
                Arayor, platformda yer alan bilgilerin eksiksiz, güncel veya hatasız olduğunu taahhüt
                etmez. Kullanıcının bu bilgilere dayanarak aldığı kararlardan doğabilecek doğrudan
                veya dolaylı zararlardan Arayor sorumlu tutulamaz. Fiyat, faiz oranı, sigorta primi
                ve araç durumu bilgileri yalnızca referans niteliğindedir.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <Info className="w-5 h-5 text-primary" /> 4. Kullanıcı Yükümlülükleri
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Doğru ve güncel bilgi paylaşmak.</li>
                <li>Yasal olmayan içerik, dolandırıcılık girişimi veya yanıltıcı ilan yayımlamamak.</li>
                <li>Platform üzerinden yapılan iletişimlerde kişisel veri güvenliğine dikkat etmek.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <Database className="w-5 h-5 text-primary" /> 5. Çerezler
              </h2>
              <p className="text-muted-foreground">
                Site deneyimini iyileştirmek için zorunlu ve analitik çerezler kullanılır. Çerezleri
                tarayıcı ayarlarınızdan yönetebilirsiniz. Detaylar için Gizlilik Politikası
                sayfamıza bakabilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <Scale className="w-5 h-5 text-primary" /> 6. Değişiklikler
              </h2>
              <p className="text-muted-foreground">
                Arayor, bu sözleşmeyi önceden bildirim yapmaksızın güncelleme hakkını saklı tutar.
                Değişiklikler bu sayfada yayımlandığı anda yürürlüğe girer.
              </p>
            </section>

            <p className="text-xs text-muted-foreground pt-4 border-t border-border">
              Bu sayfayı kullanarak yukarıdaki koşulları kabul etmiş sayılırsınız. Sorularınız için
              iletişim kanallarımızdan bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
