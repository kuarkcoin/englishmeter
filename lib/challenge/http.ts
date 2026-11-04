import { createHash, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ChallengeError } from './errors';

const COOKIE = 'em_challenge';
const MAX_BODY_BYTES = 8192;
export function participant(req: NextRequest, create = false) {
  const value = req.cookies.get(COOKIE)?.value;
  const token = value && /^[a-f0-9]{64}$/.test(value) ? value : create ? randomBytes(32).toString('hex') : null;
  return token ? { token, hash: createHash('sha256').update(token).digest('hex'), isNew: value !== token } : null;
}

export function requireParticipant(req: NextRequest) {
  const identity = participant(req);
  if (!identity) throw new ChallengeError('Please start the challenge in this browser first.', 401);
  return identity;
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex', Vary: 'Cookie' } });
}

export function attachParticipant(res: NextResponse, identity: NonNullable<ReturnType<typeof participant>>) {
  res.cookies.set(COOKIE, identity.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 365 * 24 * 3600 });
  return res;
}

export async function readBody(req: NextRequest): Promise<Record<string, unknown>> {
  const origin = req.headers.get('origin');
  // Next may normalize nextUrl to localhost internally; Host retains the public
  // authority. Do not trust a caller-provided X-Forwarded-Host for this check.
  const host = req.headers.get('host') ?? req.nextUrl.host;
  const forwardedProtocol = req.headers.get('x-forwarded-proto');
  const protocol = forwardedProtocol === 'http' || forwardedProtocol === 'https' ? `${forwardedProtocol}:` : req.nextUrl.protocol;
  if ((origin && origin !== `${protocol}//${host}`) || req.headers.get('sec-fetch-site') === 'cross-site') throw new ChallengeError('Please submit the challenge from this website.', 403);
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new ChallengeError('Please send a JSON request.', 415);
  if (Number(req.headers.get('content-length')) > MAX_BODY_BYTES) throw new ChallengeError('The request is too large.', 413);
  const reader = req.body?.getReader();
  if (!reader) throw new ChallengeError('Please send a valid request.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new ChallengeError('The request is too large.', 413); }
    chunks.push(value);
  }
  let body: unknown;
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new ChallengeError('Please send a valid JSON request.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ChallengeError('Please send a valid request.');
  return body as Record<string, unknown>;
}

export function attemptFields(body: Record<string, unknown>) {
  if (typeof body.attemptId !== 'string' || !/^[a-f0-9-]{36}$/.test(body.attemptId)) throw new ChallengeError('Invalid attempt. Please reload the challenge.');
  if (!Number.isSafeInteger(body.revision) || Number(body.revision) < 0 || Number(body.revision) > 1_000_000) throw new ChallengeError('Invalid answer revision.');
  return { id: body.attemptId, revision: Number(body.revision) };
}

export async function handle(action: () => Promise<NextResponse>) {
  try { return await action(); }
  catch (error) {
    if (error instanceof ChallengeError) return json({ error: error.message }, error.status);
    // Validation errors are intentionally user-readable; provider details are not.
    if (error instanceof Error && error.name === 'ChallengeValidationError') return json({ error: error.message }, 400);
    console.error('challenge_unavailable');
    return json({ error: 'The daily challenge is temporarily unavailable. Your saved answers are kept; please try again.' }, 503);
  }
}
