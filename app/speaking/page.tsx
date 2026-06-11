import type { Metadata } from 'next';

import SpeakingClient from './SpeakingClient';

export const metadata: Metadata = {
  title: 'English Speaking Practice | EnglishMeter',
  description: 'Practice online English speaking with interactive AI-style role-play scenarios.',
};

export default function Page() {
  return <SpeakingClient />;
}
