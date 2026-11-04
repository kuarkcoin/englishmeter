# Global English Challenge — Daily 50

## Yarışma kuralları

`/challenge` sayfası her gün herkese aynı 50 soruyu sunar: 20 gramer, 20 kelime,
iki metne bağlı 10 okuma sorusu. Süre 40 dakikadır; her sorunun beş seçeneği vardır.
Net = doğru − yanlış / 4. Boşlar sıfır puan; negatif net mümkündür.

İlk tamamlanan sınavın sıralama hakkı tarayıcı başına günde bir kez ayrılır.
Sonuçtan sonra takma adını yayımlayanlar günlük sıralamaya girer. Sıralama önce
net, sonra saniye cinsinden daha kısa süre, tam eşitlikte bitirme zamanı ve sabit
kayıt kimliği ile belirlenir. Sonraki denemeler alıştırmadır; ilk sonucu değiştirmez.
Takma adlar aynı gün içinde büyük/küçük harf farkıyla tekrar kullanılamaz.

Gün sınırı **Europe/Istanbul 00:00**. Gece yarısından önce başlayan bir sınav tam
40 dakika sürer ve başladığı günün listesine girer. Sorular günün ilk başlangıcında
veritabanına sabitlenir; gün içinde yayımlanan kod değişiklikleri onları değiştirmez.

300 özgün soru vardır: 120 gramer, 120 kelime ve 12 metinde 60 okuma sorusu.
Gramer/kelime bölümlerinde A1–C1 seviyelerinin her birinden dörder soru seçilir.
Ardışık günlerde hiçbir soru tekrarlanmaz. Mevcut havuz altı günde döner; daha
sonraki günlerde eski sorular geri gelebilir. Bu, her gün sınırsız yeni içerik
üretilmesi anlamına gelmez. Seçenek sırası da güne göre sabit olarak karıştırılır.
Yeni içerik `data/challenge/` dosyalarına eklenebilir; `BANK_VERSION` güncellenir.

## Vercel'de canlıya alma

Bu özellik **ortak PostgreSQL veritabanı gerektirir**. Resend e-posta ayarları
veritabanı bağlantısının yerine geçmez. Yerel test veritabanı canlı siteye bağlı değildir.

1. Supabase veya Neon gibi bir sağlayıcıda PostgreSQL veritabanı kullanın. Varsa
   mevcut EnglishMeter veritabanını kullanabilirsiniz. Sağlayıcının sunucu bağlantı
   adresini alın; Supabase kullanıyorsanız Prisma için önerilen bağlantı/pooler
   ayarlarını izleyin. Sunucu rolü yeni tabloları okuyup yazabilmelidir. Supabase
   `anon` anahtarı bir PostgreSQL bağlantı adresi değildir.
2. Sağlayıcının SQL Editor ekranında [prisma/challenge.sql](../prisma/challenge.sql)
   dosyasının **tamamını** çalıştırın. Üç yeni tablo oluşturur; mevcut iletişim
   kayıtlarına veya diğer tablolara dokunmaz. Tekrar çalıştırılabilir.
   Alternatif olarak güvenli ortamda `DATABASE_URL` ayarlı iken `npm run db:challenge`
   çalıştırın. Mevcut canlı veritabanında `migrate reset` veya sıfırlama kullanmayın.
3. Vercel → proje → **Settings → Environment Variables** → `DATABASE_URL` ekleyin.
   Değer, veritabanınızın gerçek PostgreSQL bağlantı adresidir; **Production**
   ortamını seçin. Başında `NEXT_PUBLIC_` olmamalı; anahtarı koda veya sohbete yazmayın.
   Tabloları kurduğunuz veritabanı ile bu bağlantının aynı olduğundan emin olun.
4. Bu kod değişikliğini içeren sürümü Production'a yayımlayın. Ortam değişkenini
   ekledikten sonra yeniden deploy edin. `npm install` sırasında Prisma istemcisi
   üretilir. Normal build/deploy veritabanı tablolarını otomatik oluşturmaz.
