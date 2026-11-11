/*
 * Run against a local production build. Requires Playwright and a downloaded copy
 * of https://www.googletagmanager.com/gtag/js?id=G-Z4658W17W5.
 * GOOGLE_TAG_SCRIPT=/tmp/google-tag.js node scripts/check-analytics-browser.cjs
 * Optional: PLAYWRIGHT_MODULE, CHROMIUM_PATH, ANALYTICS_TEST_ORIGIN.
 * All Google requests are intercepted; no test visit reaches live Analytics.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.ANALYTICS_TEST_ORIGIN || 'http://127.0.0.1:3000';
assert.match(base, /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/);
assert.ok(process.env.GOOGLE_TAG_SCRIPT, 'Set GOOGLE_TAG_SCRIPT to the downloaded real Google tag script.');
const googleTag = fs.readFileSync(process.env.GOOGLE_TAG_SCRIPT, 'utf8');
assert.ok(googleTag.length > 1000, 'Expected the real Google tag, not a stub.');
const publicOrigin = 'https://www.englishmeter.net';
const previewOrigin = 'https://englishmeter-git-test.vercel.app';
const key = 'em_analytics_consent_v1';

async function until(check, message, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (check()) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.fail(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox'],
  });
  const completed = [];
  let closingBrowser = false;
  async function scenario({ origin = publicOrigin, preference, dnt = '0', gpc = false } = {}) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    let closing = false;
    const requests = { tags: 0, events: [], errors: [] };
    await context.addInitScript(({ preference, dnt, gpc, key }) => {
      Object.defineProperty(navigator, 'doNotTrack', { configurable: true, get: () => dnt });
      Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, get: () => gpc });
      if (preference) localStorage.setItem(key, preference);
    }, { preference, dnt, gpc, key });
    await context.route('**/*', async route => {
      try {
      const request = route.request();
      const url = new URL(request.url());
      if ([publicOrigin, previewOrigin, base].includes(url.origin)) {
        assert.equal(request.method(), 'GET', 'Browser test must not write to application APIs.');
        const response = await route.fetch({ url: base + url.pathname + url.search, maxRedirects: 0 });
        return route.fulfill({ response });
      }
      if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
        assert.equal(url.searchParams.get('id'), 'G-Z4658W17W5');
        requests.tags++;
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: googleTag });
      }
      if (url.hostname.endsWith('google-analytics.com') && /\/(?:g\/)?collect$/.test(url.pathname)) {
        const lines = request.postData()?.split('\n') || [''];
        for (const line of lines) {
          const params = new URLSearchParams(url.search);
          for (const [name, value] of new URLSearchParams(line)) params.set(name, value);
          requests.events.push(Object.fromEntries(params));
        }
        return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': origin } });
      }
      // No ads, measurement beacons or other third-party requests leave this test.
      return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': origin } });
      } catch (error) {
        // Next.js prefetches can still be in flight during context disposal.
        // Keep interception installed until closure so no external request escapes.
        if (!closing && !closingBrowser) throw error;
      }
    });
    const page = await context.newPage();
    page.on('pageerror', error => requests.errors.push(error.message));
    const allViews = () => requests.events.filter(event => event.en === 'page_view');
    // The app explicitly supplies page_path (encoded as dp by the Google tag).
    // GA's account-controlled history
    // listener can also emit views; report those separately instead of hiding them.
    const views = () => allViews().filter(event => event.dp || event['ep.page_path']);
    await page.goto(origin + '/?email=do-not-send@example.test', { waitUntil: 'networkidle', timeout: 60000 });
    return { page, requests, views, allViews, close: async () => { closing = true; await context.close(); } };
  }
  try {
    const fresh = await scenario();
    await until(() => fresh.views().length === 1, 'A first visit must emit one real GA page_view without an opt-in click.').catch(error => {
      console.error('Collected event fields:', fresh.requests.events.map(event => ({ keys: Object.keys(event), en: event.en, dl: event.dl, dp: event.dp })));
      throw error;
    });
    assert.equal(fresh.requests.tags, 1);
    assert.equal(await fresh.page.evaluate(key => localStorage.getItem(key), key), null);
    assert.equal(await fresh.page.getByRole('heading', { name: 'Analytics preferences' }).count(), 0);
    assert.equal(fresh.views()[0].tid, 'G-Z4658W17W5');
    assert.equal(fresh.views()[0].dl, publicOrigin + '/');
    assert.ok(!JSON.stringify(fresh.requests.events).includes('do-not-send'));
    await fresh.page.locator('a[href="/english-tests"]:visible').first().click();
    await fresh.page.waitForURL('**/english-tests');
    await until(() => fresh.views().length >= 2, 'Client-side navigation must emit a page_view.');
    assert.equal(fresh.views().length, 2, 'One page_view per actual navigation.');
    assert.equal(fresh.views()[1].dl, publicOrigin + '/english-tests');
    // Enhanced Measurement's history listener debounces by one second; allow
    // its event and Google tag's transport batching to settle before opting out.
    await fresh.page.waitForTimeout(2500);
    await fresh.page.getByRole('button', { name: 'Analytics preferences', exact: true }).click();
    await fresh.page.getByRole('button', { name: 'No thanks', exact: true }).click();
    assert.equal(await fresh.page.evaluate(key => localStorage.getItem(key), key), 'denied');
    await fresh.page.locator('a[href="/grammar"]:visible').first().click();
    await fresh.page.waitForURL('**/grammar');
    await fresh.page.waitForTimeout(2500);
    await fresh.page.waitForLoadState('networkidle');
    assert.equal(fresh.views().length, 2, 'Opting out stops application page views.');
    // Google may flush a history view queued before the opt-out. The newly
    // visited page must not be measured by either the app or the history listener.
    assert.ok(!fresh.allViews().some(event => event.dl === publicOrigin + '/grammar'), 'The page visited after opting out must not be measured.');
    await fresh.page.getByRole('button', { name: 'Analytics preferences', exact: true }).click();
    await fresh.page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
    await until(() => fresh.views().length === 3, 'Re-enabling analytics must count the currently open page.');
    assert.equal(fresh.views()[2].dl, publicOrigin + '/grammar');
    assert.deepEqual(fresh.requests.errors, []);
    const automaticViews = fresh.allViews().filter(event => !event.dp && !event['ep.page_path']);
    completed.push('Real Google tag: first visit, sanitised URLs, SPA page views, explicit opt-out and re-enable.');
    await fresh.close();

    for (const settings of [{ preference: 'denied' }, { dnt: '1' }, { gpc: true }, { origin: previewOrigin }, { origin: base }]) {
      const sample = await scenario(settings);
      // Opening the preferences also confirms the actual component has hydrated.
      await sample.page.getByRole('button', { name: 'Analytics preferences', exact: true }).click();
      await sample.page.getByRole('heading', { name: 'Analytics preferences', exact: true }).waitFor();
      assert.equal(sample.requests.tags, 0, JSON.stringify(settings));
      assert.equal(sample.allViews().length, 0, JSON.stringify(settings));
      assert.equal(await sample.page.evaluate(key => localStorage.getItem(key), key), settings.preference || null);
      assert.deepEqual(sample.requests.errors, []);
      await sample.close();
    }
    completed.push('Saved rejection, DNT, GPC, Preview alias and localhost do not load Analytics or fabricate saved choices.');
    const returning = await scenario({ preference: 'granted' });
    await until(() => returning.views().length === 1, 'A returning allowed visitor must be counted.');
    assert.equal(returning.requests.tags, 1);
    await returning.close();
    completed.push('Saved allow preference counts a returning visit.');
    console.log(JSON.stringify({ status: 'PASS', realGoogleTag: true, liveAnalyticsRequests: 0, completed,
      accountFollowUp: automaticViews.length ? {
        automaticHistoryViews: automaticViews.length,
        action: 'Disable Page changes based on browser history events in GA4 Enhanced Measurement to prevent duplicate views and unsanitised URLs.',
      } : null,
    }, null, 2));
  } finally { closingBrowser = true; await browser.close(); }
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
