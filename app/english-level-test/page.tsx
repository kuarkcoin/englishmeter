import Link from 'next/link';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { CEFR_LEVELS, PLACEMENT_METHOD } from '@/lib/placement';
import { buildSeoMetadata, serializeJsonLd, SITE_URL } from '@/lib/seo';

export function generateMetadata() {
  return buildSeoMetadata({
    title: 'Free English Level Test – 30 Questions, A1–C2',
    description: 'Take a free 30-question English level test in 20 minutes. Get a grammar and vocabulary practice estimate from A1 to C2, with answers and explanations.',
    path: '/english-level-test',
  });
}

const faqs = [
  { question: 'What does this English level test measure?', answer: 'It samples grammar and vocabulary across A1, A2, B1, B2, C1 and C2. It does not assess listening, speaking or extended writing. Use the result to choose practice materials, rather than as proof of your overall language proficiency.' },
  { question: 'How is my practice level calculated?', answer: 'There are five questions at each level. You need at least four correct answers at each consecutive level up to the level shown. Higher-level answers cannot skip a gap at a lower level. Complete all 30 questions to receive an estimate.' },
  { question: 'Is the test free, and do I need an account?', answer: 'The test is free and does not require an account. You can review your answers and explanations immediately after finishing.' },
  { question: 'Will I receive an official CEFR certificate?', answer: 'No. This short test gives a grammar and vocabulary practice estimate. It is not a certified CEFR assessment or a prediction of an IELTS, TOEIC or Cambridge exam score.' },
  { question: 'What should I study after the test?', answer: 'Start with the recommended level and review the topics behind your incorrect answers. Combine grammar exercises with vocabulary and reading practice. Use English in real conversations and longer texts as well.' },
];

export default function EnglishLevelTestPage() {
  const url = `${SITE_URL}/english-level-test`;
  const breadcrumbs = [{ name: 'Home', path: '/' }, { name: 'English tests', path: '/english-tests' }, { name: 'English level test', path: '/english-level-test' }];
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: 'Free English Level Test', inLanguage: 'en', mainEntity: { '@id': `${url}#quiz` } },
      { '@type': 'Quiz', '@id': `${url}#quiz`, url, name: 'English Grammar and Vocabulary Level Test', description: '30 questions with answer explanations and an A1–C2 grammar and vocabulary practice estimate.', inLanguage: 'en', isAccessibleForFree: true, timeRequired: 'PT20M', educationalLevel: [...CEFR_LEVELS], learningResourceType: 'Practice test', teaches: ['English grammar', 'English vocabulary'], publisher: { '@id': `${SITE_URL}/#organization` } },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}` })) },
    ],
  };
  return (
    <main className="em-page px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <div className="mx-auto max-w-3xl">
        <PracticeBreadcrumbs items={breadcrumbs} />
        <header className="rounded-3xl bg-gradient-to-br from-blue-950 to-indigo-800 p-6 text-white sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200">Grammar & vocabulary · A1–C2</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">Free English Level Test</h1>
          <p className="mt-5 text-lg leading-relaxed text-blue-100">Find a useful starting point for your English practice. Answer 30 questions, review the explanations and get a grammar and vocabulary level estimate.</p>
          <p className="mt-5 font-semibold">30 questions · 20 minutes · No account needed</p>
          <Link href="/start?testSlug=quick-placement" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-blue-900 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 sm:w-auto">Start the English level test</Link>
        </header>
        <section aria-labelledby="placement-before" className="em-card mt-8 rounded-2xl p-6 sm:p-8">
          <h2 id="placement-before" className="text-2xl font-bold">Before you begin</h2>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">Choose a quiet moment and allow up to 20 minutes. Work on your own without a dictionary or translation tool so the result reflects what you currently know. Each question has one correct answer. You can review your selections before submitting.</p>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">The test includes five questions at every level, from A1 to C2. Some questions will feel difficult; that is expected. Answer all 30 questions to receive an estimate, then use the explanations to understand both your mistakes and your successful answers.</p>
        </section>
        <section aria-labelledby="placement-result" className="em-card mt-8 rounded-2xl p-6 sm:p-8">
          <h2 id="placement-result" className="text-2xl font-bold">Understand your result</h2>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">{PLACEMENT_METHOD}</p>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">For example, four correct answers at A1 and A2, followed by three at B1, lead to an A2 practice estimate even if you answer some harder questions correctly. The result identifies the highest continuous foundation demonstrated by this short set.</p>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">A short multiple-choice test cannot capture every part of using a language. Your reading, listening, speaking and writing may develop at different speeds. Treat this result as guidance for your next practice session.</p>
        </section>
        <section aria-labelledby="placement-levels" className="mt-8">
          <h2 id="placement-levels" className="text-2xl font-bold">What do A1, A2, B1, B2, C1 and C2 mean?</h2>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['A1', 'Beginner', 'Basic words and simple sentences about familiar situations.'],
              ['A2', 'Elementary', 'Routine exchanges and common everyday topics.'],
              ['B1', 'Intermediate', 'Connected language about experiences, plans and opinions.'],
              ['B2', 'Upper-intermediate', 'More detailed ideas and a wider range of sentence structures.'],
              ['C1', 'Advanced', 'Precise, flexible language for complex ideas and contexts.'],
              ['C2', 'Proficiency', 'Fine distinctions of meaning and a broad command of language.'],
            ].map(([level, name, description]) => <div key={level} className="em-card rounded-xl border border-[rgb(var(--border))] p-5">
              <dt className="font-bold"><Link href={`/levels/${level.toLowerCase()}`} className="text-blue-800 underline-offset-4 hover:underline dark:text-blue-200">{level} · {name}</Link></dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</dd>
            </div>)}
          </dl>
        </section>
        <section aria-labelledby="placement-faq" className="mt-8">
          <h2 id="placement-faq" className="text-2xl font-bold">English level test questions</h2>
          <div className="mt-5 space-y-3">{faqs.map((faq) => <details key={faq.question} className="em-card rounded-xl border border-[rgb(var(--border))] p-5">
            <summary className="cursor-pointer font-bold">{faq.question}</summary>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</p>
          </details>)}</div>
        </section>
        <nav aria-label="Next English practice" className="mt-8 flex flex-wrap gap-3">
          <Link href="/start?testSlug=quick-placement" className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Take the 30-question test</Link>
          <Link href="/english-tests" className="em-card rounded-xl border border-[rgb(var(--border))] px-5 py-3 font-bold text-blue-800 dark:text-blue-200">Browse all English tests</Link>
        </nav>
      </div>
    </main>
  );
}
