import { NextRequest } from 'next/server';
import { startAttempt } from '@/lib/challenge/service';
import { attachParticipant, handle, json, participant, readBody } from '@/lib/challenge/http';
import { ChallengeError } from '@/lib/challenge/errors';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await readBody(req);
    if (body.practice !== undefined && typeof body.practice !== 'boolean') throw new ChallengeError('Invalid start request.');
    const identity = participant(req, true)!;
    return attachParticipant(json(await startAttempt(identity.hash, body.practice === true)), identity);
  });
}
