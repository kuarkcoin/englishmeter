import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { IELTS_GRAMMAR_TESTS } from '@/data/ielts';
import { getPracticeCategory } from '@/lib/practice-categories';
import {
  getPracticeBreadcrumbs, getPracticeTestMetadata, getPracticeTestPath,
  getPracticeTestSlug, getPracticeTestStructuredData,
} from '@/lib/practice-catalog';
import { serializeJsonLd } from '@/lib/seo';

type PageProps = { params: { slug: string } };

function resolveTest(slug: string) {
  const test = IELTS_GRAMMAR_TESTS.find((item) => item.slug === slug.toLowerCase());
  if (!test) notFound();
  if (slug !== test.slug) permanentRedirect(getPracticeTestPath(test));
  return test;
}

export function generateStaticParams() {
  return IELTS_GRAMMAR_TESTS.map((test) => ({ slug: test.slug }));
}

export function generateMetadata({ params }: PageProps) {
  return getPracticeTestMetadata(resolveTest(params.slug));
}

export default function IeltsGrammarTestPage({ params }: PageProps) {
  const test = resolveTest(params.slug);
  const category = getPracticeCategory('ielts-grammar')!;
  const startHref = `/start?${new URLSearchParams({ testSlug: getPracticeTestSlug(test) })}`;
  const examples = test.questions.slice(0, 3);
  const relatedTests = IELTS_GRAMMAR_TESTS.filter((other) => other.slug !== test.slug);

  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeTestStructuredData(test)) }} />
      <div className="mx-auto max-w-3xl">
        <PracticeBreadcrumbs items={getPracticeBreadcrumbs(category, test)} />
        <header className="em-card rounded-3xl border border-[rgb(var(--border))] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">Test {test.number} of {IELTS_GRAMMAR_TESTS.length} · {test.level} practice</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{test.title}</h1>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{test.description}</p>
          <ul aria-label="Test details" className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <li className="rounded-full bg-sky-50 px-3 py-2 dark:bg-sky-950">{test.questions.length} questions</li>
            <li className="rounded-full bg-sky-50 px-3 py-2 dark:bg-sky-950">{test.duration} minutes in Exam mode</li>
            <li className="rounded-full bg-sky-50 px-3 py-2 dark:bg-sky-950">Free · No account needed</li>
          </ul>
          <Link href={startHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-sky-800 px-6 py-3 text-center font-bold text-white shadow-sm hover:bg-sky-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:w-auto">Start {test.questions.length}-question test</Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Start in timed Exam mode, or switch to Practice inside the test for untimed feedback. Every question includes an English answer explanation.</p>
        </header>

        <section aria-labelledby="ielts-test-goals" className="em-card mt-8 rounded-2xl p-6 sm:p-8">
          <h2 id="ielts-test-goals" className="text-xl font-bold text-slate-900 dark:text-slate-50">What you will practise</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-slate-700 dark:text-slate-200">
            {test.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}
          </ul>
        </section>

        <section aria-labelledby="ielts-test-guide" className="mt-8">
          <h2 id="ielts-test-guide" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Grammar guide before you start</h2>
          <div className="mt-5 space-y-4">
            {test.guide.map((lesson) => (
              <article key={lesson.heading} className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 sm:p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{lesson.heading}</h3>
                <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-200">{lesson.body}</p>
                <p className="mt-4 rounded-xl bg-sky-50 p-4 leading-relaxed text-sky-950 dark:bg-sky-950 dark:text-sky-100"><strong>Example: </strong>{lesson.example}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="ielts-example-questions" className="mt-8">
          <h2 id="ielts-example-questions" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Example questions with answers</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Try the first three questions below. Open each explanation to check the rule, or start the full {test.questions.length}-question test before viewing the answers.</p>
          <ol className="mt-5 list-decimal space-y-6 pl-6 text-slate-800 dark:text-slate-200">
            {examples.map((question) => (
              <li key={question.id} className="break-words pl-1 leading-relaxed">
                <p className="whitespace-pre-line font-semibold">{question.prompt}</p>
                <ul aria-label="Answer choices" className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, index) => <li key={index} className="rounded-lg border border-[rgb(var(--border))] px-3 py-2"><span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>{option}</li>)}
                </ul>
                <details className="mt-3 rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
                  <summary className="cursor-pointer font-semibold text-sky-800 dark:text-sky-200">Show answer and explanation</summary>
                  <p className="mt-3"><strong>Answer: </strong>{question.options[question.correctIndex]}</p>
                  <p className="mt-2">{question.explanation}</p>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="ielts-test-ready" className="mt-8 rounded-2xl bg-sky-950 p-6 text-white sm:p-8">
          <h2 id="ielts-test-ready" className="text-xl font-bold">Ready to put the rules into practice?</h2>
          <p className="mt-3 leading-relaxed text-sky-100">Choose one answer for each question. Review your result and explanations, then write your own examples using the rules you found difficult.</p>
          <Link href={startHref} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 text-center font-bold text-sky-900 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300">Start this grammar test</Link>
          <p className="mt-4 text-sm leading-relaxed text-sky-100">This independent grammar exercise is not an official IELTS test. Your practice result is not an IELTS band score.</p>
        </section>

        <nav aria-labelledby="ielts-related-tests" className="mt-10">
          <h2 id="ielts-related-tests" className="text-2xl font-bold text-slate-900 dark:text-slate-50">More IELTS grammar tests</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {relatedTests.map((other) => (
              <li key={other.slug}><Link href={getPracticeTestPath(other)} className="em-card block h-full rounded-xl border border-[rgb(var(--border))] p-4 hover:border-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                <span className="font-bold text-sky-800 dark:text-sky-200">{other.title}</span>
                <span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">{other.questions.length} questions · {other.level} · Explanations</span>
              </Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="IELTS practice navigation" className="mt-8 flex flex-wrap gap-3">
          <Link href="/ielts-grammar-tests" className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-sky-800 hover:border-sky-400 dark:text-sky-200">All IELTS grammar tests</Link>
          <Link href={`/levels/${test.level.toLowerCase()}`} className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-sky-800 hover:border-sky-400 dark:text-sky-200">{test.level} grammar topics</Link>
          <Link href="/tests/ielts-grammar" className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-sky-800 hover:border-sky-400 dark:text-sky-200">50-question IELTS grammar test</Link>
        </nav>
      </div>
    </main>
  );
}
