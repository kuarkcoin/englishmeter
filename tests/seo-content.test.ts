import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCanonicalTestSlug } from '../app/tests/catalog';
import { generateMetadata as testMetadata } from '../app/tests/[slug]/page';
import { generateMetadata as wordMetadata } from '../app/vocabulary/[slug]/page';
import { generateMetadata as letterMetadata } from '../app/vocabulary/letter/[letter]/page';
import { generateMetadata as levelMetadata } from '../app/levels/[level]/page';
import { generateMetadata as topicMetadata } from '../app/levels/[level]/[topic]/page';
import { generateMetadata as blogMetadata } from '../app/blog/[slug]/page';
import { blogPosts } from '../data/blogPosts';
import { SITE_URL } from '../lib/seo';
import { getAllVocabulary, slugifyWord } from '../lib/vocabulary';
import { getQuestionsBySlug } from '../lib/quizManager';

const isNotFound = (error: unknown) => error instanceof Error && 'digest' in error && error.digest === 'NEXT_NOT_FOUND';
const redirectsTo = (url: string) => (error: unknown) => error instanceof Error && 'digest' in error && String(error.digest).includes(`;${url};308;`);

test('public test URLs reject arbitrary fallback quizzes and clamped mini IDs', () => {
  for (const slug of ['missing-quiz', 'yds-3850-mini-0', 'yds-3850-mini-78', 'yds-5000-mini-101', 'yds-3850-mini-1extra', 'yds-3850-mini-01', 'yds-exam-test-33', 'level-a3']) {
    assert.equal(getCanonicalTestSlug(slug), null);
    assert.throws(() => testMetadata({ params: { slug } }), isNotFound);
  }
});

test('equivalent mini test aliases redirect to one canonical while preserving language', () => {
  for (const id of [1, 12, 77]) {
    for (const language of ['tr', 'de']) {
      assert.deepEqual(
        getQuestionsBySlug(`yds-5000-mini-${id}`, language).questions,
        getQuestionsBySlug(`yds-3850-mini-${id}`, language).questions,
      );
    }
  }
  assert.equal(getCanonicalTestSlug('yds-3750-mini-12'), 'yds-3850-mini-12');
  assert.equal(getCanonicalTestSlug('yds-5000-mini-12'), 'yds-3850-mini-12');
  assert.equal(getCanonicalTestSlug('yds-5000-mini-78'), 'yds-5000-mini-78');
  assert.throws(() => testMetadata({ params: { slug: 'yds-5000-mini-12' }, searchParams: { lang: 'es' } }), redirectsTo('/tests/yds-3850-mini-12?lang=es'));
});

test('valid test page has its own canonical and relevant description', () => {
  const metadata = testMetadata({ params: { slug: 'yds-exam-test-32' } });
  assert.equal(metadata.alternates?.canonical, `${SITE_URL}/tests/yds-exam-test-32`);
  assert.match(metadata.description ?? '', /Mock Test 32/);
});

test('invalid vocabulary words and non-letter indexes return notFound', () => {
  assert.throws(() => wordMetadata({ params: { slug: 'not-a-real-word-98765' } }), isNotFound);
  for (const letter of ['ab', '123', '-']) assert.throws(() => letterMetadata({ params: { letter } }), isNotFound);
  assert.throws(() => letterMetadata({ params: { letter: 'A' } }), redirectsTo('/vocabulary/letter/a'));
});

test('word metadata describes the actual Turkish meanings instead of claiming synonyms', () => {
  const metadata = wordMetadata({ params: { slug: 'abdicate' } });
  assert.equal(metadata.alternates?.canonical, `${SITE_URL}/vocabulary/abdicate`);
  assert.match(String(metadata.title), /Turkish meaning/);
  assert.doesNotMatch(metadata.description ?? '', /synonyms/i);
});

test('level and topic metadata normalize case and reject missing routes', () => {
  assert.throws(() => levelMetadata({ params: { level: 'A1' } }), redirectsTo('/levels/a1'));
  assert.throws(() => levelMetadata({ params: { level: 'zz' } }), isNotFound);
  assert.throws(() => topicMetadata({ params: { level: 'a1', topic: 'missing-topic' } }), isNotFound);
  const metadata = topicMetadata({ params: { level: 'a1', topic: 'present-simple' } });
  assert.equal(metadata.alternates?.canonical, `${SITE_URL}/levels/a1/present-simple`);
  assert.match(String(metadata.title), /Present Simple/);
});

test('blog posts have unique canonicals and actual educational content', () => {
  const canonicals = new Set();
  for (const post of blogPosts) {
    const metadata = blogMetadata({ params: { slug: post.slug } });
    canonicals.add(metadata.alternates?.canonical);
    assert.equal(metadata.alternates?.canonical, `${SITE_URL}/blog/${post.slug}`);
    assert.match(post.contentHtml, /<h2>/);
    assert.match(post.contentHtml, /Answer|answer|Check|check/);
    assert.ok(post.contentHtml.replace(/<[^>]+>/g, '').split(/\s+/).length > 200);
  }
  assert.equal(canonicals.size, blogPosts.length);
  assert.throws(() => blogMetadata({ params: { slug: 'missing-article' } }), isNotFound);
});


test('vocabulary metadata does not promise example sentences when the source has none', () => {
  const words = getAllVocabulary();
  const withoutExample = words.find((word) => !word.s && !word.sentence);
  const withExample = words.find((word) => word.s || word.sentence);
  assert.ok(withoutExample);
  assert.ok(withExample);
  const missing = wordMetadata({ params: { slug: slugifyWord(withoutExample.word) } });
  assert.doesNotMatch(String(missing.title), /examples/i);
  assert.doesNotMatch(missing.description ?? '', /example sentence/i);
  const present = wordMetadata({ params: { slug: slugifyWord(withExample.word) } });
  assert.match(present.description ?? '', /English example sentence/);
});
