'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readQuizSnapshots, snapshotRemainingMs, STUDY_CHANGED_EVENT, type QuizSnapshot } from '@/lib/quiz-session';
import { readStudyProgress, studyGoalCounts, writeStudyProgress, type StudyProgress as Progress } from '@/lib/study-progress';

export default function StudyProgress({ expanded = false }: { expanded?: boolean }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [attempts, setAttempts] = useState<QuizSnapshot[]>([]);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const refresh = () => {
      setProgress(readStudyProgress());
      setAttempts(readQuizSnapshots().filter((s) => s.status === 'active'));
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(STUDY_CHANGED_EVENT, refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(STUDY_CHANGED_EVENT, refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  const counts = progress ? studyGoalCounts(progress) : null;
  const changeGoal = (key: 'dailyQuestions' | 'weeklyTests', value: string) => {
    if (!progress) return;
    const next = { ...readStudyProgress(), [key]: Number(value) };
    setProgress(next);
    setStorageError(!writeStudyProgress(next));
  };
  return (
    <section className="em-card rounded-2xl border border-blue-100 p-5 dark:border-slate-700" aria-label="Your study progress">
      <details open={expanded || undefined}>
        <summary className="cursor-pointer text-lg font-bold text-slate-900 dark:text-slate-100">Your study progress &amp; saved tests</summary>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Saved on this browser only. Exam timers continue while you are away; practice mode pauses the clock. Keep up to 8 recent attempts and 100 results. No account is needed.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="rounded-xl bg-blue-50 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            <span className="block font-bold">Daily question goal</span>
            <select className="mt-2 rounded-lg border border-slate-300 bg-white p-2 text-slate-900" aria-label="Daily question goal" value={progress?.dailyQuestions ?? 20} disabled={!progress} onChange={(e) => changeGoal('dailyQuestions', e.target.value)}>
              {[10, 20, 30, 50].map((n) => <option key={n} value={n}>{n} questions</option>)}
            </select>
            <span className="mt-2 block">{counts ? `${counts.todayQuestions} answered in completed tests today` : 'Loading local progress…'}</span>
          </label>
          <label className="rounded-xl bg-blue-50 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            <span className="block font-bold">Weekly test goal</span>
            <select className="mt-2 rounded-lg border border-slate-300 bg-white p-2 text-slate-900" aria-label="Weekly test goal" value={progress?.weeklyTests ?? 5} disabled={!progress} onChange={(e) => changeGoal('weeklyTests', e.target.value)}>
              {[3, 5, 7, 10].map((n) => <option key={n} value={n}>{n} tests</option>)}
            </select>
            <span className="mt-2 block">{counts ? `${counts.weekTests} tests completed since Monday` : 'Loading local progress…'}</span>
          </label>
        </div>
        {counts && progress && (counts.todayQuestions >= progress.dailyQuestions || counts.weekTests >= progress.weeklyTests) && <p className="mt-3 font-semibold text-emerald-700 dark:text-emerald-300">{counts.todayQuestions >= progress.dailyQuestions ? 'Daily goal reached! ' : ''}{counts.weekTests >= progress.weeklyTests ? 'Weekly goal reached!' : ''}</p>}
        {storageError && <p className="mt-3 text-sm text-amber-800 dark:text-amber-300" role="status">Browser storage is unavailable. Your goal changes will not be saved.</p>}
        {attempts.length > 0 && <div className="mt-5 space-y-2"><h3 className="font-bold">Continue a saved test</h3>{attempts.map((s) => <Link prefetch={false} key={s.payload.attemptId} href={`/quiz/${encodeURIComponent(s.payload.attemptId)}`} className="block rounded-xl border border-slate-200 p-3 text-blue-700 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-300 dark:hover:bg-slate-800"><span className="font-semibold">{s.payload.test.title}</span><span className="mt-1 block text-sm">{Object.keys(s.answers).length}/{s.payload.questions.length} answered · {s.mode === 'practice' ? 'Practice' : snapshotRemainingMs(s) === 0 ? 'Time ended — view result' : 'Exam — timer is running'}</span></Link>)}</div>}
        {!!progress?.results.length && <div className="mt-5"><h3 className="font-bold">Recent results</h3><ul className="mt-2 space-y-2">{progress.results.slice(0, 5).map((r) => <li key={r.attemptId} className="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800"><span>{r.title} <span className="text-slate-500 dark:text-slate-400">({r.mode})</span></span><strong>{r.correct}/{r.total} · {Math.round(r.correct / r.total * 100)}%</strong></li>)}</ul></div>}
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Goals use your device’s calendar. Clearing browser data removes local progress. Daily Challenge rankings are separate.</p>
      </details>
    </section>
  );
}
