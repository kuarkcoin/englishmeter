import type { Metadata } from 'next';
import VerbSenseClient from './VerbSenseClient';

export const metadata: Metadata = {
  title: 'Verb Sense',
  description:
    'Build natural English verb instinct by choosing the verb that sounds right in real spoken English.',
  alternates: {
    canonical: 'https://englishmeter.net/verbsense',
  },
  openGraph: {
    title: 'Verb Sense',
    description:
      'Build natural English verb instinct by choosing the verb that sounds right in real spoken English.',
    url: 'https://englishmeter.net/verbsense',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verb Sense',
    description:
      'Build natural English verb instinct by choosing the verb that sounds right in real spoken English.',
  },
};

export default function VerbSensePage() {
  return <VerbSenseClient />;
}
