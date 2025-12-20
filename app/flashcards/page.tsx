// app/flashcards/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import fullWordList from '@/data/yds_vocabulary.json';

/* =======================
   TYPES
======================= */
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

/* =======================
   HELPERS
======================= */
const makeId = (w: WordItem) => `${w.word}|||${w.meaning}`.toLowerCase();

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* 🔊 SPEECH (Web Speech API) */
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

/* =======================
   MAIN PAGE
======================= */
export default function FlashcardsPage() {
  const [deck, setDeck] = useState<DeckItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [stats, setStats] = useState<Stats>({
    seenTotal: 0,
    knownTotal: 0,
    hardTotal: 0,
  });

  const lock = useRef(false);

  /* LOAD */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setDeck(parsed.deck);
      setIndex(parsed.index);
      setStats(parsed.stats);
      setAccent(parsed.accent ?? 'en-US');
      return;
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

  /* SAVE */
  useEffect(() => {
    if (!deck.length) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ deck, index, stats, accent })
    );
  }, [deck, index, stats, accent]);

  const card = deck[index];
  const total = deck.length;

  /* AUTO SPEAK when card appears */
  useEffect(() => {
    if (!isFlipped && card?.word) {
      speak(card.word, accent);
    }
  }, [index, isFlipped, accent, card]);

  const next = useCallback(() => {
    if (lock.current) return;
    lock.current = true;
    setIsFlipped(false);

    setDeck((d) =>
      d.map((c, i) =>
        i === index ? { ...c, seenCount: c.seenCount + 1 } : c
      )
    );
    setStats((s) => ({ ...s, seenTotal: s.seenTotal + 1 }));

    setTimeout(() => {
      setIndex((i) => (i + 1) % total);
      lock.current = false;
    }, 200);
  }, [index, total]);

  const prev = () => {
    if (index === 0) return;
    setIsFlipped(false);
    setIndex(index - 1);
  };

  const markKnow = () => {
    setDeck((d) =>
      d.map((c, i) =>
        i === index ? { ...c, knownCount: c.knownCount + 1 } : c
      )
    );
    setStats((s) => ({ ...s, knownTotal: s.knownTotal + 1 }));
    next();
  };

  const markHard = () => {
    setDeck((d) =>
      d.map((c, i) =>
        i === index ? { ...c, hardCount: c.hardCount + 1 } : c
      )
    );
    setStats((s) => ({ ...s, hardTotal: s.hardTotal + 1 }));
    next();
  };

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* TOP BAR */}
      <div className="w-full max-w-md flex justify-between mb-4">
        <Link href="/" className="text-slate-500 font-bold">
          ← Exit
        </Link>
        <div className="text-xs text-slate-400">
          {index + 1} / {total}
        </div>
      </div>

      {/* CARD */}
      <div
        className="w-full max-w-md h-96 perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className="absolute w-full h-full bg-white rounded-3xl shadow-xl backface-hidden flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-black">{card.word}</h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(card.word, accent);
              }}
              className="mt-6 px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold"
            >
              🔊 Pronounce
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setAccent(accent === 'en-US' ? 'en-GB' : 'en-US');
              }}
              className="mt-3 text-xs text-slate-400"
            >
              Accent: {accent === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
            </button>
          </div>

          {/* BACK */}
          <div className="absolute w-full h-full bg-emerald-600 text-white rounded-3xl shadow-xl backface-hidden rotate-y-180 flex items-center justify-center p-8">
            <h2 className="text-3xl font-black text-center">
              {card.meaning}
            </h2>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-3 mt-8 w-full max-w-md">
        <button onClick={prev} className="flex-1 btn">← Prev</button>
        <button onClick={markHard} className="flex-1 btn bg-amber-500 text-white">
          Zor
        </button>
        <button
          onClick={markKnow}
          className="flex-1 btn bg-emerald-600 text-white"
        >
          Biliyorum
        </button>
        <button onClick={next} className="flex-1 btn bg-slate-900 text-white">
          Next →
        </button>
      </div>

      {/* STATS */}
      <div className="mt-4 text-xs text-slate-500">
        Seen: {stats.seenTotal} · Known: {stats.knownTotal} · Hard:{' '}
        {stats.hardTotal}
      </div>

      <style jsx>{`
        .btn {
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: white;
          border: 1px solid #e5e7eb;
          font-weight: 700;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}