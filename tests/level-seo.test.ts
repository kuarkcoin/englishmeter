import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Metadata } from 'next';
import sitemap from '../app/sitemap';
import { LEVEL_CATALOG, LEVEL_CONTENT_UPDATED_AT } from '../lib/level-catalog';
import {
  getLevelBreadcrumbs,
  getLevelMetadata,
  getLevelStructuredData,
  getLevelTopicMetadata,
  getRelatedLevelTopics,
  getTopicStructuredData,
} from '../lib/level-seo';
import { getTopicStudyGuide } from '../lib/level-study-guides';
import { SITE_URL } from '../lib/seo';

type SchemaNode = Record<string, unknown>;
type SchemaGraph = { '@context': string; '@graph': SchemaNode[] };

function findNode(graph: SchemaGraph, type: string): SchemaNode {
  const nodes = graph['@graph'].filter((node) => node['@type'] === type);
  assert.equal(nodes.length, 1, `one ${type} node`);
  return nodes[0];
}

const pages = LEVEL_CATALOG.flatMap((level) => [
  { path: `/levels/${level.key}`, level, metadata: () => getLevelMetadata(level) },
  ...level.topics.map((topic) => ({
    path: `/levels/${level.key}/${topic.slug}`,
    level,
    metadata: () => getLevelTopicMetadata(level, topic),
  })),
]);

function assertMetadata(metadata: Metadata, path: string) {
  const canonical = `${SITE_URL}${path}`;
  assert.equal(metadata.alternates?.canonical, canonical, path);
  assert.equal(typeof metadata.title, 'string', path);
  const title = String(metadata.title);
  const description = metadata.description;
  assert.ok(description, `${path}: description`);
  assert.ok(`${title} | EnglishMeter`.length <= 80, `${path}: concise branded title`);
  assert.ok(description.length <= 180, `${path}: concise description`);
  assert.match(title, /\b[A-C][12]\b/, `${path}: level in title`);
  assert.match(title, /tests?/i, `${path}: test search intent`);
  const openGraph = metadata.openGraph as { url: string; title: string; description: string };
  const twitter = metadata.twitter as { title: string; description: string };
  assert.equal(openGraph.url, canonical, path);
  assert.equal(openGraph.title, `${title} | EnglishMeter`, path);
  assert.equal(openGraph.description, description, path);
  assert.equal(twitter.title, openGraph.title, path);
  assert.equal(twitter.description, description, path);
  return { title, description, canonical };
}

test('all level hubs and topic pages have distinct, accurate search and social metadata', () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const canonicals = new Set<string>();
  for (const page of pages) {
    const { title, description, canonical } = assertMetadata(page.metadata(), page.path);
    assert.equal(titles.has(title), false, `${page.path}: duplicate title`);
    assert.equal(descriptions.has(description), false, `${page.path}: duplicate description`);
    titles.add(title);
    descriptions.add(description);
    canonicals.add(canonical);
  }
  assert.equal(canonicals.size, pages.length);
  for (const level of LEVEL_CATALOG) {
    for (const topic of level.topics) {
      assert.ok(getLevelTopicMetadata(level, topic).description?.includes(`${topic.questionCount}-question`));
    }
  }
});

test('every curriculum page is indexable in production and noindex in preview', () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const [environment, index] of [['production', true], ['preview', false]] as const) {
      process.env.VERCEL_ENV = environment;
      for (const page of pages) {
        assert.deepEqual(page.metadata().robots, { index, follow: true }, `${environment}: ${page.path}`);
        assert.equal(page.metadata().alternates?.canonical, `${SITE_URL}${page.path}`);
      }
    }
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});

test('every topic has its own substantive study guide, three focus points and a useful tip', () => {
  const summaries = new Set<string>();
  const tips = new Set<string>();
  const words = (text: string) => text.trim().split(/\s+/).length;
  for (const level of LEVEL_CATALOG) {
    for (const topic of level.topics) {
      const path = `${level.key}/${topic.slug}`;
      const guide = getTopicStudyGuide(level.key, topic.slug);
      assert.ok(guide, path);
      assert.ok(words(guide.summary) >= 25, `${path}: substantive introduction`);
      assert.ok(words(guide.tip) >= 8, `${path}: actionable tip`);
      assert.notEqual(guide.summary, topic.description, `${path}: expands the short description`);
      assert.equal(guide.focus.length, 3, path);
      assert.equal(new Set(guide.focus).size, 3, `${path}: distinct focus points`);
      for (const focus of guide.focus) assert.ok(focus.trim().length >= 10, `${path}: meaningful focus`);
      assert.equal(summaries.has(guide.summary), false, `${path}: unique introduction`);
      assert.equal(tips.has(guide.tip), false, `${path}: topic-specific tip`);
      summaries.add(guide.summary);
      tips.add(guide.tip);
    }
    assert.equal(getTopicStudyGuide(level.key, 'not-a-real-topic'), undefined);
  }
});

