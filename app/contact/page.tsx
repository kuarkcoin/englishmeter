import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact EnglishMeter',
  description:
    'Contact EnglishMeter with questions, feedback, or support requests about our English tests and vocabulary practice tools.',
  alternates: {
    canonical: 'https://englishmeter.net/contact',
  },
  openGraph: {
    title: 'Contact EnglishMeter',
    description:
      'Contact EnglishMeter with questions, feedback, or support requests about our English tests and vocabulary practice tools.',
    url: 'https://englishmeter.net/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact EnglishMeter',
    description:
      'Contact EnglishMeter with questions, feedback, or support requests about our English tests and vocabulary practice tools.',
  },
};

export default function Contact() {
  return <ContactClient />;
}
