import type { Metadata } from 'next';

import Yds3750Client from './Yds3750Client';

export const metadata: Metadata = {
  title: 'YDS 3750 Vocabulary Practice | EnglishMeter',
  description: 'Build YDS vocabulary with focused practice tests from the EnglishMeter 3750-word set.',
};

export default function Page() {
  return <Yds3750Client />;
}
