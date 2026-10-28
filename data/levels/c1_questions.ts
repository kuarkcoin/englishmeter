// data/levels/c1_questions.ts
import type { C1TopicSlug } from './c1_topics';

export type C1Question = {
  id: string;
  level: 'C1';
  topic: C1TopicSlug;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const c1Questions: C1Question[] = [
  // MIXED CONDITIONALS (10 soru)
  {
    id: 'c1-mixed-1',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'If I had taken that job in London, I ___ in a very different situation now.',
    options: [
      'am',
      'would be',
      'would have been',
      'will be',
    ],
    correctIndex: 1,
    explanation: "The condition is an unreal past decision, but 'now' refers to its present result. Use would + base verb: 'would be'.",
  },
  {
    id: 'c1-mixed-2',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'She wouldn’t be so tired now if she ___ to bed earlier last night.',
    options: [
      'went',
      'had gone',
      'would go',
      'has gone',
    ],
    correctIndex: 1,
    explanation: "An unreal cause in the past takes the past perfect: 'had gone'. Its result, being tired, is in the present.",
  },
  {
    id: 'c1-mixed-3',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'If he weren’t so stubborn, he ___ the argument yesterday.',
    options: [
      'wouldn’t lose',
      'wouldn’t have lost',
      'hadn’t lost',
      'won’t have lost',
    ],
    correctIndex: 1,
    explanation: "A general present characteristic ('weren't so stubborn') is linked to a past result. Use would not have + past participle for yesterday's argument.",
  },
  {
    id: 'c1-mixed-4',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'If they had listened to the advice, they ___ facing such serious problems now.',
    options: [
      'wouldn’t be',
      'won’t be',
      'wouldn’t have been',
      'aren’t',
    ],
    correctIndex: 0,
    explanation: "'Had listened' describes an unreal past condition; 'now' requires a present result: 'wouldn't be facing'.",
  },
  {
    id: 'c1-mixed-5',
    level: 'C1',
    topic: 'mixed-conditionals',
    question: 'Use a present condition with a past result: If I ___ more organised, I wouldn’t have missed the deadline last week.',
    options: [
      'were',
      'had been',
      'am',
      'would be',
    ],
    correctIndex: 0,
    explanation: "Here 'were more organised' imagines a different general characteristic. The missed deadline is the past consequence, expressed with 'wouldn't have missed'.",
  },
  {
    id: 'c1-mixed-6',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'If she had grown up in the countryside, she probably ___ so scared of insects now.',
    options: [
      'isn’t',
      'wouldn’t be',
      'wouldn’t have been',
      'wasn’t',
    ],
    correctIndex: 1,
    explanation: "Growing up happened in the past, but the fear exists now. The mixed conditional therefore uses 'wouldn't be' for the present result.",
  },
  {
    id: 'c1-mixed-7',
    level: 'C1',
    topic: 'mixed-conditionals',
    question: 'Use an unreal past condition: He wouldn’t have failed the exam if he ___ more serious about his studies.',
    options: [
      'were',
      'had been',
      'would be',
      'has been',
    ],
    correctIndex: 1,
    explanation: "The intended condition concerns his attitude before the exam. Use 'had been' with the past result 'wouldn't have failed'.",
  },
  {
    id: 'c1-mixed-8',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'If the weather were warmer, we ___ on the beach instead of sitting inside all day.',
    options: [
      'would have sat',
      'would sit',
      'sat',
      'had sat',
    ],
    correctIndex: 1,
    explanation: "This imagines different weather and a different activity in the present. Use would + base verb after the unreal condition 'were warmer'.",
  },
  {
    id: 'c1-mixed-9',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'If I hadn’t met you, my life ___ completely different now.',
    options: [
      'is',
      'would be',
      'would have been',
      'was',
    ],
    correctIndex: 1,
    explanation: "The unreal past event uses 'hadn't met', while 'now' makes the result present: 'would be'.",
  },
  {
    id: 'c1-mixed-10',
    level: 'C1',
    topic: 'mixed-conditionals',
    question:
      'She’d be earning much more money now if she ___ that promotion two years ago.',
    options: [
      'accepted',
      'would accept',
      'had accepted',
      'has accepted',
    ],
    correctIndex: 2,
    explanation: "The promotion was a past opportunity that affects her earnings now. Use the past perfect, 'had accepted', in the if-clause.",
  },

  // WISH / IF ONLY (10 soru)
  {
    id: 'c1-wish-1',
    level: 'C1',
    topic: 'wish-if-only',
    question: 'I wish I ___ so much money every week on things I don’t really need.',
    options: ['don’t spend', 'didn’t spend', 'hadn’t spend', 'won’t spend'],
    correctIndex: 1,
    explanation: "Wish + past simple can express dissatisfaction with a present habit. 'Didn't spend' describes the spending habit the speaker wants to change.",
  },
  {
    id: 'c1-wish-2',
    level: 'C1',
    topic: 'wish-if-only',
    question:
      'If only we ___ earlier; now we’re going to be late.',
    options: [
      'left',
      'had left',
      'would leave',
      'have left',
    ],
    correctIndex: 1,
    explanation: "The departure should already have happened. A regret about the past uses if only + past perfect: 'had left'.",
  },
  {
    id: 'c1-wish-3',
    level: 'C1',
    topic: 'wish-if-only',
    question: 'Use formal hypothetical English: She wishes she ___ more confident when speaking in public.',
    options: [
      'was',
      'were',
      'had been',
      'would be',
    ],
    correctIndex: 1,
    explanation: "For an unreal present situation, formal English uses 'were' after wish, even with the singular subject 'she'.",
  },
  {
    id: 'c1-wish-4',
    level: 'C1',
    topic: 'wish-if-only',
    question:
      'I wish you ___ interrupt me when I’m talking.',
    options: ['doesn’t', 'hadn’t', 'wouldn’t', 'won’t'],
    correctIndex: 2,
    explanation: "Wish + would not expresses annoyance and a desire for someone else's behaviour to change: 'wouldn't interrupt'.",
  },
  {
    id: 'c1-wish-5',
    level: 'C1',
    topic: 'wish-if-only',
    question:
      'If only I ___ my phone at home; now I can’t call anyone.',
    options: [
      'don’t forget',
      'hadn’t forgotten',
      'didn’t forget',
      'wouldn’t forget',
    ],
    correctIndex: 1,
    explanation: "Forgetting the phone was a completed past event. Use if only + past perfect to express regret: 'hadn't forgotten'.",
  },
  {
    id: 'c1-wish-6',
    level: 'C1',
    topic: 'wish-if-only',
    question: 'Use formal hypothetical English: I wish it ___ so cold today; I’d love to go for a walk.',
    options: [
      'isn’t',
      'wasn’t',
      'hadn’t been',
      'weren’t',
    ],
    correctIndex: 3,
    explanation: "The speaker wants today's situation to be different. Formal wish clauses use the unreal past form 'weren't'.",
  },
  {
    id: 'c1-wish-7',
    level: 'C1',
    topic: 'wish-if-only',
    question:
      'He wishes he ___ what he said during the meeting.',
    options: [
      'didn’t say',
      'hadn’t said',
      'wouldn’t say',
      'hasn’t said',
    ],
    correctIndex: 1,
    explanation: "The words were already spoken during the meeting. A past regret takes wish + past perfect: 'hadn't said'.",
  },
  {
    id: 'c1-wish-8',
    level: 'C1',
    topic: 'wish-if-only',
    question:
      'If only people ___ more carefully before sharing things online.',
    options: ['think', 'thought', 'had think', 'will think'],
    correctIndex: 1,
    explanation: "If only + past simple can describe a desired change to a current habit. 'Thought more carefully' refers to people's usual behaviour.",
  },
  {
    id: 'c1-wish-9',
    level: 'C1',
    topic: 'wish-if-only',
    question: 'I wish I ___ up earlier this morning; now I don’t have time for breakfast.',
    options: [
      'got',
      'had got',
      'would get',
      'get',
    ],
    correctIndex: 1,
    explanation: "The speaker regrets getting up late on this occasion. Use wish + past perfect, 'had got', for an event that has already happened.",
  },
  {
    id: 'c1-wish-10',
    level: 'C1',
    topic: 'wish-if-only',
    question:
      'If only you ___ to me instead of ignoring my messages.',
    options: ['have replied', 'will reply', 'would reply', 'reply'],
    correctIndex: 2,
    explanation: "'Would reply' asks for a change in someone else's behaviour. Wish and if only can use would when the speaker wants another person to act.",
  },

  // INVERSION FOR EMPHASIS (10 soru)
  {
    id: 'c1-inv-1',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'Only after the meeting ___ how serious the situation was.',
    options: [
      'I realised',
      'did I realise',
      'I had realised',
      'had I realised',
    ],
    correctIndex: 1,
    explanation: "An initial 'Only after' phrase triggers inversion in the main clause. For the past simple, use did + subject + base verb: 'did I realise'.",
  },
  {
    id: 'c1-inv-2',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'Under no circumstances ___ this door to be left unlocked.',
    options: [
      'you must allow',
      'must you allow',
      'you should allow',
      'should you allowing',
    ],
    correctIndex: 1,
    explanation: "The negative phrase 'Under no circumstances' requires the modal before the subject: 'must you allow'.",
  },
  {
    id: 'c1-inv-3',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'Hardly ___ the room when the fire alarm went off.',
    options: [
      'we entered',
      'had we entered',
      'we had entered',
      'did we enter',
    ],
    correctIndex: 1,
    explanation: "Use hardly + past perfect inversion + when for two events close together: 'Hardly had we entered ... when ...'.",
  },
  {
    id: 'c1-inv-4',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'Not until much later ___ the real reason for his behaviour.',
    options: [
      'we understood',
      'did we understand',
      'we had understood',
      'had we understood',
    ],
    correctIndex: 1,
    explanation: "After an initial 'Not until' phrase, invert the main clause. 'Did we understand' uses did followed by the base verb.",
  },
  {
    id: 'c1-inv-5',
    level: 'C1',
    topic: 'inversion-emphasis',
    question: 'Seldom ___ such an impressive performance in my life so far.',
    options: [
      'I have seen',
      'have I seen',
      'I saw',
      'did I see',
    ],
    correctIndex: 1,
    explanation: "The initial negative-frequency adverb 'Seldom' requires auxiliary-subject inversion. 'Have I seen' expresses experience up to the present.",
  },
  {
    id: 'c1-inv-6',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'No sooner ___ the announcement than people started complaining.',
    options: [
      'they heard',
      'did they hear',
      'had they heard',
      'they had heard',
    ],
    correctIndex: 2,
    explanation: "The standard sequence is no sooner + had + subject + past participle + than. The hearing happened just before the complaints.",
  },
  {
    id: 'c1-inv-7',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'Rarely ___ such a challenging exam.',
    options: ['students were given', 'were students given', 'students had been given', 'had students given'],
    correctIndex: 1,
    explanation: "'Rarely' at the beginning requires inversion. 'Were students given' is an inverted past-simple passive.",
  },
  {
    id: 'c1-inv-8',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'At no time ___ to sign any legal documents.',
    options: [
      'I was asked',
      'was I asked',
      'I had been asked',
      'had I asked',
    ],
    correctIndex: 1,
    explanation: "'At no time' is a negative opening that triggers inversion. Move the passive auxiliary was before I: 'was I asked'.",
  },
  {
    id: 'c1-inv-9',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'Only when the storm stopped ___ the mountain.',
    options: [
      'were we able to leave',
      'we were able to leave',
      'had we been able to leave',
      'we had been able to leave',
    ],
    correctIndex: 0,
    explanation: "Only when the storm stopped introduces the condition for leaving. Invert the main clause to 'were we able to leave'.",
  },
  {
    id: 'c1-inv-10',
    level: 'C1',
    topic: 'inversion-emphasis',
    question:
      'Little ___ that this decision would change his life completely.',
    options: [
      'he knew',
      'did he know',
      'had he known',
      'he had known',
    ],
    correctIndex: 1,
    explanation: "Initial 'Little' has a negative meaning here and triggers inversion. Past-simple know becomes 'did he know'.",
  },

  // PARTICIPLE CLAUSES (10 soru)
  {
    id: 'c1-part-1',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      '___ the instructions carefully, she started assembling the furniture.',
    options: ['Read', 'Having reading', 'Having read', 'Having been read'],
    correctIndex: 2,
    explanation: "'Having read' is a perfect participle clause: she finished reading before she started assembling. The person reading and assembling is the same.",
  },
  {
    id: 'c1-part-2',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      'Not ___ what to do, he decided to call customer service.',
    options: [
      'knowing',
      'known',
      'to know',
      'having known',
    ],
    correctIndex: 0,
    explanation: "The active negative participle clause is 'Not knowing'. It gives the reason he decided to call customer service.",
  },
  {
    id: 'c1-part-3',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      '___ in traffic for over two hours, they arrived exhausted.',
    options: ['Sticking', 'Stuck', 'Having stuck', 'To be stuck'],
    correctIndex: 1,
    explanation: "'Stuck in traffic' describes their state and has a passive meaning. The past participle can introduce this reduced clause.",
  },
  {
    id: 'c1-part-4',
    level: 'C1',
    topic: 'participle-clauses',
    question: 'Complete the main clause in the passive: Having been told the news, ___ to make a decision immediately.',
    options: [
      'they were expected',
      'it was expected of them',
      'they expected',
      'they were expecting',
    ],
    correctIndex: 0,
    explanation: "The subject of the main clause must be the people who were told the news. 'They were expected' keeps that subject and expresses the demand placed on them.",
  },
  {
    id: 'c1-part-5',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      '___ his homework, he went out to meet his friends.',
    options: [
      'Finished',
      'Having finished',
      'Being finished',
      'To finish',
    ],
    correctIndex: 1,
    explanation: "'Having finished' marks an action completed before the main action. He completed his homework and then went out.",
  },
  {
    id: 'c1-part-6',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      'The conference, ___ next month, has already sold out.',
    options: ['to hold', 'being held', 'holding', 'having held'],
    correctIndex: 1,
    explanation: "'Being held' is a reduced passive relative clause describing the conference's arrangement for next month.",
  },
  {
    id: 'c1-part-7',
    level: 'C1',
    topic: 'participle-clauses',
    question: 'Complete the conditional without using if: ___ more carefully, you wouldn’t have made so many mistakes.',
    options: [
      'You checked',
      'If you had checked',
      'Having checked',
      'Had you checked',
    ],
    correctIndex: 3,
    explanation: "'Had you checked' is the inverted form of 'if you had checked'. It introduces an unreal past condition followed by 'wouldn't have made'.",
  },
  {
    id: 'c1-part-8',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      '___ the room, she noticed that someone had opened the window.',
    options: [
      'Entering',
      'Entered',
      'Being entered',
      'Having entering',
    ],
    correctIndex: 0,
    explanation: "'Entering' is an active participle: she entered the room and noticed the open window. The participle and main verb share the subject she.",
  },
  {
    id: 'c1-part-9',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      '___ so much experience, he was the ideal person for the job.',
    options: ['Had having', 'Having', 'Had', 'Has had'],
    correctIndex: 1,
    explanation: "'Having' means possessing here. The participle clause gives his experience as the reason he was suitable for the job.",
  },
  {
    id: 'c1-part-10',
    level: 'C1',
    topic: 'participle-clauses',
    question:
      'The road ___ by heavy snow, the village was completely cut off.',
    options: ['blocked', 'blocking', 'been blocked', 'having blocked'],
    correctIndex: 0,
    explanation: "'The road blocked by heavy snow' is an absolute clause: its own subject, the road, is followed by a passive participle.",
  },

  // CLEFT SENTENCES (10 soru)
  {
    id: 'c1-cleft-1',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      '___ that first got me interested in linguistics.',
    options: [
      'It was reading that book',
      'What was reading that book',
      'Reading that book was',
      'That book it was',
    ],
    correctIndex: 0,
    explanation: "An it-cleft uses it + be + the focused information + that. 'It was reading that book' emphasises the activity that sparked the interest.",
  },
  {
    id: 'c1-cleft-2',
    level: 'C1',
    topic: 'cleft-sentences',
    question: 'Use formal subject-pronoun agreement: It was ___ caused all the confusion.',
    options: [
      'he who',
      'him who',
      'he which',
      'who he',
    ],
    correctIndex: 0,
    explanation: "In a formal it-cleft focused on the subject, 'he who' identifies the person who caused the confusion.",
  },
  {
    id: 'c1-cleft-3',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      'What I really need right now ___ a good night’s sleep.',
    options: [
      'is',
      'it is',
      'was',
      'it was',
    ],
    correctIndex: 0,
    explanation: "The whole what-clause is the subject. 'Is' links that subject to the thing needed now, without adding another subject it.",
  },
  {
    id: 'c1-cleft-4',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      'It was in Paris ___ we first met.',
    options: [
      'which',
      'where',
      'that',
      'when',
    ],
    correctIndex: 2,
    explanation: "An it-cleft focusing a place uses 'It was in Paris that ...'. That links the focused phrase to the rest of the clause.",
  },
  {
    id: 'c1-cleft-5',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      '___ I find most annoying is the way he always interrupts people.',
    options: [
      'It what',
      'What',
      'That',
      'Which',
    ],
    correctIndex: 1,
    explanation: "'What I find most annoying' means 'the thing that I find most annoying'. It forms the subject of this pseudo-cleft sentence.",
  },
  {
    id: 'c1-cleft-6',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      'It was not until last year ___ I finally learned to drive.',
    options: [
      'when',
      'that',
      'which',
      'where',
    ],
    correctIndex: 1,
    explanation: "The emphasis pattern is 'It was not until ... that ...'. Use that to introduce the event that finally happened.",
  },
  {
    id: 'c1-cleft-7',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      'What surprised me most ___ how calm she was.',
    options: [
      'was',
      'it was',
      'that it was',
      'has been',
    ],
    correctIndex: 0,
    explanation: "The what-clause describes a completed reaction in the past. 'Was' links it to the cause of that reaction, her calmness.",
  },
  {
    id: 'c1-cleft-8',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      'It was ___ the manager spoke to, not the assistant.',
    options: ['me who', 'me which', 'me whose', 'I which'],
    correctIndex: 0,
    explanation: "In this it-cleft, 'me' is the person the manager spoke to, and who introduces the following clause in ordinary usage.",
  },
  {
    id: 'c1-cleft-9',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      'What I’d like to do this weekend ___ absolutely nothing.',
    options: [
      'be',
      'being',
      'is',
      'to be',
    ],
    correctIndex: 2,
    explanation: "The entire what-clause is the subject of a pseudo-cleft sentence. The finite linking verb is 'is': 'What I'd like to do ... is ...'.",
  },
  {
    id: 'c1-cleft-10',
    level: 'C1',
    topic: 'cleft-sentences',
    question:
      'It was her determination ___ made the project a success.',
    options: ['whom', 'who', 'what', 'that'],
    correctIndex: 3,
    explanation: "The it-cleft pattern is 'It was + focus + that + clause'. Here it emphasises her determination as the cause of success.",
  },

  // ADVANCED RELATIVE CLAUSES (10 soru)
  {
    id: 'c1-rel-1',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'The conference, ___ was held in Berlin, attracted experts from all over the world.',
    options: [
      'that',
      'which',
      'where',
      'who',
    ],
    correctIndex: 1,
    explanation: "The commas mark a non-defining relative clause about a thing. Use which; that is not used in this non-defining construction.",
  },
  {
    id: 'c1-rel-2',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'Students ___ native language is not English often struggle with articles.',
    options: [
      'whose',
      'who',
      'which',
      'that',
    ],
    correctIndex: 0,
    explanation: "'Whose' expresses possession: the native language belongs to the students. It comes directly before the noun phrase native language.",
  },
  {
    id: 'c1-rel-3',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'The company for ___ I used to work has moved to another country.',
    options: [
      'which',
      'that',
      'whom',
      'who',
    ],
    correctIndex: 0,
    explanation: "After the preposition for, use which for a company. That cannot immediately follow a fronted preposition in this construction.",
  },
  {
    id: 'c1-rel-4',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'He showed me the report, ___ I had already read.',
    options: [
      'that',
      'which',
      'what',
      'whose',
    ],
    correctIndex: 1,
    explanation: "The clause adds extra information about the report and is separated by a comma. Use which to refer to that thing.",
  },
  {
    id: 'c1-rel-5',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'Anyone ___ arrives late will have to wait outside.',
    options: [
      'who',
      'whom',
      'whose',
      'which',
    ],
    correctIndex: 0,
    explanation: "The relative pronoun is the subject of arrives and refers to a person. Use who rather than the object form whom.",
  },
  {
    id: 'c1-rel-6',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'The man to ___ you spoke is my supervisor.',
    options: [
      'who',
      'that',
      'whom',
      'which',
    ],
    correctIndex: 2,
    explanation: "In formal English, a preposition directly before a pronoun referring to a person takes whom: 'to whom'.",
  },
  {
    id: 'c1-rel-7',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'I don’t like the way ___ he talks to people.',
    options: ['whom', 'which', 'what', '—'],
    correctIndex: 3,
    explanation: "No relative word is needed in 'the way he talks'. The clause can directly follow the way to describe his manner of speaking.",
  },
  {
    id: 'c1-rel-8',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'The building ___ windows were broken has now been repaired.',
    options: [
      'which',
      'whose',
      'that',
      'its',
    ],
    correctIndex: 1,
    explanation: "'Whose windows' expresses a relationship of possession. Whose can refer to a building as well as to a person.",
  },
  {
    id: 'c1-rel-9',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'The reason ___ he left the company is still unclear.',
    options: ['whom', 'where', 'which', 'for which'],
    correctIndex: 3,
    explanation: "'For which' is a formal relative phrase meaning 'why' in this context. The preposition for belongs with the idea of a reason.",
  },
  {
    id: 'c1-rel-10',
    level: 'C1',
    topic: 'advanced-relative-clauses',
    question:
      'The people living next door, ___ are both doctors, have just had a baby.',
    options: [
      'who',
      'that',
      'which',
      'whom',
    ],
    correctIndex: 0,
    explanation: "The non-defining relative clause refers to people and needs a subject for are. Use who; whom is an object form.",
  },
];

