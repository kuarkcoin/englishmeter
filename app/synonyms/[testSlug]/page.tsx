import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ydsSynonyms from '@/data/yds_synonyms.json';

type PageProps = {
  params: { testSlug: string };
};

const TEST_COUNT = 10;
const QUESTIONS_PER_TEST = 50;

function parseTestSlug(testSlug: string): number | null {
  const match = testSlug.match(/^test-(\d+)$/);
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  if (!Number.isFinite(n) || n < 1 || n > TEST_COUNT) return null;
  return n;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const testNo = parseTestSlug(params.testSlug);
  if (!testNo) {
    return { title: 'Synonyms Test | EnglishMeter' };
  }

  return {
    title: `Synonyms Test ${testNo} | EnglishMeter`,
    description: `Start fixed Synonyms Test ${testNo} with up to 50 questions.`,
    alternates: { canonical: `/synonyms/test-${testNo}` },
  };
}

export default function SynonymsTestEntryPage({ params }: PageProps) {
  const testNo = parseTestSlug(params.testSlug);
  if (!testNo) notFound();

  const start = (testNo - 1) * QUESTIONS_PER_TEST;
  const total = (ydsSynonyms as any[]).length;
  const availableCount = Math.max(0, Math.min(QUESTIONS_PER_TEST, total - start));
  const available = availableCount > 0;

  if (!available) {
    return (
      <main className="em-page">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-black">Synonyms Test {testNo}</h1>
            <p className="mt-2 text-[rgb(var(--muted))]">Coming Soon</p>
            <Link href="/synonyms" className="mt-5 inline-block text-blue-600 font-bold hover:underline">
              ← Back to Synonyms Hub
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const testSlug = `yds-synonyms-test-${testNo}`;

  return (
    <main className="em-page">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-black">Synonyms Test {testNo}</h1>
          <p className="mt-2 text-[rgb(var(--muted))]">
            Fixed chunk: items {start}-{start + QUESTIONS_PER_TEST - 1} · {availableCount} questions.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/start?testSlug=${testSlug}`}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 font-bold hover:bg-blue-700 transition-colors"
            >
              Start Synonyms Test {testNo}
            </Link>
            <Link href="/synonyms" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-bold hover:bg-slate-50">
              Back to Hub
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
