import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/vocabulary';

export const metadata: Metadata = {
  title: 'Perfect Tenses Test | English grammar practice',
  description: 'Practice present, past, and future perfect tense usage with focused grammar drills.',
  alternates: { canonical: `${SITE_URL}/test-perfect-tenses` },
};

export default function TestPerfectTensesPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-3">Perfect tenses test practice</h1>
        <p className="text-slate-700 mb-6">Review timeline logic and tense consistency through focused perfect tense questions.</p>
        <Link href="/start?testSlug=test-perfect-past" className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold mb-8">Start perfect tenses test</Link>
        <div className="flex gap-3 flex-wrap text-sm">
          <Link href="/grammar" className="px-3 py-2 border rounded-lg">Grammar Hub</Link>
          <Link href="/test-conditionals" className="px-3 py-2 border rounded-lg">Conditionals</Link>
          <Link href="/test-relatives" className="px-3 py-2 border rounded-lg">Relative Clauses</Link>
        </div>
      </div>
    </main>
  );
}
