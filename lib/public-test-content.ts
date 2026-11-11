import type { StandardQuestion } from '@/lib/quizManager';

export type StudyLink = { name: string; path: string };
export type TestGuide = {
  focus: string;
  approach: string;
  related: readonly StudyLink[];
};

const grammar = { name: 'Grammar tests by level and topic', path: '/grammar' };
const vocabulary = { name: 'Vocabulary practice', path: '/vocabulary-tests' };
const yds = { name: 'YDS preparation', path: '/yds-preparation' };
const grammarGuides: Record<string, TestGuide> = {
  'test-perfect-past': {
    focus: 'Distinguish completed actions from ongoing activity in present, past and future perfect sentences.',
    approach: 'Find the reference time first. Then decide whether the sentence stresses a completed result or the duration of an activity before that time.',
    related: [{ name: 'Perfect tenses guide and examples', path: '/test-perfect-tenses' }, { name: 'Mixed tenses test', path: '/tests/test-tenses-mixed' }, grammar],
  },
  'test-conditionals': {
    focus: 'Practise conditional sentences and the relationship between a condition and its result.',
    approach: 'Decide whether the situation is a general fact, a real possibility or an imagined alternative. Use the time of the condition and result to select the verb forms.',
    related: [{ name: 'Conditionals guide and examples', path: '/test-conditionals' }, { name: 'Perfect tenses practice', path: '/tests/test-perfect-past' }, grammar],
  },
  'test-relatives': {
    focus: 'Choose relative pronouns and clause structures to connect information about people, things and places.',
    approach: 'Identify the noun being described and the role of the missing word. Check whether commas make the clause additional information rather than an essential description.',
    related: [{ name: 'Relative clauses guide and examples', path: '/test-relatives' }, { name: 'Advanced clauses test', path: '/tests/test-clauses-advanced' }, grammar],
  },
  'test-articles': {
    focus: 'Choose a, an, the or no article according to meaning and noun use.',
    approach: 'Check whether the noun is countable and singular, and whether the reader already knows which person or thing you mean. Remember that a/an follows sound rather than spelling.',
    related: [{ name: 'A1 grammar topics', path: '/levels/a1' }, { name: 'Mixed grammar test', path: '/tests/grammar-mega-test-100' }, grammar],
  },
  'test-tenses-mixed': {
    focus: 'Compare English tense and aspect choices across a mixed set of sentence contexts.',
    approach: 'Read the whole sentence for time markers and connections between events. A time expression is a clue, but the intended meaning determines the final tense choice.',
    related: [{ name: 'Perfect tenses guide', path: '/test-perfect-tenses' }, { name: 'Reported speech practice', path: '/tests/test-reported-speech' }, grammar],
  },
  'test-passive-voice': {
    focus: 'Practise advanced passive constructions while keeping tense and meaning consistent.',
    approach: 'Identify who or what receives the action. Check the required form of be and the past participle, then consider whether naming the agent adds useful information.',
    related: [{ name: 'B1 grammar topics', path: '/levels/b1' }, { name: 'Advanced English practice', path: '/advanced-tests' }, grammar],
  },
  'test-reported-speech': {
    focus: 'Practise reporting statements and questions with suitable tense, pronoun and word-order changes.',
    approach: 'Locate the reporting verb and time context before choosing a tense. In a reported question, check for statement word order rather than direct-question inversion.',
    related: [{ name: 'Mixed tenses practice', path: '/tests/test-tenses-mixed' }, { name: 'Advanced clauses practice', path: '/tests/test-clauses-advanced' }, grammar],
  },
  'test-gerunds-infinitives': {
    focus: 'Choose between -ing forms and infinitives after verbs and other sentence structures.',
    approach: 'Look at the verb or preposition immediately before the gap. Some verbs accept both forms with different meanings, so check whether the action happened or is still intended.',
    related: [{ name: 'B1 grammar topics', path: '/levels/b1' }, { name: 'Prepositions practice', path: '/tests/test-prepositions-advanced' }, grammar],
  },
  'test-clauses-advanced': {
    focus: 'Connect ideas using noun, adjective and adverb clauses in more complex sentences.',
    approach: 'Identify what the clause does: name an idea, describe a noun or explain a relationship such as time or reason. Check both the linking word and the clause structure.',
    related: [{ name: 'Relative clauses guide', path: '/test-relatives' }, { name: 'B2 grammar topics', path: '/levels/b2' }, grammar],
  },
  'test-modals-advanced': {
    focus: 'Interpret advanced modal constructions expressing certainty, possibility, obligation and past deductions.',
    approach: 'Decide what the speaker knows and how certain the statement is. For a past interpretation, check whether the structure needs a modal followed by have and a past participle.',
    related: [{ name: 'C1 grammar topics', path: '/levels/c1' }, { name: 'Advanced English practice', path: '/advanced-tests' }, grammar],
  },
  'test-prepositions-advanced': {
    focus: 'Choose prepositions that fit established verb, adjective and noun combinations.',
    approach: 'Read the words around the gap as a phrase. Record a useful complete combination after checking the answer, rather than memorising the preposition alone.',
    related: [{ name: 'Phrasal verbs practice', path: '/tests/yds-phrasal-verbs' }, { name: 'B1–C1 vocabulary test', path: '/tests/vocab-b1-c1-50' }, grammar],
  },
};

