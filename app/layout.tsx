// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer'; // ← EKLENDİ

const siteName = 'EnglishMeter';
const siteUrl = 'https://englishmeter.net';
const siteDescription =
  'Free online English grammar tests and placement exams. Improve your grammar with topic-based quizzes, level tests (A1–C2), and quick placement tests.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} – English Grammar Tests & Online Placement Exam`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    'english grammar test',
    'online grammar quiz',
    'english placement test',
    'A1 A2 B1 B2 C1 C2 test',
    'advanced grammar exercises',
    'grammar practice',
    'english level test',
    'free english test',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: `${siteName} – English Grammar Tests & Online Placement Exam`,
    siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} – English Grammar Tests`,
    description: siteDescription,
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex flex-col">
        {/* JSON-LD: Website + Educational Application */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalApplication',
              name: siteName,
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
                'English grammar tests',
                'online placement exams',
                'CEFR level tests A1–C2',
                'advanced grammar practice',
              ],
            }),
          }}
        />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}