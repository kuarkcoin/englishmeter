'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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

// --- TTS (Browser Speech) ---
function speak(text: string, accent: 'en-US' | 'en-GB' = 'en-US', rate = 0.95) {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = accent;
  u.rate = rate;
  u.pitch = 1;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

// --- Tiny SFX (no audio files) ---
function beep(type: 'ok' | 'bad') {
  if (typeof window === 'undefined') return;
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();

  o.type = 'sine';
  o.frequency.value = type === 'ok' ? 880 : 220;

  g.gain.value = 0.0001;

  o.connect(g);
  g.connect(ctx.destination);

  const now = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  o.start(now);
  o.stop(now + 0.2);

  o.onended = () => {
    try {
      ctx.close();
    } catch {
      // ignore
    }
  };
}

function vibrate(ms: number) {
  if (typeof navigator === 'undefined') return;
  const n: any = navigator;
  if ('vibrate' in n) n.vibrate(ms);
}

export default function VerbSensePlayPage() {
  const data = questions as VerbSenseQ[];

  const [idx, setIdx] = useState(0);
  const q = useMemo(() => data[idx % data.length], [data, idx]);

  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Prevent double-beeps
  const lastAnsweredIdRef = useRef<string | null>(null);

  const answered = picked !== null;
  const isCorrect = answered && picked === q.correct;

  const renderedSentence = useMemo(() => {
    const verb = picked === null ? '___' : q.options[picked];
    return q.sentence.replace('___', verb);
  }, [q.sentence, q.options, picked]);

  // Auto-speak sentence when question changes
  useEffect(() => {
    lastAnsweredIdRef.current = null;
    if (autoSpeak) {
      // Speak the blank sentence, not filled
      speak(q.sentence, accent, 0.95);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, autoSpeak, accent]);

  const pick = (i: number) => {
    if (locked) return;

    setPicked(i);
    setLocked(true);

    // Speak selected option
    speak(q.options[i], accent, 0.95);

    // Feedback sfx once
    const answerKey = `${q.id}:${i}`;
    if (lastAnsweredIdRef.current !== answerKey) {
      lastAnsweredIdRef.current = answerKey;
      if (i === q.correct) {
        beep('ok');
        vibrate(15);
        // Optional coach voice
        // speak('Correct.', accent, 0.95);
      } else {
        beep('bad');
        vibrate(40);
      }
    }
  };

  const reset = () => {
    setPicked(null);
    setLocked(false);
    lastAnsweredIdRef.current = null;
    vibrate(8);
  };

  const next = () => {
    setIdx((v) => v + 1);
    setPicked(null);
    setLocked(false);
    lastAnsweredIdRef.current = null;
    vibrate(8);
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAccent(accent === 'en-US' ? 'en-GB' : 'en-US')}
            className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold active:scale-95"
            title="Switch accent"
          >
            {accent === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
          </button>

          <button
            onClick={() => setAutoSpeak((v) => !v)}
            className={cx(
              'px-3 py-2 rounded-2xl border font-extrabold active:scale-95',
              autoSpeak
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700'
            )}
            title="Auto speak sentence"
          >
            🔊 Auto {autoSpeak ? 'ON' : 'OFF'}
          </button>

          <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-sm">
            Q {idx + 1} / {data.length}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-4">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-[11px] font-black uppercase tracking-wider">
              Fill the verb · {q.level}
            </div>

            <button
              onClick={() => speak(q.sentence, accent, 0.95)}
              className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 active:scale-95"
              title="Listen sentence"
            >
              🔊 Listen
            </button>
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
                title="Click to choose (speaks the verb)"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="uppercase tracking-wide">{opt}</span>

                  <span className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        speak(opt, accent, 0.95);
                        vibrate(8);
                      }}
                      className={cx(
                        'px-3 py-1 rounded-full text-xs font-black border',
                        st === 'correct'
                          ? 'bg-white/15 border-white/20 text-white'
                          : st === 'wrong'
                          ? 'bg-white/15 border-white/20 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      )}
                      title="Play option"
                    >
                      🔊
                    </button>

                    {answered && st === 'correct' && (
                      <span className="text-sm font-black bg-white/15 px-3 py-1 rounded-full">✅</span>
                    )}
                    {answered && st === 'wrong' && (
                      <span className="text-sm font-black bg-white/15 px-3 py-1 rounded-full">❌</span>
                    )}
                  </span>
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
                isCorrect ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'
              )}
            >
              {isCorrect ? '✅ Nice!' : '⚠️ Not quite'}
            </div>

            <div className="mt-3 text-slate-800 font-semibold leading-relaxed">
              {q.explanation}
            </div>

            {!isCorrect && (
              <div className="mt-2 text-sm text-slate-500 font-semibold">
                Correct:{' '}
                <span className="text-slate-900 font-black">{q.options[q.correct]}</span>{' '}
                <button
                  onClick={() => {
                    speak(q.options[q.correct], accent, 0.95);
                    vibrate(8);
                  }}
                  className="ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-100 active:scale-95"
                >
                  🔊 Hear it
                </button>
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

        <div className="mt-4 text-xs text-slate-400 font-semibold">
          Tip: Tap 🔊 to hear sentence/options. This game is made for your ears.
        </div>
      </div>
    </div>
  );
}