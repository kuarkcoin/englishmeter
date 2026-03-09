import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/vocabulary';

export const metadata: Metadata = {
  title: 'English Grammar Practice Hub | Tests by topic',
  description: 'Practice English grammar by topic including conditionals, perfect tenses, and relative clauses.',
  alternates: { canonical: `${SITE_URL}/grammar` },
};

export default function GrammarHubPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Grammar Cluster Hub</h1>
        <p className="mb-8 text-slate-700">Use these grammar landing pages, then jump into each test flow.</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link href="/test-conditionals" className="bg-white border rounded-2xl p-5 hover:border-blue-400">Conditionals</Link>
          <Link href="/test-perfect-tenses" className="bg-white border rounded-2xl p-5 hover:border-blue-400">Perfect Tenses</Link>
          <Link href="/test-relatives" className="bg-white border rounded-2xl p-5 hover:border-blue-400">Relative Clauses</Link>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/" className="px-4 py-2 rounded-xl border bg-white">Homepage Tests</Link>
          <Link href="/levels/B1" className="px-4 py-2 rounded-xl border bg-white">Level Pages</Link>
        </div>
      </div>
    </main>
  );
}
