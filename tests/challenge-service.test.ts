import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { test } from 'node:test';
import type { ChallengeQuestion } from '../lib/challenge/types';

// Opt in explicitly: ordinary test runs must never connect to an application's DB.
const testDatabaseUrl = process.env.CHALLENGE_TEST_DATABASE_URL;

test('challenge service persists and ranks real PostgreSQL attempts', {
  skip: !testDatabaseUrl ? 'Set CHALLENGE_TEST_DATABASE_URL to an isolated local PostgreSQL database.' : false,
  timeout: 90_000,
}, async t => {
  const url = new URL(testDatabaseUrl!);
  assert.ok(['postgres:', 'postgresql:'].includes(url.protocol), 'Tests require PostgreSQL.');
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(url.hostname), 'Integration tests refuse non-local databases.');
  process.env.DATABASE_URL = testDatabaseUrl;

  // Imports must follow DATABASE_URL assignment: Prisma reads it on connection.
  const { prisma } = await import('../lib/prisma');
  const service = await import('../lib/challenge/service');
  const { createDailyPaper, BANK_VERSION } = await import('../lib/challenge/bank');
  const participants: string[] = [];
  const fixtureDays: string[] = [];
  const runId = randomBytes(5).toString('hex');
  const empty = (): (number | null)[] => Array(50).fill(null);
  const participant = () => {
    const hash = createHash('sha256').update(`challenge-integration-${runId}-${randomUUID()}`).digest('hex');
    participants.push(hash);
    return hash;
  };
  const errorStatus = (status: number) => (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.equal((error as Error & { status?: number }).status, status);
    return true;
  };
  async function paperFor(id: string) {
    const attempt = await prisma.challengeAttempt.findUniqueOrThrow({ where: { id }, include: { paper: true } });
    return attempt.paper.questions as unknown as ChallengeQuestion[];
  }
  function answersFor(questions: ChallengeQuestion[], correct: number, incorrect = 0) {
    return questions.map((question, index) => index < correct ? question.answer : index < correct + incorrect ? (question.answer + 1) % 5 : null);
  }
  async function fixtureDay() {
    // A new historical paper makes rank assertions independent of other test users.
    for (let tries = 0; tries < 10; tries++) {
      const bytes = randomBytes(3);
      const day = `${1800 + bytes[0] % 100}-${String(1 + bytes[1] % 12).padStart(2, '0')}-${String(1 + bytes[2] % 28).padStart(2, '0')}`;
      const created = await prisma.challengeDay.createMany({
        data: [{ day, bankVersion: `${BANK_VERSION}-integration-${runId}`, questions: JSON.parse(JSON.stringify(createDailyPaper(day))) }],
        skipDuplicates: true,
      });
      if (created.count) {
        fixtureDays.push(day);
        return day;
      }
    }
    throw new Error('Could not allocate an isolated challenge day.');
  }

  // Never truncate tables: leave any pre-existing users, papers and messages intact.
  t.after(async () => {
    try {
      await prisma.challengeEntry.deleteMany({ where: { participantHash: { in: participants } } });
      await prisma.challengeAttempt.deleteMany({ where: { participantHash: { in: participants } } });
      // Remove only fixture papers created by this run and still unused by anyone.
      await prisma.challengeDay.deleteMany({ where: { day: { in: fixtureDays }, bankVersion: `${BANK_VERSION}-integration-${runId}`, attempts: { none: {} } } });
    } finally {
      await prisma.$disconnect();
    }
  });

  await t.test('concurrent start is idempotent and every browser receives the same private-key-free paper', async () => {
    const first = participant();
    const sessions = await Promise.all(Array.from({ length: 4 }, () => service.startAttempt(first)));
    assert.equal(new Set(sessions.map(session => session.attemptId)).size, 1);
    assert.equal(await prisma.challengeAttempt.count({ where: { participantHash: first } }), 1);
    const session = sessions[0];
    const other = await service.startAttempt(participant());
    assert.notEqual(session.attemptId, other.attemptId);
    assert.equal(session.day, other.day);
    assert.deepEqual(session.questions, other.questions);
    assert.equal(session.questions.length, 50);
    assert.deepEqual(session.answers, empty());
    assert.equal(session.revision, 0);
    assert.equal(session.result, null);
    assert.equal(Date.parse(session.deadlineAt) - Date.parse(session.startedAt), 2_400_000);
    const resumed = await service.getSession(first);
    assert.equal(resumed?.attemptId, session.attemptId);
    assert.deepEqual(resumed?.questions, session.questions);
    const serialized = JSON.stringify(session.questions);
    for (const secret of ['"answer":', '"explanation":', '"participantHash":', '"netQuarter":']) {
      assert.equal(serialized.includes(secret), false, `${secret} must not reach the browser`);
    }
    for (const question of await paperFor(session.attemptId)) {
      assert.equal(typeof question.answer, 'number', 'The answer key remains in the database.');
      assert.ok(question.explanation);
    }
  });

  await t.test('attempt ownership is enforced on saving, finishing and publishing', async () => {
    const owner = participant();
    const stranger = participant();
    const session = await service.startAttempt(owner);
    assert.equal(await service.getSession(stranger), null);
    await assert.rejects(service.saveAnswers(stranger, session.attemptId, empty(), 1), errorStatus(404));
    await assert.rejects(service.finishAttempt(stranger, session.attemptId, empty(), 1), errorStatus(404));
    await assert.rejects(service.publishNickname(stranger, session.attemptId, `Other-${runId}`), errorStatus(404));
    await assert.rejects(service.publishNickname(owner, session.attemptId, `Early-${runId}`), errorStatus(409));
    const row = await prisma.challengeAttempt.findUniqueOrThrow({ where: { id: session.attemptId } });
    assert.equal(row.finishedAt, null);
    assert.equal(row.revision, 0);
  });

  await t.test('answer revisions reject stale changes and allow identical network retries', async () => {
    const owner = participant();
    const session = await service.startAttempt(owner);
    const savedAnswers = empty();
    savedAnswers[0] = 2;
    const save = await service.saveAnswers(owner, session.attemptId, savedAnswers, 2);
    assert.equal(save.saved, true);
    assert.equal(save.revision, 2);
    assert.equal((await service.saveAnswers(owner, session.attemptId, empty(), 1)).saved, false);
    assert.equal((await service.saveAnswers(owner, session.attemptId, savedAnswers, 2)).saved, true);
    assert.equal((await service.saveAnswers(owner, session.attemptId, empty(), 2)).saved, false);
    await assert.rejects(service.finishAttempt(owner, session.attemptId, empty(), 1), errorStatus(409));
    await assert.rejects(service.finishAttempt(owner, session.attemptId, empty(), 2), errorStatus(409));
    const resumed = await service.getSession(owner);
    assert.deepEqual(resumed?.answers, savedAnswers);
    assert.equal(resumed?.revision, 2);
  });

  await t.test('server grading is immutable across concurrent finishes and later tampering', async () => {
    const owner = participant();
    const session = await service.startAttempt(owner);
    const questions = await paperFor(session.attemptId);
    const answers = answersFor(questions, 30, 16);
    const results = await Promise.all(Array.from({ length: 4 }, () => service.finishAttempt(owner, session.attemptId, answers, 1)));
    for (const result of results) {
      assert.equal(result.correct, 30);
      assert.equal(result.incorrect, 16);
      assert.equal(result.unanswered, 4);
      assert.equal(result.net, 26);
      assert.equal(result.ranked, true);
      assert.ok(result.durationSeconds >= 1 && result.durationSeconds <= 2400);
      assert.equal(result.nickname, null);
      assert.equal(result.rank, null);
    }
    const before = await prisma.challengeAttempt.findUniqueOrThrow({ where: { id: session.attemptId } });
    const tamperedRetry = await service.finishAttempt(owner, session.attemptId, answersFor(questions, 50), 999);
    assert.equal(tamperedRetry.correct, 30);
    assert.equal(tamperedRetry.net, 26);
    const after = await prisma.challengeAttempt.findUniqueOrThrow({ where: { id: session.attemptId } });
    assert.deepEqual(after, before);
    assert.equal(await prisma.challengeEntry.count({ where: { participantHash: owner, day: session.day } }), 1);
    assert.equal((await service.saveAnswers(owner, session.attemptId, empty(), 1000)).saved, false);
  });

  await t.test('first completion reserves ranking before a nickname and practice cannot replace it', async () => {
    const owner = participant();
    const first = await service.startAttempt(owner);
    const firstResult = await service.finishAttempt(owner, first.attemptId, empty(), 1);
    assert.equal(firstResult.ranked, true);
    const reservation = await prisma.challengeEntry.findUniqueOrThrow({ where: { attemptId: first.attemptId } });
    assert.equal(reservation.nickname, null);
    assert.equal((await service.startAttempt(owner)).attemptId, first.attemptId);
    const practice = await service.startAttempt(owner, true);
    assert.notEqual(practice.attemptId, first.attemptId);
    const practiceResult = await service.finishAttempt(owner, practice.attemptId, answersFor(await paperFor(practice.attemptId), 50), 1);
    assert.equal(practiceResult.correct, 50);
    assert.equal(practiceResult.ranked, false);
    await assert.rejects(service.publishNickname(owner, practice.attemptId, `Retry-${runId}`), errorStatus(409));
    const published = await service.publishNickname(owner, first.attemptId, `First-${runId}`);
    assert.equal(published.correct, 0);
    assert.equal(published.nickname, `First-${runId}`);
    assert.ok(published.rank !== null && published.rank >= 1);
    assert.equal(await prisma.challengeEntry.count({ where: { participantHash: owner } }), 1);
    assert.equal((await prisma.challengeEntry.findFirstOrThrow({ where: { participantHash: owner } })).attemptId, first.attemptId);
  });

  await t.test('daily nickname collisions are case-insensitive and failed claims can be retried', async () => {
    const owners = [participant(), participant()];
    const sessions = await Promise.all(owners.map(owner => service.startAttempt(owner)));
    await Promise.all(sessions.map((session, index) => service.finishAttempt(owners[index], session.attemptId, empty(), 1)));
    const nickname = `Case-${runId}`;
    await service.publishNickname(owners[0], sessions[0].attemptId, nickname);
    await assert.rejects(service.publishNickname(owners[1], sessions[1].attemptId, nickname.toUpperCase()), errorStatus(409));
    assert.equal((await prisma.challengeEntry.findUniqueOrThrow({ where: { attemptId: sessions[1].attemptId } })).nickname, null);
    assert.equal((await service.publishNickname(owners[1], sessions[1].attemptId, `Other-${runId}`)).nickname, `Other-${runId}`);
  });

  await t.test('the shared leaderboard sorts net first, then server duration, and counts published participants', async () => {
    const day = await fixtureDay();
    const fixtures = [
      { nickname: `Slow-${runId}`, correct: 1, duration: 100 },
      { nickname: `Fast-${runId}`, correct: 1, duration: 30 },
      { nickname: `High-${runId}`, correct: 2, duration: 900 },
      { nickname: null, correct: 50, duration: 1 },
    ];
    const ownedAttempts: { owner: string; id: string }[] = [];
    for (const fixture of fixtures) {
      const owner = participant();
      const session = await service.startAttempt(owner);
      await prisma.challengeAttempt.update({ where: { id: session.attemptId }, data: { day } });
      await service.finishAttempt(owner, session.attemptId, answersFor(await paperFor(session.attemptId), fixture.correct), 1);
      // A trusted DB fixture supplies exact durations, never a client request.
      await prisma.challengeAttempt.update({ where: { id: session.attemptId }, data: { durationSeconds: fixture.duration } });
      if (fixture.nickname) await service.publishNickname(owner, session.attemptId, fixture.nickname);
      ownedAttempts.push({ owner, id: session.attemptId });
    }
    const leaderboard = await service.getLeaderboard(day);
    assert.equal(leaderboard.participants, 3);
    assert.deepEqual(leaderboard.entries.map(entry => entry.nickname), [`High-${runId}`, `Fast-${runId}`, `Slow-${runId}`]);
    assert.deepEqual(leaderboard.entries.map(entry => entry.rank), [1, 2, 3]);
    assert.deepEqual(leaderboard.entries.map(entry => entry.net), [2, 1, 1]);
    const own = await service.publishNickname(ownedAttempts[1].owner, ownedAttempts[1].id, `Fast-${runId}`);
    assert.equal(own.rank, 2);
    assert.equal(own.participants, 3);
    for (const key of ['participantHash', 'attemptId', 'answers']) assert.equal(JSON.stringify(leaderboard).includes(`"${key}":`), false);
  });

  await t.test('an attempt crossing midnight remains attached to its starting paper and day', async () => {
    const owner = participant();
    const session = await service.startAttempt(owner);
    const day = await fixtureDay();
    const startedAt = new Date(`${day}T20:50:00.000Z`); // 23:50 Istanbul.
    const deadlineAt = new Date(startedAt.getTime() + 2_400_000); // 00:30 next day.
    await prisma.challengeAttempt.update({ where: { id: session.attemptId }, data: { day, startedAt, deadlineAt } });
    const resumed = await service.getSession(owner);
    assert.equal(resumed?.day, day);
    assert.equal(Date.parse(resumed!.deadlineAt) - Date.parse(resumed!.startedAt), 2_400_000);
    const result = await service.finishAttempt(owner, session.attemptId, empty(), 1);
    assert.equal(result.day, day);
    assert.equal(result.durationSeconds, 2400);
    const published = await service.publishNickname(owner, session.attemptId, `Night-${runId}`);
    assert.equal(published.day, day);
    assert.equal((await service.getLeaderboard(day)).participants, 1);
    const entry = await prisma.challengeEntry.findUniqueOrThrow({ where: { attemptId: session.attemptId } });
    assert.equal(entry.day, day);
    assert.equal(await prisma.challengeEntry.count({ where: { participantHash: owner, day: session.day } }), 0);
  });

  await t.test('expiry grades saved answers, ignores late payload changes and caps duration at forty minutes', async () => {
    const owner = participant();
    const session = await service.startAttempt(owner);
    const questions = await paperFor(session.attemptId);
    const saved = answersFor(questions, 10, 5);
    assert.equal((await service.saveAnswers(owner, session.attemptId, saved, 2)).saved, true);
    const startedAt = new Date(Date.now() - 50 * 60_000);
    await prisma.challengeAttempt.update({ where: { id: session.attemptId }, data: { startedAt, deadlineAt: new Date(startedAt.getTime() + 2_400_000) } });
    const late = await service.saveAnswers(owner, session.attemptId, answersFor(questions, 50), 3);
    assert.equal(late.saved, false);
    assert.equal(late.expired, true);
    const result = await service.finishAttempt(owner, session.attemptId, answersFor(questions, 50), 100);
    assert.equal(result.correct, 10);
    assert.equal(result.incorrect, 5);
    assert.equal(result.unanswered, 35);
    assert.equal(result.net, 8.75);
    assert.equal(result.durationSeconds, 2400);
    const stored = await prisma.challengeAttempt.findUniqueOrThrow({ where: { id: session.attemptId } });
    assert.deepEqual(stored.answers, saved);
    assert.equal(stored.revision, 2);
  });

  await t.test('challenge tables enable row security and a general read role cannot access private rows', async st => {
    const tables = await prisma.$queryRaw<{ name: string; enabled: boolean }[]>`
      SELECT relname AS name, relrowsecurity AS enabled FROM pg_class
      WHERE oid IN ('"ChallengeDay"'::regclass, '"ChallengeAttempt"'::regclass, '"ChallengeEntry"'::regclass)
    `;
    assert.equal(tables.length, 3);
    assert.ok(tables.every(table => table.enabled), 'All challenge tables must enable RLS.');
    const [{ privileged }] = await prisma.$queryRaw<{ privileged: boolean }[]>`SELECT rolsuper AS privileged FROM pg_roles WHERE rolname = current_user`;
    if (!privileged) {
      st.diagnostic('RLS flags verified; SET ROLE check requires the local test database administrator.');
      return;
    }
    await prisma.$transaction(async tx => {
      await tx.$executeRawUnsafe('SET LOCAL ROLE pg_read_all_data');
      const [{ days, attempts, entries }] = await tx.$queryRaw<{ days: bigint; attempts: bigint; entries: bigint }[]>`
        SELECT (SELECT count(*) FROM "ChallengeDay") AS days,
          (SELECT count(*) FROM "ChallengeAttempt") AS attempts,
          (SELECT count(*) FROM "ChallengeEntry") AS entries
      `;
      assert.equal(days, 0n);
      assert.equal(attempts, 0n);
      assert.equal(entries, 0n);
    });
  });
});
