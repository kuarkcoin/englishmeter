import type { LevelDefinition, LevelTopic } from '@/lib/level-catalog';
import { SITE_URL, buildSeoMetadata } from '@/lib/seo';

// Keep the subject intact while leaving detailed formulas in the visible heading.
const searchNames: Record<string, string> = {
  'verb-to-be': 'Verb to Be',
  'this-that-these-those': 'This, That, These, Those',
  'prepositions-of-time': 'Prepositions of Time',
  'can-cant': 'Can and Can’t',
  'comparatives-superlatives': 'Comparatives and Superlatives',
  'modals-ability-permission-advice': 'Ability, Permission and Advice',
  'modals-deduction': 'Modal Verbs for Deduction',
  'causatives': 'Have and Get Causatives',
  'noun-clauses': 'Noun Clauses',
  'subjunctive': 'Subjunctive Mood',
  'academic-language': 'Academic English',
};

export function getTopicSearchName(topic: LevelTopic): string {
  return searchNames[topic.slug] ?? topic.title.replace(/\s*\([^)]*\)/g, '').trim();
}

export function getLevelMetadata(level: LevelDefinition) {
  return buildSeoMetadata({
    title: `Free ${level.label} English Tests – ${level.name}`,
    description: `Choose from ${level.topics.length} free ${level.label} English tests for ${level.name.toLowerCase()} learners. Practise each topic with answers, explanations and worked examples.`,
    path: `/levels/${level.key}`,
  });
}

export function getLevelTopicMetadata(level: LevelDefinition, topic: LevelTopic) {
  return buildSeoMetadata({
    title: `${level.label} ${getTopicSearchName(topic)} Test`,
    description: `Free ${level.label} ${getTopicSearchName(topic)} practice: a ${topic.questionCount}-question test with answers and explanations. Study examples, then try Exam or Practice mode.`,
    path: `/levels/${level.key}/${topic.slug}`,
  });
}

export type LevelBreadcrumb = { name: string; path: string };

export function getLevelBreadcrumbs(level: LevelDefinition, topic?: LevelTopic): LevelBreadcrumb[] {
  return [
    { name: 'Home', path: '/' },
    { name: `${level.label} English Tests`, path: `/levels/${level.key}` },
    ...(topic ? [{ name: topic.title, path: `/levels/${level.key}/${topic.slug}` }] : []),
  ];
}

function breadcrumbSchema(items: readonly LevelBreadcrumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function getLevelStructuredData(level: LevelDefinition) {
  const url = `${SITE_URL}/levels/${level.key}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${url}#webpage`, url,
        name: `${level.label} English Tests – ${level.name}`,
        description: level.description, inLanguage: 'en', isAccessibleForFree: true,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
        mainEntity: {
          '@type': 'ItemList', numberOfItems: level.topics.length,
          itemListElement: level.topics.map((topic, index) => ({
            '@type': 'ListItem', position: index + 1, name: topic.title,
            url: `${url}/${topic.slug}`,
          })),
        },
      },
      { ...breadcrumbSchema(getLevelBreadcrumbs(level)), '@id': `${url}#breadcrumbs` },
    ],
  };
}

export function getTopicStructuredData(level: LevelDefinition, topic: LevelTopic) {
  const url = `${SITE_URL}/levels/${level.key}/${topic.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${url}#webpage`, url,
        name: `${level.label} ${topic.title} Test`,
        description: topic.description, inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
        mainEntity: { '@id': `${url}#quiz` },
      },
      {
        '@type': 'Quiz', '@id': `${url}#quiz`, url,
        name: `${level.label} ${topic.title} Test`,
        description: `${topic.description} ${topic.questionCount} questions with answers and explanations.`,
        inLanguage: 'en', isAccessibleForFree: true,
        educationalLevel: `${level.label} (${level.name})`,
        learningResourceType: 'Practice test', educationalUse: 'self assessment',
        timeRequired: `PT${level.duration}M`,
        about: { '@type': 'Thing', name: topic.title },
        isPartOf: { '@id': `${SITE_URL}/levels/${level.key}#webpage` },
        publisher: { '@type': 'Organization', name: 'EnglishMeter', url: SITE_URL },
      },
      { ...breadcrumbSchema(getLevelBreadcrumbs(level, topic)), '@id': `${url}#breadcrumbs` },
    ],
  };
}

const topicFamilies = [
  ['verb-to-be', 'subject-pronouns', 'possessive-adjectives', 'there-is-there-are'],
  ['countable-uncountable', 'a-an', 'this-that-these-those', 'some-any-a-lot-of', 'numbers'],
  ['present-simple', 'present-continuous', 'adverbs-of-frequency', 'past-simple', 'past-continuous', 'will-going-to'],
  ['prepositions-of-place', 'basic-directions', 'prepositions-of-time', 'days-months', 'telling-the-time'],
  ['can-cant', 'wh-questions', 'have-to-need-to', 'should-must', 'may-might', 'modals-ability-permission-advice', 'modals-deduction', 'modal-perfect-complex'],
  ['present-perfect', 'past-perfect', 'present-perfect-vs-past-simple', 'present-perfect-continuous', 'past-continuous'],
  ['zero-conditional', 'first-conditional', 'second-conditional', 'third-conditional', 'mixed-conditionals', 'wish-if-only', 'advanced-conditionals', 'subjunctive'],
  ['relative-clauses-basic', 'defining-relative-clauses', 'non-defining-relative-clauses', 'advanced-relative-clauses', 'noun-clauses', 'participle-clauses', 'elliptical-structures'],
  ['passive-voice', 'causatives', 'complex-passives', 'reported-speech', 'reported-speech-basic'],
  ['inversion', 'inversion-emphasis', 'inversion-advanced', 'cleft-sentences', 'academic-language'],
  ['gerunds-infinitives', 'common-phrasal-verbs', 'advanced-idioms', 'comparatives-superlatives', 'basic-conjunctions'],
];

export function getRelatedLevelTopics(level: LevelDefinition, topic: LevelTopic): LevelTopic[] {
  const siblings = level.topics.filter((item) => item.slug !== topic.slug);
  const families = topicFamilies.filter((family) => family.includes(topic.slug));
  const related = siblings.filter((item) => families.some((family) => family.includes(item.slug)));
  return [...related, ...siblings.filter((item) => !related.includes(item))].slice(0, 3);
}
