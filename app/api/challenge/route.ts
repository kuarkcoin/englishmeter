import { NextRequest } from 'next/server';
import { getSession } from '@/lib/challenge/service';
import { handle, json, participant } from '@/lib/challenge/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  return handle(async () => { const identity = participant(req); return json(identity ? await getSession(identity.hash) : null); });
}
