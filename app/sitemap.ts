// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const now = new Date();

  const routes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
    priority: number;
  }[] = [
    { path: '/',          changeFrequency: 'daily',  priority: 1.0 },
    { path: '/race',      changeFrequency: 'weekly', priority: 0.6 },

    { path: '/levels',    changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/A1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/A2', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/B1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/B2', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/C1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/C2', changeFrequency: 'weekly', priority: 0.7 },

    { path: '/contact',   changeFrequency: 'yearly', priority: 0.3 },
    { path: '/privacy',   changeFrequency: 'yearly', priority: 0.2 },
    { path: '/cookies',   changeFrequency: 'yearly', priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}