import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CHALLENGE_GRAMMAR } from '../data/challenge/grammar';
import { CHALLENGE_VOCABULARY } from '../data/challenge/vocabulary';
import { CHALLENGE_READING } from '../data/challenge/reading';
import { BANK_VERSION, createDailyPaper, validateChallengeBank } from '../lib/challenge/bank';
import {
  CHALLENGE_DURATION_SECONDS,
  challengeDay,
  normalizeNickname,
  publicQuestions,
  scoreChallenge,
  validateAnswers,
  validateDay,
} from '../lib/challenge/core';
import type { ChallengeQuestion } from '../lib/challenge/types';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
const allQuestions = [...CHALLENGE_GRAMMAR, ...CHALLENGE_VOCABULARY, ...CHALLENGE_READING];

test('challenge uses Istanbul midnight, including month, year and leap-day rollover', () => {
  assert.equal(CHALLENGE_DURATION_SECONDS, 2400);
  const boundaries = [
    ['2026-11-04T20:59:59.999Z', '2026-11-04'],
    ['2026-11-04T21:00:00.000Z', '2026-11-05'],
    ['2026-12-31T21:00:00.000Z', '2027-01-01'],
    ['2028-02-28T21:00:00.000Z', '2028-02-29'],
    ['2028-02-29T21:00:00.000Z', '2028-03-01'],
  ];
  for (const [timestamp, day] of boundaries) assert.equal(challengeDay(new Date(timestamp)), day);
});

test('only real ISO date keys are accepted', () => {
  for (const valid of ['2026-11-04', '2028-02-29', '2026-12-31']) assert.equal(validateDay(valid), true);
  for (const invalid of ['2026-02-29', '2026-02-30', '2026-13-01', '2026-00-12', '26-11-04', '2026-1-01', '2026-11-04T00:00:00Z', '', null, 5]) {
    assert.equal(validateDay(invalid as string), false);
    assert.throws(() => createDailyPaper(invalid as string), /Invalid challenge date/);
  }
});

test('bank contains 300 valid questions and balanced grammar and vocabulary pools', () => {
  assert.ok(BANK_VERSION);
  assert.doesNotThrow(() => validateChallengeBank());
  assert.equal(allQuestions.length, 300);
  assert.equal(new Set(allQuestions.map(question => question.id)).size, 300);
  for (const bank of [CHALLENGE_GRAMMAR, CHALLENGE_VOCABULARY]) {
    assert.equal(bank.length, 120);
    for (const level of levels) assert.equal(bank.filter(question => question.level === level).length, 24);
  }
  assert.equal(CHALLENGE_READING.length, 60);
  assert.equal(new Set(CHALLENGE_READING.map(question => question.passage!.id)).size, 12);
});

test('daily paper is reproducible, balanced and includes two complete reading passages', () => {
  const paper = createDailyPaper('2026-11-04');
  assert.deepEqual(paper, createDailyPaper('2026-11-04'));
  assert.equal(paper.length, 50);
  assert.equal(new Set(paper.map(question => question.id)).size, 50);
  for (const category of ['grammar', 'vocabulary'] as const) {
    const section = paper.filter(question => question.category === category);
    assert.equal(section.length, 20);
    for (const level of levels) assert.equal(section.filter(question => question.level === level).length, 4);
  }
  const reading = paper.filter(question => question.category === 'reading');
  assert.equal(reading.length, 10);
  const passages = new Set(reading.map(question => question.passage!.id));
  assert.equal(passages.size, 2);
  for (const passageId of passages) {
    assert.deepEqual(
      reading.filter(question => question.passage!.id === passageId).map(question => question.id),
      CHALLENGE_READING.filter(question => question.passage!.id === passageId).map(question => question.id),
    );
  }
});

test('consecutive days never share a question, including rotation and year boundaries', () => {
  const firstDay = Date.parse('2026-12-20T00:00:00.000Z');
  let previous = new Set<string>();
  for (let offset = 0; offset < 35; offset++) {
    const day = new Date(firstDay + offset * 86_400_000).toISOString().slice(0, 10);
    const current = createDailyPaper(day);
    assert.equal(current.filter(question => previous.has(question.id)).length, 0, day);
    previous = new Set(current.map(question => question.id));
  }
});

test('option shuffling retains the authored correct text without mutating the bank', () => {
  const original = JSON.stringify(allQuestions);
  let shuffledCount = 0;
  for (const question of createDailyPaper('2026-11-04')) {
    const authored = allQuestions.find(item => item.id === question.id)!;
    assert.equal(question.options[question.answer], authored.options[authored.answer]);
    assert.deepEqual([...question.options].sort(), [...authored.options].sort());
    if (question.options.join('|') !== authored.options.join('|')) shuffledCount++;
  }
  assert.ok(shuffledCount > 0);
  const snapshot = createDailyPaper('2026-11-04');
  snapshot[0].options[0] = 'mutated snapshot';
  snapshot.find(question => question.passage)!.passage!.title = 'mutated passage';
  assert.equal(JSON.stringify(allQuestions), original);
  assert.notEqual(createDailyPaper('2026-11-04')[0].options[0], 'mutated snapshot');
});

