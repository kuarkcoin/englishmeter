import Link from 'next/link';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { IELTS_GRAMMAR_TESTS } from '@/data/ielts';
import { getPracticeCategory } from '@/lib/practice-categories';
import { getPracticeBreadcrumbs, getPracticeCategoryStructuredData, getPracticeTestPath } from '@/lib/practice-catalog';
import { buildSeoMetadata, serializeJsonLd } from '@/lib/seo';

export function generateMetadata() {
  return buildSeoMetadata({
    title: 'IELTS Grammar Tests – 10 Free Tests with Answers',
    description: 'Practise IELTS grammar with 10 free online tests, 15 questions each. Study key rules, check your answers and learn from clear English explanations.',
    path: '/ielts-grammar-tests',
  });
}

const faqs = [
  {
    question: 'Is there a separate grammar test in IELTS?',
    answer: 'No. IELTS assesses Listening, Reading, Writing and Speaking. Grammatical range and accuracy are assessed in Writing and Speaking. These multiple-choice exercises help you practise the grammar behind clear communication; they are not an official IELTS test paper.',
  },
  {
    question: 'Which grammar topics should I study for IELTS?',
    answer: 'Start with tenses, articles and subject–verb agreement. Then work on modal verbs, conditionals, relative clauses, passive voice, comparisons and sentence linking. Accurate simple sentences matter as well as a flexible range of more complex structures.',
  },
  {
    question: 'Are these IELTS grammar tests free, and do they include answers?',
    answer: 'Yes. All 10 tests are free and contain 15 questions each. Every question has an English explanation. Use Practice mode for feedback as you answer, or finish a timed Exam attempt and review your answers afterwards. You do not need an account to take these tests.',
  },
  {
    question: 'Will my result tell me my IELTS band score?',
    answer: 'No. A score on a short multiple-choice grammar test cannot be converted into an IELTS band score. Use your result to find grammar points to revise, then practise using those structures in your own sentences.',
  },
  {
    question: 'Can I use these exercises for Academic and General Training?',
    answer: 'Yes. Both IELTS versions require control of English grammar. The exercises use academic and everyday contexts, so they can support preparation for either version. They do not replace practice with the actual tasks and assessment criteria for your chosen exam.',
  },
];

