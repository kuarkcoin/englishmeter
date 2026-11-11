import { LEVEL_CATALOG } from './level-catalog';
import { PRACTICE_CATEGORIES } from './practice-categories';

export function getStudyRecommendations(input: { testSlug?: string; levels: (string | undefined)[]; percentage: number; answered: number; total: number }) {
  const topicMatch = input.testSlug?.match(/^topic-(a1|a2|b1|b2|c1|c2)-(.+)$/);
  const uniqueLevels = Array.from(new Set(input.levels.filter((level): level is string => !!level).map((level) => level.toLowerCase())));
  const levelKey = topicMatch?.[1] ?? (uniqueLevels.length === 1 ? uniqueLevels[0] : undefined);
  const level = LEVEL_CATALOG.find((item) => item.key === levelKey);
  const category = PRACTICE_CATEGORIES.find((item) => input.testSlug?.startsWith(`practice-${item.id}-`));
  const links: { href: string; title: string }[] = [];
  let guidance = 'Use the level test to choose a starting point, then practise one topic at a time.';
  if (level && input.testSlug !== 'quick-placement') {
    guidance = input.answered < input.total
      ? `Complete a full ${level.label} practice set before deciding what to study next.`
      : input.percentage < 70
        ? `Review the explanations and practise more ${level.label} topics before moving on.`
        : `Continue with another ${level.label} topic to check how well you can use these skills in a different context.`;
    links.push(...level.topics.filter((topic) => topic.slug !== topicMatch?.[2]).slice(0, 2).map((topic) => ({ href: `/levels/${level.key}/${topic.slug}`, title: `${level.label}: ${topic.title}` })));
  }
  if (category) links.push({ href: category.path, title: `More ${category.name} tests` });
  if (!links.length) links.push({ href: '/grammar', title: 'Choose a grammar topic' }, { href: '/practice/vocabulary', title: 'Practise vocabulary in context' });
  links.push({ href: '/english-level-test', title: 'Check your English practice level' });
  return { guidance, links: links.slice(0, 4) };
}
