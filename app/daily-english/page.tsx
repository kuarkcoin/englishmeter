import type { Metadata } from 'next';
import Link from 'next/link';
import { buildSeoMetadata } from '@/lib/seo';
import { dailyTestCount } from './data';

export const metadata: Metadata = buildSeoMetadata({
  title: 'Daily English Vocabulary Tests',
  description: `Practice everyday English with ${dailyTestCount} free vocabulary tests. Review English words and Turkish meanings, then check your understanding with a quiz.`,
  path: '/daily-english',
});

export default function DailyEnglishHubPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">Daily English Tests</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Build your daily vocabulary with structured mini tests. Each test includes up to 50 questions with Turkish meanings.
      </p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: dailyTestCount }, (_, i) => i + 1).map((n) => (
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
