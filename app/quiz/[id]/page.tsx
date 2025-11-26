'use client';

import { useEffect, useState, useRef } from 'react';

// --- TYPES (DeepSeek Tavsiyesi: Type Safety) ---
interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: string;
  prompt: string;
  choices: Choice[];
  correct?: string; // Bazen API'den gizli gelebilir diye opsiyonel
  explanation?: string;
}

interface TestInfo {
  title: string;
  duration: number;
}

interface QuizData {
  attemptId: string;
  test: TestInfo;
  questions: Question[];
  error?: string;
}

// --- HELPER: TIME FORMATTER ---
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export default function Quiz({ params }: { params: { id: string } }) {
  // State tanımlarında artık 'any' yok
  const [data, setData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const isSubmitting = useRef(false);

  // 1. INITIAL DATA LOAD
  useEffect(() => {
    const raw = sessionStorage.getItem('em_attempt_payload');
    if (raw) {
      try {
        const parsedData: QuizData = JSON.parse(raw);
        // ID kontrolü veya fallback veri kullanımı
        if (parsedData.attemptId === params.id || parsedData) {
          setData(parsedData);
          if (parsedData.test?.duration) {
            setTimeLeft(parsedData.test.duration * 60);
          }
        }
      } catch (e) {
        console.error("JSON Parse Error", e);
        setData({ attemptId: '', test: { title: 'Error', duration: 0 }, questions: [], error: 'Data corrupted.' });
      }
    } else {
      setData({ attemptId: '', test: { title: 'Error', duration: 0 }, questions: [], error: 'Test data not found. Please start again.' });
    }
  }, [params.id]);

  // 2. TIMER LOGIC
  useEffect(() => {
    if (timeLeft === null || timeLeft === 0 || showResult) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }

    return () => clearInterval(timerId);
  }, [timeLeft, showResult]);

  const handleTimeout = () => {
    alert("Time is up! Submitting automatically...");
    submit();
  };

  // --- SUBMIT & CALCULATION LOGIC ---
  const submit = async () => {
    if (isSubmitting.current || !data) return;
    isSubmitting.current = true;

    const { questions, attemptId } = data;

    // 1. Skoru Hesapla (Client-Side Feedback için)
    let correctCount = 0;
    questions.forEach((q) => {
      // Cevap varsa VE doğruysa
      if (answers[q.id] && q.correct && answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);

    // 2. Senaryo Kontrolü
    const isPractice = attemptId && String(attemptId).startsWith('session-');

    if (isPractice) {
      // Sadece göster
      finishProcess();
    } else {
      // Gerçek Test: Arkada kaydet ama kullanıcıya sonucu hemen göster
      try {
        await fetch(`/api/attempts/${attemptId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        });
        // Hata olsa bile veya kayıt başarılı olsa bile sonuç ekranını gösteriyoruz
        finishProcess(); 
      } catch (error) {
        console.error("Save error:", error);
        // Veritabanı hatası olsa bile kullanıcıya sonucunu gösterelim
        alert("Warning: Result could not be saved to database due to connection error, but here is your score.");
        finishProcess();
      }
    }
  };

  const finishProcess = () => {
    setShowResult(true);
    window.scrollTo(0, 0);
    isSubmitting.current = false;
    sessionStorage.removeItem('em_attempt_payload'); // Temizlik
  };

  // --- LOADING & ERROR STATES ---
  if (!data) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading Test...</div>;
  if (data.error) return <div className="p-10 text-center text-red-600 font-bold border-red-200 bg-red-50 rounded-lg m-4">{data.error}</div>;

  const { questions, test } = data;

  // --- RENDER: RESULT SCREEN ---
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-500">
        {/* Score Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>
          <p className="text-slate-500 mb-8">Here is your detailed breakdown</p>

          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8">
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-blue-600">{score}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Correct</span>
            </div>
            <div className="w-px h-12 sm:h-16 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-slate-700">{questions.length}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Total</span>
            </div>
            <div className="w-px h-12 sm:h-16 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className={`text-4xl sm:text-5xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                {percentage}%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Score</span>
            </div>
          </div>

          <a href="/" className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all transform hover:scale-105 shadow-lg">
            Back to Home
          </a>
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-700 ml-2 border-l-4 border-blue-500 pl-3">Detailed Analysis</h2>
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isSkipped = !userAnswer;
            const isCorrect = !isSkipped && userAnswer === q.correct;
            const correctAnswerText = q.choices.find(c => c.id === q.correct)?.text || "N/A";

            // Kart Rengi Belirleme
            let cardBorderClass = "border-slate-200";
            let cardBgClass = "bg-white";
            
            if (isCorrect) {
                cardBorderClass = "border-green-200";
                cardBgClass = "bg-green-50/40";
            } else if (isSkipped) {
                cardBorderClass = "border-amber-200"; // Skipped için Sarımsı
                cardBgClass = "bg-amber-50/40";
            } else {
                cardBorderClass = "border-red-200"; // Yanlış için Kırmızı
                cardBgClass = "bg-red-50/40";
            }

            return (
              <div key={q.id} className={`p-6 rounded-2xl border-2 ${cardBorderClass} ${cardBgClass} transition-all hover:shadow-md`}>
                <div className="flex items-start gap-4">
                  {/* Durum İkonu */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm 
                    ${isCorrect ? 'bg-green-500' : (isSkipped ? 'bg-amber-400' : 'bg-red-500')}`}>
                    {isCorrect ? '✓' : (isSkipped ? '−' : '✕')}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-slate-400 font-bold uppercase">Question {idx + 1}</span>
                        {isSkipped && <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">SKIPPED</span>}
                    </div>
                    
                    <div className="text-lg font-medium text-slate-800 mb-5 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.prompt }} />

                    <div className="grid gap-2">
                      {q.choices.map((c) => {
                        const isSelected = userAnswer === c.id;
                        const isTheCorrectAnswer = q.correct === c.id;

                        let itemClass = "p-3 rounded-lg border flex items-center justify-between transition-colors ";
                        
                        if (isTheCorrectAnswer) {
                          // Doğru cevap HER ZAMAN yeşil yanmalı (Boş bıraksa bile)
                          itemClass += "bg-green-100 border-green-300 text-green-800 font-bold shadow-sm";
                        } else if (isSelected && !isTheCorrectAnswer) {
                          // Yanlış işaretlenen kırmızı
                          itemClass += "bg-red-100 border-red-300 text-red-800 font-medium";
                        } else {
                          // Diğer şıklar silik
                          itemClass += "bg-white/60 border-slate-200 text-slate-500 opacity-70";
                        }

                        return (
                          <div key={c.id} className={itemClass}>
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs 
                                ${isTheCorrectAnswer ? 'border-green-500 bg-green-500 text-white' : 
                                (isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300')}`}>
                                {c.id}
                              </div>
                              <span>{c.text}</span>
                            </div>
                            
                            {/* Etiketler */}
                            {isTheCorrectAnswer && <span className="text-green-700 text-xs uppercase font-bold">Correct Answer</span>}
                            {isSelected && !isTheCorrectAnswer && <span className="text-red-600 text-xs uppercase font-bold">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
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

  // --- RENDER: QUIZ SCREEN ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20 backdrop-blur-sm bg-white/90">
        <div className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
          {test?.title || 'Test'}
        </div>
        <div className={`text-lg font-bold px-4 py-2 rounded-lg border transition-colors
          ${timeLeft !== null && timeLeft < 60 ? 'text-red-600 bg-red-50 border-red-200 animate-pulse' : 'text-blue-600 bg-blue-50 border-blue-200'}`}>
          {timeLeft !== null ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-400 font-bold mb-3 uppercase tracking-wide">Question {idx + 1}</div>
            <div className="text-xl font-medium text-slate-800 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.prompt }} />

            <div className="grid gap-3">
              {q.choices.map((c) => (
                <label key={c.id} className={`group cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] 
                  ${answers[q.id] === c.id ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'}`}>
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors
                    ${answers[q.id] === c.id ? 'border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                    {answers[q.id] === c.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                  
                  <input
                    type="radio"
                    name={q.id}
                    className="hidden"
                    checked={answers[q.id] === c.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: c.id }))}
                  />
                  <span className={`text-lg ${answers[q.id] === c.id ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                    {c.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-4 pb-12">
        <button
          onClick={submit}
          disabled={isSubmitting.current}
          className={`w-full py-4 rounded-xl text-white text-xl font-bold shadow-lg transition-all transform active:scale-[0.98] 
            ${isSubmitting.current ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}
        >
          {isSubmitting.current ? 'Processing...' : 'Finish Test'}
        </button>
      </div>
    </div>
  );
}
