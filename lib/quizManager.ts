// lib/quizManager.ts

// --- DATA IMPORTS ---
import grammarTopicTests from '@/data/grammar_topic_tests.json';
import levelTests from '@/data/english_test_questions.json';
import vocabTests from '@/data/vocabulary_b1_c1_test.json';
import ieltsGrammar from '@/data/ielts_grammar.json';

import ydsVocabulary from '@/data/yds_vocabulary.json';
import ydsGrammarQuestions from '@/data/yds_grammar.json';
import ydsPhrasals from '@/data/yds_phrasal_verbs.json';
import ydsReadingPassages from '@/data/yds_reading.json';
import ydsSynonyms from '@/data/yds_synonyms.json';
import ydsConjunctions from '@/data/yds_conjunctions.json';

// --- YDS EXAM DENEMELERİ (1..15) ---
import ydsExam1 from '@/data/yds_exam_questions.json';
import ydsExam2 from '@/data/yds_exam_questions_2.json';
import ydsExam3 from '@/data/yds_exam_questions_3.json';
import ydsExam4 from '@/data/yds_exam_questions_4.json';
import ydsExam5 from '@/data/yds_exam_questions_5.json';
import ydsExam6 from '@/data/yds_exam_questions_6.json';
import ydsExam7 from '@/data/yds_exam_questions_7.json';
import ydsExam8 from '@/data/yds_exam_questions_8.json';
import ydsExam9 from '@/data/yds_exam_questions_9.json';
import ydsExam10 from '@/data/yds_exam_questions_10.json';
import ydsExam11 from '@/data/yds_exam_questions_11.json';
import ydsExam12 from '@/data/yds_exam_questions_12.json';
import ydsExam13 from '@/data/yds_exam_questions_13.json';
import ydsExam14 from '@/data/yds_exam_questions_14.json';
import ydsExam15 from '@/data/yds_exam_questions_15.json';
import ydsExam16 from '@/data/yds_exam_questions_16.json';
import ydsExam17 from '@/data/yds_exam_questions_17.json';
import ydsExam18 from '@/data/yds_exam_questions_18.json';
import ydsExam19 from '@/data/yds_exam_questions_19.json';
import ydsExam20 from '@/data/yds_exam_questions_20.json';
import ydsExam21 from '@/data/yds_exam_questions_21.json';
import ydsExam22 from '@/data/yds_exam_questions_22.json';
import ydsExam23 from '@/data/yds_exam_questions_23.json';
import ydsExam24 from '@/data/yds_exam_questions_24.json';
import ydsExam25 from '@/data/yds_exam_questions_25.json';
import ydsExam26 from '@/data/yds_exam_questions_26.json';
import ydsExam27 from '@/data/yds_exam_questions_27.json';
import ydsExam28 from '@/data/yds_exam_questions_28.json';
import ydsExam29 from '@/data/yds_exam_questions_29.json';
import ydsExam30 from '@/data/yds_exam_questions_30.json';
import ydsExam31 from '@/data/yds_exam_questions_31.json';
import ydsExam32 from '@/data/yds_exam_questions_32.json';
import dailyEnglish from '@/data/dailyenglish.json';

const YDS_EXAM_MAP: Record<string, any[]> = {
  '1': ydsExam1,
  '2': ydsExam2,
  '3': ydsExam3, '4': ydsExam4, '5': ydsExam5, '6': ydsExam6, '7': ydsExam7, '8': ydsExam8,
  '9': ydsExam9, '10': ydsExam10, '11': ydsExam11, '12': ydsExam12, '13': ydsExam13, '14': ydsExam14,
  '15': ydsExam15, '16': ydsExam16, '17': ydsExam17, '18': ydsExam18, '19': ydsExam19, '20': ydsExam20,
  '21': ydsExam21, '22': ydsExam22, '23': ydsExam23, '24': ydsExam24, '25': ydsExam25, '26': ydsExam26,
  '27': ydsExam27, '28': ydsExam28, '29': ydsExam29, '30': ydsExam30, '31': ydsExam31, '32': ydsExam32,
};

// --- TYPES ---
export interface StandardQuestion {
  id: string;
  prompt: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
}


