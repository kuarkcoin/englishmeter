import type { Metadata } from 'next';

import MistakesClient from './MistakesClient';

export const metadata: Metadata = {
  title: 'English Mistake Review Practice | EnglishMeter',
  description: 'Review English mistakes and practice corrections with EnglishMeter.',
};

export default function Page() {
  return <MistakesClient />;
}
