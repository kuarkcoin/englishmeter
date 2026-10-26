import dailyEnglishData from '@/data/dailyenglish.json';

export const QUESTIONS_PER_TEST = 50;
export const dailyVocabulary = dailyEnglishData as Array<{ word: string; meaning: string }>;
export const dailyTestCount = Math.ceil(dailyVocabulary.length / QUESTIONS_PER_TEST);

export function getDailyTest(slug: string) {
  const match = /^test-([1-9]\d*)$/.exec(slug);
  if (!match) return null;
  const id = Number(match[1]);
  if (!Number.isSafeInteger(id) || id > dailyTestCount) return null;
  return {
    id,
    items: dailyVocabulary.slice((id - 1) * QUESTIONS_PER_TEST, id * QUESTIONS_PER_TEST),
  };
}
