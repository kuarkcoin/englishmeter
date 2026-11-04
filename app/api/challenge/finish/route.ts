import { NextRequest } from 'next/server';
import { finishAttempt } from '@/lib/challenge/service';
import { attemptFields, handle, json, readBody, requireParticipant } from '@/lib/challenge/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await readBody(req); const identity = requireParticipant(req); const { id, revision } = attemptFields(body);
    return json(await finishAttempt(identity.hash, id, body.answers, revision));
  });
}
