import Link from 'next/link';
import type { Metadata } from 'next';
import ydsSynonyms from '@/data/yds_synonyms.json';

const TEST_COUNT = 10;
const QUESTIONS_PER_TEST = 50;

export const metadata: Metadata = {
  title: 'Synonyms Tests | EnglishMeter',
  description: 'Choose a fixed Synonyms test. Each test loads a consistent 50-question set.',
  alternates: { canonical: '/synonyms' },
};

export default function SynonymsHubPage() {
  const total = (ydsSynonyms as any[]).length;

  return (
    <main className="em-page">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-black mb-2">Synonyms Hub</h1>
        <p className="text-[rgb(var(--muted))] mb-8">
          10 fixed tests. Every test always serves the same question range.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: TEST_COUNT }, (_, i) => {
            const testNo = i + 1;
            const start = i * QUESTIONS_PER_TEST;
            const availableCount = Math.max(0, Math.min(QUESTIONS_PER_TEST, total - start));
            const available = availableCount > 0;

            return (
              <article
                key={testNo}
                className={`rounded-2xl border p-5 shadow-sm ${
                  available
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <h2 className="text-xl font-black">Synonyms Test {testNo}</h2>
                <p className="text-sm text-[rgb(var(--muted))] mt-1">Question count: {availableCount}/50</p>
                <p className="text-sm font-semibold mt-2">{available ? 'Available' : 'Coming Soon'}</p>

                {available ? (
                  <Link
                    href={`/synonyms/test-${testNo}`}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-4 py-2 font-bold hover:bg-blue-700 transition-colors"
                  >
                    Open Test {testNo}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-200 text-slate-500 px-4 py-2 font-bold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
