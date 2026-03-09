import type { MetadataRoute } from 'next';
import { SITE_URL, getAllVocabulary, slugifyWord } from '@/lib/vocabulary';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    '/',
    '/about',
    '/blog',
    '/contact',
    '/flashcards',
    '/race',
    '/speedrun',
    '/speaking',
    '/matching',
    '/verbsense',
    '/mistakes',
    '/advanced-tests',
    '/phrasal-puzzle',
    '/vocabulary',
    '/vocabulary-tests',
    '/grammar',
    '/test-conditionals',
    '/test-perfect-tenses',
    '/test-relatives',
    '/yds-3750',
  ];

  const levelRoutes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => `/levels/${level}`);
  const letterRoutes = 'abcdefghijklmnopqrstuvwxyz'.split('').map((l) => `/vocabulary/letter/${l}`);
  const wordRoutes = getAllVocabulary().map((item) => `/vocabulary/${slugifyWord(item.word)}`);

  const allRoutes = Array.from(new Set([...staticRoutes, ...levelRoutes, ...letterRoutes, ...wordRoutes]));

  return allRoutes.map((route, idx) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: idx === 0 ? 1 : route.startsWith('/vocabulary/') ? 0.8 : 0.7,
  }));
}
