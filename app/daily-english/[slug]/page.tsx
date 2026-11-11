import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_URL, buildSeoMetadata, serializeJsonLd } from '@/lib/seo';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { dailyTestCount, getDailyTest } from '../data';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return Array.from({ length: dailyTestCount }, (_, i) => ({ slug: `test-${i + 1}` }));
}

export function generateMetadata({ params }: Props): Metadata {
  const test = getDailyTest(params.slug);
  if (!test) notFound();
  return buildSeoMetadata({
    title: `Daily English Word List ${test.id} – Turkish Meanings`,
    description: `Study ${test.items.length} everyday English words and phrases in word list ${test.id}, with Turkish meanings. Review the vocabulary before taking the matching quiz.`,
    path: `/daily-english/test-${test.id}`,
  });
}

export default function DailyEnglishTestPage({ params }: Props) {
  const test = getDailyTest(params.slug);
  if (!test) notFound();
  const title = `Daily English Word List ${test.id}`;
  const breadcrumbs = [{ name: 'Home', path: '/' }, { name: 'Daily English', path: '/daily-english' }, { name: title, path: `/daily-english/test-${test.id}` }];
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: title, description: `${test.items.length} everyday English words and phrases with Turkish meanings.`, url: `${SITE_URL}/daily-english/test-${test.id}`, inLanguage: ['en', 'tr'], isAccessibleForFree: true },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}` })) },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
      <PracticeBreadcrumbs items={breadcrumbs} />
      <h1 className="mt-5 text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">{title}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Learn {test.items.length} everyday English words and phrases with Turkish meanings.
        Review the vocabulary below, then test what you remember with a multiple-choice quiz.
      </p>
      <Link
        href={`/tests/daily-english-${test.id}`}
        className="inline-block mt-6 rounded-xl bg-slate-900 text-white px-5 py-3 font-bold hover:bg-slate-800"
      >
        Take vocabulary quiz {test.id}
      </Link>
      <section className="mt-10" aria-labelledby="vocabulary-heading">
        <h2 id="vocabulary-heading" className="text-2xl font-bold">English words and Turkish meanings</h2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {test.items.map((item, index) => (
            <div key={`${test.id}-${index}`} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <dt className="font-bold" lang="en">{item.word}</dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300" lang="tr">{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>
      <nav aria-label="Other daily English word lists" className="mt-8 flex flex-wrap justify-between gap-4">
        {test.id > 1 && <Link href={`/daily-english/test-${test.id - 1}`} className="text-blue-600 hover:underline">← Word list {test.id - 1}</Link>}
        {test.id < dailyTestCount && <Link href={`/daily-english/test-${test.id + 1}`} className="text-blue-600 hover:underline">Word list {test.id + 1} →</Link>}
      </nav>
    </main>
  );
}
