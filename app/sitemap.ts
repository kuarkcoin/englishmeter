import { MetadataRoute } from 'next';
import vocab1 from '@/data/yds_vocabulary.json';
import dailyEnEs from '@/data/daily_en_es.json';
import dailyEnAr from '@/data/daily_en_ar.json';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://englishmeter.net';

function createSlug(input: any): string {
  if (!input) return '';
  return String(input)
    .toLowerCase()
    .trim()
    .normalize('NFD')                   // ✅ unicode normalize
    .replace(/[\u0300-\u036f]/g, '')    // ✅ diacritics strip
    .replace(/[^a-z0-9\s-]/g, '')       // ✅ strict safe charset
    .replace(/\s+/g, '-')              // spaces -> dash
    .replace(/-+/g, '-')               // collapse dashes
    .replace(/^-|-$/g, '');            // trim dashes
}

function generateWordRoutes(
  data: any[],
  prefix: string,
  priority: number
): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const routes: MetadataRoute.Sitemap = [];
  const lastMod = new Date('2024-01-01');

  for (const item of data) {
    const w = item?.word;
    if (!w) continue;

    const slug = createSlug(w);
    if (!slug || seen.has(slug)) continue;

    seen.add(slug);
    routes.push({
      url: `${baseUrl}${prefix}/${slug}`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority,
    });
  }
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const corePages: MetadataRoute.Sitemap = [
    { route: '', pr: 1.0, freq: 'daily' as const },
    { route: '/vocabulary', pr: 0.9, freq: 'weekly' as const },
    { route: '/es/vocabulary', pr: 0.7, freq: 'weekly' as const },
    { route: '/ar/vocabulary', pr: 0.7, freq: 'weekly' as const },
    { route: '/flashcards', pr: 0.8, freq: 'weekly' as const },
    { route: '/mistakes', pr: 0.8, freq: 'weekly' as const },
    { route: '/race', pr: 0.6, freq: 'weekly' as const },
    { route: '/speedrun', pr: 0.6, freq: 'weekly' as const },
    { route: '/matching', pr: 0.6, freq: 'weekly' as const },
    { route: '/verbsense', pr: 0.6, freq: 'weekly' as const },
    { route: '/speaking', pr: 0.6, freq: 'weekly' as const },
  ].map((p) => ({
    url: `${baseUrl}${p.route}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.pr,
  }));

  // ❌ Query-string sitemap önerilmez.
  // ✅ En iyisi: /yds/exam/1 gibi landing pages (server-rendered) üretip onları eklemek.
  // Şimdilik kaldırıyorum. Landing route oluşturunca aşağıyı aç:
  /*
  const ydsExamLanding: MetadataRoute.Sitemap = Array.from({ length: 32 }, (_, i) => i + 1).map((n) => ({
    url: `${baseUrl}/yds/exam/${n}`,
    lastModified: new Date('2024-01-01'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  */

  return [
    ...corePages,
    // ...ydsExamLanding,
    ...generateWordRoutes(vocab1 as any[], '/vocabulary', 0.5),
    ...generateWordRoutes(dailyEnEs as any[], '/es/vocabulary', 0.4),
    ...generateWordRoutes(dailyEnAr as any[], '/ar/vocabulary', 0.4),
  ];
}
