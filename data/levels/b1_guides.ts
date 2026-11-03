import type { TopicStudyGuide } from './study-guide';
import type { B1TopicSlug } from './b1_topics';

export const b1Guides: Record<string, TopicStudyGuide> = {
  'present-perfect': {
    summary: 'The present perfect connects an earlier action or situation with the present, including life experiences and states that still continue. Practise have or has with a past participle, and use time expressions to explain what has happened up to now.',
    focus: ['Have/has and irregular past participles', 'Experience and recent results', 'For, since, already, just and yet'],
    tip: 'Use since for a starting point and for for a duration: “since Monday” but “for three days”.',
  },
  'past-continuous': {
    summary: 'The past continuous describes an activity already in progress at a past moment, often as background to another event. Practise was or were with an -ing form, then connect longer activities and shorter events using while and when.',
    focus: ['Was/were agreement and -ing forms', 'Background actions and interruptions', 'Questions and negatives about past activities'],
    tip: 'Separate the background from the interruption: “I was cooking when the doorbell rang.” The ringing happened during the cooking.',
  },
  'present-perfect-vs-past-simple': {
    summary: 'Choose the past simple for events in a finished past period and the present perfect for experience or situations connected to now. These questions compare time references, continuing states and completed visits so that meaning guides your choice of tense.',
    focus: ['Finished past dates and occasions', 'Life experience without a finished date', 'Continuing states with for and since'],
    tip: 'A finished date calls for the past simple: “I visited Rome in 2022.” Use “I have visited Rome” for experience without that date.',
  },
  'first-conditional': {
    summary: 'The first conditional links a real possible condition to a future result, such as a plan, prediction or warning. Practise present simple in the if-clause and will with a base verb in the result, including negative conditions and reversed clause order.',
    focus: ['If + present simple, will + base verb', 'Positive and negative future results', 'Clause order and commas'],
    tip: 'In the standard first conditional, use present simple after if: “If it rains, we will stay inside.”',
  },
  'modals-ability-permission-advice': {
    summary: 'Modal verbs help you talk about skills, ask permission, give advice and describe uncertain possibilities in everyday situations. Practise choosing the meaning that fits the context, then forming affirmative sentences, questions and short answers without adding an unnecessary auxiliary.',
    focus: ['Can and could for ability and requests', 'Should and ought to for advice', 'May and might for permission or possibility'],
    tip: 'Most modals take a base verb: “She can swim,” not “She can swims.” Ought to includes to: “You ought to rest.”',
  },
  'relative-clauses-basic': {
    summary: 'Relative clauses connect a person, thing, place or time with information that helps describe or identify it. Practise choosing who, which, that, where, when and whose, while keeping the rest of the clause complete and avoiding repeated subjects or objects.',
    focus: ['Who, which and that for people and things', 'Where and when for places and times', 'Whose for possession'],
    tip: 'Do not repeat the subject after a subject relative pronoun: “The teacher who lives nearby,” not “who she lives nearby”.',
  },
  'past-perfect': {
    summary: 'The past perfect makes clear that one event happened before another event or reference point in the past. Practise had with a past participle to describe earlier experiences, completed actions and reasons for a later situation in a story.',
    focus: ['Had + regular and irregular participles', 'Earlier and later events in a narrative', 'Negatives, questions and past deadlines'],
    tip: 'Use “had gone,” not “had went.” Had does not change with the subject: “she had gone” and “they had gone”.',
  },
  'passive-voice': {
    summary: 'Active sentences focus on who performs an action, while passive sentences put the person or thing receiving it first. Practise changing that focus while preserving the tense, and build passive statements, questions and negatives with the correct form of be.',
    focus: ['Active subjects and passive subjects', 'Present and past be + past participle', 'Modal and present perfect passives'],
    tip: 'A passive needs be as well as a participle: “The windows were cleaned.” For a modal, use “The windows can be cleaned.”',
  },
  'zero-conditional': {
    summary: 'The zero conditional describes general facts, routines and regular consequences rather than one particular future prediction. Practise present simple in both clauses to explain what normally happens when a condition is met, including operating instructions and everyday habits.',
    focus: ['Present simple in both clauses', 'General facts and repeated situations', 'Agreement and negatives in conditional sentences'],
    tip: 'For a regular result, keep both verbs in the present simple: “If the battery gets low, the warning light flashes.”',
  },
  'second-conditional': {
    summary: 'The second conditional imagines a different present situation or an unlikely future possibility and its possible result. Practise a past simple form in the if-clause with would or could in the result, remembering that the meaning is hypothetical rather than past.',
    focus: ['If + past simple, would + base verb', 'Hypothetical advice with if I were', 'Could and negative imagined results'],
    tip: 'The past form can describe now: “If I knew the answer, I would tell you” means I do not know it now.',
  },
  'gerunds-infinitives': {
    summary: 'The form of a second verb often depends on the word or structure before it, so learn useful patterns together. Practise -ing forms after common verbs and prepositions, to-infinitives for plans or purpose, and bare infinitives after let and make.',
    focus: ['Common verbs followed by -ing or to + verb', 'Gerunds after prepositions and as subjects', 'Purpose and bare infinitive patterns'],
    tip: 'Learn the complete verb pattern: “enjoy reading” but “decide to read.” After a preposition, use an -ing form: “without waiting”.',
  },
  'common-phrasal-verbs': {
    summary: 'A phrasal verb combines a verb with a particle, and its meaning is often different from the individual words. Practise everyday expressions in context and notice whether an object can go between the verb and particle, especially when it is a pronoun.',
    focus: ['Everyday meanings such as give up and look after', 'Understanding phrasal verbs in context', 'Object placement with separable phrasal verbs'],
    tip: 'Put an object pronoun between the parts of a separable phrasal verb: “Turn it off,” not “Turn off it”.',
  },
  'reported-speech': {
    summary: 'Reported speech explains what somebody said without repeating their exact words, so pronouns and time references depend on the reporting situation. Practise backshift when it is needed, statement word order in reported questions, and to-infinitives for requests or instructions.',
    focus: ['Tense backshift and changes in perspective', 'If/whether and reported question word order', 'Say, tell and reported instructions'],
    tip: 'Reported questions use statement order: “She asked where I lived,” not “where did I live.” Yes/no questions can begin with if or whether.',
  },
} satisfies Record<B1TopicSlug, TopicStudyGuide>;
