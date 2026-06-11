import type { Metadata } from 'next';
import MistakesClient from './MistakesClient';

export const metadata: Metadata = {
  title: 'My Mistakes',
  description:
    'Review saved English test mistakes and practice the questions you missed to improve your score.',
  alternates: {
    canonical: 'https://englishmeter.net/mistakes',
  },
  openGraph: {
    title: 'My Mistakes',
    description:
      'Review saved English test mistakes and practice the questions you missed to improve your score.',
    url: 'https://englishmeter.net/mistakes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Mistakes',
    description:
      'Review saved English test mistakes and practice the questions you missed to improve your score.',
  },
};

export default function MyMistakesPage() {
  return <MistakesClient />;
}
