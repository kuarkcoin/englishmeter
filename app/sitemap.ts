import { MetadataRoute } from 'next';
import vocab1 from '@/data/yds_vocabulary.json';
import vocab2 from '@/data/yds_vocabulary1.json';
import dailyEnEs from '@/data/daily_en_es.json';
// Eğer Arapça dosyanın adı farklıysa burayı ona göre güncelle:
import dailyEnAr from '@/data/daily_en_ar.json'; 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const now = new Date();

  // 1. STATİK SAYFALAR
  const staticPages = [
    '',
    '/vocabulary',
    '/es/vocabulary',
    '/ar/vocabulary', // Arapça ana dizin
    '/race',
    '/flashcards',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as any,
    priority: 1.0,
  }));

  // 2. TÜRKÇE YDS KELİMELERİ (SEO DOSTU SLUG İLE)
  const combinedTurkish = [...vocab1, ...vocab2];
  const turkishRoutes = combinedTurkish
    .filter((item) => item && item.word) // Boş veri kontrolü
    .map((item) => {
      const slug = item.word
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      return {
        url: `${baseUrl}/vocabulary/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as any,
        priority: 0.7,
      };
    });

  // 3. İSPANYOLCA GÜNLÜK KELİMELER
  const spanishRoutes = (dailyEnEs as any[])
    .filter((item) => item && item.word) // Kritik hata koruması
    .map((item) => {
      const slug = item.word
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      return {
        url: `${baseUrl}/es/vocabulary/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as any,
        priority: 0.6,
      };
    });

  // 4. ARAPÇA GÜNLÜK KELİMELER
  const arabicRoutes = (dailyEnAr as any[])
    .filter((item) => item && item.word) // Kritik hata koruması
    .map((item) => {
      const slug = item.word
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      return {
        url: `${baseUrl}/ar/vocabulary/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as any,
        priority: 0.6,
      };
    });

  // HEPSİNİ BİRLEŞTİR VE DÖNDÜR
  return [
    ...staticPages,
    ...turkishRoutes,
    ...spanishRoutes,
    ...arabicRoutes,
  ];
}
