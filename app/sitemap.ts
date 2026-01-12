import { MetadataRoute } from 'next';
import vocab1 from '@/data/yds_vocabulary.json';
import vocab2 from '@/data/yds_vocabulary1.json';
import dailyEnEs from '@/data/daily_en_es.json';
import dailyEnAr from '@/data/daily_en_ar.json';

// Slug oluşturma fonksiyonunu dışarı alalım ki her yerde aynı mantık çalışsın
function createSlug(word: string) {
  return String(word)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const now = new Date();

  // 1. STATİK SAYFALAR
  const staticPages = [
    '',
    '/vocabulary',
    '/es/vocabulary',
    '/ar/vocabulary',
    '/race',
    '/flashcards',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // 2. TÜRKÇE YDS KELİMELERİ (Unique Filter eklendi)
  const combinedTurkish = [...(vocab1 as any[]), ...(vocab2 as any[])];
  const turkishSlugs = new Set();
  
  const turkishRoutes = combinedTurkish
    .filter((item) => item && item.word)
    .map((item) => {
      const slug = createSlug(item.word);
      if (turkishSlugs.has(slug)) return null; // Eğer bu slug zaten varsa ekleme
      turkishSlugs.add(slug);
      
      return {
        url: `${baseUrl}/vocabulary/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  // 3. İSPANYOLCA GÜNLÜK KELİMELER
  const spanishRoutes = (dailyEnEs as any[])
    .filter((item) => item && item.word)
    .map((item) => ({
      url: `${baseUrl}/es/vocabulary/${createSlug(item.word)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // 4. ARAPÇA GÜNLÜK KELİMELER
  const arabicRoutes = (dailyEnAr as any[])
    .filter((item) => item && item.word)
    .map((item) => ({
      url: `${baseUrl}/ar/vocabulary/${createSlug(item.word)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...turkishRoutes,
    ...spanishRoutes,
    ...arabicRoutes,
  ];
}
