import { readingBeginnerTests } from '@/data/practice/reading-beginner';
import { readingAdvancedTests } from '@/data/practice/reading-advanced';
import { thematicVocabularyTests } from '@/data/practice/thematic-vocabulary';
import { wordFormationTests } from '@/data/practice/word-formation';
import { kidsTests } from '@/data/practice/kids';
import type { PracticeTest } from '@/data/practice/types';
import { getPracticeCategory, type PracticeCategoryDefinition } from '@/lib/practice-categories';
import { buildSeoMetadata, SITE_URL } from '@/lib/seo';

export const PRACTICE_TESTS: readonly PracticeTest[] = [
  ...readingBeginnerTests, ...readingAdvancedTests, ...thematicVocabularyTests,
  ...wordFormationTests, ...kidsTests,
];

export function getPracticeTests(category: string): readonly PracticeTest[] {
  return PRACTICE_TESTS.filter((test) => test.category === category);
}

export function getPracticeTest(category: string, slug: string): PracticeTest | undefined {
  return PRACTICE_TESTS.find((test) => test.category === category && test.slug === slug);
}

export function getPracticeTestSlug(test: PracticeTest): string {
  return `practice-${test.category}-${test.slug}`;
}

export function getPracticeTestPath(test: PracticeTest): string {
  return test.category === 'kids' ? `/kids/${test.slug}` : `/practice/${test.category}/${test.slug}`;
}

export type PracticeBreadcrumb = { name: string; path: string };

export function getPracticeBreadcrumbs(category: PracticeCategoryDefinition, test?: PracticeTest): PracticeBreadcrumb[] {
  return [
    { name: 'Home', path: '/' },
    { name: category.name, path: category.path },
    ...(test ? [{ name: test.title, path: getPracticeTestPath(test) }] : []),
  ];
}

function breadcrumbSchema(items: readonly PracticeBreadcrumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function getPracticeCategoryMetadata(category: PracticeCategoryDefinition) {
  return buildSeoMetadata({
    title: `${category.name} – Free English Tests`,
    description: category.description,
    path: category.path,
  });
}

export function getPracticeTestMetadata(test: PracticeTest) {
  return buildSeoMetadata({
    title: test.category === 'kids'
      ? `${test.title} – Kids English Quiz`
      : `${test.title} – ${test.questions.length} Questions`,
    description: test.description,
    path: getPracticeTestPath(test),
  });
}

export function getPracticeCategoryStructuredData(category: PracticeCategoryDefinition) {
  const url = `${SITE_URL}${category.path}`;
  const tests = getPracticeTests(category.id);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${url}#webpage`, url,
        name: category.name, description: category.description, inLanguage: 'en',
        isAccessibleForFree: true, isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
        mainEntity: {
          '@type': 'ItemList', numberOfItems: tests.length,
          itemListElement: tests.map((test, index) => ({
            '@type': 'ListItem', position: index + 1, name: test.title,
            url: `${SITE_URL}${getPracticeTestPath(test)}`,
          })),
        },
      },
      { ...breadcrumbSchema(getPracticeBreadcrumbs(category)), '@id': `${url}#breadcrumbs` },
    ],
  };
}

export function getPracticeTestStructuredData(test: PracticeTest) {
  const category = getPracticeCategory(test.category)!;
  const url = `${SITE_URL}${getPracticeTestPath(test)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${url}#webpage`, url,
        name: test.title, description: test.description, inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
        mainEntity: { '@id': `${url}#quiz` },
      },
      {
        '@type': 'Quiz', '@id': `${url}#quiz`, url,
        name: test.title,
        description: `${test.description} ${test.questions.length} questions with answers and explanations.`,
        inLanguage: 'en', isAccessibleForFree: true,
        educationalLevel: test.level, learningResourceType: 'Practice test',
        educationalUse: 'self assessment', teaches: [...test.learningGoals],
        ...(test.category === 'kids' ? {} : { timeRequired: `PT${test.duration}M` }),
        isPartOf: { '@id': `${SITE_URL}${category.path}#webpage` },
        publisher: { '@type': 'Organization', name: 'EnglishMeter', url: SITE_URL },
      },
      { ...breadcrumbSchema(getPracticeBreadcrumbs(category, test)), '@id': `${url}#breadcrumbs` },
    ],
  };
}
