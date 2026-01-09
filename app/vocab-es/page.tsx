'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dailyEnEs from '@/data/daily_en_es.json';

type VocabItem = {
  word: string;     // English
  meaning: string;  // Spanish meaning
  s?: string;       // EN sentence
  t?: string;       // ES translation
};

type ChoiceId = 'a' | 'b' | 'c' | 'd';
type Choice = { id: ChoiceId; text: string; isCorrect: boolean };

type Q = {
  id: string;
  item: VocabItem;
  prompt: string;
  choices: Choice[];
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqStrings(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x || '').trim()).filter(Boolean)));
}

export default function VocabFinishSpanishPage() {
  const pool = (dailyEnEs as any[] as VocabItem[]).filter((x) => x?.word && x?.meaning);

  const [count, setCount] = useState(20);

  // ✅ hydration-safe: questions only after mount
  const [questions, setQuestions] = useState<Q[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ChoiceId>>({});
  const [isFinished, setIsFinished] = useState(false);

  const answeredSet = useMemo(() => new Set(Object.keys(answers)), [answers]);
  const answeredCount = answeredSet.size;

  const score = useMemo(() => {
    let s = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (!a) continue;
      const chosen = q.choices.find((c) => c.id === a);
      if (chosen?.isCorrect) s++;
    }
    return s;
  }, [answers, questions]);

  // mount: create session
  useEffect(() => {
    setSessionId(`ves-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  }, []);

  // generate questions on client after mount
  useEffect(() => {
    if (!sessionId) return;
    if (!pool.length) return;

    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));

    // ✅ unique meanings (Spanish)
    const allMeaningsUnique = uniqStrings(pool.map((p) => p.meaning));

    const made: Q[] = picked.map((item, idx) => {
      const correct = String(item.meaning).trim();
      const distractorPool = allMeaningsUnique.filter((m) => m !== correct);
      const distractors = shuffle(distractorPool).slice(0, 3);

      const options = shuffle([correct, ...distractors]);
      const ids: ChoiceId[] = ['a', 'b', 'c', 'd'];

      const choices: Choice[] = options.map((text, i) => ({
        id: ids[i],
        text,
        isCorrect: text === correct,
      }));

      return {
        id: `${sessionId}-${idx + 1}`,
        item,
        prompt: item.word, // English prompt
        choices,
      };
    });

    setQuestions(made);
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
  }, [sessionId, count, pool.length]);

  const current = questions[currentIndex];

  function answer(choiceId: ChoiceId) {
    if (!current || isFinished) return;

    setAnswers((prev) => ({ ...prev, [current.id]: choiceId }));

    if (currentIndex >= questions.length - 1) {
      setTimeout(() => setIsFinished(true), 120);
      return;
    }

    setTimeout(() => setCurrentIndex((i) => i + 1), 150);
  }

  function finishNow() {
    setIsFinished(true);
  }

  function restart() {
    setSessionId(`ves-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  }

  if (!pool.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="font-black text-slate-900 mb-2">Daily EN→ES data not found</div>
          <div className="text-sm text-slate-600">daily_en_es.json boş veya hatalı görünüyor.</div>
          <div className="mt-4">
            <Link className="text-blue-600 underline" href="/">
              Home →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4" />
          <div className="font-black text-slate-900">Preparing questions…</div>
          <div className="text-sm text-slate-600 mt-1">Client-side generating</div>
        </div>
      </div>
    );
  }

  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  // ✅ Finish early: show only answered
  const reviewList = isFinished ? questions.filter((q) => answeredSet.has(q.id)) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 inline-flex px-3 py-1 rounded-full">
              🇪🇸 Finish Anytime · EN → ES Vocabulary
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Daily English → Spanish Vocab Test</h1>
            <p className="text-sm text-slate-600 mt-2">
              You can press <b>Finish</b> anytime → you’ll see only the words you answered with <b>Spanish meaning + EN sentence + ES translation</b>.
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100"
          >
            ← Home
          </Link>
        </div>

        {/* Controls */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-xs text-slate-500 font-semibold">Question Count</div>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={!isFinished && answeredCount > 0}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
            >
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}Q
                </option>
              ))}
            </select>

            <div className="text-xs text-slate-500">
              Progress: <b className="text-slate-800">{answeredCount}/{questions.length}</b> · Score:{' '}
              <b className="text-slate-800">{score}</b>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={finishNow}
              className="px-4 py-2 rounded-xl font-black text-sm text-white
                         bg-gradient-to-r from-fuchsia-600 to-rose-600
                         hover:from-fuchsia-700 hover:to-rose-700
                         shadow-lg shadow-rose-200"
            >
              Finish
            </button>

            <button
              onClick={restart}
              className="px-4 py-2 rounded-xl font-black text-sm text-white
                         bg-gradient-to-r from-emerald-600 to-teal-600
                         hover:from-emerald-700 hover:to-teal-700
                         shadow-lg shadow-emerald-200"
            >
              New Test
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isFinished && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span>
                Question {currentIndex + 1} / {questions.length}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* Quiz */}
        {!isFinished && current && (
          <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="text-xs text-slate-500 font-bold mb-2">Choose the Spanish meaning:</div>
            <div className="text-4xl font-black text-slate-900 mb-6">{current.prompt}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.choices.map((c) => {
                const picked = answers[current.id] === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => answer(c.id)}
                    className={`text-left px-4 py-4 rounded-2xl border font-bold transition
                      ${picked ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2 uppercase">{c.id})</span>
                    {c.text}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 text-xs text-slate-500">
              Tip: You can press <b>Finish</b> anytime.
            </div>
          </div>
        )}

        {/* Finished Review */}
        {isFinished && (
          <div className="mt-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <div className="font-black text-emerald-800">
                Finished ✅ Score: {score} / {questions.length}
              </div>
              <div className="text-sm text-emerald-700 mt-1">Only answered words are shown below.</div>
            </div>

            {reviewList.length === 0 ? (
              <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 text-slate-700">
                You finished without answering 🙂 Tap <b>New Test</b> to try again.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {reviewList.map((q, i) => {
                  const chosenId = answers[q.id];
                  const chosen = q.choices.find((c) => c.id === chosenId);
                  const ok = chosen?.isCorrect;

                  return (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-black text-slate-900 text-lg">
                          {i + 1}. {q.item.word}
                        </div>
                        <div className={`text-xs font-black px-3 py-1 rounded-full ${ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {ok ? 'Correct' : 'Wrong'}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-slate-700">
                        <b>Spanish meaning:</b> {q.item.meaning}
                      </div>

                      <div className="mt-3 grid gap-2">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                          <div className="text-xs font-black text-slate-500 mb-1">EN Sentence (s)</div>
                          <div>{q.item.s || '—'}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                          <div className="text-xs font-black text-slate-500 mb-1">ES Translation (t)</div>
                          <div>{q.item.t || '—'}</div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-slate-500">
                        Your answer: <b className="text-slate-800">{chosen?.text}</b>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <button
                onClick={restart}
                className="px-5 py-3 rounded-2xl font-black text-white
                           bg-gradient-to-r from-emerald-600 to-teal-600
                           hover:from-emerald-700 hover:to-teal-700
                           shadow-lg shadow-emerald-200"
              >
                🔁 New Test
              </button>
              <Link
                href="/"
                className="px-5 py-3 rounded-2xl font-black text-slate-800 bg-white border border-slate-200 hover:bg-slate-100"
              >
                ← Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
