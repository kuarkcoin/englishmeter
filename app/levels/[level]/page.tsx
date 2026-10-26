import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { buildSeoMetadata } from '@/lib/seo';

import { a1Topics } from '@/data/levels/a1_topics';
import { a2Topics } from '@/data/levels/a2_topics';
import { b1Topics } from '@/data/levels/b1_topics';
import { b2Topics } from '@/data/levels/b2_topics';
import { c1Topics } from '@/data/levels/c1_topics';
import { c2Topics } from '@/data/levels/c2_topics';

type PageProps = { params: { level: string } };

function getLevel(value: string) {
  const level = value.toLowerCase();
  if (!/^(?:a1|a2|b1|b2|c1|c2)$/.test(level)) notFound();
  if (value !== level) permanentRedirect(`/levels/${level}`);
  return level.toUpperCase();
}

export function generateStaticParams() {
  return ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].map((level) => ({ level }));
}

export function generateMetadata({ params }: PageProps) {
  const level = getLevel(params.level);
  return buildSeoMetadata({
    title: `${level} English Grammar Tests and Practice`,
    description: `Practise ${level} English grammar with a mixed level test and topic quizzes. Choose a grammar point, answer questions and check your progress.`,
    path: `/levels/${level.toLowerCase()}`,
  });
}

export default function LevelPage({ params }: PageProps) {
  const level = getLevel(params.level);

  const isA1 = level === 'A1';
  const isA2 = level === 'A2';
  const isB1 = level === 'B1';
  const isB2 = level === 'B2';
  const isC1 = level === 'C1';
  const isC2 = level === 'C2';

  // hangi levele hangi topic listesi
  const topics =
    isA1 ? a1Topics :
    isA2 ? a2Topics :
    isB1 ? b1Topics :
    isB2 ? b2Topics :
    isC1 ? c1Topics :
    isC2 ? c2Topics :
    [];

  const hasTopics = topics.length > 0;

  const mixedTestSlug = `level-${level.toLowerCase()}`; // level-a1, level-c2 vs.

  return (
    <div className="em-page py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
          {level} Level Grammar Tests
        </h1>

        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Practise key grammar structures for level {level}. Start a complete mixed test
          or choose a specific topic.
        </p>

        {/* Mixed Test butonu */}
        <div className="mb-8">
          <Link
            href={`/start?testSlug=${mixedTestSlug}`}
            className="block w-full text-center bg-slate-900 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-slate-800"
          >
            {isA1 && '⭐ Start A1 Mixed Test'}
            {isA2 && '⭐ Start A2 Mixed Test'}
            {isB1 && '⭐ Start B1 Mixed Test'}
            {isB2 && '⭐ Start B2 Mixed Test'}
            {isC1 && '⭐ Start C1 Mixed Test'}
            {isC2 && '⭐ Start C2 Mixed Test'}
            {!isA1 && !isA2 && !isB1 && !isB2 && !isC1 && !isC2 && `Start ${level} Mixed Test`}
          </Link>
        </div>

        {/* Topic-based tests */}
        {hasTopics && (
          <>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              Topic-Based Tests ({level})
            </h2>
            <div className="space-y-3 mb-8">
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/levels/${level.toLowerCase()}/${topic.slug}`}
                  className="block w-full text-center py-4 rounded-2xl border font-semibold bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100">Explore other CEFR levels</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-sm mb-4">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <Link
                key={lvl}
                href={`/levels/${lvl.toLowerCase()}`}
                className="text-center py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400"
              >
                {lvl}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="text-sm text-slate-600 dark:text-slate-300 hover:underline inline-flex items-center"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
