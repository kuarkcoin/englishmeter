'use client';

import { useState } from 'react';

export type LevelTopicQuizTopic = {
  slug: string;
  title: string;
  description: string;
  questionCount: number;
};

export type LevelTopicQuizQuestion = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
};

type LevelTopicQuizClientProps = {
  level: string;
  levelLabel: string;
  topicSlug: string;
  topic: LevelTopicQuizTopic;
  questions: LevelTopicQuizQuestion[];
};

export default function LevelTopicQuizClient({
  level,
  levelLabel,
  topicSlug,
  topic,
  questions,
}: LevelTopicQuizClientProps) {
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

  return (
    <section
      aria-label={`${levelLabel} ${topic.title} quiz`}
      data-level={level}
      data-topic={topicSlug}
    >
      <div className="space-y-6 mb-6">
        {questions.map((q, qIndex) => (
          <div
            key={q.id}
            className="em-card rounded-lg p-4"
          >
            <p className="font-medium mb-3">
              {qIndex + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => {
                const isSelected = answers[qIndex] === optIndex;
                const isCorrect = showResult && optIndex === q.correctIndex;
                const isWrongSelected =
                  showResult && isSelected && optIndex !== q.correctIndex;

                return (
                  <label
                    key={optIndex}
                    className={`flex items-center gap-2 rounded border px-3 py-2 cursor-pointer text-sm
                      ${isSelected ? 'border-slate-800 dark:border-slate-200' : 'border-slate-200 dark:border-slate-700'}
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
        <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
          <p className="font-semibold">
            You scored {correctCount} / {questions.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Review the red answers and try again if you want.
          </p>
        </div>
      )}
    </section>
  );
}
