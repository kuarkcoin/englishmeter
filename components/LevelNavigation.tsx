import Link from 'next/link';
import { LEVEL_CATALOG } from '@/lib/level-catalog';

const colors: Record<string, string> = {
  a1: 'from-emerald-600 to-teal-700',
  a2: 'from-sky-600 to-blue-700',
  b1: 'from-indigo-600 to-violet-700',
  b2: 'from-violet-600 to-purple-800',
  c1: 'from-rose-600 to-fuchsia-800',
};

export default function LevelNavigation() {
  const levels = LEVEL_CATALOG.filter((level) => level.key !== 'c2');
  return (
    <section id="level-tests" aria-labelledby="level-tests-heading" className="w-full max-w-6xl mx-auto px-4 pb-10 scroll-mt-36">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-300 mb-2">Learn step by step</p>
          <h2 id="level-tests-heading" className="text-2xl sm:text-3xl font-black">Choose your English level</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">A1–C1 · 20 questions per topic · 20 minutes · Answer explanations</p>
        </div>
        <Link href="/levels/c2" className="text-sm font-semibold text-blue-700 dark:text-blue-300 underline underline-offset-4">C2 practice →</Link>
      </div>
      <nav aria-label="English levels" className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {levels.map((level) => (
          <Link
            key={level.key}
            href={`/levels/${level.key}`}
            className={`group flex min-h-44 flex-col rounded-2xl bg-gradient-to-br ${colors[level.key]} p-5 text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${level.key === 'c1' ? 'col-span-2 lg:col-span-1' : ''}`}
          >
            <span className="text-4xl font-black tracking-tight">{level.label}</span>
            <span className="mt-1 text-sm font-bold">{level.name}</span>
            <span className="mt-4 text-xs text-white/90">{level.topics.length} topic tests</span>
            <span className="mt-auto pt-3 text-sm font-bold">Choose a topic <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
