import { MetadataRoute } from 'next';
import vocab1 from '@/data/yds_vocabulary.json';
import dailyEnEs from '@/data/daily_en_es.json';
import dailyEnAr from '@/data/daily_en_ar.json';

const baseUrl = 'https://englishmeter.net';

function createSlug(word: any): string {
  if (!word) return '';
  return String(word)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastMod = new Date('2024-01-01');

  // 1. Core Pages
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

  // 2. High-Value Test Landing Pages (Currently missing from your sitemap!)
  const testLandingPages: MetadataRoute.Sitemap = [
    '/quick-placement', '/grammar-mega-test-100', '/vocab-b1-c1-50', 
    '/ielts-grammar', '/yds-grammar-practice', '/yds-phrasal-verbs', 
    '/yds-reading', '/yds-synonyms', '/yds-conjunctions', '/yds-cloze',
    '/test-perfect-past', '/test-conditionals', '/test-relatives', 
    '/test-articles', '/test-tenses-mixed', '/test-passive-voice', 
    '/test-reported-speech', '/test-gerunds-infinitives', 
    '/test-clauses-advanced', '/test-modals-advanced', '/test-prepositions-advanced'
  ].map((route) => ({
    // NOTE: If these currently route through /start?testSlug=..., 
    // you should create clean landing pages for them at these URLs.
    url: `${baseUrl}/start?testSlug=${route.substring(1)}`, 
    lastModified: lastMod,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 3. CEFR Level Pages (A1-C2)
  const levelPages: MetadataRoute.Sitemap = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => ({
    url: `${baseUrl}/levels/${level}`,
    lastModified: lastMod,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 4. YDS Exams
  const ydsExamTests: MetadataRoute.Sitemap = Array.from({ length: 32 }, (_, i) => i + 1).map((n) => ({
    url: `${baseUrl}/start?testSlug=yds-exam-test-${n}`,
    lastModified: lastMod,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 5. Unique Vocabulary Routes
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

  return [
    ...corePages,
    ...testLandingPages,
    ...levelPages,
    ...ydsExamTests,
    ...generateWordRoutes(vocab1, '/vocabulary', 0.6), // Bumped priority slightly for vocab
    ...generateWordRoutes(dailyEnEs, '/es/vocabulary', 0.6),
    ...generateWordRoutes(dailyEnAr, '/ar/vocabulary', 0.6),
  ];
}
