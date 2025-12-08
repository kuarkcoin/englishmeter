'use client';

import React from 'react';

// --- DATA IMPORTS ---
import topicQuestions from '@/data/grammar_topic_tests.json';
import ydsVocabulary from '@/data/yds_vocabulary.json';
import ydsGrammarQuestions from '@/data/yds_grammar.json';
import ydsPhrasals from '@/data/yds_phrasal_verbs.json';
import ydsReadingPassages from '@/data/yds_reading.json';

// --- YDS EXAM DENEMELERİ (1, 2, 3, 4, 5, 6) ---
import ydsExamQuestions1 from '@/data/yds_exam_questions.json';     // Test 1
import ydsExamQuestions2 from '@/data/yds_exam_questions_2.json';   // Test 2
import ydsExamQuestions3 from '@/data/yds_exam_questions_3.json';   // Test 3
import ydsExamQuestions4 from '@/data/yds_exam_questions_4.json';   // Test 4
import ydsExamQuestions5 from '@/data/yds_exam_questions_5.json';   // Test 5 (YENİ)
import ydsExamQuestions6 from '@/data/yds_exam_questions_6.json';   // Test 6 (YENİ)

// --- TEST DATA MAP ---
const YDS_EXAM_MAP: Record<string, any[]> = {
  '1': ydsExamQuestions1,
  '2': ydsExamQuestions2,
  '3': ydsExamQuestions3,
  '4': ydsExamQuestions4,
  '5': ydsExamQuestions5, // YENİ EKLENDİ
  '6': ydsExamQuestions6, // YENİ EKLENDİ
  // '7': ydsExamQuestions7, // İleride eklenecek
  // '8': ydsExamQuestions8, // İleride eklenecek
};

// --- TEST TANIMLARI ---
const quickTest = { title: 'Quick Placement Test', slug: 'quick-placement' };
const megaTest = { title: 'Grammar Mega Test (100Q)', slug: 'grammar-mega-test-100' };
const vocabTest = { title: 'Vocabulary B1-C1 (50Q)', slug: 'vocab-b1-c1-50' };
const raceTest = { title: 'Global Race Mode', href: '/race' };
const ieltsTest = { title: 'IELTS Grammar (50Q)', slug: 'ielts-grammar' };

