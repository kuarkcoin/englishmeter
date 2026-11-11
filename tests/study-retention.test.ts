import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyQuizSnapshotPatch, isQuizPayload, parseQuizSnapshot, quizDurationMs, readQuizSnapshots, snapshotRemainingMs, writeQuizSnapshot, type QuizPayload, type QuizSnapshot } from '../lib/quiz-session';
import { parseStudyProgress, readStudyProgress, recordStudyResult, studyGoalCounts, type StudyResult } from '../lib/study-progress';
import { getStudyRecommendations } from '../lib/study-recommendations';

const now = new Date(2026, 10, 11, 12).getTime();
const payload: QuizPayload = { attemptId: 'test-attempt-1', testSlug: 'topic-b1-present-perfect', test: { title: 'Present perfect', duration: 20 }, questions: [{ id: 'q1', level: 'B1', prompt: 'Choose an answer', choices: [{ id: 'a', text: 'One', isCorrect: true }, { id: 'b', text: 'Two', isCorrect: false }], explanation: 'One is correct.' }] };
function snapshot(): QuizSnapshot { return { version: 1, revision: 0, payload, status: 'active', startedAt: now, updatedAt: now, mode: 'exam', deadline: now + 1200000, remainingMs: 1200000, answers: { q1: 'a' }, locked: {}, choiceOrder: { q1: ['b', 'a'] }, activeIndex: 0 }; }
function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}
test('reload preserves answers and choice order and cannot restart an exam deadline', () => {
  const storage = memoryStorage();
  assert.equal(writeQuizSnapshot(snapshot(), storage, now), true);
  const saved = readQuizSnapshots(storage, now + 300000)[0];
  assert.deepEqual(saved.answers, { q1: 'a' });
  assert.deepEqual(saved.choiceOrder, { q1: ['b', 'a'] });
  assert.equal(snapshotRemainingMs(saved, now + 300000), 900000);
  assert.equal(snapshotRemainingMs(saved, now + 1500000), 0);
  assert.equal(saved.deadline, snapshot().deadline);
});
test('practice snapshots preserve paused milliseconds while completed attempts never resume', () => {
  const saved = { ...snapshot(), mode: 'practice' as const, deadline: null, remainingMs: 900000 };
  assert.equal(snapshotRemainingMs(saved, now + 3 * 86400000), 900000);
  const result = parseQuizSnapshot({ ...saved, status: 'completed' }, now);
  assert.equal(result?.status, 'completed');
  assert.equal(parseQuizSnapshot({ ...saved, payload: { ...payload, testSlug: 'quick-placement' } }, now), null);
  assert.deepEqual(parseQuizSnapshot({ ...saved, locked: {} }, now)?.locked, {});
  assert.deepEqual(parseQuizSnapshot({ ...saved, locked: { q1: true, invalid: true } }, now)?.locked, { q1: true });
});
test('restoring an older attempt preserves newer attempts and stale tabs cannot overwrite completed results', () => {
  const storage = memoryStorage();
  const older = snapshot();
  const newer = { ...snapshot(), startedAt: now + 120000, updatedAt: now + 120000, payload: { ...payload, attemptId: 'newer' } };
  writeQuizSnapshot(older, storage, now);
  writeQuizSnapshot(newer, storage, now + 120000);
  writeQuizSnapshot(older, storage, now + 180000);
  assert.equal(readQuizSnapshots(storage, now + 180000).length, 2);
  const completed = { ...older, revision: 1, status: 'completed' as const, deadline: null, updatedAt: now + 180000 };
  assert.equal(writeQuizSnapshot(completed, storage, now + 180000), true);
  assert.equal(writeQuizSnapshot({ ...older, revision: 2, updatedAt: now + 180001 }, storage, now + 180001), false);
  assert.equal(readQuizSnapshots(storage, now + 180001).find((s) => s.payload.attemptId === older.payload.attemptId)?.status, 'completed');
  assert.equal(writeQuizSnapshot({ ...newer, revision: 1, answers: { q1: 'b' }, updatedAt: now + 190000 }, storage, now + 190000), true);
  assert.equal(writeQuizSnapshot({ ...newer, revision: 1, answers: { q1: 'a' }, updatedAt: now + 190001 }, storage, now + 190001), false);
});
test('restored mounts do not create revisions or writes that bounce between open tabs', () => {
  const saved = snapshot();
  const unchanged = applyQuizSnapshotPatch(saved, { activeIndex: 0, answers: { q1: 'a' }, locked: {} }, now + 1000);
  assert.equal(unchanged, saved);
  assert.equal(unchanged.revision, 0);
  const changed = applyQuizSnapshotPatch(saved, { answers: { q1: 'b' } }, now + 2000);
  assert.equal(changed.revision, 1);
  assert.equal(changed.updatedAt, now + 2000);
  assert.equal(saved.answers.q1, 'a');
});
test('malformed snapshots cannot inject unknown answers, duplicate choices or invalid navigation', () => {
  const saved = parseQuizSnapshot({ ...snapshot(), answers: { q1: 'not-a-choice', extra: 'a' }, choiceOrder: { q1: ['a', 'a'] }, activeIndex: 999 }, now)!;
  assert.deepEqual(saved.answers, {});
  assert.deepEqual(saved.choiceOrder, { q1: ['a', 'b'] });
  assert.equal(saved.activeIndex, 0);
  for (const patch of [{ version: 2 }, { remainingMs: -1 }, { remainingMs: Infinity }, { deadline: null }, { status: 'unknown' }, { updatedAt: now - 31 * 86400000 }, { startedAt: now + 1 }]) assert.equal(parseQuizSnapshot({ ...snapshot(), ...patch }, now), null);
  assert.equal(isQuizPayload({ ...payload, attemptId: '../../other' }), false);
  assert.equal(isQuizPayload({ ...payload, error: { bad: true } }), false);
  assert.equal(isQuizPayload({ ...payload, questions: [{ ...payload.questions[0], choices: payload.questions[0].choices.map((c) => ({ ...c, isCorrect: 'false' })) }] }), false);
  assert.equal(isQuizPayload({ ...payload, questions: [payload.questions[0], payload.questions[0]] }), false);
  assert.equal(isQuizPayload({ ...payload, questions: [{ ...payload.questions[0], explanation: { bad: true } }] }), false);
});
test('snapshot storage is bounded, isolates attempts and handles unavailable storage', () => {
  const storage = memoryStorage();
  for (let i = 0; i < 12; i++) writeQuizSnapshot({ ...snapshot(), updatedAt: now + i, payload: { ...payload, attemptId: `attempt-${i}` } }, storage, now + i);
  const saved = readQuizSnapshots(storage, now + 20);
  assert.equal(saved.length, 8);
  assert.equal(saved[0].payload.attemptId, 'attempt-11');
  const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Full'); } };
  assert.deepEqual(readQuizSnapshots(blocked, now), []);
  assert.equal(writeQuizSnapshot(snapshot(), blocked), false);
  assert.equal(quizDurationMs({ ...payload, test: { title: 'Untimed duration fallback' } }), 30000);
});
test('completion progress deduplicates attempt IDs and keeps scored and unanswered counts separate', () => {
  const storage = memoryStorage();
  const result: StudyResult = { attemptId: 'one', testSlug: 'topic-b1-present-perfect', title: 'Present perfect', completedAt: now, mode: 'exam', correct: 12, answered: 15, total: 20 };
  recordStudyResult(result, storage);
  recordStudyResult(result, storage);
  assert.equal(readStudyProgress(storage).results.length, 1);
  assert.deepEqual(studyGoalCounts(readStudyProgress(storage), new Date(now)), { todayQuestions: 15, weekTests: 1 });
});
test('goals use local calendar dates, Monday weeks, answered questions and no future results', () => {
  const base: StudyResult = { attemptId: 'a', testSlug: 'practice', title: 'Practice', completedAt: now, mode: 'practice', correct: 0, answered: 0, total: 20 };
  const progress = parseStudyProgress(JSON.stringify({ version: 1, dailyQuestions: 30, weeklyTests: 7, results: [base, { ...base, attemptId: 'b', completedAt: new Date(2026, 10, 9, 8).getTime(), answered: 10 }, { ...base, attemptId: 'c', completedAt: new Date(2026, 10, 8, 23).getTime(), answered: 20 }, { ...base, attemptId: 'd', completedAt: now + 60000, answered: 20 }] }));
  assert.deepEqual(studyGoalCounts(progress, new Date(now)), { todayQuestions: 0, weekTests: 1 });
  assert.equal(progress.dailyQuestions, 30);
  assert.equal(progress.weeklyTests, 7);
  assert.deepEqual(parseStudyProgress('{invalid').results, []);
});
test('recommendations use existing related topic URLs without assigning a certified level', () => {
  const result = getStudyRecommendations({ testSlug: payload.testSlug, levels: ['B1'], percentage: 50, answered: 20, total: 20 });
  assert.match(result.guidance, /Review the explanations/);
  assert.ok(result.links.some((link) => link.href.startsWith('/levels/b1/')));
  assert.ok(result.links.every((link) => link.href !== '/levels/b1/present-perfect'));
  const mixed = getStudyRecommendations({ testSlug: 'quick-placement', levels: ['A1', 'C2'], percentage: 100, answered: 30, total: 30 });
  assert.ok(!mixed.guidance.includes('C2'));
});
