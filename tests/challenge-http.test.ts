import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { NextRequest } from 'next/server';
import { GET as session } from '../app/api/challenge/route';
import { POST as start } from '../app/api/challenge/start/route';
import { PUT as save } from '../app/api/challenge/attempt/route';
import { POST as finish } from '../app/api/challenge/finish/route';
import { POST as nickname } from '../app/api/challenge/nickname/route';
import { GET as leaderboard } from '../app/api/challenge/leaderboard/route';
import { attachParticipant, json, participant } from '../lib/challenge/http';

const databaseUrl = process.env.DATABASE_URL;
beforeEach(() => { delete process.env.DATABASE_URL; });
afterEach(() => { if (databaseUrl === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = databaseUrl; });
const id = '8b08d654-bc3a-4d32-89cb-4b4a286b38d2';
function request(path: string, body: unknown, method = 'POST', headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost/api/challenge${path}`, {
    method, headers: { 'content-type': 'application/json', cookie: `em_challenge=${'a'.repeat(64)}`, ...headers }, body: JSON.stringify(body),
  });
}

test('anonymous session does not invent an attempt or return database information', async () => {
  const response = await session(new NextRequest('http://localhost/api/challenge'));
  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
  assert.match(response.headers.get('cache-control')!, /private.*no-store/);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
});

test('missing database returns 503, never a fake score or leaderboard', async () => {
  for (const response of [await start(request('/start', {})), await leaderboard(new NextRequest('http://localhost/api/challenge/leaderboard'))]) {
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.deepEqual(Object.keys(body), ['error']);
    assert.match(body.error, /temporarily unavailable/);
    assert.doesNotMatch(JSON.stringify(body), /DATABASE_URL|postgres|PASSWORD/);
  }
});

test('mutation endpoints reject cross-origin requests and non-JSON bodies', async () => {
  assert.equal((await start(request('/start', {}, 'POST', { origin: 'https://foreign.example' }))).status, 403);
  assert.equal((await start(request('/start', {}, 'POST', { 'sec-fetch-site': 'cross-site' }))).status, 403);
  assert.equal((await start(request('/start', {}, 'POST', { 'content-type': 'text/plain' }))).status, 415);
  // Next's internal URL can differ from the public Host behind a proxy.
  assert.equal((await start(request('/start', {}, 'POST', { origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' }))).status, 503);
  assert.equal((await start(request('/start', {}, 'POST', { origin: 'https://englishmeter.net', host: 'englishmeter.net', 'x-forwarded-proto': 'https' }))).status, 503);
  assert.equal((await start(request('/start', {}, 'POST', { origin: 'https://foreign.example', host: 'englishmeter.net', 'x-forwarded-host': 'foreign.example', 'x-forwarded-proto': 'https' }))).status, 403);
});

test('malformed, oversized and non-object payloads are rejected before database work', async () => {
  assert.equal((await start(new NextRequest('http://localhost/api/challenge/start', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }))).status, 400);
  for (const body of [null, [], 42, { practice: 'yes' }]) assert.equal((await start(request('/start', body))).status, 400);
  assert.equal((await start(request('/start', { padding: 'x'.repeat(9000) }))).status, 413);
  assert.equal((await start(request('/start', {}, 'POST', { 'content-length': '999999' }))).status, 413);
});

test('save and finish require ownership cookie and validate answer revisions', async () => {
  for (const [handler, path, method] of [[save, '/attempt', 'PUT'], [finish, '/finish', 'POST']] as const) {
    const body = { attemptId: id, revision: 1, answers: Array(50).fill(null) };
    assert.equal((await handler(request(path, body, method, { cookie: '' }))).status, 401);
    assert.equal((await handler(request(path, { ...body, attemptId: '../someone' }, method))).status, 400);
    for (const revision of [-1, 1.5, '1', 1_000_001]) assert.equal((await handler(request(path, { ...body, revision }, method))).status, 400);
    for (const answers of [[], Array(49).fill(null), Array(50).fill(5), Array(50).fill('0')]) assert.equal((await handler(request(path, { ...body, answers }, method))).status, 400);
  }
});

test('nickname and leaderboard date validation return user errors', async () => {
  for (const value of ['x', '<script>alert(1)</script>', 'name\nadmin', 'a'.repeat(21), null]) {
    assert.equal((await nickname(request('/nickname', { attemptId: id, nickname: value }))).status, 400);
  }
  assert.equal((await leaderboard(new NextRequest('http://localhost/api/challenge/leaderboard?day=2026-02-30'))).status, 400);
});

test('identity token is random, hash-backed, HttpOnly and not client-readable', () => {
  const req = new NextRequest('http://localhost/api/challenge/start');
  assert.equal(participant(req), null);
  const first = participant(req, true)!;
  const second = participant(req, true)!;
  assert.match(first.token, /^[a-f0-9]{64}$/);
  assert.notEqual(first.token, second.token);
  assert.notEqual(first.hash, first.token);
  const response = attachParticipant(json({ ok: true }), first);
  assert.match(response.headers.get('set-cookie')!, /HttpOnly/i);
  assert.match(response.headers.get('set-cookie')!, /SameSite=lax/i);
  assert.equal(participant(request('/start', {}, 'POST', { cookie: `em_challenge=${first.token}` }))?.hash, first.hash);
});
