import type { Metadata } from 'next';
import HomeClient from './HomeClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://englishmeter.net';
const canonicalUrl = new URL('/', siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'EnglishMeter | Free English Level Test, YDS Practice & Grammar Quizzes',
  description:
    'Measure your English level in minutes with free placement tests, CEFR quizzes, YDS practice packs, mini tests, and mistake tracking.',
  keywords: ['english level test', 'yds practice test', 'cefr quiz', 'english grammar test', 'englishmeter'],
  alternates: {
    canonical: canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title: 'EnglishMeter | Find your English level in minutes',
    description:
      'Take free online placement tests, YDS packs, grammar quizzes, and vocabulary drills with instant results.',
    siteName: 'EnglishMeter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EnglishMeter | Free English Placement & YDS Practice',
    description:
      'Practice English with CEFR-aligned level tests, YDS exam packs, mini tests, and mistake review tools.',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

const faqEntities = [
  {
    '@type': 'Question',
    name: 'How does the placement test work?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'The placement test mixes grammar and vocabulary questions, then estimates your CEFR band with instant feedback and explanations.',
    },
  },
  {
    '@type': 'Question',
    name: 'What is included in the YDS exam pack?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'The YDS pack includes full-length exam-style tests plus dedicated grammar, reading, synonym, and conjunction practice sets.',
    },
  },
  {
    '@type': 'Question',
    name: 'What are YDS mini tests?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Mini tests are shorter sets designed for quick daily practice, usually with timed sessions and focused review.',
    },
  },
  {
    '@type': 'Question',
    name: 'What is the Mistake Bank?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Mistake Bank stores questions you answered incorrectly so you can revisit weak areas and improve retention.',
    },
  },
  {
    '@type': 'Question',
    name: 'Do I need an account to use EnglishMeter?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Most tests are available immediately without account setup, and your recent progress is kept locally in your browser.',
    },
  },
  {
    '@type': 'Question',
    name: 'Can I continue my last test later?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes. EnglishMeter keeps your latest test shortcut so you can continue from the homepage with one click.',
    },
  },
];

export default function Page() {
  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EnglishMeter',
    url: siteUrl,
    inLanguage: 'en',
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EnglishMeter',
    url: siteUrl,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntities,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <HomeClient />
    </>
  );
}
