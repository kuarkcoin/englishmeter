import { MetadataRoute } from 'next';
import vocab1 from '@/data/yds_vocabulary.json';
import dailyEnEs from '@/data/daily_en_es.json';
import dailyEnAr from '@/data/daily_en_ar.json';

const baseUrl = 'https://englishmeter.net';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. TEMEL SAYFALAR
  const corePages = [
    '', '/vocabulary', '/es/vocabulary', '/ar/vocabulary',
    '/race', '/flashcards', '/speedrun', '/matching',
    '/verbsense', '/speaking', '/mistakes'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // 2. YDS REAL EXAM TESTS (1..27) - Yeni Eklenen
  // Kullanıcıların "YDS Deneme 27" aramalarında çıkması için
  const ydsExamTests = Array.from({ length: 27 }, (_, i) => i + 1).map((n) => ({
    url: `${baseUrl}/start?testSlug=yds-exam-test-${n}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9, // Gerçek sınav formatı olduğu için önceliği yüksek
  }));

  // 3. YDS 5000 VOCAB MINI TESTS (1..100)
  const ydsMiniTests = Array.from({ length: 100 }, (_, i) => i + 1).map((n) => ({
    url: `${baseUrl}/start?testSlug=yds-5000-mini-${n}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 4. CEFR SEVİYE SAYFALARI
  const levelPages = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => ({
    url: `${baseUrl}/levels/${lvl}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 5. KELİME DETAY SAYFALARI (Slug Mantığı)
  const createSlug = (word: string) => 
    String(word).toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const wordRoutes = (data: any[], prefix: string, priority: number) => {
    const slugs = new Set();
    return data
      .filter((item) => item?.word)
      .map((item) => {
        const slug = createSlug(item.word);
        if (slugs.has(slug)) return null;
        slugs.add(slug);
        return {
          url: `${baseUrl}${prefix}/${slug}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority,
        };
      })
      .filter(Boolean);
  };

  return [
    ...corePages,
    ...ydsExamTests, // 27 adet YDS sınavı
    ...ydsMiniTests, // 100 adet kelime testi
    ...levelPages,   // A1-C2 sayfaları
    ...(wordRoutes(vocab1, '/vocabulary', 0.6) as any),
    ...(wordRoutes(dailyEnEs, '/es/vocabulary', 0.5) as any),
    ...(wordRoutes(dailyEnAr, '/ar/vocabulary', 0.5) as any),
  ];
}
