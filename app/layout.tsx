import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Script from 'next/script'; 

const siteName = 'EnglishMeter';
const siteUrl = 'https://englishmeter.net';

// 1. GÜNCELLEME: Açıklamayı YDS ve Kelime Testini kapsayacak şekilde genişlettik
const siteDescription =
  'Take our free English level test (A1–C2) and practice for YDS/YÖKDİL with our 1000 essential vocabulary words. Instant grammar & vocab results, no sign-up required.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    // Başlık şablonu gayet iyi, koruyoruz
    default: 'Free English Level Test & YDS Vocabulary Quiz', // Hafif bir ekleme yaptık
    template: `%s | ${siteName}`,
  },

  description: siteDescription,
  applicationName: siteName,

  // 2. GÜNCELLEME: YDS ve Türkçe anahtar kelimeler eklendi
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
    // --- Yeni Eklenenler ---
    'YDS kelime testi',
    'YDS vocabulary list',
    'YÖKDİL kelime çalışması',
    'YDS 1000 words',
    'online vocabulary quiz',
  ],

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Test Your English Level & YDS Vocabulary Online', // Sosyal medya başlığını güncelledik
    siteName,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EnglishMeter – Free English Level & Vocabulary Test',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'How Good is Your English? Take the Free Test',
    description: 'Get your CEFR level and test your YDS vocabulary in minutes.', // Twitter açıklamasını güncelledik
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

  other: {
    'p:domain_verify': '8accc375f9f53d17f51629c58c9f6be2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 3. GÜNCELLEME: Schema (Yapısal Veri) içine YDS bilgisini ekledik
  const jsonLd = [
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
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalApplication',
      name: 'EnglishMeter Level & Vocabulary Test',
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
        'YDS Exam Preparation',    // <--- YENİ
        'YÖKDİL Vocabulary List', // <--- YENİ
      ],
      operatingSystem: 'Any',
    },
  ];

  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex flex-col">

        {/* --- GOOGLE ANALYTICS KODU (Aynen korundu) --- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z4658W17W5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z4658W17W5');
          `}
        </Script>
        {/* ----------------------------- */}

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
