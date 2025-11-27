// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';

const siteName = 'EnglishMeter';
const siteUrl = 'https://englishmeter.net';

// STRATEJİK ANA AÇIKLAMA
const siteDescription =
  'Take our free English level test and get your CEFR score (A1–C2) in 15 minutes. Test your grammar and vocabulary instantly with no sign-up required.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Free English Level Test: Get Your CEFR Score in 15 Mins',
    template: `%s | ${siteName}`,
  },

  description: siteDescription,

  applicationName: siteName,

  keywords: [
    'english level test',
    'english placement test',
    'CEFR test',
    'online english quiz',
    'english grammar test',
    'ESL testing',
    'check english level',
    'A1 A2 B1 B2 C1 C2 test',
    'IELTS grammar practice',
    'free english test',
  ],

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Test Your English Level Online – Fast & Free',
    siteName,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EnglishMeter – Free English Placement Test',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'How Good is Your English? Take the Free Test',
    description: 'Get your CEFR level (A1-C2) in just 15 minutes.',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // ⭐ Pinterest doğrulaması – en önemli kısım
  other: {
    'p:domain_verify': '8accc375f9f53d17f51629c58c9f6be2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    // 1) WebSite Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },

    // 2) EducationalApplication Schema
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalApplication',
      name: 'EnglishMeter Level Test',
      url: siteUrl,
      applicationCategory: 'EducationalApplication',
      description: siteDescription,
      inLanguage: 'en',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      about: [
        'English placement test',
        'CEFR level assessment',
        'Grammar quizzes',
        'Vocabulary testing',
      ],
      operatingSystem: 'Any',
    },
  ];

  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex flex-col">
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}