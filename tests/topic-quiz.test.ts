import test from 'node:test';
import assert from 'node:assert/strict';
import { a1Questions } from '../data/levels/a1_questions';
import { a2Questions } from '../data/levels/a2_questions';
import { b1Questions } from '../data/levels/b1_questions';
import { b2Questions } from '../data/levels/b2_questions';
import { c1Questions } from '../data/levels/c1_questions';
import { c2Questions } from '../data/levels/c2_questions';
import { prepareTopicQuestions } from '../lib/topic-quiz';

const allQuestions = [...a1Questions, ...a2Questions, ...b1Questions, ...b2Questions, ...c1Questions, ...c2Questions];

test('all 36 topic tests have ten valid questions with explanatory feedback', () => {
  const groups = new Map<string, number>();
  assert.equal(allQuestions.length, 360);
  assert.equal(new Set(allQuestions.map((question) => question.id)).size, 360);
  for (const question of allQuestions) {
    const group = `${question.level}:${question.topic}`;
    groups.set(group, (groups.get(group) ?? 0) + 1);
    assert.equal(question.options.length, 4, question.id);
    assert.equal(new Set(question.options).size, question.options.length, question.id);
    assert.ok(question.options.every((option) => option.trim()), question.id);
    assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < question.options.length, question.id);
    assert.ok(question.explanation.trim().length >= 20, question.id);
  }
  assert.equal(groups.size, 36);
  assert.ok([...groups.values()].every((count) => count === 10));
});

test('shuffling keeps each correct answer and explanation without mutating the bank', () => {
  const before = structuredClone(allQuestions);
  for (const attempt of [0, 1, 2, 10]) {
    const shuffled = prepareTopicQuestions(allQuestions, attempt);
    for (let index = 0; index < allQuestions.length; index++) {
      const original = allQuestions[index];
      const question = shuffled[index];
      assert.equal(question.options[question.correctIndex], original.options[original.correctIndex], original.id);
      assert.deepEqual([...question.options].sort(), [...original.options].sort(), original.id);
      assert.equal(question.explanation, original.explanation, original.id);
    }
  }
  assert.deepEqual(allQuestions, before);
});

test('server and browser get stable choices, while retry changes the order', () => {
  assert.deepEqual(prepareTopicQuestions(allQuestions), prepareTopicQuestions(allQuestions));
  const initial = prepareTopicQuestions(allQuestions);
  const retry = prepareTopicQuestions(allQuestions, 1);
  assert.ok(initial.filter((question, index) => question.options.join('|') !== retry[index].options.join('|')).length > 250);

  const positionsByTopic = new Map<string, Set<number>>();
  for (const question of initial) {
    const group = `${question.level}:${question.topic}`;
    const positions = positionsByTopic.get(group) ?? new Set<number>();
    positions.add(question.correctIndex);
    positionsByTopic.set(group, positions);
  }
  assert.ok([...positionsByTopic.values()].every((positions) => positions.size > 1));
});

test('past-perfect and deduction answers do not repeat words already in the prompt', () => {
  const expected: Record<string, string> = {
    'b2-pp-8': 'had / spoken',
    'b2-mod-5': 'must have',
    'b2-mod-6': 'must have',
    'b2-mod-7': 'must have',
    'b2-mod-9': 'must have',
    'b2-mod-10': 'must have',
    'c1-wish-9': 'had got',
    'c2-ellip-5': 'we will hire',
  };
  for (const [id, answer] of Object.entries(expected)) {
    const question = allQuestions.find((item) => item.id === id)!;
    assert.equal(question.options[question.correctIndex], answer, id);
  }
});
