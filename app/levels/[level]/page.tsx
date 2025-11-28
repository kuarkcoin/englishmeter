'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LevelPage() {
  const params = useParams();
  const level = typeof params?.level === 'string' ? params.level.toUpperCase() : 'UNKNOWN';

  // Sadece A1 için konuları gösteriyoruz (diğer seviyeler eklenebilir)
  const topics =
    level === 'A1'
      ? [
          { slug: 'present-simple', title: 'Present Simple', color: 'bg-blue-100 text-blue-800 border-blue-300' },
          { slug: 'prepositions', title: 'Prepositions', color: 'bg-green-100 text-green-800 border-green-300' },
          { slug: 'articles', title: 'Articles (a/an/the)', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
          { slug: 'pronouns', title: 'Pronouns', color: 'bg-purple-100 text-purple-800 border-purple-300' },
          { slug: 'adjectives', title: 'Adjectives', color: 'bg-pink-100 text-pink-800 border-pink-300' },
          { slug: 'adverbs', title: 'Adverbs', color: 'bg-orange-100 text-orange-800 border-orange-300' },
        ]
      : [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* Level Badge */}
        <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold mb-6 shadow-inner">
          {level}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-slate-800 mb-4">
          {level} Level Grammar Tests
        </h1>

        <p className="text-center text-slate-600 mb-8 text-lg">
          Improve your English skills with topic-based grammar quizzes and a complete mixed test for level {level}.
        </p>

        {/* Mixed Test Button */}
        <Link
          href={`/start?testSlug=level-${level.toLowerCase()}`}
          className="block w-full text-center px-6 py-4 rounded-xl bg-slate-800 text-white font-bold text-lg shadow hover:bg-slate-900 transition mb-10"
        >
          ⭐ Start {level} Mixed Test
        </Link>

        {/* Topic Buttons */}
        {topics.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Topic-Based Tests</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/levels/${level.toLowerCase()}/${t.slug}`}
                  className={`border rounded-xl p-5 font-semibold text-center shadow-sm hover:shadow-md transition ${t.color}`}
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Back Home */}
        <Link
          href="/"
          className="block text-center mt-10 text-slate-600 hover:text-slate-900 underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
