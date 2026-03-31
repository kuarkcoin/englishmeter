import type { MetadataRoute } from 'next';
import { SITE_URL, getAllVocabulary, slugifyWord } from '@/lib/vocabulary';

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

  const allRoutes = [...staticRoutes, ...levelRoutes, ...letterRoutes, ...wordRoutes];

  const uniqueRoutes = Array.from(
    new Map(allRoutes.map((route) => [route.path, route])).values()
  );

  return uniqueRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
