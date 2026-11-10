import type { PracticeCategory } from '@/data/practice/types';

export type PracticeCategoryDefinition = {
  id: PracticeCategory;
  category: PracticeCategory;
  name: string;
  description: string;
  path: string;
  questionCount: number;
};

// Homepage navigation can use this module without importing any question banks.
export const PRACTICE_CATEGORIES: readonly PracticeCategoryDefinition[] = [
  {
    id: 'ielts-grammar', category: 'ielts-grammar', name: 'IELTS Grammar',
    description: 'Practise IELTS grammar with 10 free tests of 15 questions. Review tenses, articles, complex sentences and more with answers and clear explanations.',
    path: '/ielts-grammar-tests', questionCount: 15,
  },
  {
    id: 'business-english', category: 'business-english', name: 'Business English',
    description: 'Take free Business English tests with answers. Practise workplace vocabulary, meetings, email language and professional grammar in three 20-question sets.',
    path: '/business-english-tests', questionCount: 20,
  },
  {
    id: 'toeic-reading', category: 'toeic-reading', name: 'TOEIC Reading',
    description: 'Practise TOEIC Reading Parts 5, 6 and 7 with free questions and explanations: incomplete sentences, text completion and workplace reading comprehension.',
    path: '/toeic-reading-tests', questionCount: 20,
  },
  {
    id: 'cambridge-use-of-english', category: 'cambridge-use-of-english', name: 'Cambridge Use of English',
    description: 'Practise B2 First (FCE) and C1 Advanced (CAE) Use of English Part 1 with original multiple-choice cloze texts, answers and clear explanations.',
    path: '/cambridge-english-tests', questionCount: 16,
  },
  {
    id: 'reading', category: 'reading', name: 'Reading Comprehension',
    description: 'Read original English texts from A1 to C1 and practise understanding details, main ideas and meaning in context.',
    path: '/practice/reading', questionCount: 20,
  },
  {
    id: 'vocabulary', category: 'vocabulary', name: 'Thematic Vocabulary',
    description: 'Build A1–A2 vocabulary for family, food, home, shopping, transport and weather through short everyday contexts.',
    path: '/practice/vocabulary', questionCount: 20,
  },
  {
    id: 'word-formation', category: 'word-formation', name: 'Word Formation',
    description: 'Practise B1–C1 word families, prefixes and suffixes. Choose the noun, verb, adjective or adverb that fits each sentence.',
    path: '/practice/word-formation', questionCount: 20,
  },
  {
    id: 'kids', category: 'kids', name: 'Kids English',
    description: 'Try short, friendly English quizzes about colours, animals, numbers, family, school and food. Learn one question at a time.',
    path: '/kids', questionCount: 10,
  },
];

export function getPracticeCategory(value: string): PracticeCategoryDefinition | undefined {
  return PRACTICE_CATEGORIES.find((item) => item.id === value.toLowerCase());
}

export function getFeaturedPracticeCategory(selector?: string): PracticeCategoryDefinition | undefined {
  return PRACTICE_CATEGORIES.find((item) =>
    ['ielts-grammar', 'business-english', 'toeic-reading', 'cambridge-use-of-english'].includes(item.id) &&
    selector?.startsWith(`practice-${item.id}-`),
  );
}