test('level collection structured data lists the same canonical topics as the public catalogue', () => {
  for (const level of LEVEL_CATALOG) {
    const graph = getLevelStructuredData(level);
    assert.equal(graph['@context'], 'https://schema.org');
    const collection = findNode(graph, 'CollectionPage');
    const url = `${SITE_URL}/levels/${level.key}`;
    assert.equal(collection.url, url);
    assert.equal(collection['@id'], `${url}#webpage`);
    assert.equal(collection.inLanguage, 'en');
    assert.equal(collection.isAccessibleForFree, true);
    assert.deepEqual(collection.isPartOf, { '@id': `${SITE_URL}/#website` });
    assert.deepEqual(collection.mainEntity, {
      '@type': 'ItemList',
      numberOfItems: level.topics.length,
      itemListElement: level.topics.map((topic, index) => ({
        '@type': 'ListItem', position: index + 1, name: topic.title,
        url: `${url}/${topic.slug}`,
      })),
    });
  }
});

test('quiz structured data describes the real test without invented schema fields or ratings', () => {
  const unsupported = new Set(['numberOfQuestions', 'aggregateRating', 'ratingValue', 'reviewCount']);
  function checkKeys(value: unknown) {
    if (Array.isArray(value)) value.forEach(checkKeys);
    else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        assert.equal(unsupported.has(key), false, `unsupported or unsubstantiated ${key}`);
        checkKeys(child);
      }
    }
  }
  for (const level of LEVEL_CATALOG) {
    for (const topic of level.topics) {
      const graph = getTopicStructuredData(level, topic);
      const url = `${SITE_URL}/levels/${level.key}/${topic.slug}`;
      assert.equal(graph['@context'], 'https://schema.org');
      const page = findNode(graph, 'WebPage');
      const quiz = findNode(graph, 'Quiz');
      assert.equal(page.url, url);
      assert.deepEqual(page.mainEntity, { '@id': `${url}#quiz` });
      assert.equal(quiz['@id'], `${url}#quiz`);
      assert.equal(quiz.url, url);
      assert.equal(quiz.inLanguage, 'en');
      assert.equal(quiz.isAccessibleForFree, true);
      assert.equal(quiz.educationalLevel, `${level.label} (${level.name})`);
      assert.equal(quiz.timeRequired, `PT${level.duration}M`);
      assert.ok(String(quiz.description).includes(`${topic.questionCount} questions`), url);
      assert.deepEqual(quiz.about, { '@type': 'Thing', name: topic.title });
      assert.deepEqual(quiz.isPartOf, { '@id': `${SITE_URL}/levels/${level.key}#webpage` });
      checkKeys(graph);
    }
  }
});

test('structured breadcrumbs follow the same canonical hierarchy used by visible navigation', () => {
  for (const level of LEVEL_CATALOG) {
    for (const topic of [undefined, ...level.topics]) {
      const crumbs = getLevelBreadcrumbs(level, topic);
      const path = `/levels/${level.key}${topic ? `/${topic.slug}` : ''}`;
      assert.equal(crumbs.length, topic ? 3 : 2);
      assert.deepEqual(crumbs[0], { name: 'Home', path: '/' });
      assert.equal(crumbs[1].path, `/levels/${level.key}`);
      assert.equal(crumbs.at(-1)?.path, path);
      const graph = topic ? getTopicStructuredData(level, topic) : getLevelStructuredData(level);
      const breadcrumb = findNode(graph, 'BreadcrumbList');
      assert.equal(breadcrumb['@id'], `${SITE_URL}${path}#breadcrumbs`);
      assert.deepEqual(breadcrumb.itemListElement, crumbs.map((crumb, index) => ({
        '@type': 'ListItem', position: index + 1, name: crumb.name,
        item: `${SITE_URL}${crumb.path}`,
      })));
      const page = findNode(graph, topic ? 'WebPage' : 'CollectionPage');
      assert.deepEqual(page.breadcrumb, { '@id': breadcrumb['@id'] });
    }
  }
});

test('sitemap publishes the recorded editorial date for every curriculum URL and only those URLs', () => {
  assert.match(LEVEL_CONTENT_UPDATED_AT, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Number.isFinite(Date.parse(LEVEL_CONTENT_UPDATED_AT)));
  const expected = new Set(pages.map(({ path }) => `${SITE_URL}${path}`));
  const entries = sitemap();
  for (const url of expected) assert.equal(entries.filter((entry) => entry.url === url).length, 1, url);
  for (const entry of entries) {
    assert.equal(entry.lastModified, expected.has(entry.url) ? LEVEL_CONTENT_UPDATED_AT : undefined, entry.url);
  }
});

test('topic recommendations link to existing sibling pages without duplicates or self-links', () => {
  for (const level of LEVEL_CATALOG) {
    for (const topic of level.topics) {
      const related = getRelatedLevelTopics(level, topic);
      assert.ok(related.length > 0, `${level.key}/${topic.slug}`);
      assert.equal(new Set(related.map((item) => item.slug)).size, related.length);
      for (const item of related) {
        assert.notEqual(item.slug, topic.slug);
        assert.ok(level.topics.some((sibling) => sibling.slug === item.slug));
      }
    }
  }
});
