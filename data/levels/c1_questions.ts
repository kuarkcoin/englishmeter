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

  // Additional practice: 20 questions per topic, including new C1 units.
  {
    "id": "c1-mixed-11",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "We missed yesterday's connection. If we had checked the timetable, we ___ in this airport now.",
    "options": [
      "wouldn't have waited",
      "hadn't waited",
      "wouldn't be waiting",
      "won't have waited"
    ],
    "correctIndex": 2,
    "explanation": "The timetable check belongs to the past, but the waiting is happening now. Use would not be + -ing for the present consequence of an unreal past action."
  },
  {
    "id": "c1-mixed-12",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "Lena is generally afraid of heights. If she weren't, she ___ us on last summer's climbing expedition.",
    "options": [
      "would join",
      "had joined",
      "will have joined",
      "would have joined"
    ],
    "correctIndex": 3,
    "explanation": "A continuing personal characteristic is the unreal present condition. Last summer's missed expedition is a past result, so use would have + past participle."
  },
  {
    "id": "c1-mixed-13",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "If Daniel had qualified as an architect in 2020, he ___ buildings for a living today.",
    "options": [
      "would be designing",
      "would have designed",
      "had designed",
      "will have designed"
    ],
    "correctIndex": 0,
    "explanation": "The qualification is a past condition with an imagined present consequence. Would be designing describes the work he would be doing today."
  },
  {
    "id": "c1-mixed-14",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "My eyesight is poor, and I missed the small print. If my eyesight were better, I ___ that warning yesterday.",
    "options": [
      "would notice",
      "would have noticed",
      "have noticed",
      "will notice"
    ],
    "correctIndex": 1,
    "explanation": "The condition describes a general present characteristic. The warning was missed yesterday, so its unreal result is expressed with would have noticed."
  },
  {
    "id": "c1-mixed-15",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "Use a past condition with a present result: If the council ___ the flood barriers last year, these houses would be safer now.",
    "options": [
      "repairs",
      "would repair",
      "had repaired",
      "has repaired"
    ],
    "correctIndex": 2,
    "explanation": "An unreal completed action in the if-clause takes the past perfect. The present result is already expressed by would be safer now."
  },
  {
    "id": "c1-mixed-16",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "We upgraded the computers last month, so they process these files quickly now. Without that upgrade, they ___ so efficiently at the moment.",
    "options": [
      "wouldn't have worked",
      "hadn't worked",
      "didn't worked",
      "wouldn't be working"
    ],
    "correctIndex": 3,
    "explanation": "Without that upgrade expresses an unreal past condition. At the moment requires a present consequence: would not be working."
  },
  {
    "id": "c1-mixed-17",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "If Maya hadn't accepted the scholarship, she ___ in Canada this semester.",
    "options": [
      "wouldn't be studying",
      "wouldn't have studied",
      "hasn't studied",
      "hadn't been studied"
    ],
    "correctIndex": 0,
    "explanation": "Accepting the scholarship is a completed past decision; studying this semester is its present consequence. Use would not be studying."
  },
  {
    "id": "c1-mixed-18",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "Tom has always been allergic to nuts. If he weren't allergic, he ___ the almond cake at yesterday's party.",
    "options": [
      "could eat",
      "could have eaten",
      "can eat",
      "had eaten"
    ],
    "correctIndex": 1,
    "explanation": "The allergy is a continuing state. The missed opportunity was yesterday, so could have eaten expresses an unreal past possibility."
  },
  {
    "id": "c1-mixed-19",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "Which sentence links an unreal past event to a present result?",
    "options": [
      "If I keep the receipt, I will return the jacket tomorrow.",
      "If I had kept the receipt, I could have returned the jacket yesterday.",
      "If I had kept the receipt, I could return the jacket now.",
      "If I kept receipts more carefully, I would lose fewer of them."
    ],
    "correctIndex": 2,
    "explanation": "Had kept places the condition in the past, while could return ... now places the result in the present. The other options describe different time relationships."
  },
  {
    "id": "c1-mixed-20",
    "level": "C1",
    "topic": "mixed-conditionals",
    "question": "Complete the mixed conditional with a present condition: If Sam ___ more patient by nature, he wouldn't have walked out of yesterday's discussion.",
    "options": [
      "had been",
      "would be",
      "will be",
      "were"
    ],
    "correctIndex": 3,
    "explanation": "The instruction asks about Sam's general character, so the condition uses unreal were. Would not have walked out describes a past consequence."
  },
  {
    "id": "c1-wish-11",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "I can't read the original documents because I don't know Latin. I wish I ___ Latin.",
    "options": [
      "can read",
      "will read",
      "could read",
      "had reading"
    ],
    "correctIndex": 2,
    "explanation": "Wish + could expresses an ability the speaker lacks now. The desired ability is reading Latin, not an action completed in the past."
  },
  {
    "id": "c1-wish-12",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "The training session ended yesterday, and I missed it. If only I ___ it.",
    "options": [
      "attend",
      "would attend",
      "have attended",
      "had attended"
    ],
    "correctIndex": 3,
    "explanation": "The missed session is a completed past event. If only + past perfect expresses regret about that event."
  },
  {
    "id": "c1-wish-13",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "The neighbour keeps playing loud music at midnight. I wish he ___ doing that.",
    "options": [
      "would stop",
      "will stop",
      "had stop",
      "stops"
    ],
    "correctIndex": 0,
    "explanation": "Wish + would asks for a change in another person's repeated behaviour. Would stop conveys the speaker's annoyance and desired change."
  },
  {
    "id": "c1-wish-14",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "Our flat has no balcony. We wish it ___ one.",
    "options": [
      "has",
      "had",
      "will have",
      "having"
    ],
    "correctIndex": 1,
    "explanation": "A wish about an unreal present possession takes the past simple. Had here means possessed, rather than referring to past time."
  },
  {
    "id": "c1-wish-15",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "We argued during the interview, which is now over. I wish we ___ with each other.",
    "options": [
      "don't argue",
      "wouldn't argue",
      "hadn't argued",
      "haven't argued"
    ],
    "correctIndex": 2,
    "explanation": "The argument has already happened and cannot be changed. Wish + past perfect expresses regret about a completed past action."
  },
  {
    "id": "c1-wish-16",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "I have to work on Saturday, so I can't join your trip. I wish I ___ with you.",
    "options": [
      "can come",
      "will come",
      "had coming",
      "could come"
    ],
    "correctIndex": 3,
    "explanation": "Could after wish expresses an unavailable ability or opportunity. Here the work obligation prevents a future trip."
  },
  {
    "id": "c1-wish-17",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "Use wish + would to express frustration with a continuing situation: I wish this rain ___ before the match starts.",
    "options": [
      "would stop",
      "stops",
      "had stopped",
      "will stop"
    ],
    "correctIndex": 0,
    "explanation": "Wish + would can express a desire for a situation to change. The match has not started, so this is not a regret about a completed event."
  },
  {
    "id": "c1-wish-18",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "I ignored the warning and lost the files. If only I ___ that warning.",
    "options": [
      "don't ignore",
      "hadn't ignored",
      "wouldn't ignore",
      "haven't ignored"
    ],
    "correctIndex": 1,
    "explanation": "The lost files are the consequence of a completed mistake. Use a negative past perfect after if only to express the regret."
  },
  {
    "id": "c1-wish-19",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "What does 'If only I had backed up the file!' express?",
    "options": [
      "A promise to make a backup tomorrow.",
      "A request for someone else to stop making backups.",
      "Regret about not making a backup in the past.",
      "Certainty that a backup currently exists."
    ],
    "correctIndex": 2,
    "explanation": "If only + past perfect expresses a strong wish that a past event had been different. The speaker regrets not having made the backup."
  },
  {
    "id": "c1-wish-20",
    "level": "C1",
    "topic": "wish-if-only",
    "question": "Use formal hypothetical English for a present situation: If only the public transport system ___ more reliable.",
    "options": [
      "is",
      "will be",
      "has been",
      "were"
    ],
    "correctIndex": 3,
    "explanation": "Formal hypothetical clauses can use were with a singular subject. The speaker wishes the current system were different."
  },
  {
    "id": "c1-inv-11",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "Not only ___ the deadline, but she also improved the quality of the work.",
    "options": [
      "she met",
      "did she met",
      "did she meet",
      "she did meet"
    ],
    "correctIndex": 2,
    "explanation": "Initial not only triggers auxiliary-subject inversion. In the past simple, use did + subject + base verb: did she meet."
  },
  {
    "id": "c1-inv-12",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "Only by comparing both sets of figures ___ identify the source of the error.",
    "options": [
      "we can",
      "we are",
      "can to we",
      "can we"
    ],
    "correctIndex": 3,
    "explanation": "Only by introduces a restrictive opening phrase. The following main clause inverts the modal and subject: can we identify."
  },
  {
    "id": "c1-inv-13",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "Scarcely had the chairperson begun speaking ___ the microphone failed.",
    "options": [
      "when",
      "than",
      "then",
      "that"
    ],
    "correctIndex": 0,
    "explanation": "Scarcely ... when links two events that occur almost immediately one after the other. No sooner pairs with than instead."
  },
  {
    "id": "c1-inv-14",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "In no way ___ permission to share patients' private records.",
    "options": [
      "this agreement gives",
      "does this agreement give",
      "does this agreement gives",
      "this agreement does gives"
    ],
    "correctIndex": 1,
    "explanation": "The negative opener in no way requires inversion. Does comes before the singular subject, and the main verb stays in its base form, give."
  },
  {
    "id": "c1-inv-15",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "Use the past simple: Only after the final vote ___ the result.",
    "options": [
      "the committee announced",
      "had the committee announced",
      "did the committee announce",
      "did the committee announced"
    ],
    "correctIndex": 2,
    "explanation": "Only after triggers inversion in the main clause. The instruction specifies the past simple, so the correct auxiliary is did, followed by announce."
  },
  {
    "id": "c1-inv-16",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "So convincing ___ that even her strongest critics changed their minds.",
    "options": [
      "her argument was",
      "her argument did",
      "did her argument",
      "was her argument"
    ],
    "correctIndex": 3,
    "explanation": "A fronted so + adjective phrase can be followed by inversion: so convincing was her argument that ...."
  },
  {
    "id": "c1-inv-17",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "After the costly mistake, I vowed: 'Never again ___ that risk.'",
    "options": [
      "would I take",
      "I would take",
      "would I took",
      "I took would"
    ],
    "correctIndex": 0,
    "explanation": "Never again is a negative opening, so the auxiliary precedes the subject. Would I take expresses the vow as a future-in-the-past decision."
  },
  {
    "id": "c1-inv-18",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "Which sentence correctly places inversion after 'not until'?",
    "options": [
      "Not until did the manager return we began the meeting.",
      "Not until the manager returned did we begin the meeting.",
      "Not until the manager returned we did begin the meeting.",
      "Not until the manager returned did we began the meeting."
    ],
    "correctIndex": 1,
    "explanation": "After not until + a clause, inversion belongs in the main clause. Use did we begin, with the base form after did."
  },
  {
    "id": "c1-inv-19",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "On no account ___ unattended while the equipment is running.",
    "options": [
      "the laboratory should be left",
      "should be left the laboratory",
      "should the laboratory be left",
      "the laboratory should left"
    ],
    "correctIndex": 2,
    "explanation": "On no account is a negative phrase requiring inversion. The passive structure is should + subject + be + past participle."
  },
  {
    "id": "c1-inv-20",
    "level": "C1",
    "topic": "inversion-emphasis",
    "question": "Choose the formal conditional without 'if': ___ further information, please contact the registrar.",
    "options": [
      "You should require",
      "Should require you",
      "Do you requiring",
      "Should you require"
    ],
    "correctIndex": 3,
    "explanation": "Should + subject + base verb can introduce a formal conditional meaning if you require. It is especially common in polite written instructions."
  },
  {
    "id": "c1-part-11",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "___ about the proposed changes, the staff were understandably upset.",
    "options": [
      "Not having consulting",
      "Not been consulted",
      "Not having been consulted",
      "Not having consult"
    ],
    "correctIndex": 2,
    "explanation": "The staff received no consultation before becoming upset. A negative perfect passive participle is formed with not having been + past participle."
  },
  {
    "id": "c1-part-12",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "___ the laboratory door, the researcher noticed an unusual smell.",
    "options": [
      "Opened",
      "Being opened",
      "Having opening",
      "Opening"
    ],
    "correctIndex": 3,
    "explanation": "The researcher performs both actions, opening the door and noticing the smell. The active -ing participle shares the main clause's subject."
  },
  {
    "id": "c1-part-13",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "Use a passive participle clause: ___ appropriate support, injured athletes can gradually return to competition.",
    "options": [
      "Given",
      "Giving",
      "Having give",
      "Gives"
    ],
    "correctIndex": 0,
    "explanation": "Given has a passive conditional meaning here: if athletes are given appropriate support. The athletes receive the support."
  },
  {
    "id": "c1-part-14",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "He sat beside the window, ___ the notes from the previous lecture.",
    "options": [
      "reviewed",
      "reviewing",
      "having review",
      "was reviewed"
    ],
    "correctIndex": 1,
    "explanation": "Reviewing is an active participle describing an action performed while he sat. Both clauses refer to the same person."
  },
  {
    "id": "c1-part-15",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "Weather ___, the excavation will resume tomorrow.",
    "options": [
      "permitted",
      "permits",
      "permitting",
      "to permitted"
    ],
    "correctIndex": 2,
    "explanation": "Weather permitting is an absolute participle clause meaning if the weather allows it. It has its own subject, weather."
  },
  {
    "id": "c1-part-16",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "Reduce the relative clause: 'The workers who were wearing helmets entered first.'",
    "options": [
      "The workers worn helmets entered first.",
      "The workers wear helmets entered first.",
      "The workers having been worn helmets entered first.",
      "The workers wearing helmets entered first."
    ],
    "correctIndex": 3,
    "explanation": "The workers are actively wearing the helmets. Removing who were leaves the active participle wearing."
  },
  {
    "id": "c1-part-17",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "___ by specialists, the painting was returned to the gallery.",
    "options": [
      "Having been restored",
      "Having restored",
      "Restoring",
      "Having been restoring"
    ],
    "correctIndex": 0,
    "explanation": "The painting receives the restoration, which happens before its return. A perfect passive participle uses having been restored."
  },
  {
    "id": "c1-part-18",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "Which sentence avoids a dangling participle?",
    "options": [
      "Walking through the museum, a damaged frame caught my eye.",
      "Walking through the museum, I noticed a damaged frame.",
      "Walking through the museum, the exhibition was nearly over.",
      "Walking through the museum, the lighting seemed too dim."
    ],
    "correctIndex": 1,
    "explanation": "The person walking must be the grammatical subject of the main clause. I can walk through a museum; a frame, exhibition or lighting cannot."
  },
  {
    "id": "c1-part-19",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "___ her ticket, Nina could not enter the concert hall.",
    "options": [
      "Having been lost",
      "Lost",
      "Having lost",
      "Having lose"
    ],
    "correctIndex": 2,
    "explanation": "Nina lost the ticket before being refused entry. Having lost is an active perfect participle that gives the reason for the later situation."
  },
  {
    "id": "c1-part-20",
    "level": "C1",
    "topic": "participle-clauses",
    "question": "Once ___ by both parties, the contract becomes legally binding.",
    "options": [
      "signing",
      "sign",
      "having signing",
      "signed"
    ],
    "correctIndex": 3,
    "explanation": "The contract is signed by others. Once signed is a reduced passive clause meaning once it has been signed."
  },
  {
    "id": "c1-cleft-11",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "It was during the rehearsal ___ the director noticed the missing prop.",
    "options": [
      "what",
      "which",
      "that",
      "whom"
    ],
    "correctIndex": 2,
    "explanation": "An it-cleft uses it + be + the focused phrase + that. Here the focused phrase identifies when the discovery occurred."
  },
  {
    "id": "c1-cleft-12",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "What the report fails to explain ___ why demand fell so suddenly.",
    "options": [
      "it is",
      "that is",
      "being",
      "is"
    ],
    "correctIndex": 3,
    "explanation": "The complete what-clause is the subject. It needs the finite linking verb is, without an additional subject it."
  },
  {
    "id": "c1-cleft-13",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "___ we need is a reliable estimate, rather than another optimistic guess.",
    "options": [
      "What",
      "That",
      "Which",
      "It"
    ],
    "correctIndex": 0,
    "explanation": "What introduces a fused relative meaning the thing that. What we need forms the subject of this pseudo-cleft sentence."
  },
  {
    "id": "c1-cleft-14",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "All the customer wanted ___ a clear explanation of the delay.",
    "options": [
      "it was",
      "was",
      "that was",
      "being"
    ],
    "correctIndex": 1,
    "explanation": "All the customer wanted is a single subject phrase. Was links it directly to the explanation that was wanted."
  },
  {
    "id": "c1-cleft-15",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "Complete the reversed pseudo-cleft: A quiet workspace is ___ helps me concentrate.",
    "options": [
      "which",
      "that",
      "what",
      "it"
    ],
    "correctIndex": 2,
    "explanation": "What helps me concentrate is a noun clause meaning the thing that helps. In a reversed pseudo-cleft, the focused phrase comes first."
  },
  {
    "id": "c1-cleft-16",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "Which sentence correctly emphasises the time of the discovery?",
    "options": [
      "It was not until Tuesday did we discover the leak.",
      "It was not until Tuesday that did we discover the leak.",
      "It not until Tuesday was that we discovered the leak.",
      "It was not until Tuesday that we discovered the leak."
    ],
    "correctIndex": 3,
    "explanation": "The it-cleft pattern is it was not until ... that + normal clause order. Inversion with did belongs to a different construction beginning simply not until."
  },
  {
    "id": "c1-cleft-17",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "Emphasise the object in 'The archivist found the original letter in the attic.'",
    "options": [
      "It was the original letter that the archivist found in the attic.",
      "It was the archivist who found the original letter in the attic.",
      "It was in the attic that the archivist found the original letter.",
      "What the archivist did was find the original letter in the attic."
    ],
    "correctIndex": 0,
    "explanation": "The requested focus is the object, the original letter. The other grammatical options emphasise the person, place or action instead."
  },
  {
    "id": "c1-cleft-18",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "Use the past simple in this pseudo-cleft: What happened yesterday ___ that the power failed during the presentation.",
    "options": [
      "is",
      "was",
      "it was",
      "being"
    ],
    "correctIndex": 1,
    "explanation": "What happened yesterday is the subject, followed by the past-simple linking verb was. The that-clause explains the event."
  },
  {
    "id": "c1-cleft-19",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "The person ___ arranged the interview was the programme's producer.",
    "options": [
      "whom",
      "whose",
      "who",
      "what"
    ],
    "correctIndex": 2,
    "explanation": "Who is the subject of arranged in the relative clause. The person who ... was ... is a construction that focuses the identity of a person."
  },
  {
    "id": "c1-cleft-20",
    "level": "C1",
    "topic": "cleft-sentences",
    "question": "___ concerns the committee is whether the new scheme can be funded.",
    "options": [
      "That which it",
      "It what",
      "Which it",
      "What"
    ],
    "correctIndex": 3,
    "explanation": "What concerns the committee means the thing that concerns the committee. It acts as the subject before the linking verb is."
  },
  {
    "id": "c1-rel-11",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "The panel interviewed six candidates, all of ___ had relevant experience.",
    "options": [
      "who",
      "which",
      "whom",
      "whose"
    ],
    "correctIndex": 2,
    "explanation": "A quantifier followed by of takes whom when referring to people in a non-defining relative clause: all of whom."
  },
  {
    "id": "c1-rel-12",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "The laboratory purchased three microscopes, two of ___ were damaged in transit.",
    "options": [
      "that",
      "whose",
      "whom",
      "which"
    ],
    "correctIndex": 3,
    "explanation": "Two of which refers back to things, the microscopes. That cannot follow the preposition of in this non-defining clause."
  },
  {
    "id": "c1-rel-13",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "The grounds on ___ the application was rejected remain unclear.",
    "options": [
      "which",
      "that",
      "what",
      "whose"
    ],
    "correctIndex": 0,
    "explanation": "Which can follow a fronted preposition when its antecedent is a thing or an idea. On which refers to the grounds for rejection."
  },
  {
    "id": "c1-rel-14",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "We consulted a historian ___ recent book examines the city's trade routes.",
    "options": [
      "whom",
      "whose",
      "who",
      "which"
    ],
    "correctIndex": 1,
    "explanation": "Whose links the historian to a possession, the recent book. It must be followed by the noun phrase whose owner is being identified."
  },
  {
    "id": "c1-rel-15",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "The grant was renewed, ___ allowed the project to continue for another year.",
    "options": [
      "that",
      "what",
      "which",
      "who"
    ],
    "correctIndex": 2,
    "explanation": "Which can refer to an entire preceding situation, here the renewal of the grant. This is a non-defining sentence-relative clause."
  },
  {
    "id": "c1-rel-16",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "The archive, in ___ the original documents are kept, is open only to researchers.",
    "options": [
      "where",
      "that",
      "whose",
      "which"
    ],
    "correctIndex": 3,
    "explanation": "The preposition in is already present, so the formal relative construction is in which. Using in where would duplicate the location relationship."
  },
  {
    "id": "c1-rel-17",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "You may use ___ reference book you find most helpful; there are several on the desk.",
    "options": [
      "whichever",
      "whoever",
      "wherever",
      "however"
    ],
    "correctIndex": 0,
    "explanation": "Whichever modifies reference book and means any one that you choose. The alternatives refer to a person, place or manner."
  },
  {
    "id": "c1-rel-18",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "The fellowship will go to ___ submits the strongest research proposal.",
    "options": [
      "whichever",
      "whoever",
      "whatever",
      "wherever"
    ],
    "correctIndex": 1,
    "explanation": "Whoever means any person who and is the subject of submits. The entire clause is the complement of the preposition to."
  },
  {
    "id": "c1-rel-19",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "Reduce the relative clause: 'She was the first researcher who identified the error.'",
    "options": [
      "She was the first researcher identify the error.",
      "She was the first researcher identified the error.",
      "She was the first researcher to identify the error.",
      "She was the first researcher to identifying the error."
    ],
    "correctIndex": 2,
    "explanation": "A relative clause after the first can often be reduced to a to-infinitive: the first researcher to identify."
  },
  {
    "id": "c1-rel-20",
    "level": "C1",
    "topic": "advanced-relative-clauses",
    "question": "They supplied specialist equipment without ___ the rescue would have been impossible.",
    "options": [
      "that",
      "what",
      "whom",
      "which"
    ],
    "correctIndex": 3,
    "explanation": "A fronted preposition referring to equipment takes which. Without which means without that equipment."
  },
  {
    "id": "c1-subj-1",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use the bare subjunctive: The committee recommends that every applicant ___ a writing sample.",
    "options": [
      "submit",
      "submits",
      "submitted",
      "submitting"
    ],
    "correctIndex": 0,
    "explanation": "After a formal recommendation, the mandative subjunctive uses the base form regardless of the subject. Every applicant therefore takes submit, not submits."
  },
  {
    "id": "c1-subj-2",
    "level": "C1",
    "topic": "subjunctive",
    "question": "In the formal subjunctive, it is essential that the witness ___ present throughout the hearing.",
    "options": [
      "is",
      "be",
      "was",
      "being"
    ],
    "correctIndex": 1,
    "explanation": "The subjunctive form of be is be for all persons. Essential expresses a requirement, rather than reporting a fact about the witness."
  },
  {
    "id": "c1-subj-3",
    "level": "C1",
    "topic": "subjunctive",
    "question": "The union demanded that the disputed decision ___ immediately. Use a passive subjunctive.",
    "options": [
      "is reconsidered",
      "was reconsidered",
      "be reconsidered",
      "being reconsidered"
    ],
    "correctIndex": 2,
    "explanation": "A passive mandative subjunctive uses be + past participle. The demanded action is reconsideration of the decision."
  },
  {
    "id": "c1-subj-4",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use the negative bare subjunctive: The lawyer advised that her client ___ the confidential files.",
    "options": [
      "does not release",
      "not releases",
      "not released",
      "not release"
    ],
    "correctIndex": 3,
    "explanation": "The negative subjunctive places not directly before the base verb. It does not require do-support: that her client not release."
  },
  {
    "id": "c1-subj-5",
    "level": "C1",
    "topic": "subjunctive",
    "question": "The chair proposed that the working group ___ its findings at the next meeting. Use the bare subjunctive.",
    "options": [
      "present",
      "presents",
      "presented",
      "presenting"
    ],
    "correctIndex": 0,
    "explanation": "A proposal about an action can take the base subjunctive. The singular group does not add -s in this construction."
  },
  {
    "id": "c1-subj-6",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use the formal subjunctive: It is advisable that each laboratory ___ an independent safety inspection.",
    "options": [
      "has",
      "have",
      "had",
      "having"
    ],
    "correctIndex": 1,
    "explanation": "The subjunctive uses the base form have even after each laboratory. The sentence recommends an inspection rather than describing an existing one."
  },
  {
    "id": "c1-subj-7",
    "level": "C1",
    "topic": "subjunctive",
    "question": "The judge ordered that the spectators ___ silent. Use the bare subjunctive.",
    "options": [
      "remains",
      "remained",
      "remain",
      "remaining"
    ],
    "correctIndex": 2,
    "explanation": "An order introduced by that can use the base subjunctive. The past tense of ordered does not force the verb inside the command to become past tense."
  },
  {
    "id": "c1-subj-8",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use formal hypothetical English: If the proposal ___ less expensive, we could support it.",
    "options": [
      "is",
      "will be",
      "has been",
      "were"
    ],
    "correctIndex": 3,
    "explanation": "Were marks an unreal present condition in formal English, including with a singular subject such as the proposal."
  },
  {
    "id": "c1-subj-9",
    "level": "C1",
    "topic": "subjunctive",
    "question": "He is not the owner, but he talks as though he ___ the owner. Use formal irrealis be.",
    "options": [
      "were",
      "is",
      "will be",
      "has been"
    ],
    "correctIndex": 0,
    "explanation": "When as though introduces a situation explicitly contrary to fact, formal English uses irrealis were."
  },
  {
    "id": "c1-subj-10",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use the bare subjunctive: The inspector's recommendation is that the faulty lift ___ until it has been repaired.",
    "options": [
      "does not operate",
      "not operate",
      "not operates",
      "has not operated"
    ],
    "correctIndex": 1,
    "explanation": "A recommendation can be followed by a negative subjunctive: that + subject + not + base verb. The lift must remain out of operation."
  },
  {
    "id": "c1-subj-11",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Complete the fixed formal expression: Far ___ it from me to question her integrity.",
    "options": [
      "is",
      "was",
      "be",
      "being"
    ],
    "correctIndex": 2,
    "explanation": "Far be it from me is a fixed subjunctive expression used to distance oneself from an accusation or criticism."
  },
  {
    "id": "c1-subj-12",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Complete the concessive expression: ___ that as it may, the contract still requires a signature.",
    "options": [
      "Is",
      "Was",
      "Being",
      "Be"
    ],
    "correctIndex": 3,
    "explanation": "Be that as it may is a fixed subjunctive phrase meaning even if that is true. It concedes a point before returning to the main argument."
  },
  {
    "id": "c1-subj-13",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Complete the traditional expression of a wish: Long ___ the spirit of cooperation!",
    "options": [
      "live",
      "lives",
      "living",
      "lived"
    ],
    "correctIndex": 0,
    "explanation": "Long live ... uses the base subjunctive to express a wish for something to continue. It is not an ordinary present-simple statement."
  },
  {
    "id": "c1-subj-14",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Complete the fixed expression meaning 'whatever happens': Come what ___, we will honour our commitment.",
    "options": [
      "might have",
      "may",
      "will",
      "does"
    ],
    "correctIndex": 1,
    "explanation": "Come what may is a fixed concessive expression meaning regardless of what happens. Its word order reflects an older subjunctive construction."
  },
  {
    "id": "c1-subj-15",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use the bare subjunctive in a formal condition of a grant: The agreement stipulates that no participant ___ identified by name.",
    "options": [
      "is",
      "was",
      "be",
      "being"
    ],
    "correctIndex": 2,
    "explanation": "Stipulates expresses a requirement. The passive subjunctive uses be identified, with no participant making the requirement negative."
  },
  {
    "id": "c1-subj-16",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use formal hypothetical English: If I ___ to accept the appointment, I would need to move abroad.",
    "options": [
      "am",
      "will be",
      "have been",
      "were"
    ],
    "correctIndex": 3,
    "explanation": "Were to + base verb presents a hypothetical future event. It is often used to discuss consequences formally or cautiously."
  },
  {
    "id": "c1-subj-17",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use a negative passive subjunctive: The archive requires that original manuscripts ___ from the reading room.",
    "options": [
      "not be removed",
      "are not removed",
      "not are removed",
      "not being removed"
    ],
    "correctIndex": 0,
    "explanation": "The negative passive subjunctive is not + be + past participle. The requirement concerns what must not happen to the manuscripts."
  },
  {
    "id": "c1-subj-18",
    "level": "C1",
    "topic": "subjunctive",
    "question": "The witness insisted that she was at home at the time. What does 'insisted' mean here?",
    "options": [
      "Demanded that she be sent home in the future.",
      "Asserted firmly that a statement was true.",
      "Recommended a change to the house rules.",
      "Expressed a wish that she had another home."
    ],
    "correctIndex": 1,
    "explanation": "Insist can report a firm assertion as well as a demand. Here was at home reports the witness's claim about a past fact, so it is not a mandative subjunctive."
  },
  {
    "id": "c1-subj-19",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Choose the bare subjunctive, without 'should': The editor suggested that the opening paragraph ___ shorter.",
    "options": [
      "should be",
      "is",
      "be",
      "was"
    ],
    "correctIndex": 2,
    "explanation": "Both a bare subjunctive and should can express a suggestion in standard English, but this instruction specifically asks for the bare form be."
  },
  {
    "id": "c1-subj-20",
    "level": "C1",
    "topic": "subjunctive",
    "question": "Use the bare subjunctive: We urge that the investigation ___ without delay.",
    "options": [
      "proceeds",
      "proceeded",
      "proceeding",
      "proceed"
    ],
    "correctIndex": 3,
    "explanation": "Urge introduces a strong recommendation. The verb in the that-clause takes its base form, proceed, independently of the singular subject."
  },
  {
    "id": "c1-idiom-1",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The anonymous post makes dramatic claims but offers no evidence. I would take it ___ until we can verify the details.",
    "options": [
      "with a pinch of salt",
      "under my wing",
      "out of the blue",
      "by the book"
    ],
    "correctIndex": 0,
    "explanation": "Take something with a pinch of salt means treat it sceptically rather than accepting it completely. The lack of evidence explains the caution."
  },
  {
    "id": "c1-idiom-2",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "I actually support the proposal, but I'll play devil's advocate for a moment. What is the speaker about to do?",
    "options": [
      "Accept every claim without asking questions.",
      "Present objections in order to test the argument.",
      "Explain why they have secretly opposed the proposal all along.",
      "Refuse to take part in the discussion."
    ],
    "correctIndex": 1,
    "explanation": "Playing devil's advocate means arguing an opposing position to explore its strengths or expose weaknesses, even if it is not your own view."
  },
  {
    "id": "c1-idiom-3",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The first audit found one missing payment; a later investigation uncovered hundreds. The first discovery was only ___.",
    "options": [
      "a storm in a teacup",
      "a clean slate",
      "the tip of the iceberg",
      "a blessing in disguise"
    ],
    "correctIndex": 2,
    "explanation": "The tip of the iceberg is a small visible sign of a much larger hidden problem. Here one payment was only a fraction of the losses."
  },
  {
    "id": "c1-idiom-4",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The email never directly rejects the offer, but its hesitant tone suggests that it will be refused. You have to ___ to understand the answer.",
    "options": [
      "take it at face value",
      "wipe the slate clean",
      "burn your bridges",
      "read between the lines"
    ],
    "correctIndex": 3,
    "explanation": "Read between the lines means infer a meaning that is suggested rather than explicitly stated. The tone supplies clues beyond the literal words."
  },
  {
    "id": "c1-idiom-5",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "Each time we meet the agreed requirements, the client adds new ones. It feels as though they keep ___.",
    "options": [
      "moving the goalposts",
      "breaking the ice",
      "burying the hatchet",
      "letting off steam"
    ],
    "correctIndex": 0,
    "explanation": "Moving the goalposts means changing the rules or success criteria after an activity has begun, making an agreed goal harder to achieve."
  },
  {
    "id": "c1-idiom-6",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "Nobody has begun organising the conference. I'll book the first planning meeting to ___.",
    "options": [
      "throw in the towel",
      "get the ball rolling",
      "miss the boat",
      "keep a low profile"
    ],
    "correctIndex": 1,
    "explanation": "Get the ball rolling means start an activity or process. Booking the first meeting begins the organisation of the conference."
  },
  {
    "id": "c1-idiom-7",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The contractor skipped essential inspections to save time. In other words, the contractor ___.",
    "options": [
      "went the extra mile",
      "left no stone unturned",
      "cut corners",
      "played it safe"
    ],
    "correctIndex": 2,
    "explanation": "Cut corners means omit necessary steps to save time, money or effort, often reducing quality or safety. Skipping inspections is an example."
  },
  {
    "id": "c1-idiom-8",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "Both sides asked Elena to support them, but she refused to choose either. She was ___.",
    "options": [
      "putting her foot down",
      "burning the midnight oil",
      "taking the bull by the horns",
      "sitting on the fence"
    ],
    "correctIndex": 3,
    "explanation": "Sitting on the fence means avoiding a decision between opposing positions. Elena deliberately chooses neither side."
  },
  {
    "id": "c1-idiom-9",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The prototype failed every safety test, so the engineers abandoned the design and started again. They went ___.",
    "options": [
      "back to the drawing board",
      "from strength to strength",
      "through the roof",
      "against the clock"
    ],
    "correctIndex": 0,
    "explanation": "Go back to the drawing board means return to the planning stage because an attempt or design has failed."
  },
  {
    "id": "c1-idiom-10",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "Losing that job seemed disastrous, but it led me to a career I enjoy much more. It turned out to be ___.",
    "options": [
      "a bitter pill to swallow",
      "a blessing in disguise",
      "a recipe for disaster",
      "a bone of contention"
    ],
    "correctIndex": 1,
    "explanation": "A blessing in disguise is an event that initially seems unfortunate but eventually produces a benefit. The unwanted job loss led to a better career."
  },
  {
    "id": "c1-idiom-11",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The new data contradict the earlier conclusions. The findings are ___ the original report.",
    "options": [
      "in keeping with",
      "on a par with",
      "at odds with",
      "in line with"
    ],
    "correctIndex": 2,
    "explanation": "At odds with means in conflict or disagreement with. Contradictory findings are not consistent with the earlier report."
  },
  {
    "id": "c1-idiom-12",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "We don't know whether extra funding will be needed. Let's cross that bridge when we come to it. What does this advice mean?",
    "options": [
      "Solve every possible future problem immediately.",
      "Abandon the project before any problems appear.",
      "Pretend that a known urgent problem has already been solved.",
      "Deal with that possible problem if and when it actually arises."
    ],
    "correctIndex": 3,
    "explanation": "Cross that bridge when we come to it advises postponing a decision about a hypothetical difficulty until the difficulty becomes relevant."
  },
  {
    "id": "c1-idiom-13",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The same application rules and access to resources should apply to every competitor. We need ___.",
    "options": [
      "a level playing field",
      "a foregone conclusion",
      "a slippery slope",
      "a hidden agenda"
    ],
    "correctIndex": 0,
    "explanation": "A level playing field is a situation in which people compete under fair conditions without unfair advantages for particular participants."
  },
  {
    "id": "c1-idiom-14",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "No venue or date has been agreed, so the conference plans are still ___.",
    "options": [
      "set in stone",
      "up in the air",
      "in full swing",
      "under wraps"
    ],
    "correctIndex": 1,
    "explanation": "Up in the air means uncertain or undecided. The absence of an agreed date and venue makes the plans unsettled, rather than merely secret."
  },
  {
    "id": "c1-idiom-15",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The investigators checked every receipt, account and interview record. They left ___ in their search for the missing funds.",
    "options": [
      "well enough alone",
      "the cat out of the bag",
      "no stone unturned",
      "a lot to be desired"
    ],
    "correctIndex": 2,
    "explanation": "Leave no stone unturned means investigate every possible source or option. The exhaustive checks show that thoroughness."
  },
  {
    "id": "c1-idiom-16",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "Something about the explanation seems wrong, but I can't put my finger on it. What can't the speaker do?",
    "options": [
      "Accept that any problem exists.",
      "Remember the speaker's name.",
      "Physically point to a printed page.",
      "Identify precisely what is wrong."
    ],
    "correctIndex": 3,
    "explanation": "Put your finger on something means identify or describe it exactly. The speaker senses a problem but cannot specify its cause."
  },
  {
    "id": "c1-idiom-17",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "There were a few minor delays, but ___ the event ran smoothly.",
    "options": [
      "by and large",
      "on the contrary",
      "at all costs",
      "out of the question"
    ],
    "correctIndex": 0,
    "explanation": "By and large means generally or on the whole. It allows the speaker to acknowledge minor exceptions while making an overall assessment."
  },
  {
    "id": "c1-idiom-18",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "Your diagnosis is exactly right: the missing training is the real cause of the problem. You've ___.",
    "options": [
      "jumped the gun",
      "hit the nail on the head",
      "missed the point",
      "barked up the wrong tree"
    ],
    "correctIndex": 1,
    "explanation": "Hit the nail on the head means identify or describe the situation precisely. The other options suggest acting too early or identifying the wrong issue."
  },
  {
    "id": "c1-idiom-19",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "I can accept constructive criticism, but I draw the line at personal insults. What boundary is the speaker setting?",
    "options": [
      "All criticism is unacceptable, even when it is constructive.",
      "Personal insults are acceptable if they are delivered politely.",
      "Personal insults are unacceptable, although constructive criticism is acceptable.",
      "The speaker is unwilling to distinguish between different kinds of criticism."
    ],
    "correctIndex": 2,
    "explanation": "Draw the line at something means set a limit on what you will accept. Here the limit separates criticism of work from personal abuse."
  },
  {
    "id": "c1-idiom-20",
    "level": "C1",
    "topic": "advanced-idioms",
    "question": "The librarian stayed late to find an obscure source and even arranged a copy for me. She really ___.",
    "options": [
      "washed her hands of it",
      "passed the buck",
      "took a back seat",
      "went the extra mile"
    ],
    "correctIndex": 3,
    "explanation": "Go the extra mile means make more effort than normally required. Staying late and arranging a copy show additional help."
  },
  {
    "id": "c1-acad-1",
    "level": "C1",
    "topic": "academic-language",
    "question": "A small observational study found an association, but it did not establish causation. Which conclusion is appropriately cautious?",
    "options": [
      "The findings suggest that the two factors may be related.",
      "The study proves that one factor always causes the other.",
      "The results eliminate every alternative explanation.",
      "The research establishes a universal law without exception."
    ],
    "correctIndex": 0,
    "explanation": "Suggest and may signal appropriate uncertainty. A small observational study can indicate an association without proving a universal causal relationship."
  },
  {
    "id": "c1-acad-2",
    "level": "C1",
    "topic": "academic-language",
    "question": "The sample was small; ___, the findings were consistent with those of several larger studies. Choose the concessive connector.",
    "options": [
      "therefore",
      "nevertheless",
      "similarly",
      "for example"
    ],
    "correctIndex": 1,
    "explanation": "Nevertheless introduces a point that holds despite a limitation. The consistency with larger studies contrasts with the weakness of the small sample."
  },
  {
    "id": "c1-acad-3",
    "level": "C1",
    "topic": "academic-language",
    "question": "The revised method reduces costs. ___, it produces more reliable results. Choose a connector that adds a further benefit.",
    "options": [
      "Conversely",
      "Nevertheless",
      "Moreover",
      "Instead"
    ],
    "correctIndex": 2,
    "explanation": "Moreover adds another argument in the same direction. Both sentences describe advantages of the revised method."
  },
  {
    "id": "c1-acad-4",
    "level": "C1",
    "topic": "academic-language",
    "question": "Urban participants preferred the online service, ___ rural participants favoured in-person appointments.",
    "options": [
      "because",
      "provided that",
      "so that",
      "whereas"
    ],
    "correctIndex": 3,
    "explanation": "Whereas contrasts two groups or situations. The sentence compares different preferences rather than giving a cause, condition or purpose."
  },
  {
    "id": "c1-acad-5",
    "level": "C1",
    "topic": "academic-language",
    "question": "The improvement was largely attributable ___ better staff training.",
    "options": [
      "to",
      "for",
      "with",
      "by"
    ],
    "correctIndex": 0,
    "explanation": "The standard expression is attributable to, meaning caused by or explainable by a particular factor."
  },
  {
    "id": "c1-acad-6",
    "level": "C1",
    "topic": "academic-language",
    "question": "An adequate theory must account ___ both the usual pattern and the exceptions.",
    "options": [
      "of",
      "for",
      "to",
      "with"
    ],
    "correctIndex": 1,
    "explanation": "Account for means explain. A theory must explain the exceptions as well as the normal pattern."
  },
  {
    "id": "c1-acad-7",
    "level": "C1",
    "topic": "academic-language",
    "question": "The claim is supported by observations and measurements rather than speculation. It is supported by ___ evidence.",
    "options": [
      "anecdotal",
      "hypothetical",
      "empirical",
      "counterfactual"
    ],
    "correctIndex": 2,
    "explanation": "Empirical evidence comes from observation or experiment. Hypothetical and counterfactual claims concern imagined possibilities, while anecdotal evidence relies on individual accounts."
  },
  {
    "id": "c1-acad-8",
    "level": "C1",
    "topic": "academic-language",
    "question": "The researchers followed the same participants for twelve years to examine change over time. This was a ___ study.",
    "options": [
      "cross-sectional",
      "purely theoretical",
      "single-session",
      "longitudinal"
    ],
    "correctIndex": 3,
    "explanation": "A longitudinal study follows people or phenomena over an extended period. A cross-sectional study examines a population at a particular time."
  },
  {
    "id": "c1-acad-9",
    "level": "C1",
    "topic": "academic-language",
    "question": "Independent measurements produced the same result and therefore ___ the original finding.",
    "options": [
      "corroborated",
      "contradicted",
      "invalidated",
      "concealed"
    ],
    "correctIndex": 0,
    "explanation": "Corroborate means provide additional evidence supporting a claim. Agreement between independent measurements strengthens the original finding."
  },
  {
    "id": "c1-acad-10",
    "level": "C1",
    "topic": "academic-language",
    "question": "The explanation is reasonable, although it has not yet been proven. It remains a ___ hypothesis.",
    "options": [
      "conclusive",
      "plausible",
      "refuted",
      "infallible"
    ],
    "correctIndex": 1,
    "explanation": "Plausible means reasonably believable or potentially true. It does not imply that the hypothesis has been conclusively established."
  },
  {
    "id": "c1-acad-11",
    "level": "C1",
    "topic": "academic-language",
    "question": "The evidence supports several competing explanations and settles none of them. The results are ___.",
    "options": [
      "definitive",
      "irrefutable",
      "inconclusive",
      "unambiguous"
    ],
    "correctIndex": 2,
    "explanation": "Inconclusive results do not establish a definite conclusion. The other adjectives imply that the evidence resolves uncertainty."
  },
  {
    "id": "c1-acad-12",
    "level": "C1",
    "topic": "academic-language",
    "question": "The report examines the ___ causes of inequality rather than only its visible symptoms.",
    "options": [
      "superficial",
      "incidental",
      "unrelated",
      "underlying"
    ],
    "correctIndex": 3,
    "explanation": "Underlying causes are the less immediately visible factors that produce or sustain a problem. They contrast with surface symptoms."
  },
  {
    "id": "c1-acad-13",
    "level": "C1",
    "topic": "academic-language",
    "question": "The new measures cannot eliminate the risk, but they may ___ its effects.",
    "options": [
      "mitigate",
      "exacerbate",
      "replicate",
      "disregard"
    ],
    "correctIndex": 0,
    "explanation": "Mitigate means make something less severe. Exacerbate means make it worse, while replicate and disregard do not express reduction."
  },
  {
    "id": "c1-acad-14",
    "level": "C1",
    "topic": "academic-language",
    "question": "The report distinguishes observed facts from the conclusions drawn from them. Those conclusions are ___.",
    "options": [
      "measurements",
      "inferences",
      "raw observations",
      "data entries"
    ],
    "correctIndex": 1,
    "explanation": "An inference is a conclusion reached through reasoning from evidence. Measurements and raw observations are evidence from which an inference may be drawn."
  },
  {
    "id": "c1-acad-15",
    "level": "C1",
    "topic": "academic-language",
    "question": "After considering both the benefits and the drawbacks, the authors judge the policy worthwhile ___.",
    "options": [
      "at random",
      "by definition",
      "on balance",
      "without exception"
    ],
    "correctIndex": 2,
    "explanation": "On balance signals an overall judgement made after weighing opposing considerations. It does not claim that there are no drawbacks."
  },
  {
    "id": "c1-acad-16",
    "level": "C1",
    "topic": "academic-language",
    "question": "The model is useful only ___ it accurately represents the conditions being studied.",
    "options": [
      "even though",
      "regardless of whether",
      "rather than",
      "insofar as"
    ],
    "correctIndex": 3,
    "explanation": "Insofar as means to the extent that. The model's usefulness is limited by how accurately it represents the relevant conditions."
  },
  {
    "id": "c1-acad-17",
    "level": "C1",
    "topic": "academic-language",
    "question": "The questionnaire gives consistent results, but it does not measure the skill it claims to measure. Which distinction does this illustrate?",
    "options": [
      "It may be reliable without being valid.",
      "It must be valid because it is reliable.",
      "It cannot be reliable if the results are consistent.",
      "Validity refers only to the number of questions."
    ],
    "correctIndex": 0,
    "explanation": "Reliability concerns consistency, while validity concerns whether the intended construct is measured. Consistency alone does not establish validity."
  },
  {
    "id": "c1-acad-18",
    "level": "C1",
    "topic": "academic-language",
    "question": "___ its methodological limitations, the study offers valuable preliminary evidence. Choose the formal expression meaning 'despite'.",
    "options": [
      "Because of",
      "Notwithstanding",
      "In accordance with",
      "For the purpose of"
    ],
    "correctIndex": 1,
    "explanation": "Notwithstanding is a formal preposition meaning despite. It introduces a limitation that does not cancel the contribution described."
  },
  {
    "id": "c1-acad-19",
    "level": "C1",
    "topic": "academic-language",
    "question": "The discussion should include only evidence directly relevant to the research question. Such evidence is ___.",
    "options": [
      "extraneous",
      "incidental",
      "pertinent",
      "obsolete"
    ],
    "correctIndex": 2,
    "explanation": "Pertinent means relevant to the matter under consideration. Extraneous evidence is outside the issue being discussed."
  },
  {
    "id": "c1-acad-20",
    "level": "C1",
    "topic": "academic-language",
    "question": "Given the limited data, a strong causal conclusion is not ___.",
    "options": [
      "withheld",
      "questioned",
      "restricted",
      "warranted"
    ],
    "correctIndex": 3,
    "explanation": "Warranted means justified or supported by sufficient grounds. Limited data may not justify a strong causal claim."
  },
];
