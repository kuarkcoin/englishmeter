export type A1TopicSlug =
  | "verb-to-be"
  | "subject-pronouns"
  | "possessive-adjectives"
  | "countable-uncountable"
  | "a-an"
  | "present-simple"
  | "present-continuous"
  | "this-that-these-those"
  | "prepositions-of-place"
  | "prepositions-of-time"
  | "there-is-there-are"
  | "can-cant"
  | "wh-questions"
  | "numbers"
  | "days-months"
  | "telling-the-time"
  | "basic-directions";

export type A1Topic = {
  slug: A1TopicSlug;
  title: string;
  description: string;
  questionCount: number;
};

export const a1Topics: A1Topic[] = [
  {
    slug: "verb-to-be",
    title: "Verb to Be: am / is / are",
    description: "Statements, negatives, questions and short answers with the present forms of be.",
    questionCount: 20,
  },
  {
    slug: "subject-pronouns",
    title: "Subject Pronouns",
    description: "Use I, you, he, she, it, we and they as sentence subjects.",
    questionCount: 20,
  },
  {
    slug: "possessive-adjectives",
    title: "Possessive Adjectives",
    description: "Choose my, your, his, her, its, our and their before nouns.",
    questionCount: 20,
  },
  {
    slug: "countable-uncountable",
    title: "Countable & Uncountable Nouns",
    description: "Singular and plural nouns, amounts, containers, how much and how many.",
    questionCount: 20,
  },
  {
    slug: "a-an",
    title: "Articles: a / an / the",
    description: "Introduce things with a or an and identify known things with the.",
    questionCount: 20,
  },
  {
    slug: "present-simple",
    title: "Present Simple (Daily Routines)",
    description: "Regular habits, do/does questions, negatives and third-person verb endings.",
    questionCount: 20,
  },
  {
    slug: "present-continuous",
    title: "Present Continuous",
    description: "Describe actions happening now with am/is/are and an -ing verb.",
    questionCount: 20,
  },
  {
    slug: "this-that-these-those",
    title: "This / That / These / Those",
    description: "Point to nearby or distant things and match singular and plural forms.",
    questionCount: 20,
  },
  {
    slug: "prepositions-of-place",
    title: "Prepositions of Place",
    description: "Describe clear locations with in, on, under, behind, between and next to.",
    questionCount: 20,
  },
  {
    slug: "prepositions-of-time",
    title: "Prepositions of Time: in / on / at",
    description: "Use in, on and at with times, days, dates, months and everyday time phrases.",
    questionCount: 20,
  },
  {
    slug: "there-is-there-are",
    title: "There Is / There Are",
    description: "Say what exists, ask about places and quantities, and give short answers.",
    questionCount: 20,
  },
  {
    slug: "can-cant",
    title: "Can / Can’t: Ability",
    description: "Talk about abilities, ask can questions and use the base form of the verb.",
    questionCount: 20,
  },
  {
    slug: "wh-questions",
    title: "Wh- Questions",
    description: "Ask about people, places, things, time, reasons, amounts and ownership.",
    questionCount: 20,
  },
  {
    slug: "numbers",
    title: "Everyday Numbers",
    description: "Read numbers, prices, room numbers and phone digits in English.",
    questionCount: 20,
  },
  {
    slug: "days-months",
    title: "Days & Months",
    description: "Recognise weekday and month names, their order and common calendar abbreviations.",
    questionCount: 20,
  },
  {
    slug: "telling-the-time",
    title: "Telling the Time",
    description: "Read clocks with past, to, quarter, half, a.m. and p.m.",
    questionCount: 20,
  },
  {
    slug: "basic-directions",
    title: "Basic Directions",
    description: "Understand simple routes, turns, crossings, entrances and the location of everyday places.",
    questionCount: 20,
  },
];
