import type { Metadata } from 'next';
import AdvancedTestsClient from './AdvancedTestsClient';

export const metadata: Metadata = {
  title: 'Advanced English Tests',
  description:
    'Practice 10 advanced B2-C1 English tests with grammar, vocabulary, and error-spotting questions on EnglishMeter.',
  alternates: {
    canonical: 'https://englishmeter.net/advanced-tests',
  },
  openGraph: {
    title: 'Advanced English Tests',
    description:
      'Practice 10 advanced B2-C1 English tests with grammar, vocabulary, and error-spotting questions on EnglishMeter.',
    url: 'https://englishmeter.net/advanced-tests',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced English Tests',
    description:
      'Practice 10 advanced B2-C1 English tests with grammar, vocabulary, and error-spotting questions on EnglishMeter.',
  },
};

export default function AdvancedTestsPage() {
  return <AdvancedTestsClient />;
}
