'use client';
import React from 'react';

// Test definitions
const quickTest = { title: "Quick Placement Test", slug: "quick-placement" };
const megaTest = { title: "Grammar Mega Test (100Q)", slug: "grammar-mega-test-100" };
const vocabTest = { title: "Vocabulary B1-C1 (50Q)", slug: "vocab-b1-c1-50" };
const raceTest = { title: "Global Race Mode", href: "/race" };
 
// Grammar Focus topics (11 topics)
const grammarTests = [
  { title: "Perfect Tenses", slug: "test-perfect-past" },
  { title: "Conditionals", slug: "test-conditionals" },
  { title: "Relative Clauses", slug: "test-relatives" },
  { title: "Articles", slug: "test-articles" },
  { title: "Mixed Tenses", slug: "test-tenses-mixed" },
  { title: "Passive Voice (Adv)", slug: "test-passive-voice" },
  { title: "Reported Speech (Adv)", slug: "test-reported-speech" },
  { title: "Gerunds & Infinitives", slug: "test-gerunds-infinitives" },
  { title: "Noun/Adj/Adv Clauses", slug: "test-clauses-advanced" },
  { title: "Modal Verbs (Adv)", slug: "test-modals-advanced" },
  { title: "Prepositions (Adv)", slug: "test-prepositions-advanced" },
];

// CEFR Levels
const levelTests = [
  { level: "A1" }, { level: "A2" }, { level: "B1" },
  { level: "B2" }, { level: "C1" }, { level: "C2" },
];

// Helper: creates a new attempt and redirects to the real quiz
async function startTest(testSlug: string) {
  try {
    const res = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testSlug }),
    });

    if (!res.ok) throw new Error('Failed to create attempt');

    const data = await res.json();
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(data));
    window.location.href = `/quiz/${data.attemptId}`;
  } catch (err) {
    alert('Could not start the test. Please try again.');
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col items-center justify-center px-4 pb-24 pt-14">
        <div className="w-full max-w-6xl mx-auto text-center">

          {/* Main Tests + Race */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            <button
              onClick={() => startTest(quickTest.slug)}
              className="flex items-center justify-center px-6 py-8 rounded-2xl bg-blue-600 text-white text-xl font-bold shadow-xl hover:bg-blue-700 transition-all"
            >
              {quickTest.title}
            </button>

            <button
              onClick={() => startTest(megaTest.slug)}
              className="flex items-center justify-center px-6 py-8 rounded-2xl bg-purple-600 text-white text-xl font-bold shadow-xl hover:bg-purple-700 transition-all"
            >
              {megaTest.title}
            </button>

            <button
              onClick={() => startTest(vocabTest.slug)}
              className="flex items-center justify-center px-6 py-8 rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-xl hover:bg-emerald-700 transition-all"
            >
              {vocabTest.title}
            </button>

            <a
              href={raceTest.href}
              className="flex items-center justify-center px-6 py-8 rounded-2xl bg-red-600 text-white text-xl font-bold shadow-xl hover:bg-red-700 transition-all"
            >
              {raceTest.title}
            </a>
          </div>

          {/* Grammar Focus Section */}
          <div className="mb-20">
            <div className="flex items-center justify-center mb-8">
              <span className="bg-white px-8 py-3 rounded-full text-slate-500 font-bold text-sm border border-slate-200 uppercase tracking-wider">
                Grammar Focus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grammarTests.map((test) => (
                <button
                  key={test.slug}
                  onClick={() => startTest(test.slug)}
                  className="group px-4 py-5 rounded-xl bg-white text-indigo-700 font-bold shadow-sm border border-indigo-50 hover:border-indigo-300 hover:shadow-lg transition-all"
                >
                  <span className="block group-hover:scale-105 transition-transform">
                    {test.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* All Levels */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <span className="bg-white px-8 py-3 rounded-full text-slate-500 font-bold text-sm border border-slate-200 uppercase tracking-wider">
                All Levels
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {levelTests.map((test) => (
                <a
                  key={test.level}
                  href={`/levels/${test.level}`}
                  className="px-4 py-10 rounded-2xl bg-white text-slate-700 font-black text-3xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-xl transition-all"
                >
                  {test.level}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
