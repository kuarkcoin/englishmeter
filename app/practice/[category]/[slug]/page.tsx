import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { getPracticeCategory } from '@/lib/practice-categories';
import {
  PRACTICE_TESTS, getPracticeBreadcrumbs, getPracticeTest, getPracticeTests,
  getPracticeTestMetadata, getPracticeTestPath, getPracticeTestSlug, getPracticeTestStructuredData,
} from '@/lib/practice-catalog';
import { serializeJsonLd } from '@/lib/seo';

type PageProps = { params: { category: string; slug: string } };

function resolveTest(params: PageProps['params']) {
  const category = getPracticeCategory(params.category);
  const test = category && getPracticeTest(category.id, params.slug.toLowerCase());
  if (!category || !test) notFound();
  if (category.id === 'kids' || params.category !== category.id || params.slug !== test.slug) {
    permanentRedirect(getPracticeTestPath(test));
  }
  return { category, test };
}

export function generateStaticParams() {
  return PRACTICE_TESTS.filter((test) => test.category !== 'kids')
    .map((test) => ({ category: test.category, slug: test.slug }));
}

export function generateMetadata({ params }: PageProps) {
  return getPracticeTestMetadata(resolveTest(params).test);
}

export default function PracticeTestPage({ params }: PageProps) {
  const { category, test } = resolveTest(params);
  const examples = test.questions.slice(0, 3);
  const examplePassages = test.passages?.filter((passage) => examples.some((question) => question.passageId === passage.id)) ?? [];
  const otherTests = getPracticeTests(category.id).filter((item) => item.slug !== test.slug);
  const startHref = `/start?${new URLSearchParams({ testSlug: getPracticeTestSlug(test) })}`;

  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeTestStructuredData(test)) }} />
      <div className="mx-auto max-w-3xl">
        <PracticeBreadcrumbs items={getPracticeBreadcrumbs(category, test)} />
        <header className="em-card rounded-3xl p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{test.level} · {category.name}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{test.title}</h1>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{test.description}</p>
          <ul aria-label="Test details" className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <li className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">{test.questions.length} questions</li>
            <li className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">{test.duration} minutes</li>
            {test.passages?.length ? <li className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">{test.passages.length} reading texts</li> : null}
            <li className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">Answer explanations</li>
          </ul>
          <Link href={startHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-3 font-bold text-white shadow-sm hover:bg-blue-800 sm:w-auto">Start {test.questions.length}-question test</Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">This test is free. Choose timed Exam mode or untimed Practice mode, then review your score and the explanation for each answer.</p>
        </header>

        <section aria-labelledby="practice-goals-heading" className="em-card mt-8 rounded-2xl p-6 sm:p-8">
          <h2 id="practice-goals-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">What you will practise</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-slate-700 dark:text-slate-200">
            {test.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}
          </ul>
          {test.passages?.length ? (
            <div className="mt-6 border-t border-[rgb(var(--border))] pt-5">
              <h3 className="font-bold text-slate-900 dark:text-slate-50">Texts in this test</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-200">
                {test.passages.map((passage) => <li key={passage.id}>{passage.title}</li>)}
              </ol>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Read each text carefully and use evidence from it to choose your answers. The full passage is included with every question during the test.</p>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="practice-examples-heading" className="mt-8">
          <h2 id="practice-examples-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">Example questions with answers</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Try these questions, then open the answers to see the explanations. The full test contains {test.questions.length} questions.</p>
          {examplePassages.map((passage) => (
            <article key={passage.id} aria-labelledby={`example-${passage.id}`} className="em-card mt-5 rounded-2xl border border-[rgb(var(--border))] p-5 sm:p-6">
              <h3 id={`example-${passage.id}`} className="text-lg font-bold text-slate-900 dark:text-slate-50">{passage.title}</h3>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">{passage.text}</p>
            </article>
          ))}
          <ol className="mt-5 list-decimal space-y-5 pl-6 text-slate-800 dark:text-slate-200">
            {examples.map((question) => (
              <li key={question.id} className="break-words pl-1 leading-relaxed">
                <p className="whitespace-pre-line font-semibold">{question.prompt}</p>
                <ul aria-label="Answer choices" className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, index) => <li key={index} className="rounded-lg border border-[rgb(var(--border))] px-3 py-2">{option}</li>)}
                </ul>
                <details className="mt-3 rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
                  <summary className="cursor-pointer font-semibold text-blue-800 dark:text-blue-200">Show answer and explanation</summary>
                  <p className="mt-3"><strong>Answer: </strong>{question.options[question.correctIndex]}</p>
                  <p className="mt-2">{question.explanation}</p>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <nav aria-labelledby="more-practice-heading" className="mt-10">
          <h2 id="more-practice-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">More {category.name.toLowerCase()} tests</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {otherTests.map((other) => (
              <li key={other.slug}><Link href={getPracticeTestPath(other)} className="em-card block h-full rounded-xl border border-[rgb(var(--border))] p-4 hover:border-blue-400">
                <span className="font-bold text-blue-800 dark:text-blue-200">{other.title}</span>
                <span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">{other.questions.length} questions with explanations</span>
              </Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Practice navigation" className="mt-8 flex flex-wrap gap-3">
          <Link href={category.path} className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-blue-800 dark:text-blue-200">All {category.name.toLowerCase()} tests</Link>
          <Link href={`/levels/${test.level.toLowerCase()}`} className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-blue-800 dark:text-blue-200">{test.level} grammar topics</Link>
          <Link href="/" className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-blue-800 dark:text-blue-200">All English tests</Link>
        </nav>
      </div>
    </main>
  );
}
