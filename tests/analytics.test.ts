import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  analyticsPath, analyticsReferrer, buildCompletionParameters, buildTestEventParameters, categoryForAnalyticsPath,
  configureAnalytics, effectiveAnalyticsConsent, getAnalyticsCategory, initializeAnalytics, setAnalyticsConsent, isAnalyticsHost,
  trackCategoryClick, trackPageView, trackTestComplete, trackTestStart,
} from '../lib/analytics';

const attempt = { testId: 'practice-ielts-grammar-test-1', category: 'ielts-grammar', questionCount: 15, mode: 'exam' as const, attemptId: 'local-attempt-never-sent' };

test('first visits count by default without fabricating a saved choice, while explicit and browser opt-outs remain effective', () => {
  const values = new Map<string, string>();
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const privacy = { doNotTrack: '0', globalPrivacyControl: false };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: { getItem: (key: string) => values.get(key) ?? null } } });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: privacy });
  try {
    assert.equal(effectiveAnalyticsConsent(), 'granted');
    assert.equal(values.size, 0, 'automatic counting is not a stored consent choice');
    privacy.doNotTrack = '1';
    assert.equal(effectiveAnalyticsConsent(), 'denied');
    assert.equal(values.size, 0, 'browser signals must not create a permanent opt-out');
    privacy.doNotTrack = '0';
    privacy.globalPrivacyControl = true;
    assert.equal(effectiveAnalyticsConsent(), 'denied');
    privacy.globalPrivacyControl = false;
    assert.equal(effectiveAnalyticsConsent(), 'granted');
    values.set('em_analytics_consent_v1', 'denied');
    assert.equal(effectiveAnalyticsConsent(), 'denied', 'existing opt-outs are never overwritten');
    values.set('em_analytics_consent_v1', 'granted');
    privacy.doNotTrack = '1';
    assert.equal(effectiveAnalyticsConsent(), 'granted', 'an explicit visitor choice takes precedence');
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else Reflect.deleteProperty(globalThis, 'window');
    if (oldNavigator) Object.defineProperty(globalThis, 'navigator', oldNavigator); else Reflect.deleteProperty(globalThis, 'navigator');
  }
});

test('test event parameters are a small explicit allowlist and contain no identity or answer data', () => {
  const input = { ...attempt, nickname: 'private-name', email: 'private@example.org', answers: ['A'], question: 'private prompt' };
  assert.deepEqual(buildTestEventParameters(input), { test_id: attempt.testId, test_category: 'ielts-grammar', question_count: 15, test_mode: 'exam' });
  for (const badId of ['student@example.org', 'test?email=private', 'test/secret', '']) assert.equal(buildTestEventParameters({ ...attempt, testId: badId }), null);
});

test('completion counts must match the actual test size and duration must be finite', () => {
  const completed = { ...attempt, correct: 9, incorrect: 4, unanswered: 2, durationSeconds: 102.4, timedOut: false };
  assert.equal(buildCompletionParameters(completed)?.score_percent, 60);
  assert.equal(buildCompletionParameters(completed)?.duration_seconds, 102);
  for (const change of [{ correct: -1 }, { incorrect: 3 }, { unanswered: 2.5 }, { durationSeconds: Infinity }]) assert.equal(buildCompletionParameters({ ...completed, ...change }), null);
});

test('analytics page paths remove queries, fragments and unique attempt identifiers', () => {
  assert.equal(analyticsPath('/quiz/secret-attempt-id?email=private@example.org#answer-1'), '/quiz/attempt');
  assert.equal(analyticsPath('/grammar?search=private#section'), '/grammar');
  assert.equal(analyticsPath('//evil.example/path'), '/');
  assert.equal(getAnalyticsCategory('practice-business-english-workplace-vocabulary'), 'business-english');
  assert.equal(getAnalyticsCategory('quick-placement'), 'placement');
  assert.equal(getAnalyticsCategory('yds-mini-12'), 'yds');
  assert.equal(categoryForAnalyticsPath('/ielts-grammar-tests'), 'ielts-grammar');
  assert.equal(categoryForAnalyticsPath('/levels/b2'), 'level');
  assert.equal(categoryForAnalyticsPath('/contact'), null);
  assert.equal(isAnalyticsHost('localhost'), false);
  assert.equal(isAnalyticsHost('englishmeter-git-branch.vercel.app'), false);
  assert.equal(isAnalyticsHost('www.englishmeter.net'), true);
});

