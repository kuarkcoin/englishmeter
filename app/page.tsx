'use client';

import React, { useEffect, useMemo, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// --- DATA IMPORTS ---
import topicQuestions from '@/data/grammar_topic_tests.json';
import ydsVocabulary from '@/data/yds_vocabulary.json';
import ydsGrammarQuestions from '@/data/yds_grammar.json';
import ydsPhrasals from '@/data/yds_phrasal_verbs.json';
import ydsReadingPassages from '@/data/yds_reading.json';
import ydsSynonyms from '@/data/yds_synonyms.json';
import ydsConjunctions from '@/data/yds_conjunctions.json';

// --- YDS EXAM DENEMELERİ (1..15) ---
import ydsExamQuestions1 from '@/data/yds_exam_questions.json';
import ydsExamQuestions2 from '@/data/yds_exam_questions_2.json';
import ydsExamQuestions3 from '@/data/yds_exam_questions_3.json';
import ydsExamQuestions4 from '@/data/yds_exam_questions_4.json';
import ydsExamQuestions5 from '@/data/yds_exam_questions_5.json';
import ydsExamQuestions6 from '@/data/yds_exam_questions_6.json';
import ydsExamQuestions7 from '@/data/yds_exam_questions_7.json';
import ydsExamQuestions8 from '@/data/yds_exam_questions_8.json';
import ydsExamQuestions9 from '@/data/yds_exam_questions_9.json';
import ydsExamQuestions10 from '@/data/yds_exam_questions_10.json';
import ydsExamQuestions11 from '@/data/yds_exam_questions_11.json';
import ydsExamQuestions12 from '@/data/yds_exam_questions_12.json';
import ydsExamQuestions13 from '@/data/yds_exam_questions_13.json';
import ydsExamQuestions14 from '@/data/yds_exam_questions_14.json';
import ydsExamQuestions15 from '@/data/yds_exam_questions_15.json';

// --- TEST DATA MAP ---
const YDS_EXAM_MAP: Record<string, any[]> = {
  '1': ydsExamQuestions1,
  '2': ydsExamQuestions2,
  '3': ydsExamQuestions3,
  '4': ydsExamQuestions4,
  '5': ydsExamQuestions5,
  '6': ydsExamQuestions6,
  '7': ydsExamQuestions7,
  '8': ydsExamQuestions8,
  '9': ydsExamQuestions9,
  '10': ydsExamQuestions10,
  '11': ydsExamQuestions11,
  '12': ydsExamQuestions12,
  '13': ydsExamQuestions13,
  '14': ydsExamQuestions14,
  '15': ydsExamQuestions15,
};

// --- TEST TANIMLARI ---
const quickTest = { title: 'Quick Placement Test', slug: 'quick-placement' };
const megaTest = { title: 'Grammar Mega Test (100Q)', slug: 'grammar-mega-test-100' };
const vocabTest = { title: 'Vocabulary B1-C1 (50Q)', slug: 'vocab-b1-c1-50' };
const raceTest = { title: 'Global Race Mode', href: '/race' };
const ieltsTest = { title: 'IELTS Grammar (50Q)', slug: 'ielts-grammar' };

// YDS TESTLERİ
const ydsVocabTest = { title: 'YDS 3000 Words (Vocab)', slug: 'yds-3000-vocab' };
const ydsGrammarTest = { title: 'YDS Grammar Practice (100Q)', slug: 'yds-grammar-practice' };
const ydsPhrasalTest = { title: 'YDS Phrasal Verbs (500Q)', slug: 'yds-phrasal-verbs' };
const ydsReadingTest = { title: 'YDS Reading (40Q)', slug: 'yds-reading' };
const ydsSynonymTest = { title: 'YDS Synonyms (Advanced)', slug: 'yds-synonyms' };
const ydsConjunctionTest = { title: 'YDS Conjunctions (Bağlaçlar)', slug: 'yds-conjunctions' };

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

// --- HELPERS ---
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeAttemptId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// --- ANA BİLEŞEN İÇERİĞİ ---
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restartSlug = searchParams.get('restart');

  const [isRestarting, setIsRestarting] = useState(false);

  // Hangi YDS testleri gerçekten var? (map’e göre otomatik)
  const availableTests = useMemo(() => {
    return Object.keys(YDS_EXAM_MAP)
      .map((k) => Number(k))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);
  }, []);

  // --- TEST BAŞLATMA MANTIĞI (router ile) ---
  const startTest = useCallback((testSlug: string) => {
    const attemptId = makeAttemptId();

    // --- YDS EXAM PACK ---
    if (testSlug.startsWith('yds-exam-test-')) {
      const testNumber = testSlug.split('-').pop() || '1';
      const selectedQuestions = YDS_EXAM_MAP[testNumber];

      if (!selectedQuestions || selectedQuestions.length === 0) {
        alert(`Test ${testNumber} is coming soon! Please complete existing tests first.`);
        return;
      }

      const mappedQuestions = [...selectedQuestions].map((q: any, idx: number) => {
        const correctLetter = String(q.correct || 'A').trim().toUpperCase();
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const idsLower = ['a', 'b', 'c', 'd', 'e'];

        const choices = letters
          .map((L, i) => ({
            id: idsLower[i],
            text: q[L],
            isCorrect: correctLetter === L,
          }))
          .filter((c: any) => c.text);

        return {
          id: `yds-exam${testNumber}-q${idx + 1}`,
          prompt: q.prompt,
          choices,
          explanation: q.explanation || '',
        };
      });

      const payload = {
        attemptId,
        testSlug,
        test: { title: `YDS REAL EXAM - TEST ${testNumber} (80 Questions)`, duration: 150 },
        questions: mappedQuestions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 1) YDS READING
    if (testSlug === 'yds-reading') {
      const selectedPassages = shuffle(ydsReadingPassages as any[]).slice(0, 10);
      const questions: any[] = [];

      selectedPassages.forEach((passage, pIndex) => {
        passage.questions.forEach((q: any, qIndex: number) => {
          const letters = ['A', 'B', 'C', 'D', 'E'];
          const idsLower = ['a', 'b', 'c', 'd', 'e'];

          const choices = letters.map((L, i) => ({
            id: idsLower[i],
            text: q[L],
            isCorrect: L === q.correct,
          }));

          questions.push({
            id: `yds-read-p${passage.passageId}-q${qIndex + 1}`,
            prompt: `
              <div class="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm leading-relaxed text-slate-700">
                <strong>Passage ${pIndex + 1}:</strong><br/>
                ${passage.text}
              </div>
              <div class="font-bold text-slate-900">
                ${q.prompt}
              </div>
            `,
            choices,
            explanation: q.explanation,
          });
        });
      });

      const payload = {
        attemptId,
        testSlug,
        test: { title: 'YDS READING COMPREHENSION (40 Questions)', duration: 80 },
        questions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 2) YDS GRAMMAR
    if (testSlug === 'yds-grammar-practice') {
      const selectedQuestions = shuffle(ydsGrammarQuestions as any[]).slice(0, 100);

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
        test: { title: 'YDS GRAMMAR PRACTICE (100 Questions)', duration: 90 },
        questions: mappedQuestions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 3) YDS PHRASAL VERBS
    if (testSlug === 'yds-phrasal-verbs') {
      const selectedWords = shuffle(ydsPhrasals as any[]).slice(0, 100);

      const questions = selectedWords.map((item: any, idx: number) => {
        const correctAnswer = item.meaning;

        const distractors = shuffle(
          (ydsPhrasals as any[])
            .filter((w: any) => w.meaning !== correctAnswer)
            .map((w: any) => w.meaning)
        ).slice(0, 3);

        const allOptions = shuffle([...distractors, correctAnswer]);
        const idsLower = ['a', 'b', 'c', 'd'];

        return {
          id: `yds-phrasal-q${idx + 1}`,
          prompt: `What is the meaning of the phrasal verb **"${item.word}"**?`,
          choices: allOptions.map((optText: string, i: number) => ({
            id: idsLower[i],
            text: optText,
            isCorrect: optText === correctAnswer,
          })),
          explanation: `**${item.word}**: ${correctAnswer}`,
        };
      });

      const payload = {
        attemptId,
        testSlug,
        test: { title: 'YDS PHRASAL VERBS (100 Questions)', duration: 75 },
        questions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 4) YDS 3000 VOCAB
    if (testSlug === 'yds-3000-vocab') {
      const selectedWords = shuffle(ydsVocabulary as any[]).slice(0, 50);

      const questions = selectedWords.map((item: any, idx: number) => {
        const correctAnswer = item.meaning;

        const distractors = shuffle(
          (ydsVocabulary as any[])
            .filter((w: any) => w.meaning !== correctAnswer)
            .map((w: any) => w.meaning)
        ).slice(0, 3);

        const allOptions = shuffle([...distractors, correctAnswer]);
        const idsLower = ['a', 'b', 'c', 'd'];

        return {
          id: `yds-vocab-q${idx + 1}`,
          prompt: `What is the Turkish meaning of **"${item.word}"**?`,
          choices: allOptions.map((optText: string, i: number) => ({
            id: idsLower[i],
            text: optText,
            isCorrect: optText === correctAnswer,
          })),
          explanation: `**${item.word}**: ${correctAnswer}`,
        };
      });

      const payload = {
        attemptId,
        testSlug,
        test: { title: 'YDS 3000 WORDS (VOCABULARY)', duration: 40 },
        questions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 5) YDS SYNONYMS
    if (testSlug === 'yds-synonyms') {
      const selectedWords = shuffle(ydsSynonyms as any[]).slice(0, 50);

      const questions = selectedWords.map((item: any, idx: number) => {
        const correctAnswer = item.synonym;

        let distractors = item.distractors;
        if (!distractors || distractors.length === 0) {
          distractors = shuffle(
            (ydsSynonyms as any[])
              .filter((w: any) => w.synonym !== correctAnswer)
              .map((w: any) => w.synonym)
          ).slice(0, 3);
        } else {
          distractors = shuffle(distractors).slice(0, 3);
        }

        const allOptions = shuffle([...distractors, correctAnswer]);
        const letters = ['A', 'B', 'C', 'D'];
        const idsLower = ['a', 'b', 'c', 'd'];

        return {
          id: `yds-syn-q${idx + 1}`,
          prompt: `Select the word that is closest in meaning to: <br/> <strong class="text-xl text-blue-700">"${item.word}"</strong> <span class="text-sm text-gray-500">(${item.meaning})</span>`,
          choices: letters.map((L, i) => ({
            id: idsLower[i],
            text: allOptions[i],
            isCorrect: allOptions[i] === correctAnswer,
          })),
          explanation: `**${item.word}** means "${item.meaning}". <br/> Synonym: **${correctAnswer}**.`,
        };
      });

      const payload = {
        attemptId,
        testSlug,
        test: { title: 'YDS SYNONYMS PRACTICE (50 Questions)', duration: 40 },
        questions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 6) YDS CONJUNCTIONS
    if (testSlug === 'yds-conjunctions') {
      const selectedQuestions = shuffle(ydsConjunctions as any[]).slice(0, 50);

      const mappedQuestions = selectedQuestions.map((q: any, idx: number) => {
        const correctLetter = String(q.correct || 'A').trim().toUpperCase();
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const idsLower = ['a', 'b', 'c', 'd', 'e'];

        return {
          id: `yds-conj-q${idx + 1}`,
          prompt: q.prompt,
          choices: letters
            .map((L, i) => ({
              id: idsLower[i],
              text: q[L],
              isCorrect: correctLetter === L,
            }))
            .filter((c: any) => c.text),
          explanation: q.explanation || '',
        };
      });

      const payload = {
        attemptId,
        testSlug,
        test: { title: 'YDS CONJUNCTIONS (Bağlaçlar)', duration: 35 },
        questions: mappedQuestions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 7) QUICK PLACEMENT
    if (testSlug === 'quick-placement') {
      const selectedQuestions = shuffle(topicQuestions as any[]).slice(0, 50);

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
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // 8) GRAMMAR FOCUS (tag tabanlı)
    if (slugToTag[testSlug]) {
      const tag = slugToTag[testSlug];
      const grammarTitle = grammarTests.find((t) => t.slug === testSlug)?.title;

      const rawQuestions = shuffle(
        (topicQuestions as any[]).filter((q: any) => q.tags?.includes(tag))
      ).slice(0, 20);

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

      const payload: any = {
        attemptId,
        testSlug,
        test: { title: 'Practice Test', duration: 30 },
        questions: mappedQuestions,
      };

      if (grammarTitle) payload.test.title = `${grammarTitle.toUpperCase()} TEST`;

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      router.push(`/quiz/${attemptId}`);
      return;
    }

    // DİĞERLERİ start sayfasına
    router.push(`/start?testSlug=${encodeURIComponent(testSlug)}`);
  }, [router]);

  // restart parametresi ile otomatik başlat
  useEffect(() => {
    if (!restartSlug) return;

    setIsRestarting(true);
    const timer = setTimeout(() => startTest(restartSlug), 250);
    return () => clearTimeout(timer);
  }, [restartSlug, startTest]);

  if (isRestarting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Starting New Test...</h2>
        <p className="text-slate-500 mt-2">Preparing fresh questions from the pool</p>
      </div>
    );
  }

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
                  Take a 20–50 question test and instantly see your estimated CEFR level, score and explanations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center px-4 pb-16 pt-4">
        <div id="all-tests" className="w-full max-w-6xl mx-auto text-center">

          {/* --- OYUN MODLARI (3'lü Grid - DÜZELTİLMİŞ HALİ) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            
            {/* 1. SPEED RUN (SARI) */}
            <a href="/speedrun" className="group relative overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-6 border border-indigo-800 shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-1 text-left">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-500 rounded-full opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded-full text-yellow-400 text-[10px] font-bold uppercase mb-3">
                  ⚡ Fast
                </div>
                <h3 className="text-2xl font-black text-white mb-1">SpeedRun</h3>
                <p className="text-indigo-200 text-xs mb-4">60 seconds challenge.</p>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-950 font-bold">▶</div>
              </div>
            </a>

            {/* 2. GLOBAL RACE (MAVİ) */}
            <a href="/race" className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 text-left">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded-full text-blue-400 text-[10px] font-bold uppercase mb-3">
                  🏆 Live
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Race Arena</h3>
                <p className="text-slate-400 text-xs mb-4">Compete with others.</p>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">⚔</div>
              </div>
            </a>

            {/* 3. FLASHCARDS (YEŞİL - YENİ) */}
            <a href="/flashcards" className="group relative overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-6 border border-emerald-800 shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1 text-left">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500 rounded-full opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-full text-emerald-400 text-[10px] font-bold uppercase mb-3">
                  🧠 Study
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Flashcards</h3>
                <p className="text-emerald-200 text-xs mb-4">Memorize 3000 words.</p>
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">↺</div>
              </div>
            </a>
          </div>

          {/* Main Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            <button onClick={() => startTest(quickTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-blue-600 text-white text-xl font-bold shadow-xl hover:bg-blue-700 transition-all">
              {quickTest.title}
            </button>

            <button onClick={() => startTest(megaTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-purple-600 text-white text-xl font-bold shadow-xl hover:bg-purple-700 transition-all">
              {megaTest.title}
            </button>

            <button onClick={() => startTest(ydsVocabTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-orange-500 text-white text-xl font-bold shadow-xl hover:bg-orange-600 transition-all">
              {ydsVocabTest.title}
            </button>

            {/* --- YDS EXAM PACK --- */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-pink-50 rounded-3xl p-6 border-2 border-pink-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-500"></div>

              <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-pink-600 flex items-center gap-2">
                  <span className="text-3xl">🇹🇷</span> YDS EXAM PACK
                </h3>
                <span className="text-pink-400 text-sm font-bold bg-white px-3 py-1 rounded-full border border-pink-100">
                  Real Exam Mode (80 Questions)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => {
                  const isActive = availableTests.includes(num);

                  return (
                    <button
                      key={num}
                      onClick={() => isActive && startTest(`yds-exam-test-${num}`)}
                      disabled={!isActive}
                      className={`py-4 rounded-xl font-bold text-lg shadow-sm transition-all transform hover:scale-105 active:scale-95
                        ${isActive
                          ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200 ring-2 ring-pink-300 ring-offset-2'
                          : 'bg-white text-pink-300 border border-pink-100 cursor-not-allowed opacity-60'
                        }`}
                    >
                      Test {num}
                      {isActive && <span className="block text-xs font-normal opacity-90 mt-1">Start Now</span>}
                      {!isActive && <span className="block text-[10px] opacity-60 mt-1">Locked</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={() => startTest(ydsGrammarTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-indigo-600 text-white text-xl font-bold shadow-xl hover:bg-indigo-700 transition-all">
              {ydsGrammarTest.title}
            </button>

            <button onClick={() => startTest(ydsReadingTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-green-600 text-white text-xl font-bold shadow-xl hover:bg-green-700 transition-all">
              {ydsReadingTest.title}
            </button>

            <button onClick={() => startTest(ydsPhrasalTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-teal-600 text-white text-xl font-bold shadow-xl hover:bg-teal-700 transition-all">
              {ydsPhrasalTest.title}
            </button>

            <button onClick={() => startTest(ydsSynonymTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-purple-500 text-white text-xl font-bold shadow-xl hover:bg-purple-600 transition-all">
              {ydsSynonymTest.title}
            </button>

            <button onClick={() => startTest(ydsConjunctionTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-slate-600 text-white text-xl font-bold shadow-xl hover:bg-slate-700 transition-all">
              {ydsConjunctionTest.title}
            </button>

            <button onClick={() => startTest(ieltsTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-sky-400 text-white text-xl font-bold shadow-xl hover:bg-sky-500 transition-all">
              {ieltsTest.title}
            </button>

            <button onClick={() => startTest(vocabTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-xl hover:bg-emerald-700 transition-all">
              {vocabTest.title}
            </button>
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
                  <span className="block group-hover:scale-105 transition-transform">{test.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* All Levels Section */}
          <div className="mb-20">
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

          {/* SEO SECTION */}
          <section className="text-left w-full border-t border-slate-200 pt-16 mt-16 pb-12 bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                    <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3 text-sm">🇹🇷</span>
                    YDS & YÖKDİL Exam Preparation
                  </h2>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Preparing for the <strong>Foreign Language Exam (YDS)</strong> or <strong>YÖKDİL</strong> in Turkey? EnglishMeter offers comprehensive online practice tests designed to simulate the real exam experience.
                    Our <strong>YDS Exam Pack</strong> includes full-length practice tests with 80 questions covering reading comprehension, vocabulary, grammar, and translation skills.
                  </p>
                  <ul className="list-disc pl-4 text-sm text-slate-500 space-y-1">
                    <li><strong>YDS Vocabulary:</strong> Master the most common 3000 academic words.</li>
                    <li><strong>Synonyms Practice:</strong> Learn crucial synonyms and distractors for paraphrasing questions.</li>
                    <li><strong>Reading Comprehension:</strong> Analyze complex paragraphs with detailed explanations.</li>
                    <li><strong>Grammar Practice:</strong> Focus on tenses, prepositions, and sentence completion.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 text-sm">🌍</span>
                    Global English Placement Tests
                  </h2>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Test your English proficiency level with our free online placement tests. Based on the <strong>Common European Framework of Reference (CEFR)</strong>, our quizzes determine whether you are A1 (Beginner), B2 (Upper-Intermediate), or C2 (Advanced).
                    Whether you are preparing for IELTS, TOEFL, or just want to know your level, our <strong>Quick Placement Test</strong> gives you an instant score in under 20 minutes.
                  </p>
                  <p className="text-sm text-slate-500">
                    Join thousands of users improving their English daily with our grammar focus tests and vocabulary builders.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Why use EnglishMeter?</h3>
                <div className="grid sm:grid-cols-3 gap-6 text-sm text-slate-600">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Instant Results</h4>
                    <p>No waiting. Get your score, CEFR level, and detailed answer explanations immediately after finishing a test.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Mobile Friendly</h4>
                    <p>Practice on the go. Our tests are optimized for phones, tablets, and desktops so you can study anywhere.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Completely Free</h4>
                    <p>Access high-quality YDS, YÖKDİL, and general English grammar tests without any subscription fees.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  export default function Home(props: any) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <HomeContent />
    </Suspense>
  );
}
