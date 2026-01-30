import { MetadataRoute } from 'next';
// Veriyi import ederken tip güvenliği için as const veya interface kullanabilirsiniz

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net';
  const lastMod = new Date('2024-01-01'); // Statik içerikler için sabit tarih daha iyidir

  // ... (corePages ve test slugları aynı kalabilir)

  const wordRoutes = (data: any[], prefix: string, priority: number) => {
    const slugs = new Set();
    return data
      .filter((item) => item?.word)
      .slice(0, 5000) // Bellek yönetimi için gerekirse sınırlayın
      .map((item) => {
        const slug = createSlug(item.word);
        if (slugs.has(slug)) return null;
        slugs.add(slug);
        
        return {
          url: `${baseUrl}${prefix}/${slug}`,
          lastModified: lastMod,
          changeFrequency: 'monthly' as const,
          priority,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;
  };

  return [
    ...corePages,
    ...ydsExamTests,
    ...ydsMiniTests,
    ...levelPages,
    ...wordRoutes(vocab1, '/vocabulary', 0.6),
    ...wordRoutes(dailyEnEs, '/es/vocabulary', 0.5),
    ...wordRoutes(dailyEnAr, '/ar/vocabulary', 0.5),
  ];
}
