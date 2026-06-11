import type { Metadata } from 'next';
import SpeakingClient from './SpeakingClient';

export const metadata: Metadata = {
  title: 'English Speaking Practice',
  description:
    'Practice English pronunciation and speaking with interactive prompts, listening, and speech recognition exercises.',
  alternates: {
    canonical: 'https://englishmeter.net/speaking',
  },
  openGraph: {
    title: 'English Speaking Practice',
    description:
      'Practice English pronunciation and speaking with interactive prompts, listening, and speech recognition exercises.',
    url: 'https://englishmeter.net/speaking',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Speaking Practice',
    description:
      'Practice English pronunciation and speaking with interactive prompts, listening, and speech recognition exercises.',
  },
};

export default function SpeakingPage() {
  return <SpeakingClient />;
}
