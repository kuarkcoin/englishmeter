import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  
  // Google'ın içeriğin güncel olduğunu anlaması için build zamanını kullanıyoruz.
  const now = new Date();

  const routes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
    priority: number;
  }[] = [
    // 1. ANA SAYFA
    // Tüm YDS (1-13), Gramer ve Kelime testleri burada listeleniyor.
    // En önemli sayfanız burası.
    { path: '/',          changeFrequency: 'daily',  priority: 1.0 },

    // 2. GLOBAL RACE MODE
    // Ana sayfada "Global Race Mode" linki var (/race)
    { path: '/race',      changeFrequency: 'weekly', priority: 0.8 },

    // 3. SEVİYE SAYFALARI
    // Ana sayfada "All Levels" bölümünde listelenen linkler
    { path: '/levels',    changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/A1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/A2', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/B1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/B2', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/C1', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/levels/C2', changeFrequency: 'weekly', priority: 0.7 },

    // 4. TEST BAŞLANGIÇ YÖNLENDİRME SAYFASI
    // Kodunuzda window.location.href = `/start?testSlug=...` var.
    // Bu sayfanın da indekslenmesi faydalı olabilir.
    { path: '/start',     changeFrequency: 'monthly', priority: 0.5 },

    // 5. KURUMSAL / STATİK SAYFALAR
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
