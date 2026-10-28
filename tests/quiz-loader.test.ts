import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { getQuestionsBySlug, normalizeQuestion, type StandardQuestion } from '../lib/quizManager';
import reading from '../data/yds_reading.json';
import daily from '../data/dailyenglish.json';
import phrasals from '../data/yds_phrasal_verbs.json';
import synonyms from '../data/yds_synonyms.json';
import levelBank from '../data/english_test_questions.json';

function assertPlayable(questions: StandardQuestion[], name: string) {
  assert.ok(questions.length, `${name}: questions must exist`);
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length, `${name}: unique question IDs`);
  for (const question of questions) {
    assert.ok(question.prompt.trim(), `${name}: missing prompt`);
    assert.doesNotMatch(question.prompt, /Question missing\?/);
    assert.ok(question.choices.length >= 2, `${name}: at least two options`);
    assert.equal(question.choices.filter((choice) => choice.isCorrect).length, 1, `${name}: one correct answer`);
    assert.equal(new Set(question.choices.map((choice) => choice.text)).size, question.choices.length, `${name}: distinct options`);
    assert.equal(new Set(question.choices.map((choice) => choice.id)).size, question.choices.length, `${name}: distinct option IDs`);
    for (const choice of question.choices) assert.ok(choice.text.trim(), `${name}: no empty option`);
  }
}

test('normalization retains a fifth correct option in both letter and array formats', () => {
  for (const question of [
    { prompt: 'Choose five.', A: 'one', B: 'two', C: 'three', D: 'four', E: 'five', correct: 'E' },
    { prompt: 'Choose five.', options: ['one', 'two', 'three', 'four', 'five'], answer: 4 },
  ]) {
    const normalized = normalizeQuestion(question, 'fifth-answer', 42)!;
    assert.equal(normalized.choices.length, 5);
    assert.equal(normalized.choices.find((choice) => choice.isCorrect)?.text, 'five');
    assertPlayable([normalized], 'fifth-answer');
  }
});

test('normalization rejects absent keys, empty options and ambiguous single-answer questions', () => {
  for (const question of [
    { prompt: 'No answer key.', A: 'one', B: 'two' },
    { prompt: 'Empty answer.', A: '', B: 'two', correct: 'A' },
    { prompt: 'Multiple answers.', choices: [{ text: 'one', isCorrect: true }, { text: 'two', isCorrect: true }] },
    { choices: [{ text: 'one', isCorrect: true }, { text: 'two', isCorrect: false }] },
  ]) assert.equal(normalizeQuestion(question, 'invalid', 42), null);
});

test('reading includes all forty actual questions with their passage and correct answer', () => {
  const quiz = getQuestionsBySlug('yds-reading');
  assert.equal(quiz.questions.length, 40);
  assert.equal(quiz.duration, 80);
  assertPlayable(quiz.questions, 'reading');
  let index = 0;
  for (const passage of reading) {
    for (const source of passage.questions) {
      const question = quiz.questions[index++];
      assert.ok(question.prompt.includes(passage.text));
      assert.ok(question.prompt.includes(source.prompt));
      assert.equal(question.choices.length, 5);
      assert.equal(question.choices.find((choice) => choice.isCorrect)?.text, source[source.correct as 'A']);
      assert.equal(question.explanation, source.explanation);
    }
  }
});