5. `https://englishmeter.net/api/challenge/leaderboard` adresi 200 dönmeli.
   Yeni kurulumda `participants: 0` ve boş `entries` normaldir. 503 alırsanız
   bağlantıyı, tabloların kurulumunu ve veritabanı rolünü kontrol edin.
6. İki ayrı tarayıcıda `/challenge` üzerinden sınavı bitirip farklı takma adları
   yayımlayın. Her ikisinde aynı günlük sıralamayı ve gerçek sonuçları doğrulayın.

Preview ortamına bağlantı verilecekse ayrı test veritabanı kullanın; Preview
sonuçlarının Production sıralamasına yazılmasını önleyin. Veritabanı olmadan
sayfanın açıklaması açılır, ancak sınav/sıralama hizmeti 503 döner; sahte sonuç gösterilmez.

## Güvenilir puanlama ve veri

- Cevap anahtarı ve açıklamalar API'nin soru çıktısında veya istemci paketinde yoktur.
  Sonuç puanı sunucudaki değişmez cevap anahtarından hesaplanır. İstemci süre/net
  değerleri kabul edilmez. Bugünün cevapları sonuçtan sonra da yayımlanmaz.
- Cevaplar sınav sırasında sunucuda kaydedilir. Yenilemede kayıtlı deneme sürer.
  Süre dolduktan sonra gelen cevap değişiklikleri sayılmaz; son zamanında kaydedilen
  cevaplar puanlanır. Bağlantı kopunca kaydedilemeyen cevaplar açıkça belirtilir.
- Çerez rastgele, HttpOnly ve Production'da Secure'dur; veritabanında yalnızca
  özeti tutulur. Tekrar gönderimler ve eşzamanlı bitirme istekleri skoru değiştiremez.
- Bu anonim bir günlük alıştırma yarışmasıdır. Çerez silmek veya farklı tarayıcı
  kullanmak yeni katılım sağlar; kişi başına doğrulanmış tek katılım iddiası yoktur.
  Ödüllü bir yarışmaya dönüştürülecekse hesap doğrulaması ve ek kötüye kullanım
  kontrolleri gerekir. Vercel'de yoğun otomatik trafik için API hız sınırı konabilir.
- Takma ad, puan ve süre herkese açık olur; e-posta veya gerçek ad istenmez.
  Ham cevaplar ve katılımcı özetleri yalnızca sunucuda tutulur. Tablolarda RLS
  açıktır, herkese açık politika yoktur; tarayıcı Supabase anahtarları erişemez.
  Sunucu bağlantısının yetkili özel bir rol kullanması gerekir.

## SEO

`/challenge` ana sayfadan bağlıdır ve `sitemap.xml` içindedir. Açıklama, kurallar,
FAQ, canonical, sosyal paylaşım metaları ve yapılandırılmış veri sunucudan gelir.
Kişisel deneme/sonuçlar ayrı indekslenebilir URL oluşturmaz; API'ler `noindex` ve
`no-store` döner. Sitemap zaten Search Console'a gönderildiyse tekrar URL eklemek
zorunlu değildir. Google'ın tarama ve dizine ekleme kararları garanti edilmez.

## Kontroller

`npm run test:challenge` saf mantık ve API doğrulama testlerini çalıştırır.
Gerçek veritabanı testleri varsayılan olarak atlanır. Yalnızca ayrı bir yerel test
veritabanında tabloları kurup `CHALLENGE_TEST_DATABASE_URL` tanımlayarak aynı komutu
çalıştırın. Bu testler harici/Production bağlantılarını reddeder.

Tüm proje: `npx tsx --test tests/*.test.ts`, `npx tsc --noEmit`, `npm run build`.
YDS ve mevcut testlerin akışı değiştirilmez.
