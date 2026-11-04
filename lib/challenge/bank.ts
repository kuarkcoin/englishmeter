// SERVER ONLY: import this answer bank from challenge API/server services only.
// Client components must import public types/core and receive publicQuestions(...).
import { CHALLENGE_GRAMMAR } from '../../data/challenge/grammar';
import { CHALLENGE_VOCABULARY } from '../../data/challenge/vocabulary';
import { CHALLENGE_READING } from '../../data/challenge/reading';
import { validateDay } from './core';
import type { ChallengeCategory, ChallengeLevel, ChallengeQuestion } from './types';

export const BANK_VERSION = '2026-11-04-v1';
const LEVELS: ChallengeLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const CATEGORIES: ChallengeCategory[] = ['grammar', 'vocabulary', 'reading'];
const questionBank: ChallengeQuestion[] = [
  ...CHALLENGE_GRAMMAR,
  ...CHALLENGE_VOCABULARY,
  ...CHALLENGE_READING,
];

/** Stable Fisher–Yates shuffle; no runtime randomness or server locale dependence. */
function shuffled<T>(items: readonly T[], seed: string): T[] {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    state = Math.imul(state ^ seed.charCodeAt(index), 16777619) >>> 0;
  }
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function rotatingSlice<T>(items: readonly T[], dayIndex: number, count: number): T[] {
  const start = ((dayIndex * count) % items.length + items.length) % items.length;
  return Array.from({ length: count }, (_, index) => items[(start + index) % items.length]);
}

export function validateChallengeBank(questions: readonly ChallengeQuestion[] = questionBank): void {
  const ids = new Set<string>();
  const passages = new Map<string, { passage: string; count: number }>();
  for (const question of questions) {
    if (!question.id?.trim() || ids.has(question.id)) throw new Error(`Duplicate or missing challenge id: ${question.id}`);
    ids.add(question.id);
    if (!CATEGORIES.includes(question.category) || !LEVELS.includes(question.level)) {
      throw new Error(`Invalid challenge category/level: ${question.id}`);
    }
    if (!question.prompt?.trim() || !question.explanation?.trim()) throw new Error(`Missing challenge text: ${question.id}`);
    if (!Array.isArray(question.options) || question.options.length !== 5 ||
      question.options.some(option => typeof option !== 'string' || !option.trim()) ||
      new Set(question.options.map(option => option.trim().toLocaleLowerCase('en-US'))).size !== 5 ||
      !Number.isInteger(question.answer) || question.answer < 0 || question.answer > 4) {
      throw new Error(`Invalid challenge options/answer: ${question.id}`);
    }
    if (question.category === 'reading') {
      const passage = question.passage;
      if (!passage?.id?.trim() || !passage.title?.trim() || !passage.text?.trim()) {
        throw new Error(`Missing reading passage: ${question.id}`);
      }
      const signature = JSON.stringify({ id: passage.id, title: passage.title, text: passage.text });
      const group = passages.get(passage.id);
      if (group && group.passage !== signature) throw new Error(`Inconsistent reading passage: ${passage.id}`);
      passages.set(passage.id, { passage: signature, count: (group?.count ?? 0) + 1 });
    }
  }
  for (const category of ['grammar', 'vocabulary'] as const) {
    for (const level of LEVELS) {
      if (questions.filter(question => question.category === category && question.level === level).length < 8) {
        throw new Error(`At least eight ${category} questions at ${level} are required for daily rotation.`);
      }
    }
  }
  if (passages.size < 4 || [...passages.values()].some(group => group.count !== 5)) {
    throw new Error('At least four reading passages, each with exactly five questions, are required.');
  }
}

/**
 * Four questions per level/category and two complete reading passages each day.
 * Advancing through stable pools guarantees no question repeats on adjacent days.
 * Persist the returned snapshot: a later bank deployment must not alter an active day.
 */
export function createDailyPaper(day: string): ChallengeQuestion[] {
  if (!validateDay(day)) throw new Error('Invalid challenge date.');
  validateChallengeBank();
  const dayIndex = Math.floor(new Date(`${day}T00:00:00.000Z`).getTime() / 86_400_000);
  const selected: ChallengeQuestion[] = [];
  for (const category of ['grammar', 'vocabulary'] as const) {
    const section: ChallengeQuestion[] = [];
    for (const level of LEVELS) {
      const pool = shuffled(
        questionBank.filter(question => question.category === category && question.level === level),
        `${BANK_VERSION}:${category}:${level}`,
      );
      section.push(...rotatingSlice(pool, dayIndex, 4));
    }
    selected.push(...shuffled(section, `${BANK_VERSION}:${day}:${category}:order`));
  }
  const passageIds = shuffled([...new Set(CHALLENGE_READING.map(question => question.passage!.id))], `${BANK_VERSION}:passages`);
  for (const passageId of rotatingSlice(passageIds, dayIndex, 2)) {
    selected.push(...CHALLENGE_READING.filter(question => question.passage!.id === passageId));
  }
  return selected.map(question => {
    const optionOrder = shuffled([0, 1, 2, 3, 4], `${BANK_VERSION}:${day}:${question.id}:options`);
    return {
      ...question,
      options: optionOrder.map(index => question.options[index]) as ChallengeQuestion['options'],
      answer: optionOrder.indexOf(question.answer),
      ...(question.passage ? { passage: { ...question.passage } } : {}),
    };
  });
}
