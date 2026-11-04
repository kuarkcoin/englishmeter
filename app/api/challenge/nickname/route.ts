import { NextRequest } from 'next/server';
import { publishNickname } from '@/lib/challenge/service';
import { handle, json, readBody, requireParticipant } from '@/lib/challenge/http';
import { ChallengeError } from '@/lib/challenge/errors';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await readBody(req); const identity = requireParticipant(req);
    if (typeof body.attemptId !== 'string' || !/^[a-f0-9-]{36}$/.test(body.attemptId)) throw new ChallengeError('Invalid attempt. Please reload the challenge.');
    return json(await publishNickname(identity.hash, body.attemptId, body.nickname));
  });
}
