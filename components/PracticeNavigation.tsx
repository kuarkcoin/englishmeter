import Link from 'next/link';
import { PRACTICE_CATEGORIES } from '@/lib/practice-categories';

const cardStyles: Record<string, { icon: string; label: string; colour: string }> = {
  reading: { icon: '📖', label: 'A1–C1 · 20 questions per test', colour: 'from-blue-600 to-indigo-700' },
  vocabulary: { icon: '💬', label: 'A1–A2 · 6 everyday themes', colour: 'from-emerald-600 to-teal-700' },
  'word-formation': { icon: '🧩', label: 'B1–C1 · Word families', colour: 'from-violet-600 to-purple-700' },
  kids: { icon: '🌈', label: 'Ages 7–10 · 10 questions · No timer', colour: 'from-orange-600 to-rose-700' },
};

export default function PracticeNavigation() {
  return (
    <section id="skill-tests" aria-labelledby="skill-tests-heading" className="mx-auto w-full max-w-6xl px-4 pb-10 scroll-mt-36">
      <h2 id="skill-tests-heading" className="text-2xl font-black sm:text-3xl">Explore more English practice</h2>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">Read, build vocabulary and learn new word forms. Young learners have their own short quizzes.</p>
      <nav aria-label="English practice categories" className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRACTICE_CATEGORIES.filter((category) => category.id !== 'ielts-grammar').map((category) => {
          const style = cardStyles[category.id];
          return (
            <Link key={category.id} href={category.path} className={`flex flex-col rounded-2xl bg-gradient-to-br ${style.colour} p-5 text-white shadow-md transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300`}>
              <span className="text-3xl" aria-hidden="true">{style.icon}</span>
              <h3 className="mt-3 text-xl font-black">{category.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/95">{category.description}</p>
              <p className="mt-auto pt-5 text-xs font-bold">{style.label}</p>
              <span className="mt-3 font-bold">Choose a test →</span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
