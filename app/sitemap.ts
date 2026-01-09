import { MetadataRoute } from 'next';
import vocabSet1 from '@/data/yds_vocabulary.json';
import vocabSet2 from '@/data/yds_vocabulary1.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const now = new Date();

  // 1. ANA YOLLAR VE OYUNLAR (Priority: En Yüksek)
  const coreRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/race', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/speedrun', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/flashcards', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/speaking', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/mistakes', priority: 0.8, changeFrequency: 'daily' },
    { path: '/verbsense', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/matching', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/phrasal-puzzle', priority: 0.8, changeFrequency: 'weekly' },
  ].map(r => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    priority: r.priority,
    changeFrequency: r.changeFrequency as any,
  }));

  // 2. CEFR SEVİYE SAYFALARI
  const levelRoutes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => ({
    url: `${baseUrl}/levels/${lvl}`,
    priority: 0.7,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 3. GRAMMAR VE ÖZEL TESTLER
  const grammarSlugs = [
    'test-perfect-past', 'test-conditionals', 'test-relatives', 
    'test-articles', 'test-tenses-mixed', 'test-passive-voice', 
    'test-reported-speech', 'test-gerunds-infinitives', 
    'test-clauses-advanced', 'test-modals-advanced', 'test-prepositions-advanced',
    'quick-placement', 'grammar-mega-test-100', 'ielts-grammar'
  ];
  const testRoutes = grammarSlugs.map(slug => ({
    url: `${baseUrl}/tests/${slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 4. YDS EXAM PACK (1-15)
  const ydsExamRoutes = Array.from({ length: 15 }, (_, i) => ({
    url: `${baseUrl}/tests/yds-exam-test-${i + 1}`,
    priority: 0.8,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 5. YDS MİNİ TESTLER (1-77)
  const ydsMiniTests = Array.from({ length: 77 }, (_, i) => ({
    url: `${baseUrl}/tests/yds-3850-mini-${i + 1}`,
    priority: 0.7,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 6. 🚀 DEV VOCABULARY SEO ORDUSU (Programmatic SEO)
  // İki veri setini birleştiriyoruz
  const combinedPool = [...vocabSet1, ...vocabSet2];

  // Mükerrer (Duplicate) kelimeleri temizleme: Kelimeyi "Map" key'i yaparak tekilleştiriyoruz
  const uniqueMap = new Map();
  combinedPool.forEach((item: any) => {
    if (item && item.word) {
      const key = item.word.toLowerCase().trim();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }
  });

  const vocabularyRoutes = Array.from(uniqueMap.values()).map((item: any) => {
    // URL dostu slug oluşturma
    const slug = item.word
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Alfanümerik olmayanları sil (tire hariç)
      .replace(/\s+/g, '-');    // Boşlukları tire yap

    return {
      url: `${baseUrl}/vocabulary/${slug}`,
      priority: 0.5,
      changeFrequency: 'monthly' as any,
      lastModified: now,
    };
  });

  // 7. KURUMSAL VE STATİK SAYFALAR
  const staticPages = [
    { url: `${baseUrl}/contact`, priority: 0.3, changeFrequency: 'yearly' as any, lastModified: now },
    { url: `${baseUrl}/privacy`, priority: 0.2, changeFrequency: 'yearly' as any, lastModified: now },
  ];

  // TÜM ROTALARI BİRLEŞTİR VE DÖNDÜR
  return [
    ...coreRoutes,
    ...levelRoutes,
    ...testRoutes,
    ...ydsExamRoutes,
    ...ydsMiniTests,
    ...vocabularyRoutes,
    ...staticPages,
  ];
}