export default function IeltsGrammarTestsPage() {
  const category = getPracticeCategory('ielts-grammar')!;
  const totalQuestions = IELTS_GRAMMAR_TESTS.reduce((total, test) => total + test.questions.length, 0);

  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeCategoryStructuredData(category)) }} />
      <div className="mx-auto max-w-5xl">
        <PracticeBreadcrumbs items={getPracticeBreadcrumbs(category)} />
        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950 via-sky-900 to-indigo-800 p-6 text-white shadow-lg sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-200">Free online grammar practice</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">IELTS Grammar Tests</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-sky-100">Practise the grammar that helps you express ideas clearly. Choose from 10 focused tests, learn the rules and understand why each answer works.</p>
          <ul aria-label="IELTS grammar collection details" className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <li className="rounded-full bg-white/15 px-4 py-2">{IELTS_GRAMMAR_TESTS.length} topic tests</li>
            <li className="rounded-full bg-white/15 px-4 py-2">{totalQuestions} questions</li>
            <li className="rounded-full bg-white/15 px-4 py-2">15 questions per test</li>
            <li className="rounded-full bg-white/15 px-4 py-2">Answers & explanations</li>
          </ul>
          <a href="#choose-ielts-test" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-sky-900 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300">Choose a grammar test ↓</a>
        </header>

        <section aria-labelledby="ielts-grammar-purpose" className="em-card mt-8 rounded-2xl p-6 sm:p-8">
          <h2 id="ielts-grammar-purpose" className="text-2xl font-bold text-slate-900 dark:text-slate-50">How grammar practice supports your IELTS preparation</h2>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">Grammar helps you describe changes, compare ideas, explain causes and express opinions precisely. In IELTS Writing and Speaking, grammatical range and accuracy are part of the assessment. A well-controlled simple sentence can communicate more effectively than a complicated sentence with unclear meaning.</p>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">These B1–C1 practice sets move from sentence foundations to complex structures. The CEFR labels describe the practice level; they are not IELTS band predictions. IELTS has no standalone grammar paper. EnglishMeter provides independent preparation materials and is not affiliated with or endorsed by the IELTS test owners.</p>
        </section>

        <section id="choose-ielts-test" aria-labelledby="choose-ielts-test-heading" className="mt-10 scroll-mt-28">
          <h2 id="choose-ielts-test-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose from 10 free IELTS grammar tests</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">Work through the topics in order, or choose one you want to improve. Each test page includes a short grammar guide and worked examples before you start.</p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {IELTS_GRAMMAR_TESTS.map((test) => (
              <li key={test.slug}>
                <Link href={getPracticeTestPath(test)} className="em-card group flex h-full flex-col rounded-2xl border border-[rgb(var(--border))] p-5 transition hover:border-cyan-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-base font-black text-sky-800 dark:bg-sky-900/60 dark:text-sky-100">{String(test.number).padStart(2, '0')}</span>
                    <span className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">{test.level} practice</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 dark:text-slate-50">{test.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{test.description}</p>
                  <p className="mt-auto pt-5 text-sm font-medium text-slate-600 dark:text-slate-300">{test.questions.length} questions · {test.duration} minutes · Explanations</p>
                  <span className="mt-3 text-sm font-bold text-sky-800 group-hover:underline dark:text-sky-200">Study the topic & take the test →</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="ielts-study-routine" className="em-card mt-10 rounded-2xl p-6 sm:p-8">
          <h2 id="ielts-study-routine" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Make each 15-question test useful</h2>
          <ol className="mt-5 list-decimal space-y-4 pl-5 leading-relaxed text-slate-700 dark:text-slate-200">
            <li><strong>Review the topic.</strong> Read the short lesson and examples on the test page. Notice how a change in grammar changes the meaning.</li>
            <li><strong>Choose how to practise.</strong> The test opens in Exam mode with a 15-minute timer. Switch to Practice inside the test for untimed work and feedback after each answer.</li>
            <li><strong>Read every explanation.</strong> After finishing, check your mistakes and any answers you guessed. Write one sentence of your own using each rule you need to revise.</li>
            <li><strong>Apply what you learn.</strong> Use these patterns when describing experiences, explaining an opinion or comparing information. Return to the mixed grammar review once you have studied the topic tests.</li>
          </ol>
        </section>

        <section aria-labelledby="ielts-grammar-faq" className="mt-10">
          <h2 id="ielts-grammar-faq" className="text-2xl font-bold text-slate-900 dark:text-slate-50">IELTS grammar practice: common questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="em-card rounded-2xl border border-[rgb(var(--border))] p-5">
                <summary className="cursor-pointer font-bold leading-relaxed text-slate-900 dark:text-slate-50">{faq.question}</summary>
                <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-200">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <nav aria-labelledby="ielts-more-practice" className="mt-10 border-t border-[rgb(var(--border))] pt-6">
          <h2 id="ielts-more-practice" className="text-xl font-bold text-slate-900 dark:text-slate-50">Continue building your English</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: '/tests/ielts-grammar', title: 'IELTS Grammar: 50-question mixed test', description: 'Try a longer review after the focused topic tests.' },
              { href: '/levels/b2', title: 'B2 grammar topics', description: 'Explore more upper-intermediate grammar practice.' },
              { href: '/practice/reading', title: 'Reading comprehension', description: 'Recognise grammar patterns in original English texts.' },
              { href: '/practice/word-formation', title: 'Word formation', description: 'Choose the word forms that fit your sentences.' },
            ].map((link) => (
              <li key={link.href}><Link href={link.href} className="em-card block h-full rounded-xl border border-[rgb(var(--border))] p-4 hover:border-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                <span className="font-bold text-sky-800 dark:text-sky-200">{link.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">{link.description}</span>
              </Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
