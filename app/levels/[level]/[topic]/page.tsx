'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { a1Topics } from '@/data/levels/a1_topics';
import { a2Topics } from '@/data/levels/a2_topics';
import { b1Topics } from '@/data/levels/b1_topics';
import { a1Questions } from '@/data/levels/a1_questions';
import { a2Questions } from '@/data/levels/a2_questions';
import { b1Questions } from '@/data/levels/b1_questions';

type RouteParams = {
  level?: string | string[];
  topic?: string | string[];
};

export default function LevelTopicPage() {
    const topicsByLevel: Record<string, any[]> = {
    a1: a1Topics,
    a2: a2Topics,
    b1: b1Topics,
  };

  const questionsByLevel: Record<string, any[]> = {
    a1: a1Questions,
    a2: a2Questions,
    b1: b1Questions,
  };


  // Seviye bazlı topic ve soru listeleri
  const topicsByLevel: Record<string, any[]> = {
    a1: a1Topics,
    a2: a2Topics,
  };

  const questionsByLevel: Record<string, any[]> = {
    a1: a1Questions,
    a2: a2Questions,
  };

  const topics = topicsByLevel[levelKey];
  const allQuestions = questionsByLevel[levelKey];

  // Şimdilik sadece A1 ve A2 destekleniyor
  if (!topics || !allQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Topic quizzes are only available for A1 and A2 for now.</p>
          <button
            className="px-4 py-2 rounded bg-slate-800 text-white"
            onClick={() => router.push('/levels/a1')}
          >
            Go to A1 page
          </button>
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
          <button
            className="px-4 py-2 rounded bg-slate-800 text-white"
            onClick={() => router.push(`/levels/${levelKey}`)}
          >
            Back to {levelLabel} topics
          </button>
        </div>
      </div>
    );
  }

  const questions = allQuestions.filter((q) => q.topic === topicParam);

  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);

  const handleChange = (qIndex: number, optionIndex: number) => {
    const next = [...answers];
    next[qIndex] = optionIndex;
    setAnswers(next);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const correctCount = questions.reduce((acc, q, index) => {
    if (answers[index] === q.correctIndex) return acc + 1;
    return acc;
  }, 0);

  const backHref = `/levels/${levelKey}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={backHref}
          className="text-sm text-slate-600 mb-4 inline-flex items-center hover:underline"
        >
          ← Back to {levelLabel} Mixed Test & Topics
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {topic.title}
        </h1>
        <p className="text-slate-600 mb-4">{topic.description}</p>
        <p className="text-xs text-slate-500 mb-6">
          Level {levelLabel} • {questions.length} questions
        </p>

        <div className="space-y-6 mb-6">
          {questions.map((q, qIndex) => (
            <div
              key={q.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <p className="font-medium mb-3">
                {qIndex + 1}. {q.question}
              </p>
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
                        ${isSelected ? 'border-slate-800' : 'border-slate-200'}
                        ${isCorrect ? 'bg-green-50 border-green-500' : ''}
                        ${isWrongSelected ? 'bg-red-50 border-red-500' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        checked={isSelected}
                        onChange={() => handleChange(qIndex, optIndex)}
                        className="h-4 w-4"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full md:w-auto px-6 py-3 rounded bg-slate-800 text-white font-semibold hover:bg-slate-900"
          onClick={handleSubmit}
        >
          Check my answers
        </button>

        {showResult && (
          <div className="mt-4 p-4 rounded-lg bg-slate-100 text-slate-800">
            <p className="font-semibold">
              You scored {correctCount} / {questions.length}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Review the red answers and try again if you want.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
