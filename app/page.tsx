'use client';

import React from 'react';
// 1. Gramer konuları
import topicQuestions from '@/data/grammar_topic_tests.json';
// 2. YDS Kelime Listesi
import ydsVocabulary from '@/data/yds_vocabulary.json';
// 3. YENİ: YDS Gramer Soruları
import ydsGrammarQuestions from '@/data/yds_grammar.json';

// --- TEST TANIMLARI ---
const quickTest = { title: 'Quick Placement Test', slug: 'quick-placement' };
const megaTest = { title: 'Grammar Mega Test (100Q)', slug: 'grammar-mega-test-100' };
const vocabTest = { title: 'Vocabulary B1-C1 (50Q)', slug: 'vocab-b1-c1-50' };
const raceTest = { title: 'Global Race Mode', href: '/race' };
const ieltsTest = { title: 'IELTS Grammar (50Q)', slug: 'ielts-grammar' };

// --- YDS GRUBU ---
const ydsVocabTest = { title: 'YDS 1000 Words (Vocab)', slug: 'yds-1000-vocab' };
const ydsGrammarTest = { title: 'YDS Grammar Practice', slug: 'yds-grammar-practice' }; // YENİ

// Grammar Focus testleri
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
  { level: 'A1' }, { level: 'A2' }, { level: 'B1' }, { level: 'B2' }, { level: 'C1' }, { level: 'C2' },
];

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