type MeaningLanguageCode = 'tr' | 'de' | 'es' | 'it' | 'fr';

const MEANING_LANGUAGE_LABELS: Record<MeaningLanguageCode, string> = {
  tr: 'Turkish',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  fr: 'French',
};

function normalizeMeaningLanguage(value?: string | null): MeaningLanguageCode {
  if (value === 'de' || value === 'es' || value === 'it' || value === 'fr' || value === 'tr') return value;
  return 'tr';
}

function getLocalizedMeaning(item: any, language: MeaningLanguageCode): string {
  const localized = item?.meanings?.[language];
  if (typeof localized === 'string' && localized.trim()) return localized.trim();

  const fallback = item?.meaning;
  return typeof fallback === 'string' ? fallback.trim() : '';
}

// --- HELPERS ---
function shuffleArray<T>(arr: T[]): T[] {
  // (Genel kullanım için random kalabilir; SEO kritik yerlerde seeded kullanıyoruz)
  return [...arr].sort(() => Math.random() - 0.5);
}

// SEO İçin Kritik: Google botu her geldiğinde aynı soruları görsün diye Sabit Rastgelelik (LCG)
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
  while (picked.size < Math.min(need, total)) {
    picked.add(Math.floor(rand() * total));
  }
  return Array.from(picked);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  const rand = lcg(seed);
  // Fisher-Yates
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// --- MAPPINGS ---
const grammarSlugToTag: Record<string, string> = {
  'test-perfect-past': 'perfect_tenses',
  'test-conditionals': 'conditionals',
  'test-relatives': 'relative_clauses',
  'test-articles': 'articles',
  'test-tenses-mixed': 'mixed_tenses',
  'test-passive-voice': 'passive_voice_adv',
  'test-reported-speech': 'reported_speech',
  'test-gerunds-infinitives': 'gerunds_infinitives',
  'test-clauses-advanced': 'clauses_advanced',
  'test-modals-advanced': 'modals_advanced',
  'test-prepositions-advanced': 'prepositions_advanced',
};

const grammarTitleMap: Record<string, string> = {
  'test-perfect-past': 'Perfect Tenses',
  'test-conditionals': 'Conditionals',
  'test-relatives': 'Relative Clauses',
  'test-articles': 'Articles',
  'test-tenses-mixed': 'Mixed Tenses',
  'test-passive-voice': 'Passive Voice (Adv)',
  'test-reported-speech': 'Reported Speech (Adv)',
  'test-gerunds-infinitives': 'Gerunds & Infinitives',
  'test-clauses-advanced': 'Noun/Adj/Adv Clauses',
  'test-modals-advanced': 'Modal Verbs (Adv)',
  'test-prepositions-advanced': 'Prepositions (Adv)',
};

