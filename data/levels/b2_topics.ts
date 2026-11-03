// data/levels/b2_topics.ts

export type B2TopicSlug =
  | 'present-perfect-continuous'
  | 'past-perfect'
  | 'passive-voice'
  | 'second-conditional'
  | 'modals-deduction'
  | 'reported-speech-basic'
  | 'third-conditional'
  | 'mixed-conditionals'
  | 'defining-relative-clauses'
  | 'non-defining-relative-clauses'
  | 'causatives'
  | 'noun-clauses'
  | 'inversion';

export type B2Topic = {
  slug: B2TopicSlug;
  title: string;
  description: string;
  questionCount: number;
};

export const b2Topics: B2Topic[] = [
  {
    slug: 'present-perfect-continuous',
    title: 'Present Perfect Continuous',
    description:
      'Talking about actions that started in the past and are still continuing, or whose results we can see now.',
    questionCount: 20,
  },
  {
    slug: 'past-perfect',
    title: 'Past Perfect (had + past participle)',
    description:
      'Describing one past action that happened before another past action.',
    questionCount: 20,
  },
  {
    slug: 'passive-voice',
    title: 'Passive Voice (Present & Past)',
    description:
      'Focusing on the action or object, not the person who does it.',
    questionCount: 20,
  },
  {
    slug: 'second-conditional',
    title: 'Second Conditional (If + past, would + verb)',
    description:
      'Talking about unreal or unlikely situations in the present or future.',
    questionCount: 20,
  },
  {
    slug: 'modals-deduction',
    title: 'Modal Verbs for Deduction (must, might, can’t)',
    description:
      'Making logical guesses about the present and past with must, might, could and can’t.',
    questionCount: 20,
  },
  {
    slug: 'reported-speech-basic',
    title: 'Reported Speech (Basic Statements & Questions)',
    description:
      'Reporting what people said using backshift of tenses and changing pronouns/time expressions.',
    questionCount: 20,
  },

  {"slug": "third-conditional", "title": "Third Conditional", "description": "Imagine different past events and their unreal past results using if + past perfect and would have.", "questionCount": 20},
  {"slug": "mixed-conditionals", "title": "Mixed Conditionals", "description": "Connect an unreal past event to a present result, or a present characteristic to a past consequence.", "questionCount": 20},
  {"slug": "defining-relative-clauses", "title": "Defining Relative Clauses", "description": "Identify people and things with essential relative clauses; practise pronouns, omission and prepositions.", "questionCount": 20},
  {"slug": "non-defining-relative-clauses", "title": "Non-defining Relative Clauses", "description": "Add extra information using commas, who, which and whose, including clauses that refer to a whole statement.", "questionCount": 20},
  {"slug": "causatives", "title": "Causatives: Have / Get Something Done", "description": "Describe arranged services, experiences and instructions with have or get and the correct verb pattern.", "questionCount": 20},
  {"slug": "noun-clauses", "title": "Noun Clauses and Embedded Questions", "description": "Use statement, question and subject clauses with that, what, whether and other question words.", "questionCount": 20},
  {"slug": "inversion", "title": "Inversion for Emphasis", "description": "Practise negative adverbials, only, not until, formal conditionals and auxiliary-subject inversion.", "questionCount": 20},
];
