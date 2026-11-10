import Link from 'next/link';
import { getPracticeCategory } from '@/lib/practice-categories';

const sections = [
  { id: 'business-english', label: '3 tests · 60 questions', colour: 'from-emerald-800 to-teal-700' },
  { id: 'toeic-reading', label: 'Parts 5, 6 & 7 · 60 questions', colour: 'from-blue-800 to-cyan-700' },
  { id: 'cambridge-use-of-english', label: 'B2 First & C1 Advanced · 64 questions', colour: 'from-violet-800 to-indigo-700' },
] as const;

export default function ExamPracticeNavigation() {
  return (
    <section aria-labelledby="exam-practice-heading" className="mx-auto w-full max-w-6xl px-4 pb-10">
      <h2 id="exam-practice-heading" className="text-2xl font-black sm:text-3xl">English for work and exam preparation</h2>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">Practise real workplace language and focused reading tasks, with an explanation for every answer.</p>
      <nav aria-label="Work and exam English tests" className="mt-5 grid gap-4 md:grid-cols-3">
        {sections.map((section) => {
          const category = getPracticeCategory(section.id)!;
          return <Link key={section.id} href={category.path} className={`flex flex-col rounded-2xl bg-gradient-to-br ${section.colour} p-6 text-white shadow-md transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300`}>
            <h3 className="text-xl font-black">{category.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/95">{category.description}</p>
            <p className="mt-auto pt-5 text-sm font-semibold">{section.label}</p>
            <span className="mt-3 font-bold">Choose a practice test →</span>
          </Link>;
        })}
      </nav>
    </section>
  );
}
