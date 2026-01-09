import { MetadataRoute } from 'next';
import vocabSet1 from '@/data/yds_vocabulary.json';
import vocabSet2 from '@/data/yds_vocabulary1.json';
import dailyEnEs from '@/data/daily_en_es.json'; // 1.000 Kelimelik yeni İspanyolca veri seti

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const now = new Date();

  // 1. ANA YOLLAR VE OYUNLAR (Priority: 1.0)
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

  // 2. CEFR VE TEST YOLLARI
  const levelRoutes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => ({
    url: `${baseUrl}/levels/${lvl}`,
    priority: 0.7,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

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

  // 3. YDS SINAV VE MİNİ TESTLER
  const ydsExamRoutes = Array.from({ length: 15 }, (_, i) => ({
    url: `${baseUrl}/tests/yds-exam-test-${i + 1}`,
    priority: 0.8,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  const ydsMiniTests = Array.from({ length: 77 }, (_, i) => ({
    url: `${baseUrl}/tests/yds-3850-mini-${i + 1}`,
    priority: 0.7,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 4. 🚀 TÜRKÇE VOCABULARY (YDS)
  const uniqueMap = new Map();
  [...vocabSet1, ...vocabSet2].forEach((item: any) => {
    if (item?.word) {
      const key = item.word.toLowerCase().trim();
      if (!uniqueMap.has(key)) uniqueMap.set(key, item);
    }
  });

  const trVocabularyRoutes = Array.from(uniqueMap.values()).map((item: any) => ({
    url: `${baseUrl}/vocabulary/${item.word.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`,
    priority: 0.5,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 5. 🌍 İSPANYOLCA GÜNLÜK VOCABULARY (New!)
  // Google'ın ABD ve İspanya aramalarında bizi öne çıkarması için bu rotalar kritik.
  const esVocabularyRoutes = dailyEnEs.map((item: any) => {
    const slug = item.word.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return {
      url: `${baseUrl}/es/vocabulary/${slug}`,
      priority: 0.6, // Günlük kelimeler daha çok trafik çektiği için önceliği biraz artırdık
      changeFrequency: 'monthly' as any,
      lastModified: now,
    };
  });

  // 6. KURUMSAL SAYFALAR
  const staticPages = [
    { url: `${baseUrl}/es/vocabulary`, priority: 0.7, changeFrequency: 'weekly' as any, lastModified: now }, // İspanyolca index sayfası
    { url: `${baseUrl}/contact`, priority: 0.3, changeFrequency: 'yearly' as any, lastModified: now },
    { url: `${baseUrl}/privacy`, priority: 0.2, changeFrequency: 'yearly' as any, lastModified: now },
  ];

  return [
    ...coreRoutes,
    ...levelRoutes,
    ...testRoutes,
    ...ydsExamRoutes,
    ...ydsMiniTests,
    ...trVocabularyRoutes,
    ...esVocabularyRoutes, // Yeni rotalar eklendi
    ...staticPages,
  ];
}
