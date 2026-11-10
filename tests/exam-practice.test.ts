import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { PracticeTest } from '../data/practice/types';
import { getPracticeCategory } from '../lib/practice-categories';
import { getPracticeTests, getPracticeTestPath, getPracticeTestSlug, getPracticeTestStructuredData } from '../lib/practice-catalog';
import { getPracticeQuizForTest, validatePracticeTest } from '../lib/practice-tests';
import { getQuestionsBySlug } from '../lib/quizManager';
import { scoreQuiz } from '../lib/quiz-result';
import { SITE_URL } from '../lib/seo';
import sitemap from '../app/sitemap';
import { getExamCategoryMetadata, getExamTestMetadata, getExamTestStaticParams } from '../components/ExamPracticePages';
import { generateMetadata as practiceCategoryMetadata } from '../app/practice/[category]/page';
import { generateMetadata as practiceTestMetadata } from '../app/practice/[category]/[slug]/page';

const categories = ['business-english', 'toeic-reading', 'cambridge-use-of-english'] as const;
const tests = categories.flatMap((category) => [...getPracticeTests(category)]);
const isNotFound = (error: unknown) => error instanceof Error && 'digest' in error && error.digest === 'NEXT_NOT_FOUND';
const redirectsTo = (path: string) => (error: unknown) => error instanceof Error && 'digest' in error && String(error.digest).includes(`;${path};308;`);

test('the new exam and workplace catalogue has ten complete tests and 184 distinct questions', () => {
  assert.deepEqual(categories.map((category) => getPracticeTests(category).length), [3, 3, 4]);
  assert.equal(tests.length, 10);
  assert.equal(tests.reduce((total, item) => total + item.questions.length, 0), 184);
  const ids = new Set<string>();
  const prompts = new Set<string>();
  const guides = new Set<string>();
  for (const item of tests) {
    assert.ok(validatePracticeTest(item), item.slug);
    assert.equal(item.questions.length, item.category === 'cambridge-use-of-english' ? 16 : 20);
    assert.ok(item.guide && item.guide.length >= 3, `${item.slug}: meaningful study guide`);
    for (const lesson of item.guide!) {
      assert.ok(lesson.heading.trim() && lesson.body.trim() && lesson.example.trim());
      assert.equal(guides.has(lesson.body), false, `${item.slug}: repeated guide`);
      guides.add(lesson.body);
    }
    for (const question of item.questions) {
      assert.equal(ids.has(question.id), false, `duplicate ID ${question.id}`);
      ids.add(question.id);
      const context = `${question.passageId ?? ''}:${question.prompt.trim().toLowerCase()}`;
      assert.equal(prompts.has(context), false, `duplicate question ${question.id}`);
      prompts.add(context);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option) => option.trim().toLowerCase())).size, 4);
      assert.ok(question.explanation.trim().split(/\s+/).length >= 10, `${question.id}: useful explanation`);
    }
  }
  assert.equal(ids.size, 184);
});

test('Cambridge Part 1 practice preserves two eight-gap texts and all contextual answers', () => {
  const cambridge = getPracticeTests('cambridge-use-of-english');
  assert.deepEqual(cambridge.map((item) => item.level), ['B2', 'B2', 'C1', 'C1']);
  for (const item of cambridge) {
    assert.equal(item.passages?.length, 2, item.slug);
    for (const passage of item.passages!) {
      assert.equal(item.questions.filter((question) => question.passageId === passage.id).length, 8);
      const gaps = [...passage.text.matchAll(/\((\d+)\)\s*_+/g)].map((match) => Number(match[1]));
      assert.deepEqual(gaps, [1, 2, 3, 4, 5, 6, 7, 8], `${passage.id}: eight ordered gaps`);
      assert.ok(passage.text.trim().split(/\s+/).length >= 130, `${passage.id}: original extended text`);
    }
  }
});

test('TOEIC practice has distinct sentence, text-completion and comprehension formats', () => {
  const toeic = getPracticeTests('toeic-reading');
  const sentences = toeic.find((item) => item.slug === 'incomplete-sentences')!;
  const completion = toeic.find((item) => item.slug === 'text-completion')!;
  const reading = toeic.find((item) => item.slug === 'reading-comprehension')!;
  assert.ok(sentences && completion && reading);
  assert.equal(sentences.questions.some((question) => question.passageId), false);
  for (const [item, passageCount, questionsPerPassage] of [[completion, 5, 4], [reading, 4, 5]] as const) {
    assert.equal(item.passages?.length, passageCount, item.slug);
    for (const passage of item.passages!) {
      assert.equal(item.questions.filter((question) => question.passageId === passage.id).length, questionsPerPassage);
      assert.ok(passage.text.trim().split(/\s+/).length >= 90, passage.id);
      if (item === completion) {
        const gaps = [...passage.text.matchAll(/\((\d+)\)\s*_+/g)].map((match) => Number(match[1]));
        assert.deepEqual(gaps, [1, 2, 3, 4], `${passage.id}: four ordered gaps`);
      }
    }
  }
});

