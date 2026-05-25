import type { Metadata } from 'next';
import Link from 'next/link';
import dailyEnglishData from '@/data/dailyenglish.json';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://englishmeter.net').replace(/\/$/, '');
const QUESTIONS_PER_TEST = 50;
const data = dailyEnglishData as Array<{ word: string; meaning: string }>;
const TEST_COUNT = Math.ceil(data.length / QUESTIONS_PER_TEST);

type Props = { params: { id: string } };

export function generateMetadata({ params }: Props): Metadata {
  const idNum = Number(params.id);
  const validId = Number.isInteger(idNum) && idNum >= 1 && idNum <= TEST_COUNT ? idNum : 1;
  return {
    title: `Daily English Test ${validId} | EnglishMeter`,
    description: `Daily English Test ${validId}: 50-question vocabulary practice with instant scoring.`,
    alternates: { canonical: `/daily-english/test-${validId}` },
  };
}

export default function DailyEnglishTestPage({ params }: Props) {
  const idNum = Number(params.id);
  const testId = Number.isInteger(idNum) && idNum >= 1 && idNum <= TEST_COUNT ? idNum : 1;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `Daily English Test ${testId}`,
    description: `Daily English vocabulary quiz ${testId} with 50 questions.`,
    url: `${BASE_URL}/daily-english/test-${testId}`,
    educationalLevel: 'Intermediate',
    inLanguage: 'en',
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">Daily English Test {testId}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Practice 50 curated daily vocabulary items in this set. Track your progress and improve consistency.
      </p>
      <Link
        href={`/tests/daily-english-${testId}`}
        className="inline-block mt-6 rounded-xl bg-slate-900 text-white px-5 py-3 font-bold hover:bg-slate-800"
      >
        Start Test
      </Link>
    </main>
  );
}
