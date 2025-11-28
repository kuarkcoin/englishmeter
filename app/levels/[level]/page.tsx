
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { a1Topics } from '@/data/levels/a1_topics';

type RouteParams = {
  level?: string | string[];
};

export default function LevelPage() {
  const params = useParams() as RouteParams;
  const levelParam = Array.isArray(params.level) ? params.level[0] : params.level || '';
  const level = levelParam.toUpperCase();

  const isA1 = level === 'A1';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          {level} Level Grammar Tests
        </h1>

        <p className="text-slate-600 mb-6">
          Practise key grammar structures for level {level}. Start a complete mixed test
          or choose a specific topic.
        </p>

        {/* A1 için özel: Mixed Test + Topic butonları */}
        {isA1 && (
          <>
            {/* A1 Mixed Test butonu */}
            <div className="mb-8">
              <Link
                href="/start?testSlug=level-a1"
                className="block w-full text-center bg-slate-900 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-slate-800"
              >
                ⭐ Start A1 Mixed Test
              </Link>
            </div>

            {/* Topic-based tests */}
            <h2 className="text-xl font-bold text-slate-900 mb-3">Topic-Based Tests</h2>
            <div className="space-y-3 mb-8">
              {a1Topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/levels/a1/${topic.slug}`}
                  className={`block w-full text-center py-4 rounded-2xl border font-semibold
                    ${topic.colorClass ?? 'bg-blue-50 border-blue-100 text-blue-800'}
                  `}
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Diğer seviyeler: sadece mixed test butonu */}
        {!isA1 && (
          <div className="mb-8">
            <Link
              href={`/start?testSlug=level-${level.toLowerCase()}`}
              className="block w-full text-center bg-slate-900 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-slate-800"
            >
              Start {level} Mixed Test
            </Link>
          </div>
        )}

        <Link
          href="/"
          className="text-sm text-slate-600 hover:underline inline-flex items-center"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
