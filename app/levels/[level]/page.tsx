'use client'
import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function LevelPage() {
  const params = useParams()
  // params.level "A1", "B2" vb. değerini taşır
  const level = typeof params?.level === 'string' ? params.level.toUpperCase() : 'UNKNOWN';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="bg-blue-100 text-blue-700 font-bold text-xl w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
          {level}
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4">
          {level} Level Assessment
        </h1>
        
        <p className="text-slate-600 mb-8 text-lg">
          You are about to start the English assessment specifically designed for 
          <strong> {level}</strong> level. This test consists of grammar and vocabulary questions suitable for this difficulty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/start?testSlug=level-${level.toLowerCase()}`} 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1"
          >
            Start {level} Test
          </Link>

          <Link 
            href="/" 
            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-xl transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
