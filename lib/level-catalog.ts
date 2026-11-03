import { a1Topics } from '@/data/levels/a1_topics';
import { a2Topics } from '@/data/levels/a2_topics';
import { b1Topics } from '@/data/levels/b1_topics';
import { b2Topics } from '@/data/levels/b2_topics';
import { c1Topics } from '@/data/levels/c1_topics';
import { c2Topics } from '@/data/levels/c2_topics';

export type LevelKey = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export type LevelTopic = {
  slug: string;
  title: string;
  description: string;
  questionCount: number;
};

export type LevelDefinition = {
  key: LevelKey;
  label: string;
  name: string;
  description: string;
  topics: readonly LevelTopic[];
  duration: number;
};

// Navigation and metadata import only topic descriptions, not the question banks.
export const LEVEL_CATALOG: readonly LevelDefinition[] = [
  {
    key: 'a1', label: 'A1', name: 'Beginner', duration: 20,
    description: 'Build the basics: be, pronouns, articles, present tenses, simple questions and everyday vocabulary.',
    topics: a1Topics,
  },
  {
    key: 'a2', label: 'A2', name: 'Elementary', duration: 20,
    description: 'Practise past and future tenses, comparisons, everyday modals and simple connectors.',
    topics: a2Topics,
  },
  {
    key: 'b1', label: 'B1', name: 'Intermediate', duration: 20,
    description: 'Develop perfect tenses, active and passive voice, conditionals, reported speech and common phrasal verbs.',
    topics: b1Topics,
  },
  {
    key: 'b2', label: 'B2', name: 'Upper-Intermediate', duration: 20,
    description: 'Explore advanced conditionals, relative and noun clauses, causatives and emphatic inversion.',
    topics: b2Topics,
  },
  {
    key: 'c1', label: 'C1', name: 'Advanced', duration: 20,
    description: 'Refine formal structures, the subjunctive, advanced inversion, idioms and academic language.',
    topics: c1Topics,
  },
  {
    key: 'c2', label: 'C2', name: 'Proficiency', duration: 10,
    description: 'Continue with complex passives, advanced conditionals, ellipsis and other proficiency-level structures.',
    topics: c2Topics.map((topic) => ({ ...topic, questionCount: 10 })),
  },
];

export function getLevelDefinition(level: string): LevelDefinition | undefined {
  return LEVEL_CATALOG.find((definition) => definition.key === level.toLowerCase());
}

export function getTopicTestSlug(level: string, topic: string): string {
  return `topic-${level.toLowerCase()}-${topic}`;
}
