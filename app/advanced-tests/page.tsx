import type { Metadata } from 'next';

import AdvancedTestsClient from './AdvancedTestsClient';

export const metadata: Metadata = {
  title: 'Advanced English Tests | EnglishMeter',
  description: 'Practice advanced English grammar, vocabulary, and error-spotting tests on EnglishMeter.',
};

export default function Page() {
  return <AdvancedTestsClient />;
}
