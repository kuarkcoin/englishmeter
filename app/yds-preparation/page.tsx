import Link from 'next/link';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { getQuestionsBySlug } from '@/lib/quizManager';
import { buildSeoMetadata, serializeJsonLd, SITE_URL } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'YDS Preparation: Free Mock Tests, Grammar and Vocabulary',
  description: 'Prepare for YDS with 32 English practice mock tests, reading, grammar, conjunctions, synonyms and vocabulary mini tests. Review your answers and plan revision.',
  path: '/yds-preparation',
});

const skills = [
  { name: 'YDS grammar', path: '/tests/yds-grammar', description: 'Review mixed grammar questions, then use your mistakes to select a focused grammar topic.' },
  { name: 'Reading comprehension', path: '/tests/yds-reading', description: 'Read passages and check main ideas, details and conclusions supported by the text.' },
  { name: 'Conjunctions and connectors', path: '/tests/yds-conjunctions', description: 'Compare contrast, cause, result and other logical relationships between clauses.' },
  { name: 'Synonyms', path: '/tests/yds-synonyms', description: 'Choose the word or expression closest in meaning, rather than simply a related word.' },
  { name: 'Phrasal verbs', path: '/tests/yds-phrasal-verbs', description: 'Practise phrasal verb meanings with Turkish answer choices, then review the complete expression.' },
  { name: 'Vocabulary mini tests', path: '/yds-5000-mini', description: 'Study academic words in 50-question sets. Turkish is the default; other meaning languages are available.' },
];

export default function YdsPreparationPage() {
  const exams = Array.from({ length: 32 }, (_, index) => {
    const id = index + 1;
    const slug = `yds-exam-test-${id}`;
    const test = getQuestionsBySlug(slug);
    return { name: `YDS Practice Mock Test ${id}`, path: `/tests/${slug}`, count: test.questions.length, duration: test.duration };
  });
  const breadcrumbs = [{ name: 'Home', path: '/' }, { name: 'English tests', path: '/english-tests' }, { name: 'YDS preparation', path: '/yds-preparation' }];
  const url = `${SITE_URL}/yds-preparation`;
  const entries = [...skills, ...exams];
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: 'YDS Preparation', description: 'Independent English practice for YDS preparation, with mock tests and focused skills.', inLanguage: 'en', isAccessibleForFree: true,
      mainEntity: { '@type': 'ItemList', numberOfItems: entries.length, itemListElement: entries.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${SITE_URL}${item.path}` })) } },
    { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}` })) },
  ] };
  return <main className="em-page px-4 py-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <div className="mx-auto max-w-5xl">
      <PracticeBreadcrumbs items={breadcrumbs} />
      <header className="rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-900 p-6 text-white sm:p-10">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Yabancı Dil Sınavı preparation</p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">YDS Preparation: Mock Tests and Focused Practice</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-indigo-100">Choose a longer mixed test to review your skills, or work on one area at a time: grammar, reading, connectors and vocabulary. After finishing, check the answer review and use your mistakes to plan the next session.</p>
        <Link href="/tests/yds-exam-test-1" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-white px-6 py-3 font-bold text-indigo-900">Open practice mock test 1 →</Link>
      </header>
      <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">EnglishMeter provides independent practice. These tests are not official ÖSYM papers, and their scores do not predict or certify a YDS result. The question sets are kept in their existing format; vocabulary tests can include Turkish meanings.</p>
      <section aria-labelledby="yds-skills" className="mt-10">
        <h2 id="yds-skills" className="text-2xl font-bold">Choose the skill you want to improve</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">{skills.map((item) => <li key={item.path}><Link href={item.path} className="em-card block h-full rounded-2xl border border-[rgb(var(--border))] p-5 hover:border-indigo-400">
          <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200">{item.name}</h3><p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
        </Link></li>)}</ul>
      </section>
      <section aria-labelledby="yds-mock-tests" className="mt-10">
        <h2 id="yds-mock-tests" className="text-2xl font-bold">32 YDS practice mock tests</h2>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Set aside enough time for a full attempt. Each link shows the question count and time limit for that set. If you have only a short study session, choose a focused skill above instead.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{exams.map((exam) => <li key={exam.path}><Link href={exam.path} className="em-card block rounded-xl border border-[rgb(var(--border))] p-4 hover:border-indigo-400"><h3 className="font-bold text-indigo-800 dark:text-indigo-200">{exam.name}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exam.count} questions · {exam.duration} minutes</p></Link></li>)}</ul>
      </section>
      <section aria-labelledby="yds-study-plan" className="em-card mt-10 rounded-2xl border border-[rgb(var(--border))] p-6">
        <h2 id="yds-study-plan" className="text-2xl font-bold">Build a practical revision routine</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-200">
          <li>Complete a mixed test and note which questions you answered confidently, guessed or left blank.</li>
          <li>Review the answer key. For reading, locate evidence in the passage; for vocabulary, record the expression with a useful context.</li>
          <li>Choose one focused test based on the pattern of your mistakes, such as connectors or grammar.</li>
          <li>Return to a different mock test after revising. Compare accuracy and time use without treating practice scores as official results.</li>
        </ol>
      </section>
      <nav aria-label="Related English study" className="mt-8 flex flex-wrap gap-3">
        <Link href="/grammar" className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 font-bold text-blue-700 dark:text-blue-300">Grammar topic guides</Link>
        <Link href="/practice/reading" className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 font-bold text-blue-700 dark:text-blue-300">Reading by CEFR level</Link>
        <Link href="/vocabulary" className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 font-bold text-blue-700 dark:text-blue-300">English–Turkish word reference</Link>
      </nav>
    </div>
  </main>;
}
