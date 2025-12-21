import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const now = new Date();

  // 1. ANA YOLLAR VE OYUNLAR
  const coreRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/race', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/speedrun', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/flashcards', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/phrasal-puzzle', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/speaking', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/verbsense', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/matching', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/word-hunter', priority: 0.7, changeFrequency: 'weekly' }, // Hafızadaki oyun
    { path: '/number-hunter', priority: 0.7, changeFrequency: 'weekly' }, // Hafızadaki oyun
  ];

  // 2. CEFR SEVİYELERİ (A1 - C2)
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => ({
    path: `/levels/${lvl}`,
    priority: 0.7,
    changeFrequency: 'weekly'
  }));

  // 3. GRAMMAR FOCUS TESTLERİ (Kodunuzdaki slug'lara göre)
  const grammarSlugs = [
    'test-perfect-past', 'test-conditionals', 'test-relatives', 
    'test-articles', 'test-tenses-mixed', 'test-passive-voice', 
    'test-reported-speech', 'test-gerunds-infinitives', 
    'test-clauses-advanced', 'test-modals-advanced', 'test-prepositions-advanced'
  ];
  const grammarRoutes = grammarSlugs.map(slug => ({
    path: `/start?testSlug=${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly'
  }));

  // 4. YDS EXAM PACK (1'den 15'e kadar)
  const ydsExams = Array.from({ length: 15 }, (_, i) => ({
    path: `/start?testSlug=yds-exam-test-${i + 1}`,
    priority: 0.6,
    changeFrequency: 'monthly'
  }));

  // 5. KURUMSAL SAYFALAR
  const staticPages = [
    { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/cookies', priority: 0.2, changeFrequency: 'yearly' },
  ];

  // TÜMÜNÜ BİRLEŞTİR
  const allPaths = [
    ...coreRoutes,
    ...levels,
    ...grammarRoutes,
    ...ydsExams,
    ...staticPages
  ];

  return allPaths.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency as any,
    priority: route.priority,
  }));
}
