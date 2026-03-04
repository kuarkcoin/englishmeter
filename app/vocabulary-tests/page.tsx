import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/vocabulary';

export const metadata: Metadata = {
  title: 'Vocabulary Tests | Timed English word practice',
  description: 'Practice vocabulary with timed tests, flashcards, and exam-focused drills on EnglishMeter.',
  alternates: { canonical: `${SITE_URL}/vocabulary-tests` },
};

export default function VocabularyTestsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Vocabulary Tests</h1>
        <p className="text-slate-700 mb-8">Choose a practice mode and keep internal learning pathways connected across the vocabulary cluster.</p>
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
