import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVEL_CATALOG, getTopicTestSlug } from '../lib/level-catalog';
import { getLevelTopicTest, getTopicTestBySlug } from '../lib/level-tests';
import { getQuestionsBySlug } from '../lib/quizManager';
import { scoreQuiz } from '../lib/quiz-result';
import { a1Questions } from '../data/levels/a1_questions';
import { a2Questions } from '../data/levels/a2_questions';
import { b1Questions } from '../data/levels/b1_questions';
import { b2Questions } from '../data/levels/b2_questions';
import { c1Questions } from '../data/levels/c1_questions';
import { c2Questions } from '../data/levels/c2_questions';
import sitemap from '../app/sitemap';
import { generateStaticParams, generateMetadata } from '../app/levels/[level]/[topic]/page';

const expectedTopics: Record<string, string[]> = {
  a1: ['present-simple', 'verb-to-be', 'a-an', 'this-that-these-those', 'prepositions-of-place', 'possessive-adjectives', 'subject-pronouns', 'countable-uncountable', 'present-continuous', 'prepositions-of-time', 'there-is-there-are', 'can-cant', 'wh-questions', 'numbers', 'days-months', 'telling-the-time', 'basic-directions'],
  a2: ['past-simple', 'present-continuous', 'countable-uncountable', 'comparatives-superlatives', 'some-any-a-lot-of', 'adverbs-of-frequency', 'past-continuous', 'will-going-to', 'have-to-need-to', 'should-must', 'may-might', 'basic-conjunctions'],
  b1: ['present-perfect', 'past-continuous', 'present-perfect-vs-past-simple', 'first-conditional', 'modals-ability-permission-advice', 'relative-clauses-basic', 'past-perfect', 'passive-voice', 'zero-conditional', 'second-conditional', 'gerunds-infinitives', 'common-phrasal-verbs', 'reported-speech'],
  b2: ['present-perfect-continuous', 'past-perfect', 'passive-voice', 'second-conditional', 'modals-deduction', 'reported-speech-basic', 'third-conditional', 'mixed-conditionals', 'defining-relative-clauses', 'non-defining-relative-clauses', 'causatives', 'noun-clauses', 'inversion'],
  c1: ['mixed-conditionals', 'wish-if-only', 'inversion-emphasis', 'participle-clauses', 'cleft-sentences', 'advanced-relative-clauses', 'subjunctive', 'advanced-idioms', 'academic-language'],
};
const questionsByLevel = { a1: a1Questions, a2: a2Questions, b1: b1Questions, b2: b2Questions, c1: c1Questions, c2: c2Questions };

test('A1–C1 cover every requested subject with 64 complete twenty-question tests', () => {
  let topics = 0;
  let questions = 0;
  for (const level of LEVEL_CATALOG.filter((item) => item.key !== 'c2')) {
    assert.deepEqual(new Set(level.topics.map((topic) => topic.slug)), new Set(expectedTopics[level.key]));
    for (const topic of level.topics) {
      assert.equal(topic.questionCount, 20);
      const quiz = getLevelTopicTest(level.key, topic.slug);
      assert.ok(quiz, `${level.key}/${topic.slug} must be playable`);
      assert.equal(quiz.questions.length, 20);
      assert.equal(quiz.duration, 20);
      assert.equal(new Set(quiz.questions.map((question) => question.prompt.trim().toLowerCase())).size, 20, `${topic.slug}: distinct question prompts`);
      topics++;
      questions += quiz.questions.length;
    }
  }
  assert.equal(topics, 64);
  assert.equal(questions, 1280);
});

test('all level topics preserve correct answers and explanations in the shared quiz engine', () => {
  for (const level of LEVEL_CATALOG) {
    for (const topic of level.topics) {
      const slug = getTopicTestSlug(level.key, topic.slug);
      const test = getTopicTestBySlug(slug);
      assert.ok(test, slug);
      assert.deepEqual(getQuestionsBySlug(slug), test);
      const source = questionsByLevel[level.key].filter((question) => question.topic === topic.slug);
      const answers: Record<string, string> = {};
      for (const question of test.questions) {
        const original = source.find((item) => item.id === question.id)!;
        assert.ok(original, question.id);
        assert.equal(question.level, level.label);
        assert.equal(question.choices.length, 4);
        assert.equal(question.choices.filter((choice) => choice.isCorrect).length, 1);
        const correct = question.choices.find((choice) => choice.isCorrect)!;
        assert.equal(correct.text, original.options[original.correctIndex]);
        assert.equal(question.explanation, original.explanation);
        answers[question.id] = correct.id;
      }
      assert.equal(scoreQuiz(test.questions, answers).percentage, 100, slug);
      assert.equal(scoreQuiz(test.questions, {}).unanswered, topic.questionCount, slug);
    }
  }
});

test('canonical topic routes, generated pages and sitemap cover the same curriculum', () => {
  const generated = new Set(generateStaticParams().map(({ level, topic }) => `/levels/${level}/${topic}`));
  const paths = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
  for (const level of LEVEL_CATALOG) {
    assert.ok(paths.has(`/levels/${level.key}`));
    for (const topic of level.topics) {
      const path = `/levels/${level.key}/${topic.slug}`;
      assert.ok(generated.has(path), path);
      assert.ok(paths.has(path), path);
      const metadata = generateMetadata({ params: { level: level.key, topic: topic.slug } });
      assert.equal(new URL(String(metadata.alternates?.canonical)).pathname, path);
      assert.match(metadata.description ?? '', new RegExp(`${topic.questionCount}-question`));
      assert.equal(paths.has(`/tests/${getTopicTestSlug(level.key, topic.slug)}`), false);
    }
  }
  assert.equal(generated.size, 70);
});

test('invalid topic selectors fail without falling back to an unrelated quiz', () => {
  for (const slug of ['topic-a3-present-simple', 'topic-a1-no-such-topic', 'topic-A1-verb-to-be', 'topic-a1-', 'topic-a1-verb-to-be-extra', 'topic-a1-../verb-to-be']) {
    assert.equal(getTopicTestBySlug(slug), null);
    assert.equal(getQuestionsBySlug(slug).questions.length, 0);
  }
});

test('existing C2 practice remains available with its original question count', () => {
  const c2 = LEVEL_CATALOG.find((level) => level.key === 'c2')!;
  assert.equal(c2.topics.length, 6);
  for (const topic of c2.topics) {
    const quiz = getLevelTopicTest('c2', topic.slug)!;
    assert.equal(quiz.questions.length, 10);
    assert.equal(quiz.duration, 10);
  }
});
