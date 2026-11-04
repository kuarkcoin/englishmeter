'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { scoreQuiz, type QuizAnswers } from '@/lib/quiz-result';
import type { StandardQuestion } from '@/lib/quizManager';

export default function KidsQuiz({ questions, title }: { questions: StandardQuestion[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const question = questions[index];
  const result = useMemo(() => scoreQuiz(questions, answers), [questions, answers]);

  useEffect(() => {
    if (index > 0 || finished || attempt > 0) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [index, finished, attempt]);

  if (!question) return null;

  if (finished) {
    return (
      <section id="kids-quiz" className="em-card rounded-3xl border border-[rgb(var(--border))] p-6 sm:p-8" aria-labelledby="kids-result-heading">
        <span aria-hidden="true" className="text-4xl">🌟</span>
        <h2 id="kids-result-heading" ref={heading} tabIndex={-1} className="mt-3 scroll-mt-6 text-3xl font-black focus:outline-none">You finished {title}!</h2>
        <p className="mt-4 text-2xl font-bold text-blue-700 dark:text-blue-300">{result.correct} / {result.total} correct</p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Every question helps you learn. Read the answers below or try another topic.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => { setAnswers({}); setIndex(0); setFinished(false); setAttempt((value) => value + 1); }} className="min-h-12 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Try again</button>
          <Link href="/kids" className="min-h-12 rounded-xl border border-[rgb(var(--border))] px-5 py-3 font-bold">Choose another topic</Link>
        </div>
        <h3 className="mt-8 text-xl font-bold">Let’s review</h3>
        <ol className="mt-4 space-y-4">
          {result.review.map(({ question: item, correctChoice, selectedChoice, status }, itemIndex) => (
            <li key={item.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="font-bold">{itemIndex + 1}. {item.prompt}</p>
              <p className="mt-2 text-sm">{status === 'correct' ? '✓ You got it!' : `Your answer: ${selectedChoice?.text ?? 'Not answered'}`}</p>
              <p className="mt-2 font-semibold">Answer: {correctChoice?.text}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.explanation}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const selected = answers[question.id];
  const correct = question.choices.find((choice) => choice.isCorrect);
  const isCorrect = selected === correct?.id;

  return (
    <section id="kids-quiz" className="em-card rounded-3xl border border-[rgb(var(--border))] p-6 sm:p-8" aria-labelledby="kids-question-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <p>Question {index + 1} of {questions.length}</p>
        <p>Take your time</p>
      </div>
      <progress className="mt-3 h-3 w-full accent-blue-600" value={Object.keys(answers).length} max={questions.length} aria-label="Questions answered" />
      <h2 id="kids-question-heading" ref={heading} tabIndex={-1} className="mt-6 scroll-mt-6 text-2xl font-black leading-relaxed focus:outline-none">{question.prompt}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-labelledby="kids-question-heading">
        {question.choices.map((choice) => {
          const revealedCorrect = !!selected && choice.isCorrect;
          const selectedWrong = selected === choice.id && !choice.isCorrect;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={!!selected}
              aria-pressed={selected === choice.id}
              onClick={() => setAnswers((current) => current[question.id] ? current : { ...current, [question.id]: choice.id })}
              className={`min-h-16 rounded-2xl border-2 px-4 py-4 text-left text-lg font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${revealedCorrect ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : selectedWrong ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100' : 'border-[rgb(var(--border))] bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 enabled:hover:border-blue-500'}`}
            >
              {choice.text}{revealedCorrect && <span aria-label="Correct answer"> ✓</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-5" aria-live="polite" aria-atomic="true">
        {selected && (
          <div className="rounded-2xl bg-blue-50 p-4 text-slate-800 dark:bg-blue-950 dark:text-slate-100">
            <p className="font-bold">{isCorrect ? 'Great job!' : `Good try! The answer is ${correct?.text}.`}</p>
            <p className="mt-2 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
      <button type="button" disabled={!selected} onClick={() => index === questions.length - 1 ? setFinished(true) : setIndex((value) => value + 1)} className="mt-5 min-h-12 w-full rounded-xl bg-blue-700 px-6 py-3 text-lg font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
        {index === questions.length - 1 ? 'See my results' : 'Next question →'}
      </button>
      <noscript><p className="mt-4">Enable JavaScript to play the quiz. You can still read the learning goals and sample below.</p></noscript>
    </section>
  );
}
