'use client';

import { useEffect, useState } from 'react';

interface Choice {
  id: string;          // "A" | "B" | "C" | "D"
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  prompt: string;
  choices: Choice[];
  explanation?: string;
}

interface TestInfo {
  title: string;
  duration?: number; // dakika cinsinden
}

interface QuizData {
  attemptId: string;
  test: TestInfo;
  questions: Question[];
  error?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `\( {m.toString().padStart(2, '0')}: \){s.toString().padStart(2, '0')}`;
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [data, setData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // 1. Veri yükleme + Akıllı süre hesaplama
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = sessionStorage.getItem('em_attempt_payload');
    if (!raw) {
      setData({
        attemptId: '',
        test: { title: 'Hata' },
        questions: [],
        error: 'Test verisi bulunamadı. Ana sayfadan tekrar başlayın.',
      });
      return;
    }

    try {
      const parsed: QuizData = JSON.parse(raw);

      if (parsed.attemptId !== params.id) {
        console.warn('Attempt ID eşleşmedi, en son veri fallback olarak kullanılıyor.');
      }

      setData(parsed);

      const questionCount = parsed.questions.length;
      const isPractice = parsed.attemptId.startsWith('session-');

      let durationSeconds: number;

      if (isPractice) {
        // Pratik testler: Soru başına 72 saniye (rahatça çözülsün diye)
        durationSeconds = questionCount * 72;
      } else if (parsed.test?.duration && parsed.test.duration > 0) {
        // Gerçek testler: Backend'den gelen süre
        durationSeconds = parsed.test.duration * 60;
      } else {
        // Fallback
        durationSeconds = questionCount > 0 ? questionCount * 72 : 30 * 60;
      }

      setTimeLeft(durationSeconds);
    } catch (err) {
      console.error('em_attempt_payload parse edilemedi:', err);
      setData({
        attemptId: '',
        test: { title: 'Hata' },
        questions: [],
        error: 'Test verisi bozulmuş. Lütfen tekrar başlayın.',
      });
    }
  }, [params.id]);

  // 2. Geri sayım
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResult) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // Süre bitti → otomatik gönder
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, showResult]);

  // 3. Testi bitir
  const handleSubmit = () => {
    if (!data?.questions) return;

    let correct = 0;
    data.questions.forEach((q) => {
      const correctId = q.choices.find((c) => c.isCorrect)?.id;
      if (correctId && answers[q.id] === correctId) correct++;
    });

    setScore(correct);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    sessionStorage.removeItem('em_attempt_payload');
  };

  // Yükleniyor / Hata
  if (!data) return <div className="p-12 text-center text-slate-500">Yükleniyor...</div>;
  if (data.error) {
    return (
      <div className="max-w-lg mx-auto mt-20 p-8 bg-red-50 border-2 border-red-200 rounded-2xl text-center">
        <p className="text-red-700 font-bold text-lg">{data.error}</p>
      </div>
    );
  }

  const { questions, test } = data;

  // SONUÇ EKRANI
  if (showResult) {
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Büyük Skor Kartı */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <h1 className="text-4xl font-black text-slate-800 mt-6">Test Tamamlandı!</h1>
          <p className="text-slate-500 mt-2 mb-10">İşte detaylı sonuçların</p>

          <div className="flex justify-center items-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-6xl font-black text-blue-600">{score}</div>
              <div className="text-sm font-bold text-slate-400 uppercase">Doğru</div>
            </div>
            <div className="w-px h-20 bg-slate-300" />
            <div className="text-center">
              <div className="text-6xl font-black text-slate-700">{total}</div>
              <div className="text-sm font-bold text-slate-400 uppercase">Toplam</div>
            </div>
            <div className="w-px h-20 bg-slate-300" />
            <div className="text-center">
              <div className={`text-6xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                {percentage}%
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase">Başarı</div>
            </div>
          </div>

          <a
            href="/"
            className="inline-block px-10 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Ana Sayfaya Dön
          </a>
        </div>

        {/* Detaylı Analiz */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-indigo-500 pl-4">
            Soru Bazında Analiz
          </h2>
          <div className="space-y-6">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const correctId = q.choices.find((c) => c.isCorrect)?.id;
              const isCorrect = userAns === correctId;
              const isSkipped = !userAns;

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-2xl border-2 ${
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : isSkipped
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      isCorrect ? 'bg-green-500' : isSkipped ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Wrong'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-600">Soru {i + 1}</span>
                        {isSkipped && <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-bold">ATLANDI</span>}
                      </div>
                      <div className="text-lg text-slate-800 mb-4" dangerouslySetInnerHTML={{ __html: q.prompt }} />

                      <div className="space-y-2">
                        {q.choices.map((c) => {
                          const selected = userAns === c.id;
                          const right = c.isCorrect;

                          return (
                            <div
                              key={c.id}
                              className={`p-4 rounded-xl border flex items-center justify-between ${
                                right
                                  ? 'bg-green-100 border-green-400 text-green-900 font-bold'
                                  : selected
                                  ? 'bg-red-100 border-red-400 text-red-900'
                                  : 'bg-gray-50 border-gray-200 text-gray-500'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                  right ? 'bg-green-600' : selected ? 'bg-red-600' : 'bg-gray-400'
                                }`}>
                                  {c.id}
                                </div>
                                <span>{c.text}</span>
                              </div>
                              {right && <span className="text-xs font-bold uppercase">Doğru Cevap</span>}
                              {selected && !right && <span className="text-xs font-bold uppercase text-red-700">Senin Cevabın</span>}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="mt-5 p-5 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
                          <span className="text-2xl">Lightbulb</span>
                          <div>
                            <strong className="block text-blue-900 mb-1">Açıklama:</strong>
                            <p className="text-blue-800">{q.explanation}</p>
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
      </div>
    );
  }

  // SORU ÇÖZME EKRANI
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Üst Bar */}
      <div className="sticky top-4 z-30 bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-slate-200 p-5 flex justify-between items-center mb-8">
        <h2 className="font-bold text-lg text-slate-700 truncate max-w-[60%]">
          {test.title || 'Test'}
        </h2>
        <div className={`px-5 py-3 rounded-xl font-bold text-lg border-2 ${
          timeLeft !== null && timeLeft < 60
            ? 'text-red-600 bg-red-50 border-red-300 animate-pulse'
            : 'text-blue-600 bg-blue-50 border-blue-300'
        }`}>
          {timeLeft !== null ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      {/* Sorular */}
      <div className="space-y-10">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
            <div className="text-sm font-bold text-slate-400 uppercase mb-4">Soru {i + 1}</div>
            <div className="text-xl text-slate-800 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.prompt }} />

            <div className="space-y-4">
              {q.choices.map((choice) => {
                const selected = answers[q.id] === choice.id;

                return (
                  <label
                    key={choice.id}
                    className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                      selected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-5 transition-all ${
                      selected ? 'border-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                    }`}>
                      {selected && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                    </div>

                    <input
                      type="radio"
                      name={q.id}
                      value={choice.id}
                      checked={selected}
                      onChange={() => setAnswers(prev => ({ ...prev, [q.id]: choice.id }))}
                      className="hidden"
                    />

                    <span className={`text-lg ${selected ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>
                      {choice.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bitir Butonu */}
      <div className="mt-12 pb-20 text-center">
        <button
          onClick={handleSubmit}
          className="w-full max-w-md py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
        >
          Testi Bitir → 
        </button>
      </div>
    </div>
  );
}