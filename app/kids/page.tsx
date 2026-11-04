import Link from 'next/link';
import { getPracticeCategoryMetadata, getPracticeCategoryStructuredData, getPracticeTests, getPracticeTestPath } from '@/lib/practice-catalog';
import { getPracticeCategory } from '@/lib/practice-categories';
import { serializeJsonLd } from '@/lib/seo';

const category = getPracticeCategory('kids')!;
export const metadata = getPracticeCategoryMetadata(category);
const themeStyles: Record<string, { icon: string; colour: string }> = {
  colours: { icon: '🎨', colour: 'from-violet-600 to-fuchsia-700' },
  animals: { icon: '🐾', colour: 'from-emerald-600 to-teal-700' },
  numbers: { icon: '🔢', colour: 'from-blue-600 to-indigo-700' },
  family: { icon: '🏡', colour: 'from-rose-600 to-pink-700' },
  school: { icon: '🎒', colour: 'from-sky-600 to-blue-700' },
  food: { icon: '🍎', colour: 'from-orange-600 to-red-700' },
};

export default function KidsPage() {
  const tests = getPracticeTests('kids');
  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeCategoryStructuredData(category)) }} />
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link href="/" className="font-semibold text-blue-700 dark:text-blue-300">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">Kids English</span></nav>
        <header className="em-card rounded-3xl border border-[rgb(var(--border))] p-6 sm:p-9">
          <p className="font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Learn a little, smile a lot</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Kids English</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">Free English quizzes for young readers, especially ages 7–10. Explore familiar words one question at a time, with a short explanation after every answer.</p>
          <p className="mt-3 font-semibold">6 topics · 10 questions each · No timer</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Learning to read? A parent or teacher can read the questions with you.</p>
        </header>
        <section className="mt-8" aria-labelledby="kids-topics-heading">
          <h2 id="kids-topics-heading" className="mb-4 text-2xl font-bold">Choose your adventure</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => {
              const theme = themeStyles[test.slug] ?? themeStyles.school;
              return (
                <Link key={test.slug} href={getPracticeTestPath(test)} className={`rounded-3xl bg-gradient-to-br ${theme.colour} p-6 text-white shadow-md transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300`}>
                  <span className="text-4xl" aria-hidden="true">{theme.icon}</span>
                  <h3 className="mt-3 text-2xl font-black">{test.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{test.description}</p>
                  <p className="mt-5 font-bold">Play {test.questions.length} questions →</p>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="mt-8 em-card rounded-2xl p-6" aria-labelledby="kids-how-heading">
          <h2 id="kids-how-heading" className="text-xl font-bold">How to play</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600 dark:text-slate-300"><li>Choose a topic and read the question.</li><li>Pick one answer and read the explanation.</li><li>Finish ten questions, review your answers and try again whenever you like.</li></ol>
        </section>
        <Link href="/levels/a1" className="mt-6 inline-flex rounded-xl border border-[rgb(var(--border))] px-5 py-3 font-bold text-blue-700 dark:text-blue-300">Ready for more? Explore A1 English →</Link>
      </div>
    </main>
  );
}
