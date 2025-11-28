'use client'
import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const A1_TOPICS = [
  { slug: 'present-simple', label: 'Present Simple (daily routines)' },
  { slug: 'verb-to-be', label: 'Verb “to be” (am / is / are)' },
  { slug: 'a-an', label: 'Articles: a / an' },
  { slug: 'this-that-these-those', label: 'This / That / These / Those' },
  { slug: 'prepositions-of-place', label: 'Prepositions of place' },
  { slug: 'possessive-adjectives', label: 'Possessive adjectives (my/your/our)' },
]

export default function LevelPage() {
  const params = useParams()
  const rawLevel = typeof params?.level === 'string' ? params.level : ''
  const level = rawLevel.toUpperCase() || 'UNKNOWN'
  const testSlug = `level-${level.toLowerCase()}`
  const isA1 = level === 'A1'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="bg-blue-100 text-blue-700 font-bold text-xl w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
          {level}
        </div>

        <h1 className="text-3xl font-extrabold text-slate-800 mb-4">
          {isA1 ? 'A1 Mixed Test' : `${level} Level Assessment`}
        </h1>

        <p className="text-slate-600 mb-8 text-lg">
          {isA1 ? (
            <>
              You are about to start the main <strong>A1 mixed grammar test</strong>{' '}
              with 20 questions. After this, you can practise each topic separately
              with short quizzes.
            </>
          ) : (
            <>
              You are about to start the English assessment specifically designed for
              <strong> {level}</strong> level. This test consists of grammar and
              vocabulary questions suitable for this difficulty.
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Link
            href={`/start?testSlug=${testSlug}`}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1"
          >
            {isA1 ? 'Start A1 Mixed Test' : `Start ${level} Test`}
          </Link>

          <Link
            href="/"
            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-xl transition"
          >
            Back to Home
          </Link>
        </div>

        {/* SADECE A1 İÇİN ALTTA KONU BUTONLARI */}
        {isA1 && (
          <div className="mt-6 pt-5 border-t border-slate-200 text-left">
            <h2 className="text-xl font-semibold mb-2 text-slate-800 text-center sm:text-left">
              Practise A1 topics after the mixed test
            </h2>
            <p className="text-sm text-slate-600 mb-4 text-center sm:text-left">
              Each topic has a short 10-question quiz so you can fix your weak areas.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              {A1_TOPICS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/levels/a1/${t.slug}`}
                  className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
