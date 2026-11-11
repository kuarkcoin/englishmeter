import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LEVEL_CATALOG } from '@/lib/level-catalog';
import StudyHubStructuredData from '@/components/StudyHubStructuredData';

export const metadata: Metadata = buildSeoMetadata({
  "title": "English Grammar Tests by Topic",
  "description": "Practise English grammar from A1 to C1 with free topic tests and answer explanations. Review tenses, conditionals, relative clauses and more.",
  "path": "/grammar"
});

export default function GrammarHubPage() {
  const levels = LEVEL_CATALOG.filter((level) => level.key !== 'c2');

  return (
    <main className="em-page py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <StudyHubStructuredData name="English grammar tests" path="/grammar" description="English grammar practice by level and topic, with worked examples and answer explanations." items={levels.map((level) => ({ name: `${level.label} grammar topics`, path: `/levels/${level.key}` }))} />
        <h1 className="text-4xl font-black mb-4">English Grammar Tests by Level and Topic</h1>
        <p className="mb-8 text-slate-700 dark:text-slate-300">Choose your English level, practise a grammar topic and review the explanation for each answer. Each A1–C1 topic test has 20 questions, with timed Exam mode or untimed Practice mode.</p>

        <section aria-labelledby="grammar-levels-heading" className="mb-10">
          <h2 id="grammar-levels-heading" className="text-2xl font-bold mb-4">Choose your English level</h2>
          <nav aria-label="Grammar tests by level" className="grid sm:grid-cols-2 gap-4">
            {levels.map((level) => (
              <Link key={level.key} href={`/levels/${level.key}`} className="em-card border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{level.label} English tests — {level.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{level.description}</p>
                <p className="mt-3 text-sm font-semibold text-blue-700 dark:text-blue-300">{level.topics.length} topic tests · 20 questions each →</p>
              </Link>
            ))}
          </nav>
        </section>

        <section aria-labelledby="grammar-plan-heading" className="em-card mb-8 rounded-2xl border border-[rgb(var(--border))] p-5">
          <h2 id="grammar-plan-heading" className="text-2xl font-bold">Focused practice or a mixed test?</h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">Choose a topic when you know the rule you want to improve. Choose a mixed test to find gaps across several grammar points. After checking an explanation, make a new sentence using the rule before moving on.</p>
          <nav aria-label="Mixed and exam grammar practice" className="mt-4 flex flex-wrap gap-3">
            <Link href="/tests/grammar-mega-test-100" className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300">100-question mixed grammar test</Link>
            <Link href="/ielts-grammar-tests" className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300">IELTS grammar practice</Link>
            <Link href="/yds-preparation" className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300">YDS preparation</Link>
          </nav>
        </section>

        <section aria-labelledby="grammar-topics-heading" className="mb-8">
          <h2 id="grammar-topics-heading" className="text-2xl font-bold mb-4">Review a grammar topic</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/test-conditionals" className="em-card border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-blue-400">Conditionals</Link>
            <Link href="/test-perfect-tenses" className="em-card border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-blue-400">Perfect Tenses</Link>
            <Link href="/test-relatives" className="em-card border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-blue-400">Relative Clauses</Link>
          </div>
        </section>

        <div className="flex gap-3 flex-wrap">
          <Link href="/english-tests" className="em-card px-4 py-2 rounded-xl border border-[rgb(var(--border))]">All English tests</Link>
          <Link href="/english-level-test" className="em-card px-4 py-2 rounded-xl border border-[rgb(var(--border))]">Find a starting level</Link>
          <Link href="/levels/c2" className="em-card px-4 py-2 rounded-xl border border-[rgb(var(--border))]">C2 proficiency practice</Link>
        </div>
      </div>
    </main>
  );
}
