import type { Metadata } from 'next';
import Yds3750Client from './Yds3750Client';

export const metadata: Metadata = {
  title: 'YDS 3750 Vocabulary Tests',
  description:
    'Study essential YDS vocabulary with 100 structured Turkish-English vocabulary tests on EnglishMeter.',
  alternates: {
    canonical: 'https://englishmeter.net/yds-3750',
  },
  openGraph: {
    title: 'YDS 3750 Vocabulary Tests',
    description:
      'Study essential YDS vocabulary with 100 structured Turkish-English vocabulary tests on EnglishMeter.',
    url: 'https://englishmeter.net/yds-3750',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YDS 3750 Vocabulary Tests',
    description:
      'Study essential YDS vocabulary with 100 structured Turkish-English vocabulary tests on EnglishMeter.',
  },
};

export default function Yds3750Hub() {
  return <Yds3750Client />;
}
