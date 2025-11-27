'use client';
import React from 'react';
import topicQuestions from '@/data/grammar_topic_tests.json'; // Grammar topic soruların

// Test tanımlamaları
const quickTest = { title: 'Quick Placement Test', slug: 'quick-placement' };
const megaTest = { title: 'Grammar Mega Test (100Q)', slug: 'grammar-mega-test-100' };
const vocabTest = { title: 'Vocabulary B1-C1 (50Q)', slug: 'vocab-b1-c1-50' };
const raceTest = { title: 'Global Race Mode', href: '/race' };

const grammarTests = [
  { title: 'Perfect Tenses', slug: 'test-perfect-past' },
  { title: 'Conditionals', slug: 'test-conditionals' },
  { title: 'Relative Clauses', slug: 'test-relatives' },
  { title: 'Articles', slug: 'test-articles' },
  { title: 'Mixed Tenses', slug: 'test-tenses-mixed' },
  { title: 'Passive Voice (Adv)', slug: 'test-passive-voice' },
  { title: 'Reported Speech (Adv)', slug: 'test-reported-speech' },
  { title: 'Gerunds & Infinitives', slug: 'test-gerunds-infinitives' },
  { title: 'Noun/Adj/Adv Clauses', slug: 'test-clauses-advanced' },
  { title: 'Modal Verbs (Adv)', slug: 'test-modals-advanced' },
  { title: 'Prepositions (Adv)', slug: 'test-prepositions-advanced' },
];

const levelTests = [
  { level: 'A1' },
  { level: 'A2' },
  { level: 'B1' },
  { level: 'B2' },
  { level: 'C1' },
  { level: 'C2' },
];

// Grammar Focus slug → JSON içindeki tag
const slugToTag: Record<string, string> = {
  'test-perfect-past': 'perfect_tenses',
  'test-conditionals': 'conditionals',
  'test-relatives': 'relative_clauses',
  'test-articles': 'articles',
  'test-tenses-mixed': 'mixed_tenses',
  'test-passive-voice': 'passive_voice_adv',
  'test-reported-speech': 'reported_speech',
  'test-gerunds-infinitives': 'gerunds_infinitives',
  'test-clauses-advanced': 'clauses_advanced',
  'test-modals-advanced': 'modals_advanced',
  'test-prepositions-advanced': 'prepositions_advanced',
};

// ANA FONKSİYON
async function startTest(testSlug: string) {
  // 1) GRAMMAR FOCUS → DOĞRUDAN JSON'DAN /quiz'E GİTSİN
  if (slugToTag[testSlug]) {
    const attemptId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payload: any = {
      attemptId,
      testSlug,
      test: { title: 'Practice Test', duration: 30 },
      questions: [],
    };

    // Başlık ayarla
    const grammarTitle = grammarTests.find((t) => t.slug === testSlug)?.title;
    if (grammarTitle) {
      payload.test.title = `${grammarTitle.toUpperCase()} TEST`;
    }

    const tag = slugToTag[testSlug];

    const rawQuestions = (topicQuestions as any[])
      .filter((q: any) => q.tags?.includes(tag))
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);

    const mappedQuestions = rawQuestions.map((q: any, idx: number) => ({
      id: `${testSlug}-q${idx + 1}`,
      prompt: q.prompt,
      choices: [
        { id: 'A', text: q.A },
        { id: 'B', text: q.B },
        { id: 'C', text: q.C },
        { id: 'D', text: q.D },
      ],
      correct: q.correct,
      explanation: q.explanation || '',
    }));

    payload.questions = mappedQuestions;

    // Quiz'e yönlendir
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 2) DİĞER TESTLER (Quick, Mega, Vocab) → /start ROUTE'U KULLANSIN
  window.location.href = `/start?testSlug=${testSlug}`;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="w-full max-w-6xl mx-auto px-4 pt-10 pb-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
              EnglishMeter · FREE ENGLISH TESTS
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 leading-tight">
              Find your English level
              <span className="text-blue-600"> in minutes.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mb-5">
              Online English grammar tests, CEFR level quizzes (A1–C2) and quick placement exams
              with instant results and detailed review.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => startTest(quickTest.slug)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm sm:text-base shadow-md hover:bg-blue-700 transition"
              >
                Start placement test
              </button>
              <a
                href="#all-tests"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base bg-white hover:bg-slate-50 transition"
              >
                Browse all tests
              </a>
            </div>
          </div>

          {/* Right: simple card illustration */}
          <div className="hidden md:block">
            <div className="relative mx-auto max-w-sm">
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-500 p-6 shadow-2xl text-white">
                <div className="text-sm font-semibold opacity-80 mb-2">Sample result</div>
                <div className="text-4xl font-black mb-1">B2</div>
                <div className="text-sm opacity-90 mb-4">Upper-Intermediate · 78% accuracy</div>
                <div className="w-full h-2 rounded-full bg-blue-300/40 mb-3 overflow-hidden">
                  <div className="h-full w-3/4 bg-white/90 rounded-full" />
                </div>
                <p className="text-xs opacity-90">
                  Take a 20–50 question test and instantly see your estimated CEFR level, score and
                  explanations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT (senin mevcut gridlerin) */}
      <div className="flex flex-col items-center justify-center px-4 pb-24 pt-4">
        <div id="all-tests" className="w-full max-w-6xl mx-auto text-center">
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

          {/* Grammar Focus */}
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