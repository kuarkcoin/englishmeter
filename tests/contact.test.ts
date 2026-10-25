import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { POST } from '../app/api/contact/route';
import { archiveContactMessage } from '../lib/contact-archive';

const originalFetch = globalThis.fetch;
const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  DATABASE_URL: process.env.DATABASE_URL,
};
const valid = { name: 'Test Visitor', email: 'visitor@example.com', message: 'A question about vocabulary.' };
const request = (body: unknown) => new Request('http://localhost/api/contact', {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
});

beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.DATABASE_URL;
  globalThis.fetch = async () => { throw new Error('Unexpected external request in test'); };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function configureMail() {
  // Test-only value; every provider request is intercepted locally.
  process.env.RESEND_API_KEY = 'test-only-placeholder';
  process.env.CONTACT_FROM_EMAIL = 'EnglishMeter <contact@example.com>';
}

test('rejects malformed JSON and non-object payloads', async () => {
  const broken = new Request('http://localhost/api/contact', { method: 'POST', body: '{' });
  assert.equal((await POST(broken)).status, 400);
  for (const value of [null, [], 'hello']) assert.equal((await POST(request(value))).status, 400);
});

test('validates field types, required values, email and header injection', async () => {
  for (const body of [
    {}, { ...valid, name: {} }, { ...valid, message: '   ' },
    { ...valid, email: 'not-an-email' }, { ...valid, email: 'a@b@c.com' },
    { ...valid, email: 'a@example.com\r\nBcc: other@example.com' },
    { ...valid, name: 'A\r\nBcc: other@example.com' },
  ]) assert.equal((await POST(request(body))).status, 400);
});

test('rejects oversized fields and honeypot submissions before sending', async () => {
  for (const body of [
    { ...valid, name: 'x'.repeat(101) }, { ...valid, email: 'x'.repeat(255) },
    { ...valid, message: 'x'.repeat(5001) }, { ...valid, website: 'spam.example' },
  ]) assert.equal((await POST(request(body))).status, 400);
});

test('missing credentials or sender returns 503 with a direct email fallback', async () => {
  for (const configure of [false, true]) {
    if (configure) process.env.RESEND_API_KEY = 'test-only-placeholder';
    const res = await POST(request(valid));
    assert.equal(res.status, 503);
    const data = await res.json();
    assert.match(data.error, /muratot79@gmail\.com/);
    assert.equal(data.ok, undefined);
  }
});

test('sends plain text to the fixed inbox with visitor as reply-to, without a database', async () => {
  configureMail();
  let calls = 0;
  globalThis.fetch = async (url, init) => {
    calls++;
    assert.equal(String(url), 'https://api.resend.com/emails');
    const payload = JSON.parse(init?.body as string);
    assert.equal(payload.from, process.env.CONTACT_FROM_EMAIL);
    assert.equal(payload.to, 'muratot79@gmail.com');
    assert.equal(payload.reply_to, 'visitor@example.com');
    assert.equal(payload.html, undefined);
    assert.match(payload.text, /Name: Test Visitor\nEmail: visitor@example.com/);
    assert.match(payload.text, /<script>test<\/script>/);
    return Response.json({ id: 'local-test-email-id' });
  };
  const res = await POST(request({ ...valid, name: ' Test Visitor ', email: ' VISITOR@EXAMPLE.COM ', message: '<script>test</script>', website: '', to: 'untrusted@example.com' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls, 1);
});

test('provider rejection never reports success or leaks provider details', async () => {
  configureMail();
  globalThis.fetch = async () => Response.json({ name: 'validation_error', message: 'private provider detail' }, { status: 422 });
  const res = await POST(request(valid));
  assert.equal(res.status, 502);
  assert.doesNotMatch(await res.text(), /private provider detail/);
});

test('provider response without an accepted message id is not success', async () => {
  configureMail();
  globalThis.fetch = async () => Response.json({});
  assert.equal((await POST(request(valid))).status, 502);
});

test('provider network failure returns a retryable error', async () => {
  configureMail();
  globalThis.fetch = async () => { throw new Error('network down'); };
  assert.equal((await POST(request(valid))).status, 502);
});

test('optional archive saves the submitted fields', async () => {
  const result = await archiveContactMessage(valid, async (message) => {
    assert.deepEqual(message, valid);
  });
  assert.equal(result, true);
});

test('optional archive failure does not throw after an email was accepted', async () => {
  assert.equal(await archiveContactMessage(valid, async () => { throw new Error('database unavailable'); }), false);
});

test('optional archive stops waiting for a stalled database', { timeout: 1000 }, async () => {
  const result = await archiveContactMessage(valid, () => new Promise(() => {}), 10);
  assert.equal(result, false);
});
