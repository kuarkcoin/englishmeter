'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import vocabRaw from '@/data/yds_vocabulary.json';

type VocabItem = { word: string; meaning: string };
type Side = 'left' | 'right';

type Card = {
  key: string;
  pairId: string;
  side: Side;
  text: string;
  locked: boolean;
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clean(s: string) {
  return String(s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function safeVocab(list: any): VocabItem[] {
  const raw = Array.isArray(list) ? list : [];
  const out: VocabItem[] = [];
  for (const it of raw) {
    const w = String(it?.word || '').trim();
    const m = String(it?.meaning || '').trim();
    if (!w || !m) continue;
    out.push({ word: w, meaning: m });
  }
  return out;
}

function pickUniquePairs(pool: VocabItem[], count: number) {
  const seen = new Set<string>();
  const shuffled = shuffle(pool);
  const picked: VocabItem[] = [];
  for (const it of shuffled) {
    const k = clean(it.word);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    picked.push(it);
    if (picked.length >= count) break;
  }
  return picked;
}

/** 🔊 TTS (Browser SpeechSynthesis) */
function speak(text: string, lang: 'en-US' | 'en-GB' = 'en-US', rate = 0.95) {
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth || !text) return;

  synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;
  utter.pitch = 1;

  const voices = synth.getVoices ? synth.getVoices() : [];
  const voice =
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang?.startsWith('en'));
  if (voice) utter.voice = voice;

  synth.speak(utter);
}

/** Swipe helpers */
type SwipeState = {
  startX: number;
  startY: number;
  startT: number;
  cardKey: string;
  side: Side;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function MatchingPage() {
  const vocab = useMemo(() => safeVocab(vocabRaw as any), []);

  const TOTAL_PAIRS_PER_ROUND = 8;
  const ROUND_SECONDS = 60;

  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(true);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);

  const [pairs, setPairs] = useState<VocabItem[]>([]);
  const [leftCards, setLeftCards] = useState<Card[]>([]);
  const [rightCards, setRightCards] = useState<Card[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<Card | null>(null);
  const [selectedRight, setSelectedRight] = useState<Card | null>(null);

  const [toast, setToast] = useState<{ kind: 'ok' | 'bad' | 'info'; text: string } | null>(null);
  const [shakeKey, setShakeKey] = useState<string>('');

  // 🔊 Ses ayarları
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [rate, setRate] = useState<number>(0.95);
  const [autoSpeakCorrect, setAutoSpeakCorrect] = useState<boolean>(true);

  // ✅ Finish bonus tek sefer çalışsın
  const finishOnceRef = useRef(false);

  // Swipe state
  const swipeRef = useRef<SwipeState | null>(null);

  const lockedCount = useMemo(() => leftCards.filter((c) => c.locked).length, [leftCards]);
  const finished = lockedCount === TOTAL_PAIRS_PER_ROUND;

  function startNewRound(nextRound: number) {
    if (vocab.length === 0) return;

    finishOnceRef.current = false;

    const picked = pickUniquePairs(vocab, TOTAL_PAIRS_PER_ROUND);
    setPairs(picked);

    const left: Card[] = picked.map((p, i) => ({
      key: `L-${nextRound}-${i}-${clean(p.word)}`,
      pairId: `P-${nextRound}-${i}-${clean(p.word)}`,
      side: 'left',
      text: p.word,
      locked: false,
    }));

    const right: Card[] = picked.map((p, i) => ({
      key: `R-${nextRound}-${i}-${clean(p.word)}`,
      pairId: `P-${nextRound}-${i}-${clean(p.word)}`,
      side: 'right',
      text: p.meaning,
      locked: false,
    }));

    setLeftCards(shuffle(left));
    setRightCards(shuffle(right));

    setSelectedLeft(null);
    setSelectedRight(null);
    setShakeKey('');

    setTimeLeft(ROUND_SECONDS);
    setLives(3);
    setStreak(0);
    setRunning(true);
    setToast({ kind: 'info', text: `Round ${nextRound} başladı!` });
  }

  useEffect(() => {
    if (vocab.length === 0) {
      setToast({ kind: 'bad', text: 'Kelime listesi boş görünüyor. data/yds_vocabulary.json yolunu kontrol et.' });
      return;
    }
    startNewRound(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // voices warm-up
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    const warm = () => {
      try {
        synth.getVoices?.();
      } catch {}
    };
    warm();
    synth.onvoiceschanged = warm;

    return () => {
      // @ts-ignore
      if (synth) synth.onvoiceschanged = null;
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setToast({ kind: 'bad', text: 'Süre bitti! Restart veya Next Round.' });
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, timeLeft]);

  // Evaluate match when both selected
  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    const isMatch = selectedLeft.pairId === selectedRight.pairId;

    if (isMatch) {
      setLeftCards((prev) => prev.map((c) => (c.key === selectedLeft.key ? { ...c, locked: true } : c)));
      setRightCards((prev) => prev.map((c) => (c.key === selectedRight.key ? { ...c, locked: true } : c)));

      setScore((s) => s + 10 + Math.min(streak, 10));
      setStreak((x) => x + 1);
      setToast({ kind: 'ok', text: 'Doğru!' });

      if (autoSpeakCorrect) speak(selectedLeft.text, accent, rate);
    } else {
      setLives((l) => Math.max(0, l - 1));
      setScore((s) => Math.max(0, s - 5));
      setStreak(0);
      setToast({ kind: 'bad', text: 'Yanlış eşleşme!' });
      setShakeKey(selectedLeft.key + '|' + selectedRight.key);
    }

    const timeout = setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
      setShakeKey('');
    }, 280);

    return () => clearTimeout(timeout);
  }, [selectedLeft, selectedRight, streak, autoSpeakCorrect, accent, rate]);

  // Finish (bonus only once)
  useEffect(() => {
    if (finished && running && !finishOnceRef.current) {
      finishOnceRef.current = true;
      setRunning(false);
      setToast({ kind: 'ok', text: 'Tur bitti! Next Round ile devam.' });

      // küçük, kontrollü bonus (max 60)
      setScore((s) => s + clamp(timeLeft, 0, 60));
    }
  }, [finished, running, timeLeft]);

  useEffect(() => {
    if (lives <= 0 && running) {
      setRunning(false);
      setToast({ kind: 'bad', text: 'Can bitti! Restart veya Next Round.' });
    }
  }, [lives, running]);

  function onPick(card: Card) {
    if (!running) return;
    if (card.locked) return;

    if (card.side === 'left') {
      setSelectedLeft(card);
      setToast(null);
    } else {
      setSelectedRight(card);
      setToast(null);
    }
  }

  function nextRound() {
    const nr = round + 1;
    setRound(nr);
    startNewRound(nr);
  }

  function restartRound() {
    startNewRound(round);
  }

  /** Swipe logic:
   * - Normal: Tap left then Tap right (works on all devices)
   * - Swipe: After selecting LEFT, swipe RIGHT on a Turkish card to confirm match.
   * - Optional: After selecting RIGHT, swipe LEFT on an English card to confirm match.
   */
  function onTouchStart(e: React.TouchEvent, card: Card) {
    if (!running || card.locked) return;
    const t = e.touches[0];
    swipeRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      startT: Date.now(),
      cardKey: card.key,
      side: card.side,
    };
  }

  function onTouchEnd(e: React.TouchEvent, card: Card) {
    if (!running || card.locked) return;

    const st = swipeRef.current;
    swipeRef.current = null;
    if (!st || st.cardKey !== card.key) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - st.startX;
    const dy = t.clientY - st.startY;
    const dt = Date.now() - st.startT;

    // gesture thresholds
    const H = 40; // horizontal min
    const V = 35; // vertical max (avoid scroll)
    const TMAX = 650;

    if (Math.abs(dy) > V || dt > TMAX) return;

    // Right card: swipe to the right to confirm (dx > H)
    if (card.side === 'right' && dx > H) {
      if (!selectedLeft) {
        setToast({ kind: 'info', text: 'Önce soldan İngilizce kelimeyi seç.' });
        return;
      }
      // set right selection to trigger evaluation
      setSelectedRight(card);
      return;
    }

    // Left card: swipe to the left to confirm (dx < -H)
    if (card.side === 'left' && dx < -H) {
      if (!selectedRight) {
        setToast({ kind: 'info', text: 'Önce sağdan Türkçe anlamı seç.' });
        return;
      }
      setSelectedLeft(card);
      return;
    }
  }

  const toastCls =
    toast?.kind === 'ok'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : toast?.kind === 'bad'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-slate-50 text-slate-700 border-slate-200';

  const baseBtn =
    'px-4 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 font-semibold transition';

  // ✅ Mobile-first: always 2 columns (EN left, TR right)
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className={baseBtn}>
              ← Home
            </Link>
            <div>
              <div className="text-lg font-black text-slate-900">Matching Game (Sol EN / Sağ TR)</div>
              <div className="text-xs text-slate-500">
                Tap veya swipe: Soldan seç → sağ kartta sağa kaydır (→) ile eşleştir.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              ⏱️ <span className="font-bold">{timeLeft}s</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              🎯 Skor: <span className="font-bold">{score}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              🔥 <span className="font-bold">{streak}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              ❤️ <span className="font-bold">{lives}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              ✅ {lockedCount}/{TOTAL_PAIRS_PER_ROUND}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5">
        {/* Toast */}
        {toast && (
          <div className={`mb-3 p-3 rounded-2xl border ${toastCls}`}>
            <div className="text-sm font-semibold">{toast.text}</div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setRunning((r) => !r)} className={baseBtn}>
              {running ? 'Pause' : 'Resume'}
            </button>
            <button onClick={restartRound} className={baseBtn}>
              Restart
            </button>
            <button
              onClick={nextRound}
              className="px-4 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition"
            >
              Next Round →
            </button>
          </div>

          {/* Voice controls */}
          <div className="rounded-3xl border border-slate-200 p-3 flex flex-wrap items-center gap-2 justify-between">
            <div className="text-sm font-black text-slate-900">Ses</div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAccent('en-US')}
                className={`px-3 py-2 rounded-2xl border font-semibold transition ${
                  accent === 'en-US'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                🇺🇸
              </button>
              <button
                onClick={() => setAccent('en-GB')}
                className={`px-3 py-2 rounded-2xl border font-semibold transition ${
                  accent === 'en-GB'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                🇬🇧
              </button>

              <label className="text-sm text-slate-600 flex items-center gap-2">
                Hız
                <input
                  type="range"
                  min={0.75}
                  max={1.1}
                  step={0.05}
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                />
                <span className="font-semibold text-slate-900 w-10 text-right">{rate.toFixed(2)}</span>
              </label>

              <label className="text-sm text-slate-600 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoSpeakCorrect}
                  onChange={(e) => setAutoSpeakCorrect(e.target.checked)}
                />
                Doğruda oku
              </label>

              <button
                onClick={() => {
                  speak('Let’s begin!', accent, rate);
                  setToast({ kind: 'info', text: 'Ses test edildi.' });
                }}
                className={baseBtn}
                title="Ses testi"
              >
                🔊 Test
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center">
            Swipe kuralı: Soldan seç → sağ kartı <span className="font-bold">sağa kaydır</span> (→).
          </div>
        </div>

        {/* ✅ Always 2 columns */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left column */}
          <div className="rounded-3xl border border-slate-200 p-3">
            <div className="text-xs font-black text-slate-900 mb-2">English</div>
            <div className="grid grid-cols-1 gap-2">
              {leftCards.map((c) => {
                const selected = selectedLeft?.key === c.key;
                const shaking =
                  shakeKey.includes(c.key) && !c.locked ? 'animate-[shake_.25s_linear_1]' : '';

                const base = 'w-full text-left px-2 py-2 rounded-xl border transition select-none';
                const cls = c.locked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  : selected
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900';

                return (
                  <button
                    key={c.key}
                    onClick={() => onPick(c)}
                    onTouchStart={(e) => onTouchStart(e, c)}
                    onTouchEnd={(e) => onTouchEnd(e, c)}
                    className={`${base} ${cls} ${shaking}`}
                    disabled={c.locked || !running}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[13px] leading-tight break-words">
                        {c.text}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(c.text, accent, rate);
                        }}
                        className={`shrink-0 px-2 py-1 rounded-lg border text-[12px] font-semibold transition ${
                          c.locked
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                            : selected
                            ? 'border-white/30 text-white/90 hover:text-white hover:border-white/50'
                            : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                        title="Dinle"
                      >
                        🔊
                      </button>
                    </div>

                    {/* Optional hint when right already selected */}
                    {selectedRight && !c.locked && (
                      <div className={`mt-1 text-[11px] ${selected ? 'text-white/70' : 'text-slate-400'}`}>
                        ← (Swipe left to confirm)
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="rounded-3xl border border-slate-200 p-3">
            <div className="text-xs font-black text-slate-900 mb-2">Türkçe</div>
            <div className="grid grid-cols-1 gap-2">
              {rightCards.map((c) => {
                const selected = selectedRight?.key === c.key;
                const shaking =
                  shakeKey.includes(c.key) && !c.locked ? 'animate-[shake_.25s_linear_1]' : '';

                const base = 'w-full text-left px-2 py-2 rounded-xl border transition select-none';
                const cls = c.locked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  : selected
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900';

                return (
                  <button
                    key={c.key}
                    onClick={() => onPick(c)}
                    onTouchStart={(e) => onTouchStart(e, c)}
                    onTouchEnd={(e) => onTouchEnd(e, c)}
                    className={`${base} ${cls} ${shaking}`}
                    disabled={c.locked || !running}
                  >
                    <div className="font-semibold text-[13px] leading-tight break-words">
                      {c.text}
                    </div>

                    {/* Swipe hint */}
                    {!c.locked && selectedLeft && (
                      <div className={`mt-1 text-[11px] ${selected ? 'text-white/70' : 'text-slate-400'}`}>
                        → (Swipe right to match)
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-[11px] text-slate-500">
          Round <span className="font-bold">{round}</span> • Havuz: {vocab.length} •
          Kontrol: Tap-tap veya swipe ile eşleştir.
        </div>
      </div>

      {/* Shake animation */}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}