'use client';
import { useEffect, useState, useRef } from 'react';

// Süre formatlayıcı (Dakika:Saniye)
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const isSubmitting = useRef(false);

  // 1) Veriyi sessionStorage'dan çek
  useEffect(() => {
    const raw = sessionStorage.getItem('em_attempt_payload');

    if (!raw) {
      setData({
        error: 'Test verisi bulunamadı. Lütfen anasayfadan testi yeniden başlatın.',
      });
      return;
    }

    const parsed = JSON.parse(raw);

    // URL'deki id ile attemptId uyuşuyorsa
    if (parsed.attemptId === params.id) {
      setData(parsed);
      if (parsed.test?.duration) {
        setTimeLeft(parsed.test.duration * 60);
      }
    } else {
      // Yine de veriyi kullanalım ama uyarı verebiliriz
      setData(parsed);
      if (parsed.test?.duration) {
        setTimeLeft(parsed.test.duration * 60);
      }
    }
  }, [params.id]);

  // 2) Sayaç
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      // Süre bittiyse otomatik submit
      submit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (!data) {
    return <div className="p-10 text-center text-lg">Loading Test...</div>;
  }

  if (data.error) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">{data.error}</div>
    );
  }

  const { questions, attemptId, test } = data;

  // --- ANA SUBMIT FONKSİYONU (GRAMMAR FOCUS → CLIENT SIDE HESAP) ---
  const submit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    // GRAMMAR / PRACTICE TESTLER → attemptId "session-" ile başlıyor
    if (attemptId && String(attemptId).startsWith('session-')) {
      let correctCount = 0;

      questions.forEach((q: any) => {
        const userAnswer = (answers[q.id] || '').toLowerCase(); // 'a'/'b'...
        const correctChoice = q.choices.find((c: any) => c.isCorrect);

        if (correctChoice && userAnswer === String(correctChoice.id).toLowerCase()) {
          correctCount++;
        }
      });

      const total = questions.length;

      alert(
        `🏁 PRACTICE TEST COMPLETED!\n\nScore: ${correctCount} / ${total}\n\n` +
          `Bu testte sonuçlar veritabanına kaydedilmiyor, sadece pratik amaçlıdır.`
      );

      sessionStorage.removeItem('em_attempt_payload');
      window.location.href = '/';
      isSubmitting.current = false;
      return;
    }

    // ESKİ SİSTEM: Quick/Mega/Vocab gibi gerçek testler için server'a post (istersen bırak)
    try {
      const res = await fetch(`/api/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Hatası (${res.status}): ${errorText}`);
      }

      const r = await res.json();
      sessionStorage.removeItem('em_attempt_payload');
      window.location.href = `/result?id=${r.attemptId}`;
    } catch (error: any) {
      alert(
        '⚠️ BİR HATA OLUŞTU:\n' +
          error.message +
          '\n\nLütfen internet bağlantınızı kontrol edip tekrar deneyin.'
      );
      isSubmitting.current = false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Üst Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-10">
        <div className="text-sm font-semibold text-slate-700">
          {test?.title || 'Test'}
        </div>
        <div
          className={`text-lg font-bold px-4 py-2 rounded-lg border ${
            timeLeft !== null && timeLeft < 60
              ? 'text-red-600 bg-red-50 border-red-200'
              : 'text-blue-600 bg-blue-50 border-blue-200'
          }`}
        >
          {timeLeft !== null ? formatTime(timeLeft) : '∞'}
        </div>
      </div>

      {/* Sorular */}
      <div className="space-y-6">
        {questions.map((q: any, idx: number) => (
          <div
            key={q.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="text-sm text-slate-400 font-bold mb-3 uppercase tracking-wide">
              Question {idx + 1}
            </div>
            <div
              className="text-xl font-medium text-slate-800 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: q.prompt }}
            />

            <div className="grid gap-3">
              {q.choices.map((c: any) => (
                <label
                  key={c.id}
                  className={`group cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    answers[q.id] === c.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
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
                      setAnswers((a) => ({
                        ...a,
                        [q.id]: c.id,
                      }))
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

      {/* Bitir Butonu */}
      <div className="pt-4 pb-12">
        <button
          onClick={submit}
          disabled={isSubmitting.current}
          className={`w-full py-4 rounded-xl text-white text-xl font-bold shadow-lg transition-all transform active:scale-95 ${
            isSubmitting.current
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
          }`}
        >
          {isSubmitting.current ? 'Processing Results...' : 'Finish Test'}
        </button>
      </div>
    </div>
  );
}