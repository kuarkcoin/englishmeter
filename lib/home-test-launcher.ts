// Loaded only when a visitor starts a test. Existing selection, shuffling and keys are preserved.
import { getQuestionsBySlug } from '@/lib/quizManager';
import type { MeaningLanguageCode } from '@/lib/home-test-types';
import ydsVocabulary from '@/data/yds_vocabulary.json';
import ydsVocabulary2Raw from '@/data/data/yds_vocabulary2.json';
import dailyEnglishData from '@/data/dailyenglish.json';
import turkishGreekData from '@/data/turkish_greek.json';
import { ADV_TEST_MAP } from '@/lib/advanced-tests';
type TurkishGreekWord = {
  word: string;
  meaning: string;
  pronunciation: string;
};

const MEANING_LANGUAGE_LABELS: Record<MeaningLanguageCode, string> = {
  tr: 'Turkish',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  fr: 'French',
};

function getLocalizedMeaning(item: any, language: MeaningLanguageCode): string {
  const localized = item?.meanings?.[language];
  if (typeof localized === 'string' && localized.trim()) return localized.trim();

  const fallback = item?.meaning;
  return typeof fallback === 'string' ? fallback.trim() : '';
}

// --- HELPERS ---
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeAttemptId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Deterministic RNG (LCG) for stable mini-tests
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function seededUniqueIndices(total: number, need: number, seed: number) {
  const rand = lcg(seed);
  const picked = new Set<number>();
  const maxAttempts = total * 10;

  let attempts = 0;
  while (picked.size < need && attempts < maxAttempts) {
    const idx = Math.floor(rand() * total);
    picked.add(idx);
    attempts++;
  }

  // fallback if something weird happens
  if (picked.size < need) {
    for (let i = 0; i < total && picked.size < need; i++) picked.add(i);
  }

  return Array.from(picked);
}

// LocalStorage keys
const LS_VOCAB_MAP = 'em_yds5000_map_v1';
const LS_GLOBAL_VOCAB_MAP = 'em_global_vocab_map_v1';
const LS_ENGLISH_DEUTSCH_MAP = 'em_english_deutsch_map_v1';
const LS_TURKISH_GREEK_MAP = 'em_turkish_greek_map_v1';
const GLOBAL_VOCAB_QUESTIONS_PER_TEST = 25;
const GLOBAL_VOCAB_DURATION_MIN = 15;
const EN_DE_QUESTIONS_PER_TEST = 50;
const EN_DE_DURATION_MIN = 25;
const TURKISH_GREEK_QUESTIONS_PER_TEST = 50;
const TURKISH_GREEK_DURATION_MIN = 25;
const DAILY_ENGLISH_QUESTIONS_PER_TEST = 50;
const DAILY_ENGLISH_DURATION_MIN = 25;

// Save / load helpers (safe)
function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}