// --- MAIN FUNCTION ---
export const getQuestionsBySlug = (
  slug: string,
  meaningLanguageInput?: string | null
): { title: string; duration: number; questions: StandardQuestion[] } => {
  let rawQuestions: any[] = [];
  let title = 'English Practice Test';
  let duration = 30; // Varsayılan süre (dakika)
  const meaningLanguage = normalizeMeaningLanguage(meaningLanguageInput);

  // 1) YDS 3850 MINI VOCAB TESTS (yds-3850-mini-1 .. 77)
  // Geriye dönük: yds-3750-mini-... slug’larını da kabul ediyoruz.
  if (slug.startsWith('yds-5000-mini-') || slug.startsWith('yds-3850-mini-') || slug.startsWith('yds-3750-mini-')) {
    const nRaw = parseInt(slug.split('-').pop() || '1', 10);
    const maxMiniTest = slug.startsWith('yds-5000-mini-') ? 100 : 77;
    const n = Number.isFinite(nRaw) ? clampInt(nRaw, 1, maxMiniTest) : 1;

    const pool = ydsVocabulary as any[];
    const indices = seededUniqueIndices(pool.length, 50, 1000 + n * 9991); // Sabit seed

    title = slug.startsWith('yds-5000-mini-')
      ? `YDS 5000 Words - Mini Test ${n}`
      : `YDS 3850 Words - Mini Test ${n}`;
    duration = 25;

    rawQuestions = indices.map((i) => {
      const item = pool[i];
      const correctMeaning = getLocalizedMeaning(item, meaningLanguage);
      const meaningLabel = MEANING_LANGUAGE_LABELS[meaningLanguage];

      // Distractor havuzu (aynı kelime ve aynı meaning hariç)
      const dPool = pool
        .filter((x) => x?.word !== item?.word)
        .map((x) => getLocalizedMeaning(x, meaningLanguage))
        .filter((meaning) => meaning && meaning !== correctMeaning);
      const uniqueDPool = Array.from(new Set(dPool));

      // ✅ Distractor seçimi seeded (SEO tutarlı)
      const rand2 = lcg(5000 + n * 777 + i);
      const picked = new Set<number>();
      while (picked.size < Math.min(3, uniqueDPool.length)) {
        picked.add(Math.floor(rand2() * uniqueDPool.length));
      }
      const selectedDistractors = Array.from(picked).map((idx) => uniqueDPool[idx]).filter(Boolean);

      // ✅ Şık karıştırma da seeded (SEO tutarlı)
      const baseChoices = [correctMeaning, ...selectedDistractors];
      const shuffledChoices = seededShuffle(baseChoices, 9000 + n * 111 + i);

      const letterIds = ['a', 'b', 'c', 'd'];
      const choices = shuffledChoices.slice(0, 4).map((text, idx) => ({
        id: letterIds[idx],
        text,
        isCorrect: text === correctMeaning,
      }));

      return {
        id: `yds3850-mini-${n}-v-${i}`,
        prompt: `What is the ${meaningLabel} meaning of **"${item.word}"**?`,
        choices,
        explanation: `**${item.word}** means **${correctMeaning}** in ${meaningLabel}.`,
      };
    });

    return { title, duration, questions: rawQuestions as StandardQuestion[] };
  }

  // 2) YDS REAL EXAM PACK (yds-exam-test-1 .. 15)
  else if (slug.startsWith('yds-exam-test-')) {
    const num = slug.split('-').pop() || '1';
    rawQuestions = YDS_EXAM_MAP[num] || [];
    title = `YDS Real Exam - Mock Test ${num}`;
    duration = 150;
  }
  else if (slug.startsWith('daily-english-')) {
    const nRaw = parseInt(slug.split('-').pop() || '1', 10);
    const n = Number.isFinite(nRaw) ? nRaw : 1;
    const start = (n - 1) * 50;
    rawQuestions = (dailyEnglish as any[]).slice(start, start + 50).map((item, idx, arr) => {
      const choices = seededShuffle(
        [item.meaning, ...arr.filter((_, i) => i !== idx).slice(0, 3).map((x) => x.meaning)],
        45000 + n * 121 + idx
      );
      return {
        id: `daily-english-${n}-${idx + 1}`,
        prompt: `What is the Turkish meaning of "${item.word}"?`,
        choices: choices.map((text, i) => ({ id: ['a', 'b', 'c', 'd'][i], text, isCorrect: text === item.meaning })),
      };
    });
    title = `Daily English Test ${n}`;
    duration = 25;
  }

  // 3) GRAMMAR FOCUS TESTLERİ
  else if (grammarSlugToTag[slug]) {
    const tag = grammarSlugToTag[slug];
    rawQuestions = (grammarTopicTests as any[]).filter((q) => q.tags?.includes(tag)).slice(0, 20);
    title = (grammarTitleMap[slug] || 'Grammar') + ' Practice';
    duration = 30;
  }

  // 4) CEFR LEVEL TESTLERİ (level-a1 .. level-c2)
  else if (slug.startsWith('level-')) {
    const targetLevel = slug.replace('level-', '').toUpperCase();
    rawQuestions = (levelTests as any[]).filter((q) => q.level === targetLevel).slice(0, 20);
    title = `${targetLevel} Level Assessment`;
    duration = 20;
  }

  // 5) DİĞER ÖZEL TESTLER
  else if (slug === 'ielts-grammar') {
    rawQuestions = ieltsGrammar;
    title = 'IELTS Grammar (Advanced)';
    duration = 45;
  } else if (slug === 'grammar-mega-test-100') {
    rawQuestions = shuffleArray(grammarTopicTests).slice(0, 100);
    title = 'Grammar Mega Test (100Q)';
    duration = 90;
  } else if (slug === 'vocab-b1-c1-50') {
    rawQuestions = shuffleArray(vocabTests).slice(0, 50);
    title = 'Vocabulary Challenge (B1-C1)';
    duration = 40;
  } else if (slug === 'quick-placement') {
    rawQuestions = shuffleArray(levelTests).slice(0, 25);
    title = 'Quick Placement Test';
    duration = 15;
  } else if (slug === 'yds-reading') {
    rawQuestions = ydsReadingPassages; // Not: Reading için özel render gerekebilir
    title = 'YDS Reading Comprehension';
    duration = 80;
  } else if (slug === 'yds-phrasal-verbs') {
    rawQuestions = shuffleArray(ydsPhrasals).slice(0, 50);
    title = 'YDS Phrasal Verbs Practice';
    duration = 40;
  } else if (slug === 'yds-synonyms') {
    rawQuestions = shuffleArray(ydsSynonyms).slice(0, 50);
    title = 'YDS Synonyms Practice';
    duration = 40;
  } else if (slug === 'yds-conjunctions') {
    rawQuestions = shuffleArray(ydsConjunctions).slice(0, 50);
    title = 'YDS Conjunctions (Bağlaçlar)';
    duration = 35;
  } else if (slug === 'yds-grammar') {
    rawQuestions = shuffleArray(ydsGrammarQuestions).slice(0, 50);
    title = 'YDS Grammar Practice';
    duration = 45;
  } else {
    // Fallback
    rawQuestions = (levelTests as any[]).slice(0, 10);
    title = 'English Practice';
    duration = 15;
  }

  // --- FORMATLAMA: TÜM VERİLERİ STANDART StandardQuestion FORMATINA ÇEVİR ---
  const formattedQuestions: StandardQuestion[] = rawQuestions.map((q, index) => {
    const prompt = q.prompt || q.question || q.text || 'Question missing?';
    let choices: any[] = [];

    // Format 1: A, B, C, D, E alanları varsa (Grammar/Exam)
    if (q.A !== undefined) {
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const correctLetter = String(q.correct || q.answer || 'A').trim().toUpperCase();
      choices = letters
        .map((L) => ({
          id: L.toLowerCase(),
          text: q[L],
          isCorrect: correctLetter === L,
        }))
        .filter((c) => !!c.text);
    }
    // Format 2: options nesnesi varsa (IELTS)
    else if (q.options && !Array.isArray(q.options)) {
      const correctKey = String(q.correct_option || q.answer || 'A').trim().toUpperCase();
      choices = Object.keys(q.options).map((key) => ({
        id: String(key).toLowerCase(),
        text: q.options[key],
        isCorrect: String(key).toUpperCase() === correctKey,
      }));
    }
    // Format 3: choices array ise
    else if (Array.isArray(q.choices)) {
      choices = q.choices.map((c: any, i: number) => ({
        id: c.id || ['a', 'b', 'c', 'd'][i],
        text: c.text,
        isCorrect: !!c.isCorrect,
      }));
    }
    // Format 4: options array ise (levelTests gibi)
    else if (Array.isArray(q.options)) {
      const labels = ['a', 'b', 'c', 'd'];
      const opts = q.options.slice(0, 4);
      const rawAnswer = q.answer ?? q.correct_option ?? q.correct;

      let correctIndex = -1;
      if (typeof rawAnswer === 'number') {
        correctIndex = rawAnswer;
      } else if (typeof rawAnswer === 'string') {
        const byLetter = ['A', 'B', 'C', 'D'].indexOf(rawAnswer.toUpperCase());
        if (byLetter !== -1) correctIndex = byLetter;
        else correctIndex = opts.findIndex((o: any) => String(o) === rawAnswer);
      }

      choices = opts.map((opt: any, i: number) => ({
        id: labels[i],
        text: String(opt),
        isCorrect: i === correctIndex,
      }));
    }

    return {
      id: q.id || `${slug}-${index}`,
      prompt,
      choices,
      explanation: q.explanation,
    };
  });

  return { title, duration, questions: formattedQuestions };
};
