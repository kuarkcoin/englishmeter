import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'preview') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    // Keep noindex HTML pages crawlable so crawlers can read their directives.
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
