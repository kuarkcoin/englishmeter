import type { PracticeTest } from '../practice/types';

export type IeltsGrammarTest = PracticeTest & {
  category: 'ielts-grammar';
  number: number;
  guide: readonly {
    heading: string;
    body: string;
    example: string;
  }[];
};
