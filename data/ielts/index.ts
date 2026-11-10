import { IELTS_GRAMMAR_FOUNDATIONS } from './foundations';
import { IELTS_GRAMMAR_STRUCTURES } from './structures';
import { IELTS_GRAMMAR_ADVANCED } from './advanced';
import type { IeltsGrammarTest } from './types';

export const IELTS_GRAMMAR_TESTS: readonly IeltsGrammarTest[] = [
  ...IELTS_GRAMMAR_FOUNDATIONS,
  ...IELTS_GRAMMAR_STRUCTURES,
  ...IELTS_GRAMMAR_ADVANCED,
];
