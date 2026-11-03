# A1–C1 konu testleri

Ana sayfadaki **Choose your English level** bölümünden A1, A2, B1, B2 ve C1
seviye sayfalarına ulaşılır. Her konu testi 20 soru, dört seçenek ve her soru
için bir doğru cevap/açıklama içerir. Süre 20 dakikadır; mevcut Practice modu
zamansız çalışma ve anında geri bildirim sağlar.

| Seviye | Konu testi | Soru |
| --- | ---: | ---: |
| A1 — Beginner | 17 | 340 |
| A2 — Elementary | 12 | 240 |
| B1 — Intermediate | 13 | 260 |
| B2 — Upper-Intermediate | 13 | 260 |
| C1 — Advanced | 9 | 180 |
| **Toplam** | **64** | **1.280** |

Eski A1–C1 konularının soruları 20'ye tamamlandı; yeni konular eklendi.
Mevcut konu adresleri korundu. C2'nin altı mevcut konusu, kendi 10 soruluk
setleriyle erişilebilir olmaya devam eder.

## Kapsam

- **A1:** be, özne zamirleri, iyelik sıfatları, sayılabilen/sayılamayan isimler,
  a/an/the, present simple/continuous, işaret sözcükleri, yer ve zaman edatları,
  there is/are, can/can't, Wh- soruları, sayılar, günler/aylar, saatler ve yönler.
- **A2:** past simple/continuous, will/going to, sıfat ve zarf karşılaştırmaları,
  have to/need to, should/must, may/might ve and/but/because/so; önceki temel
  present continuous, isimler, miktar ve sıklık konuları da korunur.
- **B1:** present/past perfect, active/passive, zero/first/second conditional,
  gerunds/infinitives, yaygın phrasal verbs ve reported speech; önceki diğer
  B1 konuları da 20 soruluk testler olarak bulunur.
- **B2:** third/mixed conditional, defining/non-defining relative clauses,
  have/get causatives, noun clauses ve inversion; önceki B2 konuları korunur.
- **C1:** subjunctive ve resmî talepler, wish/if only, karma koşullar, ileri
  inversion, deyimler, akademik dil, participle/cleft/advanced relative clauses.

## Ortak test akışı

Konu sayfası: `/levels/a1/verb-to-be`

Başlatma: `/start?testSlug=topic-a1-verb-to-be`

`lib/level-catalog.ts` seviye/konu metadata'sını tutar. `lib/level-tests.ts`,
verileri `StandardQuestion` biçimine çevirir. `quizManager` aynı test seçicisini
kullanır; süre, seçenek karıştırma, sonuçlar, tekrar deneme ve yanlışlar bankası
mevcut `/quiz` ekranından çalışır. Soru sayısı eksik veya seçenekleri geçersiz
bir set başka teste yönlendirilmez.

Konu sayfaları sunucuda oluşturulur; kendi canonical adresleri, metadata ve
sitemap kayıtları vardır. Konu başlangıç sayfasında konuya özel çalışma rehberi,
üç öğrenme hedefi ve bir ipucu bulunur. Üç örnek sorunun seçenekleri, cevapları ve
açıklamaları JavaScript gerektirmeden okunabilir; tam test ortak akıştan başlatılır.

## Kontroller

```sh
npx tsx --test tests/*.test.ts
npm run build
```

Otomatik kontroller konu kapsamını, soru sayısını, benzersiz kimlik ve seçenekleri,
şıklar karıştıktan sonra doğru cevabın korunmasını, puanlamayı, eski C2 setlerini
ve canonical/sitemap eşleşmesini doğrular. Tarayıcı kontrolleri ana sayfa
butonlarını, konu seçimini, 20 soruluk denemeyi, sonuçları, açıklamaları ve
yanlışların kaydını kapsar.

Son doğrulama (3 Kasım 2026): 79 otomatik test geçti; TypeScript kontrolü ve
production derlemesi başarılı oldu (9.082 statik sayfa). Derlenmiş sürümde
375 px mobil görünüm, beş seviyeden test başlatma, 20/20 puanlama, cevap
açıklamaları, tekrar deneme, Practice geri bildirimi ve yanlışlar bankası
tarayıcıda doğrulandı. C2 dahil 70 konu adresi, canonical bağlantılar ve
geçersiz adreslerin 404 yanıtı kontrol edildi.
SEO güncellemesinde altı seviye ve 70 konu sayfasının Production çıktısı,
JavaScript kapalıyken başlık, canonical, yapılandırılmış veri, çalışma rehberi,
açıklamalı örnekler ve mobil görünüm açısından ayrıca doğrulandı.

Vercel'de yeni commit Production ortamında yeniden derlenip yayımlanmalıdır.
