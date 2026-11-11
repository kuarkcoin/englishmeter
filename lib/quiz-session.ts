/** Browser-only practice snapshots. These are learning aids, never trusted exam records. */
export const QUIZ_SESSIONS_KEY = 'em_quiz_sessions_v1';
export const STUDY_CHANGED_EVENT = 'em-study-changed';
const MAX_SAVED_ATTEMPTS = 8;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type SavedQuestion = {
  id: string;
  prompt: string;
  level?: string;
  choices: { id: string; text: string; isCorrect?: boolean }[];
  explanation?: string;
  s?: string | null;
  t?: string | null;
  correctChoiceId?: string;
  correct?: string;
  correct_option?: string;
  answer?: string;
};
export type QuizPayload = {
  attemptId: string;
  testSlug?: string;
  test: { title: string; duration?: number };
  questions: SavedQuestion[];
  error?: string;
};
export type QuizSnapshot = {
  version: 1;
  revision: number;
  payload: QuizPayload;
  status: 'active' | 'completed';
  startedAt: number;
  updatedAt: number;
  mode: 'exam' | 'practice';
  deadline: number | null;
  remainingMs: number;
  answers: Record<string, string>;
  locked: Record<string, boolean>;
  choiceOrder: Record<string, string[]>;
  activeIndex: number;
};
type BrowserStorage = Pick<Storage, 'getItem' | 'setItem'>;
function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function validId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 200 && !['__proto__', 'prototype', 'constructor'].includes(value);
}
export function isQuizPayload(value: unknown): value is QuizPayload {
  if (!object(value) || !validId(value.attemptId) || !/^[a-zA-Z0-9_-]+$/.test(value.attemptId) ||
      !object(value.test) || typeof value.test.title !== 'string' ||
      (value.test.duration !== undefined && (typeof value.test.duration !== 'number' || !Number.isFinite(value.test.duration))) || !Array.isArray(value.questions) ||
      !value.questions.length || value.questions.length > 500 ||
      (value.testSlug !== undefined && typeof value.testSlug !== 'string') ||
      (value.error !== undefined && typeof value.error !== 'string')) return false;
  const ids = new Set<string>();
  return value.questions.every((q) => {
    if (!object(q) || !validId(q.id) || ids.has(q.id) || typeof q.prompt !== 'string' || !Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 10) return false;
    if (['level', 'explanation', 'correctChoiceId', 'correct', 'correct_option', 'answer'].some((key) => q[key] !== undefined && typeof q[key] !== 'string')) return false;
    if (['s', 't'].some((key) => q[key] != null && typeof q[key] !== 'string')) return false;
    ids.add(q.id);
    const choiceIds = new Set<string>();
    return q.choices.every((c) => {
      if (!object(c) || !validId(c.id) || choiceIds.has(c.id) || typeof c.text !== 'string' || (c.isCorrect !== undefined && typeof c.isCorrect !== 'boolean')) return false;
      choiceIds.add(c.id);
      return true;
    });
  });
}
export function quizDurationMs(payload: QuizPayload): number {
  const minutes = payload.test.duration;
  return typeof minutes === 'number' && Number.isFinite(minutes) && minutes > 0
    ? Math.max(1, Math.round(minutes * 60)) * 1000
    : payload.questions.length * 30 * 1000;
}
export function snapshotRemainingMs(snapshot: QuizSnapshot, now = Date.now()): number {
  return snapshot.mode === 'exam' && snapshot.status === 'active' && snapshot.deadline !== null
    ? Math.max(0, Math.min(snapshot.remainingMs, snapshot.deadline - now))
    : snapshot.remainingMs;
}
/** Avoid writes on restored mounts; otherwise two open tabs can trigger reload loops. */
export function applyQuizSnapshotPatch(snapshot: QuizSnapshot, patch: Partial<QuizSnapshot>, now = Date.now()): QuizSnapshot {
  const unchanged = (Object.entries(patch) as [keyof QuizSnapshot, unknown][])
    .every(([key, value]) => JSON.stringify(snapshot[key]) === JSON.stringify(value));
  return unchanged ? snapshot : { ...snapshot, ...patch, revision: snapshot.revision + 1, updatedAt: now };
}
export function parseQuizSnapshot(value: unknown, now = Date.now()): QuizSnapshot | null {
  if (!object(value) || value.version !== 1 || !isQuizPayload(value.payload) ||
      !['active', 'completed'].includes(String(value.status)) || !['exam', 'practice'].includes(String(value.mode)) ||
      typeof value.startedAt !== 'number' || !Number.isFinite(value.startedAt) ||
      typeof value.updatedAt !== 'number' || !Number.isFinite(value.updatedAt) ||
      value.startedAt > value.updatedAt || value.updatedAt > now + 60000 || now - value.updatedAt > MAX_AGE_MS ||
      typeof value.remainingMs !== 'number' || !Number.isFinite(value.remainingMs) || value.remainingMs < 0 || value.remainingMs > quizDurationMs(value.payload) ||
      (value.deadline !== null && (typeof value.deadline !== 'number' || !Number.isFinite(value.deadline))) ||
      (value.mode === 'exam' && value.status === 'active' && value.deadline === null) ||
      ((value.mode === 'practice' || value.status === 'completed') && value.deadline !== null) ||
      (value.payload.testSlug === 'quick-placement' && value.mode !== 'exam') ||
      !object(value.answers) || !object(value.choiceOrder)) return null;
  const answers: Record<string, string> = {};
  const locked: Record<string, boolean> = {};
  const choiceOrder: Record<string, string[]> = {};
  for (const q of value.payload.questions) {
    const choiceIds = q.choices.map((c) => c.id);
    const answer = value.answers[q.id];
    if (typeof answer === 'string' && choiceIds.includes(answer)) answers[q.id] = answer;
    if (answers[q.id] && object(value.locked) && value.locked[q.id] === true) locked[q.id] = true;
    const order = value.choiceOrder[q.id];
    choiceOrder[q.id] = Array.isArray(order) && order.length === choiceIds.length && new Set(order).size === choiceIds.length && order.every((id) => choiceIds.includes(id))
      ? order : choiceIds;
  }
  const activeIndex = typeof value.activeIndex === 'number' && Number.isInteger(value.activeIndex)
    ? Math.max(0, Math.min(value.activeIndex, value.payload.questions.length - 1)) : 0;
  const revision = typeof value.revision === 'number' && Number.isSafeInteger(value.revision) && value.revision >= 0 ? value.revision : 0;
  return { ...value, revision, answers, locked, choiceOrder, activeIndex } as QuizSnapshot;
}
export function readQuizSnapshots(storage?: BrowserStorage, now = Date.now()): QuizSnapshot[] {
  try {
    const target = storage ?? window.localStorage;
    const parsed: unknown = JSON.parse(target.getItem(QUIZ_SESSIONS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.map((s) => parseQuizSnapshot(s, now)).filter((s): s is QuizSnapshot => !!s).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_SAVED_ATTEMPTS) : [];
  } catch { return []; }
}
export function writeQuizSnapshot(snapshot: QuizSnapshot, storage?: BrowserStorage, now = Date.now()): boolean {
  try {
    const target = storage ?? window.localStorage;
    const saved = readQuizSnapshots(target, now);
    const previous = saved.find((s) => s.payload.attemptId === snapshot.payload.attemptId);
    if (previous) {
      if (JSON.stringify(previous) === JSON.stringify(snapshot)) return true;
      // A stale tab must not resurrect a completed test or replace newer answers.
      if (previous.status === 'completed' || previous.revision >= snapshot.revision) return false;
    }
    const existing = saved.filter((s) => s.payload.attemptId !== snapshot.payload.attemptId);
    target.setItem(QUIZ_SESSIONS_KEY, JSON.stringify([snapshot, ...existing].slice(0, MAX_SAVED_ATTEMPTS)));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(STUDY_CHANGED_EVENT));
    return true;
  } catch { return false; }
}
