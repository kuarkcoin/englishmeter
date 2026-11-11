import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { launchHomeTest } from '../lib/home-test-launcher';
import { getHomeTestSummary } from '../lib/home-test-summary';
import { searchTests } from '../lib/test-discovery';
import { isQuizPayload } from '../lib/quiz-session';
import type { MeaningLanguageCode } from '../lib/home-test-types';

// Captured by executing the original HomeClient launch callbacks at commit 0688026
// with the same seeded RNG, clock and isolated storage. These hashes cover all
// prompts, options, correct flags, explanations, durations, routes and titles.
const baseline: Array<{slug: string; language: MeaningLanguageCode; questions: number; sha256: string}> = JSON.parse(
  readFileSync(new URL('./fixtures/home-launcher-baseline.json', import.meta.url), 'utf8'),
);

test('lazy homepage launcher preserves the 30 original representative test payloads', () => {
  const originalRandom = Math.random;
  const originalNow = Date.now;
  const savedProperties = ['window', 'localStorage', 'sessionStorage'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const);
  try {
    for (const fixture of baseline) {
      let seed = 8128;
      Math.random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
      Date.now = () => 1794355200000;
      const local = new Map<string, string>();
      const session = new Map<string, string>();
      const storage = (data: Map<string, string>) => ({ getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value) });
      Object.defineProperty(globalThis, 'window', { value: {}, configurable: true });
      Object.defineProperty(globalThis, 'localStorage', { value: storage(local), configurable: true });
      Object.defineProperty(globalThis, 'sessionStorage', { value: storage(session), configurable: true });
      let route = '';
      let last: { title: string; slug: string } | undefined;
      launchHomeTest({
        testSlug: fixture.slug, meaningLanguage: fixture.language,
        englishDeutschWords: Array.from({ length: 200 }, (_, index) => ({ word: `word-${index}`, meaning: `meaning-${index}` })),
        router: { push: (path) => { route = path; } },
        saveLast: (title, slug) => { last = { title, slug }; },
      });
      const payload = JSON.parse(session.get('em_attempt_payload') || 'null');
      assert.ok(isQuizPayload(payload), `${fixture.slug} must remain loadable and resumable`);
      assert.equal(payload.questions.length, fixture.questions, fixture.slug);
      const hash = createHash('sha256').update(JSON.stringify({ route, last, payload })).digest('hex');
      assert.equal(hash, fixture.sha256, `${fixture.slug} (${fixture.language}) changed`);
    }
  } finally {
    Math.random = originalRandom;
    Date.now = originalNow;
    for (const [key, descriptor] of savedProperties) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});

test('homepage search finds level topics, exam tests and categories without returning question data', () => {
  const summary = getHomeTestSummary();
  const entries = summary.searchTests;
  assert.equal(new Set(entries.map((entry) => entry.href)).size, entries.length);
  assert.ok(searchTests(entries, 'b1 phrasal').some((entry) => entry.href.startsWith('/levels/b1/')));
  assert.ok(searchTests(entries, 'IELTS').length >= 10);
  assert.ok(searchTests(entries, 'YDS 32').some((entry) => entry.href === '/tests/yds-exam-test-32'));
  assert.deepEqual(searchTests(entries, '  '), []);
  assert.deepEqual(searchTests(entries, 'unlikely-to-match-any-test'), []);
  for (const entry of entries) assert.deepEqual(Object.keys(entry).sort(), ['category', 'href', 'title']);
  assert.equal(Object.keys(summary.examQuestionCounts).length, 32);
});
