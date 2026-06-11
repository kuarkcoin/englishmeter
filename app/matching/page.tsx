import type { Metadata } from 'next';
import MatchingClient from './MatchingClient';

export const metadata: Metadata = {
  title: 'English Vocabulary Matching Game',
  description:
    'Match English words with their meanings in a fast, interactive vocabulary game for English learners.',
  alternates: {
    canonical: 'https://englishmeter.net/matching',
  },
  openGraph: {
    title: 'English Vocabulary Matching Game',
    description:
      'Match English words with their meanings in a fast, interactive vocabulary game for English learners.',
    url: 'https://englishmeter.net/matching',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Vocabulary Matching Game',
    description:
      'Match English words with their meanings in a fast, interactive vocabulary game for English learners.',
  },
};

export default function MatchingPage() {
  return <MatchingClient />;
}
