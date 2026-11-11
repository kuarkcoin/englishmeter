import type { Metadata } from 'next';
import Link from 'next/link';
import { buildSeoMetadata } from '@/lib/seo';
import { dailyTestCount } from './data';
import StudyHubStructuredData from '@/components/StudyHubStructuredData';

export const metadata: Metadata = buildSeoMetadata({
  title: 'Daily English Vocabulary Tests',
  description: `Practice everyday English with ${dailyTestCount} free vocabulary tests. Review English words and Turkish meanings, then check your understanding with a quiz.`,
  path: '/daily-english',
});

export default function DailyEnglishHubPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <StudyHubStructuredData name="Daily English vocabulary" path="/daily-english" description="Everyday English word lists with Turkish meanings and matching recall quizzes." items={Array.from({ length: dailyTestCount }, (_, index) => ({ name: `Daily English word list ${index + 1}`, path: `/daily-english/test-${index + 1}` }))} />
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">Daily English Tests</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Build your daily vocabulary with English word lists and Turkish meanings. Each list has a matching quiz with up to 50 questions. Study a list before the quiz, or try the quiz first to discover which words need review.
      </p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: dailyTestCount }, (_, i) => i + 1).map((n) => (
          <Link
            key={n}
            href={`/daily-english/test-${n}`}
            className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Word list and quiz {n}
          </Link>
        ))}
      </div>
      <section aria-labelledby="daily-study-heading" className="mt-10 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
        <h2 id="daily-study-heading" className="text-2xl font-bold">Make daily vocabulary practice useful</h2>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Work with a manageable set of unfamiliar words. Try to recall each meaning before revealing the list, then use a few words in your own sentences. Revisit mistakes in a later session instead of only repeating words you already know.</p>
        <nav aria-label="Other everyday English practice" className="mt-4 flex flex-wrap gap-4">
          <Link href="/practice/vocabulary" className="font-bold text-blue-700 underline dark:text-blue-300">All-English vocabulary in context</Link>
          <Link href="/levels/b1/common-phrasal-verbs" className="font-bold text-blue-700 underline dark:text-blue-300">Common phrasal verbs</Link>
          <Link href="/vocabulary-tests" className="font-bold text-blue-700 underline dark:text-blue-300">All vocabulary practice</Link>
        </nav>
      </section>
    </main>
  );
}
