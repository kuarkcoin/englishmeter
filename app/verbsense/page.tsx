import type { Metadata } from 'next';

import VerbSenseClient from './VerbSenseClient';

export const metadata: Metadata = {
  title: 'Verb Sense Practice | EnglishMeter',
  description: 'Practice English verb senses, meanings, and usage with interactive exercises.',
};

export default function Page() {
  return <VerbSenseClient />;
}
