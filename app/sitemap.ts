import { MetadataRoute } from 'next';
import vocab1 from '@/data/yds_vocabulary.json';
import dailyEnEs from '@/data/daily_en_es.json';
import dailyEnAr from '@/data/daily_en_ar.json';

const baseUrl = 'https://englishmeter.net';

// 1. Yardımcı fonksiyonu en üstte veya sitemap fonksiyonunun hemen dışında tanımlayın
const createSlug = (word: string) => 
  String(word).toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastMod = new Date('2024-01-01'); // Statik veriler için sabit tarih önerisi

  // 2. Temel Sayfalar
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

  // 3. YDS Sınavları
  const ydsExamTests = Array.from({ length: 27 }, (_, i) => i + 1).map((n) => ({
    url: `${baseUrl}/start?testSlug=yds-exam-test-${n}`,
    lastModified: lastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // 4. Kelime Rotaları Üretici
  const wordRoutes = (data: any[], prefix: string, priority: number) => {
    const slugs = new Set();
    return data
      .filter((item) => item?.word)
      .map((item) => {
        const slug = createSlug(item.word); // Artık bu fonksiyonu bulabiliyor
        if (slugs.has(slug)) return null;
        slugs.add(slug);
        return {
          url: `${baseUrl}${prefix}/${slug}`,
          lastModified: lastMod,
          changeFrequency: 'monthly' as const,
          priority,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;
  };

  return [
    ...corePages,
    ...ydsExamTests,
    // Diğer testler ve seviyeler...
    ...wordRoutes(vocab1, '/vocabulary', 0.6),
    ...wordRoutes(dailyEnEs, '/es/vocabulary', 0.5),
    ...wordRoutes(dailyEnAr, '/ar/vocabulary', 0.5),
  ];
}
