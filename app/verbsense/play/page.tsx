'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import questions from '@/data/verbsense_questions.json';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

type VerbSenseQ = {
  id: string;
  level: Level;
  sentence: string; // contains ___
  options: string[];
  correct: number;
  explanation: string;
};

function cx(...arr: Array<string | false | undefined | null>) {
  return arr.filter(Boolean).join(' ');
}

export default function VerbSensePlayPage() {
  const data = questions as VerbSenseQ[];
  const [idx, setIdx] = useState(0);
  const q = useMemo(() => data[idx % data.length], [data, idx]);

  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const answered = picked !== null;
  const correct = answered && picked === q.correct;

  const renderedSentence = useMemo(() => {
    const verb = picked === null ? '___' : q.options[picked];
    return q.sentence.replace('___', verb);
  }, [q.sentence, q.options, picked]);

  const pick = (i: number) => {
    if (locked) return;
    setPicked(i);
    setLocked(true);
  };

  const reset = () => {
    setPicked(null);
    setLocked(false);
  };

  const next = () => {
    setIdx((v) => v + 1);
    reset();
  };

  const btnState = (i: number) => {
    if (!answered) return 'idle';
    if (i === q.correct) return 'correct';
    if (picked === i && i !== q.correct) return 'wrong';
    return 'idle';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-4 flex items-center justify-between">
        <Link href="/verbsense" className="text-slate-500 hover:text-slate-900 font-black flex items-center gap-2">
          <span className="inline-flex w-9 h-9 rounded-2xl bg-white border border-slate-200 items-center justify-center">←</span>
          Verb Sense
        </Link>
        <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-sm">
          Q {idx + 1} / {data.length}
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-4">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-[11px] font-black uppercase tracking-wider">
            Fill the verb · {q.level}
          </div>

          <div className="mt-4 text-2xl md:text-3xl font-black text-slate-900 leading-snug">
            {renderedSentence}
          </div>

          <div className="mt-2 text-sm text-slate-500 font-semibold">
            Choose the most natural verb in spoken English.
          </div>
        </div>

        {/* Options */}
        <div className="mt-4 grid gap-3">
          {q.options.map((opt, i) => {
            const st = btnState(i);
            const base =
              'w-full rounded-3xl px-5 py-4 text-left font-extrabold text-lg border transition-all active:scale-[0.99]';
            const idle = 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50';
            const ok = 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200';
            const bad = 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200';
            const dim = answered && st === 'idle' ? 'opacity-60' : '';

            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={locked}
                className={cx(base, st === 'idle' && idle, st === 'correct' && ok, st === 'wrong' && bad, dim)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="uppercase tracking-wide">{opt}</span>
                  {answered && st === 'correct' && <span className="text-sm font-black bg-white/15 px-3 py-1 rounded-full">✅</span>}
                  {answered && st === 'wrong' && <span className="text-sm font-black bg-white/15 px-3 py-1 rounded-full">❌</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
            <div
              className={cx(
                'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider',
                correct ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'
              )}
            >
              {correct ? '✅ Nice!' : '⚠️ Not quite'}
            </div>

            <div className="mt-3 text-slate-800 font-semibold leading-relaxed">
              {q.explanation}
            </div>

            {!correct && (
              <div className="mt-2 text-sm text-slate-500 font-semibold">
                Correct: <span className="text-slate-900 font-black">{q.options[q.correct]}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-extrabold hover:bg-slate-50 active:scale-95"
          >
            Reset
          </button>

          <button
            onClick={next}
            disabled={!answered}
            className="flex-1 px-5 py-3 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}