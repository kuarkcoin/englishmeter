// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const now = new Date(); // Date kullanıyoruz, typesafe

  // Sitedeki önemli statik sayfaları tek yerden tanımla
  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number }[] = [
    { path: '',          changeFrequency: 'daily',  priority: 1.0 },
    { path: '/race',     changeFrequency: 'weekly', priority: 0.6 },

    // Level pages
    { path: '/levels/A1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/A2', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/B1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/B2', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/C1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/C2', changeFrequency: 'weekly', priority: 0.7 },

    // İstersen test giriş sayfalarını da ekleyebilirsin:
    // { path: '/start?testSlug=quick-placement',      changeFrequency: 'monthly', priority: 0.4 },
    // { path: '/start?testSlug=grammar-mega-test-100', changeFrequency: 'monthly', priority: 0.4 },
    // { path: '/start?testSlug=vocab-b1-c1-50',       changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Tüm route’ları sitemap item’ına çevir
  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}