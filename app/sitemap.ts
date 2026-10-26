import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getAllVocabulary, slugifyWord } from '@/lib/vocabulary';
import { blogPosts } from '@/data/blogPosts';
import { dailyTestCount } from '@/app/daily-english/data';
import { spanishVocabulary } from '@/app/es/vocabulary/data';
import { arabicVocabulary } from '@/app/ar/vocabulary/data';
import { getCanonicalTestSlug } from '@/app/tests/catalog';
import { a1Topics } from '@/data/levels/a1_topics';
import { a2Topics } from '@/data/levels/a2_topics';
import { b1Topics } from '@/data/levels/b1_topics';
import { b2Topics } from '@/data/levels/b2_topics';
import { c1Topics } from '@/data/levels/c1_topics';
import { c2Topics } from '@/data/levels/c2_topics';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical, public learning pages belong here. Session results, account
  // pages, query-string filters and alternate URLs for the same test are omitted.
  const staticPaths = [
    '/', '/about', '/blog', '/contact', '/privacy', '/terms', '/cookie',
    '/flashcards', '/race', '/speedrun', '/speaking', '/matching', '/verbsense',
    '/advanced-tests', '/phrasal-puzzle', '/vocabulary', '/vocabulary-tests',
    '/grammar', '/test-conditionals', '/test-perfect-tenses', '/test-relatives',
    '/yds-3750', '/yds-5000-mini', '/daily-english',
    '/vocab-finish', '/vocab-finish-ar', '/vocab-es',
    '/ar/vocabulary', '/es/vocabulary',
  ];

  const topicsByLevel = {
    a1: a1Topics, a2: a2Topics, b1: b1Topics,
    b2: b2Topics, c1: c1Topics, c2: c2Topics,
  };
  const levelPaths = Object.entries(topicsByLevel).flatMap(([level, topics]) => [
    `/levels/${level}`,
    ...topics.map((topic) => `/levels/${level}/${topic.slug}`),
  ]);

  const vocabulary = getAllVocabulary();
  const letterPaths = 'abcdefghijklmnopqrstuvwxyz'.split('')
    .filter((letter) => vocabulary.some((item) => item.word.toLowerCase().startsWith(letter)))
    .map((letter) => `/vocabulary/letter/${letter}`);
  const wordPaths = vocabulary.map((item) => `/vocabulary/${slugifyWord(item.word)}`);
  const localizedWordPaths = [
    ...spanishVocabulary.map((item) => `/es/vocabulary/${item.slug}`),
    ...arabicVocabulary.map((item) => `/ar/vocabulary/${item.slug}`),
  ];

  const testSlugs = [
    'yds-grammar', 'yds-reading', 'yds-synonyms', 'yds-phrasal-verbs',
    'yds-conjunctions', 'ielts-grammar', 'grammar-mega-test-100',
    'vocab-b1-c1-50', 'quick-placement',
    'test-perfect-past', 'test-conditionals', 'test-relatives', 'test-articles',
    'test-tenses-mixed', 'test-passive-voice', 'test-reported-speech',
    'test-gerunds-infinitives', 'test-clauses-advanced', 'test-modals-advanced',
    'test-prepositions-advanced',
    ...Object.keys(topicsByLevel).map((level) => `level-${level}`),
    // These first 77 tests also have 3750/5000 aliases using identical seeds.
    // Keep the established 3850 URLs canonical; only 78–100 add distinct sets.
    ...Array.from({ length: 77 }, (_, i) => `yds-3850-mini-${i + 1}`),
    ...Array.from({ length: 23 }, (_, i) => `yds-5000-mini-${i + 78}`),
    ...Array.from({ length: 32 }, (_, i) => `yds-exam-test-${i + 1}`),
  ];
  const dailyPaths = Array.from({ length: dailyTestCount }, (_, i) => `/daily-english/test-${i + 1}`);

  const paths = [
    ...staticPaths, ...levelPaths, ...letterPaths, ...wordPaths, ...localizedWordPaths,
    ...testSlugs.map(getCanonicalTestSlug).filter((slug): slug is string => slug !== null)
      .map((slug) => `/tests/${slug}`), ...dailyPaths,
    ...blogPosts.map((post) => `/blog/${post.slug}`),
  ];

  // Do not invent last-modified dates: only publish a timestamp when the source
  // records a real content update. The URL list stays stable between builds.
  return Array.from(new Set(paths)).map((path) => ({ url: `${SITE_URL}${path}` }));
}