test('the shared engine preserves full passages, explanations and scores for all 184 new answers', () => {
  const snapshot = JSON.stringify(tests);
  for (const source of tests) {
    const quiz = getQuestionsBySlug(getPracticeTestSlug(source));
    assert.equal(quiz.title, source.title);
    assert.equal(quiz.duration, source.duration);
    assert.equal(quiz.questions.length, source.questions.length);
    const mixed: Record<string, string> = {};
    const allCorrect: Record<string, string> = {};
    for (const [index, question] of quiz.questions.entries()) {
      const authored = source.questions.find((candidate) => candidate.id === question.id)!;
      const correct = question.choices.filter((choice) => choice.isCorrect);
      assert.equal(correct.length, 1, question.id);
      assert.equal(correct[0].text, authored.options[authored.correctIndex], question.id);
      assert.equal(question.explanation, authored.explanation);
      const passage = source.passages?.find((candidate) => candidate.id === authored.passageId);
      if (passage) {
        assert.ok(question.prompt.includes(passage.title), question.id);
        assert.ok(question.prompt.includes(passage.text), question.id);
      }
      assert.ok(question.prompt.endsWith(authored.prompt), question.id);
      allCorrect[question.id] = correct[0].id;
      if (index < 5) mixed[question.id] = correct[0].id;
      else if (index < 10) mixed[question.id] = question.choices.find((choice) => !choice.isCorrect)!.id;
    }
    const score = scoreQuiz(quiz.questions, mixed);
    assert.equal(score.correct, 5);
    assert.equal(score.incorrect, 5);
    assert.equal(score.unanswered, source.questions.length - 10);
    assert.equal(score.percentage, Math.round(500 / source.questions.length));
    assert.equal(scoreQuiz(quiz.questions, allCorrect).percentage, 100);
  }
  assert.equal(JSON.stringify(tests), snapshot, 'preparing questions never changes the source');
});

test('missing or malformed passages and wrong question counts cannot start contextual tests', () => {
  for (const source of tests.filter((item) => item.passages?.length)) {
    const variants: PracticeTest[] = [
      { ...source, questions: source.questions.slice(1) },
      { ...source, passages: undefined },
      { ...source, passages: source.passages!.slice(1) },
      { ...source, passages: [{ ...source.passages![0], text: '' }, ...source.passages!.slice(1)] },
      { ...source, passages: [source.passages![0], source.passages![0], ...source.passages!.slice(2)] },
      { ...source, questions: [{ ...source.questions[0], passageId: undefined }, ...source.questions.slice(1)] },
      { ...source, questions: [{ ...source.questions[0], passageId: 'missing' }, ...source.questions.slice(1)] },
    ];
    for (const invalid of variants) {
      assert.equal(validatePracticeTest(invalid), false, source.slug);
      assert.equal(getPracticeQuizForTest(invalid), null, source.slug);
    }
  }
  for (const category of categories) assert.equal(getQuestionsBySlug(`practice-${category}-missing`).questions.length, 0);
});

test('all thirteen new category and test pages use unique www canonical metadata and sitemap entries', () => {
  assert.equal(SITE_URL, 'https://www.englishmeter.net');
  const entries = sitemap();
  const pages = categories.flatMap((id) => {
    const category = getPracticeCategory(id)!;
    assert.deepEqual(getExamTestStaticParams(id), getPracticeTests(id).map((item) => ({ slug: item.slug })));
    return [
      { path: category.path, metadata: getExamCategoryMetadata(id) },
      ...getPracticeTests(id).map((item) => ({ path: getPracticeTestPath(item), metadata: getExamTestMetadata(id, item.slug) })),
    ];
  });
  assert.equal(pages.length, 13);
  assert.equal(new Set(pages.map((page) => String(page.metadata.title))).size, 13);
  assert.equal(new Set(pages.map((page) => page.metadata.description)).size, 13);
  for (const { path, metadata } of pages) {
    const url: string = `${SITE_URL}${path}`;
    assert.equal(metadata.alternates?.canonical, url);
    assert.equal((metadata.openGraph as { url: string }).url, url);
    assert.ok(metadata.description?.trim());
    assert.equal(entries.filter((entry) => entry.url === url).length, 1, path);
  }
  for (const category of categories) {
    assert.equal(entries.some((entry) => new URL(entry.url).pathname.startsWith(`/practice/${category}`)), false);
  }
});

test('new practice routes reject unknown slugs and redirect aliases without duplicate content', () => {
  for (const category of categories) {
    const source = getPracticeTests(category)[0];
    assert.throws(() => getExamTestMetadata(category, 'unknown-test'), isNotFound);
    assert.throws(() => getExamTestMetadata(category, source.slug.toUpperCase()), redirectsTo(getPracticeTestPath(source)));
    assert.throws(() => practiceCategoryMetadata({ params: { category } }), redirectsTo(getPracticeCategory(category)!.path));
    assert.throws(() => practiceTestMetadata({ params: { category, slug: source.slug } }), redirectsTo(getPracticeTestPath(source)));
  }
});

test('new pages remain indexable only outside preview and structured data describes actual practice', () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const [environment, index] of [['production', true], ['preview', false]] as const) {
      process.env.VERCEL_ENV = environment;
      for (const category of categories) {
        assert.deepEqual(getExamCategoryMetadata(category).robots, { index, follow: true });
        for (const item of getPracticeTests(category)) {
          assert.deepEqual(getExamTestMetadata(category, item.slug).robots, { index, follow: true });
          const graph = getPracticeTestStructuredData(item);
          const quiz = graph['@graph'].find((node) => node['@type'] === 'Quiz')! as Record<string, unknown>;
          assert.equal(quiz.url, `${SITE_URL}${getPracticeTestPath(item)}`);
          assert.equal(quiz.inLanguage, 'en');
          assert.equal(quiz.isAccessibleForFree, true);
          assert.equal(quiz.educationalLevel, item.level);
          assert.ok(String(quiz.description).includes(`${item.questions.length} questions`));
          assert.equal('aggregateRating' in quiz, false);
        }
      }
    }
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});
