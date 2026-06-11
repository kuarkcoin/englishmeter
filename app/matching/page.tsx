import type { Metadata } from 'next';

import MatchingClient from './MatchingClient';

export const metadata: Metadata = {
  title: 'Vocabulary Matching Practice | EnglishMeter',
  description: 'Strengthen English vocabulary with matching practice activities on EnglishMeter.',
};

export default function Page() {
  return <MatchingClient />;
}
