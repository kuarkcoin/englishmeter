import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://englishmeter.net';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    '/',
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
    '/yds-3750',
    '/about',
    '/blog',
    '/contact',
  ];

  const levelRoutes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => `/levels/${level}`);

  return [...routes, ...levelRoutes].map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: index === 0 ? 1 : 0.7,
  }));
}
