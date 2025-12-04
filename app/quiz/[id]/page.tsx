'use client';

import { useEffect, useState } from 'react';

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
  // Farklı veri formatları için ekstra alanlar olabilir
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
  // 1) Şıklardaki isCorrect alanı
  const flagged = (q.choices || []).find((c) => c.isCorrect);
  if (flagged) return String(flagged.id).trim();

  // 2) Soru objesindeki farklı alan isimleri
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

// --- HELPER: EQUAL (A/B, 1/"1" vs) ---
function idsEqual(a?: string | null, b?: string | null): boolean {
  if (a == null || b == null) return false;
  return String(a).trim().toUpperCase() === String(b).trim().toUpperCase();
}

// --- HELPER: TEXT FORMATTER (BOLD TO BADGE) ---
// Bu fonksiyon **kelime** yapısını mavi kutucuğa çevirir
function formatText(text: string) {
  if (!text) return null;
  // Metni ** işaretlerine göre böler (regex yakalama grubuyla)
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    // Eğer parça ** ile başlıyıp bitiyorsa (Vurgulanacak kelime)
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span 
          key={index} 
          className="bg-blue-100 text-blue-700 font-extrabold px-2 py-1 rounded-md mx-1 border border-blue-200 shadow-sm inline-block transform -translate-y-0.5"
        >
          {part.slice(2, -2)} {/* ** işaretlerini temizle */}
        </span>
      );
    }
    // Normal metin (HTML etiketi varsa korumak için dangerouslySet kullanıyoruz)
    return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
  });
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [data, setData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // 1) LOAD QUIZ DATA FROM SESSION STORAGE
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = sessionStorage.getItem('em_attempt_payload');
    if (!raw) {
      setData({
        attemptId: '',
        test: { title: 'Error', duration: 0 },
        questions: [],
        error: 'Test data not found. Please start again from the home page.',
      });
      return;
    }

    try {
      const parsed: QuizData = JSON.parse(raw);

      if (parsed.attemptId !== params.id) {
        console.warn('Attempt ID mismatch, using latest payload as fallback.');
      }

      setData(parsed);

      const questionCount = parsed.questions?.length || 0;

      // KURAL: Her soru 60 saniye
      let durationSec = questionCount * 60;
      if (durationSec === 0) {
        durationSec = 30 * 60;
      }

      setTimeLeft(durationSec);
    } catch (err) {
      console.error('Failed to parse em_attempt_payload:', err);
      setData({
        attemptId: '',
        test: { title: 'Error', duration: 0 },
        questions: [],
        error: 'Test data is corrupted. Please start again.',
      });
    }
  }, [params.id]);

  // 2) TIMER LOGIC (süre bitince otomatik gönder)
  useEffect(() => {
    if (timeLeft === null || showResult) return;

    if (timeLeft <= 0) {
      // Süre bittiğinde bir kere submit et
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, showResult]);

  // 3) SUBMIT (GENELLEŞTİRİLMİŞ PUANLAMA)
  const handleSubmit = () => {
    if (!data) return;

    const { questions } = data;
    let correctCount = 0;

    questions.forEach((q) => {
      const userAnswerId = answers[q.id];
      const correctChoiceId = getCorrectChoiceId(q);

      if (idsEqual(userAnswerId, correctChoiceId)) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResult(true);
    window.scrollTo(0, 0);
    sessionStorage.removeItem('em_attempt_payload');
  };

  // --- RENDER STATES ---
  if (!data) {
    return (
      <div className="p-10 text-center text-slate-500 animate-pulse">
        Loading test...
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-10 text-center text-red-600 font-bold bg-red-50 m-4 rounded-xl">
        {data.error}
      </div>
    );
  }

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
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            Test Completed!
          </h1>
          <p className="text-slate-500 mb-8">Here is your detailed result</p>

          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 mt-2">
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-blue-600">
                {score}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">
                Correct
              </span>
            </div>
            <div className="w-px h-12 sm:h-16 bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-slate-700">
                {questions.length}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">
                Total
              </span>
            </div>
            <div className="w-px h-12 sm:h-16 bg-slate-200" />
            <div className="flex flex-col">
              <span
                className={`text-4xl sm:text-5xl font-black ${
                  percentage >= 70 ? 'text-green-500' : 'text-orange-500'
                }`}
              >
                {percentage}%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">
                Score
              </span>
            </div>
          </div>

          <a
            href="/"
            className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all transform hover:scale-105 shadow-lg"
          >
            Back to Home
          </a>
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
              <div
                key={q.id}
                className={`p-6 rounded-2xl border-2 ${cardBorder} ${cardBg}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                      isCorrect
                        ? 'bg-green-500'
                        : !isUserAnswered
                        ? 'bg-amber-400'
                        : 'bg-red-500'
                    }`}
                  >
                    {isCorrect ? '✓' : !isUserAnswered ? '−' : '✕'}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-slate-400 font-bold uppercase">
                        Question {idx + 1}
                      </span>
                      {!isUserAnswered && (
                        <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                          SKIPPED
                        </span>
                      )}
                    </div>

                    {/* UPDATED: BADGE STYLING HERE */}
                    <div className="text-lg font-medium text-slate-800 mb-5 leading-loose">
                       {formatText(q.prompt)}
                    </div>

                    <div className="grid gap-2">
                      {(q.choices || []).map((c) => {
                        const isSelected = idsEqual(userAnswerId, c.id);
                        const isTheCorrectAnswer = idsEqual(c.id, correctId);

                        let optionClass =
                          'p-3 rounded-lg border flex items-center justify-between ';

                        if (isTheCorrectAnswer) {
                          optionClass +=
                            'bg-green-100 border-green-300 text-green-800 font-bold shadow-sm';
                        } else if (isSelected) {
                          optionClass +=
                            'bg-red-100 border-red-300 text-red-800 font-medium';
                        } else {
                          optionClass +=
                            'bg-white/60 border-slate-200 text-slate-500 opacity-70';
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
                              <span>{c.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* EXPLANATION */}
                    {q.explanation && (
                      <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
                        <span className="text-xl">💡</span>
                        <div>
                          <span className="font-bold block mb-1 text-blue-900">
                            Explanation:
                          </span>
                          <span className="leading-relaxed opacity-90">
                            {q.explanation}
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

  // --- QUIZ (QUESTION SOLVING) SCREEN ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* TOP BAR */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20 backdrop-blur-sm bg-white/90">
        <div className="text-sm font-semibold text-slate-700 truncate max-w-[220px]">
          {test?.title || 'Test'}
        </div>
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

      {/* QUESTIONS */}
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="text-sm text-slate-400 font-bold mb-3 uppercase tracking-wide">
              Question {idx + 1}
            </div>
            
            {/* UPDATED: BADGE STYLING HERE */}
            <div className="text-xl font-medium text-slate-800 mb-6 leading-loose">
              {formatText(q.prompt)}
            </div>

            <div className="grid gap-3">
              {(q.choices || []).map((c) => (
                <label
                  key={c.id}
                  className={`group cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] ${
                    answers[q.id] === c.id
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                      answers[q.id] === c.id
                        ? 'border-blue-600'
                        : 'border-slate-300 group-hover:border-blue-400'
                    }`}
                  >
                    {answers[q.id] === c.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <input
                    type="radio"
                    name={q.id}
                    className="hidden"
                    checked={answers[q.id] === c.id}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: c.id }))
                    }
                  />
                  <span
                    className={`text-lg ${
                      answers[q.id] === c.id
                        ? 'text-blue-700 font-medium'
                        : 'text-slate-600'
                    }`}
                  >
                    {c.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FINISH BUTTON */}
      <div className="pt-4 pb-12">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl text-white text-xl font-bold shadow-lg transition-all transform active:scale-[0.98] bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200"
        >
          Finish Test
        </button>
      </div>
    </div>
  );
}
