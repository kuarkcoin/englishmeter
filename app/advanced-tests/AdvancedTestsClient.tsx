'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DiamondCard from '@/components/DiamondCard';

type FilterType = 'all' | 'grammar' | 'vocabulary' | 'error';

type ProgressItem = {
  best: number;
  last: number;
  updatedAt: string;
};

type ProgressMap = Record<string, ProgressItem>;

const LS_ADV_PROGRESS = 'em_adv_progress_v1';
const LS_PREMIUM = 'em_is_premium';

const filters: Array<{ id: FilterType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'grammar', label: 'Grammar Focus' },
  { id: 'vocabulary', label: 'Vocabulary Focus' },
  { id: 'error', label: 'Error Spotting' },
];

const tests = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  let category: FilterType = 'error';
  if (n <= 4) category = 'grammar';
  else if (n <= 7) category = 'vocabulary';

  return {
    n,
    category,
    locked: false,
  };
});

function formatDate(value?: string) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
}

export default function AdvancedTestsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(LS_ADV_PROGRESS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setProgress(parsed);
      }
    } catch {
      setProgress({});
    }

    const premiumRaw = localStorage.getItem(LS_PREMIUM);
    setIsPremium(premiumRaw === '1' || premiumRaw === 'true');
  }, []);

  const visibleTests = useMemo(() => {
    if (filter === 'all') return tests;
    return tests.filter((t) => t.category === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e1b4b_0%,_#0f172a_35%,_#020617_100%)] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DiamondCard className="p-6 md:p-8 bg-white/10 border-white/20 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-200 font-bold">Premium Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-black mt-2">Advanced English Tests</h1>
              <p className="text-sm md:text-base text-slate-200 mt-2">10 curated tests · 50 questions each · 45 min · B2–C1</p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 px-4 py-2 text-sm font-bold transition"
            >
              ← Back Home
            </Link>
          </div>
        </DiamondCard>
      </div>

      <div className="sticky top-0 z-20 border-y border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                filter === item.id
                  ? 'bg-indigo-500 text-white border-indigo-300'
                  : 'bg-white/5 text-slate-200 border-white/20 hover:bg-white/15'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleTests.map((test) => {
          const p = progress[String(test.n)];
          const locked = test.locked && !isPremium;
          const categoryLabel =
            test.category === 'grammar' ? 'Grammar Focus' : test.category === 'vocabulary' ? 'Vocabulary Focus' : 'Error Spotting';

          return (
            <button
              key={test.n}
              type="button"
              onClick={() => {
                if (locked) {
                  alert('Premium required (demo)');
                  return;
                }
                router.push(`/?restart=adv-test-${test.n}`);
              }}
              className={`text-left rounded-2xl border p-5 shadow-xl transition-all ${
                locked
                  ? 'bg-slate-800/60 border-slate-600/60 opacity-70 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-600/80 via-violet-600/80 to-fuchsia-600/80 border-indigo-300/30 hover:-translate-y-1 hover:shadow-indigo-500/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase px-2 py-1 rounded-full bg-black/20 border border-white/20">{categoryLabel}</span>
                {locked && <span className="text-xs font-black px-2 py-1 rounded-full bg-amber-300 text-slate-900">🔒 Premium</span>}
              </div>

              <h2 className="mt-4 text-2xl font-black">Advanced Test {test.n}</h2>
              <p className="text-xs text-white/85 mt-2">50 questions · 45 min · B2–C1</p>

              <div className="mt-4 space-y-1 text-xs text-white/90">
                <p>Best: {p?.best ?? 0}/50</p>
                <p>Last: {p?.last ?? 0}/50</p>
                <p className="text-white/70">Updated: {formatDate(p?.updatedAt)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
