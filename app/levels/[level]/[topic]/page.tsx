import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { serializeJsonLd } from '@/lib/seo';
import { LEVEL_CATALOG, getLevelDefinition, getTopicTestSlug } from '@/lib/level-catalog';
import { getLevelTopicTest } from '@/lib/level-tests';
import { getLevelBreadcrumbs, getLevelTopicMetadata, getRelatedLevelTopics, getTopicStructuredData } from '@/lib/level-seo';
import { getTopicStudyGuide } from '@/lib/level-study-guides';
import LevelBreadcrumbs from '@/components/LevelBreadcrumbs';

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
  return getLevelTopicMetadata(definition, topic);
}

export default function TopicPage({ params }: PageProps) {
  const { definition, topic } = getTopic(params);
  const test = getLevelTopicTest(definition.key, topic.slug);
  const guide = getTopicStudyGuide(definition.key, topic.slug);
  if (!test || !guide) notFound();
  const testSlug = getTopicTestSlug(definition.key, topic.slug);
  const startHref = `/start?${new URLSearchParams({ testSlug })}`;
  const relatedTopics = getRelatedLevelTopics(definition, topic);

  return (
    <main className="em-page py-8 sm:py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getTopicStructuredData(definition, topic)) }} />
      <div className="max-w-3xl mx-auto">
        <LevelBreadcrumbs items={getLevelBreadcrumbs(definition, topic)} />

        <section className="em-card rounded-3xl p-6 sm:p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{definition.label} · {definition.name}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black leading-tight text-slate-900 dark:text-slate-50">{definition.label} {topic.title} Test</h1>
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
            This test is free.{' '}
            Choose Exam mode for a timed attempt or Practice mode for feedback as you answer.
            After finishing, review your score, explanations and saved mistakes.
          </p>
        </section>

        <section className="mt-8 em-card rounded-2xl p-6 sm:p-8" aria-labelledby="study-heading">
          <h2 id="study-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">What you will practise</h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-200">{guide.summary}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
            {guide.focus.map((focus) => <li key={focus}>{focus}</li>)}
          </ul>
          <p className="mt-5 rounded-xl bg-blue-50 dark:bg-blue-950 p-4 leading-relaxed text-slate-800 dark:text-slate-100"><strong>Study tip: </strong>{guide.tip}</p>
        </section>

        <section className="mt-8" aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">Example questions with answers</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try these three questions from the test, then open each answer to see the explanation. Start the full test above for all {test.questions.length} questions.</p>
          <ol className="mt-4 space-y-4 list-decimal pl-6 text-slate-800 dark:text-slate-200">
            {test.questions.slice(0, 3).map((question) => (
              <li key={question.id} className="pl-1 leading-relaxed break-words">
                <p className="font-semibold whitespace-pre-line">{question.prompt}</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2" aria-label="Answer choices">
                  {question.choices.map((choice) => <li key={choice.id} className="rounded-lg border border-[rgb(var(--border))] px-3 py-2">{choice.text}</li>)}
                </ul>
                <details className="mt-3 rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
                  <summary className="cursor-pointer font-semibold text-blue-800 dark:text-blue-200">Show answer and explanation</summary>
                  <p className="mt-3"><strong>Answer: </strong>{question.choices.find((choice) => choice.isCorrect)?.text}</p>
                  <p className="mt-2">{question.explanation}</p>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <nav className="mt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">More {definition.label} topic tests</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {relatedTopics.map((related) => (
              <li key={related.slug}>
                <Link href={`/levels/${definition.key}/${related.slug}`} className="em-card block h-full rounded-xl border border-[rgb(var(--border))] p-4 hover:border-blue-400">
                  <span className="font-bold text-blue-800 dark:text-blue-200">{related.title}</span>
                  <span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">{related.questionCount} questions with explanations</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="mt-8 flex flex-wrap gap-3" aria-label="More practice">
          <Link href={`/levels/${definition.key}`} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100">More {definition.label} topics</Link>
          <Link href="/" className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100">All tests</Link>
        </nav>
      </div>
    </main>
  );
}
