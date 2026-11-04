'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChallengeLeaderboard, ChallengeResult, ChallengeSession } from '@/lib/challenge/types';

class ChallengeRequestError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(path, {
      method, credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
      ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new ChallengeRequestError(typeof data?.error === 'string' ? data.error : 'The challenge could not be loaded. Please try again.', response.status);
    return data as T;
  } catch (error) {
    if (error instanceof ChallengeRequestError) throw error;
    throw new ChallengeRequestError('We could not reach the challenge. Check your connection and try again.', 0);
  } finally { window.clearTimeout(timeout); }
}

const button = 'rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white transition hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButton = 'rounded-xl border border-slate-300 px-4 py-3 font-semibold transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800';
const backupKey = (id: string) => `englishmeter-challenge:${id}`;
const formatTime = (seconds: number) => `${Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0')}:${(Math.max(0, seconds) % 60).toString().padStart(2, '0')}`;
const dayInIstanbul = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
function clearBackup(id: string) { try { localStorage.removeItem(backupKey(id)); } catch { /* Storage can be disabled. Server saves still work. */ } }

export default function ChallengeClient() {
  const [session, setSession] = useState<ChallengeSession | null>(null);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(2400);
  const [initializing, setInitializing] = useState(true);
  const [busy, setBusy] = useState<'start' | 'finish' | 'nickname' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'saved' | 'pending' | 'saving' | 'failed' | 'expired'>('saved');
  const [syncConflict, setSyncConflict] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [nickname, setNickname] = useState('');
  const [board, setBoard] = useState<ChallengeLeaderboard | null>(null);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [boardLoading, setBoardLoading] = useState(false);

  const sessionRef = useRef<ChallengeSession | null>(null);
  const resultRef = useRef<ChallengeResult | null>(null);
  const answersRef = useRef<(number | null)[]>([]);
  const revisionRef = useRef(0);
  const savedRevisionRef = useRef(0);
  const serverOffsetRef = useRef(0);
  const busyRef = useRef(false);
  const conflictRef = useRef(false);
  const saveFlightRef = useRef<Promise<boolean> | null>(null);
  const autoFinishedRef = useRef<string | null>(null);
  const boardRequestRef = useRef(0);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const playHeadingRef = useRef<HTMLHeadingElement>(null);

  const loadBoard = useCallback(async (day?: string) => {
    const requestId = ++boardRequestRef.current;
    setBoardLoading(true);
    setBoardError(null);
    try {
      const value = await request<ChallengeLeaderboard>(`/api/challenge/leaderboard${day ? `?day=${encodeURIComponent(day)}` : ''}`);
      if (boardRequestRef.current === requestId) setBoard(value);
    } catch (err) { if (boardRequestRef.current === requestId) setBoardError(err instanceof Error ? err.message : 'The leaderboard is temporarily unavailable.'); }
    finally { if (boardRequestRef.current === requestId) setBoardLoading(false); }
  }, []);

  const installSession = useCallback((value: ChallengeSession | null, restoreBackup = true) => {
    sessionRef.current = value;
    resultRef.current = value?.result ?? null;
    conflictRef.current = false;
    setSyncConflict(false);
    setSession(value);
    setResult(value?.result ?? null);
    setNickname(value?.result?.nickname ?? '');
    setConfirmFinish(false);
    setIndex(0);
    let nextAnswers = value?.answers ?? [];
    let nextRevision = value?.revision ?? 0;
    savedRevisionRef.current = nextRevision;
    if (value) {
      serverOffsetRef.current = Date.parse(value.serverNow) - Date.now();
      setRemaining(Math.max(0, Math.ceil((Date.parse(value.deadlineAt) - Date.parse(value.serverNow)) / 1000)));
      if (value.result) clearBackup(value.attemptId);
      else if (restoreBackup && Date.parse(value.deadlineAt) > Date.parse(value.serverNow)) {
        try {
          const pending = JSON.parse(localStorage.getItem(backupKey(value.attemptId)) ?? 'null');
          if (pending && Number.isSafeInteger(pending.revision) && pending.revision > nextRevision && Array.isArray(pending.answers) && pending.answers.length === value.questions.length && pending.answers.every((answer: unknown) => answer === null || (typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer < 5))) {
            nextAnswers = pending.answers;
            nextRevision = pending.revision;
          }
        } catch { /* A missing or invalid backup does not prevent resuming. */ }
      }
    }
    answersRef.current = nextAnswers;
    revisionRef.current = nextRevision;
    setAnswers(nextAnswers);
    setSaveState(nextRevision > savedRevisionRef.current ? 'pending' : 'saved');
  }, []);

  const restore = useCallback(async (restoreBackup = true) => {
    setInitializing(true);
    setError(null);
    try { installSession(await request<ChallengeSession | null>('/api/challenge'), restoreBackup); }
    catch (err) { setError(err instanceof Error ? err.message : 'The challenge is temporarily unavailable.'); }
    finally { setInitializing(false); }
  }, [installSession]);

  useEffect(() => { void restore(); void loadBoard(); }, [restore, loadBoard]);
  useEffect(() => {
    const day = result?.day ?? session?.day;
    if (day) void loadBoard(day);
  }, [result?.day, session?.day, loadBoard]);

  useEffect(() => {
    if (!session || initializing) return;
    const heading = result ? playHeadingRef.current : questionHeadingRef.current;
    heading?.focus();
  }, [session?.attemptId, result?.attemptId, initializing]);

  const saveNow = useCallback(async (): Promise<boolean> => {
    if (saveFlightRef.current) return saveFlightRef.current;
    const work = async () => {
      while (revisionRef.current > savedRevisionRef.current) {
        const active = sessionRef.current;
        if (!active || resultRef.current || conflictRef.current) return false;
        if (Date.now() + serverOffsetRef.current >= Date.parse(active.deadlineAt)) { setSaveState('expired'); return false; }
        const revision = revisionRef.current;
        const snapshot = [...answersRef.current];
        setSaveState('saving');
        try {
          const response = await request<{ saved: boolean; revision: number; serverNow: string; expired?: boolean }>('/api/challenge/attempt', 'PUT', { attemptId: active.attemptId, answers: snapshot, revision });
          if (sessionRef.current?.attemptId !== active.attemptId || resultRef.current) return true;
          serverOffsetRef.current = Date.parse(response.serverNow) - Date.now();
          if (!response.saved) {
            if (response.expired) { setSaveState('expired'); setRemaining(0); return false; }
            conflictRef.current = true;
            setSyncConflict(true);
            setError('This attempt has changed in another tab. Reload your saved attempt before continuing.');
            return false;
          }
          savedRevisionRef.current = Math.max(savedRevisionRef.current, revision);
          if (revisionRef.current === revision) clearBackup(active.attemptId);
          setError(null);
        } catch (err) {
          setSaveState('failed');
          setError(err instanceof Error ? err.message : 'Your latest answers have not saved yet. Please retry.');
          return false;
        }
      }
      setSaveState('saved');
      return true;
    };
    const flight = work();
    saveFlightRef.current = flight;
    try { return await flight; }
    finally { if (saveFlightRef.current === flight) saveFlightRef.current = null; }
  }, []);

  useEffect(() => {
    if (!session || result || syncConflict || revisionRef.current <= savedRevisionRef.current) return;
    const timeout = window.setTimeout(() => { void saveNow(); }, 300);
    return () => window.clearTimeout(timeout);
  }, [answers, session?.attemptId, result, syncConflict, saveNow]);

  useEffect(() => {
    const onOnline = () => { if (!resultRef.current) void saveNow(); };
    const warnPending = (event: BeforeUnloadEvent) => {
      if (sessionRef.current && !resultRef.current && revisionRef.current > savedRevisionRef.current) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('beforeunload', warnPending);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('beforeunload', warnPending); };
  }, [saveNow]);

  const finish = useCallback(async () => {
    const active = sessionRef.current;
    if (!active || resultRef.current || busyRef.current || conflictRef.current) return;
    busyRef.current = true;
    setBusy('finish');
    setError(null);
    try {
      if (saveFlightRef.current) await saveFlightRef.current;
      if (conflictRef.current) return;
      const value = await request<ChallengeResult>('/api/challenge/finish', 'POST', { attemptId: active.attemptId, answers: answersRef.current, revision: revisionRef.current });
      resultRef.current = value;
      setResult(value);
      setNickname(value.nickname ?? '');
      setConfirmFinish(false);
      clearBackup(active.attemptId);
      setError(null);
    } catch (err) {
      if (err instanceof ChallengeRequestError && err.status === 409) { conflictRef.current = true; setSyncConflict(true); }
      setError(err instanceof Error ? err.message : 'We could not finish your attempt. Please retry.');
    } finally { busyRef.current = false; setBusy(null); }
  }, []);

  useEffect(() => {
    if (!session || result) return;
    const tick = () => setRemaining(Math.max(0, Math.ceil((Date.parse(session.deadlineAt) - Date.now() - serverOffsetRef.current) / 1000)));
    tick();
    const timer = window.setInterval(tick, 500);
    return () => window.clearInterval(timer);
  }, [session?.attemptId, result]);

  useEffect(() => {
    if (!session || result || remaining > 0 || syncConflict || autoFinishedRef.current === session.attemptId || Date.now() + serverOffsetRef.current < Date.parse(session.deadlineAt)) return;
    autoFinishedRef.current = session.attemptId;
    void finish();
  }, [session, result, remaining, syncConflict, finish]);

  async function start(practice = false) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy('start');
    setError(null);
    try { installSession(await request<ChallengeSession>('/api/challenge/start', 'POST', { practice })); }
    catch (err) { setError(err instanceof Error ? err.message : 'We could not start your challenge. Please try again.'); }
    finally { busyRef.current = false; setBusy(null); }
  }

  function choose(option: number | null) {
    if (!session || result || busy || syncConflict || remaining <= 0) return;
    const next = [...answersRef.current];
    next[index] = option;
    const revision = revisionRef.current + 1;
    answersRef.current = next;
    revisionRef.current = revision;
    setAnswers(next);
    setSaveState('pending');
    setConfirmFinish(false);
    try { localStorage.setItem(backupKey(session.attemptId), JSON.stringify({ answers: next, revision })); } catch { /* Server saving remains available when local storage is disabled. */ }
  }

  function navigate(next: number) {
    setIndex(next);
    setConfirmFinish(false);
    window.setTimeout(() => questionHeadingRef.current?.focus(), 0);
  }

  async function publishNickname(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result || busyRef.current) return;
    busyRef.current = true;
    setBusy('nickname');
    setError(null);
    try {
      const value = await request<ChallengeResult>('/api/challenge/nickname', 'POST', { attemptId: result.attemptId, nickname: nickname.trim() });
      resultRef.current = value;
      setResult(value);
      setNickname(value.nickname ?? '');
      void loadBoard(value.day);
    } catch (err) { setError(err instanceof Error ? err.message : 'We could not publish your score. Please try again.'); }
    finally { busyRef.current = false; setBusy(null); }
  }

  async function refreshRanking() {
    await loadBoard(result?.day);
    if (!result) return;
    try {
      const current = await request<ChallengeSession | null>('/api/challenge');
      if (current?.result?.attemptId === result.attemptId) { resultRef.current = current.result; setResult(current.result); }
    } catch { /* The leaderboard refresh already reports connection failures. */ }
  }

  const answered = answers.filter((answer) => answer !== null).length;
  const question = session?.questions[index];
  const editingDisabled = busy !== null || remaining <= 0 || syncConflict;
  const saveLabels = { saved: 'All answers saved', pending: 'Unsaved changes', saving: 'Saving answers…', failed: 'Some answers have not saved', expired: 'Time is up' };

  return (
    <div className="mt-6 space-y-6">
      <section aria-labelledby="challenge-play-heading" className="em-card rounded-2xl border border-[rgb(var(--border))] p-4 sm:p-6">
        <h2 id="challenge-play-heading" ref={playHeadingRef} tabIndex={-1} className="text-2xl font-bold outline-none">{result ? 'Your challenge result' : session ? 'Your daily challenge' : 'Ready for today’s 50?'}</h2>
        {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"><p>{error}</p>{syncConflict && <button type="button" className={`${secondaryButton} mt-3`} disabled={initializing || busy !== null} onClick={() => { if (session) clearBackup(session.attemptId); void restore(false); }}>Reload saved attempt</button>}</div>}
        {initializing ? <p role="status" className="mt-5 text-slate-600 dark:text-slate-300">Loading your challenge…</p> : !session && (
          <div className="mt-4">
            <p className="text-slate-600 dark:text-slate-300">The timer starts when you press the button. You can move between questions and leave answers blank.</p>
            <button type="button" className={`${button} mt-5 w-full sm:w-auto`} disabled={busy !== null} onClick={() => { void start(); }}>{busy === 'start' ? 'Starting…' : 'Start today’s challenge'}</button>
          </div>
        )}

        {!initializing && session && !result && question && (
          <div className="mt-5">
            <div className="sticky top-2 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-indigo-50 p-4 text-indigo-950 shadow-sm dark:bg-indigo-950 dark:text-indigo-100">
              <div><p className="text-sm font-semibold">Challenge day: <time dateTime={session.day}>{session.day}</time></p><p className="mt-1 text-xs">Europe/Istanbul · {answered}/{session.questions.length} answered</p></div>
              <div className={remaining <= 120 ? 'font-bold text-red-700 dark:text-red-300' : 'font-bold'}><span className="block text-xs">Time remaining</span><span role="timer" aria-label={`${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining`} className="font-mono text-3xl tabular-nums">{formatTime(remaining)}</span></div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p role="status" className={saveState === 'failed' || saveState === 'pending' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'}>{saveLabels[saveState]}</p>
              {saveState === 'failed' && remaining > 0 && <button type="button" onClick={() => { void saveNow(); }} disabled={busy !== null || syncConflict} className="font-semibold text-blue-700 underline dark:text-blue-300">Retry saving</button>}
            </div>
            {remaining === 0 && <p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900 dark:bg-amber-950 dark:text-amber-200">Time is up. Your last saved answers will be scored.{busy !== 'finish' && <button type="button" className={`${button} mt-3 block`} onClick={() => { void finish(); }} disabled={syncConflict || busy !== null}>Get my result</button>}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300"><span>{question.category}</span><span aria-hidden="true">·</span><span>{question.level}</span></div>
            <h3 ref={questionHeadingRef} tabIndex={-1} className="mt-2 scroll-mt-32 text-xl font-bold outline-none">Question {index + 1} of {session.questions.length}</h3>
            {question.passage && <article aria-labelledby={`passage-${question.passage.id}`} className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5"><h4 id={`passage-${question.passage.id}`} className="font-bold">{question.passage.title}</h4><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">{question.passage.text}</p></article>}
            <fieldset disabled={editingDisabled} className="mt-5 min-w-0">
              <legend className="mb-4 w-full whitespace-pre-line text-lg font-semibold leading-relaxed">{question.prompt}</legend>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`} className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${answers[index] === optionIndex ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950' : 'border-slate-200 hover:border-indigo-300 dark:border-slate-700'} ${editingDisabled ? 'cursor-not-allowed opacity-70' : ''}`}><input type="radio" name={`question-${question.id}`} checked={answers[index] === optionIndex} onChange={() => choose(optionIndex)} className="mt-1 h-4 w-4 shrink-0 accent-indigo-700" /><span className="min-w-0 break-words"><strong className="mr-2">{String.fromCharCode(65 + optionIndex)}.</strong>{option}</span></label>)}
              </div>
              <button type="button" className="mt-3 py-2 text-sm font-semibold text-slate-600 underline disabled:opacity-40 dark:text-slate-300" disabled={editingDisabled || answers[index] === null} onClick={() => choose(null)}>Clear answer</button>
            </fieldset>
            <div className="mt-5 flex justify-between gap-3"><button type="button" className={secondaryButton} disabled={index === 0} onClick={() => navigate(index - 1)}>← Previous</button><button type="button" className={secondaryButton} disabled={index === session.questions.length - 1} onClick={() => navigate(index + 1)}>Next →</button></div>
            <details className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700"><summary className="cursor-pointer font-semibold">Question navigator · {session.questions.length - answered} unanswered</summary><p className="mt-2 text-xs text-slate-600 dark:text-slate-300">Filled buttons have an answer. Select a number to jump to that question.</p><nav aria-label="Challenge questions" className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">{session.questions.map((item, itemIndex) => <button type="button" key={item.id} aria-label={`Question ${itemIndex + 1}, ${answers[itemIndex] === null ? 'unanswered' : 'answered'}`} aria-current={itemIndex === index ? 'step' : undefined} onClick={() => navigate(itemIndex)} className={`min-h-10 rounded-lg border text-sm font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${answers[itemIndex] !== null ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-300 dark:border-slate-600'} ${itemIndex === index ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900' : ''}`}>{itemIndex + 1}</button>)}</nav></details>
            {confirmFinish && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"><p className="font-semibold">Finish and submit your challenge?</p><p className="mt-1 text-sm">{session.questions.length - answered > 0 ? `You have ${session.questions.length - answered} unanswered questions. They will score zero.` : 'All questions have an answer.'} You cannot change your answers after submitting.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" className={button} disabled={busy !== null || syncConflict} onClick={() => { void finish(); }}>{busy === 'finish' ? 'Submitting…' : 'Submit my answers'}</button><button type="button" className={secondaryButton} disabled={busy !== null} onClick={() => setConfirmFinish(false)}>Keep answering</button></div></div>}
            {!confirmFinish && remaining > 0 && <button type="button" className={`${button} mt-6 w-full sm:w-auto`} disabled={busy !== null || syncConflict} onClick={() => setConfirmFinish(true)}>Finish challenge</button>}
            {busy === 'finish' && <p role="status" className="mt-4 font-semibold">Scoring your answers…</p>}
          </div>
        )}

        {!initializing && result && (
          <div className="mt-5">
            <p className="text-sm text-slate-600 dark:text-slate-300">Challenge day: <time dateTime={result.day}>{result.day}</time> · Europe/Istanbul</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {([['Correct', result.correct], ['Incorrect', result.incorrect], ['Unanswered', result.unanswered], ['Net score', result.net.toFixed(2)], ['Time taken', formatTime(result.durationSeconds)], ['Questions', 50]] as const).map(([label, value]) => <div key={label} className={`rounded-xl p-4 ${label === 'Net score' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}><dt className="text-sm font-semibold">{label}</dt><dd className="mt-1 text-3xl font-black tabular-nums">{value}</dd></div>)}
            </dl>
            {result.ranked && !result.nickname && <form onSubmit={publishNickname} className="mt-6 rounded-xl border border-indigo-200 p-5 dark:border-indigo-800"><h3 className="text-lg font-bold">Join the daily leaderboard</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose a nickname to publish this result and see your rank. Your nickname and score will be public.</p><label htmlFor="challenge-nickname" className="mt-4 block text-sm font-bold">Nickname</label><input id="challenge-nickname" name="nickname" type="text" autoComplete="off" minLength={2} maxLength={20} required value={nickname} onChange={(event) => setNickname(event.target.value)} aria-describedby="challenge-nickname-help" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /><p id="challenge-nickname-help" className="mt-2 text-xs text-slate-600 dark:text-slate-300">2–20 characters. Use letters, numbers, spaces, underscores or hyphens.</p><button type="submit" disabled={busy !== null} className={`${button} mt-4 w-full sm:w-auto`}>{busy === 'nickname' ? 'Publishing…' : 'Publish score & see my rank'}</button></form>}
            {result.ranked && result.nickname && <div className="mt-5 rounded-xl bg-emerald-50 p-5 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"><p className="font-bold">{result.nickname}</p><p className="mt-2 text-xl font-black">{result.rank !== null ? `Rank #${result.rank} of ${result.participants} participant${result.participants === 1 ? '' : 's'}` : 'Your score is on the daily leaderboard.'}</p><p className="mt-2 text-sm">For {result.day}. Your position can change as more people finish and publish their scores.</p></div>}
            {!result.ranked && <p className="mt-5 rounded-xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">This was a practice attempt. Your first completed attempt for this day keeps its leaderboard eligibility.</p>}
            {(!result.ranked || result.nickname || result.day !== dayInIstanbul()) && <button type="button" className={`${secondaryButton} mt-5`} disabled={busy !== null} onClick={() => { void start(true); }}>{busy === 'start' ? 'Starting…' : result.day === dayInIstanbul() ? 'Practice today’s challenge again' : 'Start today’s challenge'}</button>}
          </div>
        )}
      </section>

      <section aria-labelledby="challenge-leaderboard-heading" className="em-card rounded-2xl border border-[rgb(var(--border))] p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="challenge-leaderboard-heading" className="text-2xl font-bold">Daily leaderboard</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{board ? `${board.day} · ${board.participants} published result${board.participants === 1 ? '' : 's'}` : 'Europe/Istanbul'} · Top 20</p></div><button type="button" disabled={boardLoading} onClick={() => { void refreshRanking(); }} className={secondaryButton}>{boardLoading ? 'Loading…' : 'Refresh ranking'}</button></div>
        {boardError && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">{boardError}</p>}
        {!board && boardLoading && <p role="status" className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading the leaderboard…</p>}
        {board && board.entries.length === 0 && <p className="mt-5 rounded-xl bg-slate-100 p-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">No scores have been published for this day yet. Complete the challenge and add your nickname to join.</p>}
        {board && board.entries.length > 0 && <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700"><table className="w-full text-left text-sm"><caption className="sr-only">Global English Challenge leaderboard for {board.day}, ordered by net score then completion time.</caption><thead className="bg-slate-100 dark:bg-slate-800"><tr>{['Rank', 'Nickname', 'Net', 'Correct', 'Incorrect', 'Blank', 'Time'].map((label) => <th key={label} scope="col" className="whitespace-nowrap px-3 py-3 font-bold">{label}</th>)}</tr></thead><tbody>{board.entries.map((entry) => <tr key={entry.rank} className="border-t border-slate-200 dark:border-slate-700"><td className="px-3 py-3 font-bold">#{entry.rank}</td><th scope="row" className="max-w-48 break-words px-3 py-3 font-semibold">{entry.nickname}</th><td className="px-3 py-3 font-bold tabular-nums text-indigo-700 dark:text-indigo-300">{entry.net.toFixed(2)}</td><td className="px-3 py-3 tabular-nums">{entry.correct}</td><td className="px-3 py-3 tabular-nums">{entry.incorrect}</td><td className="px-3 py-3 tabular-nums">{entry.unanswered}</td><td className="whitespace-nowrap px-3 py-3 font-mono tabular-nums">{formatTime(entry.durationSeconds)}</td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}
