// app/tests/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { buildSeoMetadata, serializeJsonLd, SITE_URL } from '@/lib/seo';
import { getCanonicalTestSlug } from '../catalog';
import { getQuestionsBySlug } from '@/lib/quizManager';
import RaceQuiz from '@/components/RaceQuiz';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import WorkedQuestionExamples from '@/components/WorkedQuestionExamples';
import { getPublicTestGuide, getPublicTestTitle } from '@/lib/public-test-content';

type PageProps = { params: { slug: string }; searchParams?: { lang?: string } };

function getTest({ params, searchParams }: PageProps) {
  const canonicalSlug = getCanonicalTestSlug(params.slug);
  if (!canonicalSlug) notFound();
  if (canonicalSlug === 'quick-placement') permanentRedirect('/english-level-test');
  if (canonicalSlug !== params.slug) {
    const query = searchParams?.lang
      ? `?${new URLSearchParams({ lang: searchParams.lang })}`
      : '';
    permanentRedirect(`/tests/${canonicalSlug}${query}`);
  }
  const data = getQuestionsBySlug(canonicalSlug, searchParams?.lang);
  if (!data.questions.length) notFound();
  return data;
}

export function generateMetadata(props: PageProps): Metadata {
  const data = getTest(props);
  const title = getPublicTestTitle(props.params.slug, data.title);
  return buildSeoMetadata({
    title,
    description: `${title}. Free ${data.questions.length}-question English practice with a ${data.duration}-minute time limit, answer review and related study guides.`,
    path: `/tests/${props.params.slug}`,
  });
}

export default function TestPage(props: PageProps) {
  const { params } = props;
  const testData = getTest(props);
  const title = getPublicTestTitle(params.slug, testData.title);
  const guide = getPublicTestGuide(params.slug);
  const parent = params.slug.startsWith('yds-')
    ? { name: 'YDS preparation', path: '/yds-preparation' }
    : { name: 'English tests', path: '/english-tests' };
  const breadcrumbs = [{ name: 'Home', path: '/' }, parent, { name: title, path: `/tests/${params.slug}` }];
  const url = `${SITE_URL}/tests/${params.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description: guide.focus, inLanguage: 'en', mainEntity: { '@id': `${url}#quiz` } },
      { '@type': 'Quiz', '@id': `${url}#quiz`, url, name: title, description: guide.focus, isAccessibleForFree: true, learningResourceType: 'Practice test' },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}` })) },
    ],
  };
  const totalTimeSeconds = Math.max(60, (testData.duration || 15) * 60);

  return (
    <main className="em-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <PracticeBreadcrumbs items={breadcrumbs} />
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
          {title}
        </h1>

        <p className="mb-6 text-slate-600 dark:text-slate-300">
          {guide.focus} This timed test has {testData.questions.length} questions and a {testData.duration}-minute limit. Review your answers after finishing.
        </p>

        {params.slug === 'ielts-grammar' && (
          <p className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-slate-800 dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100">
            Prefer shorter topic practice? Explore{' '}
            <Link href="/ielts-grammar-tests" className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300">10 IELTS grammar tests with answers</Link>,
            each with 15 questions and clear explanations.
          </p>
        )}

        <RaceQuiz
          key={`${params.slug}:${props.searchParams?.lang ?? 'tr'}`}
          questions={testData.questions}
          raceId={params.slug}
          totalTime={totalTimeSeconds}
        />
        <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] p-5" aria-labelledby="test-study-heading">
          <h2 id="test-study-heading" className="text-2xl font-bold">How to study this topic</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{guide.approach}</p>
        </section>
        <WorkedQuestionExamples questions={testData.questions} />
        <nav aria-label="Related practice" className="mt-8 border-t border-[rgb(var(--border))] pt-6">
          <h2 className="text-2xl font-bold">Continue with related practice</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">{guide.related.map((item) => <li key={item.path}><Link href={item.path} className="em-card flex min-h-12 items-center rounded-xl border border-[rgb(var(--border))] px-4 py-3 font-bold text-blue-700 hover:border-blue-400 dark:text-blue-300">{item.name} →</Link></li>)}</ul>
        </nav>
      </div>
    </main>
  );
}
