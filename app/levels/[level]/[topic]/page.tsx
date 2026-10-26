import { notFound, permanentRedirect } from 'next/navigation';
import { buildSeoMetadata } from '@/lib/seo';
import { a1Topics } from '@/data/levels/a1_topics';
import { a2Topics } from '@/data/levels/a2_topics';
import { b1Topics } from '@/data/levels/b1_topics';
import { b2Topics } from '@/data/levels/b2_topics';
import { c1Topics } from '@/data/levels/c1_topics';
import { c2Topics } from '@/data/levels/c2_topics';
import TopicQuiz from './TopicQuiz';

type PageProps = { params: { level: string; topic: string } };
type Topic = { slug: string; title: string; description: string };
const topicsByLevel: Record<string, Topic[]> = {
  a1: a1Topics, a2: a2Topics, b1: b1Topics, b2: b2Topics, c1: c1Topics, c2: c2Topics,
};

function getTopic({ level, topic: slug }: PageProps['params']) {
  const normalizedLevel = level.toLowerCase();
  const topic = topicsByLevel[normalizedLevel]?.find((item) => item.slug === slug);
  if (!topic) notFound();
  if (level !== normalizedLevel) permanentRedirect(`/levels/${normalizedLevel}/${slug}`);
  return { level: normalizedLevel, topic };
}

export function generateStaticParams() {
  return Object.entries(topicsByLevel).flatMap(([level, topics]) =>
    topics.map((topic) => ({ level, topic: topic.slug }))
  );
}

export function generateMetadata({ params }: PageProps) {
  const { level, topic } = getTopic(params);
  return buildSeoMetadata({
    title: `${topic.title} – ${level.toUpperCase()} Grammar Practice`,
    description: `${topic.description} Practise with a free ${level.toUpperCase()} grammar quiz and check your answers.`,
    path: `/levels/${level}/${topic.slug}`,
  });
}

export default function TopicPage({ params }: PageProps) {
  getTopic(params);
  return <TopicQuiz />;
}
