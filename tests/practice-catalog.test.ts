import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { PracticeQuestion, PracticeTest } from '../data/practice/types';
import {
  PRACTICE_TESTS, getPracticeBreadcrumbs, getPracticeCategoryMetadata,
  getPracticeCategoryStructuredData, getPracticeTestMetadata, getPracticeTestPath,
  getPracticeTestSlug, getPracticeTestStructuredData, getPracticeTests,
} from '../lib/practice-catalog';
import { PRACTICE_CATEGORIES, getPracticeCategory } from '../lib/practice-categories';
import {
  getPracticeQuestionPrompt, getPracticeQuiz, getPracticeQuizForTest, validatePracticeTest,
} from '../lib/practice-tests';
import { getQuestionsBySlug } from '../lib/quizManager';
import { scoreQuiz } from '../lib/quiz-result';
import { SITE_URL } from '../lib/seo';
import sitemap from '../app/sitemap';
import {
  generateMetadata as categoryMetadata, generateStaticParams as categoryParams,
} from '../app/practice/[category]/page';
import {
  generateMetadata as practiceMetadata, generateStaticParams as practiceParams,
} from '../app/practice/[category]/[slug]/page';
import {
  generateMetadata as kidsMetadata, generateStaticParams as kidsParams,
} from '../app/kids/[slug]/page';

const isNotFound = (error: unknown) => error instanceof Error && 'digest' in error && error.digest === 'NEXT_NOT_FOUND';
const redirectsTo = (path: string) => (error: unknown) => error instanceof Error && 'digest' in error && String(error.digest).includes(`;${path};308;`);
type SchemaNode = Record<string, unknown>;
const findNode = (graph: { '@graph': SchemaNode[] }, type: string) => {
  const nodes = graph['@graph'].filter((node) => node['@type'] === type);
  assert.equal(nodes.length, 1, `one ${type} node`);
  return nodes[0];
};

test('the new catalogue contains twenty complete tests and 340 distinct questions', () => {
  assert.deepEqual(Object.fromEntries(PRACTICE_CATEGORIES.map((category) => [category.id, getPracticeTests(category.id).length])), {
    reading: 5, vocabulary: 6, 'word-formation': 3, kids: 6,
  });
  assert.deepEqual(getPracticeTests('reading').map((item) => item.level), ['A1', 'A2', 'B1', 'B2', 'C1']);
  assert.deepEqual(getPracticeTests('word-formation').map((item) => item.level), ['B1', 'B2', 'C1']);
  assert.equal(PRACTICE_TESTS.length, 20);
  assert.equal(new Set(PRACTICE_TESTS.map(getPracticeTestSlug)).size, 20);
  const ids = new Set<string>();
  let total = 0;
  for (const item of PRACTICE_TESTS) {
    assert.ok(validatePracticeTest(item), item.slug);
    assert.equal(item.questions.length, item.category === 'kids' ? 10 : 20, item.slug);
    const prompts = new Set<string>();
    for (const question of item.questions) {
      assert.equal(ids.has(question.id), false, `${item.slug}: global duplicate ID ${question.id}`);
      ids.add(question.id);
      // A reading stem may recur for another text; its complete context must differ.
      const prompt = getPracticeQuestionPrompt(item, question).trim().toLowerCase();
      assert.equal(prompts.has(prompt), false, `${item.slug}: duplicate question and context`);
      prompts.add(prompt);
      assert.ok(question.explanation.trim(), question.id);
      total++;
    }
  }
  assert.equal(total, 340);
  assert.equal(ids.size, total);
});

test('the shared quiz adapter preserves every answer and explanation after shuffling', () => {
  const unchangedSource = JSON.stringify(PRACTICE_TESTS);
  for (const item of PRACTICE_TESTS) {
    const slug = getPracticeTestSlug(item);
    const quiz = getPracticeQuiz(slug);
    assert.ok(quiz, slug);
    assert.deepEqual(getQuestionsBySlug(slug), quiz, slug);
    assert.deepEqual(getPracticeQuiz(slug), quiz, `${slug}: deterministic options`);
    const answers: Record<string, string> = {};
    for (const question of quiz.questions) {
      const source = item.questions.find((candidate) => candidate.id === question.id)!;
      assert.ok(source, question.id);
      const correct = question.choices.filter((choice) => choice.isCorrect);
      assert.equal(correct.length, 1, question.id);
      assert.equal(correct[0].text, source.options[source.correctIndex], question.id);
      assert.equal(question.explanation, source.explanation, question.id);
      assert.equal(question.level, item.level, question.id);
      assert.equal(question.choices.length, 4, question.id);
      assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 4, question.id);
      answers[question.id] = correct[0].id;
    }
    const score = scoreQuiz(quiz.questions, answers);
    assert.equal(score.correct, item.questions.length, slug);
    assert.equal(score.percentage, 100, slug);
    assert.equal(scoreQuiz(quiz.questions, {}).unanswered, item.questions.length, slug);
  }
  assert.equal(JSON.stringify(PRACTICE_TESTS), unchangedSource, 'preparing a test never mutates its source');
});

