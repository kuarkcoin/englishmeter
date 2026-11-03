import { a1Questions } from '@/data/levels/a1_questions';
import { a2Questions } from '@/data/levels/a2_questions';
import { b1Questions } from '@/data/levels/b1_questions';
import { b2Questions } from '@/data/levels/b2_questions';
import { c1Questions } from '@/data/levels/c1_questions';
import { c2Questions } from '@/data/levels/c2_questions';
import { getLevelDefinition, type LevelKey } from '@/lib/level-catalog';
import { prepareTopicQuestions, type TopicQuestion } from '@/lib/topic-quiz';
import type { StandardQuestion } from '@/lib/quizManager';

export { getTopicTestSlug } from '@/lib/level-catalog';

type CurriculumQuestion = TopicQuestion & { level: string; topic: string };

const questionsByLevel: Record<LevelKey, readonly CurriculumQuestion[]> = {
  a1: a1Questions, a2: a2Questions, b1: b1Questions,
  b2: b2Questions, c1: c1Questions, c2: c2Questions,
};

export type LevelTopicTest = {
  title: string;
  duration: number;
  questions: StandardQuestion[];
};

export function getLevelTopicTest(level: string, topicSlug: string): LevelTopicTest | null {
  const definition = getLevelDefinition(level);
  const topic = definition?.topics.find((item) => item.slug === topicSlug);
  if (!definition || !topic) return null;

  const source = questionsByLevel[definition.key].filter((question) => question.topic === topicSlug);
  if (
    source.length !== topic.questionCount || source.length === 0 ||
    new Set(source.map((question) => question.id)).size !== source.length ||
    source.some((question) =>
      question.level.toLowerCase() !== definition.key ||
      !question.question.trim() || !question.explanation.trim() ||
      question.options.length !== 4 ||
      question.options.some((option) => !option.trim()) ||
      new Set(question.options).size !== question.options.length ||
      !Number.isInteger(question.correctIndex) ||
      question.correctIndex < 0 || question.correctIndex >= question.options.length
    )
  ) return null;

  return {
    title: `${definition.label} · ${topic.title}`,
    duration: definition.duration,
    questions: prepareTopicQuestions(source).map((question) => ({
      id: question.id,
      level: question.level,
      prompt: question.question,
      explanation: question.explanation,
      choices: question.options.map((text, index) => ({
        id: String.fromCharCode(97 + index),
        text,
        isCorrect: index === question.correctIndex,
      })),
    })),
  };
}

export function getTopicTestBySlug(slug: string): LevelTopicTest | null {
  const match = /^topic-(a1|a2|b1|b2|c1|c2)-([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(slug);
  return match ? getLevelTopicTest(match[1], match[2]) : null;
}
