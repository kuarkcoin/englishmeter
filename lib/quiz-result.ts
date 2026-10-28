import type { StandardQuestion } from './quizManager';

export type QuizAnswers = Record<string, string>;

/** Grade only actual choices; an omitted answer is never a correct answer. */
export function scoreQuiz(questions: StandardQuestion[], answers: QuizAnswers) {
  const review = questions.map((question) => {
    const selectedChoice = question.choices.find((choice) => choice.id === answers[question.id]);
    const solutions = question.choices.filter((choice) => choice.isCorrect);
    const correctChoice = solutions.length === 1 ? solutions[0] : undefined;
    const status = !selectedChoice
      ? 'unanswered'
      : correctChoice && selectedChoice.id === correctChoice.id ? 'correct' : 'incorrect';
    return { question, selectedChoice, correctChoice, status };
  });
  const correct = review.filter((item) => item.status === 'correct').length;
  const unanswered = review.filter((item) => item.status === 'unanswered').length;
  const total = questions.length;
  return {
    correct,
    incorrect: total - correct - unanswered,
    unanswered,
    total,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    review,
  };
}
