import Link from 'next/link';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { PRACTICE_CATEGORIES } from '@/lib/practice-categories';
import { getPracticeTests } from '@/lib/practice-catalog';
import { LEVEL_CATALOG } from '@/lib/level-catalog';
import { buildSeoMetadata, serializeJsonLd, SITE_URL } from '@/lib/seo';

export function generateMetadata() {
  return buildSeoMetadata({
    title: 'Free English Tests Online with Answers',
    description: 'Find free English tests for your level and goals: grammar, vocabulary, reading, IELTS, TOEIC, Cambridge and Business English, with answers and explanations.',
    path: '/english-tests',
  });
}

export default function EnglishTestsPage() {
  const entries = [
    { name: 'English level test', path: '/english-level-test', description: 'Start with 30 grammar and vocabulary questions for an A1–C2 practice level estimate.', detail: '30 questions · 20 minutes' },
    { name: 'Grammar tests by topic', path: '/grammar', description: 'Choose a specific grammar point, from present simple and articles to advanced sentence structures.', detail: 'A1–C1 topic practice · Answer explanations' },
    { name: 'Vocabulary practice', path: '/vocabulary-tests', description: 'Choose vocabulary in context, word formation or word-meaning practice with a translation language.', detail: 'Everyday, academic and exam vocabulary' },
    { name: 'IELTS grammar preparation', path: '/ielts-grammar-tests', description: 'Practise grammar accuracy in ten focused sets. This is independent preparation, not an IELTS band assessment.', detail: '10 tests · 15 questions each' },
    { name: 'YDS preparation', path: '/yds-preparation', description: 'Choose existing practice mock tests, reading, grammar, connectors, synonyms and vocabulary mini tests.', detail: '32 practice mock tests · Focused skill practice' },
    ...PRACTICE_CATEGORIES.filter((category) => category.id !== 'ielts-grammar').map((category) => ({
      name: category.name, path: category.path, description: category.description,
      detail: `${getPracticeTests(category.id).length} tests · ${category.questionCount} questions per test`,
    })),
    { name: 'Daily English vocabulary', path: '/daily-english', description: 'Study everyday English word lists with Turkish meanings, then take the matching timed vocabulary quiz.', detail: 'Word lists and recall practice' },
    { name: 'Common phrasal verbs', path: '/levels/b1/common-phrasal-verbs', description: 'Practise phrasal verbs in sentence contexts and learn where object pronouns belong.', detail: 'B1 · 20 questions · Worked examples' },
    { name: 'Advanced English tests', path: '/advanced-tests', description: 'Try longer mixed grammar and vocabulary sets and review your best and latest results on this browser.', detail: '10 tests · B2–C1 mixed practice' },
    { name: 'Global English Challenge', path: '/challenge', description: 'Try the daily mix of grammar, vocabulary and reading, then compare your published result with other participants.', detail: '50 questions · Daily challenge' },
  ];
  const breadcrumbs = [{ name: 'Home', path: '/' }, { name: 'English tests', path: '/english-tests' }];
  const url = `${SITE_URL}/english-tests`;
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: 'Free English Tests Online', inLanguage: 'en', isAccessibleForFree: true,
        mainEntity: { '@type': 'ItemList', numberOfItems: entries.length, itemListElement: entries.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, name: entry.name, url: `${SITE_URL}${entry.path}` })) } },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}` })) },
    ],
  };
  return (
    <main className="em-page px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <div className="mx-auto max-w-5xl">
        <PracticeBreadcrumbs items={breadcrumbs} />
        <header className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-900 p-6 text-white sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200">Choose your next step</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">Free English Tests Online</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-blue-100">Find a test that matches your goal. Check your current level, revise one grammar point, build reading skills or prepare for workplace and exam tasks. Every practice category includes answers and explanations.</p>
          <Link href="/english-level-test" className="mt-6 inline-flex min-h-12 rounded-xl bg-white px-6 py-3 font-bold text-blue-900 hover:bg-blue-50">Not sure where to start? Check your level →</Link>
        </header>
        <section aria-labelledby="test-goals-heading" className="mt-10">
          <h2 id="test-goals-heading" className="text-2xl font-bold">Choose tests by skill or goal</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">For general improvement, combine grammar, vocabulary and reading. For an exam, select its named practice section and check the task format. These short sets support preparation; they do not replace a full official exam.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {entries.map((entry) => <li key={entry.path}><Link href={entry.path} className="em-card flex h-full flex-col rounded-2xl border border-[rgb(var(--border))] p-6 transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">{entry.name}</h3>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{entry.description}</p>
              <p className="mt-auto pt-5 text-sm font-semibold">{entry.detail}</p>
              <span className="mt-3 font-bold text-blue-700 dark:text-blue-300">Explore tests →</span>
            </Link></li>)}
          </ul>
        </section>
        <section aria-labelledby="directory-levels" className="mt-10">
          <h2 id="directory-levels" className="text-2xl font-bold">Already know your English level?</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Use these level pages to find suitable practice. A1 starts with everyday basics; higher levels introduce more complex vocabulary and grammar. If a test feels too difficult, review the level below and return after some practice.</p>
          <nav aria-label="English tests by level" className="mt-5 grid gap-3 sm:grid-cols-3">
            {LEVEL_CATALOG.map((level) => <Link key={level.key} href={`/levels/${level.key}`} className="em-card rounded-xl border border-[rgb(var(--border))] p-4 font-bold text-blue-800 hover:border-blue-500 dark:text-blue-200">{level.label} · {level.name}</Link>)}
          </nav>
        </section>
        <section aria-labelledby="directory-routine" className="em-card mt-10 rounded-2xl p-6 sm:p-8">
          <h2 id="directory-routine" className="text-2xl font-bold">Turn a test result into a study plan</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-200">
            <li>Choose one focused test and try it before checking the answers.</li>
            <li>Read the explanation for each mistake and for any answer you guessed.</li>
            <li>Write or say a new example using the rule or phrase you learned.</li>
            <li>Try a related test, then return to the original topic to check your progress.</li>
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Most topic tests offer timed Exam mode and untimed Practice mode. Kids quizzes have their own untimed format; the daily Challenge has separate timing and leaderboard rules.</p>
        </section>
      </div>
    </main>
  );
}
