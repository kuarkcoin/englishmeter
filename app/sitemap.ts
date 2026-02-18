import { MetadataRoute } from 'next';
import vocab1 from '@/data/yds_vocabulary.json';
import dailyEnEs from '@/data/daily_en_es.json';
import dailyEnAr from '@/data/daily_en_ar.json';

const baseUrl = 'https://englishmeter.net';

// 1. Slug oluşturma fonksiyonunu en üstte temiz bir şekilde tanımlayalım
function createSlug(word: any): string {
  if (!word) return '';
  return String(word)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Özel karakterleri temizle
    .replace(/\s+/g, '-');    // Boşlukları tireye çevir
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastMod = new Date('2024-01-01');

  // 2. Temel Sayfalar
  const corePages: MetadataRoute.Sitemap = [
    '', '/vocabulary', '/es/vocabulary', '/ar/vocabulary',
    '/race', '/flashcards', '/speedrun', '/matching',
    '/verbsense', '/speaking', '/mistakes'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  // 3. YDS Sınavları (Dinamik parametreli linkler)
  const ydsExamTests: MetadataRoute.Sitemap = Array.from({ length: 32 }, (_, i) => i + 1).map((n) => ({
    url: `${baseUrl}/start?testSlug=yds-exam-test-${n}`,
    lastModified: lastMod,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 4. Kelime Rotaları Üretici (Set kullanarak duplicate engelleme)
  const generateWordRoutes = (data: any[], prefix: string, priority: number): MetadataRoute.Sitemap => {
    const seenSlugs = new Set();
    const routes: MetadataRoute.Sitemap = [];

    for (const item of data) {
      if (item?.word) {
        const slug = createSlug(item.word);
        if (slug && !seenSlugs.has(slug)) {
          seenSlugs.add(slug);
          routes.push({
            url: `${baseUrl}${prefix}/${slug}`,
            lastModified: lastMod,
            changeFrequency: 'monthly',
            priority: priority,
          });
        }
      }
    }
    return routes;
  };

  // Hepsini birleştir ve döndür
  return [
    ...corePages,
    ...ydsExamTests,
    ...generateWordRoutes(vocab1, '/vocabulary', 0.5),
    ...generateWordRoutes(dailyEnEs, '/es/vocabulary', 0.5),
    ...generateWordRoutes(dailyEnAr, '/ar/vocabulary', 0.5),
  ];
}
