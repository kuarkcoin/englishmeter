import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SITE_URL } from '../lib/seo';
import { dailyTestCount, dailyVocabulary, getDailyTest } from '../app/daily-english/data';
import { generateMetadata as dailyMetadata, generateStaticParams as dailyParams } from '../app/daily-english/[slug]/page';
import { spanishVocabulary } from '../app/es/vocabulary/data';
import { arabicVocabulary } from '../app/ar/vocabulary/data';
import { generateMetadata as spanishMetadata, generateStaticParams as spanishParams } from '../app/es/vocabulary/[slug]/page';
import { generateMetadata as arabicMetadata, generateStaticParams as arabicParams } from '../app/ar/vocabulary/[slug]/page';
import { getVocabularyLanguageAlternates, getVocabularyWordStructuredData } from '../lib/vocabulary-locales';
import sitemap from '../app/sitemap';

test('daily test URLs select distinct vocabulary sets and describe the final short set accurately', () => {
  const second = getDailyTest('test-2');
  assert.equal(second?.id, 2);
  assert.deepEqual(second?.items, dailyVocabulary.slice(50, 100));
  assert.notDeepEqual(second?.items, getDailyTest('test-1')?.items);
  const final = getDailyTest(`test-${dailyTestCount}`)!;
  assert.equal(final.items.length, dailyVocabulary.length % 50 || 50);
  const metadata = dailyMetadata({ params: { slug: `test-${dailyTestCount}` } });
  assert.equal(metadata.alternates?.canonical, `${SITE_URL}/daily-english/test-${dailyTestCount}`);
  assert.match(metadata.description!, new RegExp(`\\b${final.items.length} everyday English words\\b`));
  assert.match(metadata.description!, new RegExp(`word list ${dailyTestCount}\\b`));
  assert.match(metadata.description!, /Turkish meanings/);
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
  assert.deepEqual(spanish.alternates?.languages, getVocabularyLanguageAlternates('es', spanishVocabulary[0].slug));
  await assert.rejects(spanishMetadata({ params: { slug: 'missing-word-not-in-the-dataset' } }), /NEXT_NOT_FOUND/);
  await assert.rejects(arabicMetadata({ params: { slug: 'missing-word-not-in-the-dataset' } }), /NEXT_NOT_FOUND/);
});

test('translated dictionary equivalents have reciprocal, self-inclusive links to existing pages', async () => {
  const spanishBySlug = new Map(spanishVocabulary.map((entry) => [entry.slug, entry]));
  const arabicBySlug = new Map(arabicVocabulary.map((entry) => [entry.slug, entry]));
  let pairCount = 0;
  for (const entry of spanishVocabulary) {
    const languages = getVocabularyLanguageAlternates('es', entry.slug);
    if (!languages) continue;
    pairCount++;
    const spanishSlug = new URL(languages.es).pathname.split('/').at(-1)!;
    const arabicSlug = new URL(languages.ar).pathname.split('/').at(-1)!;
    const arabic = arabicBySlug.get(arabicSlug)!;
    assert.ok(spanishBySlug.has(spanishSlug));
    assert.ok(arabic, languages.ar);
    assert.equal(languages.es, `${SITE_URL}/es/vocabulary/${entry.slug}`);
    assert.deepEqual(getVocabularyLanguageAlternates('ar', arabic.slug), languages);
    assert.equal(entry.word.toLowerCase(), arabic.word.toLowerCase());
    assert.equal(entry.s.trim().toLowerCase(), arabic.s.trim().toLowerCase());
    assert.ok(entry.meaning && entry.t && arabic.meaning && arabic.t);
    const [esMetadata, arMetadata] = await Promise.all([
      spanishMetadata({ params: { slug: entry.slug } }),
      arabicMetadata({ params: { slug: arabic.slug } }),
    ]);
    assert.deepEqual(esMetadata.alternates?.languages, languages);
    assert.deepEqual(arMetadata.alternates?.languages, languages);
  }
  assert.ok(pairCount > 0);
});

test('different dictionary senses and absent translations do not get invented alternates', () => {
  const differentExample = spanishVocabulary.find((entry) => arabicVocabulary.some((arabic) =>
    arabic.word.toLowerCase() === entry.word.toLowerCase() && arabic.s.trim().toLowerCase() !== entry.s.trim().toLowerCase(),
  ));
  assert.ok(differentExample);
  assert.equal(getVocabularyLanguageAlternates('es', differentExample.slug), undefined);
  assert.equal(getVocabularyLanguageAlternates('es', 'missing-word-not-in-the-dataset'), undefined);
  assert.equal(getVocabularyLanguageAlternates('ar', 'missing-word-not-in-the-dataset'), undefined);
});

test('sitemap language alternates agree with HTML metadata and stay within published canonical URLs', () => {
  const entries = sitemap();
  const urls = new Set(entries.map((entry) => entry.url));
  const translated = entries.filter((entry) => entry.alternates?.languages);
  assert.ok(translated.length > 0);
  for (const entry of translated) {
    const [, locale, , slug] = new URL(entry.url).pathname.split('/');
    assert.deepEqual(entry.alternates?.languages, getVocabularyLanguageAlternates(locale as 'es' | 'ar', slug));
    for (const url of Object.values(entry.alternates!.languages!)) {
      assert.equal(typeof url, 'string');
      assert.ok(typeof url === 'string' && urls.has(url));
    }
  }
});

test('localized dictionary schema describes visible definitions and an ordered breadcrumb', () => {
  for (const locale of ['es', 'ar'] as const) {
    const entry = (locale === 'es' ? spanishVocabulary : arabicVocabulary)[0];
    const graph = getVocabularyWordStructuredData(locale, entry)['@graph'];
    const term = graph.find((item) => item['@type'] === 'DefinedTerm')!;
    const breadcrumb = graph.find((item) => item['@type'] === 'BreadcrumbList')!;
    assert.equal(term.name, entry.word);
    assert.equal(term.description, entry.meaning);
    assert.deepEqual(breadcrumb.itemListElement!.map((item) => item.position), [1, 2, 3]);
    assert.equal(breadcrumb.itemListElement!.at(-1)!.item, `${SITE_URL}/${locale}/vocabulary/${entry.slug}`);
  }
});
