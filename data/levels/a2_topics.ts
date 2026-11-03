// data/levels/a2_topics.ts

export type A2TopicSlug =
  | 'past-simple'
  | 'present-continuous'
  | 'countable-uncountable'
  | 'comparatives-superlatives'
  | 'some-any-a-lot-of'
  | 'adverbs-of-frequency'
  | 'past-continuous'
  | 'will-going-to'
  | 'have-to-need-to'
  | 'should-must'
  | 'may-might'
  | 'basic-conjunctions';

export type A2Topic = {
  slug: A2TopicSlug;
  title: string;
  description: string;
  questionCount: number;
};

export const a2Topics: A2Topic[] = [
  {
    "slug": "past-simple",
    "title": "Past Simple (regular & irregular verbs)",
    "description": "Finished past actions, negatives, questions and irregular verb forms.",
    "questionCount": 20
  },
  {
    "slug": "present-continuous",
    "title": "Present Continuous (now & current plans)",
    "description": "Actions in progress, temporary situations and arranged future plans.",
    "questionCount": 20
  },
  {
    "slug": "countable-uncountable",
    "title": "Countable & Uncountable Nouns",
    "description": "Quantities, singular agreement, and units such as a piece of advice.",
    "questionCount": 20
  },
  {
    "slug": "comparatives-superlatives",
    "title": "Comparative & Superlative Adjectives and Adverbs",
    "description": "Compare people, things and actions using bigger, better, more carefully and other forms.",
    "questionCount": 20
  },
  {
    "slug": "some-any-a-lot-of",
    "title": "Some / Any / A lot of",
    "description": "Quantities in statements, neutral questions, requests and offers.",
    "questionCount": 20
  },
  {
    "slug": "adverbs-of-frequency",
    "title": "Adverbs of Frequency",
    "description": "How often things happen, word order and expressions such as twice a week.",
    "questionCount": 20
  },
  {
    "slug": "past-continuous",
    "title": "Past Continuous (was / were + -ing)",
    "description": "Past actions in progress, interrupted activities, questions and negatives.",
    "questionCount": 20
  },
  {
    "slug": "will-going-to",
    "title": "Will and Be Going To",
    "description": "Future plans, intentions, predictions, promises and decisions made now.",
    "questionCount": 20
  },
  {
    "slug": "have-to-need-to",
    "title": "Have to and Need to",
    "description": "Necessity, rules, past obligations and actions that are not necessary.",
    "questionCount": 20
  },
  {
    "slug": "should-must",
    "title": "Should and Must",
    "description": "Advice, strong requirements, prohibition and modal verb forms.",
    "questionCount": 20
  },
  {
    "slug": "may-might",
    "title": "May and Might",
    "description": "Polite permission, uncertain possibilities and negative modal forms.",
    "questionCount": 20
  },
  {
    "slug": "basic-conjunctions",
    "title": "Basic Connectors: And / But / Because / So",
    "description": "Join ideas, add information, express contrast and distinguish reasons from results.",
    "questionCount": 20
  },
];
