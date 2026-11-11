import { LEVEL_CATALOG } from '@/lib/level-catalog';
import { PRACTICE_TESTS, getPracticeTestPath } from '@/lib/practice-catalog';
import { PRACTICE_CATEGORIES } from '@/lib/practice-categories';
import { PRIMARY_TEST_CATEGORIES, type TestDiscoveryEntry } from '@/lib/test-discovery';
// --- DATA IMPORTS ---
import topicQuestions from '@/data/grammar_topic_tests.json';
import ydsVocabulary2Raw from '@/data/data/yds_vocabulary2.json';
import dailyEnglishData from '@/data/dailyenglish.json';
import turkishGreekData from '@/data/turkish_greek.json';

// --- YDS EXAM DENEMELERİ (1..15) ---
import ydsExamQuestions1 from '@/data/yds_exam_questions.json';
import ydsExamQuestions2 from '@/data/yds_exam_questions_2.json';
import ydsExamQuestions3 from '@/data/yds_exam_questions_3.json';
import ydsExamQuestions4 from '@/data/yds_exam_questions_4.json';
import ydsExamQuestions5 from '@/data/yds_exam_questions_5.json';
import ydsExamQuestions6 from '@/data/yds_exam_questions_6.json';
import ydsExamQuestions7 from '@/data/yds_exam_questions_7.json';
import ydsExamQuestions8 from '@/data/yds_exam_questions_8.json';
import ydsExamQuestions9 from '@/data/yds_exam_questions_9.json';
import ydsExamQuestions10 from '@/data/yds_exam_questions_10.json';
import ydsExamQuestions11 from '@/data/yds_exam_questions_11.json';
import ydsExamQuestions12 from '@/data/yds_exam_questions_12.json';
import ydsExamQuestions13 from '@/data/yds_exam_questions_13.json';
import ydsExamQuestions14 from '@/data/yds_exam_questions_14.json';
import ydsExamQuestions15 from '@/data/yds_exam_questions_15.json';
import ydsExamQuestions16 from '@/data/yds_exam_questions_16.json';
import ydsExamQuestions17 from '@/data/yds_exam_questions_17.json';
import ydsExamQuestions18 from '@/data/yds_exam_questions_18.json';
import ydsExamQuestions19 from '@/data/yds_exam_questions_19.json';
import ydsExamQuestions20 from '@/data/yds_exam_questions_20.json';
import ydsExamQuestions21 from '@/data/yds_exam_questions_21.json';
import ydsExamQuestions22 from '@/data/yds_exam_questions_22.json';
import ydsExamQuestions23 from '@/data/yds_exam_questions_23.json';
import ydsExamQuestions24 from '@/data/yds_exam_questions_24.json';
import ydsExamQuestions25 from '@/data/yds_exam_questions_25.json';
import ydsExamQuestions26 from '@/data/yds_exam_questions_26.json';
import ydsExamQuestions27 from '@/data/yds_exam_questions_27.json';
import ydsExamQuestions28 from '@/data/yds_exam_questions_28.json';
import ydsExamQuestions29 from '@/data/yds_exam_questions_29.json';
import ydsExamQuestions30 from '@/data/yds_exam_questions_30.json';
import ydsExamQuestions31 from '@/data/yds_exam_questions_31.json';
import ydsExamQuestions32 from '@/data/yds_exam_questions_32.json';
import { ADVANCED_QUESTION_RANGE } from '@/lib/advanced-tests';
// --- TEST DATA MAP ---
const YDS_EXAM_MAP: Record<string, any[]> = {
  '1': ydsExamQuestions1,
  '2': ydsExamQuestions2,
  '3': ydsExamQuestions3,
  '4': ydsExamQuestions4,
  '5': ydsExamQuestions5,
  '6': ydsExamQuestions6,
  '7': ydsExamQuestions7,
  '8': ydsExamQuestions8,
  '9': ydsExamQuestions9,
  '10': ydsExamQuestions10,
  '11': ydsExamQuestions11,
  '12': ydsExamQuestions12,
  '13': ydsExamQuestions13,
  '14': ydsExamQuestions14,
  '15': ydsExamQuestions15,
  '16': ydsExamQuestions16,
  '17': ydsExamQuestions17,
  '18': ydsExamQuestions18,
  '19': ydsExamQuestions19,
  '20': ydsExamQuestions20,
  '21': ydsExamQuestions21,
  '22': ydsExamQuestions22,
  '23': ydsExamQuestions23,
  '24': ydsExamQuestions24,
  '25': ydsExamQuestions25,
  '26': ydsExamQuestions26,
  '27': ydsExamQuestions27,
  '28': ydsExamQuestions28,
  '29': ydsExamQuestions29,
  '30': ydsExamQuestions30,
  '31': ydsExamQuestions31,
  '32': ydsExamQuestions32,
};

