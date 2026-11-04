-- Additive, repeatable installation: preserves ContactMessage and all other tables.
-- Run against the same database configured by the production DATABASE_URL.
BEGIN;
CREATE TABLE IF NOT EXISTS "ChallengeDay" (
  "day" VARCHAR(10) PRIMARY KEY,
  "bankVersion" TEXT NOT NULL,
  "questions" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "ChallengeAttempt" (
  "id" TEXT PRIMARY KEY,
  "participantHash" VARCHAR(64) NOT NULL,
  "day" VARCHAR(10) NOT NULL REFERENCES "ChallengeDay"("day") ON DELETE RESTRICT ON UPDATE CASCADE,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deadlineAt" TIMESTAMP(3) NOT NULL,
  "answers" JSONB NOT NULL,
  "revision" INTEGER NOT NULL DEFAULT 0,
  "finishedAt" TIMESTAMP(3),
  "correct" INTEGER,
  "incorrect" INTEGER,
  "unanswered" INTEGER,
  "netQuarter" INTEGER,
  "durationSeconds" INTEGER
);
CREATE INDEX IF NOT EXISTS "ChallengeAttempt_participantHash_startedAt_idx" ON "ChallengeAttempt"("participantHash", "startedAt");
CREATE INDEX IF NOT EXISTS "ChallengeAttempt_day_idx" ON "ChallengeAttempt"("day");
CREATE TABLE IF NOT EXISTS "ChallengeEntry" (
  "id" TEXT PRIMARY KEY,
  "day" VARCHAR(10) NOT NULL,
  "participantHash" VARCHAR(64) NOT NULL,
  "attemptId" TEXT NOT NULL REFERENCES "ChallengeAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "nickname" VARCHAR(40),
  "nicknameKey" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "ChallengeEntry_attemptId_key" ON "ChallengeEntry"("attemptId");
CREATE UNIQUE INDEX IF NOT EXISTS "ChallengeEntry_day_participantHash_key" ON "ChallengeEntry"("day", "participantHash");
CREATE UNIQUE INDEX IF NOT EXISTS "ChallengeEntry_day_nicknameKey_key" ON "ChallengeEntry"("day", "nicknameKey");
-- If hosted on Supabase, the browser's anon/authenticated keys must never read
-- answers or participant identifiers. Prisma uses the private server DB role.
ALTER TABLE "ChallengeDay" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChallengeAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChallengeEntry" ENABLE ROW LEVEL SECURITY;
COMMIT;
