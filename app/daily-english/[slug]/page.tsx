import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_URL, buildSeoMetadata } from '@/lib/seo';
import { dailyTestCount, getDailyTest } from '../data';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return Array.from({ length: dailyTestCount }, (_, i) => ({ slug: `test-${i + 1}` }));
}

export function generateMetadata({ params }: Props): Metadata {
  const test = getDailyTest(params.slug);
  if (!test) notFound();
  return buildSeoMetadata({
    title: `Daily English Test ${test.id}`,
    description: `Practice ${test.items.length} English words and phrases in Daily English Test ${test.id}. Review Turkish meanings, then take the free vocabulary quiz.`,
    path: `/daily-english/test-${test.id}`,
  });
}

export default function DailyEnglishTestPage({ params }: Props) {
  const test = getDailyTest(params.slug);
  if (!test) notFound();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `Daily English Test ${test.id}`,
    description: `Daily English vocabulary quiz ${test.id} with ${test.items.length} questions and Turkish meanings.`,
    url: `${SITE_URL}/daily-english/test-${test.id}`,
    inLanguage: ['en', 'tr'],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Link href="/daily-english" className="font-semibold text-blue-600 hover:underline">← All daily English tests</Link>
      <h1 className="mt-5 text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">Daily English Test {test.id}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Learn {test.items.length} everyday English words and phrases with Turkish meanings.
        Review the vocabulary below, then test what you remember with a multiple-choice quiz.
      </p>
      <Link
        href={`/tests/daily-english-${test.id}`}
        className="inline-block mt-6 rounded-xl bg-slate-900 text-white px-5 py-3 font-bold hover:bg-slate-800"
      >
        Start Test {test.id}
      </Link>
      <section className="mt-10" aria-labelledby="vocabulary-heading">
        <h2 id="vocabulary-heading" className="text-2xl font-bold">Vocabulary in this test</h2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {test.items.map((item, index) => (
            <div key={`${test.id}-${index}`} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <dt className="font-bold" lang="en">{item.word}</dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300" lang="tr">{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>
      <nav aria-label="Other daily English tests" className="mt-8 flex flex-wrap justify-between gap-4">
        {test.id > 1 && <Link href={`/daily-english/test-${test.id - 1}`} className="text-blue-600 hover:underline">← Test {test.id - 1}</Link>}
        {test.id < dailyTestCount && <Link href={`/daily-english/test-${test.id + 1}`} className="text-blue-600 hover:underline">Test {test.id + 1} →</Link>}
      </nav>
    </main>
  );
}
