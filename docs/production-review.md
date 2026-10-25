# Üretim incelemesi

İncelenen temel: `0f7a6e0c97233902c00533f9a5693e8d6c2df06f`.
Bu not, iletişim düzeltmesi dışındaki bulguları kaydeder; aşağıdaki sorunlar bu değişiklikte düzeltilmedi.

## Öncelikli sorunlar

1. **Giriş sonrası yönlendirme doğrulanmıyor.** `app/login/LoginClient.tsx`,
   `redirectedFrom` sorgu parametresini doğrudan `router.push` çağrısına iletiyor.
   Yalnızca güvenli, aynı siteye ait yollar kabul edilmeli; dış adresler ve URL
   şemaları reddedilmeli. Bulgu kod incelemesine dayanıyor, gerçek hesapla giriş denenmedi.
2. **Sıralama puanları istemciden gelen değerlere güveniyor.**
   `app/api/attempts/finish/route.ts`, gönderilen doğru/toplam sayılarını ve süreyi
   sunucuda cevaplarla karşılaştırmadan kaydediyor. Servis rolü bağlantısı
   kullanıldığından, kimlik doğrulaması, giriş denetimi, sunucuda puan hesaplama
   ve aynı denemenin tekrar kaydedilmesini engelleme eklenmeli.
   Gerçek veritabanına istek veya kayıt yapılmadı.
3. **Daily English bağlantıları bozuk.** Yerel uygulamada
   `/daily-english/test-2` HTTP 404 döndü. `app/daily-english/test-[id]/page.tsx`
   desteklenen bir Next.js dinamik segment biçimi değil. `[slug]` segmentiyle
   `test-<numara>` ayrıştırılmalı veya bağlantılar `/daily-english/[id]` düzenine taşınmalı.
4. **İspanyolca sözlük dizini eksik.** `/es/vocabulary` yerel uygulamada HTTP 404
   döndü; kelime detayları bu adrese geri bağlantı veriyor. Dizin sayfası eklenmeli
   veya mevcut İspanyolca çalışma sayfasına yönlendirilmeli.

## Sonraki eklemeler

- İletişim formu için barındırma katmanında hız sınırı veya bot doğrulaması.
  Mevcut gizli alan ve uzunluk sınırları temel koruma sağlar.
- E-posta sağlayıcısında teslim/bounce takibi. Sağlayıcının kabul ettiği e-posta
  alıcının gelen kutusuna ulaşmış sayılmaz.
- Footer'daki genel X/Facebook bağlantıları gerçek profillere bağlanmalı veya kaldırılmalı.
- Kilit dosyası ve README kurulum adımları güncellenmeli. Mevcut kilit dosyası
  bağımlılık bildirimiyle uyumlu değil; README'deki seed dosyası depoda yok.