const slugToTag: Record<string, string> = {
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

import type { HomeTestSummary } from '@/lib/home-test-types';

// This module is used by the server page. Only counts, never question banks, cross into HomeClient.
export function getHomeTestSummary(): HomeTestSummary {
  const wordCount = (items: Array<{word?: string; meaning?: string}>) => items.filter((item) => String(item?.word ?? '').trim() && String(item?.meaning ?? '').trim()).length;
  const rawGreek: unknown = turkishGreekData;
  const greek = Array.isArray(rawGreek) ? rawGreek : rawGreek && typeof rawGreek === 'object' ? [rawGreek] : [];
  const searchTests: TestDiscoveryEntry[] = [
    ...PRIMARY_TEST_CATEGORIES,
    ...PRACTICE_CATEGORIES.map((category) => ({ title: category.name, href: category.path, category: category.id })),
    { title: 'Daily English', href: '/daily-english', category: 'vocabulary' },
    { title: 'Advanced English Tests', href: '/advanced-tests', category: 'advanced' },
    { title: 'Global English Challenge', href: '/challenge', category: 'challenge' },
    ...LEVEL_CATALOG.flatMap((level) => [
      { title: `${level.label} ${level.name} English Tests`, href: `/levels/${level.key}`, category: 'grammar' },
      ...level.topics.map((topic) => ({ title: `${level.label} ${topic.title}`, href: `/levels/${level.key}/${topic.slug}`, category: 'grammar' })),
    ]),
    ...PRACTICE_TESTS.map((test) => ({ title: `${test.level} ${test.title}`, href: getPracticeTestPath(test), category: test.category })),
    ...Object.keys(YDS_EXAM_MAP).map((number) => ({ title: `YDS Practice Exam ${number}`, href: `/tests/yds-exam-test-${number}`, category: 'yds' })),
    { title: 'English Grammar Mega Test · 100 questions', href: '/tests/grammar-mega-test-100', category: 'grammar' },
    { title: 'B1–C1 Vocabulary Test · 50 questions', href: '/tests/vocab-b1-c1-50', category: 'vocabulary' },
    { title: 'YDS Phrasal Verbs', href: '/tests/yds-phrasal-verbs', category: 'yds' },
    { title: 'YDS Grammar Practice', href: '/tests/yds-grammar', category: 'yds' },
    { title: 'YDS Reading Comprehension', href: '/tests/yds-reading', category: 'yds' },
  ];
  return {
    searchTests: [...new Map(searchTests.map((test) => [test.href, test])).values()],
    globalVocabularyWords: wordCount(ydsVocabulary2Raw),
    dailyEnglishWords: wordCount(dailyEnglishData),
    turkishGreekWords: greek.filter((item) => String(item.word ?? '').trim() && String(item.meaning ?? '').trim() && String(item.pronunciation ?? '').trim()).length,
    examQuestionCounts: Object.fromEntries(Object.entries(YDS_EXAM_MAP).map(([id, questions]) => [id, questions.length])),
    grammarQuestionCounts: Object.fromEntries(Object.entries(slugToTag).map(([slug, tag]) => [slug, Math.min(20, topicQuestions.filter((q) => q.tags?.includes(tag)).length)])),
    advancedQuestionRange: ADVANCED_QUESTION_RANGE,
  };
}
