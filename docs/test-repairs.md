# Test akışı ve soru bankası düzeltmeleri

Bu çalışma mevcut testlerin çalışmasını ve sonuçların tutarlılığını düzeltir.
Yeni dinleme, seviyeli okuma veya yazma paketleri bu değişikliğe dahil değildir.

## Testler ve sonuçlar

- Doğrudan `/tests/...` sayfaları tüm şıkları korur. YDS sorularındaki E şıkkı
  artık kaybolmaz; puan ve cevap incelemesi aynı sayfada gösterilir.
- Testi tekrar çözme, boş bırakılan soru sayısı, doğru cevap ve mevcut açıklamalar
  sonuç ekranında bulunur. Olmayan `/race/.../result` adresine yönlendirme kaldırıldı.
- Okuma modülü 10 metindeki 40 soruyu bağlamıyla birlikte açar. Phrasal verbs
  ve synonyms listeleri geçerli çoktan seçmeli sorulara dönüştürülür.
- Ana sayfanın ortak grammar/YDS/placement testleri aynı soru yükleyicisini
  kullanır. YDS grammar 100 soru/90 dakika, phrasal verbs 100 soru/75 dakika,
  synonyms 50 soru/40 dakika ve reading 40 soru/80 dakikadır.
- Şıklar doğru cevap ilişkisi korunarak karıştırılır. Eksik veya birden fazla
  doğru cevap işaretli maddeler başka bir cevaba zorlanmaz. Yinelenen kaynak
  kimliklerinin deneme içindeki cevapları karıştırması giderildi.
- Kartlar ve test başlıkları gerçek soru sayısını gösterir. Advanced Test 2
  49, YDS Test 23 ise 79 sorudur. Advanced testler karışık pratik olarak
  gösterilir; test numarasından türetilmiş yanıltıcı konu filtreleri kaldırıldı.

## Seviye belirleme

Quick Placement her giriş yolunda A1–C2 seviyelerinden beşer soru, toplam
30 soru ve 20 dakika kullanır. Seçim aynı soru bankası için tekrarlanabilirdir.

Sonuç, **dil bilgisi ve kelime pratiği için yaklaşık bir öneridir**. Tüm soruların
cevaplanması gerekir. A1'den başlayarak ardışık her seviyede en az 4/5 doğru
gereklidir; bu koşulu sağlayan en yüksek seviye gösterilir. Koşul A1'de bile
sağlanmazsa A1 çalışması önerilir. Eksik testte seviye atanmaz.

Bu ölçüt psikometrik olarak doğrulanmış bir sınav, dört becerinin ölçümü veya
resmî CEFR sertifikası değildir. Sonuç ekranı ölçütü açıklar, seviyelere göre
doğru sayılarını gösterir ve çalışma konusu bağlantısı sunar. Placement
sırasında cevapları önceden gösteren Practice modu kullanılmaz.

## Öğrenme geri bildirimi

Konu testlerinde doğru cevap sırasının tahmin edilmesini azaltan şık karıştırma,
cevap incelemesi ve dil bilgisi açıklamaları bulunur. İncelemede belirlenen
bozuk soru cümleleri ve yanlış cevap anahtarları da düzeltilir.

Konuşma aracındaki puan etiketi, yalnızca metinden değerlendirilebilen anlam
ve doğal ifade kullanımını anlatır; telaffuz veya ses akıcılığı ölçümü iddiası
kaldırılmıştır. Gerçek ses değerlendirmesi ayrı bir geliştirmedir.

## Doğrulama ve yayımlama

Otomatik testler için:

```sh
npx tsx --test tests/*.test.ts
npm run build
```

Tarayıcı kontrolleri beşinci şıkkı seçme ve puanlama, boş soru olmaması,
sonuç/tekrar akışı, süre dolumu, placement sonucu, ana sayfa ile doğrudan
başlatma tutarlılığı ve mobil görünümü kapsar.

Bu değişiklikte 66 otomatik test geçti ve production derlemesi 9.048 statik
sayfayla tamamlandı. Ana sayfa/başlatma ve doğrudan test akışları derlenmiş
production sunucusunda da tarayıcıyla doğrulandı. Konu testi geri bildirimi
ve ana sayaç duraklatma/devam etme kontrolleri geliştirme sunucusunda geçti.

Canlı siteye bu çalışma ortamından erişim ağ politikası nedeniyle engellidir.
Vercel'de ilgili commit Production ortamında yeniden derlenip yayımlandıktan
sonra aynı akışlar canlı adreste de kontrol edilmelidir. Preview derlemesini
doğrudan Production'a taşımak SEO'daki `noindex` ayarlarını koruyabileceğinden
Production için yeniden derleme yapılmalıdır.
