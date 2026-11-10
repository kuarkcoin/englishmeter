import assert from 'node:assert/strict';
import { test } from 'node:test';
import { IELTS_GRAMMAR_TESTS } from '../data/ielts';
import type { PracticeTest } from '../data/practice/types';
import { PRACTICE_TESTS, getPracticeTestPath, getPracticeTestSlug, getPracticeTestStructuredData } from '../lib/practice-catalog';
import { getPracticeQuizForTest, validatePracticeTest } from '../lib/practice-tests';
import { getQuestionsBySlug } from '../lib/quizManager';
import { scoreQuiz } from '../lib/quiz-result';
import { SITE_URL } from '../lib/seo';
import sitemap from '../app/sitemap';
import { generateMetadata as hubMetadata } from '../app/ielts-grammar-tests/page';
import { generateMetadata as detailMetadata, generateStaticParams } from '../app/ielts-grammar-tests/[slug]/page';
import { generateMetadata as practiceCategoryMetadata } from '../app/practice/[category]/page';
import { generateMetadata as practiceDetailMetadata } from '../app/practice/[category]/[slug]/page';

const isNotFound = (error: unknown) => error instanceof Error && 'digest' in error && error.digest === 'NEXT_NOT_FOUND';
const redirectsTo = (path: string) => (error: unknown) => error instanceof Error && 'digest' in error && String(error.digest).includes(`;${path};308;`);

