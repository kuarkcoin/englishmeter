import Link from 'next/link';
import ChallengeClient from '@/components/ChallengeClient';
import { buildSeoMetadata, serializeJsonLd, SITE_URL } from '@/lib/seo';

const description = 'Take the free Global English Challenge: 50 daily English grammar, vocabulary and reading questions in 40 minutes. See your net score and daily leaderboard rank.';

export const metadata = buildSeoMetadata({
  title: 'Global English Challenge – 50 Daily English Questions',
  description,
  path: '/challenge',
});

const faqs = [
  { question: 'What is the Global English Challenge?', answer: 'It is a free daily English test with 20 grammar questions, 20 vocabulary questions and 10 reading questions. You have 40 minutes to answer 50 questions, with five options for each question.' },
  { question: 'Do the questions change every day?', answer: 'Yes. A different set is selected from our question bank each day at midnight in the Europe/Istanbul time zone. Everyone who starts on the same day gets the same questions. Questions may return on a later day.' },
  { question: 'How is my net score calculated?', answer: 'Your net score is your number of correct answers minus one quarter of your incorrect answers. Unanswered questions do not lose points. For example, 40 correct, 8 incorrect and 2 unanswered gives a net score of 38.' },
  { question: 'How does the daily leaderboard work?', answer: 'After finishing, choose a nickname to publish your score. Higher net scores rank first; a shorter completion time breaks a score tie. Your first completed attempt in this browser each day is eligible. Further attempts are practice.' },
  { question: 'What happens if the date changes during my test?', answer: 'You still have the full 40 minutes. Your result belongs to the day on which you started, using the Europe/Istanbul time zone. The timer keeps running if you close or refresh the page.' },
];

export default function ChallengePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'LearningResource', '@id': `${SITE_URL}/challenge#challenge`, name: 'Global English Challenge — Daily 50', description, url: `${SITE_URL}/challenge`, inLanguage: 'en', isAccessibleForFree: true, learningResourceType: 'Practice test', educationalLevel: 'Beginner to advanced', timeRequired: 'PT40M', teaches: ['English grammar', 'English vocabulary', 'English reading comprehension'] },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Global English Challenge', item: `${SITE_URL}/challenge` }] },
      { '@type': 'FAQPage', mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    ],
  };
  return (
    <main className="em-page px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link href="/" className="font-semibold text-blue-700 dark:text-blue-300">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">Global English Challenge</span></nav>
        <header className="rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 p-6 text-white sm:p-9">
          <p className="font-bold uppercase tracking-widest text-indigo-200">Daily 50</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Global English Challenge</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-indigo-100">A fresh English challenge every day. Put your grammar, vocabulary and reading skills to the test, then see where you stand among the day’s participants.</p>
          <p className="mt-5 font-bold">50 questions · 40 minutes · 5 options per question</p>
        </header>

        <section aria-labelledby="challenge-rules-heading" className="em-card mt-6 rounded-2xl border border-[rgb(var(--border))] p-5 sm:p-6">
          <h2 id="challenge-rules-heading" className="text-xl font-bold">Before you start</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <li>20 grammar, 20 vocabulary and 10 reading questions, from beginner to advanced.</li>
            <li><strong>Net score = correct − incorrect ÷ 4.</strong> Blank answers score zero. A net score can be negative.</li>
            <li>Higher net scores rank first. A shorter completion time breaks a score tie.</li>
            <li>Choose your nickname after finishing. Your first completed attempt in this browser each day can enter the leaderboard; later attempts are practice.</li>
            <li>The daily set changes at midnight in <strong>Europe/Istanbul</strong>. A test started before midnight keeps its original day and full 40-minute limit.</li>
            <li>Answers save as you go. The timer keeps running when you leave. When time runs out, the last answers received before the deadline are scored.</li>
          </ul>
        </section>

        <ChallengeClient />

        <section aria-labelledby="challenge-faq-heading" className="mt-10">
          <h2 id="challenge-faq-heading" className="text-2xl font-bold">About the daily English challenge</h2>
          <div className="mt-4 space-y-3">
            {faqs.map(({ question, answer }) => <details key={question} className="em-card rounded-xl border border-[rgb(var(--border))] p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{answer}</p></details>)}
          </div>
          <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">This is an English practice challenge, not a certified proficiency exam. Build your skills with <Link href="/levels/a1" className="font-semibold text-blue-700 underline dark:text-blue-300">level-based grammar tests</Link> or <Link href="/practice/reading" className="font-semibold text-blue-700 underline dark:text-blue-300">reading practice</Link>.</p>
        </section>
      </div>
    </main>
  );
}
