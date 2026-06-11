import type { Metadata } from 'next';
import Link from 'next/link';

import LevelTopicQuizClient, {
  type LevelTopicQuizQuestion,
  type LevelTopicQuizTopic,
} from '@/components/LevelTopicQuizClient';
import { a1Questions } from '@/data/levels/a1_questions';
import { a1Topics } from '@/data/levels/a1_topics';
import { a2Questions } from '@/data/levels/a2_questions';
import { a2Topics } from '@/data/levels/a2_topics';
import { b1Questions } from '@/data/levels/b1_questions';
import { b1Topics } from '@/data/levels/b1_topics';
import { b2Questions } from '@/data/levels/b2_questions';
import { b2Topics } from '@/data/levels/b2_topics';
import { c1Questions } from '@/data/levels/c1_questions';
import { c1Topics } from '@/data/levels/c1_topics';
import { c2Questions } from '@/data/levels/c2_questions';
import { c2Topics } from '@/data/levels/c2_topics';

type RouteParams = {
  level?: string | string[];
  topic?: string | string[];
};

type LevelTopicPageProps = {
  params: RouteParams;
};

const topicsByLevel: Record<string, LevelTopicQuizTopic[]> = {
  a1: a1Topics,
  a2: a2Topics,
  b1: b1Topics,
  b2: b2Topics,
  c1: c1Topics,
  c2: c2Topics,
};

const questionsByLevel: Record<string, LevelTopicQuizQuestion[]> = {
  a1: a1Questions,
  a2: a2Questions,
  b1: b1Questions,
  b2: b2Questions,
  c1: c1Questions,
  c2: c2Questions,
};

const resolveParam = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] : param || '';

const resolveLevelTopic = (params: RouteParams) => {
  const levelParam = resolveParam(params.level);
  const topicParam = resolveParam(params.topic);
  const levelKey = levelParam.toLowerCase();
  const levelLabel = levelKey.toUpperCase();
  const topics = topicsByLevel[levelKey];
  const allQuestions = questionsByLevel[levelKey];
  const topic = topics?.find((item) => item.slug === topicParam);
  const questions = allQuestions?.filter((question) => question.topic === topicParam) ?? [];

  return {
    levelKey,
    levelLabel,
    topicParam,
    topics,
    allQuestions,
    topic,
    questions,
  };
};

export function generateMetadata({ params }: LevelTopicPageProps): Metadata {
  const { levelKey, levelLabel, topicParam, topic } = resolveLevelTopic(params);
  const canonical = `/levels/${levelKey}/${topicParam}`;
  const title = topic
    ? `${levelLabel} ${topic.title} Grammar Quiz`
    : `${levelLabel || 'English'} Grammar Topic Quiz`;
  const description = topic
    ? `${topic.description} Practise this ${levelLabel} grammar topic with an interactive EnglishMeter quiz.`
    : `Practise English grammar by level with interactive EnglishMeter topic quizzes.`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function LevelTopicPage({ params }: LevelTopicPageProps) {
  const {
    levelKey,
    levelLabel,
    topicParam,
    topics,
    allQuestions,
    topic,
    questions,
  } = resolveLevelTopic(params);

  if (!topics || !allQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">
            Topic quizzes are only available for A1, A2, B1, B2, C1 and C2 for now.
          </p>
          <Link
            className="px-4 py-2 rounded bg-slate-800 text-white"
            href="/levels/a1"
          >
            Go to A1 page
          </Link>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">This topic does not exist for level {levelLabel}.</p>
          <Link
            className="px-4 py-2 rounded bg-slate-800 text-white"
            href={`/levels/${levelKey}`}
          >
            Back to {levelLabel} topics
          </Link>
        </div>
      </div>
    );
  }

  const backHref = `/levels/${levelKey}`;

  return (
    <div className="em-page py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={backHref}
          className="text-sm text-slate-600 dark:text-slate-300 mb-4 inline-flex items-center hover:underline"
        >
          ← Back to {levelLabel} Mixed Test & Topics
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {topic.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">{topic.description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Level {levelLabel} • {questions.length} questions
        </p>

        <LevelTopicQuizClient
          level={levelKey}
          levelLabel={levelLabel}
          topicSlug={topicParam}
          topic={topic}
          questions={questions}
        />
      </div>
    </div>
  );
}
