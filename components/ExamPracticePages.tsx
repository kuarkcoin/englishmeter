import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { getPracticeCategory } from '@/lib/practice-categories';
import {
  getPracticeBreadcrumbs, getPracticeCategoryStructuredData, getPracticeTest,
  getPracticeTestMetadata, getPracticeTestPath, getPracticeTests, getPracticeTestSlug,
  getPracticeTestStructuredData,
} from '@/lib/practice-catalog';
import { buildSeoMetadata, serializeJsonLd } from '@/lib/seo';

export type ExamPracticeCategory = 'business-english' | 'toeic-reading' | 'cambridge-use-of-english';

type CategoryContent = {
  heading: string;
  seoTitle: string;
  eyebrow: string;
  introduction: string;
  purposeHeading: string;
  purpose: readonly string[];
  format: string;
  resultNote: string;
  tips: readonly { title: string; body: string }[];
  faqs: readonly { question: string; answer: string }[];
};

const CONTENT: Record<ExamPracticeCategory, CategoryContent> = {
  'business-english': {
    heading: 'Business English Tests',
    seoTitle: 'Free Business English Tests with Answers',
    eyebrow: 'English for work',
    introduction: 'Build the language you need to communicate at work. Practise workplace vocabulary, meeting and email language, and professional grammar with short tests and clear answer explanations.',
    purposeHeading: 'Choose language that fits the situation',
    purpose: [
      'Effective business English is about making your meaning clear. A request, a proposal and a confirmation serve different purposes, even when they discuss the same project. These tests ask you to notice the context before choosing the most suitable expression.',
      'Start with common workplace vocabulary, then practise the language of meetings and emails. The grammar test focuses on sentences used to describe responsibilities, report progress and discuss plans. B1 and B2 labels describe the level of the practice material.',
    ],
    format: 'Each test has 20 multiple-choice questions and English explanations. The 20-minute Exam timer is a practice allowance. You can switch to untimed Practice mode inside the test.',
    resultNote: 'Your result is feedback on these workplace language questions, not a professional qualification or a complete assessment of your communication skills.',
    tips: [
      { title: 'Read the situation first', body: 'Identify who is communicating, what they want to achieve and whether the message needs to request, explain, confirm or suggest something.' },
      { title: 'Learn useful word combinations', body: 'Record complete phrases such as meet a deadline or raise a concern. Remembering the verb and noun together makes the language easier to use.' },
      { title: 'Transfer the rule to your work', body: 'After reviewing an answer, make a short sentence about a familiar task. Check whether the wording is clear, accurate and appropriate for the reader.' },
    ],
    faqs: [
      { question: 'Who are these Business English tests for?', answer: 'The tests are designed for intermediate learners who want to practise English used in everyday work situations. They cover common office, meeting and email contexts without requiring specialist knowledge of a particular industry.' },
      { question: 'Do these tests mark my emails or job applications?', answer: 'No. You choose answers to prepared language questions and receive an explanation for each one. The exercises help you recognise useful wording, but they do not evaluate a document that you write.' },
      { question: 'Can I practise without a timer or an account?', answer: 'Yes. All tests are free and do not require an account. They open in Exam mode; select Practice inside the test for untimed work and feedback after each answer.' },
    ],
  },
  'toeic-reading': {
    heading: 'TOEIC Reading Practice Tests',
    seoTitle: 'TOEIC Reading Practice Tests with Answers',
    eyebrow: 'Parts 5, 6 and 7 practice',
    introduction: 'Practise the language and reading skills used in TOEIC Reading. Work through incomplete sentences, text completion and reading comprehension using original workplace contexts.',
    purposeHeading: 'Practise each reading task with a clear purpose',
    purpose: [
      'Incomplete-sentence questions ask you to consider grammar, word form and meaning together. Text-completion exercises add a wider context: a sentence must fit both its immediate grammar and the purpose of the whole message.',
      'Reading-comprehension practice asks you to find details, understand the writer’s purpose and make supported inferences from business texts. The original emails, notices and other workplace passages remain visible with their questions, so you can check the evidence for your answer.',
    ],
    format: 'These are three independent practice sets of 20 questions, focused on Parts 5, 6 and 7. They are not a full TOEIC Reading section. Each has a 20-minute practice timer and an untimed Practice option.',
    resultNote: 'The percentage shown is a practice score for this set. It is not an official TOEIC scaled score. EnglishMeter provides independent preparation materials and is not affiliated with the test provider.',
    tips: [
      { title: 'Identify what the gap tests', body: 'Before comparing choices, decide whether the sentence needs a noun, verb, adjective, connector or a particular word combination. Then check that the meaning fits.' },
      { title: 'Use the whole message', body: 'For text completion, read beyond the sentence containing the gap. References, dates and the purpose of the message can make one answer fit more clearly than the others.' },
      { title: 'Support every reading answer', body: 'Locate the sentence or detail that supports your choice. An answer can sound plausible in a business setting and still be unsupported by the passage.' },
    ],
    faqs: [
      { question: 'Which TOEIC Reading parts can I practise here?', answer: 'There is one focused practice set for each of three task types: incomplete sentences associated with Part 5, text completion associated with Part 6, and reading comprehension associated with Part 7. Each set contains 20 questions with English explanations.' },
      { question: 'Is this a full TOEIC mock test?', answer: 'No. These short sets help you study particular reading skills and question types. They do not reproduce a complete TOEIC test, include a Listening section or produce an official scaled score.' },
      { question: 'How should I review my TOEIC Reading practice result?', answer: 'Read the explanation for each mistake and each answer you guessed. For sentence questions, note the grammar or phrase you missed. For passage questions, find the evidence in the text before trying another practice set.' },
    ],
  },
  'cambridge-use-of-english': {
    heading: 'Cambridge Use of English Practice Tests',
    seoTitle: 'B2 First & C1 Advanced Use of English Practice',
    eyebrow: 'B2 First (FCE) · C1 Advanced (CAE)',
    introduction: 'Practise Part 1 multiple-choice cloze for B2 First and C1 Advanced. Read original texts and choose the word or phrase that best completes each gap.',
    purposeHeading: 'Learn to read around each cloze gap',
    purpose: [
      'Part 1 multiple-choice cloze focuses on vocabulary in context, including collocations, fixed expressions, phrasal verbs and shades of meaning. Grammar provides useful clues, but a grammatically possible word may still be the wrong choice for a particular phrase or context.',
      'Choose B2 First practice to develop upper-intermediate vocabulary control, or C1 Advanced practice for more demanding lexical choices. Each test contains two original texts with eight gaps each, giving you two Part 1 practice sets in one attempt.',
    ],
    format: 'Each test has 16 questions: two texts with eight gaps each and four options per gap. The 20-minute timer is an EnglishMeter practice allowance, not an official time limit for Part 1. Untimed Practice mode is also available.',
    resultNote: 'These independent exercises cover Part 1 practice, not the full Reading and Use of English paper. A practice percentage cannot be converted into an official Cambridge English Scale score.',
    tips: [
      { title: 'Read the text before choosing', body: 'Get a sense of the topic and the writer’s meaning first. The surrounding sentences may rule out a word that seems possible when the gap is viewed alone.' },
      { title: 'Check the words on both sides', body: 'Look for a fixed phrase, a dependent preposition or a common verb–noun combination. Compare complete expressions rather than isolated translations.' },
      { title: 'Keep a vocabulary record', body: 'Write down the correct phrase with a short example. Group related expressions by meaning or topic, then return to the text to see how the phrase contributes to the whole passage.' },
    ],
    faqs: [
      { question: 'Are B2 First and C1 Advanced the same as FCE and CAE?', answer: 'B2 First and C1 Advanced are the current qualification names commonly associated with the older abbreviations FCE and CAE. This collection offers separate practice sets at the two levels.' },
      { question: 'Which Use of English task does this collection cover?', answer: 'The tests practise Part 1 multiple-choice cloze: an original text has eight gaps, and you choose from four options for each gap. Each EnglishMeter test combines two such texts for a total of 16 questions. Other parts of the paper use different formats.' },
      { question: 'Are these official Cambridge English exam papers?', answer: 'No. The passages and questions are original EnglishMeter practice materials. They are not official exam papers, do not reproduce the full exam and do not award a qualification or an official exam score.' },
    ],
  },
};