const ydsVocabTest = { title: 'YDS 3000 Words (Vocab)', slug: 'yds-3000-vocab' };
const ydsGrammarTest = { title: 'YDS Grammar Practice (100Q)', slug: 'yds-grammar-practice' };
const ydsPhrasalTest = { title: 'YDS Phrasal Verbs (340Q)', slug: 'yds-phrasal-verbs' };
const ydsReadingTest = { title: 'YDS Reading (40Q)', slug: 'yds-reading' };

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

  // --- YDS EXAM PACK MANTIĞI ---
  if (testSlug.startsWith('yds-exam-test-')) {
    const testNumber = testSlug.split('-').pop() || '1'; // '1', '2', ... '6'
    const selectedQuestions = YDS_EXAM_MAP[testNumber]; // Haritadan soruları çek

    if (selectedQuestions) {
      const mappedQuestions = [...selectedQuestions].map((q: any, idx: number) => {
        const correctLetter = String(q.correct || 'A').trim().toUpperCase();
        const letters = ['A', 'B', 'C', 'D', 'E']; 
        const idsLower = ['a', 'b', 'c', 'd', 'e'];
  
        return {
          id: `yds-exam${testNumber}-q${idx + 1}`,
          prompt: q.prompt,
          choices: letters.map((L, i) => ({
            id: idsLower[i],
            text: q[L], 
            isCorrect: correctLetter === L,
          })).filter((c: any) => c.text), // Metni olmayan şıkları temizle
          explanation: q.explanation || '',
        };
      });
  
      const payload = {
        attemptId,
        testSlug,
        test: { title: `YDS REAL EXAM - TEST ${testNumber} (80 Questions)`, duration: 150 }, // 150 dk
        questions: mappedQuestions,
      };
      
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
      window.location.href = `/quiz/${attemptId}`;
      return;
    } else {
      // Eğer MAP içinde yoksa (örn: Test 7'ye tıklandıysa)
      alert(`Test ${testNumber} is coming soon! Please complete existing tests first.`);
      return;
    }
  }

  // 1. YDS READING
  if (testSlug === 'yds-reading') {
    const shuffledPassages = [...(ydsReadingPassages as any[])].sort(() => 0.5 - Math.random());
    const selectedPassages = shuffledPassages.slice(0, 10);
    const questions: any[] = [];

    selectedPassages.forEach((passage, pIndex) => {
      passage.questions.forEach((q: any, qIndex: number) => {
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const idsLower = ['a', 'b', 'c', 'd', 'e'];
        const choices = letters.map((L, i) => ({
          id: idsLower[i],
          text: q[L],
          isCorrect: L === q.correct
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
          choices: choices,
          explanation: q.explanation
        });
      });
    });

    const payload = {
      attemptId,
      testSlug,
      test: { title: 'YDS READING COMPREHENSION (40 Questions)', duration: 80 }, 
      questions: questions,
    };
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 2. YDS GRAMMAR
  if (testSlug === 'yds-grammar-practice') {
    const shuffledQuestions = [...(ydsGrammarQuestions as any[])].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 100); 

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
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 3. YDS PHRASAL VERBS
  if (testSlug === 'yds-phrasal-verbs') {
    const shuffledList = [...(ydsPhrasals as any[])].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledList.slice(0, 100);

    const questions = selectedWords.map((item, idx) => {
      const correctAnswer = item.meaning;
      const distractors = (ydsPhrasals as any[])
        .filter((w) => w.meaning !== correctAnswer)
        .map((w) => w.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allOptions = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
      const idsLower = ['a', 'b', 'c', 'd'];

      return {
        id: `yds-phrasal-q${idx + 1}`,
        prompt: `What is the meaning of the phrasal verb **"${item.word}"**?`,
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
      test: { title: 'YDS PHRASAL VERBS (100 Questions)', duration: 75 },
      questions: questions,
    };
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 4. YDS KELİME TESTİ
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
      test: { title: 'YDS 3000 WORDS (VOCABULARY)', duration: 40 },
      questions: questions,
    };
    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    window.location.href = `/quiz/${attemptId}`;
    return;
  }

  // 5. QUICK PLACEMENT TEST
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

  // 6. GRAMMAR FOCUS
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
  // Aktif olan test numaraları (1, 2, 3, 4, 5, 6) -> 5 ve 6'yı ekledik.
  const availableTests = [1, 2, 3, 4, 5, 6];

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

            {/* --- YDS EXAM PACK (PEMBE ALAN) --- */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-pink-50 rounded-3xl p-6 border-2 border-pink-200 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-500"></div>
               
               <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-pink-600 flex items-center gap-2">
                     <span className="text-3xl">🇹🇷</span> YDS EXAM PACK
                  </h3>
                  <span className="text-pink-400 text-sm font-bold bg-white px-3 py-1 rounded-full border border-pink-100">
                    Real Exam Mode (80 Questions)
                  </span>
               </div>

               {/* 8 TANE TEST BUTONU (1-6 AKTİF) */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const isActive = availableTests.includes(num);

                    return (
                      <button
                        key={num}
                        onClick={() => startTest(`yds-exam-test-${num}`)}
                        className={`py-4 rounded-xl font-bold text-lg shadow-sm transition-all transform hover:scale-105 active:scale-95
                          ${isActive 
                             ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200 ring-2 ring-pink-300 ring-offset-2' 
                             : 'bg-white text-pink-300 border border-pink-100 hover:border-pink-300 hover:text-pink-500 cursor-not-allowed opacity-60'
                          }`}
                      >
                        Test {num}
                        {isActive && <span className="block text-xs font-normal opacity-90 mt-1">Start Now</span>}
                        {!isActive && <span className="block text-[10px] opacity-60 mt-1">Locked</span>}
                      </button>
                    )
                  })}
               </div>
            </div>

            {/* YDS GRAMMAR (KOYU MAVİ) */}
            <button onClick={() => startTest(ydsGrammarTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-indigo-600 text-white text-xl font-bold shadow-xl hover:bg-indigo-700 transition-all">
              {ydsGrammarTest.title}
            </button>

            {/* YDS READING (YEŞİL) */}
            <button onClick={() => startTest(ydsReadingTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-green-600 text-white text-xl font-bold shadow-xl hover:bg-green-700 transition-all">
              {ydsReadingTest.title}
            </button>

            {/* YDS PHRASAL VERBS (TEAL) */}
            <button onClick={() => startTest(ydsPhrasalTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-teal-600 text-white text-xl font-bold shadow-xl hover:bg-teal-700 transition-all">
              {ydsPhrasalTest.title}
            </button>

            {/* IELTS */}
            <button onClick={() => startTest(ieltsTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-sky-400 text-white text-xl font-bold shadow-xl hover:bg-sky-500 transition-all">
              {ieltsTest.title}
            </button>

            {/* Vocab B1-C1 */}
             <button onClick={() => startTest(vocabTest.slug)} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-xl hover:bg-emerald-700 transition-all">
              {vocabTest.title}
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

          {/* SEO SECTION - FOOTER */}
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
  );
}