test('each reading question includes its full original passage, with five questions per text', () => {
  for (const item of getPracticeTests('reading')) {
    assert.equal(item.passages?.length, 4, item.slug);
    const quiz = getPracticeQuizForTest(item)!;
    for (const passage of item.passages!) {
      const questions = item.questions.filter((question) => question.passageId === passage.id);
      assert.equal(questions.length, 5, passage.id);
      assert.ok(passage.text.trim().split(/\s+/).length >= 65, `${passage.id}: actual reading text`);
      for (const source of questions) {
        const prepared = quiz.questions.find((question) => question.id === source.id)!;
        assert.ok(prepared.prompt.includes(passage.title), source.id);
        assert.ok(prepared.prompt.includes(passage.text), source.id);
        assert.ok(prepared.prompt.endsWith(source.prompt), source.id);
      }
    }
  }
});

test('incomplete or malformed reading data cannot start a quiz', () => {
  const source = getPracticeTests('reading')[0];
  const firstQuestion = (patch: Partial<PracticeQuestion>): PracticeTest => ({
    ...source, questions: [{ ...source.questions[0], ...patch }, ...source.questions.slice(1)],
  });
  const variants: PracticeTest[] = [
    { ...source, passages: undefined },
    { ...source, passages: source.passages!.slice(1) },
    { ...source, passages: [source.passages![0], source.passages![0], ...source.passages!.slice(2)] },
    { ...source, passages: [{ ...source.passages![0], text: '' }, ...source.passages!.slice(1)] },
    { ...source, questions: source.questions.slice(1) },
    firstQuestion({ passageId: undefined }),
    firstQuestion({ passageId: 'missing-passage' }),
    firstQuestion({ passageId: source.passages![1].id }),
    firstQuestion({ id: source.questions[1].id }),
    firstQuestion({ explanation: '' }),
    firstQuestion({ options: ['same', 'SAME', 'third', 'fourth'] }),
    firstQuestion({ correctIndex: 4 as PracticeQuestion['correctIndex'] }),
  ];
  for (const [index, invalid] of variants.entries()) {
    assert.equal(validatePracticeTest(invalid), false, `invalid fixture ${index}`);
    assert.equal(getPracticeQuizForTest(invalid), null, `invalid fixture ${index}`);
  }
  assert.equal(getPracticeQuestionPrompt(source, { ...source.questions[0], passageId: 'missing-passage' }), '');
});

test('all 24 canonical practice URLs have unique metadata, generated routes and sitemap entries', () => {
  const entries = sitemap();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const expected = new Set([...PRACTICE_CATEGORIES.map((category) => category.path), ...PRACTICE_TESTS.map(getPracticeTestPath)]);
  assert.equal(expected.size, 24);
  const generated = new Set([
    ...categoryParams().map(({ category }) => `/practice/${category}`), '/kids',
    ...practiceParams().map(({ category, slug }) => `/practice/${category}/${slug}`),
    ...kidsParams().map(({ slug }) => `/kids/${slug}`),
  ]);
  assert.deepEqual(generated, expected);
  const pages = [
    ...PRACTICE_CATEGORIES.map((category) => ({ path: category.path, metadata: getPracticeCategoryMetadata(category) })),
    ...PRACTICE_TESTS.map((item) => ({
      path: getPracticeTestPath(item),
      metadata: item.category === 'kids'
        ? kidsMetadata({ params: { slug: item.slug } })
        : practiceMetadata({ params: { category: item.category, slug: item.slug } }),
    })),
  ];
  for (const { path, metadata } of pages) {
    const url = `${SITE_URL}${path}`;
    assert.equal(path, path.toLowerCase());
    assert.equal(entries.filter((entry) => entry.url === url).length, 1, path);
    assert.equal(metadata.alternates?.canonical, url, path);
    assert.equal((metadata.openGraph as { url: string }).url, url, path);
    assert.ok(metadata.description, path);
    assert.equal(titles.has(String(metadata.title)), false, `${path}: unique title`);
    assert.equal(descriptions.has(metadata.description!), false, `${path}: unique description`);
    titles.add(String(metadata.title));
    descriptions.add(metadata.description!);
  }
  assert.equal(entries.some((entry) => new URL(entry.url).pathname.startsWith('/practice/kids')), false);
  assert.equal(entries.some((entry) => new URL(entry.url).pathname.startsWith('/tests/practice-')), false);
});

