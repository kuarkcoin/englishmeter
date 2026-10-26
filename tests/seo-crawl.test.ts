import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync } from 'node:fs';
import sitemap from '../app/sitemap';
import robots from '../app/robots';
import { SITE_URL } from '../lib/seo';
import { blogPosts } from '../data/blogPosts';
import { getAllVocabulary, slugifyWord } from '../lib/vocabulary';
import { spanishVocabulary } from '../app/es/vocabulary/data';
import { arabicVocabulary } from '../app/ar/vocabulary/data';
import dailyData from '../data/dailyenglish.json';
import { getQuestionsBySlug } from '../lib/quizManager';
import { getCanonicalTestSlug } from '../app/tests/catalog';

const entries = sitemap();
const paths = new Set(entries.map((entry) => new URL(entry.url).pathname));

test('sitemap publishes unique canonical URLs without query filters or fake modification dates', () => {
  assert.equal(entries.length, new Set(entries.map((entry) => entry.url)).size);
  assert.ok(entries.length > 1000);
  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.origin, SITE_URL);
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
    assert.equal(entry.lastModified, undefined);
    assert.equal(url.pathname.includes('//'), false);
  }
});

test('personal, session and unavailable integration pages are not advertised for indexing', () => {
  for (const path of paths) {
    assert.doesNotMatch(path, /^\/(?:admin|dashboard|login|result|mistakes|start|quiz|learn|api|tools)(?:\/|$)/);
    assert.notEqual(path, '/verbsense/play');
  }
  for (const path of ['/vocab-finish', '/vocab-finish-ar', '/vocab-es']) assert.ok(paths.has(path));
});

test('vocabulary sitemap covers the same nonempty slugs that public detail pages resolve', () => {
  for (const item of getAllVocabulary()) assert.ok(paths.has(`/vocabulary/${slugifyWord(item.word)}`));
  for (const item of spanishVocabulary) {
    assert.ok(item.slug);
    assert.ok(paths.has(`/es/vocabulary/${item.slug}`));
  }
  for (const item of arabicVocabulary) {
    assert.ok(item.slug);
    assert.ok(paths.has(`/ar/vocabulary/${item.slug}`));
  }
  assert.ok(paths.has('/es/vocabulary'));
  assert.ok(paths.has('/ar/vocabulary'));
});

test('daily paths match the data-backed range and preserve the partial final set', () => {
  const total = Math.ceil(dailyData.length / 50);
  const dailyPaths = [...paths].filter((path) => /^\/daily-english\/test-\d+$/.test(path));
  assert.equal(dailyPaths.length, total);
  assert.ok(paths.has('/daily-english/test-1'));
  assert.ok(paths.has(`/daily-english/test-${total}`));
  assert.equal(paths.has(`/daily-english/test-${total + 1}`), false);
});

test('test URLs exclude duplicate mini-series aliases and point to populated question sets', () => {
  assert.ok(paths.has('/tests/yds-3850-mini-1'));
  assert.ok(paths.has('/tests/yds-3850-mini-77'));
  assert.equal(paths.has('/tests/yds-5000-mini-1'), false);
  assert.equal(paths.has('/tests/yds-5000-mini-77'), false);
  assert.ok(paths.has('/tests/yds-5000-mini-78'));
  assert.ok(paths.has('/tests/yds-5000-mini-100'));
  assert.equal(paths.has('/tests/yds-5000-mini-101'), false);
  assert.ok(paths.has('/tests/yds-exam-test-32'));
  assert.equal(paths.has('/tests/yds-exam-test-33'), false);
  for (const path of [...paths].filter((path) => path.startsWith('/tests/'))) {
    assert.equal(getCanonicalTestSlug(path.slice('/tests/'.length)), path.slice('/tests/'.length));
    assert.ok(getQuestionsBySlug(path.slice('/tests/'.length)).questions.length > 0, `${path} has no questions`);
  }
});

test('every blog article has a sitemap entry, and level paths use one lowercase form', () => {
  for (const post of blogPosts) assert.ok(paths.has(`/blog/${post.slug}`));
  assert.ok(paths.has('/levels/a1/present-simple'));
  for (const path of [...paths].filter((path) => path.startsWith('/levels/'))) {
    assert.equal(path, path.toLowerCase());
  }
});

test('robots blocks preview crawling without advertising a preview sitemap', () => {
  const original = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = 'preview';
    assert.deepEqual(robots(), { rules: { userAgent: '*', disallow: '/' } });
    process.env.VERCEL_ENV = 'production';
    const production = robots();
    assert.equal(production.sitemap, `${SITE_URL}/sitemap.xml`);
    assert.deepEqual(production.rules, { userAgent: '*', allow: '/', disallow: '/api/' });
  } finally {
    if (original === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = original;
  }
});

test('only the generated robots route owns /robots.txt', () => {
  assert.equal(existsSync(new URL('../public/robots.txt', import.meta.url)), false);
});
