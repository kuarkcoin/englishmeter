'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DiamondCard from '@/components/DiamondCard';
import { ADVANCED_TEST_CATALOG, ADVANCED_QUESTION_RANGE } from '@/lib/advanced-tests';

type ProgressItem = { best: number; last: number; updatedAt: string };
type ProgressMap = Record<string, ProgressItem>;

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

export default function AdvancedTestsPage() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('em_adv_progress_v1') || '{}');
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) setProgress(parsed);
    } catch {
      setProgress({});
    }
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e1b4b_0%,_#0f172a_35%,_#020617_100%)] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DiamondCard className="p-6 md:p-8 bg-white/10 border-white/20 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-200 font-bold">Free advanced practice</p>
              <h1 className="text-3xl md:text-4xl font-black mt-2">Advanced English Tests</h1>
              <p className="text-sm md:text-base text-slate-200 mt-2">
                {ADVANCED_TEST_CATALOG.length} mixed grammar and vocabulary tests · {ADVANCED_QUESTION_RANGE} questions · 45 min · B2–C1
              </p>
            </div>
            <Link href="/" className="rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 px-4 py-2 text-sm font-bold">
              ← Back Home
            </Link>
          </div>
        </DiamondCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ADVANCED_TEST_CATALOG.map((test) => {
            const saved = progress[test.id];
            return (
              <Link
                key={test.id}
                href={`/?restart=adv-test-${test.id}`}
                className="text-left rounded-2xl border p-5 shadow-xl bg-gradient-to-br from-indigo-600/80 via-violet-600/80 to-fuchsia-600/80 border-indigo-300/30 hover:-translate-y-1 hover:shadow-indigo-500/30 transition-all"
              >
                <span className="text-xs font-bold uppercase px-2 py-1 rounded-full bg-black/20 border border-white/20">Mixed practice</span>
                <h2 className="mt-4 text-2xl font-black">Advanced Test {test.id}</h2>
                <p className="text-xs text-white/85 mt-2">{test.questionCount} questions · {test.duration} min · B2–C1</p>
                <div className="mt-4 space-y-1 text-xs text-white/90">
                  <p>Best: {saved ? `${saved.best}/${test.questionCount}` : 'Not taken'}</p>
                  <p>Last: {saved ? `${saved.last}/${test.questionCount}` : 'Not taken'}</p>
                  <p className="text-white/70">Updated: {formatDate(saved?.updatedAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