test('phrasal and synonym word lists become complete questions with factual answers', () => {
  const phrasalQuiz = getQuestionsBySlug('yds-phrasal-verbs');
  const synonymQuiz = getQuestionsBySlug('yds-synonyms');
  assert.equal(phrasalQuiz.questions.length, 100);
  assert.equal(phrasalQuiz.duration, 75);
  assert.equal(synonymQuiz.questions.length, 50);
  for (const [name, quiz] of [['phrasals', phrasalQuiz], ['synonyms', synonymQuiz]] as const) {
    assertPlayable(quiz.questions, name);
    for (const question of quiz.questions) assert.doesNotMatch(question.explanation ?? '', /undefined/);
  }
  for (const question of phrasalQuiz.questions) {
    const word = /"(.+)"\?/.exec(question.prompt)?.[1];
    const correct = question.choices.find((choice) => choice.isCorrect)!.text;
    assert.ok(phrasals.some((source) => source.word.trim() === word && source.meaning.trim() === correct));
  }
  for (const question of synonymQuiz.questions) {
    const word = /"(.+)"\?/.exec(question.prompt)?.[1];
    const correct = question.choices.find((choice) => choice.isCorrect)!.text;
    assert.ok(synonyms.some((source) => source.word === word && source.synonym.trim() === correct));
  }
});

test('all thirty-two YDS exams preserve every answer including the hundred original E answers', () => {
  let originalEAnswers = 0;
  for (let number = 1; number <= 32; number++) {
    const filename = `yds_exam_questions${number === 1 ? '' : `_${number}`}.json`;
    const source = JSON.parse(readFileSync(new URL(`../data/${filename}`, import.meta.url), 'utf8'));
    const quiz = getQuestionsBySlug(`yds-exam-test-${number}`);
    assert.equal(quiz.questions.length, source.length);
    assertPlayable(quiz.questions, filename);
    for (const [index, question] of quiz.questions.entries()) {
      assert.equal(question.choices.find((choice) => choice.isCorrect)!.text, source[index][source[index].correct].trim());
      if (source[index].correct === 'E') originalEAnswers++;
    }
    assert.ok(new Set(quiz.questions.map((question) => question.choices.find((choice) => choice.isCorrect)!.id)).size >= 4);
  }
  assert.equal(originalEAnswers, 100);
});

test('placement selects five valid questions per level and level quizzes avoid fixed first answers', () => {
  const placement = getQuestionsBySlug('quick-placement');
  assert.equal(placement.duration, 20);
  assert.equal(placement.questions.length, 30);
  assertPlayable(placement.questions, 'placement');
  for (const level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
    assert.equal(placement.questions.filter((question) => question.level === level).length, 5);
    const quiz = getQuestionsBySlug(`level-${level.toLowerCase()}`);
    assert.equal(quiz.questions.length, 20);
    assertPlayable(quiz.questions, level);
    const correctPositions = new Set(quiz.questions.map((question) => question.choices.find((choice) => choice.isCorrect)!.id));
    assert.ok(correctPositions.size >= 3, `${level}: answer position must vary`);
  }
});

test('every daily English set has distinct options and covers its complete source slice', () => {
  for (let number = 1; number <= Math.ceil(daily.length / 50); number++) {
    const quiz = getQuestionsBySlug(`daily-english-${number}`);
    const source = daily.slice((number - 1) * 50, number * 50);
    assert.equal(quiz.questions.length, source.length);
    assertPlayable(quiz.questions, `daily-${number}`);
    quiz.questions.forEach((question, index) => {
      assert.equal(question.choices.find((choice) => choice.isCorrect)!.text, source[index].meaning.trim());
    });
  }
});

test('all mini vocabulary sets are playable and alias questions stay identical', () => {
  for (let number = 1; number <= 100; number++) {
    const quiz = getQuestionsBySlug(`yds-5000-mini-${number}`);
    assert.equal(quiz.questions.length, 50);
    assertPlayable(quiz.questions, `mini-${number}`);
  }
  for (const language of ['tr', 'de', 'es', 'it', 'fr']) {
    const quiz = getQuestionsBySlug('yds-5000-mini-12', language);
    assertPlayable(quiz.questions, `mini-12-${language}`);
    assert.deepEqual(quiz.questions, getQuestionsBySlug('yds-3850-mini-12', language).questions);
    assert.deepEqual(quiz.questions, getQuestionsBySlug('yds-3750-mini-12', language).questions);
  }
});

