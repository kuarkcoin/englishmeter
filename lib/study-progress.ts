import { STUDY_CHANGED_EVENT } from './quiz-session';

export const STUDY_PROGRESS_KEY = 'em_study_progress_v1';
export type StudyResult = {
  attemptId: string;
  testSlug: string;
  title: string;
  completedAt: number;
  mode: 'exam' | 'practice';
  correct: number;
  answered: number;
  total: number;
};
export type StudyProgress = { version: 1; dailyQuestions: number; weeklyTests: number; results: StudyResult[] };
const DEFAULT: StudyProgress = { version: 1, dailyQuestions: 20, weeklyTests: 5, results: [] };
type BrowserStorage = Pick<Storage, 'getItem' | 'setItem'>;
export function parseStudyProgress(raw: string | null): StudyProgress {
  try {
    const p = JSON.parse(raw || 'null');
    if (p?.version !== 1 || !Array.isArray(p.results)) return { ...DEFAULT, results: [] };
    const results = p.results.filter((r: StudyResult) => r && typeof r.attemptId === 'string' && typeof r.testSlug === 'string' && typeof r.title === 'string' &&
      Number.isFinite(r.completedAt) && ['exam', 'practice'].includes(r.mode) &&
      [r.correct, r.answered, r.total].every(Number.isInteger) && r.correct >= 0 && r.answered >= r.correct && r.total >= r.answered && r.total > 0);
    const unique = Array.from(new Map<string, StudyResult>(results.map((r: StudyResult) => [r.attemptId, r])).values()).sort((a, b) => b.completedAt - a.completedAt).slice(0, 100);
    return { version: 1, dailyQuestions: [10, 20, 30, 50].includes(p.dailyQuestions) ? p.dailyQuestions : 20, weeklyTests: [3, 5, 7, 10].includes(p.weeklyTests) ? p.weeklyTests : 5, results: unique };
  } catch { return { ...DEFAULT, results: [] }; }
}
export function readStudyProgress(storage?: BrowserStorage): StudyProgress {
  try { return parseStudyProgress((storage ?? window.localStorage).getItem(STUDY_PROGRESS_KEY)); }
  catch { return { ...DEFAULT, results: [] }; }
}
export function writeStudyProgress(progress: StudyProgress, storage?: BrowserStorage): boolean {
  try {
    (storage ?? window.localStorage).setItem(STUDY_PROGRESS_KEY, JSON.stringify(progress));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(STUDY_CHANGED_EVENT));
    return true;
  } catch { return false; }
}
export function recordStudyResult(result: StudyResult, storage?: BrowserStorage): boolean {
  const progress = readStudyProgress(storage);
  if (progress.results.some((r) => r.attemptId === result.attemptId)) return true;
  return writeStudyProgress({ ...progress, results: [result, ...progress.results].slice(0, 100) }, storage);
}
export function studyGoalCounts(progress: StudyProgress, now = new Date()) {
  // Goals follow the learner's device calendar, including daylight-saving changes.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week = new Date(today);
  week.setDate(week.getDate() - (week.getDay() + 6) % 7);
  const valid = progress.results.filter((r) => r.completedAt <= now.getTime());
  return {
    todayQuestions: valid.filter((r) => r.completedAt >= today.getTime()).reduce((n, r) => n + r.answered, 0),
    weekTests: valid.filter((r) => r.completedAt >= week.getTime() && r.answered > 0).length,
  };
}
