// data/levels/c1_topics.ts

export type C1TopicSlug =
  | 'mixed-conditionals'
  | 'wish-if-only'
  | 'inversion-emphasis'
  | 'participle-clauses'
  | 'cleft-sentences'
  | 'advanced-relative-clauses'
  | 'subjunctive'
  | 'advanced-idioms'
  | 'academic-language';

export type C1Topic = {
  slug: C1TopicSlug;
  title: string;
  description: string;
  questionCount: number;
};

export const c1Topics: C1Topic[] = [
  {
    slug: 'mixed-conditionals',
    title: 'Mixed Conditionals',
    description:
      'Linking unreal past situations with present results, and unreal present situations with past results.',
    questionCount: 20,
  },
  {
    slug: 'wish-if-only',
    title: 'Wish / If Only',
    description:
      'Talking about regrets, criticism and unreal desires using wish and if only structures.',
    questionCount: 20,
  },
  {
    slug: 'inversion-emphasis',
    title: 'Inversion for Emphasis',
    description:
      'Using inversion after negative adverbials like hardly, never, at no time, only when, etc.',
    questionCount: 20,
  },
  {
    slug: 'participle-clauses',
    title: 'Participle Clauses',
    description:
      'Using -ing and -ed clauses to make your writing more concise and advanced.',
    questionCount: 20,
  },
  {
    slug: 'cleft-sentences',
    title: 'Cleft Sentences (It / What)',
    description:
      'Focusing information using it-clefts and what-clefts to add emphasis.',
    questionCount: 20,
  },
  {
    slug: 'advanced-relative-clauses',
    title: 'Advanced Relative Clauses',
    description:
      'Using defining, non-defining and reduced relative clauses accurately and naturally.',
    questionCount: 20,
  },
  {
    slug: 'subjunctive',
    title: 'Subjunctive Mood & Formal Requests',
    description:
      'Formal demands and recommendations, negative and passive subjunctives, hypothetical were and fixed expressions.',
    questionCount: 20,
  },
  {
    slug: 'advanced-idioms',
    title: 'Advanced Idioms in Context',
    description:
      'Interpret and use idiomatic expressions in discussions, decisions, negotiations and everyday situations.',
    questionCount: 20,
  },
  {
    slug: 'academic-language',
    title: 'Academic Language & Formal Writing',
    description:
      'Express evidence, uncertainty, contrast and argument using precise academic vocabulary and formal linking expressions.',
    questionCount: 20,
  },
];

