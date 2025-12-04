'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Sayfa yönlendirmesi için

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

// --- HELPER: TEXT FORMATTER (BADGE) ---
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

  // 3) SUBMIT & SAVE MISTAKES (ÖNEMLİ KISIM BURASI)
  const handleSubmit = () => {
    if (!data) return;

    const { questions } = data;
    let correctCount = 0;
    const mistakesToSave: any[] = []; // Kaydedilecek hatalar listesi

    questions.forEach((q) => {
      const userAnswerId = answers[q.id];
      const correctChoiceId = getCorrectChoiceId(q);

      if (idsEqual(userAnswerId, correctChoiceId)) {
        correctCount++;
      } else {
        // YANLIŞ CEVAP: Bunu listeye ekle
        mistakesToSave.push({
          ...q,
          myWrongAnswer: userAnswerId, // Hangi şıkkı yanlış işaretlediğini de kaydedelim
          savedAt: new Date().toISOString(),
          testTitle: data.test.title
        });
      }
    });

    // --- LOCAL STORAGE KAYIT İŞLEMİ ---
    // Mevcut hataları çek, yenileri ekle
    const existingMistakesRaw = localStorage.getItem('my_mistakes');
    const existingMistakes = existingMistakesRaw ? JSON.parse(existingMistakesRaw) : [];
    
    // Aynı soruları tekrar eklememek için ID kontrolü yaparak birleştir
    // (Yeni hataları ekliyoruz)
    const newMistakes = [...existingMistakes];
    mistakesToSave.forEach(newItem => {
      // Eğer bu soru zaten listede yoksa ekle
      if (!newMistakes.find((item: any) => item.id === newItem.id)) {
        newMistakes.push(newItem);
      }
    });

    localStorage.setItem('my_mistakes', JSON.stringify(newMistakes));
    // ----------------------------------

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
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>
          
          {/* SCORE BOARD */}
          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 mt-6">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-blue-600">{score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex flex-col">
              <span className={`text-4xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                {percentage}%
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Back to Home
            </a>
            
            {/* YENİ BUTON: HATALARIM */}
            <Link href="/mistakes" className="px-6 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors border border-red-200 flex items-center justify-center gap-2">
              <span>📕</span> My Mistakes
            </Link>
          </div>
        </div>

        {/* DETAILED ANALYSIS (Burayı kısalttım, aynı mantıkla devam ediyor) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-700 ml-2 border-l-4 border-blue-500 pl-3">Detailed Analysis</h2>
          {questions.map((q, idx) => {
            const userAnswerId = answers[q.id];
            const correctId = getCorrectChoiceId(q);
            const isCorrect = idsEqual(userAnswerId, correctId);
            
            return (
              <div key={q.id} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'border-green-200 bg-green-50/40' : 'border-red-200 bg-red-50/40'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isCorrect ? '✓' : '✕'}
                  </div>
                  <div className="flex-grow">
                    <div className="text-lg font-medium text-slate-800 mb-4 leading-loose">
                       {formatText(q.prompt)}
                    </div>
                    {/* Şıklar ve Açıklama buraya gelecek (kodun önceki haliyle aynı) */}
                     <div className="grid gap-2">
                      {(q.choices || []).map((c) => {
                        const isSelected = idsEqual(userAnswerId, c.id);
                        const isTheCorrectAnswer = idsEqual(c.id, correctId);
                        let optionClass = 'p-3 rounded-lg border flex items-center justify-between ';
                        if (isTheCorrectAnswer) optionClass += 'bg-green-100 border-green-300 text-green-800 font-bold';
                        else if (isSelected) optionClass += 'bg-red-100 border-red-300 text-red-800 font-medium';
                        else optionClass += 'bg-white/60 border-slate-200 text-slate-500 opacity-70';
                        return (
                          <div key={c.id} className={optionClass}>
                            <div className="flex items-center gap-3">
                               <span>{c.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
                        <span className="font-bold">Explanation:</span> {q.explanation}
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
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20">
        <div className="text-sm font-semibold text-slate-700">{test?.title}</div>
        <div className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
          {timeLeft !== null ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-400 font-bold mb-3 uppercase">Question {idx + 1}</div>
            <div className="text-xl font-medium text-slate-800 mb-6 leading-loose">
              {formatText(q.prompt)}
            </div>
            <div className="grid gap-3">
              {(q.choices || []).map((c) => (
                <label key={c.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === c.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-300'}`}>
                  <input type="radio" name={q.id} className="hidden" checked={answers[q.id] === c.id} onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: c.id }))} />
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${answers[q.id] === c.id ? 'border-blue-600' : 'border-slate-300'}`}>
                    {answers[q.id] === c.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                  <span className={answers[q.id] === c.id ? 'text-blue-700 font-medium' : 'text-slate-600'}>{c.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 pb-12">
        <button onClick={handleSubmit} className="w-full py-4 rounded-xl text-white text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg">
          Finish Test
        </button>
      </div>
    </div>
  );
}
