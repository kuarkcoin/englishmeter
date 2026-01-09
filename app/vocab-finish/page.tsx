'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ydsVocabulary from '@/data/yds_vocabulary_enriched.json';

type VocabItem = {
  word: string;
  meaning: string;
  s?: string; // english sentence
  t?: string; // turkish translation
};

type Choice = { id: 'a' | 'b' | 'c' | 'd'; text: string; isCorrect: boolean };

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(arr: T[], n: number) {
  return shuffle(arr).slice(0, n);
}

export default function VocabFinishPage() {
  const pool = (ydsVocabulary as any[] as VocabItem[]).filter((x) => x?.word && x?.meaning);

  const [count, setCount] = useState(20);
  const [seed, setSeed] = useState(0);

  // “Start new” için seed değiştiriyoruz
  useEffect(() => {
    setSeed(Date.now());
  }, []);

  const questions = useMemo(() => {
    // seed’i kullanarak deterministik yapmak istersen burada LCG de koyarız.
    const picked = pickN(pool, Math.min(count, pool.length));

    return picked.map((item, idx) => {
      const correct = item.meaning;
      const distractors = pickN(
        pool
          .filter((w) => w.meaning && w.meaning !== correct)
          .map((w) => w.meaning),
        3
      );

      const options = shuffle([...distractors, correct]);
      const ids: Choice['id'][] = ['a', 'b', 'c', 'd'];

      const choices: Choice[] = options.map((text, i) => ({
        id: ids[i],
        text,
        isCorrect: text === correct,
      }));

      return {
        id: `vf-${seed}-${idx + 1}`,
        item,
        prompt: item.word,
        choices,
      };
    });
  }, [pool, count, seed]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Choice['id']>>({});
  const [isFinished, setIsFinished] = useState(false);

  const current = questions[currentIndex];

  const answeredCount = Object.keys(answers).length;

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

  function answer(choiceId: Choice['id']) {
    if (!current || isFinished) return;
    setAnswers((prev) => ({ ...prev, [current.id]: choiceId }));

    // otomatik next (istersen kapatırız)
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 150);
    }
  }

  function finishNow() {
    setIsFinished(true);
  }

  function restart() {
    setSeed(Date.now());
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="font-black text-slate-900 mb-2">Vocabulary data not found</div>
          <div className="text-sm text-slate-600">yds_vocabulary.json boş veya hatalı görünüyor.</div>
          <div className="mt-4">
            <Link className="text-blue-600 underline" href="/">
              Home →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black text-cyan-700 bg-cyan-50 border border-cyan-200 inline-flex px-3 py-1 rounded-full">
              ✅ Finish Anytime · Vocabulary Test
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Vocab Test (Free Mode)</h1>
            <p className="text-sm text-slate-600 mt-2">
              İstediğin an <b>Finish</b> bas → o ana kadar gelen kelimelerin <b>meaning + s + t</b> çıktısı gelsin.
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
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 font-semibold">Question Count</div>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={!isFinished && answeredCount > 0} // başladıktan sonra değiştirmesin
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
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800"
            >
              Finish
            </button>
            <button
              onClick={restart}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100"
            >
              New Test
            </button>
          </div>
        </div>

        {/* Quiz */}
        {!isFinished && current && (
          <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="text-xs text-slate-500 font-bold mb-2">
              Question {currentIndex + 1} / {questions.length}
            </div>

            <div className="text-4xl font-black text-slate-900 mb-6">{current.prompt}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.choices.map((c) => {
                const picked = answers[current.id] === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => answer(c.id)}
                    className={`text-left px-4 py-4 rounded-2xl border font-bold transition
                      ${
                        picked
                          ? 'bg-blue-50 border-blue-300 text-blue-900'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                  >
                    <span className="mr-2 uppercase">{c.id})</span>
                    {c.text}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 text-xs text-slate-500">
              İpucu: İstediğin an yukarıdan <b>Finish</b> basabilirsin.
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
              <div className="text-sm text-emerald-700 mt-1">
                Aşağıda çıkan kelimelerin <b>Türkçe anlamı + s + t</b> gösteriliyor.
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {questions.map((q, i) => {
                const chosenId = answers[q.id];
                const chosen = q.choices.find((c) => c.id === chosenId);
                const ok = chosen?.isCorrect;

                return (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-black text-slate-900 text-lg">
                        {i + 1}. {q.item.word}
                      </div>
                      <div
                        className={`text-xs font-black px-3 py-1 rounded-full ${
                          chosenId ? (ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800') : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {chosenId ? (ok ? 'Correct' : 'Wrong') : 'Not answered'}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-700">
                      <b>Meaning:</b> {q.item.meaning}
                    </div>

                    <div className="mt-3 grid gap-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                        <div className="text-xs font-black text-slate-500 mb-1">EN Sentence (s)</div>
                        <div>{q.item.s || '—'}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                        <div className="text-xs font-black text-slate-500 mb-1">TR Translation (t)</div>
                        <div>{q.item.t || '—'}</div>
                      </div>
                    </div>

                    {chosenId && (
                      <div className="mt-3 text-xs text-slate-500">
                        Your answer: <b className="text-slate-800">{chosen?.text}</b>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
