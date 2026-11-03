import type { TopicStudyGuide } from './study-guide';
import type { B2TopicSlug } from './b2_topics';

export const b2Guides: Record<string, TopicStudyGuide> = {
  'present-perfect-continuous': {
    summary: 'The present perfect continuous emphasizes an activity over a period leading up to now, including repeated actions and recent work with visible effects. Practise have or has been with an -ing form, paying attention to duration and the difference between activity and completed results.',
    focus: ['Have/has been + -ing', 'Duration with how long, for and since', 'Ongoing activity and recent visible effects'],
    tip: 'Contrast activity with a completed total: “I have been writing emails all morning” focuses on the activity; “I have written six emails” counts results.',
  },
  'past-perfect': {
    summary: 'Use the past perfect to establish an earlier reference point within a past narrative and explain later consequences. These questions practise completed actions, previous experiences and past perfect passive forms, helping you distinguish the order of events even when sentences present them differently.',
    focus: ['Sequencing events around a past reference point', 'Earlier experiences and causes', 'Had been + past participle in the passive'],
    tip: 'Check who receives the action: “They had signed the form” is active, while “The form had been signed” is passive.',
  },
  'passive-voice': {
    summary: 'Passive structures let you make an action or its recipient the focus when the agent is unknown, obvious or less relevant. Practise retaining the original time reference across present, past and future forms, and recognize passive questions, continuous forms and infinitives.',
    focus: ['Choosing the passive to control sentence focus', 'Passive tense forms and question order', 'Will be and to be + past participle'],
    tip: 'Keep the passive verb chain intact: “The room is being painted” describes work in progress; “The room will be painted” describes future work.',
  },
  'second-conditional': {
    summary: 'Use the second conditional to explore hypothetical choices, offer advice and consider consequences under different present or future circumstances. Practise questions and negatives as well as statements, and distinguish would for an imagined result from could for an imagined ability or possibility.',
    focus: ['Hypothetical present and future consequences', 'Would/could and negative result clauses', 'Questions and advice with if I were'],
    tip: 'In a result question, put would before the subject: “Who would you contact if you needed advice?” Keep the if-clause in statement order.',
  },
  'modals-deduction': {
    summary: 'Deduction modals show how confidently you interpret evidence rather than stating a directly observed fact. Practise must for a strong positive conclusion, may or might for possibilities, and cannot or could not for negative conclusions about present situations and past events.',
    focus: ['Degrees of certainty from contextual evidence', 'Must/might/cannot + base verb or be + -ing', 'Modal + have + past participle for past deductions'],
    tip: 'For a past deduction, include have and a participle: “She must have left.” “She must leave” instead usually expresses a present obligation.',
  },
  'reported-speech-basic': {
    summary: 'Reporting statements and questions from a later perspective may involve changes to tense, pronouns and expressions of time or place. Practise selecting say, tell or ask and keeping reported clauses in statement order, while using context to identify the original speaker and listener.',
    focus: ['Backshift in reported statements and questions', 'Pronouns and time expressions in context', 'Say/tell patterns and if/whether clauses'],
    tip: 'Tell normally needs a person object: “She told us that it was ready.” Say does not: “She said that it was ready.”',
  },
  'third-conditional': {
    summary: 'The third conditional imagines an alternative to a completed past event and considers how its result might have changed. Practise if with the past perfect and a result using would, could or might have plus a past participle to express certainty or possibility.',
    focus: ['If + had + past participle', 'Would/could/might have + past participle', 'Alternative past events and their consequences'],
    tip: 'Keep would have in the result clause: “If we had left earlier, we would have arrived on time.” Use had in the condition.',
  },
  'mixed-conditionals': {
    summary: 'Mixed conditionals connect an imagined condition in one time period with a result in another, such as a past decision affecting life now. Practise both past-to-present and present-to-past patterns by identifying the time of each clause before selecting its verb form.',
    focus: ['Past conditions with present results', 'Present characteristics with past consequences', 'Time references such as now and yesterday'],
    tip: 'Read the time clue in each clause: “If I had saved more, I would own a car now” connects past saving with present ownership.',
  },
  'defining-relative-clauses': {
    summary: 'A defining relative clause provides essential information that identifies the person, thing, place or time you mean. Practise selecting relative pronouns, recognizing when an object pronoun may be omitted, and using prepositions without repeating an object already represented by the relative word.',
    focus: ['Essential identification without separating commas', 'Subject and object relative pronouns', 'Whose and preposition + whom/which'],
    tip: 'You can omit an object relative pronoun in “The book I bought,” but keep the subject pronoun in “The book that won the prize”.',
  },
  'non-defining-relative-clauses': {
    summary: 'Non-defining relative clauses add supplementary information about someone or something already identified, rather than selecting it from a group. Practise marking these clauses with commas, retaining their relative pronouns, and using which to comment on an entire preceding statement.',
    focus: ['Commas around supplementary information', 'Who, which and whose without omission', 'Which referring to a whole statement'],
    tip: 'Use which rather than that in a non-defining clause: “The museum, which opened last year, is popular.” Keep both commas when the clause interrupts.',
  },
  'causatives': {
    summary: 'Causative patterns describe arranging for another person to do a job, giving instructions or experiencing something that happens to your possessions. Practise have or get with an object and past participle, and distinguish these forms from patterns that directly name the person doing the work.',
    focus: ['Have/get + object + past participle', 'Changing tense while keeping the causative pattern', 'Have someone do and get someone to do'],
    tip: 'Compare “I had the mechanic check it” with “I got the mechanic to check it.” Get needs to when the following object names the worker.',
  },
  'noun-clauses': {
    summary: 'A noun clause can act as the subject, object or complement of a sentence, allowing a whole idea or question to fill that role. Practise clauses beginning with that, what, whether and other question words, while maintaining statement word order inside embedded questions.',
    focus: ['Statement clauses introduced by that', 'Embedded questions and whether clauses', 'What-clauses as subjects, objects or complements'],
    tip: 'An embedded question keeps subject before verb: “I wonder where she works,” not “where does she work.” A direct question uses different word order.',
  },
  'inversion': {
    summary: 'In formal or emphatic writing, a fronted negative or restrictive expression can place an auxiliary before the subject. Practise inversion after expressions such as never, only then and not until, along with formal conditional patterns that omit if and begin with an auxiliary.',
    focus: ['Negative and restrictive expressions at the start', 'Do/does/did support and auxiliary placement', 'Formal conditional inversion with should, were and had'],
    tip: 'After an initial not until clause, invert the main clause: “Not until the doors opened did we enter.” The verb after did stays in its base form.',
  },
} satisfies Record<B2TopicSlug, TopicStudyGuide>;
