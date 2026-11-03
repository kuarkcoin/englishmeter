// data/levels/b1_questions.ts
import type { B1TopicSlug } from './b1_topics';

export type B1Question = {
  id: string;
  level: 'B1';
  topic: B1TopicSlug;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const b1Questions: B1Question[] = [
  // PRESENT PERFECT (20 soru)
  {
    id: 'b1-pp-1',
    level: 'B1',
    topic: 'present-perfect',
    question: 'I ___ my homework already.',
    options: ['did', 'have done', 'do', 'was doing'],
    correctIndex: 1,
    explanation: "Already describes completion before now. Use have + past participle: have done.",
  },
  {
    id: 'b1-pp-2',
    level: 'B1',
    topic: 'present-perfect',
    question: 'She ___ in Paris since 2019.',
    options: ['lived', 'has lived', 'is living', 'was living'],
    correctIndex: 1,
    explanation: "Since 2019 gives a starting point continuing to the present. She takes has lived.",
  },
  {
    id: 'b1-pp-3',
    level: 'B1',
    topic: 'present-perfect',
    question: 'We ___ this film before.',
    options: ['saw', 'have seen', 'see', 'were seeing'],
    correctIndex: 1,
    explanation: "Before refers to experience up to now, without a finished past date. Use have seen.",
  },
  {
    id: 'b1-pp-4',
    level: 'B1',
    topic: 'present-perfect',
    question: 'They ___ just ___ the meeting.',
    options: ['have / finished', 'had / finished', 'finish / now', 'finished / now'],
    correctIndex: 0,
    explanation: "Just describes a very recent completed action. The subject “They” takes have + finished.",
  },
  {
    id: 'b1-pp-5',
    level: 'B1',
    topic: 'present-perfect',
    question: "He ___ his keys again and cannot get into his home now.",
    options: ['lost', 'has lost', 'is losing', 'loses'],
    correctIndex: 1,
    explanation: "Has lost connects the past loss with its present result: he does not have his keys now.",
  },
  {
    id: 'b1-pp-6',
    level: 'B1',
    topic: 'present-perfect',
    question: '___ you ever ___ to London?',
    options: ['Did / go', 'Are / going', 'Have / been', 'Do / go'],
    correctIndex: 2,
    explanation: "Ask about life experience with Have you ever been? Been means visited and returned.",
  },
  {
    id: 'b1-pp-7',
    level: 'B1',
    topic: 'present-perfect',
    question: 'We haven’t seen them ___ last summer.',
    options: ['for', 'since', 'from', 'by'],
    correctIndex: 1,
    explanation: "Since introduces a starting point, last summer. For would introduce a length of time.",
  },
  {
    id: 'b1-pp-8',
    level: 'B1',
    topic: 'present-perfect',
    question: 'She has worked here ___ three years.',
    options: ['since', 'for', 'from', 'by'],
    correctIndex: 1,
    explanation: "Three years is a duration. Use for with a period, and since with its starting point.",
  },
  {
    id: 'b1-pp-9',
    level: 'B1',
    topic: 'present-perfect',
    question: 'I have ___ finished my project.',
    options: ['yet', 'just', 'since', 'for'],
    correctIndex: 1,
    explanation: "Just goes between have and the past participle to mean a very short time ago.",
  },
  {
    id: 'b1-pp-10',
    level: 'B1',
    topic: 'present-perfect',
    question: 'They haven’t called us ___.',
    options: ['just', 'ever', 'yet', 'already'],
    correctIndex: 2,
    explanation: "Yet is normally used at the end of negative present perfect sentences to mean up to now.",
  },

  // PAST CONTINUOUS (20 soru)
  {
    id: 'b1-pc-1',
    level: 'B1',
    topic: 'past-continuous',
    question: 'I ___ TV when the phone rang.',
    options: ['watched', 'was watching', 'am watching', 'have watched'],
    correctIndex: 1,
    explanation: "Watching was already in progress when the phone rang. Use was + watching for the background action.",
  },
  {
    id: 'b1-pc-2',
    level: 'B1',
    topic: 'past-continuous',
    question: 'They ___ dinner at 8 p.m. yesterday.',
    options: ['have', 'were having', 'had', 'are having'],
    correctIndex: 1,
    explanation: "The dinner was in progress at the stated time. The subject “They” takes were + having.",
  },
  {
    id: 'b1-pc-3',
    level: 'B1',
    topic: 'past-continuous',
    question: 'What ___ you doing when I called?',
    options: ['was', 'did', 'were', 'are'],
    correctIndex: 2,
    explanation: "Form a past continuous question with were + you + doing. Was does not agree with you.",
  },
  {
    id: 'b1-pc-4',
    level: 'B1',
    topic: 'past-continuous',
    question: 'She ___ to music while she was studying.',
    options: ['listened', 'was listening', 'listens', 'has listened'],
    correctIndex: 1,
    explanation: "The two activities were in progress together. She takes was listening.",
  },
  {
    id: 'b1-pc-5',
    level: 'B1',
    topic: 'past-continuous',
    question: 'It ___ when we left the house.',
    options: ['rained', 'was raining', 'is raining', 'has rained'],
    correctIndex: 1,
    explanation: "The rain was already falling when they left. Use was raining for the background condition.",
  },
  {
    id: 'b1-pc-6',
    level: 'B1',
    topic: 'past-continuous',
    question: 'They ___ not paying attention during the lesson.',
    options: ['were', 'was', 'are', 'did'],
    correctIndex: 0,
    explanation: "The subject “They” takes were in the past continuous. Put not between were and paying.",
  },
  {
    id: 'b1-pc-7',
    level: 'B1',
    topic: 'past-continuous',
    question: 'While I ___, my sister was cooking.',
    options: ['cleaned', 'was cleaning', 'clean', 'have cleaned'],
    correctIndex: 1,
    explanation: "While links two simultaneous actions in progress. With I, use was cleaning.",
  },
  {
    id: 'b1-pc-8',
    level: 'B1',
    topic: 'past-continuous',
    question: 'The children ___ in the garden when it got dark.',
    options: ['were playing', 'played', 'are playing', 'have played'],
    correctIndex: 0,
    explanation: "The playing was already in progress when it got dark. Children takes were playing.",
  },
  {
    id: 'b1-pc-9',
    level: 'B1',
    topic: 'past-continuous',
    question: 'I hurt my leg while I ___ football.',
    options: ['played', 'was playing', 'am playing', 'have played'],
    correctIndex: 1,
    explanation: "Playing football was in progress when the injury happened. Use was playing for that background activity.",
  },
  {
    id: 'b1-pc-10',
    level: 'B1',
    topic: 'past-continuous',
    question: 'He ___ when the teacher entered the room.',
    options: ['talked', 'was talking', 'is talking', 'has talked'],
    correctIndex: 1,
    explanation: "The talking was in progress when the teacher entered. Use was talking with he.",
  },

  // PRESENT PERFECT vs PAST SIMPLE (20 soru)
  {
    id: 'b1-ppps-1',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'I ___ to Spain three times.',
    options: ['went', 'have been', 'was going', 'have gone yesterday'],
    correctIndex: 1,
    explanation: "This counts visits up to now without a finished past time. Use have been for that experience.",
  },
  {
    id: 'b1-ppps-2',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'We ___ to that restaurant last night.',
    options: ['have gone', 'have been', 'went', 'have gone often'],
    correctIndex: 2,
    explanation: "Last night is a finished past time. Go becomes went in the past simple.",
  },
  {
    id: 'b1-ppps-3',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'She ___ her keys yesterday.',
    options: ['has lost', 'lost', 'has been losing', 'has been lost'],
    correctIndex: 1,
    explanation: "Yesterday identifies a finished past time, so use lost rather than has lost.",
  },
  {
    id: 'b1-ppps-4',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'I ___ him since we were at school together.',
    options: ['didn’t see', 'haven’t seen', 'don’t see', 'wasn’t seeing'],
    correctIndex: 1,
    explanation: "Since school describes a period continuing to now. The negative present perfect is haven’t seen.",
  },
  {
    id: 'b1-ppps-5',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'They ___ here in 2010.',
    options: ['have moved', 'moved', 'have been moving', 'move'],
    correctIndex: 1,
    explanation: "In 2010 is a finished past date. Use moved in the past simple.",
  },
  {
    id: 'b1-ppps-6',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'We ___ this movie before, so let’s watch something else.',
    options: ['saw', 'have seen', 'were seeing', 'see'],
    correctIndex: 1,
    explanation: "The experience matters to the present choice of movie. Have seen refers to experience up to now.",
  },
  {
    id: 'b1-ppps-7',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'He ___ his job last month.',
    options: ['has left', 'left', 'has been leaving', 'leaves'],
    correctIndex: 1,
    explanation: "Last month is a finished time period. Use the past simple left.",
  },
  {
    id: 'b1-ppps-8',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'I ___ my homework. Can I go out now?',
    options: ['have finished', 'finished yesterday', 'am finishing', 'finish'],
    correctIndex: 0,
    explanation: "Have finished shows a completed action with a present result: the speaker is free to go out.",
  },
  {
    id: 'b1-ppps-9',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: "We ___ in this city for ten years, and we still live here.",
    options: ['lived', 'have lived', 'were living', 'live'],
    correctIndex: 1,
    explanation: "The speakers still live here, so the ten-year period continues to now. Use have lived.",
  },
  {
    id: 'b1-ppps-10',
    level: 'B1',
    topic: 'present-perfect-vs-past-simple',
    question: 'She ___ to the dentist last week.',
    options: ['has gone', 'went', 'has been', 'goes'],
    correctIndex: 1,
    explanation: "Last week is a finished past period. The correct past simple form is went.",
  },

  // FIRST CONDITIONAL (20 soru)
  {
    id: 'b1-cond-1',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If it ___ tomorrow, we will stay at home.',
    options: ['rains', 'will rain', 'rain', 'is raining'],
    correctIndex: 0,
    explanation: "In the first conditional, use present simple in the if-clause even when the situation is future: if it rains.",
  },
  {
    id: 'b1-cond-2',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If I see her, I ___ her the news.',
    options: ['tell', 'will tell', 'told', 'am telling'],
    correctIndex: 1,
    explanation: "Use will + base verb for the predicted result of a possible future condition: will tell.",
  },
  {
    id: 'b1-cond-3',
    level: 'B1',
    topic: 'first-conditional',
    question: 'You will be late if you ___ now.',
    options: ['don’t leave', 'won’t leave', 'didn’t leave', 'not leave'],
    correctIndex: 0,
    explanation: "Use present simple after if. With you, the negative is don’t + leave.",
  },
  {
    id: 'b1-cond-4',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If we ___ enough money, we will go on holiday.',
    options: ['have', 'had', 'will have', 'are having'],
    correctIndex: 0,
    explanation: "The if-clause takes present simple: if we have. Will belongs in the result clause.",
  },
  {
    id: 'b1-cond-5',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If he studies hard, he ___ the exam.',
    options: ['passes', 'will pass', 'passed', 'is passing'],
    correctIndex: 1,
    explanation: "The possible result uses will + base verb: will pass.",
  },
  {
    id: 'b1-cond-6',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If you don’t hurry, you ___ the bus.',
    options: ['miss', 'will miss', 'missed', 'are missing'],
    correctIndex: 1,
    explanation: "Will miss predicts the result of not hurrying. Use will before the base form miss.",
  },
  {
    id: 'b1-cond-7',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If they invite us, we ___ to the party.',
    options: ['come', 'will come', 'came', 'are coming'],
    correctIndex: 1,
    explanation: "Will come expresses the future result of receiving an invitation.",
  },
  {
    id: 'b1-cond-8',
    level: 'B1',
    topic: 'first-conditional',
    question: 'I will be angry if you ___ late again.',
    options: ['are', 'will be', 'were', 'be'],
    correctIndex: 0,
    explanation: "Use present simple after if. The form of be with you is are.",
  },
  {
    id: 'b1-cond-9',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If she doesn’t call, I ___ her an email.',
    options: ['send', 'will send', 'sent', 'am sending'],
    correctIndex: 1,
    explanation: "The result clause uses will + send. The condition already uses present simple: doesn’t call.",
  },
  {
    id: 'b1-cond-10',
    level: 'B1',
    topic: 'first-conditional',
    question: 'If we ___ now, we won’t catch the train.',
    options: ['don’t leave', 'won’t leave', 'didn’t leave', 'not leave'],
    correctIndex: 0,
    explanation: "The condition is present simple negative: if we don’t leave. Won’t belongs in the future result clause.",
  },

  // MODAL VERBS (20 soru)
  {
    id: 'b1-mod-1',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: 'You ___ speak Japanese very well. That’s impressive!',
    options: ['can', 'could', 'should', 'may'],
    correctIndex: 0,
    explanation: "Can expresses present ability. The speaker is praising someone’s ability to speak Japanese.",
  },
  {
    id: 'b1-mod-2',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: "Make an informal request for permission: ___ I open the window? It’s very hot in here.",
    options: ["Must","Do","Am","Can"],
    correctIndex: 3,
    explanation: "Can I …? is a common informal request for permission. The verb after can remains in its base form.",
  },
  {
    id: 'b1-mod-3',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: 'You look tired. You ___ go to bed earlier.',
    options: ['may', 'should', 'can', 'mustn’t'],
    correctIndex: 1,
    explanation: "Should expresses advice. Going to bed earlier is a recommendation, not a prohibition.",
  },
  {
    id: 'b1-mod-4',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: 'When I was a child, I ___ swim very well.',
    options: ['can', 'could', 'may', 'should'],
    correctIndex: 1,
    explanation: "Could expresses general ability in the past. When I was a child supplies the past context.",
  },
  {
    id: 'b1-mod-5',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: "The exam rules prohibit phones: Students ___ use their phones in the exam.",
    options: ['must', 'can', 'mustn’t', 'should'],
    correctIndex: 2,
    explanation: "Mustn’t means something is prohibited. The exam rule bans the use of phones.",
  },
  {
    id: 'b1-mod-6',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: "You are a visitor. You ___ park your car here. It’s for staff only.",
    options: ['must', 'mustn’t', 'can', 'could'],
    correctIndex: 1,
    explanation: "Mustn’t expresses prohibition. A visitor is not allowed to use this staff-only parking space.",
  },
  {
    id: 'b1-mod-7',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: 'I ___ help you if you want.',
    options: ['should', 'must', 'can', 'have to'],
    correctIndex: 2,
    explanation: "Can is used to offer help that the speaker is able to give.",
  },
  {
    id: 'b1-mod-8',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: 'It ___ rain later, so take an umbrella.',
    options: ['may', 'must', 'can', 'should'],
    correctIndex: 0,
    explanation: "May expresses a possibility. Rain is possible, so taking an umbrella is sensible.",
  },
  {
    id: 'b1-mod-9',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: 'You ___ smoke here. It’s forbidden.',
    options: ['may', 'should', 'mustn’t', 'could'],
    correctIndex: 2,
    explanation: "Mustn’t means not allowed. It matches the explicit statement that smoking is forbidden.",
  },
  {
    id: 'b1-mod-10',
    level: 'B1',
    topic: 'modals-ability-permission-advice',
    question: 'You ___ see a doctor if you don’t feel better.',
    options: ['may', 'should', 'can', 'mustn’t'],
    correctIndex: 1,
    explanation: "Should gives advice about what is a good idea if the illness continues.",
  },

  // RELATIVE CLAUSES BASIC (20 soru)
  {
    id: 'b1-rel-1',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'The man ___ lives next door is a doctor.',
    options: ['which', 'who', 'where', 'whose'],
    correctIndex: 1,
    explanation: "Who refers to a person and is the subject of lives. Which normally refers to things.",
  },
  {
    id: 'b1-rel-2',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'This is the book ___ I told you about.',
    options: ['who', 'where', 'which', 'when'],
    correctIndex: 2,
    explanation: "Which refers to the book, a thing, and is the object of told you about.",
  },
  {
    id: 'b1-rel-3',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'That’s the girl ___ brother is in my class.',
    options: ['who', 'whose', 'which', 'where'],
    correctIndex: 1,
    explanation: "Whose shows possession: the brother belongs to the girl mentioned.",
  },
  {
    id: 'b1-rel-4',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'The restaurant ___ we had dinner was very expensive.',
    options: ['who', 'whose', 'where', 'which'],
    correctIndex: 2,
    explanation: "Where refers to the restaurant as the place in which dinner happened.",
  },
  {
    id: 'b1-rel-5',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'I met a woman ___ speaks four languages.',
    options: ['who', 'which', 'where', 'when'],
    correctIndex: 0,
    explanation: "Who refers to the woman and is the subject of speaks.",
  },
  {
    id: 'b1-rel-6',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'This is the place ___ we first met.',
    options: ['who', 'where', 'which', 'whose'],
    correctIndex: 1,
    explanation: "Where introduces a relative clause describing the place at which they first met.",
  },
  {
    id: 'b1-rel-7',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'Do you remember the day ___ we moved here?',
    options: ['who', 'which', 'when', 'where'],
    correctIndex: 2,
    explanation: "When introduces a relative clause about the time: the day on which they moved.",
  },
  {
    id: 'b1-rel-8',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'The car ___ he drives is very old.',
    options: ['who', 'which', 'when', 'where'],
    correctIndex: 1,
    explanation: "Which refers to the car, a thing, and is the object of drives.",
  },
  {
    id: 'b1-rel-9',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'The people ___ live upstairs are very noisy.',
    options: ['who', 'which', 'whose', 'where'],
    correctIndex: 0,
    explanation: "Who refers to people and is the subject of live.",
  },
  {
    id: 'b1-rel-10',
    level: 'B1',
    topic: 'relative-clauses-basic',
    question: 'Is that the shop ___ you bought your jacket?',
    options: ['who', 'which', 'when', 'where'],
    correctIndex: 3,
    explanation: "Where means at which place. The shop is the location of the purchase.",
  },

  // Further practice and newly added B1 topics.
  {
    "id": "b1-pp-11",
    "level": "B1",
    "topic": "present-perfect",
    "question": "Use the present perfect: The delivery driver ___ our parcel yet.",
    "options": [
      "hasn't bring",
      "haven't brought",
      "hasn't brought",
      "hasn't bringing"
    ],
    "correctIndex": 2,
    "explanation": "The negative present perfect is has not + past participle. Bring has the irregular participle brought."
  },
  {
    "id": "b1-pp-12",
    "level": "B1",
    "topic": "present-perfect",
    "question": "Maya is away on business. She has ___ to Singapore and will return on Friday.",
    "options": [
      "been",
      "went",
      "going",
      "gone"
    ],
    "correctIndex": 3,
    "explanation": "Has gone means Maya travelled there and has not returned. Has been describes a completed visit."
  },
  {
    "id": "b1-pp-13",
    "level": "B1",
    "topic": "present-perfect",
    "question": "Which sentence correctly asks about an experience at any time before now?",
    "options": [
      "Have you ever ridden a horse?",
      "Have you ever rode a horse?",
      "Has you ever ridden a horse?",
      "Have ever you ride a horse?"
    ],
    "correctIndex": 0,
    "explanation": "Use Have + subject + ever + past participle. The participle of ride is ridden."
  },
  {
    "id": "b1-pp-14",
    "level": "B1",
    "topic": "present-perfect",
    "question": "We have known our neighbours ___ we moved into this street.",
    "options": [
      "for",
      "since",
      "during",
      "until"
    ],
    "correctIndex": 1,
    "explanation": "Since introduces the starting point of a situation that continues to the present. Here that point is the move."
  },
  {
    "id": "b1-pp-15",
    "level": "B1",
    "topic": "present-perfect",
    "question": "Which is the correct negative present perfect sentence?",
    "options": [
      "The children hasn't eaten breakfast yet.",
      "The children haven't ate breakfast yet.",
      "The children haven't eaten breakfast yet.",
      "The children don't eaten breakfast yet."
    ],
    "correctIndex": 2,
    "explanation": "A plural subject takes have, and the past participle of eat is eaten. Yet fits a negative sentence about completion."
  },
  {
    "id": "b1-pp-16",
    "level": "B1",
    "topic": "present-perfect",
    "question": "This is the first time I ___ a speech in English.",
    "options": [
      "gave yesterday",
      "am give",
      "has given",
      "have given"
    ],
    "correctIndex": 3,
    "explanation": "This is the first time is followed by the present perfect to describe a first experience up to the present."
  },
  {
    "id": "b1-pp-17",
    "level": "B1",
    "topic": "present-perfect",
    "question": "Choose the correct present perfect form: How many applications ___ she ___ so far?",
    "options": [
      "has / sent",
      "have / sent",
      "has / send",
      "does / sent"
    ],
    "correctIndex": 0,
    "explanation": "She takes has, and send becomes sent. So far means during the period up to now."
  },
  {
    "id": "b1-pp-18",
    "level": "B1",
    "topic": "present-perfect",
    "question": "The report is not ready. We have ___ completed the introduction, and the other sections are unfinished.",
    "options": [
      "since",
      "only",
      "yet",
      "for"
    ],
    "correctIndex": 1,
    "explanation": "Only limits what has been completed: the introduction and nothing more. It can come between have and the participle."
  },
  {
    "id": "b1-pp-19",
    "level": "B1",
    "topic": "present-perfect",
    "question": "I have never ___ such a crowded train.",
    "options": [
      "took",
      "take",
      "taken",
      "taking"
    ],
    "correctIndex": 2,
    "explanation": "After have never, use a past participle. The forms are take, took, taken."
  },
  {
    "id": "b1-pp-20",
    "level": "B1",
    "topic": "present-perfect",
    "question": "Which sentence describes a situation that began in the past and continues now?",
    "options": [
      "She owned this shop until she sold it.",
      "She bought this shop last Tuesday.",
      "She will open a shop next year.",
      "She has owned this shop for twelve years."
    ],
    "correctIndex": 3,
    "explanation": "Has owned with for twelve years connects a past starting point to the present. The other sentences describe a finished past or future event."
  },
  {
    "id": "b1-pc-11",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Use the past continuous: At midnight, the engineers ___ the damaged bridge.",
    "options": [
      "was inspecting",
      "were inspect",
      "were inspecting",
      "are inspected"
    ],
    "correctIndex": 2,
    "explanation": "A plural subject takes were + the -ing form. Inspecting describes work in progress at midnight."
  },
  {
    "id": "b1-pc-12",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Complete the negative past continuous: I ___ when the alarm went off; I was already awake.",
    "options": [
      "weren't sleeping",
      "wasn't sleep",
      "didn't sleeping",
      "wasn't sleeping"
    ],
    "correctIndex": 3,
    "explanation": "I takes was, so the negative is wasn't sleeping. The alarm happened during the background situation."
  },
  {
    "id": "b1-pc-13",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Choose the correct past continuous question.",
    "options": [
      "Was the mechanic checking the brakes?",
      "Did the mechanic checking the brakes?",
      "Were the mechanic checking the brakes?",
      "Was checking the mechanic the brakes?"
    ],
    "correctIndex": 0,
    "explanation": "A past continuous question places was before the singular subject, followed by the -ing form."
  },
  {
    "id": "b1-pc-14",
    "level": "B1",
    "topic": "past-continuous",
    "question": "While the adults were discussing the route, the children ___ a map. Use the past continuous.",
    "options": [
      "was drawing",
      "were drawing",
      "were drew",
      "are drawing"
    ],
    "correctIndex": 1,
    "explanation": "The two activities were happening at the same time. Children is plural, so use were drawing."
  },
  {
    "id": "b1-pc-15",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Use the past continuous: Why ___ the dog ___ outside the gate at that moment?",
    "options": [
      "were / waiting",
      "did / waiting",
      "was / waiting",
      "was / wait"
    ],
    "correctIndex": 2,
    "explanation": "The question structure is Why + was + singular subject + -ing form."
  },
  {
    "id": "b1-pc-16",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Which sentence shows a short event interrupting an action in progress?",
    "options": [
      "We cross the square every evening.",
      "We have crossed the square twice today.",
      "We will cross the square after lunch.",
      "We were crossing the square when the lights went out."
    ],
    "correctIndex": 3,
    "explanation": "Were crossing gives the action in progress, while went out gives the shorter event that happened during it."
  },
  {
    "id": "b1-pc-17",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Complete the past continuous: You ___ very fast when I tried to catch up with you.",
    "options": [
      "were walking",
      "was walking",
      "were walk",
      "have walking"
    ],
    "correctIndex": 0,
    "explanation": "You always takes were in the past continuous, whether it refers to one person or several."
  },
  {
    "id": "b1-pc-18",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Use the past continuous negative: The printers ___ properly during the power problem.",
    "options": [
      "wasn't working",
      "weren't working",
      "weren't worked",
      "didn't working"
    ],
    "correctIndex": 1,
    "explanation": "Printers is plural. Form the negative with were not + working."
  },
  {
    "id": "b1-pc-19",
    "level": "B1",
    "topic": "past-continuous",
    "question": "Choose the correct spelling in the past continuous: The swimmer was ___ across the lake.",
    "options": [
      "swiming",
      "swam",
      "swimming",
      "swimmed"
    ],
    "correctIndex": 2,
    "explanation": "Swim doubles its final consonant before -ing: swimming. Was must be followed by the -ing form here."
  },
  {
    "id": "b1-pc-20",
    "level": "B1",
    "topic": "past-continuous",
    "question": "At 6:15 I was still preparing dinner. Which question asks about that action in progress?",
    "options": [
      "What did you doing at 6:15?",
      "What were you do at 6:15?",
      "What have you doing at 6:15?",
      "What were you doing at 6:15?"
    ],
    "correctIndex": 3,
    "explanation": "Ask about an action in progress at a past time with were you doing."
  },
  {
    "id": "b1-ppps-11",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "The museum ___ its new gallery in March 2020.",
    "options": [
      "has opened",
      "opened",
      "have opened",
      "has opening"
    ],
    "correctIndex": 1,
    "explanation": "March 2020 is a finished past time, so the past simple opened is appropriate."
  },
  {
    "id": "b1-ppps-12",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "Our family ___ this flat since 2016, and we still own it.",
    "options": [
      "owned last year",
      "owns yesterday",
      "has owned",
      "was owned"
    ],
    "correctIndex": 2,
    "explanation": "Since gives the start of ownership that continues now. Use the present perfect has owned."
  },
  {
    "id": "b1-ppps-13",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "Complete both clauses: I ___ that documentary before, but I ___ it again last night.",
    "options": [
      "saw / have watched",
      "have saw / watched",
      "have seen / have watched",
      "have seen / watched"
    ],
    "correctIndex": 3,
    "explanation": "The first clause describes experience up to now. Last night in the second clause requires the past simple watched."
  },
  {
    "id": "b1-ppps-14",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "Which time phrase explicitly refers to a finished past time?",
    "options": [
      "two days ago",
      "since we arrived",
      "for the past week up to now",
      "so far this month"
    ],
    "correctIndex": 0,
    "explanation": "Ago locates an event in a finished past period. The other phrases normally connect a period to the present."
  },
  {
    "id": "b1-ppps-15",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "Choose the sentence that correctly uses a finished past date.",
    "options": [
      "The company has hired thirty people in 2021.",
      "The company hired thirty people in 2021.",
      "The company have hired thirty people in 2021.",
      "The company has hire thirty people in 2021."
    ],
    "correctIndex": 1,
    "explanation": "A specific completed year takes the past simple. The regular past form of hire is hired."
  },
  {
    "id": "b1-ppps-16",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "The current week is not over. Use the present perfect: We ___ four team meetings so far this week.",
    "options": [
      "had yesterday",
      "has had",
      "have had",
      "have have"
    ],
    "correctIndex": 2,
    "explanation": "So far this week describes an unfinished period up to now. The past participle of have is had."
  },
  {
    "id": "b1-ppps-17",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "Which question asks about a specific finished past occasion?",
    "options": [
      "When have you met your supervisor yesterday?",
      "When do you met your supervisor?",
      "When did you met your supervisor?",
      "When did you meet your supervisor?"
    ],
    "correctIndex": 3,
    "explanation": "Use When did + subject + base verb to ask when a completed event happened."
  },
  {
    "id": "b1-ppps-18",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "The author died in 1952. She ___ six novels during her lifetime.",
    "options": [
      "wrote",
      "has written",
      "has wrote",
      "have written"
    ],
    "correctIndex": 0,
    "explanation": "The author's lifetime is a completed past period, so use the past simple wrote."
  },
  {
    "id": "b1-ppps-19",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "Choose the present perfect sentence about experience, without a finished past date.",
    "options": [
      "I've visited several national parks in 2008.",
      "I've visited several national parks.",
      "I've visit several national parks.",
      "I've visiting several national parks."
    ],
    "correctIndex": 1,
    "explanation": "Have visited describes experience before now. A finished past date such as in 2008 would instead take past simple."
  },
  {
    "id": "b1-ppps-20",
    "level": "B1",
    "topic": "present-perfect-vs-past-simple",
    "question": "Complete the contrast: He ___ in Rome for a year, but he moved away in 2018; he ___ in Madrid since then.",
    "options": [
      "has lived / lived",
      "has lived / has lived yesterday",
      "lived / has lived",
      "lived / have lived"
    ],
    "correctIndex": 2,
    "explanation": "The stay in Rome ended, so use lived. Since then introduces the continuing stay in Madrid, so use has lived."
  },
  {
    "id": "b1-cond-11",
    "level": "B1",
    "topic": "first-conditional",
    "question": "Complete the standard first conditional: If the train ___ early, we will have time for breakfast.",
    "options": [
      "arrives",
      "will arrive",
      "arrived",
      "arrive"
    ],
    "correctIndex": 0,
    "explanation": "Use present simple in the condition and will + base verb in the result. Train takes arrives."
  },
  {
    "id": "b1-cond-12",
    "level": "B1",
    "topic": "first-conditional",
    "question": "If you save the receipt, the shop ___ your money tomorrow.",
    "options": [
      "would have refunded",
      "will refund",
      "refund yesterday",
      "will refunds"
    ],
    "correctIndex": 1,
    "explanation": "Will refund expresses a possible future result. The verb after will stays in the base form."
  },
  {
    "id": "b1-cond-13",
    "level": "B1",
    "topic": "first-conditional",
    "question": "Choose the standard first conditional sentence.",
    "options": [
      "If I will finish the report today, I send it tonight.",
      "If I finished the report today, I'll sent it tonight.",
      "If I finish the report today, I'll send it tonight.",
      "If I finish the report today, I would have sent it tonight."
    ],
    "correctIndex": 2,
    "explanation": "The standard first conditional uses present simple in the if-clause and will + base verb for the future result."
  },
  {
    "id": "b1-cond-14",
    "level": "B1",
    "topic": "first-conditional",
    "question": "We won't know the final price unless the supplier ___ us a quote.",
    "options": [
      "will sends",
      "send",
      "sent yesterday",
      "sends"
    ],
    "correctIndex": 3,
    "explanation": "Unless means if not. In this future condition, use present simple sends, not will in the condition clause."
  },
  {
    "id": "b1-cond-15",
    "level": "B1",
    "topic": "first-conditional",
    "question": "Complete the future result: If you don't charge your phone, it ___ during the trip.",
    "options": [
      "will stop working",
      "would have stopped working",
      "will stopped working",
      "stop working yesterday"
    ],
    "correctIndex": 0,
    "explanation": "The possible future consequence uses will + base verb. Stop working means cease to function."
  },
  {
    "id": "b1-cond-16",
    "level": "B1",
    "topic": "first-conditional",
    "question": "If the weather improves tomorrow, ___ you join us for a walk?",
    "options": [
      "did",
      "will",
      "were",
      "had"
    ],
    "correctIndex": 1,
    "explanation": "A question about the future result begins with will before the subject: will you join?"
  },
  {
    "id": "b1-cond-17",
    "level": "B1",
    "topic": "first-conditional",
    "question": "Rewrite 'We will miss the concert if we leave too late' with the condition first.",
    "options": [
      "If we will leave too late, we miss the concert.",
      "If we left too late, we will missed the concert.",
      "If we leave too late, we will miss the concert.",
      "If we leave too late, we would have missed the concert."
    ],
    "correctIndex": 2,
    "explanation": "Changing the clause order does not change the tenses. A comma normally follows the initial if-clause."
  },
  {
    "id": "b1-cond-18",
    "level": "B1",
    "topic": "first-conditional",
    "question": "Complete the standard first conditional: If there ___ no seats left, I will stand.",
    "options": [
      "will be",
      "is",
      "was",
      "are"
    ],
    "correctIndex": 3,
    "explanation": "Seats is plural, so the condition uses there are. The future consequence is already expressed by will stand."
  },
  {
    "id": "b1-cond-19",
    "level": "B1",
    "topic": "first-conditional",
    "question": "What does 'If you book today, you'll get a discount' mean?",
    "options": [
      "A discount is a possible future result of booking today.",
      "The speaker booked yesterday and received a discount.",
      "Booking today cannot lead to a discount.",
      "A discount was possible only in the past."
    ],
    "correctIndex": 0,
    "explanation": "The first conditional links a real possible condition now or in the future to its predicted future result."
  },
  {
    "id": "b1-cond-20",
    "level": "B1",
    "topic": "first-conditional",
    "question": "Complete the standard first conditional: If you ___ the file, you won't lose your changes.",
    "options": [
      "will saved",
      "save",
      "saved yesterday",
      "saving"
    ],
    "correctIndex": 1,
    "explanation": "The condition uses the present simple save. Won't lose gives the future negative result."
  },
  {
    "id": "b1-mod-11",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "Complete the rule about form: After 'can', we use ___.",
    "options": [
      "to plus the verb",
      "the verb with -s",
      "the past participle only",
      "the base form of the verb"
    ],
    "correctIndex": 3,
    "explanation": "Core modal verbs such as can are followed directly by the base form: can swim, can drive, can help."
  },
  {
    "id": "b1-mod-12",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "The instructions say visitors are allowed to take pictures. Visitors ___ take pictures here.",
    "options": [
      "can",
      "mustn't",
      "are can",
      "cans"
    ],
    "correctIndex": 0,
    "explanation": "Can expresses permission. The notice allows photography, so mustn't would give the opposite meaning."
  },
  {
    "id": "b1-mod-13",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "Choose the sentence giving advice rather than describing ability.",
    "options": [
      "You can read the address without glasses.",
      "You should check the address before leaving.",
      "You could read simple maps at six.",
      "You are able to find the building."
    ],
    "correctIndex": 1,
    "explanation": "Should check recommends a useful action. The other sentences describe what someone is or was able to do."
  },
  {
    "id": "b1-mod-14",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "When Leo was five, he ___ ride a bike, but he learned when he was seven.",
    "options": [
      "can't",
      "doesn't can",
      "couldn't",
      "wasn't could"
    ],
    "correctIndex": 2,
    "explanation": "Couldn't expresses lack of ability at a past age. Can't would refer to present ability."
  },
  {
    "id": "b1-mod-15",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "You ought ___ a copy of the booking confirmation.",
    "options": [
      "keep",
      "keeping",
      "kept",
      "to keep"
    ],
    "correctIndex": 3,
    "explanation": "Ought differs from should because it is followed by to + base verb: ought to keep."
  },
  {
    "id": "b1-mod-16",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "Choose a correctly formed polite request.",
    "options": [
      "Could you explain the last instruction, please?",
      "Could you to explain the last instruction, please?",
      "Could you explained the last instruction, please?",
      "Could you explains the last instruction, please?"
    ],
    "correctIndex": 0,
    "explanation": "A request with could uses could + subject + base verb. No to or tense ending is added."
  },
  {
    "id": "b1-mod-17",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "Which sentence expresses an uncertain possibility?",
    "options": [
      "The parcel certainly arrived yesterday.",
      "The parcel might arrive this afternoon.",
      "The parcel always arrives at noon.",
      "The parcel has already arrived."
    ],
    "correctIndex": 1,
    "explanation": "Might arrive means arrival is possible but not certain. It does not state that the event definitely happens or happened."
  },
  {
    "id": "b1-mod-18",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "Express a recommendation: You ___ use a stronger password to protect your account.",
    "options": [
      "mustn't",
      "should to",
      "should",
      "shoulds"
    ],
    "correctIndex": 2,
    "explanation": "Should + base verb gives a recommendation. Mustn't would prohibit the suggested action."
  },
  {
    "id": "b1-mod-19",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "Choose the correct short answer: 'Can your sister play the violin?' 'Yes, ___.'",
    "options": [
      "she does can",
      "she cans",
      "she is can",
      "she can"
    ],
    "correctIndex": 3,
    "explanation": "A short answer repeats the modal itself: Yes, she can. Do and be are not needed."
  },
  {
    "id": "b1-mod-20",
    "level": "B1",
    "topic": "modals-ability-permission-advice",
    "question": "Which sentence means 'It is not a good idea to drive when you are exhausted'?",
    "options": [
      "You shouldn't drive when you are exhausted.",
      "You should drive when you are exhausted.",
      "You ought drive when you are exhausted.",
      "You shouldn't to drive when you are exhausted."
    ],
    "correctIndex": 0,
    "explanation": "Shouldn't gives negative advice. Like should, it is followed directly by the base form drive."
  },
  {
    "id": "b1-rel-11",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "The photographer ___ took this picture works for a local newspaper.",
    "options": [
      "which",
      "who",
      "where",
      "whose"
    ],
    "correctIndex": 1,
    "explanation": "Who refers to a person and acts as the subject of took. Whose would need a following noun."
  },
  {
    "id": "b1-rel-12",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "We need a cupboard ___ doors can be locked.",
    "options": [
      "who",
      "where",
      "whose",
      "when"
    ],
    "correctIndex": 2,
    "explanation": "Whose can show possession for things as well as people: the cupboard's doors."
  },
  {
    "id": "b1-rel-13",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "The laptop ___ I borrowed has a damaged screen.",
    "options": [
      "who",
      "where",
      "whose",
      "that"
    ],
    "correctIndex": 3,
    "explanation": "That refers to the laptop and is the object of borrowed. It is suitable for a defining relative clause about a thing."
  },
  {
    "id": "b1-rel-14",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "Choose the sentence in which the relative pronoun can be omitted.",
    "options": [
      "This is the song that I downloaded.",
      "This is the singer who won the prize.",
      "This is the bus that stops outside.",
      "This is the dog which escaped yesterday."
    ],
    "correctIndex": 0,
    "explanation": "In the first sentence, that is the object of downloaded. A subject relative pronoun cannot be omitted in the other sentences."
  },
  {
    "id": "b1-rel-15",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "The village ___ my grandparents live has no railway station.",
    "options": [
      "which",
      "where",
      "who",
      "whose"
    ],
    "correctIndex": 1,
    "explanation": "Where means in which place. Live needs a place expression here rather than a direct object."
  },
  {
    "id": "b1-rel-16",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "Do you know anyone ___ repairs musical instruments?",
    "options": [
      "which",
      "where",
      "who",
      "when"
    ],
    "correctIndex": 2,
    "explanation": "Anyone here refers to a person. Who is the subject of repairs in the relative clause."
  },
  {
    "id": "b1-rel-17",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "Complete the clause about a time: Autumn is the season ___ the leaves change colour.",
    "options": [
      "who",
      "whose",
      "where",
      "when"
    ],
    "correctIndex": 3,
    "explanation": "When introduces information about a time or period, here the season of autumn."
  },
  {
    "id": "b1-rel-18",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "Which sentence correctly joins 'I met a chef' and 'Her restaurant is famous'?",
    "options": [
      "I met a chef whose restaurant is famous.",
      "I met a chef who restaurant is famous.",
      "I met a chef which restaurant is famous.",
      "I met a chef where restaurant is famous."
    ],
    "correctIndex": 0,
    "explanation": "Whose replaces her to show the relationship between the chef and her restaurant."
  },
  {
    "id": "b1-rel-19",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "The instructions ___ came with the machine were easy to follow.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctIndex": 1,
    "explanation": "Which refers to the instructions, things, and is the subject of came."
  },
  {
    "id": "b1-rel-20",
    "level": "B1",
    "topic": "relative-clauses-basic",
    "question": "Choose the correctly completed defining relative clause: The woman ___ is our new coach.",
    "options": [
      "which teaches us on Fridays",
      "where teaches us on Fridays",
      "who teaches us on Fridays",
      "whose teaches us on Fridays"
    ],
    "correctIndex": 2,
    "explanation": "Who is the subject of teaches and refers to the woman. Whose would require a noun, such as whose team."
  },
  {
    "id": "b1-past-perfect-1",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Use the past perfect for the earlier action: By the time we reached the campsite, the others ___ their tents.",
    "options": [
      "have put up",
      "had put up",
      "had putted up",
      "has put up"
    ],
    "correctIndex": 1,
    "explanation": "The tents were already in place before the later arrival. Use had + past participle for that earlier action."
  },
  {
    "id": "b1-past-perfect-2",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Complete the past perfect negative: I couldn't print the document because I ___ the printer software.",
    "options": [
      "haven't installed",
      "hadn't install",
      "hadn't installed",
      "wasn't install"
    ],
    "correctIndex": 2,
    "explanation": "The missing installation came before the failed printing attempt. The negative form is hadn't + installed."
  },
  {
    "id": "b1-past-perfect-3",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Which event happened first in 'The film had started when we entered the cinema'?",
    "options": [
      "We entered the cinema.",
      "Both events necessarily happened at the same moment.",
      "The sentence says the film never started.",
      "The film started."
    ],
    "correctIndex": 3,
    "explanation": "Had started places the start of the film before the later action, entered."
  },
  {
    "id": "b1-past-perfect-4",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Choose the correct past perfect question.",
    "options": [
      "Had the guests left before you arrived?",
      "Did the guests had left before you arrived?",
      "Had the guests leave before you arrived?",
      "Have the guests left before you arrived yesterday?"
    ],
    "correctIndex": 0,
    "explanation": "Put had before the subject and use the past participle left. Did is not used with had in this tense."
  },
  {
    "id": "b1-past-perfect-5",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Use the past perfect: She recognised the tune because she ___ it many times before.",
    "options": [
      "had hear",
      "had heard",
      "has heard",
      "have heard"
    ],
    "correctIndex": 1,
    "explanation": "The hearing happened before the recognition. Hear has the past participle heard."
  },
  {
    "id": "b1-past-perfect-6",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Complete the sequence: After the team ___ the equipment, they loaded it into the van. Use the past perfect.",
    "options": [
      "has checked",
      "have checked",
      "had checked",
      "had checking"
    ],
    "correctIndex": 2,
    "explanation": "Had checked marks the checking as completed before the later loading."
  },
  {
    "id": "b1-past-perfect-7",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Which sentence correctly uses the past perfect?",
    "options": [
      "We had book a table before we left home.",
      "We have booked a table before we left home yesterday.",
      "We had booking a table before we left home.",
      "We had booked a table before we left home."
    ],
    "correctIndex": 3,
    "explanation": "The past perfect consists of had followed by the past participle, here booked."
  },
  {
    "id": "b1-past-perfect-8",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Use the past perfect: The pavement was wet because it ___ during the night.",
    "options": [
      "had rained",
      "has rained",
      "had raining",
      "have rain"
    ],
    "correctIndex": 0,
    "explanation": "The rain occurred before the past observation of the wet pavement. Use had rained."
  },
  {
    "id": "b1-past-perfect-9",
    "level": "B1",
    "topic": "past-perfect",
    "question": "At that point in his life, he had never ___ abroad.",
    "options": [
      "flew",
      "flown",
      "fly",
      "flying"
    ],
    "correctIndex": 1,
    "explanation": "The past participle of fly is flown. Had never flown describes experience before a particular past point."
  },
  {
    "id": "b1-past-perfect-10",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Use the past perfect: We were hungry because we ___ lunch.",
    "options": [
      "had miss",
      "have missed",
      "had missed",
      "has missing"
    ],
    "correctIndex": 2,
    "explanation": "Missing lunch explains a later past state, being hungry. Use had + missed."
  },
  {
    "id": "b1-past-perfect-11",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Choose the correctly ordered past perfect question.",
    "options": [
      "Where you had parked the car?",
      "Where had parked you the car?",
      "Where did you had parked the car?",
      "Where had you parked the car?"
    ],
    "correctIndex": 3,
    "explanation": "The order is question word + had + subject + past participle."
  },
  {
    "id": "b1-past-perfect-12",
    "level": "B1",
    "topic": "past-perfect",
    "question": "The email was already in her inbox when she woke up. Complete with the past perfect: Her colleague ___ it earlier.",
    "options": [
      "had sent",
      "has sent",
      "had send",
      "have sent"
    ],
    "correctIndex": 0,
    "explanation": "Had sent places the email before the later waking. Sent is the participle of send."
  },
  {
    "id": "b1-past-perfect-13",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Complete the past perfect short answer: 'Had you met the organiser before?' 'No, ___.'",
    "options": [
      "I didn't had",
      "I hadn't",
      "I haven't",
      "I wasn't"
    ],
    "correctIndex": 1,
    "explanation": "A short answer repeats the auxiliary had. Its negative form is hadn't."
  },
  {
    "id": "b1-past-perfect-14",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Use the past perfect: The shopkeeper discovered that someone ___ the back window.",
    "options": [
      "had broke",
      "has broken",
      "had broken",
      "have broke"
    ],
    "correctIndex": 2,
    "explanation": "The damage occurred before it was discovered. Break has the forms break, broke, broken."
  },
  {
    "id": "b1-past-perfect-15",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Complete the past perfect: They ___ already ___ the address, so they didn't need directions.",
    "options": [
      "have / written down",
      "had / wrote down",
      "had / write down",
      "had / written down"
    ],
    "correctIndex": 3,
    "explanation": "Already fits between had and the participle. Written down shows that the address was recorded before directions were offered."
  },
  {
    "id": "b1-past-perfect-16",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Which sentence places the preparation before the guests' arrival?",
    "options": [
      "We had prepared the meal when the guests arrived.",
      "We will prepare the meal when the guests arrive.",
      "We prepare the meal whenever guests arrive.",
      "We are preparing the meal as the guests arrive."
    ],
    "correctIndex": 0,
    "explanation": "Had prepared identifies an action completed before a later past event."
  },
  {
    "id": "b1-past-perfect-17",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Use the past perfect: I returned to the platform because I ___ my umbrella on the bench.",
    "options": [
      "have left",
      "had left",
      "had leave",
      "has left"
    ],
    "correctIndex": 1,
    "explanation": "The umbrella was left before the return to the platform. The participle of leave is left."
  },
  {
    "id": "b1-past-perfect-18",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Complete the past perfect: By noon yesterday, the volunteers ___ all the food parcels.",
    "options": [
      "has delivered",
      "have deliver",
      "had delivered",
      "had delivering"
    ],
    "correctIndex": 2,
    "explanation": "By a past deadline can describe completion before that point. Use had delivered."
  },
  {
    "id": "b1-past-perfect-19",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Choose the correct sentence about an earlier past experience.",
    "options": [
      "Before that trip, I had never sleep in a tent.",
      "Before that trip, I have never slept in a tent.",
      "Before that trip, I had never sleeping in a tent.",
      "Before that trip, I had never slept in a tent."
    ],
    "correctIndex": 3,
    "explanation": "Had never slept describes the absence of an experience before the past trip. Slept is the participle of sleep."
  },
  {
    "id": "b1-past-perfect-20",
    "level": "B1",
    "topic": "past-perfect",
    "question": "Use the past perfect: The guide apologised because she ___ us the wrong meeting point.",
    "options": [
      "had given",
      "has given",
      "had gave",
      "have given"
    ],
    "correctIndex": 0,
    "explanation": "The incorrect information was given before the apology. Use had + given."
  },
  {
    "id": "b1-passive-voice-1",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Change 'The librarian checks the returns every morning' to the passive.",
    "options": [
      "The returns is checked every morning by the librarian.",
      "The returns checked every morning by the librarian.",
      "The returns are checked every morning by the librarian.",
      "The returns are checking every morning by the librarian."
    ],
    "correctIndex": 2,
    "explanation": "The active object returns becomes the passive subject. Present simple passive uses are + checked for a plural subject."
  },
  {
    "id": "b1-passive-voice-2",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Change 'A local artist painted this mural' to the passive.",
    "options": [
      "This mural is paint by a local artist.",
      "This mural painted by a local artist.",
      "This mural was painting by a local artist.",
      "This mural was painted by a local artist."
    ],
    "correctIndex": 3,
    "explanation": "The active past simple becomes was + past participle. The artist can be included after by."
  },
  {
    "id": "b1-passive-voice-3",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Which sentence is in the passive voice?",
    "options": [
      "The sports hall is cleaned after every match.",
      "The cleaners wash the sports hall floor.",
      "The caretaker locks the sports hall.",
      "The players leave the sports hall at nine."
    ],
    "correctIndex": 0,
    "explanation": "Is cleaned focuses on the hall receiving the action. In the other sentences, the subject performs the action."
  },
  {
    "id": "b1-passive-voice-4",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Complete the present simple passive: These gloves ___ from recycled materials.",
    "options": [
      "is made",
      "are made",
      "are make",
      "made"
    ],
    "correctIndex": 1,
    "explanation": "A plural subject takes are, followed by the past participle made."
  },
  {
    "id": "b1-passive-voice-5",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Complete the past simple passive: The damaged roof ___ last winter.",
    "options": [
      "were repaired",
      "was repair",
      "was repaired",
      "is repairing"
    ],
    "correctIndex": 2,
    "explanation": "Roof is singular and the time is past, so use was repaired."
  },
  {
    "id": "b1-passive-voice-6",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Which preposition introduces the person who performs the action in a passive sentence? 'The letter was signed ___ the director.'",
    "options": [
      "with",
      "at",
      "from",
      "by"
    ],
    "correctIndex": 3,
    "explanation": "By introduces the agent of the action in a passive sentence: signed by the director."
  },
  {
    "id": "b1-passive-voice-7",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Change 'They don't sell tickets at the entrance' to the passive.",
    "options": [
      "Tickets aren't sold at the entrance.",
      "Tickets don't sold at the entrance.",
      "Tickets isn't sold at the entrance.",
      "Tickets aren't selling at the entrance."
    ],
    "correctIndex": 0,
    "explanation": "The negative present passive is aren't + past participle. The participle of sell is sold."
  },
  {
    "id": "b1-passive-voice-8",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Complete the past passive question: ___ the invitations sent on Monday?",
    "options": [
      "Did",
      "Were",
      "Was",
      "Have"
    ],
    "correctIndex": 1,
    "explanation": "Invitations is plural, so a past passive question starts with Were. Sent is the past participle."
  },
  {
    "id": "b1-passive-voice-9",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Change 'The storm damaged several boats' to the passive.",
    "options": [
      "Several boats was damaged by the storm.",
      "Several boats damaged by the storm.",
      "Several boats were damaged by the storm.",
      "Several boats were damaging by the storm."
    ],
    "correctIndex": 2,
    "explanation": "Boats becomes the plural passive subject, followed by were damaged. The cause can follow by."
  },
  {
    "id": "b1-passive-voice-10",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Choose the correct active version of 'The meals are prepared by the kitchen team'.",
    "options": [
      "The meals prepare the kitchen team.",
      "The kitchen team was prepared by the meals.",
      "The meals are preparing the kitchen team.",
      "The kitchen team prepares the meals."
    ],
    "correctIndex": 3,
    "explanation": "In the active version, the kitchen team performs the action and the meals are the object."
  },
  {
    "id": "b1-passive-voice-11",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Complete the modal passive: Mobile phones must ___ during the performance.",
    "options": [
      "be switched off",
      "switching off",
      "been switched off",
      "be switch off"
    ],
    "correctIndex": 0,
    "explanation": "After a modal such as must, the passive structure is be + past participle."
  },
  {
    "id": "b1-passive-voice-12",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Change 'Someone stole my bicycle yesterday' to the passive without naming the thief.",
    "options": [
      "My bicycle stole yesterday.",
      "My bicycle was stolen yesterday.",
      "My bicycle was stole yesterday.",
      "My bicycle is stealing yesterday."
    ],
    "correctIndex": 1,
    "explanation": "Use was + stolen, the past participle of steal. An unknown or unimportant agent can be omitted."
  },
  {
    "id": "b1-passive-voice-13",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Complete the future passive: The competition results ___ online tomorrow.",
    "options": [
      "will announced",
      "will be announce",
      "will be announced",
      "will announcing"
    ],
    "correctIndex": 2,
    "explanation": "The future passive structure is will + be + past participle."
  },
  {
    "id": "b1-passive-voice-14",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Which passive sentence keeps the meaning of 'People speak Spanish in many countries'?",
    "options": [
      "Spanish speaks people in many countries.",
      "Spanish is spoke in many countries.",
      "Spanish are spoken in many countries.",
      "Spanish is spoken in many countries."
    ],
    "correctIndex": 3,
    "explanation": "Spanish is the singular subject receiving the action, so use is spoken. The general agent people need not be included."
  },
  {
    "id": "b1-passive-voice-15",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Complete the present passive question: How often ___ the filters changed?",
    "options": [
      "are",
      "do",
      "is",
      "have"
    ],
    "correctIndex": 0,
    "explanation": "Filters is plural, and changed is a past participle. The present passive question uses are the filters changed?"
  },
  {
    "id": "b1-passive-voice-16",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Choose the correct negative past passive sentence.",
    "options": [
      "The documents didn't delivered on time.",
      "The documents weren't delivered on time.",
      "The documents wasn't delivered on time.",
      "The documents weren't deliver on time."
    ],
    "correctIndex": 1,
    "explanation": "Documents takes were; adding not gives weren't. The main verb remains the participle delivered."
  },
  {
    "id": "b1-passive-voice-17",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Change 'The students can borrow these dictionaries' to the passive.",
    "options": [
      "These dictionaries can borrowed by the students.",
      "These dictionaries can be borrow by the students.",
      "These dictionaries can be borrowed by the students.",
      "These dictionaries can borrowing by the students."
    ],
    "correctIndex": 2,
    "explanation": "The modal can is followed by the passive infinitive be borrowed."
  },
  {
    "id": "b1-passive-voice-18",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Choose the correct passive form: This novel ___ into several languages since its publication.",
    "options": [
      "has translated",
      "have been translated",
      "has been translate",
      "has been translated"
    ],
    "correctIndex": 3,
    "explanation": "Since links the action to the present. The present perfect passive is has been + translated."
  },
  {
    "id": "b1-passive-voice-19",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Which sentence focuses on the result while leaving out the person who did the work?",
    "options": [
      "All the broken windows have been replaced.",
      "The builders have replaced all the broken windows.",
      "The caretaker has ordered new windows.",
      "The neighbours have paid for the windows."
    ],
    "correctIndex": 0,
    "explanation": "Have been replaced is passive and omits the agent. The other sentences name subjects that perform their actions."
  },
  {
    "id": "b1-passive-voice-20",
    "level": "B1",
    "topic": "passive-voice",
    "question": "Choose the correct active version of 'The winning goal was scored by Ana'.",
    "options": [
      "The winning goal scored Ana.",
      "Ana scored the winning goal.",
      "Ana was scored by the winning goal.",
      "The winning goal was scoring Ana."
    ],
    "correctIndex": 1,
    "explanation": "The agent after by becomes the active subject, Ana. Past passive was scored becomes past simple scored."
  },
  {
    "id": "b1-zero-conditional-1",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: If you heat ice, it ___.",
    "options": [
      "would melt yesterday",
      "melts",
      "had melted",
      "melt"
    ],
    "correctIndex": 1,
    "explanation": "The zero conditional uses present simple in both clauses to describe a general result. Ice takes melts."
  },
  {
    "id": "b1-zero-conditional-2",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Which sentence describes a general rule rather than a particular future prediction?",
    "options": [
      "If the paper arrives tomorrow, we'll print the leaflets.",
      "If I had a printer, I would print the leaflets.",
      "If this printer runs out of paper, it stops.",
      "If we'd had paper, we would have printed them."
    ],
    "correctIndex": 2,
    "explanation": "Runs and stops are both present simple. The sentence describes what normally happens whenever the condition occurs."
  },
  {
    "id": "b1-zero-conditional-3",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: If the password ___ incorrect, the app rejects it.",
    "options": [
      "will is",
      "were yesterday",
      "be",
      "is"
    ],
    "correctIndex": 3,
    "explanation": "The condition in a zero conditional uses present simple. Password is singular, so use is."
  },
  {
    "id": "b1-zero-conditional-4",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Describe a regular habit using the zero conditional: If I miss the early bus, I ___ to work.",
    "options": [
      "walk",
      "walks",
      "walking",
      "have walked yesterday"
    ],
    "correctIndex": 0,
    "explanation": "A regular result uses present simple, and I takes the base form walk."
  },
  {
    "id": "b1-zero-conditional-5",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: Plants wilt if they ___ enough water.",
    "options": [
      "doesn't receive",
      "don't receive",
      "not receive",
      "didn't receiving"
    ],
    "correctIndex": 1,
    "explanation": "Plants is plural, so the negative present simple is don't receive."
  },
  {
    "id": "b1-zero-conditional-6",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Choose the correctly formed zero conditional sentence.",
    "options": [
      "If a customer pay by card, the machine prints a receipt.",
      "If a customer pays by card, the machine print a receipt.",
      "If a customer pays by card, the machine prints a receipt.",
      "If a customer paying by card, the machine prints a receipt."
    ],
    "correctIndex": 2,
    "explanation": "Both clauses use present simple. The singular subjects customer and machine require pays and prints."
  },
  {
    "id": "b1-zero-conditional-7",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the general rule: If you ___ this switch, the screen lights up.",
    "options": [
      "presses",
      "pressing",
      "to press",
      "press"
    ],
    "correctIndex": 3,
    "explanation": "You takes the base form press in the present simple condition."
  },
  {
    "id": "b1-zero-conditional-8",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "In a zero conditional about a repeated result, which word can often replace 'if'?",
    "options": [
      "when",
      "although",
      "despite",
      "unless not"
    ],
    "correctIndex": 0,
    "explanation": "When can introduce a repeated situation with a predictable result, such as When you press the switch, the screen lights up."
  },
  {
    "id": "b1-zero-conditional-9",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: If people ___ their tickets, the inspector asks to see identification.",
    "options": [
      "loses",
      "lose",
      "losing",
      "to lose"
    ],
    "correctIndex": 1,
    "explanation": "People is plural, so use lose in the present simple condition."
  },
  {
    "id": "b1-zero-conditional-10",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Choose the correct negative result in a zero conditional: If the door isn't closed, the washing machine ___.",
    "options": [
      "don't start",
      "isn't start",
      "doesn't start",
      "doesn't starts"
    ],
    "correctIndex": 2,
    "explanation": "The machine is singular, so use doesn't + base verb start."
  },
  {
    "id": "b1-zero-conditional-11",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Which meaning matches 'If I drink coffee late, I don't sleep well'?",
    "options": [
      "This happened only once ten years ago.",
      "The speaker is imagining an impossible past.",
      "The speaker never drinks coffee at any time.",
      "This is a usual result for the speaker."
    ],
    "correctIndex": 3,
    "explanation": "Present simple in both clauses expresses a repeated or usual relationship for this speaker."
  },
  {
    "id": "b1-zero-conditional-12",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: If our manager ___ away, the deputy runs the meeting.",
    "options": [
      "is",
      "are",
      "being",
      "be"
    ],
    "correctIndex": 0,
    "explanation": "Manager is singular, so the present simple condition uses is away."
  },
  {
    "id": "b1-zero-conditional-13",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the result of a general rule: If the temperature falls below the thermostat setting, the heating ___.",
    "options": [
      "come on",
      "comes on",
      "coming on",
      "is come on"
    ],
    "correctIndex": 1,
    "explanation": "Heating is treated as singular here. Comes on is present simple and means starts operating."
  },
  {
    "id": "b1-zero-conditional-14",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Choose the zero conditional version with the same meaning as 'Whenever I have a headache, I rest'.",
    "options": [
      "If I had a headache, I would rest.",
      "If I had had a headache, I would have rested.",
      "If I have a headache, I rest.",
      "If I will have a headache, I rested."
    ],
    "correctIndex": 2,
    "explanation": "Whenever here describes a repeated situation. Present simple in both clauses preserves that habitual meaning."
  },
  {
    "id": "b1-zero-conditional-15",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: If a file is too large, this program ___ it.",
    "options": [
      "compress",
      "compressing",
      "to compress",
      "compresses"
    ],
    "correctIndex": 3,
    "explanation": "Program is singular. The zero conditional result takes the present simple compresses."
  },
  {
    "id": "b1-zero-conditional-16",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Choose the correctly ordered zero conditional question.",
    "options": [
      "What happens if you unplug the router?",
      "What happen if you unplug the router?",
      "What happens if you unplugs the router?",
      "What happening if you unplug the router?"
    ],
    "correctIndex": 0,
    "explanation": "What happens asks about the general result. You unplug uses the present simple in the condition."
  },
  {
    "id": "b1-zero-conditional-17",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete a general safety rule: If an alarm sounds, everyone ___ the building by the nearest safe exit.",
    "options": [
      "leave",
      "leaves",
      "leaving",
      "to leave"
    ],
    "correctIndex": 1,
    "explanation": "Everyone takes a singular verb, so use leaves when describing the regular response."
  },
  {
    "id": "b1-zero-conditional-18",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Which pair of tenses is normally used in a zero conditional?",
    "options": [
      "Past perfect in both clauses",
      "Will in the if-clause and past simple in the result",
      "Present simple in both clauses",
      "Present perfect followed by would have"
    ],
    "correctIndex": 2,
    "explanation": "The usual pattern is if + present simple, present simple, used for facts, rules and habits."
  },
  {
    "id": "b1-zero-conditional-19",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: If we ___ food in this container, it stays fresh longer.",
    "options": [
      "keeps",
      "keeping",
      "to keep",
      "keep"
    ],
    "correctIndex": 3,
    "explanation": "We takes keep in present simple. The result stays is also present simple."
  },
  {
    "id": "b1-zero-conditional-20",
    "level": "B1",
    "topic": "zero-conditional",
    "question": "Complete the zero conditional: This light turns red if the battery ___ low.",
    "options": [
      "gets",
      "get",
      "getting",
      "to get"
    ],
    "correctIndex": 0,
    "explanation": "The singular noun battery takes gets. Both clauses describe the device's normal behaviour."
  },
  {
    "id": "b1-second-conditional-1",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the second conditional: If I ___ more free time, I would join the photography club.",
    "options": [
      "have",
      "will have",
      "would have",
      "had"
    ],
    "correctIndex": 3,
    "explanation": "Use past simple in the condition and would + base verb in the result to imagine a different present situation."
  },
  {
    "id": "b1-second-conditional-2",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Use the second conditional: If we lived nearer the coast, we ___ sailing more often.",
    "options": [
      "would go",
      "will go",
      "would went",
      "goes"
    ],
    "correctIndex": 0,
    "explanation": "The imagined result uses would + base verb, so the correct form is would go."
  },
  {
    "id": "b1-second-conditional-3",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Choose the formal second conditional form: If I ___ you, I would ask for a receipt.",
    "options": [
      "am",
      "were",
      "will be",
      "would be"
    ],
    "correctIndex": 1,
    "explanation": "If I were you is a standard expression for giving advice about another person's situation."
  },
  {
    "id": "b1-second-conditional-4",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Which sentence imagines a situation that is not true now?",
    "options": [
      "I own a car and drive to work every day.",
      "I bought a car last year and drove to work.",
      "If I owned a car, I would drive to work.",
      "I have ordered a car and will collect it tomorrow."
    ],
    "correctIndex": 2,
    "explanation": "The second conditional imagines owning a car, instead of stating that the speaker owns one."
  },
  {
    "id": "b1-second-conditional-5",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the second conditional: If the library ___ open later, more people would use it.",
    "options": [
      "stays",
      "will stay",
      "would stay",
      "stayed"
    ],
    "correctIndex": 3,
    "explanation": "The condition takes past simple stayed even though the imagined situation concerns the present or future."
  },
  {
    "id": "b1-second-conditional-6",
    "level": "B1",
    "topic": "second-conditional",
    "question": "If you could live anywhere, where ___ you choose to live?",
    "options": [
      "would",
      "will yesterday",
      "did have",
      "were"
    ],
    "correctIndex": 0,
    "explanation": "Would before the subject forms a question about the imagined result: where would you choose?"
  },
  {
    "id": "b1-second-conditional-7",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the second conditional negative: If I had a quieter room, I ___ so many mistakes.",
    "options": [
      "won't made",
      "wouldn't make",
      "wouldn't made",
      "don't making"
    ],
    "correctIndex": 1,
    "explanation": "The negative imagined result is wouldn't + base verb make."
  },
  {
    "id": "b1-second-conditional-8",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Choose the correctly formed second conditional sentence.",
    "options": [
      "If she would know the answer, she tells us.",
      "If she knows the answer, she would told us.",
      "If she knew the answer, she would tell us.",
      "If she knew the answer, she will told us."
    ],
    "correctIndex": 2,
    "explanation": "The standard pattern is if + past simple, would + base verb. Knew is the past form of know."
  },
  {
    "id": "b1-second-conditional-9",
    "level": "B1",
    "topic": "second-conditional",
    "question": "I cannot speak Italian. Complete the imagined result: If I spoke Italian, I ___ this letter myself.",
    "options": [
      "can translated",
      "could translated",
      "will translating",
      "could translate"
    ],
    "correctIndex": 3,
    "explanation": "Could + base verb can express an ability in the result of an imagined condition."
  },
  {
    "id": "b1-second-conditional-10",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Use the second conditional: If the bus service ___ more reliable, fewer people would drive.",
    "options": [
      "were",
      "is",
      "will be",
      "would be"
    ],
    "correctIndex": 0,
    "explanation": "Were is the formal form of be in this hypothetical condition. Would belongs in the result clause."
  },
  {
    "id": "b1-second-conditional-11",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the second conditional: I would take the job if the salary ___ higher.",
    "options": [
      "will be",
      "were",
      "would be",
      "is being yesterday"
    ],
    "correctIndex": 1,
    "explanation": "The condition can follow the result, but its verb still uses a past form: if the salary were higher."
  },
  {
    "id": "b1-second-conditional-12",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Which sentence gives advice using the second conditional?",
    "options": [
      "Back up those files now.",
      "I backed up those files yesterday.",
      "If I were you, I would back up those files.",
      "Those files have already been backed up."
    ],
    "correctIndex": 2,
    "explanation": "If I were you imagines taking the other person's position, and would back up gives the recommended action."
  },
  {
    "id": "b1-second-conditional-13",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the second conditional: If they ___ less time online, they would sleep better.",
    "options": [
      "spend",
      "will spend",
      "would spend",
      "spent"
    ],
    "correctIndex": 3,
    "explanation": "The imagined condition takes past simple. Spend becomes spent."
  },
  {
    "id": "b1-second-conditional-14",
    "level": "B1",
    "topic": "second-conditional",
    "question": "What does 'If I had a garden, I would grow vegetables' normally suggest?",
    "options": [
      "The speaker does not have a garden at present.",
      "The speaker definitely has a large garden now.",
      "The speaker grew vegetables in a garden yesterday.",
      "The speaker is ordering vegetables from a shop."
    ],
    "correctIndex": 0,
    "explanation": "The second conditional presents having a garden as an imagined alternative to the current situation."
  },
  {
    "id": "b1-second-conditional-15",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the second conditional question: What would happen if everyone ___ the same language?",
    "options": [
      "speaks",
      "spoke",
      "will speak",
      "would speak"
    ],
    "correctIndex": 1,
    "explanation": "Use the past form spoke in the hypothetical if-clause. The question already uses would in the result."
  },
  {
    "id": "b1-second-conditional-16",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Use the second conditional: If my laptop didn't weigh so much, I ___ it on the trip.",
    "options": [
      "will brought",
      "would brought",
      "would bring",
      "bring yesterday"
    ],
    "correctIndex": 2,
    "explanation": "Would bring describes the imagined result of a different present fact about the laptop."
  },
  {
    "id": "b1-second-conditional-17",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the condition: We would save more energy if we ___ the lights off in empty rooms.",
    "options": [
      "turns",
      "will turn",
      "would turned",
      "turned"
    ],
    "correctIndex": 3,
    "explanation": "The if-clause takes past simple turned. The result clause uses would save."
  },
  {
    "id": "b1-second-conditional-18",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Which sentence correctly expresses an unlikely future possibility with the second conditional?",
    "options": [
      "If I won a scholarship, I would study abroad.",
      "If I win a scholarship, I studied abroad.",
      "If I would win a scholarship, I study abroad.",
      "If I won a scholarship, I would studied abroad."
    ],
    "correctIndex": 0,
    "explanation": "Won is past simple in the hypothetical condition; would study gives its imagined future result."
  },
  {
    "id": "b1-second-conditional-19",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Complete the second conditional: If this puzzle ___ easier, the children would solve it without help.",
    "options": [
      "is",
      "were",
      "will be",
      "would be"
    ],
    "correctIndex": 1,
    "explanation": "Use were for the hypothetical condition. The puzzle is being imagined as easier than it actually is."
  },
  {
    "id": "b1-second-conditional-20",
    "level": "B1",
    "topic": "second-conditional",
    "question": "Which pair completes a standard second conditional? 'If we ___ the address, we ___ a map.'",
    "options": [
      "know / wouldn't needed",
      "would know / don't need",
      "knew / wouldn't need",
      "knew / won't needed"
    ],
    "correctIndex": 2,
    "explanation": "The condition uses past simple knew; the negative result uses wouldn't + base verb need."
  },
  {
    "id": "b1-gerunds-infinitives-1",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "We enjoy ___ board games after dinner.",
    "options": [
      "playing",
      "to play",
      "play",
      "played"
    ],
    "correctIndex": 0,
    "explanation": "Enjoy is followed by a gerund, the -ing form used as the verb's object."
  },
  {
    "id": "b1-gerunds-infinitives-2",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "The group decided ___ the early train.",
    "options": [
      "catching",
      "to catch",
      "catch",
      "caught"
    ],
    "correctIndex": 1,
    "explanation": "Decide is followed by to + base verb: decided to catch."
  },
  {
    "id": "b1-gerunds-infinitives-3",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "Please avoid ___ near the emergency exit.",
    "options": [
      "to park",
      "park",
      "parking",
      "parked"
    ],
    "correctIndex": 2,
    "explanation": "Avoid takes a gerund: avoid parking. The to-infinitive is not used after avoid in this meaning."
  },
  {
    "id": "b1-gerunds-infinitives-4",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "Mina promised ___ me when she arrived.",
    "options": [
      "texting",
      "text",
      "texted",
      "to text"
    ],
    "correctIndex": 3,
    "explanation": "Promise is normally followed by a to-infinitive when the same person will do the action."
  },
  {
    "id": "b1-gerunds-infinitives-5",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "Have you finished ___ the kitchen?",
    "options": [
      "cleaning",
      "to clean",
      "clean",
      "cleaned"
    ],
    "correctIndex": 0,
    "explanation": "Finish is followed by the -ing form of the next verb: finished cleaning."
  },
  {
    "id": "b1-gerunds-infinitives-6",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "We hope ___ the new exhibition this weekend.",
    "options": [
      "visiting",
      "to visit",
      "visit",
      "visited"
    ],
    "correctIndex": 1,
    "explanation": "Hope takes a to-infinitive: hope to visit."
  },
  {
    "id": "b1-gerunds-infinitives-7",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "Would you mind ___ the volume down?",
    "options": [
      "to turn",
      "turn",
      "turning",
      "turned"
    ],
    "correctIndex": 2,
    "explanation": "Would you mind is followed by a gerund. This is a polite request to change something."
  },
  {
    "id": "b1-gerunds-infinitives-8",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "She offered ___ our suitcases upstairs.",
    "options": [
      "carrying",
      "carry",
      "carried",
      "to carry"
    ],
    "correctIndex": 3,
    "explanation": "Offer is followed by to + base verb: offered to carry."
  },
  {
    "id": "b1-gerunds-infinitives-9",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "The teacher suggested ___ our notes before the quiz.",
    "options": [
      "reviewing",
      "to review",
      "review",
      "reviewed"
    ],
    "correctIndex": 0,
    "explanation": "Suggest can be followed by a gerund. Suggested to review is not the correct pattern here."
  },
  {
    "id": "b1-gerunds-infinitives-10",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "He refused ___ the document without reading it.",
    "options": [
      "signing",
      "to sign",
      "sign",
      "signed"
    ],
    "correctIndex": 1,
    "explanation": "Refuse takes a to-infinitive: refused to sign."
  },
  {
    "id": "b1-gerunds-infinitives-11",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "I'm interested in ___ a new musical instrument.",
    "options": [
      "to learn",
      "learn",
      "learning",
      "learned"
    ],
    "correctIndex": 2,
    "explanation": "A verb after a preposition such as in normally takes the -ing form."
  },
  {
    "id": "b1-gerunds-infinitives-12",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "We are looking forward to ___ our cousins next month.",
    "options": [
      "see",
      "seen",
      "saw",
      "seeing"
    ],
    "correctIndex": 3,
    "explanation": "In look forward to, to is a preposition, so it is followed by a gerund: seeing."
  },
  {
    "id": "b1-gerunds-infinitives-13",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "Which sentence means that Daniel gave up his smoking habit?",
    "options": [
      "Daniel stopped smoking.",
      "Daniel stopped to smoke.",
      "Daniel stopped for a cigarette.",
      "Daniel paused so that he could smoke."
    ],
    "correctIndex": 0,
    "explanation": "Stop + gerund means end that activity. Stop + to-infinitive means interrupt another activity in order to do it."
  },
  {
    "id": "b1-gerunds-infinitives-14",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "I clearly remember ___ that tiny museum during our childhood holiday.",
    "options": [
      "visit",
      "visiting",
      "visited",
      "to visiting"
    ],
    "correctIndex": 1,
    "explanation": "Remember + gerund refers to a memory of a past action. The visit is being recalled, not planned."
  },
  {
    "id": "b1-gerunds-infinitives-15",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "The supervisor reminded us ___ our identity cards the following morning.",
    "options": [
      "bringing",
      "bring",
      "to bring",
      "brought"
    ],
    "correctIndex": 2,
    "explanation": "Remind + person + to-infinitive tells someone not to forget a future action."
  },
  {
    "id": "b1-gerunds-infinitives-16",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "Let the paint ___ before you touch the door.",
    "options": [
      "to dry",
      "drying",
      "dried",
      "dry"
    ],
    "correctIndex": 3,
    "explanation": "Let + object is followed by the bare infinitive, without to: let the paint dry."
  },
  {
    "id": "b1-gerunds-infinitives-17",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "The funny scene made everyone ___.",
    "options": [
      "laugh",
      "to laugh",
      "laughing",
      "laughed"
    ],
    "correctIndex": 0,
    "explanation": "Active make + object takes a bare infinitive: made everyone laugh."
  },
  {
    "id": "b1-gerunds-infinitives-18",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "Which sentence correctly uses a gerund as the subject?",
    "options": [
      "Swim helps me relax.",
      "Swimming helps me relax.",
      "Swam helps me relax.",
      "Swims helps me relax."
    ],
    "correctIndex": 1,
    "explanation": "The -ing form can function as a noun and be the subject of a sentence: Swimming helps."
  },
  {
    "id": "b1-gerunds-infinitives-19",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "They agreed ___ the bill equally.",
    "options": [
      "sharing",
      "share",
      "to share",
      "shared"
    ],
    "correctIndex": 2,
    "explanation": "Agree is followed by a to-infinitive when it introduces an action: agreed to share."
  },
  {
    "id": "b1-gerunds-infinitives-20",
    "level": "B1",
    "topic": "gerunds-infinitives",
    "question": "We went to the information desk ___ about the delayed flight.",
    "options": [
      "asking to",
      "asked",
      "ask",
      "to ask"
    ],
    "correctIndex": 3,
    "explanation": "A to-infinitive can express purpose: we went there in order to ask about the flight."
  },
  {
    "id": "b1-common-phrasal-verbs-1",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The outdoor concert was called off because of the storm. What does 'called off' mean?",
    "options": [
      "made louder",
      "cancelled",
      "advertised again",
      "recorded"
    ],
    "correctIndex": 1,
    "explanation": "Call off means cancel a planned event or activity."
  },
  {
    "id": "b1-common-phrasal-verbs-2",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "Our train leaves soon. Please put on your coat. What should you do?",
    "options": [
      "Throw your coat away",
      "Repair your coat",
      "Start wearing your coat",
      "Give your coat to a shop"
    ],
    "correctIndex": 2,
    "explanation": "Put on means place clothing on your body so that you are wearing it."
  },
  {
    "id": "b1-common-phrasal-verbs-3",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The neighbour will look after our cat while we are away. What will the neighbour do?",
    "options": [
      "Search for a missing cat",
      "Watch the cat from far away only",
      "Buy the cat from us",
      "Take care of the cat"
    ],
    "correctIndex": 3,
    "explanation": "Look after means take responsibility for someone's or something's care."
  },
  {
    "id": "b1-common-phrasal-verbs-4",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "We ran out of printer paper. Which statement is true?",
    "options": [
      "We have no printer paper left.",
      "We ordered more paper than we needed.",
      "We carried paper outside while running.",
      "We have just repaired the printer."
    ],
    "correctIndex": 0,
    "explanation": "Run out of means use all of a supply so that none remains."
  },
  {
    "id": "b1-common-phrasal-verbs-5",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The appointment has been put off until next Tuesday. It has been ___.",
    "options": [
      "completed",
      "postponed",
      "brought forward to today",
      "forgotten permanently"
    ],
    "correctIndex": 1,
    "explanation": "Put off means delay something until a later time."
  },
  {
    "id": "b1-common-phrasal-verbs-6",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "Could you turn down the radio? I can't concentrate. What change is requested?",
    "options": [
      "Change the radio station",
      "Move the radio downstairs",
      "Make the radio quieter",
      "Turn the radio upside down"
    ],
    "correctIndex": 2,
    "explanation": "Turn down means reduce a setting, especially volume or heat."
  },
  {
    "id": "b1-common-phrasal-verbs-7",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The instructor asked us to fill in a short form. What should we do?",
    "options": [
      "Tear it into small pieces",
      "Put it in a drawer without writing",
      "Read it aloud without answering",
      "Write the required information on it"
    ],
    "correctIndex": 3,
    "explanation": "Fill in a form means complete its spaces with the requested information."
  },
  {
    "id": "b1-common-phrasal-verbs-8",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "I came across an old diary while tidying the attic. How did I find it?",
    "options": [
      "By chance",
      "After buying it online",
      "By asking its author to send it",
      "After making a copy of it"
    ],
    "correctIndex": 0,
    "explanation": "Come across means find or meet something unexpectedly."
  },
  {
    "id": "b1-common-phrasal-verbs-9",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The cyclist didn't give up, even after falling twice. What did the cyclist do?",
    "options": [
      "Stopped trying",
      "Continued trying",
      "Changed to a completely different sport",
      "Handed over the bicycle as a gift"
    ],
    "correctIndex": 1,
    "explanation": "Give up means stop trying. Didn't give up means the person continued despite difficulties."
  },
  {
    "id": "b1-common-phrasal-verbs-10",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "We need to find out why the website is unavailable. What do we need to do?",
    "options": [
      "Hide the reason",
      "Leave the office",
      "Discover the reason",
      "Switch off every computer"
    ],
    "correctIndex": 2,
    "explanation": "Find out means discover or learn information."
  },
  {
    "id": "b1-common-phrasal-verbs-11",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The car broke down on the motorway. What happened?",
    "options": [
      "It reached its destination early.",
      "It travelled down a hill safely.",
      "It was sold to another driver.",
      "It stopped working because of a fault."
    ],
    "correctIndex": 3,
    "explanation": "Break down describes a machine or vehicle failing to work."
  },
  {
    "id": "b1-common-phrasal-verbs-12",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The children get along well with their new classmates. They ___.",
    "options": [
      "have a friendly relationship",
      "always argue with them",
      "travel a long distance to meet them",
      "avoid speaking to them"
    ],
    "correctIndex": 0,
    "explanation": "Get along with someone means have a good relationship with that person."
  },
  {
    "id": "b1-common-phrasal-verbs-13",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "Please pick up the parcel from reception on your way out. What should you do?",
    "options": [
      "Wrap the parcel again",
      "Collect the parcel",
      "Write a complaint about the parcel",
      "Send the parcel back unopened"
    ],
    "correctIndex": 1,
    "explanation": "Pick up can mean collect something from a place."
  },
  {
    "id": "b1-common-phrasal-verbs-14",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The aircraft took off ten minutes late. What happened at that moment?",
    "options": [
      "It landed at its destination.",
      "Its passengers checked in.",
      "It left the ground.",
      "Its luggage was unloaded."
    ],
    "correctIndex": 2,
    "explanation": "When an aircraft takes off, it leaves the ground and starts flying."
  },
  {
    "id": "b1-common-phrasal-verbs-15",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The guide told us to carry on walking until we reached the fountain. We should ___.",
    "options": [
      "stop walking immediately",
      "carry the fountain",
      "return to the starting point",
      "continue walking"
    ],
    "correctIndex": 3,
    "explanation": "Carry on means continue an activity that is already happening."
  },
  {
    "id": "b1-common-phrasal-verbs-16",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The local company set up a small repair workshop. It ___.",
    "options": [
      "established the workshop",
      "closed the workshop permanently",
      "moved all the tools upstairs",
      "painted the workshop ceiling"
    ],
    "correctIndex": 0,
    "explanation": "Set up means establish or start an organisation, business or service."
  },
  {
    "id": "b1-common-phrasal-verbs-17",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "Choose the correct word order when replacing 'the light' with 'it' in 'Turn the light off'.",
    "options": [
      "Turn off it.",
      "Turn it off.",
      "Turn it off it.",
      "Turn off to it."
    ],
    "correctIndex": 1,
    "explanation": "With a separable phrasal verb, an object pronoun goes between the verb and particle: turn it off."
  },
  {
    "id": "b1-common-phrasal-verbs-18",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "My alarm went off at 6:30 this morning. What did it do?",
    "options": [
      "Stopped existing",
      "Moved away from the bed",
      "Started ringing",
      "Became silent before ringing"
    ],
    "correctIndex": 2,
    "explanation": "An alarm goes off when it makes its warning sound."
  },
  {
    "id": "b1-common-phrasal-verbs-19",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "The library wants readers to bring back borrowed books by Friday. Readers should ___.",
    "options": [
      "buy the books",
      "copy all the books",
      "keep the books permanently",
      "return the books"
    ],
    "correctIndex": 3,
    "explanation": "Bring back means return something to the place from which it was taken."
  },
  {
    "id": "b1-common-phrasal-verbs-20",
    "level": "B1",
    "topic": "common-phrasal-verbs",
    "question": "I tried to look up the unfamiliar word in a dictionary. What was I trying to do?",
    "options": [
      "Find its meaning in a reference source",
      "See the word above my head",
      "Invent a different spelling",
      "Avoid reading the word"
    ],
    "correctIndex": 0,
    "explanation": "Look up means search for specific information in a dictionary or another reference source."
  },
  {
    "id": "b1-reported-speech-1",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'I am busy' with backshift: Lena said that she ___ busy.",
    "options": [
      "was",
      "is being tomorrow",
      "were",
      "be"
    ],
    "correctIndex": 0,
    "explanation": "After a past reporting verb, present simple am normally shifts to past simple was."
  },
  {
    "id": "b1-reported-speech-2",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'We live near the station' with backshift: They said that they ___ near the station.",
    "options": [
      "lives",
      "lived",
      "living",
      "have live"
    ],
    "correctIndex": 1,
    "explanation": "Present simple live shifts to past simple lived when backshift is requested."
  },
  {
    "id": "b1-reported-speech-3",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'I will bring the keys' with backshift: Omar said he ___ the keys.",
    "options": [
      "will brought",
      "would brought",
      "would bring",
      "will bringing"
    ],
    "correctIndex": 2,
    "explanation": "Will changes to would in reported speech with backshift. The next verb stays in its base form."
  },
  {
    "id": "b1-reported-speech-4",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'I can repair it' with backshift: The technician said she ___ it.",
    "options": [
      "can repaired",
      "could repaired",
      "could to repair",
      "could repair"
    ],
    "correctIndex": 3,
    "explanation": "Can changes to could. Modals are followed by the base form without to."
  },
  {
    "id": "b1-reported-speech-5",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Choose the correct reported question: 'Where do you work?' She asked me ___.",
    "options": [
      "where I worked",
      "where did I work",
      "where do I worked",
      "where worked I"
    ],
    "correctIndex": 0,
    "explanation": "Reported questions use statement word order. The present simple also shifts to past simple when backshift applies."
  },
  {
    "id": "b1-reported-speech-6",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report this yes/no question with backshift: 'Are you ready?' He asked me ___ ready.",
    "options": [
      "that was I",
      "if I was",
      "if was I",
      "do I was"
    ],
    "correctIndex": 1,
    "explanation": "A reported yes/no question can begin with if, followed by statement word order: I was."
  },
  {
    "id": "b1-reported-speech-7",
    "level": "B1",
    "topic": "reported-speech",
    "question": "The guide said, 'Don't touch the glass.' Complete the report: The guide told us ___ the glass.",
    "options": [
      "don't to touch",
      "to not touching",
      "not to touch",
      "not touch"
    ],
    "correctIndex": 2,
    "explanation": "A reported negative instruction uses told + object + not to + base verb."
  },
  {
    "id": "b1-reported-speech-8",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Choose the correct report of 'Please close the gate'.",
    "options": [
      "She asked me close the gate.",
      "She asked me closing the gate.",
      "She asked me that close the gate.",
      "She asked me to close the gate."
    ],
    "correctIndex": 3,
    "explanation": "A request is commonly reported with asked + person + to-infinitive."
  },
  {
    "id": "b1-reported-speech-9",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Choose the correct verb: Ben ___ me that the office was closed.",
    "options": [
      "told",
      "said",
      "spoke",
      "talked"
    ],
    "correctIndex": 0,
    "explanation": "Tell can take a person directly: told me. Say would need said to me, not said me."
  },
  {
    "id": "b1-reported-speech-10",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Choose the correct report of 'I have finished', using backshift.",
    "options": [
      "She said that she has finish.",
      "She said that she had finished.",
      "She said that she had finish.",
      "She said that she have finished."
    ],
    "correctIndex": 1,
    "explanation": "Present perfect have finished shifts to past perfect had finished after a past reporting verb."
  },
  {
    "id": "b1-reported-speech-11",
    "level": "B1",
    "topic": "reported-speech",
    "question": "On Monday, Eva said, 'I'll call you tomorrow.' Reporting this on Wednesday, I say: Eva said she would call me ___.",
    "options": [
      "yesterday before Monday",
      "the previous year",
      "the next day",
      "two days before she spoke"
    ],
    "correctIndex": 2,
    "explanation": "Tomorrow is relative to Monday, so a later report uses the next day, meaning Tuesday."
  },
  {
    "id": "b1-reported-speech-12",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'I bought it yesterday' using backshift and a changed time reference: He said he ___ it the day before.",
    "options": [
      "has buy",
      "had buy",
      "have bought",
      "had bought"
    ],
    "correctIndex": 3,
    "explanation": "Past simple bought shifts to had bought, and yesterday becomes the day before in this report."
  },
  {
    "id": "b1-reported-speech-13",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'What time does the train leave?' with backshift: She asked ___.",
    "options": [
      "what time the train left",
      "what time did the train leave",
      "what time the train leave",
      "what time does the train left"
    ],
    "correctIndex": 0,
    "explanation": "Reported questions use subject before verb, with no do-support. Leaves shifts to left."
  },
  {
    "id": "b1-reported-speech-14",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Choose the correct report of a command: 'Wait outside.'",
    "options": [
      "The receptionist told us wait outside.",
      "The receptionist told us to wait outside.",
      "The receptionist said us to wait outside.",
      "The receptionist told to us wait outside."
    ],
    "correctIndex": 1,
    "explanation": "Report a command with told + person + to-infinitive."
  },
  {
    "id": "b1-reported-speech-15",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'I am reading the instructions' with backshift: He said that he ___ the instructions.",
    "options": [
      "were reading",
      "had read tomorrow",
      "was reading",
      "is read"
    ],
    "correctIndex": 2,
    "explanation": "Present continuous am reading shifts to past continuous was reading."
  },
  {
    "id": "b1-reported-speech-16",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Report 'We must leave now' as a past obligation: They said that they ___ leave then.",
    "options": [
      "must to",
      "have must",
      "had",
      "had to"
    ],
    "correctIndex": 3,
    "explanation": "When must expresses an obligation that is reported as past, it commonly changes to had to."
  },
  {
    "id": "b1-reported-speech-17",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Choose the correctly formed reported question about permission: 'Can I use your phone?' He asked ___.",
    "options": [
      "if he could use my phone",
      "if could he use my phone",
      "that he can to use my phone",
      "if he could used my phone"
    ],
    "correctIndex": 0,
    "explanation": "Use if + subject + could + base verb. The pronouns change to match the reporter's perspective."
  },
  {
    "id": "b1-reported-speech-18",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Complete the report with the correct pronouns: Anna said to me, 'I will send you my address.' Anna said ___ would send ___ her address.",
    "options": [
      "I / her",
      "she / me",
      "she / she",
      "me / I"
    ],
    "correctIndex": 1,
    "explanation": "Anna becomes she, and the person she spoke to becomes me in the report. My address becomes her address."
  },
  {
    "id": "b1-reported-speech-19",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Which sentence correctly reports 'Did you enjoy the concert?' with backshift?",
    "options": [
      "He asked whether had I enjoyed the concert.",
      "He asked whether did I enjoy the concert.",
      "He asked whether I had enjoyed the concert.",
      "He asked whether I had enjoy the concert."
    ],
    "correctIndex": 2,
    "explanation": "Whether introduces a yes/no reported question. Use statement order and past perfect had enjoyed."
  },
  {
    "id": "b1-reported-speech-20",
    "level": "B1",
    "topic": "reported-speech",
    "question": "Choose the correctly formed reported statement.",
    "options": [
      "The nurse said me that the appointment was at ten.",
      "The nurse told that the appointment was at ten.",
      "The nurse told to me that the appointment was at ten.",
      "The nurse said that the appointment was at ten."
    ],
    "correctIndex": 3,
    "explanation": "Said can introduce a that-clause without a person. Told requires an object such as told me, without to."
  },
];

