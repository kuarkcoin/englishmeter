import type { Metadata } from 'next';
import Link from 'next/link';
import dailyEnglishData from '@/data/dailyenglish.json';

const QUESTIONS_PER_TEST = 50;
const testCount = Math.ceil((dailyEnglishData as Array<unknown>).length / QUESTIONS_PER_TEST);

export const metadata: Metadata = {
  title: 'Daily English Tests | EnglishMeter',
  description: 'Daily English vocabulary tests. Solve indexable test pages with 50 questions each.',
  alternates: { canonical: '/daily-english' },
};

export default function DailyEnglishHubPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">Daily English Tests</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Build your daily vocabulary with structured mini tests. Each test includes 50 questions.
      </p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: testCount }, (_, i) => i + 1).map((n) => (
          <Link
            key={n}
            href={`/daily-english/test-${n}`}
            className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Daily English Test {n}
          </Link>
        ))}
      </div>
    </main>
  );
}
