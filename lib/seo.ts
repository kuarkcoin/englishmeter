import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'https://englishmeter.net';

export function canonicalOrigin(value?: string): string {
  try {
    const url = new URL(value?.trim() || DEFAULT_SITE_URL);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return DEFAULT_SITE_URL;
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = canonicalOrigin(process.env.NEXT_PUBLIC_SITE_URL);

export function buildSeoMetadata({
  title, description, path, locale = 'en_US', noindex = false, image = '/opengraph-image',
}: {
  title: string;
  description: string;
  path: string;
  locale?: string;
  noindex?: boolean;
  image?: string;
}): Metadata {
  const url = new URL(path, `${SITE_URL}/`).href;
  const index = !noindex && process.env.VERCEL_ENV !== 'preview';
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index, follow: true },
    openGraph: {
      title: `${title} | EnglishMeter`, description, url, type: 'website',
      siteName: 'EnglishMeter', locale,
      images: [{ url: new URL(image, SITE_URL).href, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image', title: `${title} | EnglishMeter`, description,
      images: [new URL(image, SITE_URL).href],
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
