import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { PRACTICE_CATEGORIES, getPracticeCategory } from '@/lib/practice-categories';
import {
  getPracticeBreadcrumbs, getPracticeCategoryMetadata, getPracticeCategoryStructuredData,
  getPracticeTests, getPracticeTestPath,
} from '@/lib/practice-catalog';
import { serializeJsonLd } from '@/lib/seo';

type PageProps = { params: { category: string } };

function resolveCategory(value: string) {
  const category = getPracticeCategory(value);
  if (!category) notFound();
  if (category.path !== `/practice/${value}`) permanentRedirect(category.path);
  return category;
}

export function generateStaticParams() {
  return PRACTICE_CATEGORIES.filter((category) => category.path === `/practice/${category.id}`)
    .map((category) => ({ category: category.id }));
}

export function generateMetadata({ params }: PageProps) {
  return getPracticeCategoryMetadata(resolveCategory(params.category));
}

export default function PracticeCategoryPage({ params }: PageProps) {
  const category = resolveCategory(params.category);
  const tests = getPracticeTests(category.id);
  const totalQuestions = tests.reduce((total, test) => total + test.questions.length, 0);

  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeCategoryStructuredData(category)) }} />
      <div className="mx-auto max-w-5xl">
        <PracticeBreadcrumbs items={getPracticeBreadcrumbs(category)} />
        <header className="em-card mb-8 rounded-3xl p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Free English practice</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50 sm:text-4xl">{category.name} Tests</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">{category.description}</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">Choose a test to see its learning goals and worked examples. Use Exam mode for a timed attempt or Practice mode for feedback as you answer.</p>
          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{tests.length} tests · {totalQuestions} questions · Answer explanations</p>
        </header>

        <section aria-labelledby="practice-tests-heading">
          <h2 id="practice-tests-heading" className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-50">Choose your test</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tests.map((test) => (
              <Link key={test.slug} href={getPracticeTestPath(test)} className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 transition hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">{test.level}</span>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-50">{test.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{test.description}</p>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{test.questions.length} questions · {test.duration} min{test.passages?.length ? ` · ${test.passages.length} texts` : ''}</p>
                <span className="mt-3 inline-block text-sm font-bold text-blue-700 dark:text-blue-300">View test →</span>
              </Link>
            ))}
          </div>
        </section>

        <nav aria-label="Other English practice" className="mt-10 border-t border-[rgb(var(--border))] pt-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">Keep practising</h2>
          <ul className="flex flex-wrap gap-3">
            {PRACTICE_CATEGORIES.filter((other) => other.id !== category.id).map((other) => (
              <li key={other.id}><Link href={other.path} className="em-card inline-flex rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-blue-800 dark:text-blue-200 hover:border-blue-400">{other.name}</Link></li>
            ))}
            <li><Link href="/#level-tests" className="em-card inline-flex rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-bold text-blue-800 dark:text-blue-200 hover:border-blue-400">Grammar by level</Link></li>
          </ul>
        </nav>
      </div>
    </main>
  );
}
