import { NextRequest } from 'next/server';
import { getLeaderboard } from '@/lib/challenge/service';
import { handle, json } from '@/lib/challenge/http';
import { challengeDay, validateDay } from '@/lib/challenge/core';
import { ChallengeError } from '@/lib/challenge/errors';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  return handle(async () => {
    const day = req.nextUrl.searchParams.get('day') ?? challengeDay();
    if (!validateDay(day)) throw new ChallengeError('Invalid challenge date.');
    return json(await getLeaderboard(day));
  });
}