function resolveCategory(categoryId: ExamPracticeCategory) {
  const category = getPracticeCategory(categoryId);
  if (!category) notFound();
  return category;
}

function resolveTest(categoryId: ExamPracticeCategory, slug: string) {
  const category = resolveCategory(categoryId);
  const test = getPracticeTest(category.id, slug.toLowerCase());
  if (!test) notFound();
  if (slug !== test.slug) permanentRedirect(getPracticeTestPath(test));
  return { category, test };
}

export function getExamCategoryMetadata(categoryId: ExamPracticeCategory) {
  const category = resolveCategory(categoryId);
  return buildSeoMetadata({
    title: CONTENT[categoryId].seoTitle,
    description: category.description,
    path: category.path,
  });
}

export function getExamTestStaticParams(categoryId: ExamPracticeCategory) {
  return getPracticeTests(categoryId).map((test) => ({ slug: test.slug }));
}

export function getExamTestMetadata(categoryId: ExamPracticeCategory, slug: string) {
  return getPracticeTestMetadata(resolveTest(categoryId, slug).test);
}

const linkClass = 'em-card block h-full rounded-xl border border-[rgb(var(--border))] p-4 hover:border-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500';

function MorePracticeLinks({ categoryId }: { categoryId: ExamPracticeCategory }) {
  const otherCategories = (Object.keys(CONTENT) as ExamPracticeCategory[])
    .filter((id) => id !== categoryId).map(resolveCategory);
  return (
    <nav aria-labelledby="more-practice-heading" className="mt-10 border-t border-[rgb(var(--border))] pt-6">
      <h2 id="more-practice-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">Continue your English practice</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {otherCategories.map((category) => (
          <li key={category.id}><Link href={category.path} className={linkClass}><span className="font-bold text-sky-800 dark:text-sky-200">{category.name}</span><span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">{category.description}</span></Link></li>
        ))}
        <li><Link href="/english-tests" className={linkClass}><span className="font-bold text-sky-800 dark:text-sky-200">Explore all English tests</span><span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">Find grammar, vocabulary, reading and exam preparation practice.</span></Link></li>
        <li><Link href="/grammar" className={linkClass}><span className="font-bold text-sky-800 dark:text-sky-200">Grammar by level and topic</span><span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">Strengthen the sentence patterns behind your answers.</span></Link></li>
      </ul>
    </nav>
  );
}

