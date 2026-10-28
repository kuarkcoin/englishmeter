import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scoreQuiz } from '../lib/quiz-result';
import type { StandardQuestion } from '../lib/quizManager';

const fiveChoiceQuestion: StandardQuestion = {
  id: 'five-options',
  prompt: 'Choose the fifth option.',
  choices: ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, text: `Option ${id}`, isCorrect: id === 'e' })),
  explanation: 'The answer key is E.',
};

test('the fifth choice remains available for scoring and answer review', () => {
  const result = scoreQuiz([fiveChoiceQuestion], { 'five-options': 'e' });
  assert.equal(result.correct, 1);
  assert.equal(result.percentage, 100);
  assert.equal(result.review[0].correctChoice?.text, 'Option e');
  assert.equal(result.review[0].selectedChoice?.id, 'e');
  assert.equal(result.review[0].question.explanation, 'The answer key is E.');
  assert.equal(result.review[0].question.choices.length, 5);
});

test('unanswered, incorrect and invalid selections are distinct from correct answers', () => {
  const questions = ['right', 'wrong', 'empty', 'invalid'].map((id) => ({ ...fiveChoiceQuestion, id }));
  const result = scoreQuiz(questions, { right: 'e', wrong: 'a', invalid: 'outside-options' });
  assert.deepEqual({ correct: result.correct, incorrect: result.incorrect, unanswered: result.unanswered, percentage: result.percentage }, {
    correct: 1, incorrect: 1, unanswered: 2, percentage: 25,
  });
  assert.equal(result.review[1].selectedChoice?.text, 'Option a');
  assert.equal(result.review[2].selectedChoice, undefined);
});

test('missing or ambiguous answer keys never silently mark A correct', () => {
  const missing = { ...fiveChoiceQuestion, choices: fiveChoiceQuestion.choices.map((choice) => ({ ...choice, isCorrect: false })) };
  const ambiguous = { ...fiveChoiceQuestion, choices: fiveChoiceQuestion.choices.map((choice) => ({ ...choice, isCorrect: true })) };
  for (const question of [missing, ambiguous]) {
    const result = scoreQuiz([question], { 'five-options': 'a' });
    assert.equal(result.correct, 0);
    assert.equal(result.review[0].correctChoice, undefined);
  }
  assert.equal(scoreQuiz([], {}).percentage, 0);
});
