'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { prepareTopicQuestions, type TopicQuestion } from '@/lib/topic-quiz';

import { a1Topics } from '@/data/levels/a1_topics';
import { a2Topics } from '@/data/levels/a2_topics';
import { b1Topics } from '@/data/levels/b1_topics';
import { b2Topics } from '@/data/levels/b2_topics';
import { c1Topics } from '@/data/levels/c1_topics';
import { c2Topics } from '@/data/levels/c2_topics';

import { a1Questions } from '@/data/levels/a1_questions';
import { a2Questions } from '@/data/levels/a2_questions';
import { b1Questions } from '@/data/levels/b1_questions';
import { b2Questions } from '@/data/levels/b2_questions';
import { c1Questions } from '@/data/levels/c1_questions';
import { c2Questions } from '@/data/levels/c2_questions';

type RouteParams = {
  level?: string | string[];
  topic?: string | string[];
};

type Topic = { slug: string; title: string; description: string };
type QuestionWithTopic = TopicQuestion & { topic: string };
const topicsByLevel: Record<string, Topic[]> = {
    a1: a1Topics,
    a2: a2Topics,
    b1: b1Topics,
    b2: b2Topics,
    c1: c1Topics,
    c2: c2Topics,
};

const questionsByLevel: Record<string, QuestionWithTopic[]> = {
    a1: a1Questions,
    a2: a2Questions,
    b1: b1Questions,
    b2: b2Questions,
    c1: c1Questions,
    c2: c2Questions,
};

export default function LevelTopicPage() {
  const params = useParams() as RouteParams;
  const levelParam = Array.isArray(params.level) ? params.level[0] : params.level || '';
  const topicParam = Array.isArray(params.topic) ? params.topic[0] : params.topic || '';
  const levelKey = levelParam.toLowerCase();
  const levelLabel = levelKey.toUpperCase();

  const topics = topicsByLevel[levelKey];
  const allQuestions = questionsByLevel[levelKey];

  if (!topics || !allQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">
            Topic quizzes are only available for A1, A2, B1, B2, C1 and C2 for now.
          </p>
          <Link
            className="px-4 py-2 rounded bg-slate-800 text-white"
            href="/levels/a1"
          >
            Go to A1 page
          </Link>
        </div>
      </div>
    );
  }

  const topic = topics.find((t) => t.slug === topicParam);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">This topic does not exist for level {levelLabel}.</p>
          <Link
            className="px-4 py-2 rounded bg-slate-800 text-white"
            href={`/levels/${levelKey}`}
          >
            Back to {levelLabel} topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <TopicQuiz
      key={`${levelKey}:${topicParam}`}
      levelKey={levelKey}
      topic={topic}
      sourceQuestions={allQuestions.filter((q) => q.topic === topicParam)}
    />
  );
}

function TopicQuiz({ levelKey, topic, sourceQuestions }: {
  levelKey: string;
  topic: Topic;
  sourceQuestions: QuestionWithTopic[];
}) {
  const levelLabel = levelKey.toUpperCase();
  const [attempt, setAttempt] = useState(0);
  const questions = useMemo(() => prepareTopicQuestions(sourceQuestions, attempt), [sourceQuestions, attempt]);

  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);

  const handleChange = (qIndex: number, optionIndex: number) => {
    if (showResult) return;
    const next = [...answers];
    next[qIndex] = optionIndex;
    setAnswers(next);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleRetry = () => {
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
    setAttempt((value) => value + 1);
  };

  const correctCount = questions.reduce((acc, q, index) => {
    if (answers[index] === q.correctIndex) return acc + 1;
    return acc;
  }, 0);

  const backHref = `/levels/${levelKey}`;

  return (
    <div className="em-page py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={backHref}
          className="text-sm text-slate-600 dark:text-slate-300 mb-4 inline-flex items-center hover:underline"
        >
          ← Back to {levelLabel} Mixed Test & Topics
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {topic.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">{topic.description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Level {levelLabel} • {questions.length} questions
        </p>

        <div className="space-y-6 mb-6">
          {questions.map((q, qIndex) => (
            <fieldset
              key={q.id}
              className="em-card min-w-0 rounded-lg p-4"
            >
              <legend className="max-w-full font-medium mb-3 px-1">
                {qIndex + 1}. {q.question}
              </legend>
              <div className="space-y-2">
                {q.options.map((opt: string, optIndex: number) => {
                  const isSelected = answers[qIndex] === optIndex;
                  const isCorrect = showResult && optIndex === q.correctIndex;
                  const isWrongSelected =
                    showResult && isSelected && optIndex !== q.correctIndex;

                  return (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-2 rounded border px-3 py-2 cursor-pointer text-sm
                        ${isSelected ? 'border-slate-800 dark:border-slate-200' : 'border-slate-200 dark:border-slate-700'}
                        ${isCorrect ? 'bg-green-50 text-green-950 border-green-500 dark:bg-green-950 dark:text-green-100' : ''}
                        ${isWrongSelected ? 'bg-red-50 text-red-950 border-red-500 dark:bg-red-950 dark:text-red-100' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        checked={isSelected}
                        disabled={showResult}
                        onChange={() => handleChange(qIndex, optIndex)}
                        className="h-4 w-4"
                      />
                      <span>{opt}{isCorrect && <span className="ml-2 font-semibold">✓ Correct answer</span>}{isWrongSelected && <span className="ml-2 font-semibold">— Your answer</span>}</span>
                    </label>
                  );
                })}
              </div>
              {showResult && (
                <div className="mt-4 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {answers[qIndex] === null ? 'Not answered.' : answers[qIndex] === q.correctIndex ? 'Correct.' : 'Review this answer.'}
                    {' '}Correct answer: {q.options[q.correctIndex]}
                  </p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{q.explanation}</p>
                </div>
              )}
            </fieldset>
          ))}
        </div>

        {!showResult && <button
          className="w-full md:w-auto px-6 py-3 rounded bg-slate-800 text-white font-semibold hover:bg-slate-900"
          onClick={handleSubmit}
        >
          Check my answers
        </button>}

        {showResult && (
          <div role="status" className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
            <p className="font-semibold">
              You scored {correctCount} / {questions.length}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {answers.filter((answer) => answer === null).length} unanswered. Read the explanations above, then try again with the choices in a new order.
            </p>
            <button onClick={handleRetry} className="mt-3 rounded bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900">
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
