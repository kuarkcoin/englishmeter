// Server only: never import this module from a client component.
import { Prisma, type ChallengeAttempt } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { BANK_VERSION, createDailyPaper } from './bank';
import { challengeDay, CHALLENGE_DURATION_SECONDS, normalizeNickname, publicQuestions, scoreChallenge, validateAnswers } from './core';
import { ChallengeError } from './errors';
import type { ChallengeLeaderboard, ChallengeQuestion, ChallengeResult, ChallengeSession } from './types';

type Tx = Prisma.TransactionClient;
type BoardRow = { attemptId: string; nickname: string; correct: number; incorrect: number; unanswered: number; netQuarter: number; durationSeconds: number; rank: bigint; participants: bigint };

function configured() {
  if (!process.env.DATABASE_URL?.trim()) throw new ChallengeError('The daily challenge is temporarily unavailable. Please try again later.', 503);
}

// Serializes a browser's start/save/finish requests across all application instances.
// Unique entry constraints also enforce one ranked completion per browser/day.
async function locked<T>(participantHash: string, action: (tx: Tx) => Promise<T>): Promise<T> {
  configured();
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${participantHash}, 0))::text`;
    return action(tx);
  }, { maxWait: 5000, timeout: 10000 });
}

async function owned(tx: Tx, participantHash: string, id: string) {
  const attempt = await tx.challengeAttempt.findFirst({ where: { id, participantHash }, include: { paper: true } });
  if (!attempt) throw new ChallengeError('This attempt could not be found. Please resume the challenge in the browser where you started it.', 404);
  return attempt;
}

async function ranking(tx: Tx, day: string, attemptId?: string): Promise<BoardRow[]> {
  // One snapshot computes positions, count and scores from the same published population.
  return tx.$queryRaw<BoardRow[]>(Prisma.sql`
    WITH ranked AS (
      SELECT a."id" AS "attemptId", e."nickname", a."correct", a."incorrect", a."unanswered",
        a."netQuarter", a."durationSeconds",
        ROW_NUMBER() OVER (ORDER BY a."netQuarter" DESC, a."durationSeconds" ASC, a."finishedAt" ASC, a."id" ASC) AS "rank",
        COUNT(*) OVER () AS "participants"
      FROM "ChallengeEntry" e JOIN "ChallengeAttempt" a ON a."id" = e."attemptId"
      WHERE e."day" = ${day} AND e."nickname" IS NOT NULL AND a."finishedAt" IS NOT NULL
    ) SELECT * FROM ranked ${attemptId ? Prisma.sql`WHERE "attemptId" = ${attemptId}` : Prisma.sql`ORDER BY "rank" LIMIT 20`}
  `);
}

async function resultFor(tx: Tx, attempt: ChallengeAttempt): Promise<ChallengeResult> {
  const entry = await tx.challengeEntry.findUnique({ where: { attemptId: attempt.id } });
  const rows = await ranking(tx, attempt.day, entry?.nickname ? attempt.id : undefined);
  return {
    attemptId: attempt.id, day: attempt.day, correct: attempt.correct!, incorrect: attempt.incorrect!,
    unanswered: attempt.unanswered!, net: attempt.netQuarter! / 4, durationSeconds: attempt.durationSeconds!,
    ranked: !!entry, nickname: entry?.nickname ?? null,
    rank: entry?.nickname && rows[0] ? Number(rows[0].rank) : null,
    participants: Number(rows[0]?.participants ?? 0),
  };
}

async function sessionFor(tx: Tx, attempt: Awaited<ReturnType<typeof owned>>): Promise<ChallengeSession> {
  return {
    attemptId: attempt.id, day: attempt.day, startedAt: attempt.startedAt.toISOString(),
    deadlineAt: attempt.deadlineAt.toISOString(), serverNow: new Date().toISOString(),
    questions: publicQuestions(attempt.paper.questions as unknown as ChallengeQuestion[]),
    answers: attempt.answers as (number | null)[], revision: attempt.revision,
    result: attempt.finishedAt ? await resultFor(tx, attempt) : null,
  };
}

export async function getSession(participantHash: string): Promise<ChallengeSession | null> {
  return locked(participantHash, async tx => {
    const ongoing = await tx.challengeAttempt.findFirst({
      where: { participantHash, finishedAt: null },
      orderBy: { startedAt: 'desc' }, include: { paper: true },
    });
    const attempt = ongoing ?? await tx.challengeAttempt.findFirst({
      where: { participantHash, day: challengeDay() },
      orderBy: { startedAt: 'desc' }, include: { paper: true },
    });
    return attempt ? sessionFor(tx, attempt) : null;
  });
}

export async function startAttempt(participantHash: string, practice = false): Promise<ChallengeSession> {
  return locked(participantHash, async tx => {
    const ongoing = await tx.challengeAttempt.findFirst({ where: { participantHash, finishedAt: null }, orderBy: { startedAt: 'desc' }, include: { paper: true } });
    if (ongoing) return sessionFor(tx, ongoing);
    const now = new Date();
    const day = challengeDay(now);
    const latest = await tx.challengeAttempt.findFirst({ where: { participantHash, day }, orderBy: { startedAt: 'desc' }, include: { paper: true } });
    if (latest && !practice) return sessionFor(tx, latest);
    // The immutable stored paper survives deployments and content-bank updates.
    await tx.challengeDay.createMany({ data: [{ day, bankVersion: BANK_VERSION, questions: createDailyPaper(day) as unknown as Prisma.InputJsonValue }], skipDuplicates: true });
    const attempt = await tx.challengeAttempt.create({ data: {
      participantHash, day, startedAt: now,
      deadlineAt: new Date(now.getTime() + CHALLENGE_DURATION_SECONDS * 1000),
      answers: Array(50).fill(null),
    }, include: { paper: true } });
    return sessionFor(tx, attempt);
  });
}

export async function saveAnswers(participantHash: string, id: string, input: unknown, revision: number) {
  const answers = validateAnswers(input);
  return locked(participantHash, async tx => {
    const attempt = await owned(tx, participantHash, id);
    const now = new Date();
    if (attempt.finishedAt || now >= attempt.deadlineAt) return { saved: false, expired: true, revision: attempt.revision, serverNow: now.toISOString() };
    if (revision <= attempt.revision) return {
      saved: revision === attempt.revision && JSON.stringify(answers) === JSON.stringify(attempt.answers),
      revision: attempt.revision, serverNow: now.toISOString(),
    };
    await tx.challengeAttempt.update({ where: { id }, data: { answers, revision } });
    return { saved: true, revision, serverNow: now.toISOString() };
  });
}

export async function finishAttempt(participantHash: string, id: string, input: unknown, revision: number): Promise<ChallengeResult> {
  const submitted = validateAnswers(input);
  return locked(participantHash, async tx => {
    const attempt = await owned(tx, participantHash, id);
    if (attempt.finishedAt) return resultFor(tx, attempt); // Network retries cannot change a score.
    const now = new Date();
    const expired = now >= attempt.deadlineAt;
    if (!expired && (revision < attempt.revision || (revision === attempt.revision && JSON.stringify(submitted) !== JSON.stringify(attempt.answers)))) {
      throw new ChallengeError('Newer answers were saved in another tab. Reload to resume with those answers.', 409);
    }
    // After the deadline only answers received and saved before it are eligible.
    const answers = expired ? attempt.answers as (number | null)[] : submitted;
    const score = scoreChallenge(attempt.paper.questions as unknown as ChallengeQuestion[], answers);
    const finished = await tx.challengeAttempt.update({ where: { id }, data: {
      answers, revision: expired ? attempt.revision : revision, finishedAt: now,
      correct: score.correct, incorrect: score.incorrect, unanswered: score.unanswered, netQuarter: score.netQuarter,
      durationSeconds: Math.min(CHALLENGE_DURATION_SECONDS, Math.max(1, Math.ceil((now.getTime() - attempt.startedAt.getTime()) / 1000))),
    } });
    // Reserve eligibility on first completion, even if the visitor has not picked a nickname yet.
    await tx.challengeEntry.createMany({ data: [{ day: attempt.day, participantHash, attemptId: id }], skipDuplicates: true });
    return resultFor(tx, finished);
  });
}

export async function publishNickname(participantHash: string, id: string, input: unknown): Promise<ChallengeResult> {
  const nickname = normalizeNickname(input);
  try {
    return await locked(participantHash, async tx => {
      const attempt = await owned(tx, participantHash, id);
      if (!attempt.finishedAt) throw new ChallengeError('Finish the challenge before choosing your nickname.', 409);
      const entry = await tx.challengeEntry.findUnique({ where: { attemptId: id } });
      if (!entry) throw new ChallengeError('Only your first completed attempt of the day can join the leaderboard.', 409);
      await tx.challengeEntry.update({ where: { id: entry.id }, data: { nickname, nicknameKey: nickname.normalize('NFKC').toLowerCase() } });
      return resultFor(tx, attempt);
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ChallengeError('That nickname is already in today’s leaderboard. Please choose another.', 409);
    throw error;
  }
}

export async function getLeaderboard(day = challengeDay()): Promise<ChallengeLeaderboard> {
  configured();
  const rows = await ranking(prisma, day);
  return {
    day, participants: Number(rows[0]?.participants ?? 0),
    entries: rows.map(row => ({ rank: Number(row.rank), nickname: row.nickname, correct: row.correct, incorrect: row.incorrect,
      unanswered: row.unanswered, net: row.netQuarter / 4, durationSeconds: row.durationSeconds })),
  };
}
