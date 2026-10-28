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
import { selectPlacementQuestions } from '@/lib/placement';

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
  level?: string;
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

// Stable selection keeps a public test consistent across server rendering,
// metadata generation and the start-page flow.
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

function hashSeed(value: string) {
  let seed = 2166136261;
  for (const char of value) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return seed >>> 0;
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Reject incomplete or ambiguous single-answer items instead of inventing an answer. */
export function normalizeQuestion(raw: any, fallbackId: string, seed: number): StandardQuestion | null {
  if (!raw || typeof raw !== 'object') return null;
  const prompt = textValue(raw.prompt) || textValue(raw.question) || textValue(raw.text);
  if (!prompt) return null;

  let choices: Array<{ text: string; isCorrect: boolean }> = [];
  const rawAnswer = raw.correct_option ?? raw.correct ?? raw.answer;

  if (Array.isArray(raw.choices)) {
    choices = raw.choices.map((choice: any) => ({
      text: textValue(choice?.text),
      isCorrect: choice?.isCorrect === true,
    }));
  } else if (Array.isArray(raw.options)) {
    const answerIndex = typeof rawAnswer === 'number'
      ? rawAnswer
      : typeof rawAnswer === 'string' && /^[A-Z]$/i.test(rawAnswer.trim())
        ? rawAnswer.trim().toUpperCase().charCodeAt(0) - 65
        : raw.options.findIndex((option: unknown) => option === rawAnswer);
    choices = raw.options.map((option: unknown, index: number) => ({
      text: textValue(option),
      isCorrect: index === answerIndex,
    }));
  } else if (raw.options && typeof raw.options === 'object') {
    const correctKey = String(rawAnswer ?? '').trim().toUpperCase();
    choices = Object.entries(raw.options).map(([key, value]) => ({
      text: textValue(value),
      isCorrect: key.toUpperCase() === correctKey,
    }));
  } else {
    const correctKey = String(rawAnswer ?? '').trim().toUpperCase();
    choices = ['A', 'B', 'C', 'D', 'E']
      .filter((letter) => raw[letter] !== undefined)
      .map((letter) => ({ text: textValue(raw[letter]), isCorrect: letter === correctKey }));
  }

  // An empty answer must not quietly turn into a scored distractor.
  if (choices.some((choice) => !choice.text)) return null;
  const unique = new Map<string, { text: string; isCorrect: boolean }>();
  for (const choice of choices) {
    const previous = unique.get(choice.text);
    unique.set(choice.text, { ...choice, isCorrect: choice.isCorrect || previous?.isCorrect === true });
  }
  const validChoices = [...unique.values()];
  if (validChoices.length < 2 || validChoices.filter((choice) => choice.isCorrect).length !== 1) return null;

  return {
    id: raw.id === undefined ? fallbackId : String(raw.id),
    prompt,
    choices: seededShuffle(validChoices, seed).map((choice, index) => ({
      ...choice,
      id: String.fromCharCode(97 + index),
    })),
    ...(textValue(raw.explanation) ? { explanation: textValue(raw.explanation) } : {}),
    ...(textValue(raw.level) ? { level: textValue(raw.level) } : {}),
  };
}

function usableQuestions<T>(questions: T[]): T[] {
  return questions.filter((question, index) => normalizeQuestion(question, String(index), index) !== null);
}

function meaningQuestions(
  items: any[],
  pool: any[],
  slug: string,
  prompt: (word: string) => string,
) {
  return items.map((item, index) => {
    const correct = textValue(item.meaning);
    const meanings = [...new Set(pool
      .filter((candidate) => textValue(candidate.word) !== textValue(item.word))
      .map((candidate) => textValue(candidate.meaning))
      .filter((meaning) => meaning && meaning !== correct))];
    const distractors = seededShuffle(meanings, hashSeed(`${slug}:distractors:${index}`)).slice(0, 3);
    return {
      id: `${slug}-${index + 1}`,
      prompt: prompt(textValue(item.word)),
      choices: [correct, ...distractors].map((text, choiceIndex) => ({ text, isCorrect: choiceIndex === 0 })),
      explanation: `${textValue(item.word)}: ${correct}`,
    };
  });
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

  const miniMatch = /^yds-(5000|3850|3750)-mini-([1-9]\d*)$/.exec(slug);
  if (miniMatch) {
    const n = Number(miniMatch[2]);
    const maxMiniTest = miniMatch[1] === '5000' ? 100 : 77;
    if (n > maxMiniTest) return { title, duration, questions: [] };

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

  // 2) Full YDS mock exams.
  else if (/^yds-exam-test-[1-9]\d*$/.test(slug)) {
    const num = slug.split('-').pop()!;
    rawQuestions = YDS_EXAM_MAP[num] || [];
    title = `YDS Real Exam - Mock Test ${num}`;
    duration = 150;
  }
  else if (/^daily-english-[1-9]\d*$/.test(slug)) {
    const n = Number(slug.split('-').pop());
    const start = (n - 1) * 50;
    rawQuestions = meaningQuestions(
      dailyEnglish.slice(start, start + 50),
      dailyEnglish,
      slug,
      (word) => `What is the Turkish meaning of "${word}"?`,
    );
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
  else if (/^level-(a1|a2|b1|b2|c1|c2)$/.test(slug)) {
    const targetLevel = slug.replace('level-', '').toUpperCase();
    rawQuestions = usableQuestions(levelTests.filter((q) => q.level === targetLevel)).slice(0, 20);
    title = `${targetLevel} Level Assessment`;
    duration = 20;
  }

  // 5) DİĞER ÖZEL TESTLER
  else if (slug === 'ielts-grammar') {
    rawQuestions = ieltsGrammar;
    title = 'IELTS Grammar (Advanced)';
    duration = 45;
  } else if (slug === 'grammar-mega-test-100') {
    rawQuestions = seededShuffle(usableQuestions(grammarTopicTests), hashSeed(slug)).slice(0, 100);
    title = 'Grammar Mega Test (100Q)';
    duration = 90;
  } else if (slug === 'vocab-b1-c1-50') {
    rawQuestions = seededShuffle(usableQuestions(vocabTests), hashSeed(slug)).slice(0, 50);
    title = 'Vocabulary Challenge (B1-C1)';
    duration = 40;
  } else if (slug === 'quick-placement') {
    rawQuestions = selectPlacementQuestions(usableQuestions(levelTests));
    title = 'Quick Placement Test';
    duration = 20;
  } else if (slug === 'yds-reading') {
    rawQuestions = ydsReadingPassages.flatMap((passage) => passage.questions.map((question, index) => ({
      ...question,
      id: `yds-reading-${passage.passageId}-${index + 1}`,
      prompt: `${passage.title}\n\n${passage.text}\n\n${question.prompt}`,
    })));
    title = 'YDS Reading Comprehension';
    duration = 80;
  } else if (slug === 'yds-phrasal-verbs') {
    rawQuestions = meaningQuestions(
      seededShuffle(ydsPhrasals, hashSeed(slug)).slice(0, 100),
      ydsPhrasals,
      slug,
      (word) => `What is the Turkish meaning of the phrasal verb "${word}"?`,
    );
    title = 'YDS Phrasal Verbs Practice';
    duration = 75;
  } else if (slug === 'yds-synonyms') {
    rawQuestions = seededShuffle(ydsSynonyms, hashSeed(slug)).slice(0, 50).map((item, index) => {
      const correct = textValue(item.synonym);
      const distractors = [...new Set(item.distractors.map(textValue))].filter((value) => value && value !== correct);
      const meaning = textValue(item.meaning_tr) || textValue(item.meaning);
      return {
        id: `yds-synonyms-${index + 1}`,
        prompt: `Which word or phrase is closest in meaning to "${item.word}"?`,
        choices: [correct, ...distractors].map((text, choiceIndex) => ({ text, isCorrect: choiceIndex === 0 })),
        explanation: `A synonym of "${item.word}" is "${correct}".${meaning ? ` Turkish: ${meaning}.` : ''}`,
      };
    });
    title = 'YDS Synonyms Practice';
    duration = 40;
  } else if (slug === 'yds-conjunctions') {
    rawQuestions = seededShuffle(ydsConjunctions, hashSeed(slug)).slice(0, 50);
    title = 'YDS Conjunctions (Bağlaçlar)';
    duration = 35;
  } else if (slug === 'yds-grammar' || slug === 'yds-grammar-practice') {
    rawQuestions = seededShuffle(ydsGrammarQuestions, hashSeed('yds-grammar')).slice(0, 100);
    title = 'YDS Grammar Practice';
    duration = 90;
  }

  const canonicalSlug = slug === 'yds-grammar-practice' ? 'yds-grammar' : slug;
  const formattedQuestions = rawQuestions
    .map((question, index) => normalizeQuestion(
      // Some source files repeat IDs. An attempt must have one answer slot per question.
      { ...question, id: `${canonicalSlug}-${index}` },
      `${canonicalSlug}-${index}`,
      hashSeed(`${canonicalSlug}:${index}`),
    ))
    .filter((question): question is StandardQuestion => question !== null);

  return { title, duration, questions: formattedQuestions };
};
