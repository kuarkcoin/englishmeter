import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/vocabulary';

export const metadata: Metadata = {
  title: 'Relative Clauses Test | English grammar practice',
  description: 'Practice defining and non-defining relative clauses with structured English grammar questions.',
  alternates: { canonical: `${SITE_URL}/test-relatives` },
};

export default function TestRelativesPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-3">Relative clauses test practice</h1>
        <p className="text-slate-700 mb-6">Improve sentence linking and clause reduction skills with focused relative clause drills.</p>
        <Link href="/start?testSlug=test-relatives" className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold mb-8">Start relative clauses test</Link>
        <div className="flex gap-3 flex-wrap text-sm">
          <Link href="/grammar" className="px-3 py-2 border rounded-lg">Grammar Hub</Link>
          <Link href="/test-conditionals" className="px-3 py-2 border rounded-lg">Conditionals</Link>
          <Link href="/test-perfect-tenses" className="px-3 py-2 border rounded-lg">Perfect Tenses</Link>
        </div>
      </div>
    </main>
  );
}