export function getPublicTestGuide(slug: string): TestGuide {
  if (grammarGuides[slug]) return grammarGuides[slug];
  if (slug.startsWith('level-')) {
    const level = slug.slice(6).toUpperCase();
    return {
      focus: `Check your understanding of the grammar and vocabulary in this mixed ${level} practice set.`,
      approach: 'Use your mistakes to choose a focused topic next. A score on one level-specific set is practice feedback; use the mixed-level placement test for a broader starting-level estimate.',
      related: [{ name: `${level} topic tests and study guides`, path: `/levels/${level.toLowerCase()}` }, { name: 'A1–C2 English level test', path: '/english-level-test' }, grammar],
    };
  }
  if (slug.startsWith('daily-english-')) return {
    focus: 'Review everyday English words by choosing their Turkish meanings.',
    approach: 'Choose the meaning before checking an answer. After reviewing a missed word, make your own short sentence and return to the word in a later study session.',
    related: [{ name: `Review word list ${slug.slice('daily-english-'.length)}`, path: `/daily-english/test-${slug.slice('daily-english-'.length)}` }, { name: 'More daily English word lists', path: '/daily-english' }, { name: 'English vocabulary in context', path: '/practice/vocabulary' }],
  };
  if (/^yds-(3850|5000)-mini-/.test(slug)) return {
    focus: 'Practise recognising academic English vocabulary through multiple-choice meanings. Turkish is the default answer language; selected language preferences can change the meaning choices.',
    approach: 'Try to recall the meaning before comparing the options. After the test, collect unfamiliar words and study each in a full sentence before revisiting the mini test.',
    related: [yds, { name: 'More vocabulary mini tests', path: '/yds-5000-mini' }, { name: 'YDS synonyms practice', path: '/tests/yds-synonyms' }],
  };
  if (slug.startsWith('yds-exam-test-')) return {
    focus: 'Work through a longer mixed YDS practice set to review exam-related English grammar, vocabulary and reading.',
    approach: 'Plan your time across the whole set and revisit uncertain answers before finishing. Use the answer review to identify which skill needs a shorter follow-up test. This independent practice is not an official ÖSYM exam or score prediction.',
    related: [yds, { name: 'YDS reading comprehension', path: '/tests/yds-reading' }, { name: 'YDS grammar practice', path: '/tests/yds-grammar' }],
  };
  const special: Record<string, TestGuide> = {
    'ielts-grammar': {
      focus: 'Review grammar accuracy through a longer mixed practice set for learners preparing for IELTS.',
      approach: 'Check how each structure changes the meaning of the sentence. IELTS has no separate grammar paper, and this multiple-choice practice does not provide an IELTS band score.',
      related: [{ name: '10 shorter IELTS grammar tests', path: '/ielts-grammar-tests' }, { name: 'Reading comprehension by level', path: '/practice/reading' }, grammar],
    },
    'grammar-mega-test-100': {
      focus: 'Review a broad mix of grammar points in a longer test, then identify rules worth practising separately.',
      approach: 'Keep a steady pace and note questions you are unsure about. Group your mistakes by topic after finishing, then choose a focused grammar test before attempting another mixed set.',
      related: [grammar, { name: 'Advanced English tests', path: '/advanced-tests' }, { name: 'English level test', path: '/english-level-test' }],
    },
    'vocab-b1-c1-50': {
      focus: 'Practise vocabulary across B1, B2 and C1 sentence contexts.',
      approach: 'Check the meaning of the complete sentence and the words that commonly occur together. A familiar word can still be wrong if its grammatical form or combination does not fit.',
      related: [vocabulary, { name: 'B1–C1 word formation', path: '/practice/word-formation' }, { name: 'Business English tests', path: '/business-english-tests' }],
    },
    'yds-reading': {
      focus: 'Read passages and answer comprehension questions for YDS-oriented practice.',
      approach: 'Identify the main idea, then return to the passage to check evidence for each answer. Distinguish information stated in the text from an inference that the text actually supports.',
      related: [yds, { name: 'Reading comprehension by level', path: '/practice/reading' }, { name: 'YDS conjunctions practice', path: '/tests/yds-conjunctions' }],
    },
    'yds-phrasal-verbs': {
      focus: 'Recognise English phrasal verbs by selecting their Turkish meanings.',
      approach: 'Treat the verb and its particle as one expression. After reviewing a meaning, find or write a full sentence so that you remember how the expression is used.',
      related: [yds, vocabulary, { name: 'English phrasal verb puzzle', path: '/phrasal-puzzle' }],
    },
    'yds-synonyms': {
      focus: 'Choose words and phrases that are closest in meaning to the given English expression.',
      approach: 'Look for the closest meaning rather than a word from the same subject area. Related words are not always interchangeable; record the distinction when you review an answer.',
      related: [yds, vocabulary, { name: 'B1–C1 vocabulary in context', path: '/tests/vocab-b1-c1-50' }],
    },
    'yds-conjunctions': {
      focus: 'Choose conjunctions and connectors that match the relationship between ideas.',
      approach: 'Decide whether the sentence expresses contrast, cause, result, condition or time. Then check the structure that follows the gap: a full clause and a noun phrase need different connectors.',
      related: [yds, { name: 'YDS reading practice', path: '/tests/yds-reading' }, { name: 'Advanced clauses practice', path: '/tests/test-clauses-advanced' }],
    },
    'yds-grammar': {
      focus: 'Review English grammar across a mixed set of YDS-oriented sentence questions.',
      approach: 'Check sentence structure and meaning together. After finishing, use the answer review to choose a focused tense, clause or connector topic rather than repeating only the questions you already know.',
      related: [yds, grammar, { name: 'YDS conjunctions practice', path: '/tests/yds-conjunctions' }],
    },
  };
  return special[slug] ?? { focus: 'Review your English with this multiple-choice practice set.', approach: 'Finish the test, read the answer review and choose a related topic to practise next.', related: [grammar, vocabulary] };
}

// The public description can distinguish independent practice without renaming
// stored attempts or changing any underlying question/title data.
export function getPublicTestTitle(slug: string, originalTitle: string): string {
  const daily = /^daily-english-([1-9]\d*)$/.exec(slug);
  if (daily) return `Daily English Vocabulary Quiz ${daily[1]}`;
  const exam = /^yds-exam-test-([1-9]\d*)$/.exec(slug);
  if (exam) return `YDS Practice Mock Test ${exam[1]}`;
  const level = /^level-(a1|a2|b1|b2|c1|c2)$/.exec(slug);
  if (level) return `${level[1].toUpperCase()} English Practice Test`;
  return originalTitle;
}

export function getWorkedExamples(questions: readonly StandardQuestion[], count = 2) {
  return questions.filter((question) => question.explanation?.trim() && question.choices.filter((choice) => choice.isCorrect).length === 1).slice(0, count);
}