test('IELTS offers ten distinct, numbered 15-question tests with explanations and original guides', () => {
  assert.equal(IELTS_GRAMMAR_TESTS.length, 10);
  assert.deepEqual(IELTS_GRAMMAR_TESTS.map((item) => item.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const ids = new Set<string>();
  const prompts = new Set<string>();
  const guideBodies = new Set<string>();
  for (const item of IELTS_GRAMMAR_TESTS) {
    assert.equal(item.category, 'ielts-grammar');
    assert.equal(item.questions.length, 15, item.slug);
    assert.equal(item.duration, 15, item.slug);
    assert.ok(['B1', 'B2', 'C1'].includes(item.level));
    assert.equal(validatePracticeTest(item), true, item.slug);
    assert.ok(PRACTICE_TESTS.includes(item), item.slug);
    assert.match(item.slug, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(item.guide.length >= 3, item.slug);
    for (const section of item.guide) {
      assert.ok(section.heading.trim() && section.body.trim() && section.example.trim(), item.slug);
      assert.equal(guideBodies.has(section.body), false, `${item.slug}: repeated lesson`);
      guideBodies.add(section.body);
    }
    for (const question of item.questions) {
      assert.equal(ids.has(question.id), false, `duplicate id ${question.id}`);
      assert.equal(prompts.has(question.prompt.trim().toLowerCase()), false, `duplicate question ${question.id}`);
      ids.add(question.id);
      prompts.add(question.prompt.trim().toLowerCase());
      assert.ok(question.explanation.trim().split(/\s+/).length >= 10, `${question.id}: useful explanation`);
    }
  }
  assert.equal(ids.size, 150);
  assert.equal(prompts.size, 150);
});

test('each IELTS test loads through the existing quiz engine and grades correct, wrong and blank answers', () => {
  const original = JSON.stringify(IELTS_GRAMMAR_TESTS);
  for (const source of IELTS_GRAMMAR_TESTS) {
    const quiz = getQuestionsBySlug(getPracticeTestSlug(source));
    assert.equal(quiz.questions.length, 15, source.slug);
    assert.equal(quiz.duration, 15);
    assert.equal(quiz.title, source.title);
    const answers: Record<string, string> = {};
    for (const [index, question] of quiz.questions.entries()) {
      const authored = source.questions.find((item) => item.id === question.id)!;
      const correct = question.choices.filter((choice) => choice.isCorrect);
      assert.equal(correct.length, 1, question.id);
      assert.equal(correct[0].text, authored.options[authored.correctIndex], question.id);
      assert.equal(question.explanation, authored.explanation);
      if (index < 5) answers[question.id] = correct[0].id;
      else if (index < 10) answers[question.id] = question.choices.find((choice) => !choice.isCorrect)!.id;
    }
    const score = scoreQuiz(quiz.questions, answers);
    assert.equal(score.correct, 5, source.slug);
    assert.equal(score.incorrect, 5, source.slug);
    assert.equal(score.unanswered, 5, source.slug);
    assert.equal(score.percentage, 33, source.slug);
  }
  assert.equal(JSON.stringify(IELTS_GRAMMAR_TESTS), original, 'loading preserves source data');
});

test('incomplete IELTS tests and invalid selectors fail without loading another quiz', () => {
  const source = IELTS_GRAMMAR_TESTS[0];
  const malformed: PracticeTest[] = [
    { ...source, questions: source.questions.slice(1) },
    { ...source, questions: [...source.questions, { ...source.questions[0], id: 'extra' }] },
    { ...source, questions: [{ ...source.questions[0], explanation: '' }, ...source.questions.slice(1)] },
  ];
  for (const item of malformed) {
    assert.equal(validatePracticeTest(item), false);
    assert.equal(getPracticeQuizForTest(item), null);
  }
  for (const selector of ['practice-ielts-grammar-unknown', 'practice-ielts-grammar', 'practice-ielts-grammar-1']) {
    assert.equal(getQuestionsBySlug(selector).questions.length, 0, selector);
  }
});

test('all eleven IELTS landing pages have unique canonical metadata and one sitemap entry each', () => {
  assert.deepEqual(generateStaticParams(), IELTS_GRAMMAR_TESTS.map((item) => ({ slug: item.slug })));
  const entries = sitemap();
  const pages = [
    { path: '/ielts-grammar-tests', metadata: hubMetadata() },
    ...IELTS_GRAMMAR_TESTS.map((item) => ({
      path: getPracticeTestPath(item), metadata: detailMetadata({ params: { slug: item.slug } }),
    })),
  ];
  assert.equal(new Set(pages.map((page) => String(page.metadata.title))).size, 11);
  assert.equal(new Set(pages.map((page) => page.metadata.description)).size, 11);
  for (const { path, metadata } of pages) {
    const url = `${SITE_URL}${path}`;
    assert.equal(metadata.alternates?.canonical, url, path);
    assert.equal((metadata.openGraph as { url: string }).url, url, path);
    assert.ok(metadata.description?.trim(), path);
    assert.equal(entries.filter((entry) => entry.url === url).length, 1, path);
  }
  assert.equal(entries.some((entry) => new URL(entry.url).pathname.startsWith('/practice/ielts-grammar')), false);
  assert.equal(entries.some((entry) => new URL(entry.url).pathname.startsWith('/tests/practice-ielts-grammar')), false);
});

test('IELTS public routes reject unknown tests and redirect aliases to the dedicated canonical pages', () => {
  const source = IELTS_GRAMMAR_TESTS[0];
  assert.throws(() => detailMetadata({ params: { slug: 'not-a-test' } }), isNotFound);
  assert.throws(() => detailMetadata({ params: { slug: source.slug.toUpperCase() } }), redirectsTo(getPracticeTestPath(source)));
  assert.throws(() => practiceCategoryMetadata({ params: { category: 'ielts-grammar' } }), redirectsTo('/ielts-grammar-tests'));
  assert.throws(() => practiceDetailMetadata({ params: { category: 'ielts-grammar', slug: source.slug } }), redirectsTo(getPracticeTestPath(source)));
});

test('IELTS pages are indexable in production while preview deployments remain excluded', () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const [environment, index] of [['production', true], ['preview', false]] as const) {
      process.env.VERCEL_ENV = environment;
      const pages = [hubMetadata(), ...IELTS_GRAMMAR_TESTS.map((item) => detailMetadata({ params: { slug: item.slug } }))];
      for (const metadata of pages) assert.deepEqual(metadata.robots, { index, follow: true });
    }
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});

test('IELTS quiz structured data matches the actual free English practice without claiming official scores', () => {
  for (const item of IELTS_GRAMMAR_TESTS) {
    const graph = getPracticeTestStructuredData(item);
    const quiz = graph['@graph'].find((node) => node['@type'] === 'Quiz')! as Record<string, unknown>;
    assert.equal(quiz.url, `${SITE_URL}${getPracticeTestPath(item)}`);
    assert.equal(quiz.inLanguage, 'en');
    assert.equal(quiz.isAccessibleForFree, true);
    assert.equal(quiz.timeRequired, 'PT15M');
    assert.equal(quiz.educationalLevel, item.level);
    assert.ok(String(quiz.description).includes('15 questions'));
    assert.equal('aggregateRating' in quiz, false);
    assert.equal('offers' in quiz, false);
  }
});
