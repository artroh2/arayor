import mercedesGlcBmwX3 from "@/assets/editorial/mercedes-glc-bmw-x3.webp";
import elektrikliSuv2025 from "@/assets/editorial/elektrikli-suv-2025.jpg";
import hondaCivicTypeR from "@/assets/editorial/honda-civic-type-r.avif";

export interface EditorialReview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  vehicleId?: string;
  vehicleName: string;
  category: string;
  rating: number;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}

export const editorialReviews: EditorialReview[] = [
  {
    id: "e1",
    title: "2025 BMW 3 Serisi: Sportif Sedanın Yeni Kralı mı?",
    slug: "2025-bmw-3-serisi-inceleme",
    excerpt: "Yenilenen BMW 3 Serisi ile bir hafta geçirdik. Sportif karakterini korurken konfor seviyesini artıran bu sedan, segmentinde rakipsiz mi?",
    content: `BMW 3 Serisi, onlarca yıldır sportif sedan segmentinin referans noktası olma özelliğini koruyor. 2025 model yılı güncellemesiyle birlikte marka, bu efsanevi modeli hem teknolojik hem de estetik açıdan bir adım öteye taşıdı. Bir haftalık test sürüşümüzde aracın tüm yönlerini detaylı olarak inceledik.

## Tasarım ve Dış Görünüm

Yeni 3 Serisi, BMW'nin son dönem tasarım dilini benimsemiş olsa da, tartışmalı büyük ızgara tasarımından uzak durmuş. Keskin LED farlar, kaslı kaput çizgileri ve aerodinamik gövde hatları, aracın sportif karakterini net bir şekilde yansıtıyor.

Özellikle yandan bakıldığında, uzun kaput ve kısa ön konsol oranları klasik BMW siluetini korurken, arka bölümdeki LED stop lambaları modern bir görünüm kazandırıyor. M Sport paketiyle gelen 19 inç jantlar, aracın duruşunu bir üst seviyeye taşıyor.

Renk seçenekleri arasında öne çıkan Brooklyn Grey Metallic ve Portimao Blue, aracın sportif karakterini en iyi yansıtan tonlar olarak dikkat çekiyor.

## İç Mekan ve Teknoloji

Kabine girdiğinizde sizi karşılayan Curved Display, BMW'nin teknoloji vizyonunun somut bir göstergesi. 12.3 inç dijital gösterge paneli ve 14.9 inç merkezi dokunmatik ekran, kusursuz bir bütünlük içinde çalışıyor. iDrive 8 işletim sistemi, kullanıcı dostu arayüzü ve hızlı tepki süreleriyle dikkat çekiyor.

Malzeme kalitesi konusunda BMW, rakiplerinin önünde. Yumuşak dokunuşlu yüzeyler, gerçek alüminyum kaplamalar ve isteğe bağlı Vernasca deri döşeme, premium hissi pekiştiriyor.

Arka koltuk konforunda ise sınıfın en iyilerinden biri olarak değerlendirebiliriz. Diz mesafesi yeterli, baş mesafesi ise 1.80 cm boyundaki yolcular için bile rahat.

**Öne Çıkan Teknolojiler:**
- BMW Intelligent Personal Assistant (Sesli asistan)
- Kablosuz Apple CarPlay ve Android Auto
- Harman Kardon Surround Ses Sistemi (opsiyonel)
- Head-Up Display
- Gesture Control (El hareketiyle kontrol)
- Wireless Charging

## Sürüş Dinamikleri

320i modelindeki 2.0 litre turbo benzinli motor, 184 HP güç ve 300 Nm tork üretiyor. 8 ileri Steptronic şanzıman ile eşleşen bu motor, 0-100 km/s hızlanmasını 7.1 saniyede tamamlıyor. M Sport süspansiyon paketi ile yol tutuşu üst düzeyde.

Direksiyonun hassasiyeti ve geri bildirimi, bu sınıftaki en iyi seviyede. Virajlarda güven veren bir denge sunarken, düz yolda da konforlu bir sürüş deneyimi yaşatıyor.

**Sürüş Modları:**
- Eco Pro: Maksimum yakıt tasarrufu
- Comfort: Günlük kullanım için ideal denge
- Sport: Daha keskin tepkiler ve sert süspansiyon
- Sport+: Pist günleri için tam performans

Yakıt tüketimi konusunda şehir içinde ortalama 8.5L/100km, şehir dışında ise 6.2L/100km değerlerini ölçtük. Karma kullanımda 7.1L/100km oldukça makul bir rakam.

## Güvenlik Sistemleri

BMW, güvenlik konusunda da sınıfın en iyilerinden birini sunuyor:

- Adaptif Cruise Control (Stop & Go fonksiyonlu)
- Lane Departure Warning
- Otomatik Acil Frenleme
- Kör Nokta Asistanı
- Park Asistanı Plus (Otomatik park)
- Geri Görüş Kamerası
- 360 Derece Kamera (opsiyonel)

## Fiyat ve Donanım Paketleri

2025 BMW 320i M Sport, Türkiye'de 2.150.000 TL'den başlayan fiyatlarla satışa sunuluyor. Premium paket, Technology paket ve M Sport Pro paket ile donatıldığında fiyat 2.800.000 TL'ye yaklaşabiliyor.

## Sonuç ve Değerlendirme

BMW 3 Serisi, 2025 güncellemesiyle segmentindeki liderliğini pekiştiriyor. Sportif sürüş keyfi arayanlar için hâlâ en iyi seçeneklerden biri. Premium iç mekan kalitesi, gelişmiş teknoloji özellikleri ve mükemmel sürüş dinamikleri, yüksek fiyat etiketini haklı çıkarıyor.

**Artıları:**
- Mükemmel sürüş dinamikleri
- Premium iç mekan kalitesi
- Gelişmiş teknoloji özellikleri
- Güçlü ve verimli motor seçenekleri

**Eksileri:**
- Yüksek fiyat
- Bazı önemli özellikler opsiyonel
- Arka bagaj hacmi rakiplere göre küçük`,
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Emre Yıldırım",
      avatar: "https://i.pravatar.cc/150?img=11",
      role: "Otomotiv Editörü"
    },
    vehicleId: "2",
    vehicleName: "BMW 3 Serisi",
    category: "Detaylı İnceleme",
    rating: 9.2,
    publishedAt: "2025-01-20",
    readTime: "12 dk",
    featured: true,
    tags: ["BMW", "Sedan", "Premium", "Sportif"]
  },
  {
    id: "e2",
    title: "Mercedes GLC vs BMW X3: Premium SUV Karşılaştırması",
    slug: "mercedes-glc-vs-bmw-x3-karsilastirma",
    excerpt: "İki Alman devi, premium kompakt SUV segmentinde kozlarını paylaşıyor. Hangisi paranızın karşılığını daha iyi veriyor?",
    content: `Premium kompakt SUV segmenti, son yıllarda inanılmaz bir büyüme gösterdi. Bu segmentin iki ağır siklet oyuncusu Mercedes GLC ve BMW X3, birbirlerinin en büyük rakibi konumunda. Her iki aracı da bir hafta boyunca test ettik ve sizler için detaylı bir karşılaştırma hazırladık.

## Tasarım Felsefesi

**Mercedes GLC:**
Mercedes GLC, markanın zarif ve sofistike tasarım anlayışını yansıtıyor. Akıcı hatlar ve lüks detaylar ön planda. Yeni nesil GLC, önceki modele göre daha uzun, daha geniş ve daha alçak bir profile sahip. Özellikle ön ızgara tasarımı ve LED farlar, aracı oldukça modern gösteriyor.

**BMW X3:**
BMW X3 ise daha sportif ve dinamik bir duruş sergiliyor. Keskin çizgiler ve atletik oranlar dikkat çekiyor. Karakteristik BMW böbrek ızgarası makul boyutlarda tutulmuş. Yandan bakıldığında, Hofmeister kıvrımı ve sportif silüet göze çarpıyor.

## İç Mekan Kalitesi ve Ergonomi

**Mercedes GLC İç Mekan:**
GLC'nin kabini, Mercedes'in MBUX sistemiyle donatılmış. 12.3 inç dijital gösterge paneli ve 11.9 inç dikey konumlandırılmış merkezi ekran standart olarak sunuluyor. Ambient aydınlatma sistemi 64 farklı renk seçeneği sunuyor ve premium malzemeler lüks hissini artırıyor.

Koltuklar son derece konforlu ve uzun yolculuklarda bile yormuyor. Arka koltuk alanı geniş ve bagaj hacmi 620 litre ile sınıfının en iyilerinden.

**BMW X3 İç Mekan:**
X3 ise daha sürücü odaklı bir kokpit tasarımı sunuyor. Curved Display ile entegre 12.3 inç ve 14.9 inç ekranlar modern bir görünüm kazandırıyor. iDrive 8 sistemi kullanımı kolay ve hızlı tepki veriyor.

Malzeme kalitesi her iki araçta da üst düzeyde, ancak GLC biraz daha lüks bir his veriyor. Bagaj hacmi 550 litre ile GLC'nin gerisinde.

## Motor ve Performans

| Özellik | Mercedes GLC 300 | BMW X3 30i |
|---------|------------------|------------|
| Motor | 2.0L Turbo | 2.0L Turbo |
| Güç | 258 HP | 245 HP |
| Tork | 400 Nm | 350 Nm |
| 0-100 km/s | 6.2 sn | 6.6 sn |
| Şanzıman | 9G-TRONIC | 8 İleri Steptronic |

Mercedes GLC, kağıt üzerinde biraz daha güçlü görünüyor ve bu güç yolda da hissediliyor. Ancak BMW X3, daha sportif bir sürüş karakterine sahip ve virajlarda daha eğlenceli.

## Yakıt Tüketimi

Test sürecimizde ölçtüğümüz ortalama tüketim değerleri:

- **GLC 300:** 8.8L/100km (karma)
- **X3 30i:** 9.2L/100km (karma)

Mercedes'in 9 ileri şanzımanı, özellikle otoyol sürüşlerinde daha düşük devir sayılarında kalarak yakıt tasarrufu sağlıyor.

## Teknoloji ve Güvenlik

**Mercedes GLC Teknolojileri:**
- MBUX infotainment sistemi
- "Hey Mercedes" sesli asistan
- Augmented Reality navigasyon
- ENERGIZING Comfort sistemi
- Active Parking Assist
- Active Distance Assist DISTRONIC

**BMW X3 Teknolojileri:**
- iDrive 8 sistemi
- BMW Intelligent Personal Assistant
- Driving Assistant Professional
- Parking Assistant Plus
- BMW Live Cockpit Professional
- Gesture Control

Her iki araç da sınıfının en gelişmiş sürücü destek sistemlerini sunuyor. Mercedes'in MBUX sistemi biraz daha sezgisel bulunurken, BMW'nin iDrive'ı daha hızlı tepki veriyor.

## Fiyat ve Değer

**2025 Fiyatları (Türkiye):**
- Mercedes GLC 300 4MATIC: 3.200.000 TL'den başlıyor
- BMW X3 30i xDrive: 3.050.000 TL'den başlıyor

Başlangıç fiyatları yakın olmakla birlikte, opsiyonlarla donatıldığında X3 biraz daha uygun fiyatlı kalıyor. Mercedes'in bazı standart özellikleri BMW'de opsiyonel.

## Sonuç: Hangisini Seçmeli?

**Mercedes GLC'yi Tercih Edin Eğer:**
- Lüks ve konfor önceliğinizse
- Daha sessiz ve rahat bir sürüş istiyorsanız
- İç mekan kalitesi sizin için çok önemliyse
- Daha geniş bagaj alanına ihtiyacınız varsa

**BMW X3'ü Tercih Edin Eğer:**
- Sportif sürüş keyfi arıyorsanız
- Daha dinamik bir tasarım istiyorsanız
- Bütçeniz biraz daha kısıtlıysa
- Sürüş odaklı bir SUV istiyorsanız

Her iki araç da segmentinin en iyileri arasında. Tercih tamamen kişisel önceliklerinize bağlı.`,
    coverImage: mercedesGlcBmwX3,
    author: {
      name: "Ayşe Kara",
      avatar: "https://i.pravatar.cc/150?img=5",
      role: "Test Sürüşü Uzmanı"
    },
    vehicleName: "Mercedes GLC vs BMW X3",
    category: "Karşılaştırma",
    rating: 8.8,
    publishedAt: "2025-01-18",
    readTime: "15 dk",
    featured: true,
    tags: ["Mercedes", "BMW", "SUV", "Karşılaştırma"]
  },
  {
    id: "e3",
    title: "Toyota Corolla Hybrid: Şehir İçi Mükemmellik",
    slug: "toyota-corolla-hybrid-inceleme",
    excerpt: "Dünyanın en çok satan otomobili, hibrit teknolojisiyle nasıl bir deneyim sunuyor? Uzun süreli testimizin sonuçları.",
    content: `Toyota Corolla, onlarca yıldır dünyanın en çok satan otomobili unvanını taşıyor. Hibrit versiyonuyla bu başarıyı sürdürmeye devam ediyor. Üç aylık uzun süreli testimizde, bu aracın günlük kullanımdaki performansını detaylı olarak değerlendirdik.

## Neden Corolla Hybrid?

Türkiye'de hibrit araç satışları her geçen yıl artıyor. Yükselen yakıt fiyatları ve çevre bilinci, alıcıları alternatif yakıt sistemlerine yönlendiriyor. Toyota'nın hibrit teknolojisindeki 25 yılı aşkın deneyimi, Corolla Hybrid'i bu segmentte güvenilir bir seçenek yapıyor.

## Hibrit Sistemin Çalışma Prensibi

Corolla Hybrid, şarj gerektirmeyen (self-charging) hibrit teknolojisine sahip. 1.8 litre Atkinson döngülü benzinli motor, 72 kW'lık elektrik motoruyla birlikte çalışıyor. Toplam sistem gücü 140 HP.

**Hibrit Sistemin Avantajları:**
- Düşük hızlarda tamamen elektrikle sürüş
- Frenleme enerjisinin geri kazanımı
- Şarj etme zorunluluğu yok
- Trafikteki dur-kalk'larda verimlilik

## Yakıt Tüketimi: Gerçek Hayat Değerleri

Üç aylık testimizde farklı koşullarda ölçtüğümüz tüketim değerleri:

| Kullanım Tipi | Tüketim (L/100km) |
|---------------|-------------------|
| Şehir içi | 4.2 |
| Şehir dışı | 4.8 |
| Otoyol | 5.5 |
| Karma | 4.5 |

Bu değerler, fabrika verilerine oldukça yakın ve sınıfındaki en düşük tüketim rakamlarını temsil ediyor. Özellikle şehir içi kullanımda elektrik motorunun devreye girmesi, tüketimi düşük tutuyor.

## Sürüş Karakteri

e-CVT şanzıman, yumuşak ve sessiz geçişler sağlıyor. Klasik CVT'lerdeki "lastik çekme" hissini minimize etmek için Toyota, yapay kademe hissi eklemiş. Sport modunda bu kademeler daha belirgin.

**Sürüş Modları:**
- EV Mode: Düşük hızlarda sadece elektrikle sürüş (2-3 km)
- ECO Mode: Maksimum yakıt tasarrufu
- Normal Mode: Dengeli performans
- Sport Mode: Daha keskin gaz tepkisi

Şehir içi trafikte ideal olan bu sistem, otoyol sürüşlerinde de yeterli performans sunuyor. Ancak ani hızlanma gereken durumlarda motorun yüksek devirlere çıkması ve sesi artması beklenen bir durum.

## İç Mekan ve Konfor

Corolla'nın iç mekanı, fiyatına göre oldukça kaliteli malzemeler kullanıyor. Sürücü odaklı kokpit tasarımı, her şeyin elinizin altında olmasını sağlıyor.

**Standart Donanımlar:**
- 7 inç dijital gösterge paneli
- 8 inç dokunmatik ekran
- Apple CarPlay ve Android Auto
- Çift bölgeli otomatik klima
- LED farlar
- Geri görüş kamerası

**Koltuk Konforu:**
Ön koltuklar uzun yolculuklarda bile konforlu. Sürücü koltuğu elektrikli olarak ayarlanabiliyor. Arka koltuk alanı sınıfın ortalamasında.

## Toyota Safety Sense

Güvenlik konusunda Toyota, standart olarak kapsamlı bir paket sunuyor:

- **Pre-Collision System:** Ön çarpışma uyarısı ve otomatik acil frenleme
- **Lane Departure Alert:** Şerit takip uyarısı
- **Lane Tracing Assist:** Şeritte kalma asistanı  
- **Dynamic Radar Cruise Control:** Adaptif hız sabitleyici
- **Automatic High Beam:** Otomatik uzun far
- **Road Sign Assist:** Trafik işareti tanıma

Bu sistemlerin tamamı standart olarak sunuluyor ve Euro NCAP'ten 5 yıldız almayı sağlıyor.

## Maliyet Analizi

Corolla Hybrid'in sahip olma maliyetini hesapladık:

**Yıllık Yakıt Maliyeti (20.000 km için):**
- Corolla Hybrid: ~18.000 TL
- Corolla 1.5 Benzin: ~32.000 TL
- Tasarruf: ~14.000 TL/yıl

**Diğer Avantajlar:**
- Düşük MTV (Hibrit indirimi)
- Yüksek ikinci el değeri
- Uzun garanti süresi (5 yıl)

## Sonuç ve Değerlendirme

Toyota Corolla Hybrid, şehir içi kullanım için neredeyse mükemmel bir araç. Düşük yakıt tüketimi, güvenilirlik ve Toyota'nın servis ağı, aracı mantıklı bir yatırım haline getiriyor.

**Artıları:**
- Olağanüstü düşük yakıt tüketimi
- Kanıtlanmış hibrit teknolojisi
- Kapsamlı güvenlik sistemleri
- Yüksek yeniden satış değeri
- Sessiz şehir içi sürüş

**Eksileri:**
- Otoyolda yetersiz güç hissi
- e-CVT'nin yapay his vermesi
- Arka koltuk alanı rakiplere göre dar
- Bagaj hacmi hibrit batarya nedeniyle küçük

**Puan: 8.5/10**

Yakıt ekonomisi ve güvenilirlik arıyorsanız, Corolla Hybrid mükemmel bir tercih. Özellikle şehir içi kullanım ağırlıklı sürücüler için şiddetle tavsiye ediyoruz.`,
    coverImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Mehmet Demir",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Kıdemli Editör"
    },
    vehicleId: "1",
    vehicleName: "Toyota Corolla Hybrid",
    category: "Detaylı İnceleme",
    rating: 8.5,
    publishedAt: "2025-01-15",
    readTime: "14 dk",
    featured: false,
    tags: ["Toyota", "Hybrid", "Ekonomik", "Sedan"]
  },
  {
    id: "e4",
    title: "2025'in En İyi Elektrikli SUV'ları",
    slug: "2025-en-iyi-elektrikli-suvlar",
    excerpt: "Elektrikli SUV pazarı hızla büyüyor. Bu yılın en dikkat çekici modellerini sizler için derledik.",
    content: `Elektrikli araç pazarı her geçen gün büyüyor ve SUV segmenti bu büyümenin lokomotifi konumunda. 2025 yılında Türkiye'de satışa sunulan en dikkat çekici elektrikli SUV'ları sizler için detaylı olarak inceledik ve karşılaştırdık.

## Elektrikli SUV Pazarına Genel Bakış

2025 yılı itibarıyla Türkiye'de 20'den fazla elektrikli SUV modeli satışta. Şarj altyapısının gelişmesi ve teşvikler, elektrikli araç satışlarını artırıyor. SUV segmenti, yüksek oturma pozisyonu ve geniş iç hacmi sayesinde elektrikli araç alıcılarının favorisi.

## 1. Tesla Model Y - En Popüler Seçim

Tesla Model Y, dünya genelinde en çok satan elektrikli SUV. Türkiye'de de büyük ilgi görüyor.

**Teknik Özellikler:**
- Motor: Dual Motor AWD
- Güç: 514 HP
- Menzil: 533 km (WLTP)
- 0-100 km/s: 5.0 sn
- Batarya: 75 kWh

**Öne Çıkan Özellikler:**
- 15 inç merkezi dokunmatik ekran
- Autopilot standart
- Over-the-air güncellemeler
- Supercharger ağı erişimi
- Geniş panoramik cam tavan

**Fiyat:** 1.850.000 TL'den başlıyor

**Değerlendirme:** Yazılım güncellemeleri, yaygın şarj ağı ve yüksek performans, Model Y'yi segmentin lideri yapıyor. Minimalist iç mekan tasarımı herkese hitap etmeyebilir.

## 2. BMW iX3 - Alman Mühendisliği

BMW'nin elektrikli SUV'u, markanın bilinen sürüş dinamiklerini elektrikli dünyaya taşıyor.

**Teknik Özellikler:**
- Motor: Tek Motor RWD
- Güç: 286 HP
- Menzil: 460 km (WLTP)
- 0-100 km/s: 6.8 sn
- Batarya: 80 kWh

**Öne Çıkan Özellikler:**
- iDrive 8 sistemi
- BMW Connected Drive
- Adaptive süspansiyon
- Harman Kardon ses sistemi
- Driving Assistant Professional

**Fiyat:** 2.650.000 TL'den başlıyor

**Değerlendirme:** Sportif sürüş karakteri ve premium iç mekan, BMW iX3'ü farklı kılıyor. Menzil rakiplerine göre biraz düşük kalıyor.

## 3. Mercedes EQC - Lüksün Elektriklisi

Lüks ve konfor arayan alıcılar için Mercedes EQC ideal bir seçim.

**Teknik Özellikler:**
- Motor: Dual Motor AWD
- Güç: 408 HP
- Menzil: 437 km (WLTP)
- 0-100 km/s: 5.1 sn
- Batarya: 80 kWh

**Öne Çıkan Özellikler:**
- MBUX infotainment
- 64 renkli ambient aydınlatma
- Burmester ses sistemi
- Air Body Control süspansiyon
- ENERGIZING Comfort

**Fiyat:** 3.100.000 TL'den başlıyor

**Değerlendirme:** Mercedes kalitesi ve lüks detaylar elektrikli bir pakette sunuluyor. Menzil ve fiyat dezavantaj olabilir.

## 4. Volkswagen ID.4 - Halkın Elektriklisi

Volkswagen'in MEB platformu üzerine inşa edilen ID.4, uygun fiyatıyla segment girişi için ideal.

**Teknik Özellikler:**
- Motor: Tek Motor RWD / Dual Motor AWD
- Güç: 204 HP / 299 HP
- Menzil: 520 km (WLTP)
- 0-100 km/s: 8.5 sn / 6.2 sn
- Batarya: 77 kWh

**Öne Çıkan Özellikler:**
- ID. Cockpit dijital gösterge
- ID. Light (LED ışık şeridi)
- Travel Assist
- Augmented Reality Head-up Display
- App Connect

**Fiyat:** 1.550.000 TL'den başlıyor

**Değerlendirme:** En yüksek menzil ve en uygun fiyat kombinasyonu ID.4'ü cazip kılıyor. İç mekan tasarımı bazı alıcılara sade gelebilir.

## 5. Hyundai Ioniq 5 - Tasarım İkonu

Retro-fütüristik tasarımıyla dikkat çeken Ioniq 5, Hyundai'nin elektrikli geleceğini temsil ediyor.

**Teknik Özellikler:**
- Motor: Tek Motor RWD / Dual Motor AWD
- Güç: 229 HP / 325 HP
- Menzil: 507 km (WLTP)
- 0-100 km/s: 7.4 sn / 5.2 sn
- Batarya: 77.4 kWh

**Öne Çıkan Özellikler:**
- 800V şarj mimarisi (10-80% 18 dakika)
- Vehicle-to-Load (V2L) özelliği
- Relaxation sürücü koltuğu
- Augmented Reality HUD
- Sürdürülebilir iç mekan malzemeleri

**Fiyat:** 1.650.000 TL'den başlıyor

**Değerlendirme:** Ultra hızlı şarj ve benzersiz tasarım, Ioniq 5'i öne çıkarıyor. V2L özelliği kamp severler için büyük avantaj.

## Karşılaştırma Tablosu

| Model | Menzil | Güç | Fiyat | Puan |
|-------|--------|-----|-------|------|
| Tesla Model Y | 533 km | 514 HP | 1.850.000 TL | 9.0 |
| BMW iX3 | 460 km | 286 HP | 2.650.000 TL | 8.5 |
| Mercedes EQC | 437 km | 408 HP | 3.100.000 TL | 8.3 |
| VW ID.4 | 520 km | 204/299 HP | 1.550.000 TL | 8.7 |
| Hyundai Ioniq 5 | 507 km | 229/325 HP | 1.650.000 TL | 9.1 |

## Şarj Altyapısı Değerlendirmesi

Türkiye'de elektrikli araç şarj altyapısı hızla gelişiyor:

- **Tesla Supercharger:** 50+ lokasyon, Tesla araçlara özel
- **Eşarj:** 1000+ istasyon, en yaygın ağ
- **ZES (Zorlu):** 300+ istasyon, AVM odaklı
- **Sharz.net:** 200+ istasyon

DC hızlı şarj istasyonlarının artması, elektrikli araç kullanımını kolaylaştırıyor. Özellikle otoyol güzergahlarındaki istasyonlar, uzun yol seyahatlerini mümkün kılıyor.

## Sonuç: Hangisini Almalı?

**En İyi Değer:** Volkswagen ID.4 - En uygun fiyata en yüksek menzil

**En İyi Performans:** Tesla Model Y - Güç ve yazılım üstünlüğü

**En İyi Lüks:** Mercedes EQC - Premium deneyim isteyenler için

**En İyi Teknoloji:** Hyundai Ioniq 5 - Ultra hızlı şarj ve V2L

**En İyi Sürüş:** BMW iX3 - Sportif karakter arayanlar için

Elektrikli SUV pazarı, her bütçeye ve ihtiyaca uygun seçenekler sunuyor. Şarj altyapısının gelişmesiyle bu segment daha da cazip hale gelecek.`,
    coverImage: elektrikliSuv2025,
    author: {
      name: "Zeynep Arslan",
      avatar: "https://i.pravatar.cc/150?img=9",
      role: "Elektrikli Araç Uzmanı"
    },
    vehicleName: "Elektrikli SUV'lar",
    category: "Rehber",
    rating: 9.0,
    publishedAt: "2025-01-12",
    readTime: "18 dk",
    featured: true,
    tags: ["Elektrikli", "SUV", "Tesla", "BMW", "Mercedes"]
  },
  {
    id: "e5",
    title: "Honda Civic Type R: Saf Sürüş Tutkusu",
    slug: "honda-civic-type-r-inceleme",
    excerpt: "Honda'nın efsanevi Type R serisi, yeni nesil Civic ile nasıl bir deneyim sunuyor? Pist testi dahil detaylı inceleme.",
    content: `Honda Civic Type R, hot hatch segmentinin en ikonik modellerinden biri. Yeni nesil, önceki modelin başarısını devam ettirmeyi başarıyor. İstanbul Park'ta gerçekleştirdiğimiz pist testi ve bir haftalık şehir içi kullanım sonuçlarını sizlerle paylaşıyoruz.

## Type R Efsanesi

Type R rozeti, Honda'nın motorsport mirasını temsil ediyor. 1992'den bu yana üretilen Type R modelleri, Nürburgring'de sayısız tur rekoru kırdı. Yeni nesil Civic Type R de bu geleneği sürdürüyor.

## Teknik Özellikler

**Motor:**
- Tip: 2.0 litre VTEC Turbo
- Güç: 329 HP @ 6.500 d/d
- Tork: 420 Nm @ 2.600-4.000 d/d
- Yakıt sistemi: Direkt enjeksiyon

**Aktarma:**
- Şanzıman: 6 ileri manuel (rev-match özellikli)
- Çekiş: Önden çekiş
- Diferansiyel: Helical LSD

**Performans:**
- 0-100 km/s: 5.4 saniye
- Maksimum hız: 275 km/s

## Dış Tasarım: Agresif Ama Dengeli

Önceki nesil Type R'ın tartışmalı tasarımının aksine, yeni model daha olgun bir görünüme sahip. Büyük arka kanat yerini daha mütevazı bir spoilere bırakmış. Ancak işlevsellik ön planda:

- Üç çıkışlı egzoz sistemi
- Agresif ön tampon tasarımı
- 19 inç hafif alaşım jantlar (Michelin Pilot Sport 4S)
- Fonksiyonel hava kanalları
- Championship White özel renk

## İç Mekan: Sürücü Odaklı

Civic Type R'ın kabini, tamamen sürücüye odaklı:

**Koltuklar:**
- Kırmızı süet kaplı spor koltuklar
- Yüksek yan destekler
- Isıtma özelliği

**Direksiyon:**
- Alcantara kaplı
- Type R rozeti
- Yassılaştırılmış alt kısım

**Gösterge Paneli:**
- +R modu için özel göstergeler
- Vites değiştirme ışıkları
- Turbo basınç göstergesi
- G-kuvveti ölçer

**Infotainment:**
- 9 inç dokunmatik ekran
- Honda LogR veri kaydı
- Apple CarPlay & Android Auto
- Bose ses sistemi

## Sürüş Modları

Type R, üç sürüş modu sunuyor:

**Comfort:**
- Yumuşak süspansiyon ayarı
- Hafif direksiyon hissi
- Normal gaz tepkisi
- Günlük kullanım için ideal

**Sport:**
- Sıkılaştırılmış süspansiyon
- Ağırlaştırılmış direksiyon
- Keskin gaz tepkisi
- Heyecanlı sürüş için

**+R Mode:**
- En sert süspansiyon
- En ağır direksiyon
- Anında gaz tepkisi
- Pist kullanımı için optimize

## İstanbul Park Pist Testi

İstanbul Park pistinde Type R ile 20 tur attık. İşte gözlemlerimiz:

**Güçlü Yönler:**
- LSD sayesinde viraj çıkışlarında mükemmel çekiş
- Rev-match özelliği ile akıcı vites düşürme
- Brembo frenler ısınmaya karşı dayanıklı
- Pilot Sport 4S lastikler yüksek kavrama sağlıyor
- +R modunda süspansiyon gövde kontrolünü artırıyor

**Dikkat Edilmesi Gerekenler:**
- Önden çekiş limitlerinde tork çekişi hissedilebilir
- Yoğun pist kullanımında fren sıcaklığı artıyor
- Yüksek hızlarda rüzgar gürültüsü

**En İyi Tur Zamanımız:** 2:08.34

Bu süre, segmentteki rakiplerle karşılaştırıldığında oldukça rekabetçi.

## Günlük Kullanım Deneyimi

Bir hafta boyunca Type R'ı günlük araç olarak kullandık:

**Şehir İçi:**
- Comfort modunda kabul edilebilir sertlik
- Vites değiştirme kademe hissi kısa
- Görüş açıları iyi
- Park sensörleri ve kamera standart

**Şehir Dışı:**
- Otoyolda konforlu seyir
- Yakıt tüketimi: 8.5L/100km
- Adaptif hız sabitleyici mevcut
- Gürültü izolasyonu yeterli

**Yakıt Tüketimi (Test Sürecimiz):**
- Şehir içi: 10.2L/100km
- Şehir dışı: 7.8L/100km
- Pist: 18L/100km
- Karma: 9.1L/100km

## Rakiplerle Karşılaştırma

| Model | Güç | 0-100 | Fiyat |
|-------|-----|-------|-------|
| Honda Civic Type R | 329 HP | 5.4 sn | 2.450.000 TL |
| VW Golf R | 333 HP | 4.7 sn | 2.650.000 TL |
| Hyundai i30 N | 280 HP | 5.9 sn | 1.850.000 TL |
| Renault Megane RS | 300 HP | 5.7 sn | 2.100.000 TL |

Type R, saf sürüş deneyimi ve manuel şanzıman odağıyla öne çıkıyor. Golf R AWD sistemiyle daha hızlı hızlanıyor ancak otomatik şanzımana sahip.

## Sonuç ve Değerlendirme

Honda Civic Type R, motorsport DNA'sını günlük kullanılabilir bir pakette sunuyor. Manuel şanzımanlı hot hatch arayan tutkunlar için en iyi seçeneklerden biri.

**Artıları:**
- Olağanüstü viraj performansı
- Eğlenceli manuel şanzıman
- Rev-match özelliği
- Günlük kullanılabilir konfor (Comfort modunda)
- Honda güvenilirliği
- LogR veri kayıt sistemi

**Eksileri:**
- Yüksek fiyat
- Önden çekiş sınırlamaları
- Agresif tasarım herkese hitap etmeyebilir
- Arka koltuk alanı dar

**Puan: 9.4/10**

Civic Type R, hem pist günleri hem de günlük kullanım için ideal bir hot hatch. Fiyatı yüksek olsa da, sunduğu değer buna değer. Saf sürüş tutkusu arayanlar için şiddetle tavsiye ediyoruz.`,
    coverImage: hondaCivicTypeR,
    author: {
      name: "Can Özkan",
      avatar: "https://i.pravatar.cc/150?img=8",
      role: "Performans Araçları Editörü"
    },
    vehicleId: "4",
    vehicleName: "Honda Civic Type R",
    category: "Pist Testi",
    rating: 9.4,
    publishedAt: "2025-01-10",
    readTime: "16 dk",
    featured: false,
    tags: ["Honda", "Type R", "Hot Hatch", "Performans"]
  },
  {
    id: "e6",
    title: "İlk Aracınızı Alırken Dikkat Etmeniz Gerekenler",
    slug: "ilk-arac-alma-rehberi",
    excerpt: "İlk araç almak heyecan verici ama zorlu bir süreç. Doğru kararı vermeniz için bilmeniz gereken her şey bu rehberde.",
    content: `İlk aracınızı almak, hayatınızdaki en önemli finansal kararlardan biri. Bu kapsamlı rehber, doğru seçimi yapmanıza yardımcı olacak tüm bilgileri içeriyor. Araç seçiminden finansmana, sigortadan bakıma kadar her konuyu detaylı olarak ele aldık.

## 1. Bütçe Belirleme

### Satın Alma Bütçesi
Sadece aracın fiyatını değil, tüm masrafları hesaba katın:

**Araç Fiyatına Ek Maliyetler:**
- ÖTV ve KDV (sıfır araçta dahil)
- Trafik tescil harcı: ~2.500 TL
- Plaka masrafı: ~500 TL
- Zorunlu trafik sigortası: 3.000-8.000 TL
- Kasko: 15.000-50.000 TL (araca göre)

### Aylık Sahip Olma Maliyeti
Genel kural: Aylık gelirinizin %15'inden fazlasını araç masraflarına ayırmayın.

**Aylık Masraflar:**
- Kredi taksiti (varsa)
- Yakıt: 2.000-5.000 TL
- Otopark: 500-2.000 TL
- Bakım fonu: 500-1.000 TL

### Finansman Seçenekleri

**1. Nakit Alım:**
- En ekonomik seçenek
- Pazarlık gücü yüksek
- Faiz maliyeti yok

**2. Banka Kredisi:**
- Genellikle daha düşük faiz
- 12-60 ay vade
- Araç üzerinde rehin

**3. Bayi Kredisi:**
- Hızlı onay süreci
- Kampanyalı faiz oranları
- Marka bağımlılığı olabilir

**4. Leasing:**
- Düşük peşinat
- KDV avantajı (şirketler için)
- Mülkiyet sonda geçer

## 2. Yeni mi, İkinci El mi?

### Sıfır Araç Avantajları
- Fabrika garantisi (2-5 yıl)
- Sıfır kilometre
- En son teknoloji
- Renk ve donanım seçimi
- Yol yardım hizmetleri

### Sıfır Araç Dezavantajları
- Yüksek değer kaybı (ilk yıl %15-25)
- Yüksek sigorta primi
- Uzun teslimat süreleri

### İkinci El Avantajları
- Daha uygun fiyat
- Düşük değer kaybı
- Hızlı teslimat
- Üst segment araç imkanı

### İkinci El Dezavantajları
- Geçmiş belirsizliği
- Sınırlı garanti
- Gizli arızalar
- Kilometre şüphesi

### İkinci El Alırken Dikkat Edilecekler

**Belge Kontrolü:**
- Ruhsat fotokopisi
- Muayene belgesi
- Servis geçmişi
- Hasar kaydı sorgulama (TRAMER)

**Fiziksel Kontrol:**
- Boya ölçümü (mutlaka!)
- Şasi numarası kontrolü
- Lastik durumu
- Motor sesi ve dumanı

**Ekspertiz:**
- Mutlaka bağımsız ekspertiz yaptırın
- Maliyet: 500-1.500 TL
- Hayati önem taşır

## 3. Yakıt Tipi Seçimi

### Benzin
**İdeal Kullanım:** Yıllık 15.000 km altı, şehir içi ağırlıklı

**Avantajları:**
- Düşük başlangıç fiyatı
- Sessiz çalışma
- Kolay bakım

**Dezavantajları:**
- Yüksek yakıt maliyeti
- Şehir içi yüksek tüketim

### Dizel
**İdeal Kullanım:** Yıllık 25.000 km üzeri, şehir dışı ağırlıklı

**Avantajları:**
- Düşük yakıt tüketimi
- Yüksek tork
- Uzun ömürlü motor

**Dezavantajları:**
- Yüksek bakım maliyeti
- DPF ve AdBlue masrafları
- Şehir içinde verimsiZ

### Hibrit
**İdeal Kullanım:** Karma kullanım, şehir içi + şehir dışı

**Avantajları:**
- Düşük tüketim
- Düşük emisyon
- MTV avantajı

**Dezavantajları:**
- Yüksek satın alma fiyatı
- Batarya değişim maliyeti
- Otoyolda avantaj azalır

### Elektrikli
**İdeal Kullanım:** Şarj imkanı olanlar, günlük kısa mesafeler

**Avantajları:**
- En düşük yakıt maliyeti
- Sıfır emisyon
- Düşük bakım maliyeti
- Yüksek performans

**Dezavantajları:**
- Yüksek satın alma fiyatı
- Şarj altyapısı bağımlılığı
- Menzil kaygısı
- Uzun şarj süreleri

## 4. Segment ve Gövde Tipi

### Hatchback
- Şehir içi manevra kolaylığı
- Ekonomik yakıt tüketimi
- Park avantajı
- Örnekler: VW Polo, Renault Clio

### Sedan
- Daha geniş bagaj
- Sessiz kabin
- Prestijli görünüm
- Örnekler: Toyota Corolla, Honda Civic

### SUV/Crossover
- Yüksek oturma pozisyonu
- Geniş iç hacim
- Off-road yeteneği
- Örnekler: Hyundai Tucson, VW Tiguan

### Station Wagon
- Maksimum bagaj hacmi
- Aile dostu
- Sürüş konforu
- Örnekler: Skoda Octavia SW, VW Passat Variant

## 5. Sigorta ve Vergiler

### Zorunlu Trafik Sigortası
- Yasal zorunluluk
- Üçüncü şahıs hasarlarını karşılar
- Fiyat: 3.000-8.000 TL/yıl
- Hasarsızlık indirimi önemli

### Kasko
- İsteğe bağlı ama tavsiye edilir
- Aracınızın hasarlarını karşılar
- Fiyat: Araç değerinin %3-5'i
- Muafiyet ve teminatları inceleyin

### MTV (Motorlu Taşıtlar Vergisi)
- Yılda 2 taksit (Ocak ve Temmuz)
- Motor hacmine göre değişir
- Hibrit araçlarda %50 indirim
- Elektrikli araçlarda muafiyet

## 6. İlk Araç İçin Öneriler

### Yeni Sürücüler İçin İdeal Özellikler
- Kompakt boyutlar (park kolaylığı)
- İyi görüş açıları
- Hafif direksiyon
- Park sensörleri/kamera
- ESP (zorunlu)

### Önerilen Modeller (Bütçeye Göre)

**500.000 - 750.000 TL:**
- Renault Clio
- Dacia Sandero
- Fiat Egea

**750.000 - 1.000.000 TL:**
- Toyota Yaris
- Hyundai i20
- VW Polo

**1.000.000 - 1.500.000 TL:**
- Toyota Corolla
- Honda Civic
- Skoda Octavia

## 7. Satın Alma Süreci

### Araştırma Aşaması
1. Bütçenizi belirleyin
2. İhtiyaçlarınızı listeleyin
3. 3-5 model belirleyin
4. Online yorumları okuyun
5. Fiyat karşılaştırması yapın

### Test Sürüşü
- Mutlaka test sürüşü yapın
- Farklı yol koşullarında deneyin
- Ergonomiyi test edin
- Görüş açılarını kontrol edin

### Pazarlık
- Birden fazla bayiden teklif alın
- Kampanya dönemlerini takip edin
- Ek aksesuar veya servis avantajı isteyin
- Takas aracınız varsa değerlendirin

### Teslim Alma
- Tüm belgeleri kontrol edin
- Aracı detaylı inceleyin
- Km ve hasar durumunu not edin
- Yedek anahtar ve belgeleri alın

## Sonuç

İlk araç almak önemli bir karardır. Acele etmeyin, araştırın ve test sürüşü yapın. Doğru araç, ihtiyaçlarınıza ve bütçenize uygun olandır.

**Altın Kurallar:**
1. Bütçenizi aşmayın
2. Duygusal karar vermeyin
3. Ekspertiz yaptırın (ikinci el)
4. Garanti şartlarını okuyun
5. Sigorta fiyatlarını önceden öğrenin

Bu rehberin size yardımcı olmasını umuyoruz. Sorularınız için yorumlarda bize ulaşabilirsiniz.`,
    coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Emre Yıldırım",
      avatar: "https://i.pravatar.cc/150?img=11",
      role: "Otomotiv Editörü"
    },
    vehicleName: "Genel",
    category: "Rehber",
    rating: 8.0,
    publishedAt: "2025-01-08",
    readTime: "20 dk",
    featured: false,
    tags: ["Rehber", "İpuçları", "Alım Rehberi"]
  }
];

export const getEditorialById = (id: string): EditorialReview | undefined => {
  return editorialReviews.find((e) => e.id === id);
};

export const getEditorialBySlug = (slug: string): EditorialReview | undefined => {
  return editorialReviews.find((e) => e.slug === slug);
};

export const getFeaturedEditorials = (): EditorialReview[] => {
  return editorialReviews.filter((e) => e.featured);
};

export const getRelatedEditorials = (currentId: string, limit: number = 3): EditorialReview[] => {
  const current = editorialReviews.find((e) => e.id === currentId);
  if (!current) return [];
  
  return editorialReviews
    .filter((e) => e.id !== currentId && (e.category === current.category || e.tags.some(tag => current.tags.includes(tag))))
    .slice(0, limit);
};
