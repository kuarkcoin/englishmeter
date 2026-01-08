import { MetadataRoute } from 'next';
import ydsVocabulary from '@/data/yds_vocabulary.json'; // Arşivini buradan çekiyoruz

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
  ].map(r => ({ url: `${baseUrl}${r.path}`, lastModified: now, ...r }));

  // 2. CEFR SEVİYE SAYFALARI
  const levelRoutes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => ({
    url: `${baseUrl}/levels/${lvl}`,
    priority: 0.7,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 3. TEMİZ URL TESTLERİ (Artık /tests/ altında)
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

  // 5. YDS 3850 MİNİ TESTLER (1-77)
  const ydsMiniTests = Array.from({ length: 77 }, (_, i) => ({
    url: `${baseUrl}/tests/yds-3850-mini-${i + 1}`,
    priority: 0.7,
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 6. 🚀 3.850 KELİMELİK DEV SEO ORDUSU (Her kelime bir sayfa!)
  const vocabularyRoutes = ydsVocabulary.map((item: any) => ({
    url: `${baseUrl}/vocabulary/${item.word.toLowerCase().replace(/\s+/g, '-')}`,
    priority: 0.5, // Çok fazla sayfa olduğu için ana sayfalardan rol çalmasın
    changeFrequency: 'monthly' as any,
    lastModified: now,
  }));

  // 7. KURUMSAL
  const staticPages = [
    { url: `${baseUrl}/contact`, priority: 0.3, changeFrequency: 'yearly' as any, lastModified: now },
    { url: `${baseUrl}/privacy`, priority: 0.2, changeFrequency: 'yearly' as any, lastModified: now },
  ];

  // TÜMÜNÜ BİRLEŞTİR
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