export type HomeTestLaunchOptions = {
  testSlug: string;
  meaningLanguage: MeaningLanguageCode;
  englishDeutschWords: Array<{ word: string; meaning: string }>;
  router: { push: (path: string) => void };
  saveLast: (title: string, slug: string) => void;
};
export function launchHomeTest({testSlug, meaningLanguage, englishDeutschWords, router, saveLast}: HomeTestLaunchOptions) {
  const ydsVocabulary2 = (() => {
    return ((ydsVocabulary2Raw as any[]) || [])
      .map((x: any) => ({
        word: String(x?.word ?? '').trim(),
        meaning: String(x?.meaning ?? '').trim(),
      }))
      .filter((x) => x.word && x.meaning);
  })();

  const validGlobalVocabWordCount = ydsVocabulary2.length;

  const globalVocabTestCount = Math.floor(validGlobalVocabWordCount / GLOBAL_VOCAB_QUESTIONS_PER_TEST);

  const validEnglishDeutschWordCount = englishDeutschWords.length;

  const englishDeutschTestCount = Math.floor(validEnglishDeutschWordCount / EN_DE_QUESTIONS_PER_TEST);

  const turkishGreekWords: TurkishGreekWord[] = (() => {
  const rawData: unknown = turkishGreekData;

  const source: unknown[] = Array.isArray(rawData)
    ? rawData
    : rawData && typeof rawData === 'object'
      ? [rawData]
      : [];

  return source
    .map((item) => {
      const record = item as Partial<TurkishGreekWord>;

      return {
        word: String(record.word ?? '').trim(),
        meaning: String(record.meaning ?? '').trim(),
        pronunciation: String(
          record.pronunciation ?? ''
        ).trim(),
      };
    })
    .filter(
      (item): item is TurkishGreekWord =>
        Boolean(
          item.word &&
          item.meaning &&
          item.pronunciation
        )
    );
})();

  const validTurkishGreekWordCount = turkishGreekWords.length;

  const turkishGreekTestCount = Math.floor(validTurkishGreekWordCount / TURKISH_GREEK_QUESTIONS_PER_TEST);

  const validDailyEnglishWordCount = (() => {
    return ((dailyEnglishData as any[]) || [])
      .map((x: any) => ({
        word: String(x?.word ?? '').trim(),
        meaning: String(x?.meaning ?? '').trim(),
      }))
      .filter((x) => x.word && x.meaning).length;
  })();

  const dailyEnglishTestCount = Math.floor(validDailyEnglishWordCount / DAILY_ENGLISH_QUESTIONS_PER_TEST);

  // --- 100 mini test mapping (stable) ---
  const ensureVocabMap = (() => {
    const total = (ydsVocabulary as any[])?.length || 0;
    const map = safeJsonParse<Record<string, number[]>>(typeof window !== 'undefined' ? localStorage.getItem(LS_VOCAB_MAP) : null, {});
    if (!total) return map;

    // Ensure 1..100 exist
    let changed = false;
    for (let t = 1; t <= 100; t++) {
      const key = String(t);
      if (!Array.isArray(map[key]) || map[key].length !== 50) {
        // seed by test number, but also depend on total length (so changes don't break too hard)
        map[key] = seededUniqueIndices(total, 50, 1000 + t * 99991 + total * 17);
        changed = true;
      }
    }
    if (changed && typeof window !== 'undefined') {
      localStorage.setItem(LS_VOCAB_MAP, JSON.stringify(map));
    }
    return map;
  });

  const ensureGlobalVocabMap = (() => {
    const total = ydsVocabulary2.length;
    const testCount = Math.floor(total / GLOBAL_VOCAB_QUESTIONS_PER_TEST);
    const map = safeJsonParse<Record<string, number[]>>(
      typeof window !== 'undefined' ? localStorage.getItem(LS_GLOBAL_VOCAB_MAP) : null,
      {}
    );
    if (!testCount || !total) return map;

    let changed = false;
    for (let t = 1; t <= testCount; t++) {
      const key = String(t);
      if (!Array.isArray(map[key]) || map[key].length !== GLOBAL_VOCAB_QUESTIONS_PER_TEST) {
        map[key] = seededUniqueIndices(total, GLOBAL_VOCAB_QUESTIONS_PER_TEST, 7000 + t * 3571 + total * 13);
        changed = true;
      }
    }

    Object.keys(map).forEach((key) => {
      const n = Number(key);
      if (!Number.isFinite(n) || n < 1 || n > testCount) {
        delete map[key];
        changed = true;
      }
    });

    if (changed && typeof window !== 'undefined') {
      localStorage.setItem(LS_GLOBAL_VOCAB_MAP, JSON.stringify(map));
    }
    return map;
  });

  const ensureEnglishDeutschMap = (() => {
    const total = englishDeutschWords.length;
    const testCount = Math.floor(total / EN_DE_QUESTIONS_PER_TEST);
    const map = safeJsonParse<Record<string, number[]>>(
      typeof window !== 'undefined' ? localStorage.getItem(LS_ENGLISH_DEUTSCH_MAP) : null,
      {}
    );
    if (!testCount || !total) return map;

    let changed = false;
    for (let t = 1; t <= testCount; t++) {
      const key = String(t);
      if (!Array.isArray(map[key]) || map[key].length !== EN_DE_QUESTIONS_PER_TEST) {
        map[key] = seededUniqueIndices(total, EN_DE_QUESTIONS_PER_TEST, 9100 + t * 4051 + total * 19);
        changed = true;
      }
    }

    Object.keys(map).forEach((key) => {
      const n = Number(key);
      if (!Number.isFinite(n) || n < 1 || n > testCount) {
        delete map[key];
        changed = true;
      }
    });

    if (changed && typeof window !== 'undefined') {
      localStorage.setItem(LS_ENGLISH_DEUTSCH_MAP, JSON.stringify(map));
    }
    return map;
  });

  const ensureTurkishGreekMap = (() => {
    const total = turkishGreekWords.length;
    const testCount = Math.floor(total / TURKISH_GREEK_QUESTIONS_PER_TEST);
    const map = safeJsonParse<Record<string, number[]>>(
      typeof window !== 'undefined' ? localStorage.getItem(LS_TURKISH_GREEK_MAP) : null,
      {}
    );

    if (!total || !testCount) return map;

    let changed = false;

    for (let testNumber = 1; testNumber <= testCount; testNumber++) {
      const key = String(testNumber);
      const currentIndices = map[key];
      const hasInvalidIndex =
        Array.isArray(currentIndices) &&
        currentIndices.some(
          (index) => !Number.isInteger(index) || index < 0 || index >= total
        );

      if (
        !Array.isArray(currentIndices) ||
        currentIndices.length !== TURKISH_GREEK_QUESTIONS_PER_TEST ||
        hasInvalidIndex
      ) {
        map[key] = seededUniqueIndices(
          total,
          TURKISH_GREEK_QUESTIONS_PER_TEST,
          12000 + testNumber * 4051 + total * 23
        );
        changed = true;
      }
    }

    Object.keys(map).forEach((key) => {
      const testNumber = Number(key);
      if (!Number.isInteger(testNumber) || testNumber < 1 || testNumber > testCount) {
        delete map[key];
        changed = true;
      }
    });

    if (changed && typeof window !== 'undefined') {
      localStorage.setItem(LS_TURKISH_GREEK_MAP, JSON.stringify(map));
    }

    return map;
  });

      const attemptId = makeAttemptId();

      // --- YDS 3750 MINI TESTS (1..75) ---
      if (testSlug.startsWith('yds-5000-mini-')) {
        const nStr = testSlug.split('-').pop() || '1';
        const n = Math.max(1, Math.min(100, Number(nStr) || 1));

        const map = ensureVocabMap();
        const indices = map[String(n)] || [];

        const pool = ydsVocabulary as any[];
        const selectedWords = indices.map((i) => pool[i]).filter(Boolean);

        // 50Q, 25min default (user request)
        const questions = selectedWords.map((item: any, idx: number) => {
          const correctAnswer = getLocalizedMeaning(item, meaningLanguage);
          if (!correctAnswer) return null;

          const uniqueDistractors = Array.from(
            new Set(
              pool
                .filter((w: any) => w?.word !== item?.word)
                .map((w: any) => getLocalizedMeaning(w, meaningLanguage))
                .filter((meaning: string) => meaning && meaning !== correctAnswer)
            )
          );

          const distractors = shuffle(uniqueDistractors).slice(0, 3);
          if (distractors.length < 3) return null;

          const allOptions = shuffle([...distractors, correctAnswer]);
          const idsLower = ['a', 'b', 'c', 'd'];
          const meaningLabel = MEANING_LANGUAGE_LABELS[meaningLanguage];

          return {
            id: `yds-5000-mini-${n}-q${idx + 1}`,
            prompt: `What is the ${meaningLabel} meaning of **"${item.word}"**?`,
            choices: allOptions.map((optText: string, i: number) => ({
              id: idsLower[i],
              text: optText,
              isCorrect: optText === correctAnswer,
            })),
            explanation: `**${item.word}** (${meaningLabel}): ${correctAnswer}`,
          };
        }).filter(Boolean);

        const title = `YDS 5000 WORDS · MINI TEST ${n} (50Q · 25 min)`;

        const payload = {
          attemptId,
          testSlug,
          test: { title, duration: 25 }, // minutes (we will use in Quiz page later)
          durationSeconds: 25 * 60,
          questions,
        };

        sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
        saveLast(title, testSlug);
        router.push(`/quiz/${attemptId}?lang=${meaningLanguage}`);
        return;
      }

      if (testSlug.startsWith('global-vocab-mini-')) {
        const nStr = testSlug.split('-').pop() || '1';
        const n = Math.max(1, Math.min(globalVocabTestCount, Number(nStr) || 1));
        if (!globalVocabTestCount) {
          alert('Vocabulary Global data is not enough to create a 25-question mini test yet.');
          return;
        }

        const map = ensureGlobalVocabMap();
        const indices = map[String(n)] || [];
        const selectedWords = indices.map((i) => ydsVocabulary2[i]).filter(Boolean);

        const questions = selectedWords
          .map((item: { word: string; meaning: string }, idx: number) => {
            const correctAnswer = item.meaning;
            const uniqueDistractors = Array.from(
              new Set(
                ydsVocabulary2
                  .filter((w) => w.meaning !== correctAnswer)
                  .map((w) => w.meaning)
              )
            );
            const distractors = shuffle(uniqueDistractors).slice(0, 3);
            if (distractors.length < 3) return null;

            const allOptions = shuffle([...distractors, correctAnswer]);
            const idsLower = ['a', 'b', 'c', 'd'];

            return {
              id: `global-vocab-mini-${n}-q${idx + 1}`,
              prompt: `What is the English meaning of **"${item.word}"**?`,
              choices: allOptions.map((optText: string, i: number) => ({
                id: idsLower[i],
                text: optText,
                isCorrect: optText === correctAnswer,
              })),
              explanation: `**${item.word}**: ${correctAnswer}`,
            };
          })
          .filter(Boolean);

        if (!questions.length) {
          alert('Not enough distinct meanings found to build this test right now.');
          return;
        }

        const title = `VOCABULARY GLOBAL · MINI TEST ${n} (25Q · ${GLOBAL_VOCAB_DURATION_MIN} min)`;
        const payload = {
          attemptId,
          testSlug,
          test: { title, duration: GLOBAL_VOCAB_DURATION_MIN },
          durationSeconds: GLOBAL_VOCAB_DURATION_MIN * 60,
          questions,
        };

        sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
        saveLast(title, testSlug);
        router.push(`/quiz/${attemptId}`);
        return;
      }

      if (testSlug.startsWith('english-deutsch-mini-')) {
        const nStr = testSlug.split('-').pop() || '1';
        const n = Math.max(1, Math.min(englishDeutschTestCount, Number(nStr) || 1));
        if (!englishDeutschTestCount) {
          alert('Not enough words to generate a 50-question test yet.');
          return;
        }

        const map = ensureEnglishDeutschMap();
        const indices = map[String(n)] || [];
        const selectedWords = indices.map((i) => englishDeutschWords[i]).filter(Boolean);

        const questions = selectedWords
          .map((item: { word: string; meaning: string }, idx: number) => {
            const correctAnswer = item.meaning;
            const uniqueDistractors = Array.from(
              new Set(
                englishDeutschWords
                  .filter((w) => w.meaning !== correctAnswer)
                  .map((w) => w.meaning)
              )
            );
            const distractors = shuffle(uniqueDistractors).slice(0, 3);
            if (distractors.length < 3) return null;

            const allOptions = shuffle([...distractors, correctAnswer]);
            const idsLower = ['a', 'b', 'c', 'd'];

            return {
              id: `english-deutsch-mini-${n}-q${idx + 1}`,
              prompt: `What is the German meaning of "${item.word}"?`,
              choices: allOptions.map((optText: string, i: number) => ({
                id: idsLower[i],
                text: optText,
                isCorrect: optText === correctAnswer,
              })),
              explanation: `"${item.word}" = ${correctAnswer}`,
            };
          })
          .filter(Boolean);

        if (!questions.length) {
          alert('Not enough words to generate a 50-question test yet.');
          return;
        }

        const title = `ENGLISH / DEUTSCH · MINI TEST ${n} (50Q · ${EN_DE_DURATION_MIN} min)`;
        const payload = {
          attemptId,
          testSlug,
          test: { title, duration: EN_DE_DURATION_MIN },
          durationSeconds: EN_DE_DURATION_MIN * 60,
          questions,
        };

        sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
        saveLast(title, testSlug);
        router.push(`/quiz/${attemptId}`);
        return;
      }

      if (testSlug.startsWith('turkish-greek-mini-')) {
        const numberText = testSlug.split('-').pop() || '1';
        const requestedTestNumber = Number(numberText);

        if (!turkishGreekTestCount) {
          alert('Türkçe / Yunanca testi oluşturmak için en az 50 geçerli kayıt gereklidir.');
          return;
        }

        if (
          !Number.isInteger(requestedTestNumber) ||
          requestedTestNumber < 1 ||
          requestedTestNumber > turkishGreekTestCount
        ) {
          alert(`Bu test bulunamadı. Lütfen 1 ile ${turkishGreekTestCount} arasında bir test seçin.`);
          return;
        }

        const testNumber = requestedTestNumber;
        const map = ensureTurkishGreekMap();
        const indices = map[String(testNumber)] || [];
        const selectedWords = indices
          .map((index) => turkishGreekWords[index])
          .filter((item): item is TurkishGreekWord => Boolean(item));

        if (selectedWords.length < TURKISH_GREEK_QUESTIONS_PER_TEST) {
          alert('Bu test için yeterli sayıda geçerli Yunanca kayıt bulunamadı.');
          return;
        }

        const formatAnswer = (item: TurkishGreekWord) =>
          `${item.meaning} — ${item.pronunciation}`;

        const questions = selectedWords
          .map((item, questionIndex) => {
            const correctAnswer = formatAnswer(item);
            const uniqueDistractors = Array.from(
              new Set(
                turkishGreekWords
                  .filter(
                    (otherItem) =>
                      otherItem.word !== item.word &&
                      formatAnswer(otherItem) !== correctAnswer
                  )
                  .map(formatAnswer)
              )
            );

            const distractors = shuffle(uniqueDistractors).slice(0, 3);
            if (distractors.length < 3) return null;

            const allOptions = shuffle([...distractors, correctAnswer]);
            const choiceIds = ['a', 'b', 'c', 'd'];

            return {
              id: `turkish-greek-mini-${testNumber}-q${questionIndex + 1}`,
              prompt: `**"${item.word}"** ifadesinin Yunancası hangisidir?`,
              choices: allOptions.map((optionText, optionIndex) => ({
                id: choiceIds[optionIndex],
                text: optionText,
                isCorrect: optionText === correctAnswer,
              })),
              explanation: `**${item.word}** = ${item.meaning} — ${item.pronunciation}`,
            };
          })
          .filter(Boolean);

        if (questions.length < TURKISH_GREEK_QUESTIONS_PER_TEST) {
          alert('Yeterli sayıda farklı cevap seçeneği oluşturulamadı.');
          return;
        }

        const title =
          `TÜRKÇE / YUNANCA · TEST ${testNumber} ` +
          `(${TURKISH_GREEK_QUESTIONS_PER_TEST} Soru · ${TURKISH_GREEK_DURATION_MIN} Dakika)`;

        const payload = {
          attemptId,
          testSlug,
          test: { title, duration: TURKISH_GREEK_DURATION_MIN },
          durationSeconds: TURKISH_GREEK_DURATION_MIN * 60,
          questions,
        };

        sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
        saveLast(title, testSlug);
        router.push(`/quiz/${attemptId}`);
        return;
      }

      if (testSlug.startsWith('daily-english-mini-')) {
        const nStr = testSlug.split('-').pop() || '1';
        const n = Number(nStr);

        if (!dailyEnglishTestCount) {
          alert('Daily English data is not available right now.');
          return;
        }

        if (!Number.isFinite(n) || n < 1 || n > dailyEnglishTestCount) {
          alert(`This Daily English test does not exist. Please choose a test between 1 and ${dailyEnglishTestCount}.`);
          return;
        }

        const cleanDailyEnglishData = ((dailyEnglishData as any[]) || [])
          .map((x: any) => ({
            word: String(x?.word ?? '').trim(),
            meaning: String(x?.meaning ?? '').trim(),
          }))
          .filter((x) => x.word && x.meaning);

        const startIndex = (n - 1) * DAILY_ENGLISH_QUESTIONS_PER_TEST;
        const endIndex = startIndex + DAILY_ENGLISH_QUESTIONS_PER_TEST;
        const selectedWords = cleanDailyEnglishData.slice(startIndex, endIndex);

        if (selectedWords.length < DAILY_ENGLISH_QUESTIONS_PER_TEST) {
          alert('This test range does not have enough questions yet.');
          return;
        }

        const questions = selectedWords
          .map((item: { word: string; meaning: string }, idx: number) => {
            const correctAnswer = item.meaning;
            const uniqueDistractors = Array.from(
              new Set(
                cleanDailyEnglishData
                  .filter((w) => w.meaning !== correctAnswer)
                  .map((w) => w.meaning)
              )
            );
            const distractors = shuffle(uniqueDistractors).slice(0, 3);
            if (distractors.length < 3) return null;

            const allOptions = shuffle([...distractors, correctAnswer]);
            const idsLower = ['a', 'b', 'c', 'd'];

            return {
              id: `daily-english-mini-${n}-q${idx + 1}`,
              prompt: `What is the Turkish meaning of "${item.word}"?`,
              choices: allOptions.map((optText: string, i: number) => ({
                id: idsLower[i],
                text: optText,
                isCorrect: optText === correctAnswer,
              })),
              explanation: `"${item.word}" = ${correctAnswer}`,
            };
          })
          .filter(Boolean);

        if (!questions.length) {
          alert('Not enough distinct meanings found to build this test right now.');
          return;
        }

        const title = `DAILY ENGLISH · TEST ${n} (${questions.length}Q · ${DAILY_ENGLISH_DURATION_MIN} min)`;
        const payload = {
          attemptId,
          testSlug,
          test: { title, duration: DAILY_ENGLISH_DURATION_MIN },
          durationSeconds: DAILY_ENGLISH_DURATION_MIN * 60,
          questions,
        };

        sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
        saveLast(title, testSlug);
        router.push(`/quiz/${attemptId}`);
        return;
      }

      if (testSlug.startsWith('adv-test-')) {
        const testNumber = testSlug.split('-').pop() || '1';
        const selectedQuestions = ADV_TEST_MAP[testNumber];
        if (!selectedQuestions?.length) {
          alert('This test is coming soon!');
          return;
        }

        const mappedQuestions = [...selectedQuestions].map((q: any, idx: number) => {
          const correctLetter = String(q.correct || 'A').trim().toUpperCase();
          const letters = ['A', 'B', 'C', 'D'];
          const idsLower = ['a', 'b', 'c', 'd'];

          return {
            id: `adv-${testNumber}-q${idx + 1}`,
            prompt: q.prompt,
            choices: letters.map((L, i) => ({
              id: idsLower[i],
              text: q[L] || `Option ${L}`,
              isCorrect: correctLetter === L,
            })),
            explanation: q.explanation || '',
          };
        });

        const title = `ADVANCED ENGLISH · TEST ${testNumber} (${mappedQuestions.length}Q · 45 min)`;

        const payload = {
          attemptId,
          testSlug,
          test: { title, duration: 45 },
          durationSeconds: 45 * 60,
          questions: mappedQuestions,
        };

        sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
        saveLast(title, testSlug);
        router.push(`/quiz/${attemptId}`);
        return;
      }

      // All shared tests use the same questions, answer keys and duration on every entry route.
      const sharedSlug = testSlug === 'yds-grammar-practice' ? 'yds-grammar' : testSlug;
      const testData = getQuestionsBySlug(sharedSlug, meaningLanguage);
      if (testData.questions.length) {
        const title = `${testData.title} (${testData.questions.length}Q · ${testData.duration} min)`;
        const payload = {
          attemptId,
          testSlug: sharedSlug,
          test: { title, duration: testData.duration },
          durationSeconds: testData.duration * 60,
          questions: testData.questions,
        };
        sessionStorage.setItem('em_attempt_payload', JSON.stringify(payload));
        saveLast(title, sharedSlug);
        router.push(`/quiz/${attemptId}?lang=${meaningLanguage}`);
        return;
      }

      // default: send to /start
      router.push(`/start?testSlug=${encodeURIComponent(testSlug)}&lang=${meaningLanguage}`);

}
