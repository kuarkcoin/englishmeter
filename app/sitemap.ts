import type { MetadataRoute } from 'next';
import { SITE_URL, getAllVocabulary, slugifyWord } from '@/lib/vocabulary';
import dailyEnglishData from '@/data/dailyenglish.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never';
  }> = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/flashcards', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/race', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/speedrun', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/speaking', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/matching', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/verbsense', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/mistakes', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/advanced-tests', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/phrasal-puzzle', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/vocabulary', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/vocabulary-tests', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/grammar', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/test-conditionals', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/test-perfect-tenses', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/test-relatives', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/yds-3750', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/yds-5000-mini', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/learn', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/ar/vocabulary', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/es/vocabulary', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/tools/news-impact', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/daily-english', priority: 0.9, changeFrequency: 'daily' },
    { path: '/tests/yds-grammar', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tests/yds-reading', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tests/yds-synonyms', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tests/yds-phrasal-verbs', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tests/yds-conjunctions', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tests/ielts-grammar', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tests/grammar-mega-test-100', priority: 0.8, changeFrequency: 'weekly' },
  ];

  const levelRoutes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => ({
    path: `/levels/${level}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  const letterRoutes = 'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => ({
    path: `/vocabulary/letter/${letter}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));

  const wordRoutes = getAllVocabulary().map((item) => ({
    path: `/vocabulary/${slugifyWord(item.word)}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));
  const ydsMiniRoutes = Array.from({ length: 77 }, (_, i) => ({
    path: `/tests/yds-3850-mini-${i + 1}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));
  const yds5000MiniRoutes = Array.from({ length: 100 }, (_, i) => ({
    path: `/tests/yds-5000-mini-${i + 1}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));
  const ydsExamRoutes = Array.from({ length: 32 }, (_, i) => ({
    path: `/tests/yds-exam-test-${i + 1}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));
  const dailyCount = Math.ceil((dailyEnglishData as Array<unknown>).length / 50);
  const dailyRoutes = Array.from({ length: dailyCount }, (_, i) => ({
    path: `/daily-english/test-${i + 1}`,
    priority: 0.8,
    changeFrequency: 'daily' as const,
  }));

  const allRoutes = [...staticRoutes, ...levelRoutes, ...letterRoutes, ...wordRoutes, ...ydsMiniRoutes, ...yds5000MiniRoutes, ...ydsExamRoutes, ...dailyRoutes];

  const uniqueRoutes = Array.from(
    new Map(allRoutes.map((route) => [route.path, route])).values()
  );

  return uniqueRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
