import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { serializeJsonLd } from '@/lib/seo';
import { LEVEL_CATALOG, getLevelDefinition } from '@/lib/level-catalog';
import { getLevelBreadcrumbs, getLevelMetadata, getLevelStructuredData } from '@/lib/level-seo';
import LevelBreadcrumbs from '@/components/LevelBreadcrumbs';

type PageProps = { params: { level: string } };

function getLevel(value: string) {
  const level = getLevelDefinition(value);
  if (!level) notFound();
  if (value !== level.key) permanentRedirect(`/levels/${level.key}`);
  return level;
}

export function generateStaticParams() {
  return LEVEL_CATALOG.map((level) => ({ level: level.key }));
}

export function generateMetadata({ params }: PageProps) {
  const level = getLevel(params.level);
  return getLevelMetadata(level);
}

export default function LevelPage({ params }: PageProps) {
  const level = getLevel(params.level);
  return (
    <main className="em-page py-8 sm:py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getLevelStructuredData(level)) }} />
      <div className="max-w-5xl mx-auto">
        <LevelBreadcrumbs items={getLevelBreadcrumbs(level)} />
        <header className="em-card rounded-3xl p-6 sm:p-8 mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Free English practice by topic</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50">{level.label} English Tests — {level.name}</h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300 leading-relaxed">{level.description}</p>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300 leading-relaxed">Choose a topic to read a short study guide and worked examples, then check your understanding with a free test. Review your answers and explanations after finishing, or use Practice mode for feedback as you go.</p>
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{level.topics.length} topic tests · {level.duration} minutes per test · Answer explanations</p>
          <Link href={`/start?testSlug=level-${level.key}`} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 px-5 py-3 font-bold text-blue-800 dark:text-blue-200 hover:border-blue-400">
            Take a mixed {level.label} test
          </Link>
        </header>

        <section aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-50">Choose a topic</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {level.topics.map((topic, index) => (
              <Link
                key={topic.slug}
                href={`/levels/${level.key}/${topic.slug}`}
                className="em-card group rounded-2xl border border-[rgb(var(--border))] p-5 transition hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Topic {index + 1}</span>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-50">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{topic.description}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{topic.questionCount} questions · {level.duration} min</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">View test →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <nav aria-label="Other English levels" className="mt-10 border-t border-[rgb(var(--border))] pt-6">
          <p className="mb-3 font-bold text-slate-900 dark:text-slate-50">Explore other levels</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {LEVEL_CATALOG.map((other) => (
              <Link key={other.key} href={`/levels/${other.key}`} aria-current={other.key === level.key ? 'page' : undefined} className={`rounded-xl border px-4 py-3 text-center font-bold ${other.key === level.key ? 'bg-blue-700 border-blue-700 text-white' : 'border-[rgb(var(--border))] text-slate-800 dark:text-slate-100 hover:border-blue-400'}`}>{other.label}</Link>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}
