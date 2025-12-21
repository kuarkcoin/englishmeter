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
  // Ses bulunamazsa varsayılanı kullanması için esnek bırakıyoruz
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

  // Kaç çift gösterileceği hedefi
  const TARGET_PAIRS = 8;
  const ROUND_SECONDS = 60;

  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(true);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);

  // pair state'i aslında sadece başlangıçta kullanılıyor, renderda gerek yok ama tutalım.
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

  // DÜZELTME: Kilitli kart sayısı ve bitiş kontrolü dinamik yapıldı.
  const lockedCount = useMemo(() => leftCards.filter((c) => c.locked).length, [leftCards]);
  // Oyun, kartlar varsa ve hepsi kilitliyse biter.
  const finished = leftCards.length > 0 && leftCards.every((c) => c.locked);

  function startNewRound(nextRound: number) {
    if (vocab.length === 0) return;

    finishOnceRef.current = false;

    // Havuzdan kelime seç
    const picked = pickUniquePairs(vocab, TARGET_PAIRS);
    setPairs(picked);

    if (picked.length === 0) {
        setToast({ kind: 'bad', text: 'Yeterli kelime bulunamadı!' });
        setRunning(false);
        return;
    }

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
    setToast({ kind: 'info', text: `Round ${nextRound} başladı! (${picked.length} çift)` });
  }

  useEffect(() => {
    if (vocab.length === 0) {
      setToast({ kind: 'bad', text: 'Kelime listesi boş görünüyor. data/yds_vocabulary.json yolunu kontrol et.' });
      setRunning(false);
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
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = warm;
    }
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


  // DÜZELTME: Sonsuz döngüye neden olan useEffect kaldırıldı.
  // Eşleşme mantığı handleMatch fonksiyonuna taşındı.

  // Helper to process a potential match
  function handleMatch(left: Card, right: Card) {
    // Emniyet kilidi: eğer zaten kilitliyse işlem yapma
    if (left.locked || right.locked) return;

    const isMatch = left.pairId === right.pairId;

    if (isMatch) {
      // Kartları kilitle
      setLeftCards((prev) => prev.map((c) => (c.key === left.key ? { ...c, locked: true } : c)));
      setRightCards((prev) => prev.map((c) => (c.key === right.key ? { ...c, locked: true } : c)));

      // Puanlama ve Streak (Sadece 1 kez çalışır)
      setScore((s) => s + 10 + Math.min(streak, 10));
      setStreak((x) => x + 1);
      setToast({ kind: 'ok', text: 'Doğru!' });

      if (autoSpeakCorrect) speak(left.text, accent, rate);
    } else {
      // Yanlış eşleşme
      setLives((l) => Math.max(0, l - 1));
      setScore((s) => Math.max(0, s - 5));
      setStreak(0);
      setToast({ kind: 'bad', text: 'Yanlış eşleşme!' });
      setShakeKey(left.key + '|' + right.key);
    }

    // Seçimleri temizle
    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
      setShakeKey('');
    }, 350); // Animasyon süresine yakın bir süre
  }

  // DÜZELTME: Bitiş bonusu mantığı güvenli hale getirildi.
  useEffect(() => {
    if (finished && running && !finishOnceRef.current) {
      finishOnceRef.current = true;
      setRunning(false);

      // Süre bonusunu hesapla (timeLeft bağımlılığından kurtarıldı)
      const timeBonus = clamp(timeLeft, 0, 60);
      setScore((s) => s + timeBonus);
      setToast({ kind: 'ok', text: `Tur bitti! Süre Bonusu: +${timeBonus}` });
    }
  }, [finished, running]); // timeLeft removed from dependency

  useEffect(() => {
    if (lives <= 0 && running) {
      setRunning(false);
      setToast({ kind: 'bad', text: 'Can bitti! Restart veya Next Round.' });
    }
  }, [lives, running]);

  // DÜZELTME: onPick fonksiyonu, seçim yapıldığında eşleşmeyi anında kontrol edecek şekilde güncellendi.
  function onPick(card: Card) {
    if (!running || card.locked) return;

    if (card.side === 'left') {
      // Zaten bu kart seçiliyse tekrar işlem yapma
      if (selectedLeft?.key === card.key) return;
      
      setSelectedLeft(card);
      // Eğer sağda bir kart zaten seçiliyse, eşleştirmeyi dene
      if (selectedRight) {
        handleMatch(card, selectedRight);
      }
    } else {
      // Right side
      if (selectedRight?.key === card.key) return;

      setSelectedRight(card);
       // Eğer solda bir kart zaten seçiliyse, eşleştirmeyi dene
      if (selectedLeft) {
        handleMatch(selectedLeft, card);
      }
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

  /** Swipe logic */
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

    const H = 40; // horizontal min
    const V = 35; // vertical max
    const TMAX = 650;

    if (Math.abs(dy) > V || dt > TMAX) return;

    // Right card swipe right (→)
    if (card.side === 'right' && dx > H) {
      if (!selectedLeft) {
        setToast({ kind: 'info', text: 'Önce soldan İngilizce kelimeyi seç.' });
        return;
      }
      // Swipe ile seçim yapıldığında da onPick mantığını tetikle
      if (selectedRight?.key !== card.key) {
         setSelectedRight(card);
         handleMatch(selectedLeft, card);
      }
      return;
    }

    // Left card swipe left (←)
    if (card.side === 'left' && dx < -H) {
      if (!selectedRight) {
        setToast({ kind: 'info', text: 'Önce sağdan Türkçe anlamı seç.' });
        return;
      }
       // Swipe ile seçim yapıldığında da onPick mantığını tetikle
       if(selectedLeft?.key !== card.key) {
         setSelectedLeft(card);
         handleMatch(card, selectedRight);
       }
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

  // ✨ YENİ: Kartlar için ortak temel ve animasyon sınıfları
  // transition-all duration-500 ease-out: Tüm değişimleri (renk, opaklık, boyut) 500ms içinde yumuşatarak yap.
  const card BaseClass = 'w-full text-left px-2 py-2 rounded-xl border select-none transition-all duration-500 ease-out will-change-transform flex items-center justify-between gap-2';
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header - (Aynı kaldı) */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className={baseBtn}>
              ← Home
            </Link>
            <div>
              <div className="text-lg font-black text-slate-900">Matching Game (Sol EN / Sağ TR)</div>
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
              ✅ {lockedCount}/{leftCards.length}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5">
        {/* Toast */}
        {toast && (
          <div className={`mb-3 p-3 rounded-2xl border ${toastCls} transition-all`}>
            <div className="text-sm font-semibold">{toast.text}</div>
          </div>
        )}

        {/* Controls - (Aynı kaldı) */}
        <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setRunning((r) => !r)} className={baseBtn} disabled={finished || lives <=0}>
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
             {/* ... (Ses kontrolleri aynı) ... */}
             <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAccent('en-US')}
                className={`px-2 py-1 rounded-xl border text-xs font-semibold transition ${
                  accent === 'en-US'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                🇺🇸 US
              </button>
              <button
                onClick={() => setAccent('en-GB')}
                className={`px-2 py-1 rounded-xl border text-xs font-semibold transition ${
                  accent === 'en-GB'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                🇬🇧 GB
              </button>
               <label className="text-xs text-slate-600 flex items-center gap-1">
                Hız
                <input
                  type="range" min={0.7} max={1.2} step={0.1}
                  value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-16"
                />
              </label>

              <label className="text-xs text-slate-600 flex items-center gap-1">
                <input
                  type="checkbox" checked={autoSpeakCorrect}
                  onChange={(e) => setAutoSpeakCorrect(e.target.checked)}
                />
                Oto. Oku
              </label>
            </div>
          </div>
           <div className="text-xs text-slate-500 flex items-center">
            Swipe: Soldan seç → sağ kartı <span className="font-bold">sağa kaydır (→)</span>.
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left column */}
          <div className="rounded-3xl border border-slate-200 p-3 bg-slate-50/50">
            <div className="text-xs font-black text-slate-900 mb-2">English</div>
            <div className="grid grid-cols-1 gap-2 relative">
              {leftCards.map((c) => {
                const selected = selectedLeft?.key === c.key;
                const shaking = shakeKey.includes(c.key) && !c.locked ? 'animate-[shake_.3s_ease-in-out_1]' : '';

                // ✨ YENİ: Animasyonlu sınıf mantığı
                let cls = '';
                if (c.locked) {
                  // KİLİTLİ: Yeşilimsi, görünmez (opacity-0), küçülmüş (scale-95), tıklanamaz
                  cls = 'bg-emerald-100/50 border-emerald-200 text-emerald-800 opacity-0 scale-95 pointer-events-none';
                } else if (selected) {
                  // SEÇİLİ: Koyu renk
                  cls = 'bg-slate-900 border-slate-900 text-white scale-[1.02] shadow-md cursor-pointer';
                } else {
                  // NORMAL: Beyaz
                  cls = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 cursor-pointer hover:border-slate-300';
                }

                return (
                  // DÜZELTME: İç içe button yerine div kullanıldı.
                  <div
                    key={c.key}
                    onClick={() => onPick(c)}
                    onTouchStart={(e) => onTouchStart(e, c)}
                    onTouchEnd={(e) => onTouchEnd(e, c)}
                    className={`${cardBaseClass} ${cls} ${shaking}`}
                    style={{
                        // Locked ise tıklamayı tamamen engelle (CSS yetmeyebilir)
                        pointerEvents: (c.locked || !running) ? 'none' : 'auto'
                    }}
                  >
                      <span className="font-semibold text-[13px] leading-tight break-words">
                        {c.text}
                      </span>

                      {/* Hoparlör ikonu - sadece kilitli değilse göster */}
                      {!c.locked && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(c.text, accent, rate);
                          }}
                          className={`shrink-0 px-2 py-1 rounded-lg border text-[12px] font-semibold transition ${
                             selected
                              ? 'border-white/30 text-white/90 hover:text-white hover:border-white/50'
                              : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                          title="Dinle"
                        >
                          🔊
                        </span>
                      )}

                    {/* Hint overlay */}
                    {selectedRight && !c.locked && !selected && (
                      <div className="absolute inset-0 bg-slate-900/5 rounded-xl pointer-events-none animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="rounded-3xl border border-slate-200 p-3 bg-slate-50/50">
            <div className="text-xs font-black text-slate-900 mb-2">Türkçe</div>
            <div className="grid grid-cols-1 gap-2 relative">
              {rightCards.map((c) => {
                const selected = selectedRight?.key === c.key;
                const shaking = shakeKey.includes(c.key) && !c.locked ? 'animate-[shake_.3s_ease-in-out_1]' : '';

                // ✨ YENİ: Animasyonlu sınıf mantığı (Sağ taraf için aynısı)
                let cls = '';
                if (c.locked) {
                  cls = 'bg-emerald-100/50 border-emerald-200 text-emerald-800 opacity-0 scale-95 pointer-events-none';
                } else if (selected) {
                  cls = 'bg-slate-900 border-slate-900 text-white scale-[1.02] shadow-md cursor-pointer';
                } else {
                  cls = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 cursor-pointer hover:border-slate-300';
                }

                return (
                  // DÜZELTME: button yerine div
                  <div
                    key={c.key}
                    onClick={() => onPick(c)}
                    onTouchStart={(e) => onTouchStart(e, c)}
                    onTouchEnd={(e) => onTouchEnd(e, c)}
                    className={`${cardBaseClass} ${cls} ${shaking}`}
                    style={{
                        pointerEvents: (c.locked || !running) ? 'none' : 'auto'
                    }}
                  >
                    <div className="font-semibold text-[13px] leading-tight break-words w-full">
                      {c.text}
                    </div>
                     {/* Hint overlay */}
                     {!c.locked && selectedLeft && !selected && (
                      <div className="absolute inset-0 bg-slate-900/5 rounded-xl pointer-events-none animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-[11px] text-slate-500 text-center">
          Round <span className="font-bold">{round}</span> • Havuz: {vocab.length} kelime.
        </div>
      </div>

      {/* Shake animation (Biraz daha yumuşatıldı) */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}

