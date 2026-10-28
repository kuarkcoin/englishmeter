import assert from 'node:assert/strict';
import { test } from 'node:test';
import levelBank from '../data/english_test_questions.json';
import {
  CEFR_LEVELS,
  scorePlacement,
  selectPlacementQuestions,
  type PlacementQuestion,
} from '../lib/placement';

function fixture(): PlacementQuestion[] {
  return CEFR_LEVELS.flatMap((level) => Array.from({ length: 5 }, (_, index) => ({
    id: `${level}-${index}`,
    level,
    choices: [{ id: 'wrong', isCorrect: false }, { id: 'right', isCorrect: true }],
  })));
}

function answersFor(questions: PlacementQuestion[], correctByLevel: number[]): Record<string, string> {
  return Object.fromEntries(questions.map((question, index) => [
    question.id,
    index % 5 < correctByLevel[Math.floor(index / 5)] ? 'right' : 'wrong',
  ]));
}

test('placement selection is reproducible and contains five questions from each level without mutating the bank', () => {
  const before = JSON.stringify(levelBank);
  const selected = selectPlacementQuestions(levelBank);
  assert.equal(selected.length, 30);
  assert.equal(new Set(selected).size, 30);
  for (const level of CEFR_LEVELS) assert.equal(selected.filter((question) => question.level === level).length, 5);
  assert.deepEqual(selectPlacementQuestions(levelBank), selected);
  assert.equal(JSON.stringify(levelBank), before);
});

test('placement selection rejects a missing level or an invalid requested question count', () => {
  assert.throws(() => selectPlacementQuestions(levelBank.filter((question) => question.level !== 'A2')), /A2/);
  for (const count of [0, -1, 1.5, NaN]) assert.throws(() => selectPlacementQuestions(levelBank, count), /positive integer/);
});

test('four of five answers at every consecutive level determines the practice estimate', () => {
  const questions = fixture();
  const result = scorePlacement(questions, answersFor(questions, [4, 4, 4, 3, 5, 5]));
  assert.equal(result.isComplete, true);
  assert.equal(result.estimatedLevel, 'B1');
  assert.equal(result.recommendedLevel, 'B2');
  assert.equal(result.levelScores[3].percentage, 60);
  assert.equal(result.levelScores[4].correct, 5);
});

test('correct upper-level answers do not bypass a lower-level gap', () => {
  const questions = fixture();
  const result = scorePlacement(questions, answersFor(questions, [3, 5, 5, 5, 5, 5]));
  assert.equal(result.isComplete, true);
  assert.equal(result.estimatedLevel, null);
  assert.equal(result.recommendedLevel, 'A1');
});

test('all levels passed produces C2 practice estimate and keeps the recommendation within supported levels', () => {
  const questions = fixture();
  const result = scorePlacement(questions, answersFor(questions, [5, 5, 5, 5, 5, 5]));
  assert.equal(result.estimatedLevel, 'C2');
  assert.equal(result.recommendedLevel, 'C2');
});

test('unanswered questions and invalid choice IDs never produce a completed placement estimate', () => {
  const questions = fixture();
  for (const missingAnswer of [undefined, 'not-a-choice']) {
    const answers = answersFor(questions, [5, 5, 5, 5, 5, 5]);
    if (missingAnswer === undefined) delete answers['C2-4'];
    else answers['C2-4'] = missingAnswer;
    const result = scorePlacement(questions, answers);
    assert.equal(result.hasBalancedQuestions, true);
    assert.equal(result.isComplete, false);
    assert.equal(result.estimatedLevel, null);
    assert.equal(result.levelScores[5].answered, 4);
  }
});

test('empty, unbalanced or malformed question sets cannot claim a level', () => {
  const questions = fixture();
  const answers = answersFor(questions, [5, 5, 5, 5, 5, 5]);
  const variants: PlacementQuestion[][] = [
    [], questions.slice(0, 25),
    questions.map((question, index) => index === 0 ? { ...question, id: questions[1].id } : question),
    questions.map((question, index) => index === 0 ? { ...question, choices: question.choices.map((choice) => ({ ...choice, isCorrect: true })) } : question),
    questions.map((question, index) => index === 0 ? { ...question, choices: question.choices.map((choice) => ({ ...choice, id: 'right' })) } : question),
  ];
  for (const variant of variants) {
    const result = scorePlacement(variant, answers);
    assert.equal(result.hasBalancedQuestions, false);
    assert.equal(result.isComplete, false);
    assert.equal(result.estimatedLevel, null);
  }
});
