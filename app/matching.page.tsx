'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  // word tekrarlarını engelle
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

  // üst üste binmesin
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

  const lockedCount = useMemo(() => leftCards.filter((c) => c.locked).length, [leftCards]);
  const finished = lockedCount === TOTAL_PAIRS_PER_ROUND;

  function startNewRound(nextRound: number) {
    if (vocab.length === 0) return;

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

  // iOS/Chrome bazı durumlarda voice listesini ilk anda doldurmayabiliyor:
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    // bazı tarayıcılar için sesleri "ısındır"
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

  // Match evaluation
  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    const isMatch = selectedLeft.pairId === selectedRight.pairId;

    if (isMatch) {
      setLeftCards((prev) => prev.map((c) => (c.key === selectedLeft.key ? { ...c, locked: true } : c)));
      setRightCards((prev) => prev.map((c) => (c.key === selectedRight.key ? { ...c, locked: true } : c)));

      setScore((s) => s + 10 + Math.min(streak, 10));
      setStreak((x) => x + 1);
      setToast({ kind: 'ok', text: 'Doğru!' });

      if (autoSpeakCorrect) {
        speak(selectedLeft.text, accent, rate);
      }
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
    }, 350);

    return () => clearTimeout(timeout);
  }, [selectedLeft, selectedRight, streak, autoSpeakCorrect, accent, rate]);

  // Finish / lives
  useEffect(() => {
    if (finished && running) {
      setRunning(false);
      setToast({ kind: 'ok', text: 'Tur bitti! Next Round ile devam.' });
      setScore((s) => s + Math.max(0, timeLeft)); // kalan saniye bonusu
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

  const toastCls =
    toast?.kind === 'ok'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : toast?.kind === 'bad'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-slate-50 text-slate-700 border-slate-200';

  const baseBtn =
    'px-4 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 font-semibold transition';

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
              <div className="text-lg font-black text-slate-900">Matching Game (🔊 Sesli)</div>
              <div className="text-xs text-slate-500">Önce İngilizce kelimeyi seç, sonra Türkçeyi seç.</div>
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
              🔥 Streak: <span className="font-bold">{streak}</span>
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
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Toast */}
        {toast && (
          <div className={`mb-4 p-3 rounded-2xl border ${toastCls}`}>
            <div className="text-sm font-semibold">{toast.text}</div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
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
            <div className="text-sm font-black text-slate-900">Ses Ayarları</div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAccent('en-US')}
                className={`px-3 py-2 rounded-2xl border font-semibold transition ${
                  accent === 'en-US' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                🇺🇸 US
              </button>
              <button
                onClick={() => setAccent('en-GB')}
                className={`px-3 py-2 rounded-2xl border font-semibold transition ${
                  accent === 'en-GB' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                🇬🇧 UK
              </button>

              <label className="text-sm text-slate-600 flex items-center gap-2">
                Hız
                <input
                  type="range"
                  min={0.7}
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
                Doğruda otomatik oku
              </label>

              <button
                onClick={() => {
                  // kullanıcı tıklaması iOS'ta TTS için önemli
                  speak('Let’s begin!', accent, rate);
                  setToast({ kind: 'info', text: 'Ses test edildi: "Let’s begin!"' });
                }}
                className={baseBtn}
                title="Ses testi"
              >
                🔊 Test
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center">
            İpucu: İngilizce kartın sağındaki 🔊 ile kelimeyi dinleyebilirsin.
          </div>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left */}
          <div className="rounded-3xl border border-slate-200 p-4">
            <div className="text-sm font-black text-slate-900 mb-3">English</div>
            <div className="grid grid-cols-1 gap-2">
              {leftCards.map((c) => {
                const selected = selectedLeft?.key === c.key;
                const shaking = shakeKey.includes(c.key) && !c.locked ? 'animate-[shake_.25s_linear_1]' : '';
                const base = 'w-full text-left px-4 py-3 rounded-2xl border transition select-none';
                const cls = c.locked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  : selected
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900';

                return (
                  <button
                    key={c.key}
                    onClick={() => onPick(c)}
                    className={`${base} ${cls} ${shaking}`}
                    disabled={c.locked || !running}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{c.text}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(c.text, accent, rate);
                        }}
                        className={`px-3 py-2 rounded-xl border text-sm font-semibold transition ${
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div className="rounded-3xl border border-slate-200 p-4">
            <div className="text-sm font-black text-slate-900 mb-3">Türkçe</div>
            <div className="grid grid-cols-1 gap-2">
              {rightCards.map((c) => {
                const selected = selectedRight?.key === c.key;
                const shaking = shakeKey.includes(c.key) && !c.locked ? 'animate-[shake_.25s_linear_1]' : '';
                const base = 'w-full text-left px-4 py-3 rounded-2xl border transition select-none';
                const cls = c.locked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  : selected
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900';

                return (
                  <button
                    key={c.key}
                    onClick={() => onPick(c)}
                    className={`${base} ${cls} ${shaking}`}
                    disabled={c.locked || !running}
                  >
                    <div className="font-semibold">{c.text}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-slate-500">
          Round <span className="font-bold">{round}</span> • Havuz: {vocab.length} kelime •
          Doğru eşleşmede (seçiliyse) otomatik ses okunur.
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