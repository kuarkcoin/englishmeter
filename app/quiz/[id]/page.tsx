'use client';

import { useEffect, useState, useRef } from 'react';

// --- TİP TANIMLAMALARI (Hata önlemek için sıkı kurallar) ---
interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: string;
  prompt: string;
  choices: Choice[];
  correct?: string;     // Doğru şık ID'si (Örn: "A")
  explanation?: string; // Açıklama metni
}

interface TestInfo {
  title: string;
  duration?: number; // Opsiyonel olabilir
}

interface QuizData {
  attemptId: string;
  test: TestInfo;
  questions: Question[];
  error?: string;
  // Backend'den dönebilecek ek cevap anahtarı alanları
  correctAnswers?: Record<string, string>; 
  explanations?: Record<string, string>;
}

// --- YARDIMCI: SÜRE FORMATI (MM:SS) ---
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
  
  // Çift tıklamayı engellemek için ref
  const isSubmitting = useRef(false);

  // 1. BAŞLANGIÇ: VERİYİ YÜKLE
  useEffect(() => {
    // Tarayıcıda çalışıp çalışmadığımızı kontrol edelim
    if (typeof window === 'undefined') return;

    const raw = sessionStorage.getItem('em_attempt_payload');
    if (raw) {
      try {
        const parsedData: QuizData = JSON.parse(raw);
        
        // ID eşleşmese bile kurtarma modunda veriyi yükle
        setData(parsedData);
          
        // --- 🕒 AKILLI SÜRE AYARI ---
        const qCount = parsedData.questions?.length || 0;
        let durationSec = 30 * 60; // Varsayılan 30 dk

        // Eğer veride geçerli bir süre varsa onu kullan
        if (parsedData.test?.duration && parsedData.test.duration > 0) {
           durationSec = parsedData.test.duration * 60;
        } 
        // Yoksa soru sayısına göre hesapla (Soru başı 72 saniye)
        else if (qCount > 0) {
           durationSec = qCount * 72; 
        }

        setTimeLeft(durationSec);

      } catch (e) {
        console.error("JSON Parse Error:", e);
        setData({ attemptId: '', test: { title: 'Error', duration: 0 }, questions: [], error: 'Veri bozuk. Lütfen testi yeniden başlatın.' });
      }
    } else {
      setData({ attemptId: '', test: { title: 'Error', duration: 0 }, questions: [], error: 'Test verisi bulunamadı.' });
    }
  }, [params.id]);

  // 2. SAYAÇ MANTIĞI
  useEffect(() => {
    if (timeLeft === null || timeLeft === 0 || showResult) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleAutoSubmit(); // Süre bitince otomatik gönder
    }

    return () => clearInterval(timerId);
  }, [timeLeft, showResult]);

  // Otomatik gönderme sarmalayıcısı
  const handleAutoSubmit = () => {
    alert("Süre doldu! Test otomatik olarak bitiriliyor...");
    submit();
  };

  // --- SUBMIT (BİTİRME) FONKSİYONU ---
  const submit = async () => {
    if (isSubmitting.current || !data) return;
    isSubmitting.current = true;

    const { questions, attemptId } = data;
    const isPractice = attemptId && String(attemptId).startsWith('session-');

    // SENARYO A: PRATİK MODU (Client-Side)
    if (isPractice) {
        finishWithLocalCalculation(questions);
        return;
    }

    // SENARYO B: GERÇEK TEST (Server-Side)
    try {
        const res = await fetch(`/api/attempts/${attemptId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        });

        if (!res.ok) {
            throw new Error(`Sunucu Hatası: ${res.status}`);
        }

        const r: QuizData = await res.json();
        
        // --- VERİ BİRLEŞTİRME (MERGE) ---
        // Sunucudan gelen cevap anahtarını mevcut sorulara ekle
        let updatedQuestions = [...questions];

        // 1. İhtimal: Sunucu tam soru listesini geri döndü
        if (r.questions && r.questions.length > 0) {
            updatedQuestions = r.questions;
        } 
        // 2. İhtimal: Sunucu sadece cevap anahtarı (map) döndü
        else if (r.correctAnswers) {
            updatedQuestions = updatedQuestions.map(q => ({
                ...q,
                correct: r.correctAnswers?.[q.id], // Doğru şıkkı ekle
                explanation: r.explanations?.[q.id] || q.explanation // Açıklamayı ekle
            }));
        }

        // Ekranı güncelle ve hesapla
        setData({ ...data, questions: updatedQuestions });
        finishWithLocalCalculation(updatedQuestions);

    } catch (error) {
        console.error("Submit Error:", error);
        alert("Sunucuya bağlanırken hata oluştu. Tahmini sonuçlar gösteriliyor.");
        // Hata olsa bile kullanıcıyı kilitleme, eldekiyle göster
        finishWithLocalCalculation(questions);
    }
  };

  // Puanı Hesapla ve Sonuç Ekranını Aç
  const finishWithLocalCalculation = (currentQuestions: Question[]) => {
    let correctCount = 0;
    currentQuestions.forEach((q) => {
      // q.correct doluysa ve kullanıcı doğru bildiyse
      if (answers[q.id] && q.correct && answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResult(true);
    window.scrollTo(0, 0);
    sessionStorage.removeItem('em_attempt_payload'); // Temizlik
    isSubmitting.current = false;
  };

  // --- YÜKLENİYOR VEYA HATA ---
  if (!data) return <div className="p-10 text-center text-slate-500 animate-pulse">Test Yükleniyor...</div>;
  if (data.error) return <div className="p-10 text-center text-red-600 font-bold bg-red-50 m-4 rounded-xl">{data.error}</div>;

  const { questions, test } = data;

  // --- SONUÇ EKRANI (KARNE) ---
  if (showResult) {
    const totalQ = questions.length || 1;
    const percentage = Math.round((score / totalQ) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-500">
        {/* Özet Kartı */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>
          
          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 mt-6">
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-blue-600">{score}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">Correct</span>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-slate-700">{questions.length}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">Total</span>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className={`text-4xl sm:text-5xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                {percentage}%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">Score</span>
            </div>
          </div>

          <a href="/" className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all transform hover:scale-105 shadow-lg">
            Back to Home
          </a>
        </div>

        {/* Detaylı Analiz */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-700 ml-2 border-l-4 border-blue-500 pl-3">Detailed Analysis</h2>
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isSkipped = !userAnswer;
            // Doğru cevap varsa kontrol et, yoksa (API hatası vs) false
            const isCorrect = q.correct ? (!isSkipped && userAnswer === q.correct) : false;
            const isKeyMissing = !q.correct; // Cevap anahtarı hiç gelmemişse

            // Kart Rengi
            let cardClass = "bg-white border-slate-200";
            if (isCorrect) cardClass = "bg-green-50/50 border-green-200";
            else if (isSkipped) cardClass = "bg-amber-50/50 border-amber-200";
            else if (!isKeyMissing) cardClass = "bg-red-50/50 border-red-200";

            return (
              <div key={q.id} className={`p-6 rounded-2xl border-2 ${cardClass} transition-all`}>
                <div className="flex items-start gap-4">
                  {/* İkon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm 
                    ${isKeyMissing ? 'bg-slate-400' : (isCorrect ? 'bg-green-500' : (isSkipped ? 'bg-amber-400' : 'bg-red-500'))}`}>
                    {isKeyMissing ? '?' : (isCorrect ? '✓' : (isSkipped ? '−' : '✕'))}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-slate-400 font-bold uppercase">Question {idx + 1}</span>
                        {isSkipped && !isKeyMissing && <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">SKIPPED</span>}
                    </div>
                    
                    <div className="text-lg font-medium text-slate-800 mb-5" dangerouslySetInnerHTML={{ __html: q.prompt }} />

                    <div className="grid gap-2">
                      {q.choices.map((c) => {
                        const isSelected = userAnswer === c.id;
                        const isTheCorrectAnswer = q.correct === c.id;

                        let optionClass = "p-3 rounded-lg border flex items-center justify-between ";
                        
                        if (isTheCorrectAnswer) {
                          // Doğru cevap HER ZAMAN YEŞİL (Kullanıcı seçmese bile)
                          optionClass += "bg-green-100 border-green-300 text-green-800 font-bold shadow-sm";
                        } else if (isSelected) {
                          // Kullanıcının seçimi (Eğer doğru değilse veya anahtar yoksa)
                          if (isKeyMissing) optionClass += "bg-blue-100 border-blue-300 text-blue-800";
                          else optionClass += "bg-red-100 border-red-300 text-red-800 font-medium";
                        } else {
                          optionClass += "bg-white/60 border-slate-200 text-slate-500 opacity-70";
                        }

                        return (
                          <div key={c.id} className={optionClass}>
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs 
                                ${isTheCorrectAnswer ? 'border-green-500 bg-green-500 text-white' : 
                                (isSelected ? (isKeyMissing ? 'border-blue-500 bg-blue-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-slate-300')}`}>
                                {c.id}
                              </div>
                              <span>{c.text}</span>
                            </div>
                            
                            {isTheCorrectAnswer && <span className="text-green-700 text-xs uppercase font-bold">Correct Answer</span>}
                            {isSelected && !isTheCorrectAnswer && !isKeyMissing && <span className="text-red-600 text-xs uppercase font-bold">Your Answer</span>}
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

  // --- SORU ÇÖZME EKRANI (NORMAL RENDER) ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Üst Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20 backdrop-blur-sm bg-white/90">
        <div className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{test?.title || 'Test'}</div>
        <div className={`text-lg font-bold px-4 py-2 rounded-lg border transition-colors
          ${timeLeft !== null && timeLeft < 60 ? 'text-red-600 bg-red-50 border-red-200 animate-pulse' : 'text-blue-600 bg-blue-50 border-blue-200'}`}>
          {timeLeft !== null ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      {/* Sorular */}
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
                  
                  <input type="radio" name={q.id} className="hidden" checked={answers[q.id] === c.id} onChange={() => setAnswers((a) => ({ ...a, [q.id]: c.id }))} />
                  <span className={`text-lg ${answers[q.id] === c.id ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>{c.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Buton */}
      <div className="pt-4 pb-12">
        <button onClick={submit} disabled={isSubmitting.current} className={`w-full py-4 rounded-xl text-white text-xl font-bold shadow-lg transition-all transform active:scale-[0.98] ${isSubmitting.current ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}>
          {isSubmitting.current ? 'Processing Results...' : 'Finish Test'}
        </button>
      </div>
    </div>
  );
}
