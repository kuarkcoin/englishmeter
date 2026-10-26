import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canonicalOrigin, buildSeoMetadata, serializeJsonLd, SITE_URL } from '../lib/seo';
import { HOME_FAQ } from '../lib/home-faq';

const { default: nextConfig } = await import(new URL('../next.config.mjs', import.meta.url).href);

test('canonical origin excludes paths, query strings, credentials and malformed configuration', () => {
  assert.equal(canonicalOrigin(' https://englishmeter.net/path?lang=de '), 'https://englishmeter.net');
  for (const invalid of ['', 'not-a-url', 'javascript:alert(1)', 'https://user:secret@example.com']) {
    assert.equal(canonicalOrigin(invalid), 'https://englishmeter.net');
  }
});

test('page metadata uses its own canonical and matching social preview instead of the homepage', () => {
  const meta = buildSeoMetadata({ title: 'English Grammar Tests', description: 'Practice grammar.', path: '/grammar' });
  assert.equal(meta.alternates?.canonical, `${SITE_URL}/grammar`);
  assert.equal((meta.openGraph as { url: string }).url, `${SITE_URL}/grammar`);
  assert.equal(meta.description, 'Practice grammar.');
  assert.equal((meta.openGraph as { description: string }).description, meta.description);
});

test('private pages remain noindex and previews also have a site-wide noindex response header', async () => {
  const old = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = 'production';
    const args = { title: 'Account', description: 'Your account.', path: '/login', noindex: true };
    assert.deepEqual(buildSeoMetadata(args).robots, { index: false, follow: true });
    assert.deepEqual(buildSeoMetadata({ ...args, noindex: false }).robots, { index: true, follow: true });
    process.env.VERCEL_ENV = 'preview';
    assert.deepEqual(buildSeoMetadata({ ...args, noindex: false }).robots, { index: false, follow: true });
    assert.deepEqual(await nextConfig.headers(), [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]);
  } finally {
    if (old === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = old;
  }
});

test('structured data cannot terminate its script tag and preserves readable content', () => {
  const value = { text: '</script><script>alert(1)</script>\u2028\u2029' };
  const encoded = serializeJsonLd(value);
  assert.equal(encoded.includes('<'), false);
  assert.deepEqual(JSON.parse(encoded), value);
  assert.equal(HOME_FAQ.length, 4);
});
