import type { Metadata } from 'next';

import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact EnglishMeter',
  description: 'Contact EnglishMeter for questions, feedback, and support.',
};

export default function Page() {
  return <ContactClient />;
}