test('referrers retain Google and Bing origins without paths, queries, fragments or credentials', () => {
  assert.equal(analyticsReferrer('https://www.google.com/search?q=private@example.org#private'), 'https://www.google.com');
  assert.equal(analyticsReferrer('https://www.bing.com/search?q=English+test'), 'https://www.bing.com');
  assert.equal(analyticsReferrer('https://user:password@example.org/private/path?email=private@example.org'), 'https://example.org');
  assert.equal(analyticsReferrer('http://example.org:8080/private'), 'http://example.org:8080');
  for (const invalid of ['', '/private', 'javascript:alert(1)', 'data:text/plain,private', 'ftp://example.org/private']) assert.equal(analyticsReferrer(invalid), '');
});

test('analytics respects deployment and consent gates, deduplicates attempts and keeps page URLs private', () => {
  const calls: unknown[][] = [];
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: storage, sessionStorage: storage, location: { origin: 'https://www.englishmeter.net', hostname: 'www.englishmeter.net', pathname: '/quiz/private-attempt' }, gtag: (...args: unknown[]) => calls.push(args) } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { cookie: '', title: 'English test', referrer: 'https://www.google.com/search?q=private@example.org#secret' } });
  try {
    configureAnalytics(false);
    setAnalyticsConsent('granted');
    assert.equal(trackTestStart(attempt), false, 'disabled development builds never send usage events');
    configureAnalytics(true);
    setAnalyticsConsent('denied');
    assert.equal(trackTestStart(attempt), false, 'denied analytics never sends usage events');
    setAnalyticsConsent('granted');
    initializeAnalytics();
    const config = calls.find((call) => call[0] === 'config')?.[2] as { page_referrer: string };
    assert.equal(config.page_referrer, 'https://www.google.com');
    assert.equal(trackTestStart(attempt), true);
    assert.equal(trackTestStart(attempt), false, 'React rerender cannot count a second start');
    const completed = { ...attempt, correct: 10, incorrect: 3, unanswered: 2, durationSeconds: 60, timedOut: false };
    assert.equal(trackTestComplete(completed), true);
    assert.equal(trackTestComplete(completed), false, 'repeated finish cannot count another completion');
    assert.equal(trackCategoryClick({ categoryId: 'grammar', placement: 'home-discovery' }), true);
    assert.equal(trackPageView('/quiz/secret?email=private@example.org'), true);
    assert.equal(trackPageView('/grammar?search=private@example.org'), true);
    const events = calls.filter((call) => call[0] === 'event');
    assert.deepEqual(events.map((call) => call[1]), ['test_start', 'test_complete', 'category_click', 'page_view', 'page_view']);
    const serialized = JSON.stringify(events);
    for (const privateValue of ['local-attempt-never-sent', 'secret', 'private@example.org']) assert.equal(serialized.includes(privateValue), false);
    const views = events.filter((call) => call[1] === 'page_view').map((call) => call[2] as { page_location: string; page_referrer: string });
    assert.equal(views[0].page_location, 'https://www.englishmeter.net/quiz/attempt');
    assert.equal(views[0].page_referrer, 'https://www.google.com');
    assert.equal(views[1].page_location, 'https://www.englishmeter.net/grammar');
    assert.equal(views[1].page_referrer, 'https://www.englishmeter.net/quiz/attempt');
    setAnalyticsConsent('denied');
    assert.equal(trackCategoryClick({ categoryId: 'grammar', placement: 'home-discovery' }), false);
  } finally {
    configureAnalytics(false);
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else Reflect.deleteProperty(globalThis, 'window');
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else Reflect.deleteProperty(globalThis, 'document');
  }
});
