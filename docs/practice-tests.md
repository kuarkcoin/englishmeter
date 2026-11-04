# Reading, vocabulary, word formation and Kids English

Bu paket mevcut test ekranını ve seviye sayfalarını tamamlar. Çalışması için yeni
API anahtarı, yapay zekâ servisi veya veritabanı kurulumu gerekmez.

| Bölüm | İçerik | Test | Soru |
| --- | --- | ---: | ---: |
| Reading | A1, A2, B1, B2, C1; her testte dört özgün metin ve metin başına beş soru | 5 | 100 |
| Thematic Vocabulary | A1 aile, yiyecek, ev; A2 alışveriş, ulaşım, hava durumu | 6 | 120 |
| Word Formation | B1, B2, C1; kelime aileleri, ön ekler, son ekler | 3 | 60 |
| Kids English | 7–10 yaş; renkler, hayvanlar, sayılar, aile, okul, yiyecek | 6 | 60 |
| **Toplam** | | **20** | **340** |

## Kullanıcı akışı

- Ana sayfadaki yeni kategori kartları ilgili bölümlere gider.
- `/practice/reading`, `/practice/vocabulary` ve `/practice/word-formation`
  sayfaları testleri listeler. Konu başlangıç sayfalarında hedefler, açıklamalı
  örnekler ve Reading için tam örnek metin bulunur.
- Genel testler `/start?testSlug=practice-...` üzerinden mevcut sınav/Practice,
  puanlama, cevap açıklamaları, tekrar deneme ve yanlışlar bankasını kullanır.
  Her Reading sorusuyla birlikte ilgili metnin tamamı gösterilir.
- `/kids` ve `/kids/{konu}` çocuklara ayrı, süresiz bir akış sunar. Sorular tek
  tek gelir; bir cevap seçilince açıklama gösterilir ve cevap kilitlenir. On
  sorunun sonunda puan ve tüm cevaplar incelenebilir. Tekrar deneme cevapları
  sıfırlar. Oyun ilerlemesi sayfa yenilenince sıfırlanır.
- Mevcut `vocab-b1-c1-50` testi yalnız B1/B2/C1 sorularını seçer ve 50 soruluk
  yapısını korur.

## Veri ve doğrulama

`data/practice/types.ts` ortak içerik biçimini tanımlar. Reading kaynaklarında
`passageId`, soruyu gerçek metne bağlar. `lib/practice-tests.ts` eksik metinleri,
eksik soru sayılarını veya geçersiz seçenekleri reddeder; doğru cevabı koruyarak
seçenekleri karıştırır ve ortak test biçimine dönüştürür.

Kids oyununda puanlama mevcut `scoreQuiz` fonksiyonuyla yapılır. Hazır veri ve
açıklamalar kullanılır; yapay zekâ değerlendirmesi veya ses kaydı bulunmaz.

Bu paket YDS verilerini, sorularını, deneme akışını ve Cloze uygulamasını
değiştirmez. Writing ve Listening bölümü eklenmemiştir.

```sh
npx tsx --test tests/*.test.ts
npx tsc --noEmit --incremental false
npm run build
```

Doğrulama sonucu: 89 otomatik test ve TypeScript kontrolü geçti. Production
derlemesi 9.106 statik sayfayla tamamlandı. Derlenmiş sürümde 14 genel testin
başlangıç/veri akışı, 6 Kids oyununun tam oynanışı, doğru/yanlış puanlaması,
açıklamalar ve tekrar deneme mobil tarayıcıda kontrol edildi. Genel testlerde
yanlışlar bankası ve Practice geri bildirimi de doğrulandı. Yeni 24 sayfanın
SEO ve JavaScript kapalı içerik kontrolleri geçti. Önce/sonra karşılaştırmasında
138 YDS test çıktısı aynı kaldı; YDS kaynak dosyalarında değişiklik yapılmadı.

## SEO ve yayın

Dört bölüm ve 20 test için toplam 24 canonical adres site haritasına eklenmiştir.
Sayfalarda özgün başlık/açıklama, BreadcrumbList ve gerçek içeriğe uygun
CollectionPage veya Quiz işaretlemesi bulunur. Kids işaretlemesinde süre sınırı
belirtilmez. Tanıtımlar ve açıklamalı örnekler JavaScript kapalıyken de okunabilir;
oynamak için JavaScript gerekir.

Yeni commit Vercel'de Production ortamında yeniden derlenip yayımlanmalıdır.
Google Search Console adımları için [SEO rehberine](seo.md) bakın.
