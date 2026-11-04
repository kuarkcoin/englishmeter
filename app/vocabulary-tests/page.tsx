import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = buildSeoMetadata({
  "title": "English Vocabulary Tests",
  "description": "Practise everyday A1–A2 vocabulary, B1–C1 word formation and academic words with free English tests and answer explanations.",
  "path": "/vocabulary-tests"
});

export default function VocabularyTestsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Vocabulary Tests</h1>
        <p className="text-slate-700 mb-8">Build everyday vocabulary, learn new word forms or practise word meanings. Choose a topic and review the explanation for each answer.</p>
        <section aria-labelledby="vocabulary-topic-heading" className="mb-8">
          <h2 id="vocabulary-topic-heading" className="mb-4 text-2xl font-bold text-slate-900">Vocabulary in context</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/practice/vocabulary" className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 hover:border-blue-400"><strong>A1–A2 Thematic Vocabulary</strong><p className="mt-2 text-sm">Family, food, home, shopping, transport and weather. Six 20-question tests.</p></Link>
            <Link href="/practice/word-formation" className="em-card rounded-2xl border border-[rgb(var(--border))] p-5 hover:border-blue-400"><strong>B1–C1 Word Formation</strong><p className="mt-2 text-sm">Practise word families, prefixes and suffixes with 20 questions at each level.</p></Link>
          </div>
        </section>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link href="/yds-3750" className="bg-white border rounded-2xl p-5 hover:border-blue-400"><strong>YDS 3750 Pack</strong><p className="text-sm mt-1">Mini tests for exam vocabulary retention.</p></Link>
          <Link href="/vocab-finish" className="bg-white border rounded-2xl p-5 hover:border-blue-400"><strong>EN → TR Vocabulary Test</strong><p className="text-sm mt-1">Finish-anytime vocabulary workflow.</p></Link>
          <Link href="/vocab-es" className="bg-white border rounded-2xl p-5 hover:border-blue-400"><strong>EN → ES Vocabulary Test</strong><p className="text-sm mt-1">Spanish meaning practice set.</p></Link>
          <Link href="/vocab-finish-ar" className="bg-white border rounded-2xl p-5 hover:border-blue-400"><strong>EN → AR Vocabulary Test</strong><p className="text-sm mt-1">Arabic meaning practice set.</p></Link>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/vocabulary" className="px-4 py-2 rounded-xl border bg-white">Vocabulary Hub</Link>
          <Link href="/flashcards" className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Flashcards</Link>
        </div>
      </div>
    </main>
  );
}
