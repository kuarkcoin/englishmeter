// app/tests/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { buildSeoMetadata } from '@/lib/seo';
import { getCanonicalTestSlug } from '../catalog';
import { getQuestionsBySlug } from '@/lib/quizManager';
import RaceQuiz from '@/components/RaceQuiz';

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
  return buildSeoMetadata({
    title: data.title,
    description: `Practise with ${data.questions.length} questions in ${data.title}. Take the free timed English test and review your answers.`,
    path: `/tests/${props.params.slug}`,
  });
}

export default function TestPage(props: PageProps) {
  const { params } = props;
  const testData = getTest(props);

  const totalTimeSeconds = Math.max(60, (testData.duration || 15) * 60);

  return (
    <div className="em-page">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
          {testData.title}
        </h1>

        <p className="mb-6 text-slate-600 dark:text-slate-300">
          Practise with {testData.questions.length} questions. You have {testData.duration} minutes
          to complete this test and check your answers.
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
      </div>
    </div>
  );
}