test('public payload explicitly excludes answers, explanations and unknown private fields', () => {
  const question = CHALLENGE_READING[0];
  const contaminated = {
    ...question,
    privateSecret: 'do not expose',
    passage: { ...question.passage!, privateAnswer: 'do not expose' },
  };
  const [publicQuestion] = publicQuestions([contaminated]);
  assert.deepEqual(Object.keys(publicQuestion).sort(), ['id', 'category', 'level', 'prompt', 'options', 'passage'].sort());
  assert.deepEqual(Object.keys(publicQuestion.passage!).sort(), ['id', 'text', 'title']);
  assert.equal('answer' in publicQuestion, false);
  assert.equal('explanation' in publicQuestion, false);
  assert.equal(JSON.stringify(publicQuestion).includes('do not expose'), false);
  publicQuestion.options[0] = 'public mutation';
  publicQuestion.passage!.title = 'public passage mutation';
  assert.notEqual(question.options[0], 'public mutation');
  assert.notEqual(question.passage!.title, 'public passage mutation');
});

test('server grading counts blank answers and applies exactly four wrong per lost net point', () => {
  const questions = createDailyPaper('2026-11-04');
  const answers = questions.map((question, index) => index < 30 ? question.answer : index < 46 ? (question.answer + 1) % 5 : null);
  assert.deepEqual(scoreChallenge(questions, answers), { correct: 30, incorrect: 16, unanswered: 4, net: 26, netQuarter: 104 });
  assert.deepEqual(scoreChallenge(questions, questions.map(question => question.answer)), { correct: 50, incorrect: 0, unanswered: 0, net: 50, netQuarter: 200 });
  assert.deepEqual(scoreChallenge(questions, questions.map(question => (question.answer + 1) % 5)), { correct: 0, incorrect: 50, unanswered: 0, net: -12.5, netQuarter: -50 });
  assert.deepEqual(scoreChallenge(questions, Array(50).fill(null)), { correct: 0, incorrect: 0, unanswered: 50, net: 0, netQuarter: 0 });
});

test('answer validation rejects malformed, sparse, out-of-range and coerced values', () => {
  const valid = Array.from({ length: 50 }, (_, index) => index % 6 === 5 ? null : index % 6);
  assert.deepEqual(validateAnswers(valid), valid);
  assert.notEqual(validateAnswers(valid), valid);
  for (const value of [null, {}, '0', Array(49).fill(null), Array(51).fill(null), new Array(50)]) assert.throws(() => validateAnswers(value));
  for (const value of ['0', undefined, NaN, Infinity, -1, 5, 0.5, true, {}, []]) {
    assert.throws(() => validateAnswers([value, ...Array(49).fill(null)]));
  }
  assert.deepEqual(validateAnswers([0, null, 4], 3), [0, null, 4]);
  assert.throws(() => scoreChallenge(createDailyPaper('2026-11-04'), [0]));
});

test('nicknames preserve international letters and count code points, rejecting control characters', () => {
  assert.equal(normalizeNickname('  Çağrı   Öztürk-79  '), 'Çağrı Öztürk-79');
  assert.equal(normalizeNickname('Ελένη_42'), 'Ελένη_42');
  assert.equal(normalizeNickname('Jose\u0301'), 'José');
  assert.equal(normalizeNickname('𐐀'.repeat(20)), '𐐀'.repeat(20));
  for (const value of [null, {}, 5, '', 'A', ' ', '__', '𐐀'.repeat(21), 'a'.repeat(21), '<script>', 'user@example.com', '😀User', 'name\n', 'name\t', 'a\u200bb', 'a\u202eb', 'name\u0000']) {
    assert.throws(() => normalizeNickname(value));
  }
});

test('bank validation detects duplicate IDs, bad keys and inconsistent reading passage snapshots', () => {
  assert.throws(() => validateChallengeBank([...allQuestions, allQuestions[0]]), /Duplicate/);
  const invalidOption = { ...allQuestions[0], answer: 5 };
  assert.throws(() => validateChallengeBank([invalidOption, ...allQuestions.slice(1)]), /Invalid challenge options/);
  const duplicateOptions = { ...allQuestions[0], options: ['same', 'SAME', 'c', 'd', 'e'] as ChallengeQuestion['options'] };
  assert.throws(() => validateChallengeBank([duplicateOptions, ...allQuestions.slice(1)]), /Invalid challenge options/);
  const readingIndex = allQuestions.findIndex(question => question.category === 'reading');
  const inconsistent = allQuestions.map((question, index) => index === readingIndex ? { ...question, passage: { ...question.passage!, text: 'different passage' } } : question);
  assert.throws(() => validateChallengeBank(inconsistent), /Inconsistent reading passage/);
});
