import dailyEnglish from '@/data/dailyenglish.json';

const namedTests = new Set([
  'test-perfect-past', 'test-conditionals', 'test-relatives', 'test-articles',
  'test-tenses-mixed', 'test-passive-voice', 'test-reported-speech',
  'test-gerunds-infinitives', 'test-clauses-advanced', 'test-modals-advanced',
  'test-prepositions-advanced', 'ielts-grammar', 'grammar-mega-test-100',
  'vocab-b1-c1-50', 'quick-placement', 'yds-reading', 'yds-phrasal-verbs',
  'yds-synonyms', 'yds-conjunctions', 'yds-grammar',
]);

// Unlike the shared quiz loader, public URLs must never fall back to another quiz.
export function getCanonicalTestSlug(slug: string): string | null {
  if (namedTests.has(slug) || /^level-(?:a1|a2|b1|b2|c1|c2)$/.test(slug)) return slug;
  const mini = /^yds-(5000|3850|3750)-mini-([1-9]\d*)$/.exec(slug);
  if (mini) {
    const maximum = mini[1] === '5000' ? 100 : 77;
    if (Number(mini[2]) > maximum) return null;
    const family = mini[1] === '3750' || (mini[1] === '5000' && Number(mini[2]) <= 77) ? '3850' : mini[1];
    return `yds-${family}-mini-${mini[2]}`;
  }
  const exam = /^yds-exam-test-([1-9]\d*)$/.exec(slug);
  if (exam && Number(exam[1]) <= 32) return slug;
  const daily = /^daily-english-([1-9]\d*)$/.exec(slug);
  if (daily && Number(daily[1]) <= Math.ceil(dailyEnglish.length / 50)) return slug;
  return null;
}
