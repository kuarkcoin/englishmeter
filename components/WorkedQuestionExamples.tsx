import type { StandardQuestion } from '@/lib/quizManager';
import { getWorkedExamples } from '@/lib/public-test-content';

export default function WorkedQuestionExamples({ questions, count = 2 }: { questions: readonly StandardQuestion[]; count?: number }) {
  const examples = getWorkedExamples(questions, count);
  if (!examples.length) return null;
  return (
    <section aria-labelledby="worked-example-heading" className="mt-8">
      <h2 id="worked-example-heading" className="text-2xl font-bold">Example questions and explanations</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">These examples come from this practice set. Open an answer when you are ready to review it.</p>
      <div className="mt-4 space-y-4">
        {examples.map((question, index) => <article key={question.id} className="em-card rounded-2xl border border-[rgb(var(--border))] p-5">
          <h3 className="font-bold">Example {index + 1}</h3>
          <p className="mt-3 whitespace-pre-line break-words leading-relaxed">{question.prompt}</p>
          <ul className="mt-3 list-inside list-[upper-alpha] space-y-2 text-slate-700 dark:text-slate-200">{question.choices.map((choice) => <li key={choice.id}>{choice.text}</li>)}</ul>
          <details className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <summary className="cursor-pointer font-bold text-blue-700 dark:text-blue-300">Show answer and explanation</summary>
            <p className="mt-3"><strong>Answer:</strong> {question.choices.find((choice) => choice.isCorrect)?.text}</p>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">{question.explanation}</p>
          </details>
        </article>)}
      </div>
    </section>
  );
}
