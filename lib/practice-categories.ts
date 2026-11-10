import type { PracticeCategory } from '@/data/practice/types';

export type PracticeCategoryDefinition = {
  id: PracticeCategory;
  category: PracticeCategory;
  name: string;
  description: string;
  path: string;
};

// Homepage navigation can use this module without importing any question banks.
export const PRACTICE_CATEGORIES: readonly PracticeCategoryDefinition[] = [
  {
    id: 'ielts-grammar', category: 'ielts-grammar', name: 'IELTS Grammar',
    description: 'Practise IELTS grammar with 10 free tests of 15 questions. Review tenses, articles, complex sentences and more with answers and clear explanations.',
    path: '/ielts-grammar-tests',
  },
  {
    id: 'reading', category: 'reading', name: 'Reading Comprehension',
    description: 'Read original English texts from A1 to C1 and practise understanding details, main ideas and meaning in context.',
    path: '/practice/reading',
  },
  {
    id: 'vocabulary', category: 'vocabulary', name: 'Thematic Vocabulary',
    description: 'Build A1–A2 vocabulary for family, food, home, shopping, transport and weather through short everyday contexts.',
    path: '/practice/vocabulary',
  },
  {
    id: 'word-formation', category: 'word-formation', name: 'Word Formation',
    description: 'Practise B1–C1 word families, prefixes and suffixes. Choose the noun, verb, adjective or adverb that fits each sentence.',
    path: '/practice/word-formation',
  },
  {
    id: 'kids', category: 'kids', name: 'Kids English',
    description: 'Try short, friendly English quizzes about colours, animals, numbers, family, school and food. Learn one question at a time.',
    path: '/kids',
  },
];

export function getPracticeCategory(value: string): PracticeCategoryDefinition | undefined {
  return PRACTICE_CATEGORIES.find((item) => item.id === value.toLowerCase());
}
