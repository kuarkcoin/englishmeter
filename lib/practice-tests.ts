import { PRACTICE_TESTS, getPracticeTestSlug } from '@/lib/practice-catalog';
import type { PracticeQuestion, PracticeTest } from '@/data/practice/types';
import { prepareTopicQuestions } from '@/lib/topic-quiz';
import type { StandardQuestion } from '@/lib/quizManager';
import { getPracticeCategory } from '@/lib/practice-categories';

export function getPracticeQuestionPrompt(test: PracticeTest, question: PracticeQuestion): string {
  if (!question.passageId) return question.prompt;
  const passage = test.passages?.find((item) => item.id === question.passageId);
  return passage ? `${passage.title}\n\n${passage.text}\n\n${question.prompt}` : '';
}

export function validatePracticeTest(test: PracticeTest): boolean {
  const expected = getPracticeCategory(test.category)?.questionCount;
  if (
    test.questions.length !== expected ||
    new Set(test.questions.map((question) => question.id)).size !== expected ||
    !test.title.trim() || !test.description.trim() ||
    test.learningGoals.length < 3 || test.learningGoals.some((goal) => !goal.trim()) ||
    !Number.isFinite(test.duration) || test.duration <= 0
  ) return false;
  const passageLayout = test.category === 'reading' ? [4, 5]
    : test.category === 'cambridge-use-of-english' ? [2, 8]
      : test.category === 'toeic-reading' && test.slug === 'text-completion' ? [5, 4]
        : test.category === 'toeic-reading' && test.slug === 'reading-comprehension' ? [4, 5] : null;
  if (passageLayout) {
    if (!test.passages || test.passages.length !== passageLayout[0]) return false;
    if (test.passages.some((passage) => test.questions.filter((question) => question.passageId === passage.id).length !== passageLayout[1])) return false;
  }
  if (test.passages) {
    if (new Set(test.passages.map((passage) => passage.id)).size !== test.passages.length) return false;
    if (test.passages.some((passage) => !passage.id.trim() || !passage.title.trim() || !passage.text.trim() || !test.questions.some((question) => question.passageId === passage.id))) return false;
  }
  return test.questions.every((question) =>
    !!question.id.trim() && !!question.prompt.trim() && !!question.explanation.trim() &&
    question.options.length === 4 && question.options.every((option) => !!option.trim()) &&
    new Set(question.options.map((option) => option.trim().toLowerCase())).size === 4 &&
    Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4 &&
    (!passageLayout || !!question.passageId) &&
    (!question.passageId || !!test.passages?.some((passage) => passage.id === question.passageId))
  );
}

export function getPracticeQuizForTest(test: PracticeTest): {
  title: string; duration: number; questions: StandardQuestion[];
} | null {
  if (!validatePracticeTest(test)) return null;
  const questions = prepareTopicQuestions(test.questions.map((question) => ({
    id: question.id,
    question: getPracticeQuestionPrompt(test, question),
    options: [...question.options],
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  })));
  return {
    title: test.title,
    duration: test.duration,
    questions: questions.map((question) => ({
      id: question.id, level: test.level, prompt: question.question,
      explanation: question.explanation,
      choices: question.options.map((text, index) => ({
        id: String.fromCharCode(97 + index), text, isCorrect: index === question.correctIndex,
      })),
    })),
  };
}

export function getPracticeQuiz(selector: string) {
  const test = PRACTICE_TESTS.find((item) => getPracticeTestSlug(item) === selector);
  return test ? getPracticeQuizForTest(test) : null;
}
