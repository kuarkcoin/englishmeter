// app/yds-3750/page.tsx
'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ydsVocabulary from '@/data/yds_vocabulary.json';

type VocabItem = { word: string; meaning: string };

type Choice = { id: string; text: string; isCorrect: boolean };
type Question = { id: string; prompt: string; choices: Choice[]; explanation?: string };

const TEST_COUNT = 75;
const QUESTIONS_PER_TEST = 50;

// ---- DEMO PREMIUM ----
// Şimdilik false bırak. Sonra Supabase profile’dan okuyup set edersin.
const isPremium = false;
const FREE_TESTS_OPEN = 2; // Premium değilse kaç test açık?

function makeAttemptId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(all: VocabItem[], correctMeaning: string): Choice[] {
  // 3 distractor meaning seç (doğrudan meaning bazlı)
  const distractors = shuffle(
    all
      .filter((w) => w.meaning && w.meaning !== correctMeaning)
      .map((w) => w.meaning)
  ).slice(0, 3);

  const options = shuffle([correctMeaning, ...distractors]);
  const ids = ['a', 'b', 'c', 'd'];

  return options.map((text, i) => ({
    id: ids[i],
    text,
    isCorrect: text === correctMeaning,
  }));
}

function getFixedTestSlice(all: VocabItem[], testNo: number): VocabItem[] {
  // Test 1 => 0..49, Test 2 => 50..99 ... (deterministik)
  const start = (testNo - 1) * QUESTIONS_PER_TEST;
  return all.slice(start, start + QUESTIONS_PER_TEST);
}

export default function Yds3750Hub() {
  const router = useRouter();

  const totalWords = (ydsVocabulary as any[]).length;

  // 3750 kelime yoksa da çalışsın diye otomatik test sayısını küçültelim
  const maxPossibleTests = Math.floor(totalWords / QUESTIONS_PER_TEST);
  const safeTestCount = Math.min(TEST_COUNT, Math.max(1, maxPossibleTests));

  const list = useMemo(() => {
    // JSON içini normalize edelim
    const all = (ydsVocabulary as any[])
      .map((x) => ({
        word: String(x.word ?? '').trim(),
        meaning: String(x.meaning ?? '').trim(),
      }))
      .filter((x) => x.word && x.meaning) as VocabItem[];

    return all;
  }, []);

  const startTest = (testNo: number) => {
    const locked = !isPremium && testNo > FREE_TESTS_OPEN;
    if (locked) {
      router.push('/pricing'); // istersen modal da açarsın
      return;
    }

    const attemptId = makeAttemptId();

    // 50 kelimeyi sabit şekilde al
    const pack = getFixedTestSlice(list, testNo);

    // pack boşsa hata ver
    if (!pack || pack.length === 0) {
      alert(`Test ${testNo} bulunamadı (data yetersiz).`);
      return;
    }

    const questions: Question[] = pack.map((item, idx) => {
      const choices = buildChoices(list, item.meaning);

      return {
        id: `yds3750-t${testNo}-q${idx + 1}`,
        prompt: `What is the Turkish meaning of **"${item.word}"**?`,
        choices,
        explanation: `**${item.word}**: ${item.meaning}`,
      };
    });

    const payload = {
      attemptId,
      testSlug: `yds-3750-t${testNo}`, // ✅ Quiz result ekranındaki restart için
      test: {
        title: `YDS 3750 VOCAB · TEST ${testNo} (50 Questions)`,
        duration: 25, // ✅ dakika (Quiz sayfanda duration’ı kullanacak şekilde küçük fix önerdim)
      },
      questions,
    };

    sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
    router.push(`/quiz/${attemptId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 mb-8">
          <h1 className="text-3xl font-black text-slate-900">YDS 3750 Vocabulary</h1>
          <p className="text-slate-600 mt-2">
            75 test · Her test 50 soru · Timer’lı deneme
          </p>

          {!isPremium && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
              <div className="font-bold">Free Plan</div>
              <div className="text-sm mt-1">
                Test 1–{FREE_TESTS_OPEN} ücretsiz. Diğer testler premium 🔒
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-slate-400">
            Data: <span className="font-semibold">{list.length}</span> kelime yüklü.
            {list.length < 3750 && (
              <span className="text-amber-600 font-bold"> (3750’den azsa test sayısı otomatik azalır)</span>
            )}
          </div>
        </div>

        {/* 75 TEST BUTTON GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: safeTestCount }).map((_, i) => {
            const testNo = i + 1;
            const locked = !isPremium && testNo > FREE_TESTS_OPEN;

            return (
              <button
                key={testNo}
                onClick={() => startTest(testNo)}
                className={`py-4 rounded-2xl font-black text-lg shadow-sm transition-all transform active:scale-[0.98]
                  ${locked
                    ? 'bg-white text-slate-300 border border-slate-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Test {testNo}</span>
                  {locked && <span aria-hidden>🔒</span>}
                </div>
                <div className={`text-[11px] font-semibold mt-1 ${locked ? 'text-slate-300' : 'text-blue-100'}`}>
                  50 Questions · 25 min
                </div>
              </button>
            );
          })}
        </div>

        {/* Back */}
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}