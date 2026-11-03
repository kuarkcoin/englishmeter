import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { buildSeoMetadata } from '@/lib/seo';
import { LEVEL_CATALOG, getLevelDefinition, getTopicTestSlug } from '@/lib/level-catalog';
import { getLevelTopicTest } from '@/lib/level-tests';

type PageProps = { params: { level: string; topic: string } };

function getTopic({ level, topic: slug }: PageProps['params']) {
  const definition = getLevelDefinition(level);
  const topic = definition?.topics.find((item) => item.slug === slug);
  if (!definition || !topic) notFound();
  if (level !== definition.key) permanentRedirect(`/levels/${definition.key}/${slug}`);
  return { definition, topic };
}

export function generateStaticParams() {
  return LEVEL_CATALOG.flatMap((level) =>
    level.topics.map((topic) => ({ level: level.key, topic: topic.slug }))
  );
}

export function generateMetadata({ params }: PageProps) {
  const { definition, topic } = getTopic(params);
  return buildSeoMetadata({
    title: `${topic.title} – ${definition.label} English Practice`,
    description: `${topic.description} Take a ${topic.questionCount}-question ${definition.label} test in ${definition.duration} minutes, then review answers and explanations.`,
    path: `/levels/${definition.key}/${topic.slug}`,
  });
}

export default function TopicPage({ params }: PageProps) {
  const { definition, topic } = getTopic(params);
  const test = getLevelTopicTest(definition.key, topic.slug);
  if (!test) notFound();
  const testSlug = getTopicTestSlug(definition.key, topic.slug);
  const startHref = `/start?${new URLSearchParams({ testSlug })}`;

  return (
    <main className="em-page py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href={`/levels/${definition.key}`} className="inline-flex mb-6 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline">
          ← {definition.label} {definition.name} topics
        </Link>

        <section className="em-card rounded-3xl p-6 sm:p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{definition.label} · {definition.name}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black leading-tight text-slate-900 dark:text-slate-50">{topic.title}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{topic.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200" aria-label="Test details">
            <li className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2">{test.questions.length} questions</li>
            <li className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2">{test.duration} minutes</li>
            <li className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2">Answer explanations</li>
          </ul>
          <Link href={startHref} className="mt-6 inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-blue-700 hover:bg-blue-800 px-6 py-3 font-bold text-white shadow-sm transition-colors">
            Start {test.questions.length}-question test
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Choose Exam mode for a timed attempt or Practice mode for feedback as you answer.
            After finishing, review your score, explanations and saved mistakes.
          </p>
        </section>

        <section className="mt-8" aria-labelledby="preview-heading">
          <h2 id="preview-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">A preview of this topic</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">These are three of the questions in the test. Start when you are ready to choose your answers.</p>
          <ol className="mt-4 space-y-3 list-decimal pl-6 text-slate-800 dark:text-slate-200">
            {test.questions.slice(0, 3).map((question) => (
              <li key={question.id} className="pl-1 leading-relaxed whitespace-pre-line break-words">{question.prompt}</li>
            ))}
          </ol>
        </section>

        <nav className="mt-8 flex flex-wrap gap-3" aria-label="More practice">
          <Link href={`/levels/${definition.key}`} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100">More {definition.label} topics</Link>
          <Link href="/" className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100">All tests</Link>
        </nav>
      </div>
    </main>
  );
}
