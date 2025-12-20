// app/flashcards/page.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import fullWordList from '@/data/yds_vocabulary.json';

type WordItem = { word: string; meaning: string };

type DeckItem = WordItem & {
  id: string;
  seenCount: number;
  knownCount: number;
  hardCount: number;
};

type Stats = {
  seenTotal: number;
  knownTotal: number;
  hardTotal: number;
};

const STORAGE_KEY = 'testdunya_flashcards_voice_v1';

const makeId = (w: WordItem) => `${w.word}|||${w.meaning}`.toLowerCase();

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text: string, lang: 'en-US' | 'en-GB') {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.9;
  utter.pitch = 1;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

export default function FlashcardsPage() {
  const [deck, setDeck] = useState<DeckItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [stats, setStats] = useState<Stats>({ seenTotal: 0, knownTotal: 0, hardTotal: 0 });

  const lock = useRef(false);

  // LOAD
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.deck) && parsed.deck.length) {
          setDeck(parsed.deck);
          setIndex(typeof parsed.index === 'number' ? parsed.index : 0);
          setStats(parsed.stats ?? { seenTotal: 0, knownTotal: 0, hardTotal: 0 });
          setAccent(parsed.accent ?? 'en-US');
          return;
        }
      }
    } catch {
      // ignore
    }

    const base: DeckItem[] = shuffle(fullWordList as WordItem[]).map((w) => ({
      ...w,
      id: makeId(w),
      seenCount: 0,
      knownCount: 0,
      hardCount: 0,
    }));
    setDeck(base);
  }, []);

  // SAVE
  useEffect(() => {
    if (!deck.length) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ deck, index, stats, accent }));
    } catch {
      // ignore
    }
  }, [deck, index, stats, accent]);

  const total = deck.length;
  const card = deck[index];

  // AUTO SPEAK
  useEffect(() => {
    if (!isFlipped && card?.word) speak(card.word, accent);
  }, [index, isFlipped, accent, card]);

  const next = useCallback(() => {
    if (!total) return;
    if (lock.current) return;
    lock.current = true;

    // tok his + flip reset
    setIsFlipped(false);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);

    setDeck((d) =>
      d.map((c, i) => (i === index ? { ...c, seenCount: c.seenCount + 1 } : c))
    );
    setStats((s) => ({ ...s, seenTotal: s.seenTotal + 1 }));

    setTimeout(() => {
      setIndex((i) => (i + 1) % total);
      lock.current = false;
    }, 180);
  }, [index, total]);

  const prev = useCallback(() => {
    if (!total) return;
    setIsFlipped(false);
    setIndex((i) => (i > 0 ? i - 1 : 0));
  }, [total]);

  const markKnow = useCallback(() => {
    setDeck((d) => d.map((c, i) => (i === index ? { ...c, knownCount: c.knownCount + 1 } : c)));
    setStats((s) => ({ ...s, knownTotal: s.knownTotal + 1 }));
    next();
  }, [index, next]);

  const markHard = useCallback(() => {
    setDeck((d) => d.map((c, i) => (i === index ? { ...c, hardCount: c.hardCount + 1 } : c)));
    setStats((s) => ({ ...s, hardTotal: s.hardTotal + 1 }));
    next();
  }, [index, next]);

  if (!card) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* TOP BAR */}
      <div className="w-full max-w-md mx-auto flex justify-between items-center px-4 pt-4">
        <Link href="/" className="text-slate-500 font-bold">← Exit</Link>
        <div className="text-xs text-slate-400 font-semibold">{index + 1} / {total}</div>
      </div>

      {/* CONTENT (Kart + boşluk) */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-4 py-6 pb-28">
        {/* CARD */}
        <div
          className="w-full h-[22rem] perspective-1000 cursor-pointer select-none"
          onClick={() => {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(12);
            setIsFlipped((v) => !v);
          }}
        >
          <div
            className={`tok relative w-full h-full transition-transform duration-300 transform-style-3d ${
              isFlipped ? 'rotate-y-180 scale-[0.98]' : 'scale-100'
            }`}
          >
            {/* FRONT */}
            <div className="absolute w-full h-full bg-white rounded-3xl shadow-xl backface-hidden flex flex-col items-center justify-center p-8">
              <h2 className="text-4xl font-black text-slate-900 text-center break-words">{card.word}</h2>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(card.word, accent);
                  }}
                  className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold active:scale-95"
                >
                  🔊 Pronounce
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAccent(accent === 'en-US' ? 'en-GB' : 'en-US');
                  }}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold active:scale-95"
                  title="Switch accent"
                >
                  {accent === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
                </button>
              </div>

              <p className="mt-6 text-slate-400 text-sm">Tap to flip ↻</p>
            </div>

            {/* BACK */}
            <div className="absolute w-full h-full bg-emerald-600 text-white rounded-3xl shadow-xl backface-hidden rotate-y-180 flex items-center justify-center p-8">
              <h2 className="text-3xl font-black text-center break-words">{card.meaning}</h2>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-4 text-xs text-slate-500">
          Seen: {stats.seenTotal} · Known: {stats.knownTotal} · Hard: {stats.hardTotal}
        </div>
      </div>

      {/* ✅ STICKY CONTROLS (İleri/Next asla kaybolmaz) */}
      <div className="sticky bottom-0 w-full bg-slate-50/95 backdrop-blur border-t border-slate-200">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex gap-3">
            <button onClick={prev} className="flex-1 btn">← Prev</button>

            <button onClick={markHard} className="flex-1 btn btn-amber">
              Zor
            </button>

            <button onClick={markKnow} className="flex-1 btn btn-emerald">
              Biliyorum
            </button>

            {/* ✅ İleri buton burada ve hep görünür */}
            <button onClick={next} className="flex-1 btn btn-dark">
              Next →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn {
          padding: 0.9rem;
          border-radius: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          font-weight: 900;
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
          transform: translateY(0);
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .btn:active {
          transform: translateY(2px);
          box-shadow: 0 0 0 rgba(0,0,0,0.0);
        }
        .btn-dark {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }
        .btn-emerald {
          background: #059669;
          color: white;
          border-color: #059669;
        }
        .btn-amber {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }

        /* TOK easing */
        .tok {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}