import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SITE_URL } from '../lib/seo';
import { dailyTestCount, dailyVocabulary, getDailyTest } from '../app/daily-english/data';
import { generateMetadata as dailyMetadata, generateStaticParams as dailyParams } from '../app/daily-english/[slug]/page';
import { spanishVocabulary } from '../app/es/vocabulary/data';
import { arabicVocabulary } from '../app/ar/vocabulary/data';
import { generateMetadata as spanishMetadata, generateStaticParams as spanishParams } from '../app/es/vocabulary/[slug]/page';
import { generateMetadata as arabicMetadata, generateStaticParams as arabicParams } from '../app/ar/vocabulary/[slug]/page';

test('daily test URLs select distinct vocabulary sets and describe the final short set accurately', () => {
  const second = getDailyTest('test-2');
  assert.equal(second?.id, 2);
  assert.deepEqual(second?.items, dailyVocabulary.slice(50, 100));
  assert.notDeepEqual(second?.items, getDailyTest('test-1')?.items);
  const final = getDailyTest(`test-${dailyTestCount}`)!;
  assert.equal(final.items.length, dailyVocabulary.length % 50 || 50);
  const metadata = dailyMetadata({ params: { slug: `test-${dailyTestCount}` } });
  assert.equal(metadata.alternates?.canonical, `${SITE_URL}/daily-english/test-${dailyTestCount}`);
  assert.match(metadata.description!, new RegExp(`Practice ${final.items.length} English words`));
  assert.equal(dailyParams().length, dailyTestCount);
});

test('invalid daily routes produce a 404 instead of silently selecting test 1', () => {
  for (const slug of ['test-0', 'test-01', '2', 'test--1', 'test-1-extra', `test-${dailyTestCount + 1}`]) {
    assert.equal(getDailyTest(slug), null);
    assert.throws(() => dailyMetadata({ params: { slug } }), /NEXT_NOT_FOUND/);
  }
});

test('Spanish and Arabic directory and detail routes share valid unique slug lists', async () => {
  for (const [entries, getParams] of [[spanishVocabulary, spanishParams], [arabicVocabulary, arabicParams]] as const) {
    const params = await getParams();
    assert.ok(params.length > 0);
    assert.equal(new Set(params.map(({ slug }) => slug)).size, params.length);
    assert.deepEqual(params.map(({ slug }) => slug), entries.map(({ slug }) => slug));
    assert.ok(params.every(({ slug }) => slug && /^[\w-]+$/.test(slug)));
  }
});

test('locale detail metadata uses its own canonical instead of the homepage', async () => {
  const spanish = await spanishMetadata({ params: { slug: spanishVocabulary[0].slug } });
  const arabic = await arabicMetadata({ params: { slug: arabicVocabulary[0].slug } });
  assert.equal(spanish.alternates?.canonical, `${SITE_URL}/es/vocabulary/${spanishVocabulary[0].slug}`);
  assert.equal(arabic.alternates?.canonical, `${SITE_URL}/ar/vocabulary/${arabicVocabulary[0].slug}`);
  assert.equal(spanish.openGraph?.locale, 'es_ES');
  assert.equal(arabic.openGraph?.locale, 'ar_AR');
  assert.equal(spanish.alternates?.languages, undefined);
  await assert.rejects(spanishMetadata({ params: { slug: 'missing-word-not-in-the-dataset' } }), /NEXT_NOT_FOUND/);
  await assert.rejects(arabicMetadata({ params: { slug: 'missing-word-not-in-the-dataset' } }), /NEXT_NOT_FOUND/);
});
