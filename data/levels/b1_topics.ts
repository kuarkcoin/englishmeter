// data/levels/b1_topics.ts

export type B1TopicSlug =
  | 'present-perfect'
  | 'past-continuous'
  | 'present-perfect-vs-past-simple'
  | 'first-conditional'
  | 'modals-ability-permission-advice'
  | 'relative-clauses-basic'
  | 'past-perfect'
  | 'passive-voice'
  | 'zero-conditional'
  | 'second-conditional'
  | 'gerunds-infinitives'
  | 'common-phrasal-verbs'
  | 'reported-speech';

export type B1Topic = {
  slug: B1TopicSlug;
  title: string;
  description: string;
  questionCount: number;
};

export const b1Topics: B1Topic[] = [
  {
    slug: 'present-perfect',
    title: 'Present Perfect (have/has + past participle)',
    description:
      'Talking about life experience, recent actions and unfinished time periods.',
    questionCount: 20,
  },
  {
    slug: 'past-continuous',
    title: 'Past Continuous (was/were + -ing)',
    description:
      'Describing actions in progress at a specific moment in the past.',
    questionCount: 20,
  },
  {
    slug: 'present-perfect-vs-past-simple',
    title: 'Present Perfect vs Past Simple',
    description:
      'Choosing between finished past time and life experience / results now.',
    questionCount: 20,
  },
  {
    slug: 'first-conditional',
    title: 'First Conditional (If + present, will + verb)',
    description:
      'Talking about real and possible future situations and their results.',
    questionCount: 20,
  },
  {
    slug: 'modals-ability-permission-advice',
    title: 'Modal Verbs (Ability, Permission, Advice)',
    description:
      'Using can, could, may, might, should, ought to for ability, permission and advice.',
    questionCount: 20,
  },
  {
    slug: 'relative-clauses-basic',
    title: 'Relative Clauses (who, which, that, where)',
    description:
      'Joining sentences with who, which, that, where to give extra information.',
    questionCount: 20,
  },
  {
    "slug": "past-perfect",
    "title": "Past Perfect",
    "description": "Sequence past events with had + past participle and distinguish earlier actions from later ones.",
    "questionCount": 20
  },
  {
    "slug": "passive-voice",
    "title": "Active and Passive Voice",
    "description": "Transform present and past statements, questions and negatives; practise modal and perfect passive forms.",
    "questionCount": 20
  },
  {
    "slug": "zero-conditional",
    "title": "Zero Conditional",
    "description": "Describe general facts, operating rules and repeated habits using present simple in both clauses.",
    "questionCount": 20
  },
  {
    "slug": "second-conditional",
    "title": "Second Conditional",
    "description": "Imagine different present or unlikely future situations with if + past simple and would or could.",
    "questionCount": 20
  },
  {
    "slug": "gerunds-infinitives",
    "title": "Gerunds and Infinitives",
    "description": "Choose -ing forms, to-infinitives and bare infinitives after common verbs and prepositions.",
    "questionCount": 20
  },
  {
    "slug": "common-phrasal-verbs",
    "title": "Common Phrasal Verbs",
    "description": "Understand everyday phrasal verbs in context and place object pronouns correctly.",
    "questionCount": 20
  },
  {
    "slug": "reported-speech",
    "title": "Reported Speech",
    "description": "Report statements, questions, requests and instructions with appropriate word order, pronouns and backshift.",
    "questionCount": 20
  },
];

