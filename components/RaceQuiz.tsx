'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { StandardQuestion } from '@/lib/quizManager';
import { scoreQuiz, type QuizAnswers } from '@/lib/quiz-result';
import { scorePlacement, PLACEMENT_METHOD } from '@/lib/placement';

interface RaceQuizProps {
  questions: StandardQuestion[];
  raceId: string;
  totalTime: number;
}

type FinishedAttempt = {
  answers: QuizAnswers;
  timeSpent: number;
  timedOut: boolean;
};

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function QuizAttempt({ questions, raceId, totalTime, onRetry }: RaceQuizProps & { onRetry: () => void }) {
  const duration = Number.isFinite(totalTime) ? Math.max(1, Math.floor(totalTime)) : 900;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [timeLeft, setTimeLeft] = useState(duration);
  const [finished, setFinished] = useState<FinishedAttempt | null>(null);
  const answersRef = useRef<QuizAnswers>({});
  const deadlineRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const finish = useCallback((timedOut = false) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const remaining = deadlineRef.current === null
      ? duration
      : Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
    setTimeLeft(remaining);
    setFinished({
      answers: { ...answersRef.current },
      timeSpent: Math.max(0, Math.min(duration, duration - remaining)),
      timedOut: timedOut || remaining === 0,
    });
  }, [duration]);

  useEffect(() => {
    if (finished || !questions.length) return;
    // A deadline also accounts for time spent in a background browser tab.
    if (deadlineRef.current === null) deadlineRef.current = Date.now() + duration * 1000;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current! - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) finish(true);
    };
    const interval = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [duration, finish, finished, questions.length]);

  useEffect(() => {
    if (finished) resultHeadingRef.current?.focus();
  }, [finished]);

  if (!questions.length) {
    return <p>No questions are available for this test. <Link href="/" className="underline">Choose another test</Link>.</p>;
  }

  if (finished) {
    const result = scoreQuiz(questions, finished.answers);
    const placement = raceId === 'quick-placement' ? scorePlacement(questions, finished.answers) : null;

    return (
      <section className="em-card rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-8 space-y-6" aria-label="Test results">
        <div>
          <h2 ref={resultHeadingRef} tabIndex={-1} className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 focus:outline-none">
            {finished.timedOut ? 'Time is up — your results' : 'Your results'}
          </h2>
          <p className="mt-3 text-3xl font-black text-blue-700 dark:text-blue-300">{result.correct} / {result.total} · {result.percentage}%</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{result.correct} correct · {result.incorrect} incorrect · {result.unanswered} unanswered</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Time used: {formatTime(finished.timeSpent)}</p>
        </div>

        {placement && (
          <section className="rounded-2xl bg-blue-50 dark:bg-slate-800 p-4 sm:p-5" aria-label="Placement estimate">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {!placement.isComplete
                ? 'Complete all questions for a level estimate'
                : placement.estimatedLevel ? `Estimated practice level: ${placement.estimatedLevel}` : 'Start with A1 practice'}
            </h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{PLACEMENT_METHOD}</p>
            <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {placement.levelScores.map((level) => (
                <li key={level.level} className="rounded-lg bg-white dark:bg-slate-900 p-2 text-slate-800 dark:text-slate-200"><strong>{level.level}</strong>: {level.correct}/{level.total} correct</li>
              ))}
            </ul>
            <Link href={`/levels/${placement.recommendedLevel.toLowerCase()}`} className="inline-block mt-4 font-bold text-blue-700 dark:text-blue-300 underline">Practise {placement.recommendedLevel} topics</Link>
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onRetry} className="rounded-xl bg-blue-700 hover:bg-blue-800 px-5 py-3 font-bold text-white">Retake test</button>
          <Link href="/" className="rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-3 font-bold text-slate-800 dark:text-slate-100">Choose another test</Link>
        </div>

        <section aria-labelledby="answer-review-heading">
          <h3 id="answer-review-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Answer review</h3>
          <div className="space-y-3">
            {result.review.map(({ question, selectedChoice, correctChoice, status }, index) => (
              <details key={`${question.id}-${index}`} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <summary className="cursor-pointer font-bold text-slate-900 dark:text-slate-100">Question {index + 1} — {status === 'correct' ? 'Correct' : status === 'incorrect' ? 'Incorrect' : 'Unanswered'}</summary>
                <p className="whitespace-pre-line break-words mt-3 text-slate-800 dark:text-slate-200">{question.prompt}</p>
                <p className="mt-3 text-slate-700 dark:text-slate-300"><strong>Your answer:</strong> {selectedChoice?.text ?? 'Not answered'}</p>
                <p className="mt-2 text-emerald-800 dark:text-emerald-300"><strong>Correct answer:</strong> {correctChoice?.text ?? 'No answer key available'}</p>
                {question.explanation && <p className="mt-3 whitespace-pre-line break-words text-sm text-slate-600 dark:text-slate-300"><strong>Explanation:</strong> {question.explanation}</p>}
              </details>
            ))}
          </div>
        </section>
      </section>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <section className="em-card rounded-3xl shadow-xl overflow-hidden" aria-label="Practice test">
      <div className="bg-slate-900 text-white p-4 flex flex-wrap gap-2 justify-between items-center">
        <p className="font-bold">Question {currentIndex + 1} / {questions.length}</p>
        <p className={`font-mono text-xl ${timeLeft < 60 ? 'text-red-300' : 'text-blue-300'}`} aria-label="Time remaining">{formatTime(timeLeft)}</p>
      </div>
      <div className="bg-slate-200 dark:bg-slate-700 h-2" aria-hidden="true"><div className="bg-blue-600 h-2 transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>
      <div className="p-5 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-relaxed whitespace-pre-line break-words">{currentQuestion.prompt}</h2>
        <div className="grid gap-3" role="group" aria-label={`Answer for question ${currentIndex + 1}`}>
          {currentQuestion.choices.map((choice, index) => {
            const selected = answers[currentQuestion.id] === choice.id;
            return (
              <button
                type="button"
                key={choice.id}
                aria-pressed={selected}
                onClick={() => {
                  if (finishedRef.current) return;
                  if (deadlineRef.current !== null && Date.now() >= deadlineRef.current) { finish(true); return; }
                  const nextAnswers = { ...answersRef.current, [currentQuestion.id]: choice.id };
                  answersRef.current = nextAnswers;
                  setAnswers(nextAnswers);
                }}
                className={`text-left p-4 rounded-xl border-2 flex items-start gap-3 transition-colors ${selected ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${selected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{String.fromCharCode(65 + index)}</span>
                <span className="min-w-0 break-words pt-1 text-slate-800 dark:text-slate-200">{choice.text}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{answeredCount} of {questions.length} answered</p>
        <div className="flex flex-wrap justify-between gap-3">
          <button type="button" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0} className="rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40">← Previous</button>
          {currentIndex < questions.length - 1 ? (
            <button type="button" onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))} className="rounded-xl px-4 py-3 font-bold bg-blue-700 hover:bg-blue-800 text-white">Next question →</button>
          ) : (
            <button type="button" onClick={() => finish()} className="rounded-xl px-4 py-3 font-bold bg-emerald-700 hover:bg-emerald-800 text-white">Finish test</button>
          )}
        </div>
        {currentIndex < questions.length - 1 && <button type="button" onClick={() => finish()} className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300 underline">Finish and review answers</button>}
      </div>
    </section>
  );
}

export default function RaceQuiz(props: RaceQuizProps) {
  const [attempt, setAttempt] = useState(0);
  return <QuizAttempt key={attempt} {...props} onRetry={() => setAttempt((value) => value + 1)} />;
}