export function ExamPracticeCategoryPage({ categoryId }: { categoryId: ExamPracticeCategory }) {
  const category = resolveCategory(categoryId);
  const content = CONTENT[categoryId];
  const tests = getPracticeTests(category.id);
  const totalQuestions = tests.reduce((sum, test) => sum + test.questions.length, 0);

  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeCategoryStructuredData(category)) }} />
      <div className="mx-auto max-w-5xl">
        <PracticeBreadcrumbs items={getPracticeBreadcrumbs(category)} />
        <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-800 p-6 text-white shadow-lg sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-200">{content.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">{content.heading}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-sky-100">{content.introduction}</p>
          <ul aria-label="Collection details" className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <li className="rounded-full bg-white/15 px-4 py-2">{tests.length} free tests</li>
            <li className="rounded-full bg-white/15 px-4 py-2">{totalQuestions} questions</li>
            <li className="rounded-full bg-white/15 px-4 py-2">English explanations</li>
            <li className="rounded-full bg-white/15 px-4 py-2">No account needed</li>
          </ul>
          <a href="#choose-practice-test" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-sky-900 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300">Choose a test ↓</a>
        </header>

        <section aria-labelledby="practice-purpose-heading" className="em-card mt-8 rounded-2xl p-6 sm:p-8">
          <h2 id="practice-purpose-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">{content.purposeHeading}</h2>
          {content.purpose.map((paragraph) => <p key={paragraph} className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">{paragraph}</p>)}
          <p className="mt-4 rounded-xl bg-sky-50 p-4 leading-relaxed text-sky-950 dark:bg-sky-950 dark:text-sky-100">{content.format}</p>
        </section>

        <section id="choose-practice-test" aria-labelledby="practice-tests-heading" className="mt-10 scroll-mt-28">
          <h2 id="practice-tests-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose your practice test</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Each page includes learning goals, a short guide and worked examples. Choose a topic, study the examples or go straight to the test.</p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {tests.map((test, index) => (
              <li key={test.slug}><Link href={getPracticeTestPath(test)} className="em-card group flex h-full flex-col rounded-2xl border border-[rgb(var(--border))] p-5 transition hover:border-sky-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:p-6">
                <div className="flex items-center justify-between gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 font-black text-sky-800 dark:bg-sky-900 dark:text-sky-100">{String(index + 1).padStart(2, '0')}</span><span className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">{test.level} practice</span></div>
                <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 dark:text-slate-50">{test.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{test.description}</p>
                <p className="mt-auto pt-5 text-sm font-medium text-slate-600 dark:text-slate-300">{test.questions.length} questions · {test.duration} min{test.passages?.length ? ` · ${test.passages.length} texts` : ''}</p>
                <span className="mt-3 text-sm font-bold text-sky-800 group-hover:underline dark:text-sky-200">Study & start test →</span>
              </Link></li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="practice-study-heading" className="em-card mt-10 rounded-2xl p-6 sm:p-8">
          <h2 id="practice-study-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Make your practice count</h2>
          <ol className="mt-5 list-decimal space-y-4 pl-5 leading-relaxed text-slate-700 dark:text-slate-200">
            {content.tips.map((tip) => <li key={tip.title}><strong>{tip.title}.</strong> {tip.body}</li>)}
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{content.resultNote}</p>
        </section>

        <section aria-labelledby="practice-faq-heading" className="mt-10">
          <h2 id="practice-faq-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Common questions</h2>
          <div className="mt-5 space-y-3">
            {content.faqs.map((faq) => <details key={faq.question} className="em-card rounded-2xl border border-[rgb(var(--border))] p-5"><summary className="cursor-pointer font-bold leading-relaxed text-slate-900 dark:text-slate-50">{faq.question}</summary><p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-200">{faq.answer}</p></details>)}
          </div>
        </section>
        <MorePracticeLinks categoryId={categoryId} />
      </div>
    </main>
  );
}

export function ExamPracticeTestPage({ categoryId, slug }: { categoryId: ExamPracticeCategory; slug: string }) {
  const { category, test } = resolveTest(categoryId, slug);
  const examples = test.questions.slice(0, 3);
  const passages = test.passages?.filter((passage) => examples.some((question) => question.passageId === passage.id)) ?? [];
  const related = getPracticeTests(category.id).filter((other) => other.slug !== test.slug);
  const startHref = `/start?${new URLSearchParams({ testSlug: getPracticeTestSlug(test) })}`;

  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPracticeTestStructuredData(test)) }} />
      <div className="mx-auto max-w-3xl">
        <PracticeBreadcrumbs items={getPracticeBreadcrumbs(category, test)} />
        <header className="em-card rounded-3xl border border-[rgb(var(--border))] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">{category.name} · {test.level} practice</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{test.title}</h1>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{test.description}</p>
          <ul aria-label="Test details" className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <li className="rounded-full bg-sky-50 px-3 py-2 dark:bg-sky-950">{test.questions.length} questions</li>
            <li className="rounded-full bg-sky-50 px-3 py-2 dark:bg-sky-950">{test.duration}-minute practice timer</li>
            {test.passages?.length ? <li className="rounded-full bg-sky-50 px-3 py-2 dark:bg-sky-950">{test.passages.length} original texts</li> : null}
            <li className="rounded-full bg-sky-50 px-3 py-2 dark:bg-sky-950">Free · No account needed</li>
          </ul>
          <Link href={startHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-sky-800 px-6 py-3 text-center font-bold text-white shadow-sm hover:bg-sky-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:w-auto">Start {test.questions.length}-question test</Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">The test opens in timed Exam mode. Switch to Practice inside the test for untimed feedback, then review the explanation for every answer.</p>
        </header>

        <section aria-labelledby="test-goals-heading" className="em-card mt-8 rounded-2xl p-6 sm:p-8">
          <h2 id="test-goals-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">What you will practise</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-slate-700 dark:text-slate-200">{test.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
          {test.passages?.length ? <div className="mt-6 border-t border-[rgb(var(--border))] pt-5"><h3 className="font-bold text-slate-900 dark:text-slate-50">Texts in this test</h3><ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-200">{test.passages.map((passage) => <li key={passage.id}>{passage.title}</li>)}</ol><p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">The full text is included with each passage question during the test. For cloze questions, use the gap number in the question to locate the missing expression.</p></div> : null}
        </section>

        {test.guide?.length ? <section aria-labelledby="test-guide-heading" className="mt-8"><h2 id="test-guide-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Study guide before you start</h2><div className="mt-5 space-y-4">{test.guide.map((lesson) => <article key={lesson.heading} className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 sm:p-6"><h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{lesson.heading}</h3><p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-200">{lesson.body}</p><p className="mt-4 rounded-xl bg-sky-50 p-4 leading-relaxed text-sky-950 dark:bg-sky-950 dark:text-sky-100"><strong>Example: </strong>{lesson.example}</p></article>)}</div></section> : null}

        <section aria-labelledby="example-questions-heading" className="mt-8">
          <h2 id="example-questions-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">Example questions with answers</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Try the first three questions below, or start the full test before opening the answers. Each explanation shows why the answer fits.</p>
          {passages.map((passage) => <article key={passage.id} className="em-card mt-5 rounded-2xl border border-[rgb(var(--border))] p-5 sm:p-6"><h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{passage.title}</h3><p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">{passage.text}</p></article>)}
          <ol className="mt-5 list-decimal space-y-6 pl-6 text-slate-800 dark:text-slate-200">
            {examples.map((question) => <li key={question.id} className="break-words pl-1 leading-relaxed"><p className="whitespace-pre-line font-semibold">{question.prompt}</p><ul aria-label="Answer choices" className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option, index) => <li key={index} className="rounded-lg border border-[rgb(var(--border))] px-3 py-2"><span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>{option}</li>)}</ul><details className="mt-3 rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><summary className="cursor-pointer font-semibold text-sky-800 dark:text-sky-200">Show answer and explanation</summary><p className="mt-3"><strong>Answer: </strong>{question.options[question.correctIndex]}</p><p className="mt-2">{question.explanation}</p></details></li>)}
          </ol>
        </section>

        <section aria-labelledby="start-test-heading" className="mt-8 rounded-2xl bg-sky-950 p-6 text-white sm:p-8">
          <h2 id="start-test-heading" className="text-xl font-bold">Ready to practise?</h2>
          <p className="mt-3 leading-relaxed text-sky-100">Choose one answer per question. After finishing, review the explanations and make a note of the language you want to practise again.</p>
          <Link href={startHref} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-sky-900 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300">Start this practice test</Link>
          <p className="mt-4 text-sm leading-relaxed text-sky-100">{CONTENT[categoryId].resultNote}</p>
        </section>

        <nav aria-labelledby="related-tests-heading" className="mt-10"><h2 id="related-tests-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-50">More {category.name} practice</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((other) => <li key={other.slug}><Link href={getPracticeTestPath(other)} className={linkClass}><span className="font-bold text-sky-800 dark:text-sky-200">{other.title}</span><span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">{other.questions.length} questions · {other.level} · Explanations</span></Link></li>)}</ul></nav>
        <nav aria-label="Test navigation" className="mt-8 flex flex-wrap gap-3"><Link href={category.path} className={linkClass}>All {category.name} tests</Link><Link href={`/levels/${test.level.toLowerCase()}`} className={linkClass}>{test.level} grammar topics</Link><Link href="/english-tests" className={linkClass}>All English tests</Link></nav>
      </div>
    </main>
  );
}
