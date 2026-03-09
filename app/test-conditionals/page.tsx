import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/vocabulary';

export const metadata: Metadata = {
  title: 'Conditionals Test | English grammar practice',
  description: 'Practice English conditionals with a focused grammar test and internal learning links.',
  alternates: { canonical: `${SITE_URL}/test-conditionals` },
};

export default function TestConditionalsPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-3">Conditionals test practice</h1>
        <p className="text-slate-700 mb-6">Strengthen zero, first, second, and third conditional structures with targeted test practice.</p>
        <Link href="/start?testSlug=test-conditionals" className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold mb-8">Start conditionals test</Link>
        <div className="flex gap-3 flex-wrap text-sm">
          <Link href="/grammar" className="px-3 py-2 border rounded-lg">Grammar Hub</Link>
          <Link href="/test-perfect-tenses" className="px-3 py-2 border rounded-lg">Perfect Tenses</Link>
          <Link href="/test-relatives" className="px-3 py-2 border rounded-lg">Relative Clauses</Link>
        </div>
      </div>
    </main>
  );
}
