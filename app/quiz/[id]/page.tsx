'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  duration?: number;
}

interface QuizData {
  attemptId: string;
  testSlug?: string; // --- YENİ EKLENDİ: Tekrar başlatma özelliği için gerekli
  test: TestInfo;
  questions: Question[];
  error?: string;
}

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

// --- HELPER: TEXT FORMATTER (BADGE & CLEAN QUOTES) ---
function formatText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      let content = part.slice(2, -2);
      // Tırnak işaretlerini temizle
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
    return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
  });
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [data, setData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

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
      let duration = qCount * 60; 
      if (duration === 0) duration = 30 * 60;
      setTimeLeft(duration);
    } catch (err) {
      setData({ attemptId: '', test: { title: 'Error', duration: 0 }, questions: [], error: 'Data corrupted.' });
    }
  }, [params.id]);

  // 2) TIMER
  useEffect(() => {
    if (timeLeft === null || showResult) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timerId = setInterval(() => setTimeLeft((p) => (p !== null && p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, showResult]);

  // 3) SUBMIT & SAVE MISTAKES
  const handleSubmit = () => {
    if (!data) return;

    const { questions } = data;
    let correctCount = 0;

    // Önce mevcut hataları çekelim
    const existingMistakesRaw = localStorage.getItem('my_mistakes');
    let mistakeList: any[] = existingMistakesRaw ? JSON.parse(existingMistakesRaw) : [];

    questions.forEach((q) => {
      const userAnswerId = answers[q.id];
      const correctChoiceId = getCorrectChoiceId(q);
      const isCorrect = idsEqual(userAnswerId, correctChoiceId);

      // Skoru hesapla
      if (isCorrect) {
        correctCount++;
      }

      // --- HATA KAYIT MANTIĞI ---
      // Sadece cevap verilmişse işlem yap
      if (userAnswerId) {
        if (isCorrect) {
          // DOĞRU CEVAP: Hata listesinden sil
          mistakeList = mistakeList.filter((m) => m.id !== q.id);
        } else {
          // YANLIŞ CEVAP: Listeye ekle (zaten yoksa)
          const alreadyExists = mistakeList.find((m) => m.id === q.id);
          if (!alreadyExists) {
            mistakeList.push({
              ...q,
              myWrongAnswer: userAnswerId,
              savedAt: new Date().toISOString(),
              testTitle: data.test.title
            });
          }
        }
      }
    });

    // Güncellenmiş listeyi kaydet
    localStorage.setItem('my_mistakes', JSON.stringify(mistakeList));

    setScore(correctCount);
    setShowResult(true);
    window.scrollTo(0, 0);
    sessionStorage.removeItem('em_attempt_payload');
  };

  if (!data) return <div className="p-10 text-center animate-pulse">Loading...</div>;
  if (data.error) return <div className="p-10 text-red-600">{data.error}</div>;

  const { questions, test } = data;

  // --- RESULT SCREEN ---
  if (showResult) {
    const total = questions.length || 1;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* SCORE CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>

          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 mt-6">
            {/* CORRECT */}
            <div className="flex flex-col">
              <span className="text-4xl font-black text-blue-600">{score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>
            </div>

            <div className="w-px h-12 bg-slate-200" />

            {/* TOTAL */}
            <div className="flex flex-col">
              <span className="text-4xl font-black text-slate-700">{questions.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
            </div>

            <div className="w-px h-12 bg-slate-200" />

            {/* SCORE */}
            <div className="flex flex-col">
              <span className={`text-4xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                {percentage}%
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            
            {/* --- YENİ EKLENEN BUTTON --- */}
            {data.testSlug && (
              <button
                onClick={() => window.location.href = `/?restart=${data.testSlug}`}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                New Test (New Questions)
              </button>
            )}
            {/* --------------------------- */}

            <a href="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Back to Home
            </a>
            <Link href="/mistakes" className="px-6 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors border border-red-200 flex items-center justify-center gap-2">
              <span>📕</span> My Mistakes
            </Link>
          </div>
        </div>

        {/* DETAILED ANALYSIS */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-700 ml-2 border-l-4 border-blue-500 pl-3">Detailed Analysis</h2>

          {questions.map((q, idx) => {
            const userAnswerId = answers[q.id];
            const correctId = getCorrectChoiceId(q);
            const isUserAnswered = !!userAnswerId;
            const isCorrect = idsEqual(userAnswerId, correctId);

            // Renk ve Stil Ayarları
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
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                    isCorrect ? 'bg-green-500' : !isUserAnswered ? 'bg-amber-400' : 'bg-red-500'
                  }`}>
                    {isCorrect ? '✓' : !isUserAnswered ? '−' : '✕'}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-slate-400 font-bold uppercase">Question {idx + 1}</span>
                      {!isUserAnswered && (
                        <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">SKIPPED</span>
                      )}
                    </div>

                    {/* Soru Metni */}
                    <div className="text-lg font-medium text-slate-800 mb-5 leading-loose">
                       {formatText(q.prompt)}
                    </div>

                    {/* Şıklar */}
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
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                                isTheCorrectAnswer ? 'border-green-500 bg-green-500 text-white' : 
                                isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300'
                              }`}>
                                {c.id}
                              </div>
                              <span>{c.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Açıklama */}
                    {q.explanation && (
                      <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
                        <span className="text-xl">💡</span>
                        <div>
                          <span className="font-bold block mb-1 text-blue-900">Explanation:</span>
                          <span className="leading-relaxed opacity-90">{q.explanation}</span>
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

  // --- QUIZ SOLVING SCREEN ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20 backdrop-blur-sm bg-white/90">
        <div className="text-sm font-semibold text-slate-700 truncate max-w-[220px]">
          {test?.title || 'Test'}
        </div>
        <div className={`text-lg font-bold px-4 py-2 rounded-lg border transition-colors ${
          timeLeft !== null && timeLeft < 60 
            ? 'text-red-600 bg-red-50 border-red-200 animate-pulse' 
            : 'text-blue-600 bg-blue-50 border-blue-200'
        }`}>
          {timeLeft !== null ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      {/* Questions Loop */}
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-400 font-bold mb-3 uppercase tracking-wide">
              Question {idx + 1}
            </div>

            <div className="text-xl font-medium text-slate-800 mb-6 leading-loose">
              {formatText(q.prompt)}
            </div>

            <div className="grid gap-3">
              {(q.choices || []).map((c) => (
                <label key={c.id} className={`group cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] ${
                  answers[q.id] === c.id ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'
                }`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                    answers[q.id] === c.id ? 'border-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                  }`}>
                    {answers[q.id] === c.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>

                  <input type="radio" name={q.id} className="hidden" checked={answers[q.id] === c.id} onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: c.id }))} />
                  <span className={`text-lg ${answers[q.id] === c.id ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                    {c.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 pb-12">
        <button onClick={handleSubmit} className="w-full py-4 rounded-xl text-white text-xl font-bold shadow-lg transition-all transform active:scale-[0.98] bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200">
          Finish Test
        </button>
      </div>
    </div>
  );
}
