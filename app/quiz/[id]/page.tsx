'use client';

import { useEffect, useRef, useState } from 'react';

type Choice = {
  id: string;          // "a", "b", "c", "d"
  text: string;
  isCorrect?: boolean; // quizManager burada true/false veriyor
  selected?: boolean;
};

type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
};

type AttemptPayload = {
  attemptId: string;
  test?: { title?: string; duration?: number };
  questions: Question[];
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<AttemptPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const isSubmitting = useRef(false);

  // 1) Test verisini sessionStorage'dan çek
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = sessionStorage.getItem('em_attempt_payload');
    if (!raw) {
      setData(null);
      return;
    }

    try {
      const parsed: AttemptPayload = JSON.parse(raw);

      // ID uyuşmasa bile yine de gösterelim (özellikle lokal denemede sorun çıkmasın)
      setData(parsed);

      const durationMinutes = parsed.test?.duration ?? 30;
      setTimeLeft(durationMinutes * 60);
    } catch (e) {
      console.error('Quiz: payload parse error', e);
      setData(null);
    }
  }, [params.id]);

  // 2) Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      // süre bittiyse otomatik submit
      submit();
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // 3) SUBMIT – sadece client-side, sonuç sessionStorage'a yazılır
  const submit = () => {
    if (!data || isSubmitting.current) return;
    isSubmitting.current = true;

    const { questions, attemptId, test } = data;

    let correctCount = 0;

    const detailedQuestions = questions.map((q) => {
      const selectedId = answers[q.id];

      const detailedChoices = q.choices.map((c) => {
        const isSelected = c.id === selectedId;
        const isCorrect = !!c.isCorrect;

        if (isSelected && isCorrect) {
          correctCount++;
        }

        return {
          ...c,
          selected: isSelected,
        };
      });

      return {
        ...q,
        choices: detailedChoices,
        selectedId,
      } as any;
    });

    const totalQuestions = questions.length;
    const wrongCount = totalQuestions - correctCount;
    const scorePercent =
      totalQuestions > 0
        ? Math.round((correctCount * 100) / totalQuestions)
        : 0;

    const resultPayload = {
      attemptId,
      testTitle: test?.title || 'Practice Test',
      totalQuestions,
      correctCount,
      wrongCount,
      scorePercent,
      questions: detailedQuestions,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('em_last_result', JSON.stringify(resultPayload));
      sessionStorage.removeItem('em_attempt_payload');
      window.location.href = '/result';
    }
  };

  // 4) UI durumları
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Test data not found. Please start again from the home page.
      </div>
    );
  }

  const { questions, test } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Üst Bilgi Çubuğu */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-10">
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
        {questions.map((q, idx) => (
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
              {q.choices.map((c) => (
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