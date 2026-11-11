import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import StudyHubStructuredData from '@/components/StudyHubStructuredData';

export const metadata: Metadata = buildSeoMetadata({
  "title": "English Vocabulary Tests",
  "description": "Practise everyday A1–A2 vocabulary, B1–C1 word formation and academic words with free English tests and answer explanations.",
  "path": "/vocabulary-tests"
});

export default function VocabularyTestsPage() {
  return (
    <main className="em-page py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <StudyHubStructuredData name="English vocabulary tests" path="/vocabulary-tests" description="Vocabulary tests in context, word formation and translated word-meaning practice." items={[
          { name: 'A1–A2 vocabulary in context', path: '/practice/vocabulary' },
          { name: 'B1–C1 word formation', path: '/practice/word-formation' },
          { name: 'B1–C1 vocabulary challenge', path: '/tests/vocab-b1-c1-50' },
          { name: 'Common phrasal verbs', path: '/levels/b1/common-phrasal-verbs' },
          { name: 'Daily English vocabulary', path: '/daily-english' },
          { name: 'YDS vocabulary mini tests', path: '/yds-5000-mini' },
        ]} />
        <h1 className="text-4xl font-black mb-4">Vocabulary Tests</h1>
        <p className="text-slate-700 dark:text-slate-300 mb-8">Build everyday vocabulary, learn new word forms or practise word meanings. Choose sentence-based tests to use words in context, or translated meaning tests to check recall.</p>
        <section aria-labelledby="vocabulary-topic-heading" className="mb-8">
          <h2 id="vocabulary-topic-heading" className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-50">Vocabulary in context</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/practice/vocabulary" className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 hover:border-blue-400"><strong>A1–A2 Thematic Vocabulary</strong><p className="mt-2 text-sm">Family, food, home, shopping, transport and weather. Six 20-question tests.</p></Link>
            <Link href="/practice/word-formation" className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 hover:border-blue-400"><strong>B1–C1 Word Formation</strong><p className="mt-2 text-sm">Practise word families, prefixes and suffixes with 20 questions at each level.</p></Link>
            <Link href="/tests/vocab-b1-c1-50" className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 hover:border-blue-400"><strong>B1–C1 Vocabulary Challenge</strong><p className="mt-2 text-sm">Compare meanings and word combinations in a longer 50-question practice set.</p></Link>
            <Link href="/levels/b1/common-phrasal-verbs" className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 hover:border-blue-400"><strong>Common Phrasal Verbs</strong><p className="mt-2 text-sm">Learn verb-and-particle meanings in context and practise object-pronoun placement.</p></Link>
          </div>
        </section>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link href="/yds-5000-mini" className="em-card border rounded-2xl p-5 hover:border-blue-400"><strong>YDS Vocabulary Mini Tests</strong><p className="text-sm mt-1">50-question sets with Turkish or other selected meaning languages.</p></Link>
          <Link href="/daily-english" className="em-card border rounded-2xl p-5 hover:border-blue-400"><strong>Daily English Word Lists and Quizzes</strong><p className="text-sm mt-1">Study everyday words with Turkish meanings, then test your recall.</p></Link>
          <Link href="/vocab-finish" className="em-card border rounded-2xl p-5 hover:border-blue-400"><strong>EN → TR Vocabulary Test</strong><p className="text-sm mt-1">Finish-anytime vocabulary workflow.</p></Link>
          <Link href="/vocab-es" className="em-card border rounded-2xl p-5 hover:border-blue-400"><strong>EN → ES Vocabulary Test</strong><p className="text-sm mt-1">Spanish meaning practice set.</p></Link>
          <Link href="/vocab-finish-ar" className="em-card border rounded-2xl p-5 hover:border-blue-400"><strong>EN → AR Vocabulary Test</strong><p className="text-sm mt-1">Arabic meaning practice set.</p></Link>
        </div>
        <section aria-labelledby="vocabulary-review-heading" className="em-card mb-8 rounded-2xl border border-[rgb(var(--border))] p-5">
          <h2 id="vocabulary-review-heading" className="text-2xl font-bold">Move from recognition to use</h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">Knowing a translation is a useful first step. Also learn the word form, its common word combinations and an example sentence. After a test, revisit unfamiliar words and make your own sentence before trying another set.</p>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link href="/vocabulary" className="em-card px-4 py-2 rounded-xl border">English–Turkish word reference</Link>
          <Link href="/english-tests" className="em-card px-4 py-2 rounded-xl border">All English tests</Link>
          <Link href="/flashcards" className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Flashcards</Link>
        </div>
      </div>
    </main>
  );
}