// --- TEST BAŞLATMA MANTIĞI ---
function startTest(testSlug: string) {
  const attemptId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 1. YDS KELİME TESTİ
  if (testSlug === 'yds-1000-vocab') {
    const shuffledList = [...(ydsVocabulary as any[])].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledList.slice(0, 50);

    const questions = selectedWords.map((item, idx) => {
      const correctAnswer = item.meaning;
      const distractors = (ydsVocabulary as any[])
        .filter((w) => w.meaning !== correctAnswer)
        .map((w) => w.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allOptions = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
      const idsLower = ['a', 'b', 'c', 'd'];

      return {
        id: `yds-vocab-q${idx + 1}`,
        prompt: `What is the Turkish meaning of **"${item.word}"**?`,
        choices: allOptions.map((optText, i) => ({
          id: idsLower[i],
          text: optText,
          isCorrect: optText === correctAnswer
        })),
        explanation: `**${item.word}**: ${correctAnswer}`
      };
    });

    const payload = {
      attemptId,
      testSlug,
      test: { title: 'YDS 1000 WORDS (VOCABULARY)', duration: 40 },
      questions: questions,
    };
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 2. YDS GRAMMAR TESTİ (YENİ EKLENEN KISIM)
  if (testSlug === 'yds-grammar-practice') {
    // JSON'dan soruları al ve karıştır
    const shuffledQuestions = [...(ydsGrammarQuestions as any[])].sort(() => 0.5 - Math.random());
    // İlk 20 soruyu seç (Şimdilik havuz küçükse hepsini alır)
    const selectedQuestions = shuffledQuestions.slice(0, 50);

    const mappedQuestions = selectedQuestions.map((q: any, idx: number) => {
      const correctLetter = String(q.correct || 'A').trim().toUpperCase();
      const letters = ['A', 'B', 'C', 'D'];
      const idsLower = ['a', 'b', 'c', 'd'];

      return {
        id: `yds-grammar-q${idx + 1}`,
        prompt: q.prompt,
        choices: letters.map((L, i) => ({
          id: idsLower[i],
          text: q[L] || `Option ${L}`,
          isCorrect: correctLetter === L,
        })),
        explanation: q.explanation || '',
      };
    });

    const payload = {
      attemptId,
      testSlug,
      test: { title: 'YDS GRAMMAR PRACTICE', duration: 50 },
      questions: mappedQuestions,
    };
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 3. QUICK PLACEMENT TEST
  if (testSlug === 'quick-placement') {
    const allQuestions = [...(topicQuestions as any[])];
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 25);

    const mappedQuestions = selectedQuestions.map((q: any, idx: number) => {
      const correctLetter = String(q.correct || 'A').trim().toUpperCase();
      const letters = ['A', 'B', 'C', 'D'];
      const idsLower = ['a', 'b', 'c', 'd'];

      return {
        id: `quick-q${idx + 1}`,
        prompt: q.prompt,
        choices: letters.map((L, i) => ({
          id: idsLower[i],
          text: q[L] || `Option ${L}`,
          isCorrect: correctLetter === L,
        })),
        explanation: q.explanation || '',
      };
    });

    const payload = {
      attemptId,
      testSlug,
      test: { title: 'COMPREHENSIVE PLACEMENT TEST', duration: 25 },
      questions: mappedQuestions,
    };
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 4. GRAMMAR FOCUS MANTIĞI
  if (slugToTag[testSlug]) {
    const payload: any = {
      attemptId,
      testSlug,
      test: { title: 'Practice Test', duration: 30 },
      questions: [],
    };
    const grammarTitle = grammarTests.find((t) => t.slug === testSlug)?.title;
    if (grammarTitle) { payload.test.title = `${grammarTitle.toUpperCase()} TEST`; }
    const tag = slugToTag[testSlug];
    const rawQuestions = (topicQuestions as any[]).filter((q: any) => q.tags?.includes(tag)).sort(() => Math.random() - 0.5).slice(0, 20);
    const mappedQuestions = rawQuestions.map((q: any, idx: number) => {
      const correctLetter = String(q.correct || 'A').trim().toUpperCase();
      const letters = ['A', 'B', 'C', 'D'];
      const idsLower = ['a', 'b', 'c', 'd'];
      return {
        id: `${testSlug}-q${idx + 1}`,
        prompt: q.prompt,
        choices: letters.map((L, i) => ({
          id: idsLower[i],
          text: q[L] || `Option ${L}`,
          isCorrect: correctLetter === L,
        })),
        explanation: q.explanation || '',
      };
    });
    payload.questions = mappedQuestions;
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // DİĞER
  window.location.href = `/start?testSlug=${testSlug}`;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="w-full max-w-6xl mx-auto px-4 pt-10 pb-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
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
              <button onClick={() => startTest(quickTest.slug)} className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm sm:text-base shadow-md hover:bg-blue-700 transition">
                Start placement test
              </button>
              <a href="#all-tests" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base bg-white hover:bg-slate-50 transition">
                Browse all tests
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative mx-auto max-w-sm">
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-500 p-6 shadow-2xl text-white">
                <div className="text-sm font-semibold opacity-80 mb-2">Sample result</div>
                <div className="text-4xl font-black mb-1">B2</div>
                <div className="text-sm opacity-90 mb-4">Upper-Intermediate · 78% accuracy</div>
                <div className="w-full h-2 rounded-full bg-blue-300/40 mb-3 overflow-hidden">
                  <div className="h-full w-3/4 bg-white/90 rounded-full" />
                </div>
                <p className="text-xs opacity-90">Take a 20–50 question test and instantly see your estimated CEFR level, score and explanations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center px-4 pb-16 pt-4">
        <div id="all-tests" className="w-full max-w-6xl mx-auto text-center">
          
          {/* Main Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            
            {/* Quick Test */}
            <button onClick={() => startTest(quickTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-blue-600 text-white text-xl font-bold shadow-xl hover:bg-blue-700 transition-all">
              {quickTest.title}
            </button>

            {/* Mega Test */}
            <button onClick={() => startTest(megaTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-purple-600 text-white text-xl font-bold shadow-xl hover:bg-purple-700 transition-all">
              {megaTest.title}
            </button>

            {/* YDS VOCABULARY (TURUNCU) */}
            <button onClick={() => startTest(ydsVocabTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-orange-500 text-white text-xl font-bold shadow-xl hover:bg-orange-600 transition-all">
              {ydsVocabTest.title}
            </button>

            {/* YDS GRAMMAR (YENİ - KOYU MAVİ) */}
            <button onClick={() => startTest(ydsGrammarTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-indigo-600 text-white text-xl font-bold shadow-xl hover:bg-indigo-700 transition-all">
              {ydsGrammarTest.title}
            </button>

            {/* Vocab B1-C1 */}
            <button onClick={() => startTest(vocabTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-xl hover:bg-emerald-700 transition-all">
              {vocabTest.title}
            </button>

            {/* IELTS */}
            <button onClick={() => startTest(ieltsTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-sky-400 text-white text-xl font-bold shadow-xl hover:bg-sky-500 transition-all">
              {ieltsTest.title}
            </button>
            
          </div>

          {/* Race Mode Banner */}
          <div className="mb-16">
             <a href={raceTest.href} className="block w-full max-w-2xl mx-auto px-6 py-6 rounded-2xl bg-red-600 text-white text-xl font-bold shadow-xl hover:bg-red-700 transition-all">
              🏁 {raceTest.title}
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
                <button key={test.slug} onClick={() => startTest(test.slug)} className="group px-4 py-5 rounded-xl bg-white text-indigo-700 font-bold shadow-sm border border-indigo-50 hover:border-indigo-300 hover:shadow-lg transition-all">
                  <span className="block group-hover:scale-105 transition-transform">{test.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* All Levels Section */}
          <div className="mb-20">
            <div className="flex items-center justify-center mb-8">
              <span className="bg-white px-8 py-3 rounded-full text-slate-500 font-bold text-sm border border-slate-200 uppercase tracking-wider">All Levels</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {levelTests.map((test) => (
                <a key={test.level} href={`/levels/${test.level}`} className="px-4 py-10 rounded-2xl bg-white text-slate-700 font-black text-3xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-xl transition-all">
                  {test.level}
                </a>
              ))}
            </div>
          </div>

          {/* SEO SECTION */}
          <section className="text-left w-full border-t border-slate-200 pt-16 mt-16 pb-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                  <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3 text-sm">🇹🇷</span>
                  YDS & YÖKDİL Practice
                </h2>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  Master the Turkish national exams with our specialized tests.
                  We offer both a <strong>1000 Word Vocabulary Builder</strong> and a new <strong>Grammar Practice</strong> module that simulates real exam questions (Tenses, Modals, Connectors).
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 text-sm">🌍</span>
                  Global English Exams
                </h2>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  Whether it's IELTS, TOEFL or CEFR placement, our tests are designed to push your limits.
                  Try the <strong>Quick Placement Test</strong> for a fast assessment or the <strong>Grammar Mega Test</strong> for deep practice.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
