'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

// --- TYPES ---
interface Choice {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  prompt: string;
  choices: Choice[];
  explanation?: string;
  correctChoiceId?: string;
  correct?: string;
  correct_option?: string;
  answer?: string;
}

interface TestInfo {
  title: string;
  duration?: number; // minutes
}

interface QuizData {
  attemptId: string;
  testSlug?: string;
  test: TestInfo;
  questions: Question[];
  error?: string;
}

type Mode = 'EXAM' | 'PRACTICE';

// --- HELPER: FORMAT TIME MM:SS ---
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// --- HELPER: DOĞRU ŞIK ID'SİNİ BUL ---
function getCorrectChoiceId(q: Question): string | undefined {
  const flagged = (q.choices || []).find((c) => c.isCorrect);
  if (flagged) return String(flagged.id).trim();

  const anyQ = q as any;
  const candidate =
    q.correctChoiceId ??
    q.correct ??
    q.correct_option ??
    q.answer ??
    anyQ.correctAnswerId ??
    anyQ.correctAnswer;

  if (candidate != null) return String(candidate).trim();
  return undefined;
}

// --- HELPER: EQUAL ---
function idsEqual(a?: string | null, b?: string | null): boolean {
  if (a == null || b == null) return false;
  return String(a).trim().toUpperCase() === String(b).trim().toUpperCase();
}

// --- SAFE HTML RENDER (XSS PROTECTED) ---
function SafeHTML({ html }: { html: string }) {
  const clean = useMemo(() => {
    if (typeof window === 'undefined') return html;
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }, [html]);

  return <span dangerouslySetInnerHTML={{ __html: clean }} />;
}