test('grammar and vocabulary quizzes are playable and repeated calls keep question keys stable', () => {
  const slugs = [
    'test-perfect-past', 'test-conditionals', 'test-relatives', 'test-articles',
    'test-tenses-mixed', 'test-passive-voice', 'test-reported-speech',
    'test-gerunds-infinitives', 'test-clauses-advanced', 'test-modals-advanced',
    'test-prepositions-advanced', 'ielts-grammar', 'grammar-mega-test-100',
    'vocab-b1-c1-50', 'yds-conjunctions', 'yds-grammar', 'quick-placement',
  ];
  for (const slug of slugs) {
    const quiz = getQuestionsBySlug(slug);
    assertPlayable(quiz.questions, slug);
    assert.deepEqual(quiz, getQuestionsBySlug(slug));
  }
  const grammar = getQuestionsBySlug('yds-grammar');
  assert.equal(grammar.questions.length, 100);
  assert.equal(grammar.duration, 90);
  assert.deepEqual(grammar, getQuestionsBySlug('yds-grammar-practice'));
});

test('unknown and out-of-range slugs never silently start an unrelated or clamped quiz', () => {
  for (const slug of ['missing-quiz', 'level-a3', 'yds-exam-test-33', 'daily-english-0', 'daily-english-44', 'yds-5000-mini-0', 'yds-5000-mini-101', 'yds-3850-mini-78', 'yds-5000-mini-1extra']) {
    assert.equal(getQuestionsBySlug(slug).questions.length, 0, slug);
  }
});

test('the level bank keeps its coverage and every item has one usable answer', () => {
  assert.equal(levelBank.length, 350);
  assert.deepEqual(
    Object.fromEntries(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => [level, levelBank.filter((question) => question.level === level).length])),
    { A1: 101, A2: 26, B1: 66, B2: 52, C1: 57, C2: 48 },
  );
  for (const [index, source] of levelBank.entries()) {
    assert.equal(source.choices.filter((choice) => choice.isCorrect).length, 1, `source item ${index}`);
    assert.ok(normalizeQuestion(source, String(index), index), `playable source item ${index}`);
  }
});

test('repaired stems produce grammatical sentences without duplicated words or phrasal particles', () => {
  const correctedSentences: Array<[number, string]> = [
    [8, "He doesn't like coffee."],
    [69, 'Dogs are my favourite animals. I like dogs.'],
    [125, 'He asked me what my name was.'],
    [128, "You shouldn't have shouted at him. It wasn't his fault."],
    [150, 'He suggested going for a walk.'],
    [151, 'She recommended that I try the new restaurant.'],
    [152, 'He denied knowing anything about the crime.'],
    [153, 'He refused to answer any questions.'],
    [185, 'You need to brush up on your French before the trip.'],
    [186, 'I came across an old friend by chance yesterday.'],
    [189, 'He thinks he is superior to others and looks down on people who are less successful.'],
    [193, 'He took up golf as a new hobby when he retired.'],
    [197, 'I will have been living here for 10 years by next June.'],
    [323, 'At no time had the team been warned about the risks involved.'],
    [330, 'Were his criticism to be taken seriously, he would need to provide concrete evidence.'],
    [344, 'Far be it from me to criticize your efforts; I merely suggest an alternative approach.'],
    [346, 'Unless the hypothesis withstands rigorous testing, it will remain merely conjectural.'],
  ];
  for (const [index, sentence] of correctedSentences) {
    const question = levelBank[index];
    const answer = question.choices.find((choice) => choice.isCorrect)!.text;
    assert.equal(question.prompt.replace('____', answer), sentence, `source item ${index}`);
  }
  assert.doesNotMatch(levelBank[224].prompt, /\(tell\)/);
  assert.match(levelBank[177].prompt, /safely locked/);
  assert.match(levelBank[327].prompt, /present perfect simple/);
  assert.equal(levelBank[327].choices.find((choice) => choice.isCorrect)!.text, 'has declined');
});