test('practice structured data matches the catalogue and does not time the Kids quizzes', () => {
  for (const category of PRACTICE_CATEGORIES) {
    const collection = findNode(getPracticeCategoryStructuredData(category), 'CollectionPage');
    const list = collection.mainEntity as { numberOfItems: number; itemListElement: { url: string }[] };
    assert.equal(list.numberOfItems, getPracticeTests(category.id).length);
    assert.deepEqual(list.itemListElement.map((item) => item.url), getPracticeTests(category.id).map((item) => `${SITE_URL}${getPracticeTestPath(item)}`));
  }
  for (const item of PRACTICE_TESTS) {
    const graph = getPracticeTestStructuredData(item);
    const quiz = findNode(graph, 'Quiz');
    const page = findNode(graph, 'WebPage');
    const url = `${SITE_URL}${getPracticeTestPath(item)}`;
    assert.equal(quiz.url, url);
    assert.equal(quiz['@id'], `${url}#quiz`);
    assert.deepEqual(page.mainEntity, { '@id': `${url}#quiz` });
    assert.equal(quiz.isAccessibleForFree, true);
    assert.equal(quiz.inLanguage, 'en');
    assert.equal(quiz.educationalLevel, item.level);
    assert.deepEqual(quiz.teaches, item.learningGoals);
    assert.ok(String(quiz.description).includes(`${item.questions.length} questions`));
    assert.equal(quiz.timeRequired, item.category === 'kids' ? undefined : `PT${item.duration}M`);
    assert.equal(quiz.numberOfQuestions, undefined);
    assert.equal(quiz.aggregateRating, undefined);
  }
});

test('breadcrumbs describe the same canonical hierarchy on category and test pages', () => {
  for (const category of PRACTICE_CATEGORIES) {
    for (const item of [undefined, ...getPracticeTests(category.id)]) {
      const crumbs = getPracticeBreadcrumbs(category, item);
      const graph = item ? getPracticeTestStructuredData(item) : getPracticeCategoryStructuredData(category);
      assert.equal(crumbs[0].path, '/');
      assert.equal(crumbs[1].path, category.path);
      assert.equal(crumbs.at(-1)?.path, item ? getPracticeTestPath(item) : category.path);
      assert.deepEqual(findNode(graph, 'BreadcrumbList').itemListElement, crumbs.map((crumb, index) => ({
        '@type': 'ListItem', position: index + 1, name: crumb.name, item: `${SITE_URL}${crumb.path}`,
      })));
    }
  }
});

test('practice pages are indexable in production and excluded from indexing in preview', () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const [environment, index] of [['production', true], ['preview', false]] as const) {
      process.env.VERCEL_ENV = environment;
      for (const category of PRACTICE_CATEGORIES) assert.deepEqual(getPracticeCategoryMetadata(category).robots, { index, follow: true });
      for (const item of PRACTICE_TESTS) assert.deepEqual(getPracticeTestMetadata(item).robots, { index, follow: true });
    }
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});

test('invalid selectors fail cleanly and public aliases redirect to canonical paths', () => {
  for (const slug of ['practice-reading-missing', 'practice-writing-a1', 'practice-reading-A1-reading', 'practice-kids-unknown', 'practice-vocabulary-a1-reading']) {
    assert.equal(getPracticeQuiz(slug), null, slug);
    assert.equal(getQuestionsBySlug(slug).questions.length, 0, slug);
  }
  assert.equal(getPracticeCategory('missing'), undefined);
  assert.throws(() => categoryMetadata({ params: { category: 'missing' } }), isNotFound);
  assert.throws(() => practiceMetadata({ params: { category: 'reading', slug: 'unknown' } }), isNotFound);
  assert.throws(() => practiceMetadata({ params: { category: 'vocabulary', slug: 'a1-reading' } }), isNotFound);
  assert.throws(() => kidsMetadata({ params: { slug: 'unknown' } }), isNotFound);
  assert.throws(() => categoryMetadata({ params: { category: 'READING' } }), redirectsTo('/practice/reading'));
  assert.throws(() => practiceMetadata({ params: { category: 'READING', slug: 'A1-READING' } }), redirectsTo('/practice/reading/a1-reading'));
  assert.throws(() => categoryMetadata({ params: { category: 'kids' } }), redirectsTo('/kids'));
  assert.throws(() => practiceMetadata({ params: { category: 'kids', slug: 'animals' } }), redirectsTo('/kids/animals'));
});

test('the B1–C1 vocabulary challenge keeps fifty questions and excludes C2 content', () => {
  const quiz = getQuestionsBySlug('vocab-b1-c1-50');
  assert.equal(quiz.questions.length, 50);
  assert.equal(quiz.duration, 40);
  for (const question of quiz.questions) assert.ok(['B1', 'B2', 'C1'].includes(question.level ?? ''), question.id);
  for (const level of ['B1', 'B2', 'C1']) assert.ok(quiz.questions.some((question) => question.level === level), level);
});