// --- HELPER: TEXT FORMATTER (**badge** + safe html) ---
function formatText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      let content = part.slice(2, -2);
      content = content.replace(/^['"]+|['"]+$/g, '');
      return (
        <span
          key={index}
          className="bg-blue-100 text-blue-700 font-extrabold px-3 py-1 rounded-lg mx-1 border border-blue-200 shadow-sm inline-block transform -translate-y-0.5 tracking-wide"
        >
          {content}
        </span>
      );
    }
    return <SafeHTML key={index} html={part} />;
  });
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [data, setData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // ✅ NEW (1/3): Mode + Practice behavior
  const [mode, setMode] = useState<Mode>('EXAM');
  const [autoNextPractice, setAutoNextPractice] = useState(true);

  // ✅ NEW (2/3): Fun (XP + Streak)
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // ✅ NEW (3/3): Flag system
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  // ✅ Practice feedback per question
  const [feedback, setFeedback] = useState<Record<string, { selectedId: string; isCorrect: boolean }>>(
    {}
  );

  // ✅ Helper: Scroll to question
  const scrollToQuestion = useCallback((index: number) => {
    const el = document.getElementById(`q-${index}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 900);
  }, []);

  // 1) LOAD DATA
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = sessionStorage.getItem('em_attempt_payload');
    if (!raw) {
      setData({
        attemptId: '',
        test: { title: 'Error', duration: 0 },
        questions: [],
        error: 'Test data not found. Please start again.',
      });
      return;
    }

    try {
      const parsed: QuizData = JSON.parse(raw);
      setData(parsed);

      const qCount = parsed.questions?.length || 0;

      // ✅ Duration minutes -> seconds
      let seconds = 0;
      if (parsed.test?.duration && Number.isFinite(parsed.test.duration) && parsed.test.duration! > 0) {
        seconds = Math.round(parsed.test.duration! * 60);
      } else {
        seconds = qCount > 0 ? qCount * 30 : 25 * 60;
      }

      setTimeLeft(seconds);

      // optional: restore mode preference
      const savedMode = localStorage.getItem('em_quiz_mode');
      if (savedMode === 'PRACTICE' || savedMode === 'EXAM') setMode(savedMode);
    } catch {
      setData({
        attemptId: '',
        test: { title: 'Error', duration: 0 },
        questions: [],
        error: 'Data corrupted.',
      });
    }
  }, [params.id]);

  // 3) SUBMIT & SAVE MISTAKES
  const handleSubmit = useCallback(() => {
    if (!data) return;

    // ✅ Flag warning (3/3)
    const flaggedCount = data.questions.filter((q) => flags[q.id]).length;
    if (flaggedCount > 0) {
      const ok = window.confirm(`🚩 You have ${flaggedCount} flagged question(s). Finish anyway?`);
      if (!ok) {
        const firstFlagIndex = data.questions.findIndex((q) => flags[q.id]);
        if (firstFlagIndex >= 0) scrollToQuestion(firstFlagIndex);
        return;
      }
    }

    // ✅ Unanswered kontrolü (Exam + Practice ikisinde de)
    const unanswered = data.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      const firstMissingIndex = data.questions.findIndex((q) => !answers[q.id]);
      alert(`${unanswered.length} unanswered question(s). Please review before finishing.`);
      scrollToQuestion(firstMissingIndex);
      return;
    }

    const { questions } = data;
    let correctCount = 0;

    // Mevcut hataları çek (bozuk JSON'a karşı korumalı)
    const existingMistakesRaw = localStorage.getItem('my_mistakes');
    let mistakeList: any[] = [];
    try {
      mistakeList = existingMistakesRaw ? JSON.parse(existingMistakesRaw) : [];
      if (!Array.isArray(mistakeList)) mistakeList = [];
    } catch {
      mistakeList = [];
    }

    questions.forEach((q) => {
      const userAnswerId = answers[q.id];
      const correctChoiceId = getCorrectChoiceId(q);
      const isCorrect = idsEqual(userAnswerId, correctChoiceId);

      if (isCorrect) correctCount++;

      const scope = data.testSlug || data.attemptId || 'test';
      const mistakeKey = `${scope}::${q.id}`;

      if (userAnswerId) {
        if (isCorrect) {
          mistakeList = mistakeList.filter((m) => m?.key !== mistakeKey);
        } else {
          const alreadyExists = mistakeList.find((m) => m?.key === mistakeKey);
          if (!alreadyExists) {
            mistakeList.push({
              key: mistakeKey,
              questionId: q.id,
              attemptId: data.attemptId,
              testSlug: data.testSlug,
              testTitle: data.test.title,
              ...q,
              myWrongAnswer: userAnswerId,
              savedAt: new Date().toISOString(),
            });
          }
        }
      }
    });

    localStorage.setItem('my_mistakes', JSON.stringify(mistakeList));

    setScore(correctCount);
    setShowResult(true);
    window.scrollTo(0, 0);
    sessionStorage.removeItem('em_attempt_payload');
  }, [data, answers, scrollToQuestion, flags]);

  // 2) TIMER (deps fixed)
  useEffect(() => {
    if (timeLeft === null || showResult) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((p) => (p !== null && p > 0 ? p - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, showResult, handleSubmit]);

  // Optional: 10 seconds warning
  useEffect(() => {
    if (timeLeft === 10 && !showResult) {
      // keep it light
      showToast('⏳ 10 seconds left!');
    }
  }, [timeLeft, showResult, showToast]);

  if (!data) return <div className="p-10 text-center animate-pulse">Loading...</div>;
  if (data.error) return <div className="p-10 text-red-600">{data.error}</div>;

  const { questions, test } = data;

  // Progress metrics
  const totalQ = questions.length || 1;
  const answeredCount = questions.filter((q) => !!answers[q.id]).length;
  const progress = Math.round((answeredCount / totalQ) * 100);

  // --- RESULT SCREEN ---
  if (showResult) {
    const total = questions.length || 1;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>

          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 mt-6">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-blue-600">{score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>
            </div>

            <div className="w-px h-12 bg-slate-200" />

            <div className="flex flex-col">
              <span className="text-4xl font-black text-slate-700">{questions.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
            </div>

            <div className="w-px h-12 bg-slate-200" />

            <div className="flex flex-col">
              <span className={`text-4xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                {percentage}%
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
            </div>
          </div>

          {/* Fun stats */}
          <div className="flex justify-center gap-3 mb-8">
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700">
              ⭐ XP: <span className="text-blue-700">{xp}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700">
              🔥 Best Streak: <span className="text-orange-600">{streak}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {data.testSlug && (
              <button
                onClick={() => (window.location.href = `/?restart=${data.testSlug}`)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                type="button"
              >
                New Test (New Questions)
              </button>
            )}

            <a href="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Back to Home
            </a>

            <Link
              href="/mistakes"
              className="px-6 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors border border-red-200 flex items-center justify-center gap-2"
            >
              <span>📕</span> My Mistakes
            </Link>
          </div>
        </div>

        {/* DETAILED ANALYSIS */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-700 ml-2 border-l-4 border-blue-500 pl-3">
            Detailed Analysis
          </h2>

          {questions.map((q, idx) => {
            const userAnswerId = answers[q.id];
            const correctId = getCorrectChoiceId(q);
            const isUserAnswered = !!userAnswerId;
            const isCorrect = idsEqual(userAnswerId, correctId);

            let cardBorder = 'border-slate-200';
            let cardBg = 'bg-white';
            if (isCorrect) {
              cardBorder = 'border-green-200';
              cardBg = 'bg-green-50/40';
            } else if (!isUserAnswered) {
              cardBorder = 'border-amber-200';
              cardBg = 'bg-amber-50/40';
            } else {
              cardBorder = 'border-red-200';
              cardBg = 'bg-red-50/40';
            }

            return (
              <div key={q.id} className={`p-6 rounded-2xl border-2 ${cardBorder} ${cardBg}`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                      isCorrect ? 'bg-green-500' : !isUserAnswered ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                  >
                    {isCorrect ? '✓' : !isUserAnswered ? '−' : '✕'}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-slate-400 font-bold uppercase">Question {idx + 1}</span>
                      {!isUserAnswered && (
                        <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                          SKIPPED
                        </span>
                      )}
                    </div>

                    <div className="text-lg font-medium text-slate-800 mb-5 leading-loose">
                      {formatText(q.prompt)}
                    </div>

                    <div className="grid gap-2">
                      {(q.choices || []).map((c) => {
                        const isSelected = idsEqual(userAnswerId, c.id);
                        const isTheCorrectAnswer = idsEqual(c.id, correctId);

                        let optionClass = 'p-3 rounded-lg border flex items-center justify-between ';
                        if (isTheCorrectAnswer) {
                          optionClass += 'bg-green-100 border-green-300 text-green-800 font-bold shadow-sm';
                        } else if (isSelected) {
                          optionClass += 'bg-red-100 border-red-300 text-red-800 font-medium';
                        } else {
                          optionClass += 'bg-white/60 border-slate-200 text-slate-500 opacity-70';
                        }

                        return (
                          <div key={c.id} className={optionClass}>
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                                  isTheCorrectAnswer
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : isSelected
                                    ? 'border-red-500 bg-red-500 text-white'
                                    : 'border-slate-300'
                                }`}
                              >
                                {c.id}
                              </div>
                              <span>
                                <SafeHTML html={c.text} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
                        <span className="text-xl">💡</span>
                        <div>
                          <span className="font-bold block mb-1 text-blue-900">Explanation:</span>
                          <span className="leading-relaxed opacity-90">
                            <SafeHTML html={q.explanation} />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Interaction helpers for Practice Mode ---
  const handlePick = (q: Question, choiceId: string, qIndex: number) => {
    // already locked in practice?
    if (mode === 'PRACTICE' && feedback[q.id]) return;

    setAnswers((prev) => ({ ...prev, [q.id]: choiceId }));

    if (mode === 'PRACTICE') {
      const correctId = getCorrectChoiceId(q);
      const isCorrect = idsEqual(choiceId, correctId);

      setFeedback((prev) => ({ ...prev, [q.id]: { selectedId: choiceId, isCorrect } }));

      if (isCorrect) {
        setXp((x) => x + 10);
        setStreak((s) => s + 1);
        showToast(`✅ Correct! +10 XP  🔥 ${streak + 1}`);
      } else {
        setStreak(0);
        showToast(`❌ Wrong. Streak reset`);
      }

      // Auto-next
      if (autoNextPractice) {
        window.setTimeout(() => {
          scrollToQuestion(Math.min(qIndex + 1, questions.length - 1));
        }, 420);
      }
    }
  };

  const toggleFlag = (qid: string) => {
    setFlags((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  // --- QUIZ SOLVING SCREEN ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg">
          {toast}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20 backdrop-blur-sm bg-white/90">
        <div className="text-sm font-semibold text-slate-700 truncate max-w-[220px]">{test?.title || 'Test'}</div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => {
                setMode('EXAM');
                localStorage.setItem('em_quiz_mode', 'EXAM');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black ${
                mode === 'EXAM' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white'
              }`}
            >
              EXAM
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('PRACTICE');
                localStorage.setItem('em_quiz_mode', 'PRACTICE');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black ${
                mode === 'PRACTICE' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white'
              }`}
            >
              PRACTICE
            </button>
          </div>

          {/* XP/Streak */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-black text-slate-700">⭐ {xp}</span>
            <span className="text-xs font-black text-orange-600">🔥 {streak}</span>
          </div>

          {/* Timer */}
          <div
            className={`text-lg font-bold px-4 py-2 rounded-lg border transition-colors ${
              timeLeft !== null && timeLeft < 60
                ? 'text-red-600 bg-red-50 border-red-200 animate-pulse'
                : 'text-blue-600 bg-blue-50 border-blue-200'
            }`}
          >
            {timeLeft !== null ? formatTime(timeLeft) : '∞'}
          </div>
        </div>
      </div>

      {/* Practice options */}
      {mode === 'PRACTICE' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-slate-800">Practice Mode</div>
            <div className="text-xs text-slate-500">Instant feedback + explanation</div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={autoNextPractice}
              onChange={(e) => setAutoNextPractice(e.target.checked)}
            />
            Auto next
          </label>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-2">
          <span>
            {answeredCount}/{totalQ} answered
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Navigator (with flags) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-black text-slate-800">Question Navigator</div>
          <div className="text-xs text-slate-500">Blue = answered · Yellow = flagged</div>
        </div>

        <div className="grid grid-cols-10 gap-2">
          {questions.map((q, i) => {
            const done = !!answers[q.id];
            const flagged = !!flags[q.id];

            let cls = 'bg-white text-slate-500 border-slate-200 hover:border-blue-400';
            if (flagged) cls = 'bg-amber-400 text-white border-amber-400';
            else if (done) cls = 'bg-blue-600 text-white border-blue-600';

            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(i)}
                className={`h-8 rounded-lg text-xs font-black border transition active:scale-[0.98] ${cls}`}
                title={flagged ? 'Flagged' : done ? 'Answered' : 'Not answered'}
                type="button"
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Loop */}
      <div className="space-y-8">
        {questions.map((q, idx) => {
          const fb = feedback[q.id];
          const correctId = getCorrectChoiceId(q);

          return (
            <div
              id={`q-${idx}`}
              key={q.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 scroll-mt-28"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-400 font-bold uppercase tracking-wide">Question {idx + 1}</div>

                <div className="flex items-center gap-2">
                  {/* Flag */}
                  <button
                    type="button"
                    onClick={() => toggleFlag(q.id)}
                    className={`text-xs font-black px-2 py-1 rounded-lg border transition ${
                      flags[q.id]
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Flag this question"
                  >
                    🚩
                  </button>

                  {!answers[q.id] && (
                    <span className="text-[11px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded-lg border border-slate-200">
                      EMPTY
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xl font-medium text-slate-800 mb-6 leading-loose">{formatText(q.prompt)}</div>

              <div className="grid gap-3">
                {(q.choices || []).map((c) => {
                  const selected = answers[q.id] === c.id;

                  // Practice styling after answered
                  let wrap =
                    selected
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50';

                  if (mode === 'PRACTICE' && fb) {
                    const isCorrectChoice = idsEqual(c.id, correctId);
                    const isSelectedWrong = selected && !fb.isCorrect;

                    if (isCorrectChoice) wrap = 'border-green-600 bg-green-50 shadow-md';
                    if (isSelectedWrong) wrap = 'border-red-600 bg-red-50 shadow-md';
                    // lock others a bit
                    if (!selected && !isCorrectChoice) wrap = 'border-slate-100 bg-white opacity-80';
                  }

                  return (
                    <label
                      key={c.id}
                      className={`group cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] ${wrap}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                          selected ? 'border-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                        }`}
                      >
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                      </div>

                      <input
                        type="radio"
                        name={q.id}
                        className="hidden"
                        checked={selected}
                        onChange={() => handlePick(q, c.id, idx)}
                        disabled={mode === 'PRACTICE' && !!fb}
                      />

                      <span className={`text-lg ${selected ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                        <SafeHTML html={c.text} />
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Practice feedback box */}
              {mode === 'PRACTICE' && feedback[q.id] && (
                <div
                  className={`mt-5 p-4 rounded-xl border text-sm font-semibold ${
                    feedback[q.id].isCorrect
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {feedback[q.id].isCorrect ? '✅ Correct!' : `❌ Wrong. Correct answer: ${correctId ?? '-'}`}
                </div>
              )}

              {/* Explanation (Practice: show after answered; Exam: keep hidden here) */}
              {mode === 'PRACTICE' && feedback[q.id] && q.explanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
                  <span className="text-xl">💡</span>
                  <div>
                    <span className="font-bold block mb-1 text-blue-900">Explanation:</span>
                    <span className="leading-relaxed opacity-90">
                      <SafeHTML html={q.explanation} />
                    </span>
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setAnswers((prev) => {
                      const copy = { ...prev };
                      delete copy[q.id];
                      return copy;
                    });
                    setFeedback((prev) => {
                      const copy = { ...prev };
                      delete copy[q.id];
                      return copy;
                    });
                  }}
                  className="text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  type="button"
                >
                  Clear answer
                </button>

                <button
                  onClick={() => scrollToQuestion(Math.min(idx + 1, questions.length - 1))}
                  className="text-xs font-black px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                  type="button"
                >
                  Next →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 pb-12">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl text-white text-xl font-bold shadow-lg transition-all transform active:scale-[0.98] bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200"
          type="button"
        >
          Finish Test
        </button>

        <div className="mt-3 text-center text-xs text-slate-400">Tip: Finish will warn you if any question is empty.</div>
      </div>
    </div>
  );
}