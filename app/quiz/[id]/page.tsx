'use client';

import { useEffect, useState } from 'react';

// --- TİPLER ---
interface Choice {
  id: string;          
  text: string;
  isCorrect?: boolean; 
}

interface Question {
  id: string;
  prompt: string;
  choices?: Choice[]; // İsteğe bağlı yaptık çünkü tamir edeceğiz
  // Gramer sorusu formatı için ek alanlar:
  A?: string;
  B?: string;
  C?: string;
  D?: string;
  correct?: string;
  explanation?: string;
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

// --- ZAMAN FORMATLAYICI ---
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [data, setData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // 1) VERİYİ YÜKLE VE ANINDA TAMİR ET (AUTO-FIX)
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

      // --- SİHİRLİ DOKUNUŞ: VERİYİ BURADA TAMİR EDİYORUZ ---
      // Eğer soru Gramer formatındaysa (Flat), Quiz formatına (Nested) çevir.
      const fixedQuestions = parsed.questions.map((q, index) => {
        
        // Eğer zaten düzgün formatta choices varsa dokunma
        if (q.choices && Array.isArray(q.choices) && q.choices.length > 0) {
          return q;
        }

        // Eğer GRAMER SORUSU ise (choices yok ama A, B ve correct var)
        if (q.A && q.correct) {
          console.log(`Gramer sorusu onarılıyor: ${index + 1}`);
          const correctVal = q.correct.trim(); // Boşluk varsa temizle
          
          return {
            ...q,
            id: q.id || `g-${index}`,
            choices: [
              { id: 'A', text: q.A, isCorrect: correctVal === 'A' },
              { id: 'B', text: q.B, isCorrect: correctVal === 'B' },
              { id: 'C', text: q.C || '', isCorrect: correctVal === 'C' },
              { id: 'D', text: q.D || '', isCorrect: correctVal === 'D' },
            ].filter(c => c.text) // Boş şık varsa temizle
          };
        }
        
        // Eğer KELİME SORUSU ise (word/definition var ama choices yok)
        // (Tip hatasını önlemek için 'any' kullanıyoruz)
        const item = q as any;
        if (item.word && item.definition && !item.choices) {
            return {
             ...q,
             id: `w-${index}`,
             prompt: `What is the definition of "<strong>${item.word}</strong>"?`,
             explanation: `${item.word}: ${item.definition}`,
             choices: [
               { id: 'A', text: item.definition, isCorrect: true },
               { id: 'B', text: "Incorrect definition 1", isCorrect: false },
               { id: 'C', text: "Incorrect definition 2", isCorrect: false }
             ]
           };
        }

        return q;
      });

      // Tamir edilmiş soruları veriye geri koy
      parsed.questions = fixedQuestions as Question[];
      setData(parsed);

      // --- ZAMAN AYARLAMASI ---
      const questionCount = parsed.questions?.length || 0;
      let durationSec = questionCount * 60; // Her soru 60 saniye

      if (durationSec === 0) durationSec = 30 * 60; // Fallback
      setTimeLeft(durationSec);

    } catch (err) {
      console.error('Failed to parse quiz data:', err);
      setData({
        attemptId: '',
        test: { title: 'Error', duration: 0 },
        questions: [],
        error: 'Test data corrupted.',
      });
    }
  }, [params.id]);

  // 2) SAYAÇ MANTIĞI
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResult) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleSubmit();
    }
    return () => clearInterval(timerId);
  }, [timeLeft, showResult]);

  // 3) TESTİ BİTİR VE PUANLA
  const handleSubmit = () => {
    if (!data) return;

    const { questions } = data;
    let correctCount = 0;

    questions.forEach((q) => {
      // Sorunun şıkları yoksa (tamir edilemediyse) geç
      if (!q.choices) return;

      const userAnswerId = answers[q.id];
      // Doğru şıkkı bul
      const correctChoice = q.choices.find((c) => c.isCorrect === true || String(c.isCorrect) === 'true');
      const correctId = correctChoice?.id;

      // Puanlama (String ve Trim kullanarak %100 eşleşme sağla)
      if (
        userAnswerId && 
        correctId && 
        String(userAnswerId).trim() === String(correctId).trim()
      ) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResult(true);
    window.scrollTo(0, 0);
    // sessionStorage.removeItem('em_attempt_payload'); // Debug için yorumda kalsın
  };

  // --- YÜKLENİYOR / HATA EKRANLARI ---
  if (!data) return <div className="p-10 text-center animate-pulse">Loading test...</div>;
  if (data.error) return <div className="p-10 text-center text-red-600 font-bold">{data.error}</div>;

  const { questions, test } = data;

  // --- SONUÇ EKRANI ---
  if (showResult) {
    const total = questions.length || 1;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>
          
          <div className="flex justify-center items-center gap-8 mb-8 mt-6">
            <div className="flex flex-col">
              <span className="text-5xl font-black text-blue-600">{score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>
            </div>
            <div className="w-px h-16 bg-slate-200" />
            <div className="flex flex-col">
              <span className={`text-5xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>{percentage}%</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
            </div>
          </div>
          <a href="/" className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all">Back to Home</a>
        </div>

        {/* DETAYLI ANALİZ */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-700 ml-2 border-l-4 border-blue-500 pl-3">Detailed Analysis</h2>
          {questions.map((q, idx) => {
            if (!q.choices) return null; // Güvenlik

            const userAnswerId = answers[q.id];
            const correctChoice = q.choices.find((c) => c.isCorrect === true || String(c.isCorrect) === 'true');
            const correctId = correctChoice?.id;
            const isCorrect = userAnswerId && correctId && String(userAnswerId).trim() === String(correctId).trim();
            const isSkipped = !userAnswerId;

            return (
              <div key={q.id} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'border-green-200 bg-green-50/40' : isSkipped ? 'border-amber-200 bg-amber-50/40' : 'border-red-200 bg-red-50/40'}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect ? 'bg-green-500' : isSkipped ? 'bg-amber-400' : 'bg-red-500'}`}>
                    {isCorrect ? '✓' : isSkipped ? '−' : '✕'}
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm text-slate-400 font-bold mb-2">QUESTION {idx + 1}</div>
                    <div className="text-lg font-medium text-slate-800 mb-4" dangerouslySetInnerHTML={{ __html: q.prompt }} />
                    
                    <div className="grid gap-2">
                      {q.choices.map((c) => {
                        const isSelected = String(userAnswerId) === String(c.id);
                        const isTheCorrectOne = c.isCorrect === true || String(c.isCorrect) === 'true';
                        
                        let style = 'p-3 rounded-lg border flex justify-between items-center ';
                        if (isTheCorrectOne) style += 'bg-green-100 border-green-300 text-green-900 font-bold';
                        else if (isSelected) style += 'bg-red-100 border-red-300 text-red-900';
                        else style += 'bg-white/60 border-slate-200 text-slate-500';

                        return (
                          <div key={c.id} className={style}>
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${isTheCorrectOne ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>{c.id}</span>
                              <span>{c.text}</span>
                            </div>
                            {isTheCorrectOne && <span className="text-xs uppercase font-bold text-green-700">Correct</span>}
                            {isSelected && !isTheCorrectOne && <span className="text-xs uppercase font-bold text-red-700">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex gap-2">
                        <span>💡</span>
                        <span>{q.explanation}</span>
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

  // --- SORU ÇÖZME EKRANI ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20">
        <div className="text-sm font-semibold truncate max-w-[200px]">{test?.title || 'Test'}</div>
        <div className={`text-lg font-bold px-4 py-2 rounded-lg border ${timeLeft !== null && timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
          {timeLeft !== null ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          q.choices && (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-sm text-slate-400 font-bold mb-3">QUESTION {idx + 1}</div>
              <div className="text-xl font-medium text-slate-800 mb-6" dangerouslySetInnerHTML={{ __html: q.prompt }} />
              <div className="grid gap-3">
                {q.choices.map((c) => (
                  <label key={c.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === c.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${answers[q.id] === c.id ? 'border-blue-600' : 'border-slate-300'}`}>
                      {answers[q.id] === c.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <input type="radio" name={q.id} className="hidden" checked={answers[q.id] === c.id} onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: c.id }))} />
                    <span className={`text-lg ${answers[q.id] === c.id ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>{c.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="pt-4 pb-12">
        <button onClick={handleSubmit} className="w-full py-4 rounded-xl text-white text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg transition-all">Finish Test</button>
      </div>
    </div>
  );
}
