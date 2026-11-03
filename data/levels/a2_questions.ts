// data/levels/a2_questions.ts
import type { A2TopicSlug } from './a2_topics';

export type A2Question = {
  id: string;
  level: 'A2';
  topic: A2TopicSlug;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const a2Questions: A2Question[] = [
  // PAST SIMPLE — original questions
  {
    id: 'a2-past-1',
    level: 'A2',
    topic: 'past-simple',
    question: 'Use the past simple: Yesterday I ___ to the cinema with my friends.',
    options: ['go', 'went', 'gone', 'was going'],
    correctIndex: 1,
    explanation: "The completed trip happened yesterday. Go has the irregular past simple form went.",
  },
  {
    id: 'a2-past-2',
    level: 'A2',
    topic: 'past-simple',
    question: 'Use the past simple: She ___ her homework before dinner.',
    options: ['finish', 'finishes', 'finished', 'was finishing'],
    correctIndex: 2,
    explanation: "Finished is the past simple of finish. It describes completing the homework before dinner.",
  },
  {
    id: 'a2-past-3',
    level: 'A2',
    topic: 'past-simple',
    question: "Use the past simple: We ___ in London for two years, then moved to Rome.",
    options: ['lived', 'live', 'were living', 'have lived'],
    correctIndex: 0,
    explanation: "The stay in London is a finished period because the speakers then moved away. Use the past simple lived.",
  },
  {
    id: 'a2-past-4',
    level: 'A2',
    topic: 'past-simple',
    question: 'They ___ late for the meeting last Monday.',
    options: ['are', 'were', 'was', 'be'],
    correctIndex: 1,
    explanation: "Last Monday is a finished past time. The past form of be with they is were.",
  },
  {
    id: 'a2-past-5',
    level: 'A2',
    topic: 'past-simple',
    question: 'Use the past simple: I ___ a great book last weekend.',
    options: ['read', 'reads', 'was reading', 'readed'],
    correctIndex: 0,
    explanation: "The past tense of read is also written read, but pronounced /red/. The book was completed last weekend.",
  },
  {
    id: 'a2-past-6',
    level: 'A2',
    topic: 'past-simple',
    question: 'Use the past simple: She ___ breakfast at 7 a.m. yesterday.',
    options: ['have', 'had', 'has', 'was having'],
    correctIndex: 1,
    explanation: "Had is the irregular past simple of have. The sentence describes yesterday’s breakfast as a completed event.",
  },
  {
    id: 'a2-past-7',
    level: 'A2',
    topic: 'past-simple',
    question: "They ___ football in the park yesterday.",
    options: ['played', 'play', 'were played', 'was playing'],
    correctIndex: 0,
    explanation: "Played is the regular past simple of play. Yesterday places this completed activity in the past.",
  },
  {
    id: 'a2-past-8',
    level: 'A2',
    topic: 'past-simple',
    question: 'Use the past simple: My parents ___ to Italy last summer.',
    options: ['travel', 'traveled', 'were traveling', 'have traveled'],
    correctIndex: 1,
    explanation: "Last summer is a finished past period, so use the past simple traveled.",
  },
  {
    id: 'a2-past-9',
    level: 'A2',
    topic: 'past-simple',
    question: 'He ___ his keys and couldn’t open the door.',
    options: ['lose', 'loses', 'lost', 'was losing'],
    correctIndex: 2,
    explanation: "Lost is the irregular past simple of lose. Losing the keys explains why he could not open the door.",
  },
  {
    id: 'a2-past-10',
    level: 'A2',
    topic: 'past-simple',
    question: 'Use the past simple: We ___ a lot of photos on our trip.',
    options: ['take', 'took', 'taken', 'were taking'],
    correctIndex: 1,
    explanation: "Took is the irregular past simple of take. Take photos means to photograph something.",
  },

  // PRESENT CONTINUOUS — original questions
  {
    id: 'a2-pc-1',
    level: 'A2',
    topic: 'present-continuous',
    question: 'Listen! The birds ___ in the garden.',
    options: ['sing', 'sings', 'are singing', 'is singing'],
    correctIndex: 2,
    explanation: "Listen signals something happening now. Birds is plural, so use are + singing.",
  },
  {
    id: 'a2-pc-2',
    level: 'A2',
    topic: 'present-continuous',
    question: 'She can’t talk now. She ___ a shower.',
    options: ['has', 'is having', 'have', 'having'],
    correctIndex: 1,
    explanation: "The shower is happening now, so use is having with she.",
  },
  {
    id: 'a2-pc-3',
    level: 'A2',
    topic: 'present-continuous',
    question: 'Use the present continuous for a temporary activity: We ___ for our exams this week.',
    options: ['study', 'studies', 'are studying', 'are study'],
    correctIndex: 2,
    explanation: "This week describes a temporary activity around the present. The subject “We” takes are + studying.",
  },
  {
    id: 'a2-pc-4',
    level: 'A2',
    topic: 'present-continuous',
    question: 'What ___ you doing right now?',
    options: ['are', 'is', 'do', 'are you'],
    correctIndex: 0,
    explanation: "The question uses be + subject + verb-ing: What are you doing? Do is not used with doing here.",
  },
  {
    id: 'a2-pc-5',
    level: 'A2',
    topic: 'present-continuous',
    question: 'They ___ TV in the living room at the moment.',
    options: ['watch', 'are watching', 'watches', 'watching'],
    correctIndex: 1,
    explanation: "At the moment signals an action happening now. The subject “They” takes are watching.",
  },
  {
    id: 'a2-pc-6',
    level: 'A2',
    topic: 'present-continuous',
    question: "Right now, I ___ to music while I am working.",
    options: ['am listening', 'listen', 'listening', 'is listening'],
    correctIndex: 0,
    explanation: "Both actions are happening now. With I, the present continuous is am + listening.",
  },
  {
    id: 'a2-pc-7',
    level: 'A2',
    topic: 'present-continuous',
    question: 'My brother ___ his room now.',
    options: ['clean', 'cleans', 'is cleaning', 'are cleaning'],
    correctIndex: 2,
    explanation: "Now signals an action in progress. My brother is singular, so use is cleaning.",
  },
  {
    id: 'a2-pc-8',
    level: 'A2',
    topic: 'present-continuous',
    question: 'They can’t come out; they ___ dinner.',
    options: ['are having', 'have', 'has', 'having'],
    correctIndex: 0,
    explanation: "Dinner is in progress and prevents them from coming out. Use are having with they.",
  },
  {
    id: 'a2-pc-9',
    level: 'A2',
    topic: 'present-continuous',
    question: 'The weather is bad. It ___ again.',
    options: ['rains', 'is raining', 'rain', 'are raining'],
    correctIndex: 1,
    explanation: "The rain is happening now. Weather expressions use it + is + verb-ing.",
  },
  {
    id: 'a2-pc-10',
    level: 'A2',
    topic: 'present-continuous',
    question: 'We ___ for a new apartment these days.',
    options: ['look', 'are looking', 'looks', 'looking'],
    correctIndex: 1,
    explanation: "These days describes a temporary ongoing search. The subject “We” takes are looking.",
  },

  // COUNTABLE & UNCOUNTABLE — original questions
  {
    id: 'a2-cu-1',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'How ___ apples are there in the basket?',
    options: ['much', 'many', 'a lot', 'few'],
    correctIndex: 1,
    explanation: "Apples is a plural countable noun. Use how many to ask about the number.",
  },
  {
    id: 'a2-cu-2',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'There isn’t ___ milk in the fridge.',
    options: ['many', 'a few', 'much', 'few'],
    correctIndex: 2,
    explanation: "Milk is uncountable. Use much, rather than many or a few, in this negative sentence.",
  },
  {
    id: 'a2-cu-3',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'We have ___ bread but not much cheese.',
    options: ['a few', 'a little', 'many', 'few'],
    correctIndex: 1,
    explanation: "Bread is uncountable. A little means a small amount and can modify bread.",
  },
  {
    id: 'a2-cu-4',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'There are ___ chairs in the room.',
    options: ['much', 'a little', 'a few', 'little'],
    correctIndex: 2,
    explanation: "Chairs is plural and countable. A few means a small number of chairs.",
  },
  {
    id: 'a2-cu-5',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'He doesn’t eat ___ sugar.',
    options: ['many', 'much', 'a few', 'some'],
    correctIndex: 1,
    explanation: "Sugar is uncountable. Much is used to talk about its quantity in a negative sentence.",
  },
  {
    id: 'a2-cu-6',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'We need ___ eggs to make this cake.',
    options: ['a little', 'a few', 'little', 'much'],
    correctIndex: 1,
    explanation: "Eggs is plural and countable, so a few describes a small number of eggs.",
  },
  {
    id: 'a2-cu-7',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'There are very ___ people in the park today.',
    options: ['little', 'few', 'a little', 'much'],
    correctIndex: 1,
    explanation: "People is plural and countable. Very few means not many people.",
  },
  {
    id: 'a2-cu-8',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'We have ___ homework this weekend.',
    options: ['a few', 'many', 'a lot of', 'few'],
    correctIndex: 2,
    explanation: "Homework is uncountable. A lot of works with uncountable nouns; many and a few do not.",
  },
  {
    id: 'a2-cu-9',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'There is ___ water in the bottle.',
    options: ['a few', 'a little', 'few', 'many'],
    correctIndex: 1,
    explanation: "Water is uncountable. A little describes a small amount of water.",
  },
  {
    id: 'a2-cu-10',
    level: 'A2',
    topic: 'countable-uncountable',
    question: 'How ___ time do we have?',
    options: ['many', 'much', 'few', 'little'],
    correctIndex: 1,
    explanation: "Time is uncountable here. Ask how much time, rather than how many time.",
  },

  // COMPARATIVES & SUPERLATIVES — original questions
  {
    id: 'a2-comp-1',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'This book is ___ than that one.',
    options: ['interesting', 'more interesting', 'most interesting', 'the more interesting'],
    correctIndex: 1,
    explanation: "Than compares two books. Use more + interesting for the comparative of this longer adjective.",
  },
  {
    id: 'a2-comp-2',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'My sister is the ___ person in my family.',
    options: ['tall', 'taller', 'tallest', 'more tall'],
    correctIndex: 2,
    explanation: "The sentence compares one person with the whole family. Tall becomes the superlative tallest.",
  },
  {
    id: 'a2-comp-3',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'London is ___ than our town.',
    options: ['big', 'bigger', 'biggest', 'the bigger'],
    correctIndex: 1,
    explanation: "Than requires a comparative. Big doubles the final consonant before -er: bigger.",
  },
  {
    id: 'a2-comp-4',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'Maths is ___ for me than history.',
    options: ['difficult', 'more difficult', 'the most difficult', 'difficulter'],
    correctIndex: 1,
    explanation: "Use more difficult to compare the difficulty of two subjects. Difficult does not take -er.",
  },
  {
    id: 'a2-comp-5',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'This is the ___ movie I have ever seen.',
    options: ['good', 'better', 'best', 'the better'],
    correctIndex: 2,
    explanation: "The superlative of good is best. Ever seen compares this movie with all the others.",
  },
  {
    id: 'a2-comp-6',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'My car is ___ than yours.',
    options: ['fast', 'faster', 'fastest', 'the most fast'],
    correctIndex: 1,
    explanation: "Fast is a short adjective, so add -er to compare two cars: faster.",
  },
  {
    id: 'a2-comp-7',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'January is usually the ___ month of the year here.',
    options: ['cold', 'colder', 'coldest', 'more cold'],
    correctIndex: 2,
    explanation: "The month is compared with every other month of the year. Cold becomes coldest.",
  },
  {
    id: 'a2-comp-8',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'This exercise is ___ than the last one.',
    options: ['easy', 'easier', 'easiest', 'more easy'],
    correctIndex: 1,
    explanation: "For an adjective ending in consonant + y, change y to i before -er: easy → easier.",
  },
  {
    id: 'a2-comp-9',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'Of the three, Tom is the ___.',
    options: ['young', 'younger', 'youngest', 'more young'],
    correctIndex: 2,
    explanation: "Of the three compares Tom with a group, so use the superlative youngest.",
  },
  {
    id: 'a2-comp-10',
    level: 'A2',
    topic: 'comparatives-superlatives',
    question: 'A bike is usually ___ than a car.',
    options: ['cheap', 'cheaper', 'cheapest', 'more cheap'],
    correctIndex: 1,
    explanation: "Than signals a comparison. Cheap takes -er: cheaper.",
  },

  // SOME / ANY / A LOT OF — original questions
  {
    id: 'a2-some-1',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: 'There are ___ students in the classroom.',
    options: ['some', 'any', 'a lot', 'much'],
    correctIndex: 0,
    explanation: "Some describes an unspecified number in this affirmative sentence. A lot needs of before students.",
  },
  {
    id: 'a2-some-2',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "Use some or any in this neutral question: Are there ___ questions?",
    options: ['some', 'any', 'a lot', 'much'],
    correctIndex: 1,
    explanation: "Any is the usual choice in a neutral question asking whether there are questions at all.",
  },
  {
    id: 'a2-some-3',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "Use some or any to mean none: We don’t have ___ time.",
    options: ['some', 'any', 'a lot of', 'many'],
    correctIndex: 1,
    explanation: "Not any means none. Time is uncountable, so many cannot be used here.",
  },
  {
    id: 'a2-some-4',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "He drinks ___ coffee every day. (a large amount)",
    options: ['some', 'any', 'a lot of', 'a few'],
    correctIndex: 2,
    explanation: "A lot of expresses the large amount of coffee specified in the question. Coffee is uncountable.",
  },
  {
    id: 'a2-some-5',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "Use some or any to mean none: There aren’t ___ shops near here.",
    options: ['some', 'any', 'a lot of', 'much'],
    correctIndex: 1,
    explanation: "Not any shops means there are no shops. Any works with plural countable nouns in negatives.",
  },
  {
    id: 'a2-some-6',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "I need ___ help with this exercise. (an unspecified amount)",
    options: ['some', 'any', 'a lot of', 'many'],
    correctIndex: 0,
    explanation: "Some help means an unspecified amount of help. Help is uncountable, so many is unsuitable.",
  },
  {
    id: 'a2-some-7',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "They have ___ friends in England. (a large number)",
    options: ['some', 'any', 'a lot of', 'much'],
    correctIndex: 2,
    explanation: "A lot of means a large number. It can be used with the plural noun friends.",
  },
  {
    id: 'a2-some-8',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "Use some or any to mean no more: We don’t need ___ more bread.",
    options: ['some', 'any', 'a lot of', 'many'],
    correctIndex: 1,
    explanation: "Not any more bread means no additional bread is needed. Bread is uncountable.",
  },
  {
    id: 'a2-some-9',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "There is ___ noise in this street. (a large amount)",
    options: ['some', 'any', 'a lot of', 'many'],
    correctIndex: 2,
    explanation: "A lot of means a large amount and can modify the uncountable noun noise.",
  },
  {
    id: 'a2-some-10',
    level: 'A2',
    topic: 'some-any-a-lot-of',
    question: "Use some or any in this neutral question: Did you buy ___ apples?",
    options: ['some', 'any', 'a lot', 'much'],
    correctIndex: 1,
    explanation: "Use any in a neutral question about whether apples were bought. A lot would need of.",
  },

  // ADVERBS OF FREQUENCY — original questions
  {
    id: 'a2-adv-1',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "I ___ get up at 7 a.m. on weekdays. (every weekday, without exception)",
    options: ['always', 'never', 'sometimes', 'rarely'],
    correctIndex: 0,
    explanation: "Always means every time without exception, matching the frequency given in the sentence.",
  },
  {
    id: 'a2-adv-2',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "She is ___ late for work. (not even once)",
    options: ['always', 'often', 'never', 'usually'],
    correctIndex: 2,
    explanation: "Never means not on any occasion, so it matches a record of no late arrivals.",
  },
  {
    id: 'a2-adv-3',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: 'We ___ go to the gym, maybe once a month.',
    options: ['always', 'often', 'hardly ever', 'usually'],
    correctIndex: 2,
    explanation: "Hardly ever means very rarely. Going only once a month is infrequent here.",
  },
  {
    id: 'a2-adv-4',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "They ___ eat dinner together at the table. (most evenings, but not all)",
    options: ['never', 'rarely', 'usually', 'sometimes'],
    correctIndex: 2,
    explanation: "Usually means on most occasions, matching most evenings rather than every evening.",
  },
  {
    id: 'a2-adv-5',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "He ___ drinks coffee. (frequently, but less than most days)",
    options: ['always', 'usually', 'often', 'hardly ever'],
    correctIndex: 2,
    explanation: "Often means frequently. It does not mean every time, as always does.",
  },
  {
    id: 'a2-adv-6',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "We ___ watch TV in the evening. (now and then)",
    options: ['never', 'sometimes', 'always', 'rarely'],
    correctIndex: 1,
    explanation: "Sometimes means on some occasions. It fits an activity that happens now and then.",
  },
  {
    id: 'a2-adv-7',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "The students are ___ noisy in class. (every lesson, without exception)",
    options: ['always', 'never', 'sometimes', 'rarely'],
    correctIndex: 0,
    explanation: "Always means every time. Frequency adverbs normally come after be: are always noisy.",
  },
  {
    id: 'a2-adv-8',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "I am ___ tired on Monday mornings. (on some occasions, now and then)",
    options: ['always', 'never', 'often', 'sometimes'],
    correctIndex: 3,
    explanation: "Sometimes means on some occasions but not regularly. With be, place it after am.",
  },
  {
    id: 'a2-adv-9',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: "She ___ goes to bed before midnight. (most nights, but not all)",
    options: ['usually', 'never', 'always', 'hardly ever'],
    correctIndex: 0,
    explanation: "Usually means most of the time. It goes before the main verb goes.",
  },
  {
    id: 'a2-adv-10',
    level: 'A2',
    topic: 'adverbs-of-frequency',
    question: 'They ___ visit their grandparents, only on special days.',
    options: ['often', 'never', 'hardly ever', 'always'],
    correctIndex: 2,
    explanation: "Hardly ever means very rarely. Visiting only on special days supports that meaning.",
  },

  // Additional questions and curriculum topics (20 questions per topic).
  {
    "id": "a2-past-11",
    "level": "A2",
    "topic": "past-simple",
    "question": "Which past-simple question is correct?",
    "options": [
      "Did you enjoyed the concert?",
      "Do you enjoyed the concert?",
      "Were you enjoy the concert?",
      "Did you enjoy the concert?"
    ],
    "correctIndex": 3,
    "explanation": "Use did + subject + the base verb in a past-simple question: Did you enjoy?"
  },
  {
    "id": "a2-past-12",
    "level": "A2",
    "topic": "past-simple",
    "question": "The museum was closed, so we ___ inside.",
    "options": [
      "didn't go",
      "didn't went",
      "don't went",
      "weren't go"
    ],
    "correctIndex": 0,
    "explanation": "After didn't, use the base form go, not the past form went."
  },
  {
    "id": "a2-past-13",
    "level": "A2",
    "topic": "past-simple",
    "question": "Complete in the past simple: Who ___ this beautiful picture?",
    "options": [
      "paint",
      "painted",
      "did painted",
      "was paint"
    ],
    "correctIndex": 1,
    "explanation": "Who is the subject here, so the positive subject question uses the past form painted without did."
  },
  {
    "id": "a2-past-14",
    "level": "A2",
    "topic": "past-simple",
    "question": "The shop ___ at nine yesterday morning.",
    "options": [
      "open",
      "opening",
      "opened",
      "did opened"
    ],
    "correctIndex": 2,
    "explanation": "Yesterday morning is a finished past time. Add -ed to open: opened."
  },
  {
    "id": "a2-past-15",
    "level": "A2",
    "topic": "past-simple",
    "question": "I ___ my wallet on the bus last night and had to walk home.",
    "options": [
      "leave",
      "leaved",
      "leaving",
      "left"
    ],
    "correctIndex": 3,
    "explanation": "Leave has the irregular past form left. Left my wallet means I forgot it there."
  },
  {
    "id": "a2-past-16",
    "level": "A2",
    "topic": "past-simple",
    "question": "Complete the past-simple short answer: 'Did the parcel arrive?' 'Yes, it ___. '",
    "options": [
      "did",
      "does",
      "was",
      "arrived"
    ],
    "correctIndex": 0,
    "explanation": "A short answer repeats the auxiliary in the question: Did it arrive? Yes, it did."
  },
  {
    "id": "a2-past-17",
    "level": "A2",
    "topic": "past-simple",
    "question": "Our team ___ the match 2–1 yesterday.",
    "options": [
      "win",
      "won",
      "winned",
      "winning"
    ],
    "correctIndex": 1,
    "explanation": "The irregular past simple of win is won."
  },
  {
    "id": "a2-past-18",
    "level": "A2",
    "topic": "past-simple",
    "question": "Which sentence correctly describes a finished journey last Tuesday?",
    "options": [
      "We catched the early train.",
      "We did caught the early train.",
      "We caught the early train.",
      "We catch the early train last Tuesday."
    ],
    "correctIndex": 2,
    "explanation": "Catch changes to caught in the past simple. Do not add -ed to this irregular verb."
  },
  {
    "id": "a2-past-19",
    "level": "A2",
    "topic": "past-simple",
    "question": "Complete in the past simple: The restaurant ___ busy, but the waiters ___ friendly.",
    "options": [
      "were / was",
      "was / was",
      "were / were",
      "was / were"
    ],
    "correctIndex": 3,
    "explanation": "The restaurant is singular and takes was. The waiters is plural and takes were."
  },
  {
    "id": "a2-past-20",
    "level": "A2",
    "topic": "past-simple",
    "question": "How much ___ you pay for that ticket yesterday?",
    "options": [
      "did",
      "were",
      "does",
      "had"
    ],
    "correctIndex": 0,
    "explanation": "A past-simple question about the price uses did before the subject and the base verb pay."
  },
  {
    "id": "a2-pc-11",
    "level": "A2",
    "topic": "present-continuous",
    "question": "Please be quiet. The baby ___ to sleep right now.",
    "options": [
      "is trying",
      "tries",
      "are trying",
      "is try"
    ],
    "correctIndex": 0,
    "explanation": "An action in progress uses be + verb-ing. The baby is singular, so use is trying."
  },
  {
    "id": "a2-pc-12",
    "level": "A2",
    "topic": "present-continuous",
    "question": "Complete in the present continuous: I ___ my usual desk today because someone is repairing it.",
    "options": [
      "am not use",
      "am not using",
      "not using",
      "doesn't using"
    ],
    "correctIndex": 1,
    "explanation": "Make the present continuous negative with am not + verb-ing: I am not using."
  },
  {
    "id": "a2-pc-13",
    "level": "A2",
    "topic": "present-continuous",
    "question": "Which question uses the present continuous correctly?",
    "options": [
      "Does your sister waiting outside?",
      "Is your sister wait outside?",
      "Is your sister waiting outside?",
      "Are your sister waiting outside?"
    ],
    "correctIndex": 2,
    "explanation": "Put is before the singular subject your sister, then use waiting."
  },
  {
    "id": "a2-pc-14",
    "level": "A2",
    "topic": "present-continuous",
    "question": "Use the present continuous for this temporary situation: We ___ with friends while our house is being painted.",
    "options": [
      "are stay",
      "stays",
      "is staying",
      "are staying"
    ],
    "correctIndex": 3,
    "explanation": "A temporary living arrangement uses are staying with the subject we."
  },
  {
    "id": "a2-pc-15",
    "level": "A2",
    "topic": "present-continuous",
    "question": "Look at that dog! It ___ towards the lake.",
    "options": [
      "is running",
      "are running",
      "is runing",
      "running"
    ],
    "correctIndex": 0,
    "explanation": "The present continuous needs is with it. Run doubles its final consonant before -ing: running."
  },
  {
    "id": "a2-pc-16",
    "level": "A2",
    "topic": "present-continuous",
    "question": "Complete in the present continuous: Why ___ the children ___ their coats indoors?",
    "options": [
      "do / wearing",
      "are / wearing",
      "is / wearing",
      "are / wear"
    ],
    "correctIndex": 1,
    "explanation": "The children is plural. Form the question with are + subject + wearing."
  },
  {
    "id": "a2-pc-17",
    "level": "A2",
    "topic": "present-continuous",
    "question": "I have an appointment with the dentist tomorrow. Use the present continuous: I ___ the dentist at ten.",
    "options": [
      "am see",
      "is seeing",
      "am seeing",
      "seeing"
    ],
    "correctIndex": 2,
    "explanation": "The present continuous can describe an arranged future appointment: I am seeing the dentist."
  },
  {
    "id": "a2-pc-18",
    "level": "A2",
    "topic": "present-continuous",
    "question": "'Are you working today?' Choose the correct short answer.",
    "options": [
      "No, I don't.",
      "No, I isn't.",
      "No, I not.",
      "No, I'm not."
    ],
    "correctIndex": 3,
    "explanation": "A present-continuous short answer uses the appropriate form of be: No, I'm not."
  },
  {
    "id": "a2-pc-19",
    "level": "A2",
    "topic": "present-continuous",
    "question": "The guests are already here. Complete in the present continuous: Dad ___ the last few sandwiches.",
    "options": [
      "is making",
      "is makeing",
      "are making",
      "making"
    ],
    "correctIndex": 0,
    "explanation": "Drop the final silent e in make before adding -ing: making. Dad takes is."
  },
  {
    "id": "a2-pc-20",
    "level": "A2",
    "topic": "present-continuous",
    "question": "Which sentence describes an action happening now?",
    "options": [
      "The guide showed us the map yesterday.",
      "The guide is showing us the map.",
      "The guide shows visitors the map every morning.",
      "The guide will show us the map tomorrow."
    ],
    "correctIndex": 1,
    "explanation": "Is showing is present continuous and describes the action in progress now."
  },
  {
    "id": "a2-cu-11",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "Which noun is normally uncountable when it means information about what to do?",
    "options": [
      "suggestion",
      "advice",
      "idea",
      "tip"
    ],
    "correctIndex": 1,
    "explanation": "Advice is uncountable. Say some advice or a piece of advice; suggestions, ideas and tips can be counted."
  },
  {
    "id": "a2-cu-12",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "The hotel gave us two useful ___ about local buses.",
    "options": [
      "informations",
      "information",
      "pieces of information",
      "pieces of informations"
    ],
    "correctIndex": 2,
    "explanation": "Information is uncountable. Count it using pieces of information."
  },
  {
    "id": "a2-cu-13",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "Choose the correct phrase for three separate items you take on holiday.",
    "options": [
      "three luggages",
      "three luggage",
      "three bag",
      "three bags"
    ],
    "correctIndex": 3,
    "explanation": "Bag is countable, so use three bags. Luggage is uncountable in standard English."
  },
  {
    "id": "a2-cu-14",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "There ___ some furniture in the empty flat now.",
    "options": [
      "is",
      "are",
      "be",
      "were"
    ],
    "correctIndex": 0,
    "explanation": "Furniture is an uncountable noun and takes a singular verb here: there is some furniture."
  },
  {
    "id": "a2-cu-15",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "I need two ___ of bread for this sandwich.",
    "options": [
      "slice",
      "slices",
      "breads",
      "bread"
    ],
    "correctIndex": 1,
    "explanation": "Bread is uncountable. Two slices of bread counts the individual pieces."
  },
  {
    "id": "a2-cu-16",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "There are only a ___ biscuits left in the tin.",
    "options": [
      "little",
      "much",
      "few",
      "less"
    ],
    "correctIndex": 2,
    "explanation": "Biscuits is a plural countable noun. A few means a small number."
  },
  {
    "id": "a2-cu-17",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "We haven't got ___ money for a taxi.",
    "options": [
      "many",
      "a few",
      "several",
      "much"
    ],
    "correctIndex": 3,
    "explanation": "Money is uncountable, so use much in this negative sentence."
  },
  {
    "id": "a2-cu-18",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "Which shopping-list item is grammatically correct?",
    "options": [
      "a bottle of oil",
      "an oil of bottle",
      "two oils of bottle",
      "many oil"
    ],
    "correctIndex": 0,
    "explanation": "A bottle of oil uses a countable container to describe an amount of uncountable oil."
  },
  {
    "id": "a2-cu-19",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "Is there ___ rice left? I only need a small amount.",
    "options": [
      "a few",
      "a little",
      "many",
      "several"
    ],
    "correctIndex": 1,
    "explanation": "Rice is uncountable. A little rice means a small amount of rice."
  },
  {
    "id": "a2-cu-20",
    "level": "A2",
    "topic": "countable-uncountable",
    "question": "How many ___ are staying at the hotel tonight?",
    "options": [
      "luggage",
      "traffic",
      "guests",
      "furniture"
    ],
    "correctIndex": 2,
    "explanation": "How many is followed by a plural countable noun such as guests."
  },
  {
    "id": "a2-comp-11",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "Please speak ___ than before; I can't follow such fast speech.",
    "options": [
      "most slowly",
      "slowlier",
      "more slowly",
      "the slowest"
    ],
    "correctIndex": 2,
    "explanation": "The comparative of the adverb slowly is more slowly. Than marks the comparison."
  },
  {
    "id": "a2-comp-12",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "Since her lessons, Nina plays the piano ___ than she did last year.",
    "options": [
      "best",
      "more good",
      "wellest",
      "better"
    ],
    "correctIndex": 3,
    "explanation": "The comparative of the adverb well is better. It describes how Nina plays."
  },
  {
    "id": "a2-comp-13",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "Of all the people in our team, Omar runs the ___.",
    "options": [
      "fastest",
      "faster",
      "more fast",
      "most fastly"
    ],
    "correctIndex": 0,
    "explanation": "Fast is also an adverb. Its superlative is fastest, used to compare one runner with the whole team."
  },
  {
    "id": "a2-comp-14",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "After the accident, he drives ___ than he used to.",
    "options": [
      "carefuller",
      "more carefully",
      "most carefully",
      "more careful"
    ],
    "correctIndex": 1,
    "explanation": "Drive needs an adverb. The comparative of carefully is more carefully."
  },
  {
    "id": "a2-comp-15",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "I arrived ___ than the others and had time to choose a seat.",
    "options": [
      "more early",
      "earliest",
      "earlier",
      "the earliest than"
    ],
    "correctIndex": 2,
    "explanation": "Early can be an adverb. Change its final y to i and add -er: earlier."
  },
  {
    "id": "a2-comp-16",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "Our new printer works ___ than the old one; it prints twice as many pages per minute.",
    "options": [
      "quicklier",
      "most quickly",
      "more quick",
      "more quickly"
    ],
    "correctIndex": 3,
    "explanation": "Works describes an action, so use the comparative adverb more quickly."
  },
  {
    "id": "a2-comp-17",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "Of the four dancers, Eva moved the ___; every step was smooth and controlled.",
    "options": [
      "most gracefully",
      "more gracefully",
      "gracefullest",
      "most graceful"
    ],
    "correctIndex": 0,
    "explanation": "Use the superlative adverb most gracefully to compare how one dancer moved with the whole group."
  },
  {
    "id": "a2-comp-18",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "The engine is making a strange noise. It is running ___ than yesterday.",
    "options": [
      "worst",
      "worse",
      "more badlyer",
      "baddest"
    ],
    "correctIndex": 1,
    "explanation": "Worse is the comparative of the adverb badly. It describes how the engine is running."
  },
  {
    "id": "a2-comp-19",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "Which sentence correctly compares how two people work?",
    "options": [
      "Lena works more hardly than I do.",
      "Lena works hardest than I do.",
      "Lena works harder than I do.",
      "Lena works more hard than I do."
    ],
    "correctIndex": 2,
    "explanation": "Hard is an adverb meaning with effort. Its comparative is harder; hardly has a different meaning."
  },
  {
    "id": "a2-comp-20",
    "level": "A2",
    "topic": "comparatives-superlatives",
    "question": "This is the ___ expensive hotel in the town; every other hotel costs more.",
    "options": [
      "less",
      "more",
      "much",
      "least"
    ],
    "correctIndex": 3,
    "explanation": "The least expensive means the cheapest within the whole group."
  },
  {
    "id": "a2-some-11",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "Complete this polite offer of a drink: Would you like ___ tea?",
    "options": [
      "a few",
      "many",
      "a lot",
      "some"
    ],
    "correctIndex": 3,
    "explanation": "Some is normally used in offers when we are offering something that is available."
  },
  {
    "id": "a2-some-12",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "The cupboard is completely empty. There isn't ___ food in it.",
    "options": [
      "any",
      "some",
      "many",
      "a lot"
    ],
    "correctIndex": 0,
    "explanation": "Not any food means there is no food at all. A lot would need of."
  },
  {
    "id": "a2-some-13",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "Complete the phrase meaning a large number: We saw a lot ___ birds by the river.",
    "options": [
      "from",
      "of",
      "at",
      "with"
    ],
    "correctIndex": 1,
    "explanation": "A lot of is followed by a noun: a lot of birds."
  },
  {
    "id": "a2-some-14",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "Choose the sentence that means there are no messages.",
    "options": [
      "There are some messages.",
      "There are a lot of messages.",
      "There aren't any messages.",
      "There aren't a lot of messages."
    ],
    "correctIndex": 2,
    "explanation": "Not any means none. Not a lot of can still mean there are a few."
  },
  {
    "id": "a2-some-15",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "Complete this polite request for a drink: Could I have ___ water, please?",
    "options": [
      "a few",
      "many",
      "a lot",
      "some"
    ],
    "correctIndex": 3,
    "explanation": "Some is the usual choice when requesting a quantity of something."
  },
  {
    "id": "a2-some-16",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "Which sentence correctly uses a lot of with an uncountable noun?",
    "options": [
      "There is a lot of traffic today.",
      "There are a lot of traffic today.",
      "There is a lot traffic today.",
      "There is many traffic today."
    ],
    "correctIndex": 0,
    "explanation": "Traffic is uncountable, so use is and the complete phrase a lot of."
  },
  {
    "id": "a2-some-17",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "Use some or any in a neutral question: Have you got ___ stamps?",
    "options": [
      "some",
      "any",
      "much",
      "a lot"
    ],
    "correctIndex": 1,
    "explanation": "Any is the usual choice in a neutral question asking whether stamps are available."
  },
  {
    "id": "a2-some-18",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "There are a lot of people here. Which phrase has the same meaning in this sentence?",
    "options": [
      "no people",
      "one person",
      "many people",
      "very few people"
    ],
    "correctIndex": 2,
    "explanation": "With a plural countable noun, a lot of means many."
  },
  {
    "id": "a2-some-19",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "I bought ___ oranges, but I didn't buy any lemons. (an unspecified number)",
    "options": [
      "any",
      "much",
      "a lot",
      "some"
    ],
    "correctIndex": 3,
    "explanation": "Some is used for an unspecified number in an affirmative sentence."
  },
  {
    "id": "a2-some-20",
    "level": "A2",
    "topic": "some-any-a-lot-of",
    "question": "Choose the complete sentence with correct grammar.",
    "options": [
      "We have a lot of work to finish.",
      "We have a lot work to finish.",
      "We have many work to finish.",
      "We have any work to finish."
    ],
    "correctIndex": 0,
    "explanation": "Work is uncountable here, and a lot of is a complete expression of quantity."
  },
  {
    "id": "a2-adv-11",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "Choose the usual neutral word order.",
    "options": [
      "I often cycle to work.",
      "I cycle often to work always.",
      "I often to work cycle.",
      "I to work often cycle."
    ],
    "correctIndex": 0,
    "explanation": "Frequency adverbs such as often normally go before the main verb: often cycle."
  },
  {
    "id": "a2-adv-12",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "Choose the correct position of usually with be.",
    "options": [
      "The library usually quiet is.",
      "The library is usually quiet.",
      "The library is quiet usually is.",
      "The usually is library quiet."
    ],
    "correctIndex": 1,
    "explanation": "A frequency adverb normally follows the verb be: is usually quiet."
  },
  {
    "id": "a2-adv-13",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "'How often do you clean your bike?' Which answer gives a frequency?",
    "options": [
      "In the garage.",
      "With a cloth.",
      "Twice a month.",
      "For twenty minutes."
    ],
    "correctIndex": 2,
    "explanation": "Twice a month tells us how often an action happens. The other answers give place, method or duration."
  },
  {
    "id": "a2-adv-14",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "Maya takes the stairs on every journey and has not used the lift even once. She ___ uses the lift.",
    "options": [
      "always",
      "usually",
      "often",
      "never"
    ],
    "correctIndex": 3,
    "explanation": "Never means not on any occasion. Using only the stairs rules out using the lift."
  },
  {
    "id": "a2-adv-15",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "The train arrived on time on 29 of the last 30 days. It was ___ on time.",
    "options": [
      "usually",
      "never",
      "rarely",
      "hardly ever"
    ],
    "correctIndex": 0,
    "explanation": "Usually means on most occasions. Twenty-nine days out of thirty is most of the time."
  },
  {
    "id": "a2-adv-16",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "Which phrase means the same as every two weeks?",
    "options": [
      "twice a day",
      "twice a month, approximately",
      "every other day",
      "once a year"
    ],
    "correctIndex": 1,
    "explanation": "Every two weeks is approximately twice a month. Months do not all have exactly four weeks."
  },
  {
    "id": "a2-adv-17",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "Choose the standard question asking about frequency.",
    "options": [
      "How often she does travel?",
      "How often do she travels?",
      "How often does she travel?",
      "How often does she travels?"
    ],
    "correctIndex": 2,
    "explanation": "Use how often + does + subject + the base verb travel with she."
  },
  {
    "id": "a2-adv-18",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "We go camping once every few years. We ___ go camping.",
    "options": [
      "always",
      "usually",
      "often",
      "rarely"
    ],
    "correctIndex": 3,
    "explanation": "Rarely means not often. Once every few years is a very low frequency."
  },
  {
    "id": "a2-adv-19",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "Choose the sentence that means 'on every occasion'.",
    "options": [
      "He always checks the door.",
      "He sometimes checks the door.",
      "He rarely checks the door.",
      "He never checks the door."
    ],
    "correctIndex": 0,
    "explanation": "Always means every time. Sometimes and rarely describe lower frequencies; never means not at all."
  },
  {
    "id": "a2-adv-20",
    "level": "A2",
    "topic": "adverbs-of-frequency",
    "question": "Complete the expression: I visit the dentist twice ___ year.",
    "options": [
      "in",
      "a",
      "on",
      "at"
    ],
    "correctIndex": 1,
    "explanation": "Twice a year means two times each year. We also say once a week and three times a month."
  },
  {
    "id": "a2-past-cont-1",
    "level": "A2",
    "topic": "past-continuous",
    "question": "At eight last night, I ___ dinner. Use the past continuous.",
    "options": [
      "am cooking",
      "were cooking",
      "was cook",
      "was cooking"
    ],
    "correctIndex": 3,
    "explanation": "The past continuous is was or were + verb-ing. With I, use was cooking."
  },
  {
    "id": "a2-past-cont-2",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Use the past continuous: The children ___ in the garden when it started to rain.",
    "options": [
      "were playing",
      "was playing",
      "are playing",
      "were play"
    ],
    "correctIndex": 0,
    "explanation": "The children is plural, so the ongoing past action is were playing."
  },
  {
    "id": "a2-past-cont-3",
    "level": "A2",
    "topic": "past-continuous",
    "question": "What ___ you doing when I called yesterday?",
    "options": [
      "was",
      "were",
      "are",
      "did"
    ],
    "correctIndex": 1,
    "explanation": "A past-continuous question with you uses were before the subject: What were you doing?"
  },
  {
    "id": "a2-past-cont-4",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Complete in the past continuous: He ___ attention, so he missed the instructions.",
    "options": [
      "didn't paying",
      "weren't paying",
      "wasn't paying",
      "wasn't pay"
    ],
    "correctIndex": 2,
    "explanation": "Use was not + verb-ing to make the past continuous negative with he."
  },
  {
    "id": "a2-past-cont-5",
    "level": "A2",
    "topic": "past-continuous",
    "question": "'Were they waiting at the bus stop?' Choose the correct short answer.",
    "options": [
      "Yes, they did.",
      "Yes, they was.",
      "Yes, they waiting.",
      "Yes, they were."
    ],
    "correctIndex": 3,
    "explanation": "A short answer to Were they waiting? repeats were: Yes, they were."
  },
  {
    "id": "a2-past-cont-6",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Use the past continuous for both simultaneous actions: I ___ while my sister ___ the dishes.",
    "options": [
      "was drying / was washing",
      "was dry / was wash",
      "were drying / were washing",
      "am drying / is washing"
    ],
    "correctIndex": 0,
    "explanation": "Both actions were in progress together. I and my sister each take was + verb-ing."
  },
  {
    "id": "a2-past-cont-7",
    "level": "A2",
    "topic": "past-continuous",
    "question": "The phone rang while the driver ___ a break. Use the past continuous.",
    "options": [
      "were taking",
      "was taking",
      "is taking",
      "was takeing"
    ],
    "correctIndex": 1,
    "explanation": "The ongoing background action uses was taking. Drop the silent e in take before adding -ing."
  },
  {
    "id": "a2-past-cont-8",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Which sentence describes an action already in progress when another event happened?",
    "options": [
      "I read every morning.",
      "I will read after dinner.",
      "I was reading when the lights went out.",
      "I have three books to read."
    ],
    "correctIndex": 2,
    "explanation": "Was reading is the ongoing past action; the lights went out is the event that interrupted it."
  },
  {
    "id": "a2-past-cont-9",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Why ___ the dog barking at midnight?",
    "options": [
      "were",
      "did",
      "does",
      "was"
    ],
    "correctIndex": 3,
    "explanation": "The dog is singular. In a past-continuous question, put was before the subject."
  },
  {
    "id": "a2-past-cont-10",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Use the past continuous: It ___ when we left, so we took umbrellas.",
    "options": [
      "was raining",
      "were raining",
      "is raining",
      "was rained"
    ],
    "correctIndex": 0,
    "explanation": "The rain was in progress at the time of leaving. It takes was raining."
  },
  {
    "id": "a2-past-cont-11",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Complete in the past continuous: I ___, so I didn't hear the doorbell.",
    "options": [
      "were sleeping",
      "was sleeping",
      "am sleeping",
      "was sleep"
    ],
    "correctIndex": 1,
    "explanation": "The ongoing past action is expressed with was sleeping. I takes was."
  },
  {
    "id": "a2-past-cont-12",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Choose the negative form of 'They were working'.",
    "options": [
      "They didn't working.",
      "They wasn't working.",
      "They weren't working.",
      "They weren't work."
    ],
    "correctIndex": 2,
    "explanation": "Add not to were to make the past continuous negative: were not working."
  },
  {
    "id": "a2-past-cont-13",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Complete in the past continuous: My parents ___ to the airport at six this morning.",
    "options": [
      "was driving",
      "were driveing",
      "are drive",
      "were driving"
    ],
    "correctIndex": 3,
    "explanation": "My parents is plural and takes were. Drive becomes driving when -ing is added."
  },
  {
    "id": "a2-past-cont-14",
    "level": "A2",
    "topic": "past-continuous",
    "question": "'Was your brother studying at seven?' Choose the correct negative short answer.",
    "options": [
      "No, he wasn't.",
      "No, he didn't.",
      "No, he weren't.",
      "No, he not."
    ],
    "correctIndex": 0,
    "explanation": "The question uses was, so the negative short answer is No, he wasn't."
  },
  {
    "id": "a2-past-cont-15",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Use the past continuous: The guide ___ the map when a tourist asked a question.",
    "options": [
      "were explaining",
      "was explaining",
      "was explain",
      "is explaining"
    ],
    "correctIndex": 1,
    "explanation": "Was explaining places the guide's explanation in progress when the tourist spoke."
  },
  {
    "id": "a2-past-cont-16",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Which question is correctly formed in the past continuous?",
    "options": [
      "Where did you staying last week?",
      "Where was you staying last week?",
      "Where were you staying last week?",
      "Where you were staying last week?"
    ],
    "correctIndex": 2,
    "explanation": "A past-continuous question uses question word + were + subject + verb-ing."
  },
  {
    "id": "a2-past-cont-17",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Use the past continuous: We ___ to each other; we were listening to the news.",
    "options": [
      "wasn't talking",
      "didn't talking",
      "weren't talk",
      "weren't talking"
    ],
    "correctIndex": 3,
    "explanation": "With we, the negative past continuous is were not + verb-ing: weren't talking."
  },
  {
    "id": "a2-past-cont-18",
    "level": "A2",
    "topic": "past-continuous",
    "question": "At the moment the teacher entered, the students ___ their books. Use the past continuous.",
    "options": [
      "were opening",
      "was opening",
      "are opening",
      "were open"
    ],
    "correctIndex": 0,
    "explanation": "The plural subject the students takes were opening for an action in progress in the past."
  },
  {
    "id": "a2-past-cont-19",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Which part of 'She was walking home when she found a wallet' gives the background action?",
    "options": [
      "when she found a wallet",
      "She was walking home",
      "she found",
      "a wallet"
    ],
    "correctIndex": 1,
    "explanation": "The past continuous was walking gives the activity in progress. Found is the shorter past-simple event."
  },
  {
    "id": "a2-past-cont-20",
    "level": "A2",
    "topic": "past-continuous",
    "question": "Complete in the past continuous: The baby ___, but everyone else was awake.",
    "options": [
      "were sleeping",
      "was slept",
      "was sleeping",
      "did sleeping"
    ],
    "correctIndex": 2,
    "explanation": "The baby is singular. Was sleeping describes the activity in progress at that past time."
  },
  {
    "id": "a2-future-1",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Complete with will for a decision made now: 'The phone is ringing.' 'I ___ it.'",
    "options": [
      "will answer",
      "will answering",
      "will to answer",
      "am answer"
    ],
    "correctIndex": 0,
    "explanation": "Will + the base verb can express a decision made at the moment of speaking."
  },
  {
    "id": "a2-future-2",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Use going to for an intention: I ___ learn to drive this summer.",
    "options": [
      "is going to",
      "am going to",
      "am go to",
      "going to"
    ],
    "correctIndex": 1,
    "explanation": "With I, form the planned intention with am going to + base verb."
  },
  {
    "id": "a2-future-3",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Complete with the correct form of going to: They ___ move house next month.",
    "options": [
      "is going to",
      "are going",
      "are going to",
      "going to"
    ],
    "correctIndex": 2,
    "explanation": "They takes are going to, followed by the base verb move."
  },
  {
    "id": "a2-future-4",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Look at those dark clouds. Use going to for a prediction based on what you can see: It ___ rain.",
    "options": [
      "are going to",
      "is go to",
      "going to",
      "is going to"
    ],
    "correctIndex": 3,
    "explanation": "Visible evidence can support a going-to prediction. With it, use is going to."
  },
  {
    "id": "a2-future-5",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Which sentence makes a promise?",
    "options": [
      "I will return your book tomorrow, I promise.",
      "I returned your book yesterday.",
      "I usually return books quickly.",
      "I am reading your book now."
    ],
    "correctIndex": 0,
    "explanation": "Will is commonly used to make a promise about a future action."
  },
  {
    "id": "a2-future-6",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Complete the negative future with will: Don't worry. I ___ forget your birthday.",
    "options": [
      "don't will",
      "won't",
      "not will",
      "won't to"
    ],
    "correctIndex": 1,
    "explanation": "Won't is the contracted negative of will. It is followed by the base verb forget."
  },
  {
    "id": "a2-future-7",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Which question uses going to correctly?",
    "options": [
      "Do you going to cook tonight?",
      "Are you going cook tonight?",
      "Are you going to cook tonight?",
      "Is you going to cook tonight?"
    ],
    "correctIndex": 2,
    "explanation": "Going-to questions begin with the appropriate form of be: Are you going to cook?"
  },
  {
    "id": "a2-future-8",
    "level": "A2",
    "topic": "will-going-to",
    "question": "'Will the shop be open on Sunday?' Choose the correct short answer.",
    "options": [
      "Yes, it does.",
      "Yes, it is will.",
      "Yes, it will be open does.",
      "Yes, it will."
    ],
    "correctIndex": 3,
    "explanation": "A short answer to a question with will repeats will: Yes, it will."
  },
  {
    "id": "a2-future-9",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Use going to: We have decided to save money, so we ___ buy a new car this year.",
    "options": [
      "aren't going to",
      "don't going to",
      "aren't going",
      "not going to"
    ],
    "correctIndex": 0,
    "explanation": "The negative going-to form with we is are not going to + base verb."
  },
  {
    "id": "a2-future-10",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Complete this offer with will: Your bag looks heavy. I ___ carry it for you.",
    "options": [
      "will to",
      "will",
      "am",
      "am will"
    ],
    "correctIndex": 1,
    "explanation": "An offer of help can use will + base verb: I will carry it."
  },
  {
    "id": "a2-future-11",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Use will to give your opinion about the future: I think people ___ use less paper in twenty years.",
    "options": [
      "will to",
      "are",
      "will",
      "would to"
    ],
    "correctIndex": 2,
    "explanation": "Will + base verb can express an opinion or prediction about the future."
  },
  {
    "id": "a2-future-12",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Complete with going to: Where ___ Sam ___ stay during his trip?",
    "options": [
      "does / going to",
      "are / going to",
      "is / go to",
      "is / going to"
    ],
    "correctIndex": 3,
    "explanation": "Sam is singular, so the question is Where is Sam going to stay?"
  },
  {
    "id": "a2-future-13",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Which phrase correctly completes 'She is going to ___ a nurse'?",
    "options": [
      "become",
      "becomes",
      "became",
      "becoming"
    ],
    "correctIndex": 0,
    "explanation": "Going to is followed by the base form of the main verb: become."
  },
  {
    "id": "a2-future-14",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Choose the correct negative sentence with will.",
    "options": [
      "They don't will arrive before six.",
      "They won't arrive before six.",
      "They won't to arrive before six.",
      "They willn't arrive before six."
    ],
    "correctIndex": 1,
    "explanation": "The standard contraction of will not is won't, followed directly by the base verb."
  },
  {
    "id": "a2-future-15",
    "level": "A2",
    "topic": "will-going-to",
    "question": "'Are you going to take the train?' Choose the correct short answer.",
    "options": [
      "Yes, I do.",
      "Yes, I will am.",
      "Yes, I am.",
      "Yes, I going."
    ],
    "correctIndex": 2,
    "explanation": "A going-to question uses be, so its short answer repeats be: Yes, I am."
  },
  {
    "id": "a2-future-16",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Choose the sentence that expresses a plan already decided.",
    "options": [
      "We painted the kitchen last weekend.",
      "We paint kitchens for a living.",
      "We have a blue kitchen.",
      "We are going to paint the kitchen next weekend."
    ],
    "correctIndex": 3,
    "explanation": "Are going to paint states an intention for a future time."
  },
  {
    "id": "a2-future-17",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Use will in the question: When ___ the results arrive?",
    "options": [
      "will",
      "will to",
      "are",
      "does"
    ],
    "correctIndex": 0,
    "explanation": "Will comes before the subject in a future question: When will the results arrive?"
  },
  {
    "id": "a2-future-18",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Complete using going to: Be careful with that full glass! You ___ spill the water.",
    "options": [
      "is going to",
      "are going to",
      "are go to",
      "going to"
    ],
    "correctIndex": 1,
    "explanation": "A prediction based on the immediate situation can use going to. You takes are."
  },
  {
    "id": "a2-future-19",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Which sentence uses the correct word order?",
    "options": [
      "I probably will to be late.",
      "I will be probably to late.",
      "I will probably be late.",
      "I will probably late be to."
    ],
    "correctIndex": 2,
    "explanation": "Probably normally comes between will and the base verb: will probably be."
  },
  {
    "id": "a2-future-20",
    "level": "A2",
    "topic": "will-going-to",
    "question": "Complete the planned question with going to: What ___ we going to eat?",
    "options": [
      "is",
      "do",
      "will",
      "are"
    ],
    "correctIndex": 3,
    "explanation": "The subject we takes are in a going-to question: What are we going to eat?"
  },
  {
    "id": "a2-need-1",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "The school rule says every pupil ___ wear a uniform.",
    "options": [
      "have to",
      "has to",
      "has",
      "having to"
    ],
    "correctIndex": 1,
    "explanation": "Every pupil is singular, so the expression of obligation is has to wear."
  },
  {
    "id": "a2-need-2",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Which sentence correctly expresses a necessary action?",
    "options": [
      "We need charge to the battery.",
      "We needs to charge the battery.",
      "We need to charge the battery.",
      "We need to charging the battery."
    ],
    "correctIndex": 2,
    "explanation": "Need to is followed by the base form: need to charge."
  },
  {
    "id": "a2-need-3",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Tickets are free for children. They ___ pay.",
    "options": [
      "mustn't",
      "has to",
      "don't have",
      "don't have to"
    ],
    "correctIndex": 3,
    "explanation": "Don't have to means there is no obligation. Mustn't would mean paying is forbidden."
  },
  {
    "id": "a2-need-4",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Yesterday, the road was closed and we ___ take another route.",
    "options": [
      "had to",
      "have to",
      "has to",
      "had"
    ],
    "correctIndex": 0,
    "explanation": "The past form of have to is had to, followed by the base verb take."
  },
  {
    "id": "a2-need-5",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Complete the question: ___ you have to work this Saturday?",
    "options": [
      "Are",
      "Do",
      "Have",
      "Does"
    ],
    "correctIndex": 1,
    "explanation": "Present-simple questions with have to use do or does. With you, use do."
  },
  {
    "id": "a2-need-6",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "She has an early appointment. She ___ get up at six.",
    "options": [
      "need to",
      "needs",
      "needs to",
      "is need to"
    ],
    "correctIndex": 2,
    "explanation": "With she, add -s to need: needs to get up."
  },
  {
    "id": "a2-need-7",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "We have plenty of food already. You ___ bring anything.",
    "options": [
      "needn't to",
      "not need to",
      "doesn't need to",
      "don't need to"
    ],
    "correctIndex": 3,
    "explanation": "Don't need to means the action is unnecessary. The form with you is don't need to bring."
  },
  {
    "id": "a2-need-8",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Choose the correct question with need to.",
    "options": [
      "Does he need to book a seat?",
      "Does he needs to book a seat?",
      "Is he need to book a seat?",
      "Do he need to book a seat?"
    ],
    "correctIndex": 0,
    "explanation": "After does, use the base form need, then to book."
  },
  {
    "id": "a2-need-9",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Complete in the negative past: I ___ go to work yesterday because it was a holiday.",
    "options": [
      "didn't had to",
      "didn't have to",
      "don't have to",
      "wasn't have to"
    ],
    "correctIndex": 1,
    "explanation": "Past absence of obligation is expressed with didn't have to. After didn't, use have."
  },
  {
    "id": "a2-need-10",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Which expression means 'it is necessary'?",
    "options": [
      "You don't need to do it.",
      "You don't have to do it.",
      "You need to do it.",
      "You can choose not to do it."
    ],
    "correctIndex": 2,
    "explanation": "Need to expresses necessity. The negative expressions mean the action is optional."
  },
  {
    "id": "a2-need-11",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "The last bus leaves in five minutes. We ___ hurry.",
    "options": [
      "has to",
      "have",
      "are have to",
      "have to"
    ],
    "correctIndex": 3,
    "explanation": "With we, the expression is have to + base verb. The situation makes hurrying necessary."
  },
  {
    "id": "a2-need-12",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "'Does your sister have to bring her passport?' Choose the correct short answer.",
    "options": [
      "Yes, she does.",
      "Yes, she has.",
      "Yes, she is.",
      "Yes, she have."
    ],
    "correctIndex": 0,
    "explanation": "The short answer repeats does from the question: Yes, she does."
  },
  {
    "id": "a2-need-13",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Which sentence correctly uses the third-person form?",
    "options": [
      "The machine need to cool down.",
      "The machine needs to cool down.",
      "The machine needs cool down.",
      "The machine is need to cool down."
    ],
    "correctIndex": 1,
    "explanation": "The machine is singular, so use needs to + base verb."
  },
  {
    "id": "a2-need-14",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "I finished the report early, so I ___ stay late last night.",
    "options": [
      "didn't needed to",
      "don't need to",
      "didn't need to",
      "wasn't need to"
    ],
    "correctIndex": 2,
    "explanation": "For an unnecessary action in the past, use didn't need to. Need stays in its base form after didn't."
  },
  {
    "id": "a2-need-15",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Complete the question about yesterday: Why ___ you have to leave early?",
    "options": [
      "had",
      "were",
      "do",
      "did"
    ],
    "correctIndex": 3,
    "explanation": "A past-simple question with have to uses did + subject + have to."
  },
  {
    "id": "a2-need-16",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Which sentence says that bringing a towel is optional?",
    "options": [
      "You don't have to bring a towel.",
      "You have to bring a towel.",
      "You need to bring a towel.",
      "You must bring a towel."
    ],
    "correctIndex": 0,
    "explanation": "Don't have to expresses no obligation, so bringing a towel is optional."
  },
  {
    "id": "a2-need-17",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "The instructions say that we ___ switch off the power before cleaning the machine.",
    "options": [
      "has to",
      "have to",
      "have",
      "are having"
    ],
    "correctIndex": 1,
    "explanation": "An instruction can express a requirement with have to + base verb."
  },
  {
    "id": "a2-need-18",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Complete the question: What time does the driver ___ leave?",
    "options": [
      "needs to",
      "need",
      "need to",
      "needed to"
    ],
    "correctIndex": 2,
    "explanation": "After does, use the base form need. The full expression is need to leave."
  },
  {
    "id": "a2-need-19",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "'Did you have to queue?' Choose the correct negative short answer.",
    "options": [
      "No, I hadn't.",
      "No, I don't.",
      "No, I wasn't.",
      "No, I didn't."
    ],
    "correctIndex": 3,
    "explanation": "The question uses did, so its short answer uses didn't."
  },
  {
    "id": "a2-need-20",
    "level": "A2",
    "topic": "have-to-need-to",
    "question": "Choose the sentence that correctly talks about a future necessity.",
    "options": [
      "I will have to replace my phone soon.",
      "I will has to replace my phone soon.",
      "I will have replace my phone soon.",
      "I will having to replace my phone soon."
    ],
    "correctIndex": 0,
    "explanation": "After will, use the base form have. Future necessity is expressed with will have to."
  },
  {
    "id": "a2-advice-1",
    "level": "A2",
    "topic": "should-must",
    "question": "Give gentle advice, not a strict order: You ___ take a break if you feel tired.",
    "options": [
      "must to",
      "should to",
      "should",
      "are should"
    ],
    "correctIndex": 2,
    "explanation": "Should + base verb is used to give advice: You should take a break."
  },
  {
    "id": "a2-advice-2",
    "level": "A2",
    "topic": "should-must",
    "question": "The safety sign says: 'You ___ wear a helmet in this area.'",
    "options": [
      "must to",
      "must wearing",
      "are must",
      "must"
    ],
    "correctIndex": 3,
    "explanation": "Must + base verb expresses a strong requirement. Do not add to after must."
  },
  {
    "id": "a2-advice-3",
    "level": "A2",
    "topic": "should-must",
    "question": "The sign says 'No swimming'. You ___ swim here.",
    "options": [
      "mustn't",
      "don't have to",
      "must",
      "should to"
    ],
    "correctIndex": 0,
    "explanation": "Mustn't expresses prohibition. Don't have to means something is optional, not forbidden."
  },
  {
    "id": "a2-advice-4",
    "level": "A2",
    "topic": "should-must",
    "question": "My tooth hurts. Which sentence gives sensible advice?",
    "options": [
      "You should eat more sweets.",
      "You should see a dentist.",
      "You must never clean your teeth.",
      "You should ignore the pain forever."
    ],
    "correctIndex": 1,
    "explanation": "Should see a dentist gives appropriate advice for a painful tooth."
  },
  {
    "id": "a2-advice-5",
    "level": "A2",
    "topic": "should-must",
    "question": "Complete the negative advice: You ___ spend all your money on one game.",
    "options": [
      "don't should",
      "shouldn't to",
      "shouldn't",
      "not should"
    ],
    "correctIndex": 2,
    "explanation": "The negative of should is should not or shouldn't, followed by the base verb."
  },
  {
    "id": "a2-advice-6",
    "level": "A2",
    "topic": "should-must",
    "question": "Which question correctly asks for advice?",
    "options": [
      "Do I should tell the teacher?",
      "Should I to tell the teacher?",
      "Am I should tell the teacher?",
      "Should I tell the teacher?"
    ],
    "correctIndex": 3,
    "explanation": "Put should before the subject when asking for advice. The following verb stays in its base form."
  },
  {
    "id": "a2-advice-7",
    "level": "A2",
    "topic": "should-must",
    "question": "Every passenger ___ show a valid ticket before boarding.",
    "options": [
      "must",
      "musts",
      "must to",
      "must showing"
    ],
    "correctIndex": 0,
    "explanation": "Must has the same form with every subject, including the singular every passenger."
  },
  {
    "id": "a2-advice-8",
    "level": "A2",
    "topic": "should-must",
    "question": "'Should we leave a message?' Choose the correct short answer.",
    "options": [
      "Yes, you do.",
      "Yes, you should.",
      "Yes, you are.",
      "Yes, you should to."
    ],
    "correctIndex": 1,
    "explanation": "A short answer repeats the modal should without adding to or another auxiliary."
  },
  {
    "id": "a2-advice-9",
    "level": "A2",
    "topic": "should-must",
    "question": "Which sentence expresses a rule rather than a suggestion?",
    "options": [
      "Visitors can stay if they want.",
      "Visitors might enjoy the garden.",
      "Visitors must leave by six; it is a hospital rule.",
      "Visitors usually bring flowers."
    ],
    "correctIndex": 2,
    "explanation": "Must expresses the obligation imposed by the hospital rule."
  },
  {
    "id": "a2-advice-10",
    "level": "A2",
    "topic": "should-must",
    "question": "Complete the advice with the correct verb form: You should ___ more water.",
    "options": [
      "drinks",
      "drinking",
      "to drink",
      "drink"
    ],
    "correctIndex": 3,
    "explanation": "A modal such as should is followed by the base form of the verb."
  },
  {
    "id": "a2-advice-11",
    "level": "A2",
    "topic": "should-must",
    "question": "The medicine label says: 'You must not ___ more than two tablets.'",
    "options": [
      "take",
      "takes",
      "taking",
      "to take"
    ],
    "correctIndex": 0,
    "explanation": "Must not is followed by the base verb take. It describes a limit that must be obeyed."
  },
  {
    "id": "a2-advice-12",
    "level": "A2",
    "topic": "should-must",
    "question": "Which sentence is correctly formed?",
    "options": [
      "She shoulds ask for help.",
      "She should ask for help.",
      "She should to ask for help.",
      "She does should ask for help."
    ],
    "correctIndex": 1,
    "explanation": "Should does not take -s with she, and it is followed directly by the base verb ask."
  },
  {
    "id": "a2-advice-13",
    "level": "A2",
    "topic": "should-must",
    "question": "You have an exam tomorrow. Which advice helps you prepare?",
    "options": [
      "You should stay awake all night playing games.",
      "You must forget to set your alarm.",
      "You should get enough sleep tonight.",
      "You should leave your books at school forever."
    ],
    "correctIndex": 2,
    "explanation": "Getting enough sleep is sensible preparation. Should is used to offer this advice."
  },
  {
    "id": "a2-advice-14",
    "level": "A2",
    "topic": "should-must",
    "question": "Which sentence means touching the wire is forbidden?",
    "options": [
      "You don't have to touch the wire.",
      "You may touch the wire.",
      "You should touch the wire.",
      "You mustn't touch the wire."
    ],
    "correctIndex": 3,
    "explanation": "Mustn't means an action is prohibited. Don't have to only means it is unnecessary."
  },
  {
    "id": "a2-advice-15",
    "level": "A2",
    "topic": "should-must",
    "question": "Complete the question asking about a requirement: ___ I sign both pages?",
    "options": [
      "Must",
      "Do must",
      "Am must",
      "Must to"
    ],
    "correctIndex": 0,
    "explanation": "A question with must places must before the subject: Must I sign?"
  },
  {
    "id": "a2-advice-16",
    "level": "A2",
    "topic": "should-must",
    "question": "Choose the correct negative advice about crossing a busy road.",
    "options": [
      "You don't should look at your phone while crossing.",
      "You shouldn't look at your phone while crossing.",
      "You shouldn't to look at your phone while crossing.",
      "You should not looking at your phone while crossing."
    ],
    "correctIndex": 1,
    "explanation": "Shouldn't + base verb gives advice against an action."
  },
  {
    "id": "a2-advice-17",
    "level": "A2",
    "topic": "should-must",
    "question": "Rewrite the rule 'It is necessary to keep this door closed' using must.",
    "options": [
      "You must to keep this door closed.",
      "You must keeping this door closed.",
      "You must keep this door closed.",
      "You musts keep this door closed."
    ],
    "correctIndex": 2,
    "explanation": "Use must + the base verb keep to express the requirement."
  },
  {
    "id": "a2-advice-18",
    "level": "A2",
    "topic": "should-must",
    "question": "Which modal is used to give a recommendation in 'You should try the vegetable soup'?",
    "options": [
      "try",
      "soup",
      "vegetable",
      "should"
    ],
    "correctIndex": 3,
    "explanation": "Should is the modal giving a recommendation. Try is the main verb."
  },
  {
    "id": "a2-advice-19",
    "level": "A2",
    "topic": "should-must",
    "question": "Complete the advice: What ___ we do if we miss the last bus?",
    "options": [
      "should",
      "should to",
      "are should",
      "do should"
    ],
    "correctIndex": 0,
    "explanation": "Ask for advice with question word + should + subject + base verb."
  },
  {
    "id": "a2-advice-20",
    "level": "A2",
    "topic": "should-must",
    "question": "The teacher says silence is required during the test. Which instruction matches this rule?",
    "options": [
      "You must to be quiet during the test.",
      "You must be quiet during the test.",
      "You must are quiet during the test.",
      "You must being quiet during the test."
    ],
    "correctIndex": 1,
    "explanation": "Must is followed by the base form be: must be quiet."
  },
  {
    "id": "a2-poss-1",
    "level": "A2",
    "topic": "may-might",
    "question": "Complete the polite request: ___ I borrow your pen, please?",
    "options": [
      "May to",
      "Do may",
      "Am may",
      "May"
    ],
    "correctIndex": 3,
    "explanation": "May I + base verb is a polite way to ask permission."
  },
  {
    "id": "a2-poss-2",
    "level": "A2",
    "topic": "may-might",
    "question": "I am not sure about the weather. It ___ rain later.",
    "options": [
      "might",
      "might to",
      "might raining",
      "is might"
    ],
    "correctIndex": 0,
    "explanation": "Might + base verb expresses an uncertain possibility."
  },
  {
    "id": "a2-poss-3",
    "level": "A2",
    "topic": "may-might",
    "question": "Choose the correct form: She may ___ late because of the traffic.",
    "options": [
      "arrives",
      "arrive",
      "arriving",
      "to arrive"
    ],
    "correctIndex": 1,
    "explanation": "May is followed by the base form arrive, even with the subject she."
  },
  {
    "id": "a2-poss-4",
    "level": "A2",
    "topic": "may-might",
    "question": "Which sentence expresses a possibility rather than certainty?",
    "options": [
      "We visited the castle yesterday.",
      "We are definitely visiting the castle tomorrow.",
      "We might visit the castle tomorrow, but we haven't decided.",
      "We visit the castle every year."
    ],
    "correctIndex": 2,
    "explanation": "Might visit, together with haven't decided, expresses an uncertain future possibility."
  },
  {
    "id": "a2-poss-5",
    "level": "A2",
    "topic": "may-might",
    "question": "The receptionist gives permission: 'You ___ use the phone in the lobby.'",
    "options": [
      "may to",
      "are may",
      "may using",
      "may"
    ],
    "correctIndex": 3,
    "explanation": "May + base verb can give permission to do something."
  },
  {
    "id": "a2-poss-6",
    "level": "A2",
    "topic": "may-might",
    "question": "Choose the correct negative form of might.",
    "options": [
      "might not",
      "don't might",
      "mightn't to",
      "not might to"
    ],
    "correctIndex": 0,
    "explanation": "The normal negative form is might not, followed by the base verb."
  },
  {
    "id": "a2-poss-7",
    "level": "A2",
    "topic": "may-might",
    "question": "I'm not certain whether the shop is open. It ___ be closed on Sundays.",
    "options": [
      "may to",
      "may",
      "is may",
      "mays"
    ],
    "correctIndex": 1,
    "explanation": "May be expresses a possible situation. May does not take -s or to."
  },
  {
    "id": "a2-poss-8",
    "level": "A2",
    "topic": "may-might",
    "question": "Complete the possibility: The train might ___ delayed.",
    "options": [
      "is",
      "being",
      "be",
      "to be"
    ],
    "correctIndex": 2,
    "explanation": "Might is followed by the base form be: might be delayed."
  },
  {
    "id": "a2-poss-9",
    "level": "A2",
    "topic": "may-might",
    "question": "Which reply gives permission to the question 'May I sit here?'",
    "options": [
      "Yes, you do.",
      "Yes, you are.",
      "Yes, you may to.",
      "Yes, you may."
    ],
    "correctIndex": 3,
    "explanation": "Yes, you may is a formal way to grant permission."
  },
  {
    "id": "a2-poss-10",
    "level": "A2",
    "topic": "may-might",
    "question": "We haven't decided on dinner. We might ___ a pizza.",
    "options": [
      "order",
      "orders",
      "ordering",
      "to order"
    ],
    "correctIndex": 0,
    "explanation": "Use the base form after might: might order. The decision is still uncertain."
  },
  {
    "id": "a2-poss-11",
    "level": "A2",
    "topic": "may-might",
    "question": "Choose the sentence that means 'perhaps she will not come'.",
    "options": [
      "She must not come.",
      "She might not come.",
      "She always comes.",
      "She has already come."
    ],
    "correctIndex": 1,
    "explanation": "Might not come expresses uncertainty about whether she will come. Must not come is a prohibition."
  },
  {
    "id": "a2-poss-12",
    "level": "A2",
    "topic": "may-might",
    "question": "Which sentence correctly uses may with a plural subject?",
    "options": [
      "The guests mays need more chairs.",
      "The guests may to need more chairs.",
      "The guests may need more chairs.",
      "The guests are may need more chairs."
    ],
    "correctIndex": 2,
    "explanation": "May has the same form with all subjects and is followed by the base verb need."
  },
  {
    "id": "a2-poss-13",
    "level": "A2",
    "topic": "may-might",
    "question": "Choose the meaning of 'The keys might be in my coat'.",
    "options": [
      "The keys are definitely in my coat.",
      "The keys cannot be in my coat.",
      "The keys are always in my coat.",
      "Perhaps the keys are in my coat."
    ],
    "correctIndex": 3,
    "explanation": "Might be means perhaps or possibly, rather than certainty."
  },
  {
    "id": "a2-poss-14",
    "level": "A2",
    "topic": "may-might",
    "question": "Use may to ask permission. Which question is correct?",
    "options": [
      "May we take photos here?",
      "May we to take photos here?",
      "Do we may take photos here?",
      "May we taking photos here?"
    ],
    "correctIndex": 0,
    "explanation": "Put may before the subject we and use the base form take."
  },
  {
    "id": "a2-poss-15",
    "level": "A2",
    "topic": "may-might",
    "question": "The road is very busy. There might ___ a traffic jam ahead.",
    "options": [
      "have",
      "be",
      "is",
      "to be"
    ],
    "correctIndex": 1,
    "explanation": "There might be is used to say that something possibly exists."
  },
  {
    "id": "a2-poss-16",
    "level": "A2",
    "topic": "may-might",
    "question": "Choose the correct sentence expressing uncertainty about a meeting.",
    "options": [
      "The meeting may doesn't finish on time.",
      "The meeting not may finish on time.",
      "The meeting may not finish on time.",
      "The meeting may not to finish on time."
    ],
    "correctIndex": 2,
    "explanation": "The negative pattern is may not + base verb: may not finish."
  },
  {
    "id": "a2-poss-17",
    "level": "A2",
    "topic": "may-might",
    "question": "A friend says, 'I might join you later.' Has the friend made a definite promise?",
    "options": [
      "Yes; joining later is certain.",
      "Yes; the friend has already arrived.",
      "No; joining later is forbidden.",
      "No; joining later is only a possibility."
    ],
    "correctIndex": 3,
    "explanation": "Might expresses possibility, so it does not make a definite promise."
  },
  {
    "id": "a2-poss-18",
    "level": "A2",
    "topic": "may-might",
    "question": "Complete with the correct form: He might ___ his mind before Friday.",
    "options": [
      "change",
      "changes",
      "changed",
      "to change"
    ],
    "correctIndex": 0,
    "explanation": "Use the base form change after might. The modal itself does not change with he."
  },
  {
    "id": "a2-poss-19",
    "level": "A2",
    "topic": "may-might",
    "question": "Which sentence uses may to give permission, rather than describe a possibility?",
    "options": [
      "It may snow tonight.",
      "You may leave now; I give you permission.",
      "The parcel may arrive tomorrow.",
      "The café may be closed."
    ],
    "correctIndex": 1,
    "explanation": "The words I give you permission make the permission meaning of may explicit."
  },
  {
    "id": "a2-poss-20",
    "level": "A2",
    "topic": "may-might",
    "question": "Complete the uncertain plan: We might not ___ enough time to see both museums.",
    "options": [
      "has",
      "having",
      "have",
      "to have"
    ],
    "correctIndex": 2,
    "explanation": "After might not, use the base form have. The sentence expresses a possible lack of time."
  },
  {
    "id": "a2-conj-1",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the connector that adds another item: I bought bread ___ cheese.",
    "options": [
      "and",
      "because",
      "so",
      "although"
    ],
    "correctIndex": 0,
    "explanation": "And connects two items in a list: bread and cheese."
  },
  {
    "id": "a2-conj-2",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the connector that shows a contrast: The bag is small, ___ it is surprisingly heavy.",
    "options": [
      "because",
      "but",
      "so",
      "or"
    ],
    "correctIndex": 1,
    "explanation": "But introduces a contrast between being small and being heavy."
  },
  {
    "id": "a2-conj-3",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the connector that introduces the reason: I stayed at home ___ I felt ill.",
    "options": [
      "so",
      "but",
      "because",
      "or"
    ],
    "correctIndex": 2,
    "explanation": "Because introduces the reason for staying at home: feeling ill."
  },
  {
    "id": "a2-conj-4",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the connector that introduces the result: The café was full, ___ we ate somewhere else.",
    "options": [
      "because",
      "but",
      "although",
      "so"
    ],
    "correctIndex": 3,
    "explanation": "So introduces the result of the café being full."
  },
  {
    "id": "a2-conj-5",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Which sentence correctly joins two positive abilities?",
    "options": [
      "She can read and write in English.",
      "She can read because write in English.",
      "She can read so write in English.",
      "She can read but and write in English."
    ],
    "correctIndex": 0,
    "explanation": "And joins the parallel base verbs read and write."
  },
  {
    "id": "a2-conj-6",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "The shoes look nice, ___ they are too small for me. Choose the contrast connector.",
    "options": [
      "because",
      "but",
      "so",
      "when"
    ],
    "correctIndex": 1,
    "explanation": "But introduces a problem that contrasts with the positive appearance of the shoes."
  },
  {
    "id": "a2-conj-7",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "'Why are you carrying an umbrella?' '___ it may rain.'",
    "options": [
      "So",
      "But",
      "Because",
      "And"
    ],
    "correctIndex": 2,
    "explanation": "Because introduces a reason and can begin an answer to a why question."
  },
  {
    "id": "a2-conj-8",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "The lift was broken, ___ we used the stairs. Choose the result connector.",
    "options": [
      "because",
      "but",
      "although",
      "so"
    ],
    "correctIndex": 3,
    "explanation": "Using the stairs was the result of the lift being broken, so use so."
  },
  {
    "id": "a2-conj-9",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Which sentence correctly gives a reason?",
    "options": [
      "We took a taxi because we were late.",
      "We took a taxi because of we were late.",
      "We took a taxi so because we were late.",
      "We took a taxi because were we late."
    ],
    "correctIndex": 0,
    "explanation": "Because is followed by a normal clause with a subject and verb: we were late."
  },
  {
    "id": "a2-conj-10",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the connector that adds a second activity: On Saturdays, I clean the flat ___ do the shopping.",
    "options": [
      "because",
      "and",
      "so",
      "although"
    ],
    "correctIndex": 1,
    "explanation": "And joins the two activities clean the flat and do the shopping."
  },
  {
    "id": "a2-conj-11",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Which sentence correctly shows a contrast?",
    "options": [
      "It was cold, because but we enjoyed the walk.",
      "It was cold, but because we enjoyed the walk.",
      "It was cold, but we enjoyed the walk.",
      "It was cold, but we enjoying the walk."
    ],
    "correctIndex": 2,
    "explanation": "But joins two complete clauses with contrasting ideas."
  },
  {
    "id": "a2-conj-12",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "I couldn't call you ___ my phone battery was flat. Choose the reason connector.",
    "options": [
      "so",
      "but",
      "or",
      "because"
    ],
    "correctIndex": 3,
    "explanation": "A flat battery explains why the speaker could not call, so because introduces the reason."
  },
  {
    "id": "a2-conj-13",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Which word introduces the result in 'I missed the bus, so I walked home'?",
    "options": [
      "so",
      "missed",
      "bus",
      "home"
    ],
    "correctIndex": 0,
    "explanation": "So introduces walking home as the result of missing the bus."
  },
  {
    "id": "a2-conj-14",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the complete sentence with correct connector use.",
    "options": [
      "Because the train was late, so we missed the start.",
      "Because the train was late, we missed the start.",
      "Because the train was late, but so we missed the start.",
      "Because late the train, we missed the start."
    ],
    "correctIndex": 1,
    "explanation": "A because clause already introduces the reason; do not also add so before the main clause in this structure."
  },
  {
    "id": "a2-conj-15",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the contrast connector: I like the city, ___ I prefer living in the countryside.",
    "options": [
      "because",
      "so",
      "but",
      "when"
    ],
    "correctIndex": 2,
    "explanation": "But marks the difference between liking the city and preferring the countryside."
  },
  {
    "id": "a2-conj-16",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the connector that adds a second person: Both my brother ___ my sister play chess.",
    "options": [
      "but",
      "so",
      "because",
      "and"
    ],
    "correctIndex": 3,
    "explanation": "The paired expression is both ... and: both my brother and my sister."
  },
  {
    "id": "a2-conj-17",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "'I wore a coat because it was snowing.' What was the reason?",
    "options": [
      "It was snowing.",
      "I wore a coat.",
      "I bought a coat.",
      "It stopped snowing."
    ],
    "correctIndex": 0,
    "explanation": "The clause after because gives the reason: it was snowing."
  },
  {
    "id": "a2-conj-18",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "We had no milk, ___ I went to the shop. Choose the connector meaning 'as a result'.",
    "options": [
      "because",
      "so",
      "but",
      "although"
    ],
    "correctIndex": 1,
    "explanation": "So means as a result here: the lack of milk caused the trip to the shop."
  },
  {
    "id": "a2-conj-19",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Choose the sentence that correctly joins two objects in a shopping list.",
    "options": [
      "We need apples because bananas.",
      "We need apples so bananas.",
      "We need apples and bananas.",
      "We need apples but and bananas."
    ],
    "correctIndex": 2,
    "explanation": "And connects the two nouns apples and bananas in a list."
  },
  {
    "id": "a2-conj-20",
    "level": "A2",
    "topic": "basic-conjunctions",
    "question": "Which sentence keeps the meaning of 'It rained. As a result, the match was cancelled'?",
    "options": [
      "It rained because the match was cancelled.",
      "It rained, but the match was not cancelled.",
      "It rained and the match was never cancelled.",
      "It rained, so the match was cancelled."
    ],
    "correctIndex": 3,
    "explanation": "So preserves the cause-and-result relationship: rain caused the cancellation."
  },

];
