import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import KidsQuiz from '@/components/KidsQuiz';
import { getPracticeTest, getPracticeTests, getPracticeTestMetadata, getPracticeTestStructuredData } from '@/lib/practice-catalog';
import { getPracticeQuizForTest } from '@/lib/practice-tests';
import { serializeJsonLd } from '@/lib/seo';

type Props = { params: { slug: string } };
function getTest(slug: string) {
  const test = getPracticeTest('kids', slug.toLowerCase());
  if (!test) notFound();
  if (slug !== test.slug) permanentRedirect(`/kids/${test.slug}`);
  return test;
}

export function generateStaticParams() {
  return getPracticeTests('kids').map((test) => ({ slug: test.slug }));
}

export function generateMetadata({ params }: Props) {
  return getPracticeTestMetadata(getTest(params.slug));
}

export default function KidsTopicPage({ params }: Props) {
  const test = getTest(params.slug);
  const quiz = getPracticeQuizForTest(test);
  if (!quiz) notFound();
  const sample = test.questions[1] ?? test.questions[0];
  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeTestStructuredData(test)) }} />
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-2 text-sm"><Link href="/" className="font-semibold text-blue-700 dark:text-blue-300">Home</Link><span aria-hidden="true">/</span><Link href="/kids" className="font-semibold text-blue-700 dark:text-blue-300">Kids English</Link><span aria-hidden="true">/</span><span aria-current="page">{test.title}</span></nav>
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Kids English · No timer</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{test.title} Quiz for Kids</h1>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{test.description} Choose one answer each time. There are {test.questions.length} questions, and you can try again after finishing.</p>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">{test.learningGoals.map((goal) => <li key={goal} className="rounded-full bg-blue-50 px-3 py-2 text-blue-800 dark:bg-blue-950 dark:text-blue-200">{goal}</li>)}</ul>
        </header>
        <KidsQuiz key={test.slug} title={test.title} questions={quiz.questions} />
        <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] p-5" aria-labelledby="kids-example-heading">
          <h2 id="kids-example-heading" className="text-lg font-bold">A question to read together</h2>
          <p className="mt-3">{sample.prompt}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2" aria-label="Sample answer choices">{sample.options.map((option) => <li key={option} className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">{option}</li>)}</ul>
          <details className="mt-3"><summary className="cursor-pointer font-semibold text-blue-700 dark:text-blue-300">Read the answer</summary><p className="mt-2"><strong>{sample.options[sample.correctIndex]}</strong> — {sample.explanation}</p></details>
        </section>
        <Link href="/kids" className="mt-6 inline-flex min-h-12 items-center rounded-xl border border-[rgb(var(--border))] px-5 py-3 font-bold text-blue-700 dark:text-blue-300">← All Kids English topics</Link>
      </div>
    </main>
  );
}
