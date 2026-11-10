import type { PracticePassage, PracticeQuestion, PracticeTest } from './types';

type Gap = Pick<PracticeQuestion, 'options' | 'correctIndex' | 'explanation'>;

function clozeQuestions(test: number, offset: number, passage: PracticePassage, gaps: readonly Gap[]): PracticeQuestion[] {
  return gaps.map((gap, index) => ({
    id: `cambridge-${String(test).padStart(2, '0')}-${String(offset + index + 1).padStart(2, '0')}`,
    passageId: passage.id,
    prompt: `Choose the best word or phrase for gap (${index + 1}) in "${passage.title}".`,
    ...gap,
  }));
}

const garden: PracticePassage = {
  id: 'cambridge-b2-1-garden',
  title: 'A garden between the buildings',
  text: `When an unused car park became available, several neighbours decided to take (1) ____ in a project to turn it into a garden. Nobody had much experience, but a retired gardener came (2) ____ with a plan that beginners could follow. The volunteers (3) ____ money by selling homemade lunches, then bought tools that everyone could share.

Before planting anything, they paid close (4) ____ to how sunlight moved across the space. This helped them choose suitable places for vegetables and flowers. In (5) ____ of a wet spring, most of the young plants survived. The main difficulty came in July, when the water tank ran (6) ____ of water during a particularly dry week. A nearby café let the group fill their containers at its outdoor tap.

By autumn, the garden had begun to make a real (7) ____ to the neighbourhood. People who had previously passed one another without speaking now exchanged advice and recipes. Everyone felt (8) ____ of what they had achieved together, even though the tomatoes were smaller than those in the shops.`,
};

const repair: PracticePassage = {
  id: 'cambridge-b2-1-repair',
  title: 'Learning to repair together',
  text: `For years, residents of a small town threw away household objects as soon as they stopped working. A group of volunteers thought it would make (1) ____ to offer a different option. Their first repair café took (2) ____ in the public library on a Saturday morning. Visitors brought lamps, toys and bicycles, while the volunteers supplied tools and patient explanations.

The organisers asked people not to give (3) ____ on a broken object before discovering what was wrong with it. Instead (4) ____ replacing a whole appliance, it might be possible to change one inexpensive part. Small boxes helped everyone keep (5) ____ of screws during repairs. Experienced volunteers would point (6) ____ common faults and show beginners how to recognise them safely.

One visitor worried that someone had damaged her radio on (7) ____. She was relieved to learn that she had simply misunderstood its controls. The organisers hoped that the whole community would benefit (8) ____ the sessions. Saving money was useful, but learning from one another was just as important to them.`,
};

const railway: PracticePassage = {
  id: 'cambridge-b2-2-railway',
  title: 'A holiday by train',
  text: `We set (1) ____ on our journey before dawn, leaving the car at home for the first time on a family holiday. We had booked our seats in (2) ____, so there was no need to rush when the train arrived. The children watched the landscape change while we shared a breakfast we had packed the previous evening.

At the next station, a delay gave us an unexpected hour to explore. We made the (3) ____ of the extra time by visiting a small market beside the entrance. Unfortunately, the following service was also late, and we missed our (4) ____ to the coast. The member of staff in (5) ____ of platform announcements explained the alternatives clearly. She apologised (6) ____ the inconvenience and helped us find another route.

On (7) ____ of the railway company, she offered us refreshments while we waited. We reached our destination later than planned, but nobody felt that the day had been wasted. In fact, the friendly help and changing scenery made us look (8) ____ to travelling by train again.`,
};

const photography: PracticePassage = {
  id: 'cambridge-b2-2-photography',
  title: 'Looking more carefully',
  text: `While clearing a cupboard, I came (1) ____ a box of photographs that my grandmother had taken. Some pictures were blurred because the camera had been out of (2) ____, yet they still captured details of everyday life beautifully. By (3) ____, a local library was advertising a photography course that same week, and I decided to join.

Our tutor encouraged us to put her advice into (4) ____ immediately rather than buy expensive equipment. During our first walk, a reflection in a puddle caught my (5) ____. I had passed that street hundreds of times without noticing how the coloured buildings appeared in the water. I realised how often we take familiar places for (6) ____.

Over the next month, I made steady (7) ____ by practising a little each day. My aim was not to win a competition but to record things that mattered to me. The project had been (8) ____: it had taught me to notice light, texture and small changes in places I thought I knew completely.`,
};

const science: PracticePassage = {
  id: 'cambridge-c1-1-science',
  title: 'When volunteers collect the evidence',
  text: `On the (1) ____ of it, asking volunteers to count birds seems a straightforward way to gather scientific information. Yet the reliability of such records is sometimes called into (2) ____, particularly when observers have received different amounts of training. A research team therefore placed its methods under close (3) ____ before using thousands of public reports to describe changes in local bird populations.

The team's initial confidence was borne (4) ____ by a comparison with professional surveys. Most volunteers identified common species accurately, although rare birds caused more confusion. The researchers also had to account (5) ____ differences in the time that people spent outdoors. A place with many reports was not necessarily a place with more birds.

Some early conclusions were at (6) ____ with observations from neighbouring areas. Rather than jump (7) ____ conclusions, the team collected another season of evidence. In the long (8) ____, its cautious approach made the project more useful: volunteers understood the limits of their observations, and scientists gained information they could not have gathered alone.`,
};

const cinema: PracticePassage = {
  id: 'cambridge-c1-1-cinema',
  title: 'A cinema with a second life',
  text: `Restoring a neglected cinema was by no (1) ____ a simple task. The first survey brought (2) ____ light problems that the campaigners had not anticipated, including damaged wiring and a roof that needed urgent attention. They wanted the repairs to be in keeping (3) ____ the original design, but old photographs offered only incomplete evidence of how the building had once looked.

After years of fundraising, their plans finally came to (4) ____. The doors reopened for a programme of films and community events. However, a proposal to remove all wheelchair spaces was out of (5) ____ with the group's commitment to access, and members rejected it immediately. The initial income also fell (6) ____ of expectations, forcing the team to reconsider its ticket prices and opening hours.

A local business offered further support on (7) ____ that affordable screenings continued. The campaigners accepted, but refused to turn a blind (8) ____ to unresolved safety concerns. They regarded reopening as the beginning of a responsibility, rather than the end of a successful campaign.`,
};

const focus: PracticePassage = {
  id: 'cambridge-c1-2-focus',
  title: 'Making room for concentrated work',
  text: `A useful rule of (1) ____ is that important decisions deserve uninterrupted attention. Yet a research project on office routines shed (2) ____ on how rarely such conditions occur. Staff who wanted to be helpful were (3) ____ interrupting colleagues whenever they sent immediate notifications; causing a distraction was never their intention.

The researchers did not recommend removing every form of quick communication. Their proposals took differences between jobs into (4) ____, recognising that an emergency team and a group preparing a long report have different needs. On (5) ____, after weighing the advantages and drawbacks, they supported agreed periods without routine alerts rather than a complete ban on messages.

Managers and employees eventually reached a (6) ____ on a trial arrangement. Urgent calls would still get through, while ordinary questions could wait until an agreed break. This was a (7) ____ cry from the old assumption that every message required an immediate reply. The trial set a (8) ____ for later decisions: staff would examine evidence and discuss trade-offs before adopting another popular workplace trend.`,
};

const archive: PracticePassage = {
  id: 'cambridge-c1-2-archive',
  title: 'The stories an archive cannot settle',
  text: `An exhibition of old letters invited visitors to piece (1) ____ the history of a coastal community. Its curator warned that personal memories should not always be taken at face (2) ____. A confident account might still contain errors, especially when the writer was describing events many decades later.

Several letters called (3) ____ mind familiar stories about a disastrous storm, but they disagreed about who had organised the rescue. Instead of hiding these conflicts, the curator chose to (4) ____ them openly and explain why certainty was impossible. An argument about the colour of a rescuer's coat proved to be a red (5) ____; the irrelevant detail distracted readers from the evidence about the rescue itself.

Some documents remained open to (6) ____, even after careful comparison with newspapers and official reports. The exhibition could set the record (7) ____ on dates, but not on every person's motives. Visitors were encouraged to take sweeping claims with a grain of (8) ____ while still valuing the human experiences preserved in the letters.`,
};

export const cambridgeUseOfEnglishTests: readonly PracticeTest[] = [
  {
    slug: 'b2-first-cloze-1', category: 'cambridge-use-of-english', level: 'B2',
    title: 'B2 First (FCE) Use of English Part 1: Practice Test 1',
    description: 'Practise B2 First Use of English Part 1 with two original eight-gap texts. Answer 16 multiple-choice cloze questions and review clear explanations.',
    duration: 20,
    learningGoals: ['Recognise everyday collocations in connected texts', 'Choose particles and prepositions in common phrases', 'Use the whole passage to confirm a word choice'],
    guide: [
      { heading: 'Read the complete phrase', body: 'Part 1 practice asks you to recognise words that belong together. Read several words before and after a gap, rather than translating each option separately.', example: 'We paid attention to the instructions. The phrase is pay attention to something.' },
      { heading: 'Check phrasal verbs in context', body: 'A small particle can change the meaning of a verb. Decide what is happening in the story, then check whether the complete verb phrase expresses that meaning.', example: 'They gave up on the idea means they stopped trying to make it work.' },
      { heading: 'Use two short sets for practice', body: 'This exercise contains two original texts with eight gaps each, following the multiple-choice format of Part 1. The suggested 20 minutes is a practice allowance, not an official time limit for that exam part.', example: 'Read the first text for its main idea, answer its eight gaps, then reread the completed text.' },
    ],
    passages: [garden, repair],
    questions: [
      ...clozeQuestions(1, 0, garden, [
        { options: ['place', 'part', 'action', 'control'], correctIndex: 1, explanation: 'Take part in means participate in an activity. The neighbours are joining the garden project, so part completes this fixed phrase.' },
        { options: ['out', 'in', 'off', 'up'], correctIndex: 3, explanation: 'Come up with a plan means think of or suggest one. The gardener supplies an idea that beginners can follow.' },
        { options: ['raised', 'rose', 'lifted', 'grew'], correctIndex: 0, explanation: 'Raise money means collect funds for a purpose. Selling lunches provides the funds for tools; rise does not take money as its object.' },
        { options: ['concern', 'awareness', 'attention', 'care'], correctIndex: 2, explanation: 'Pay close attention to means observe something carefully. The volunteers study the sunlight before deciding where to plant.' },
        { options: ['terms', 'spite', 'order', 'place'], correctIndex: 1, explanation: 'In spite of introduces a contrast with a difficulty. The plants survived although the spring was wet.' },
        { options: ['up', 'over', 'off', 'out'], correctIndex: 3, explanation: 'Run out of something means have none left. The empty tank explains why the group needed another source of water.' },
        { options: ['difference', 'gap', 'choice', 'distinction'], correctIndex: 0, explanation: 'Make a difference to means have an effect on something. The garden improves relationships in the neighbourhood.' },
        { options: ['pleased', 'delighted', 'proud', 'happy'], correctIndex: 2, explanation: 'Proud is followed by of when someone feels satisfaction about an achievement. The neighbours value what they accomplished together.' },
      ]),
      ...clozeQuestions(1, 8, repair, [
        { options: ['meaning', 'reason', 'sense', 'thought'], correctIndex: 2, explanation: 'Make sense means be sensible or reasonable. The volunteers believe that repairing objects is a sensible alternative to throwing them away.' },
        { options: ['place', 'part', 'position', 'location'], correctIndex: 0, explanation: 'Take place means happen. The sentence tells us where and when the first repair café happened.' },
        { options: ['out', 'away', 'off', 'up'], correctIndex: 3, explanation: 'Give up on means stop believing that something can succeed or be saved. Visitors are encouraged to investigate before abandoning an object.' },
        { options: ['for', 'of', 'from', 'with'], correctIndex: 1, explanation: 'Instead of is followed by a noun or an -ing form. Here, changing one part is offered as an alternative to replacing the appliance.' },
        { options: ['road', 'route', 'track', 'way'], correctIndex: 2, explanation: 'Keep track of means continue to know where things are or what is happening. The boxes prevent small screws from getting lost.' },
        { options: ['out', 'across', 'off', 'over'], correctIndex: 0, explanation: 'Point out means draw attention to or explain something. Volunteers identify faults so beginners can recognise them.' },
        { options: ['luck', 'event', 'chance', 'purpose'], correctIndex: 3, explanation: 'On purpose means deliberately. The visitor is relieved to discover a misunderstanding rather than damage that someone had caused intentionally.' },
        { options: ['of', 'from', 'with', 'at'], correctIndex: 1, explanation: 'Benefit from means gain something useful from an activity or situation. Both practical savings and shared learning help the community.' },
      ]),
    ],
  },
  {
    slug: 'b2-first-cloze-2', category: 'cambridge-use-of-english', level: 'B2',
    title: 'B2 First (FCE) Use of English Part 1: Practice Test 2',
    description: 'Try 16 B2 First multiple-choice cloze questions about travel and photography. Practise collocations and fixed phrases with answers and explanations.',
    duration: 20,
    learningGoals: ['Identify travel and learning collocations', 'Recognise fixed expressions and their prepositions', 'Check meaning across a complete sentence and paragraph'],
    guide: [
      { heading: 'Look for the words around the gap', body: 'The preposition or object after a gap often gives the strongest clue. A word may make sense on its own but fail to form a natural expression with its neighbours.', example: 'We look forward to the trip. Forward belongs with look and to in this expression.' },
      { heading: 'Distinguish a literal meaning from an expression', body: 'Some phrases cannot be understood by translating the individual words. In context, notice whether the writer describes a physical action or uses a familiar expression.', example: 'Make the most of an opportunity means use it as well as possible.' },
      { heading: 'Read the completed story again', body: 'Each text has eight gaps, but its message is continuous. After selecting your answers, reread the complete passage to check whether the events and the writer’s attitude still make sense.', example: 'A delayed journey can still be enjoyable if the paragraph describes helpful people and interesting experiences.' },
    ],
    passages: [railway, photography],
    questions: [
      ...clozeQuestions(2, 0, railway, [
        { options: ['up', 'about', 'aside', 'off'], correctIndex: 3, explanation: 'Set off on a journey means begin travelling. Leaving before dawn establishes the moment when the family started its trip.' },
        { options: ['advance', 'detail', 'demand', 'charge'], correctIndex: 0, explanation: 'In advance means before an event. The family booked earlier, which is why there was no rush to find seats.' },
        { options: ['majority', 'largest', 'most', 'greatest'], correctIndex: 2, explanation: 'Make the most of means use an opportunity as well as possible. The family uses its unexpected waiting time to visit the market.' },
        { options: ['association', 'connection', 'relationship', 'attachment'], correctIndex: 1, explanation: 'A connection is a later train or other service taken as part of a journey. The late arrival causes the family to miss that service.' },
        { options: ['duty', 'power', 'rule', 'charge'], correctIndex: 3, explanation: 'In charge of means responsible for something. This staff member is responsible for the platform announcements.' },
        { options: ['for', 'on', 'from', 'by'], correctIndex: 0, explanation: 'Apologise for introduces the action or situation someone is sorry about. Here, the apology concerns the inconvenience caused by the delay.' },
        { options: ['sake', 'favour', 'behalf', 'name'], correctIndex: 2, explanation: 'On behalf of means representing someone or an organisation. The employee offers refreshments as a representative of the railway company.' },
        { options: ['out', 'forward', 'beyond', 'further'], correctIndex: 1, explanation: 'Look forward to means feel pleased about something that will happen. It is followed here by the -ing form travelling.' },
      ]),
      ...clozeQuestions(2, 8, photography, [
        { options: ['about', 'across', 'out', 'round'], correctIndex: 1, explanation: 'Come across means find something unexpectedly. Discovering the photographs while clearing a cupboard provides that chance-finding context.' },
        { options: ['view', 'sight', 'reach', 'focus'], correctIndex: 3, explanation: 'Out of focus describes an image that is not sharp. The passage explicitly says that some of the photographs were blurred.' },
        { options: ['chance', 'fortune', 'surprise', 'opportunity'], correctIndex: 0, explanation: 'By chance means coincidentally or without planning. The course happened to be advertised in the same week as the discovery.' },
        { options: ['exercise', 'rehearsal', 'practice', 'training'], correctIndex: 2, explanation: 'Put advice into practice means use that advice in a real situation. The tutor wants learners to begin taking photographs immediately.' },
        { options: ['look', 'eye', 'view', 'gaze'], correctIndex: 1, explanation: 'Catch someone’s eye means attract their attention. The reflection makes the writer notice something previously overlooked.' },
        { options: ['agreed', 'accepted', 'given', 'granted'], correctIndex: 3, explanation: 'Take something for granted means fail to appreciate it because it seems familiar or always available. The writer had overlooked the interest of ordinary streets.' },
        { options: ['progress', 'process', 'procedure', 'prospect'], correctIndex: 0, explanation: 'Make progress means improve or move forward. Daily practice gradually improves the writer’s photography.' },
        { options: ['pointless', 'unrewarding', 'worthwhile', 'worthless'], correctIndex: 2, explanation: 'Worthwhile means worth the time or effort spent. The positive account of new observation skills explains why the project was valuable rather than pointless or unrewarding.' },
      ]),
    ],
  },
  {
    slug: 'c1-advanced-cloze-1', category: 'cambridge-use-of-english', level: 'C1',
    title: 'C1 Advanced (CAE) Use of English Part 1: Practice Test 1',
    description: 'Practise C1 Advanced Part 1 with 16 cloze questions in original texts about research and restoration. Check advanced phrases with explained answers.',
    duration: 20,
    learningGoals: ['Interpret formal collocations in extended texts', 'Recognise idiomatic expressions and dependent prepositions', 'Use argument and contrast to test the meaning of a choice'],
    guide: [
      { heading: 'Read for the strength of a claim', body: 'Advanced texts often qualify an argument rather than simply report facts. Notice whether evidence supports, challenges or limits a claim before choosing the expression that describes it.', example: 'A claim borne out by the data is supported by the data; a claim called into question is challenged.' },
      { heading: 'Learn complete expressions', body: 'Record a phrase with its usual preposition and grammatical pattern. A familiar verb may use a different particle when it expresses an abstract idea.', example: 'Account for a difference means explain it. Be at odds with a finding means be inconsistent with it.' },
      { heading: 'Separate format practice from a full exam', body: 'These two original texts each contain eight multiple-choice gaps, matching the task structure of Part 1. They practise language use only; the score is not a Cambridge English Scale score or a complete exam result.', example: 'After answering, explain why the selected phrase fits both the grammar and the argument of the paragraph.' },
    ],
    passages: [science, cinema],
    questions: [
      ...clozeQuestions(3, 0, science, [
        { options: ['edge', 'front', 'face', 'top'], correctIndex: 2, explanation: 'On the face of it means judging by first appearances. The later discussion shows that collecting reliable observations is more complex than it initially seems.' },
        { options: ['question', 'query', 'enquiry', 'request'], correctIndex: 0, explanation: 'Call something into question means raise doubts about its validity. Differences in observer training lead people to question the records’ reliability.' },
        { options: ['scanning', 'sight', 'survey', 'scrutiny'], correctIndex: 3, explanation: 'Under close scrutiny means being examined very carefully. The team checks its methods before using the reports to make scientific claims.' },
        { options: ['up', 'out', 'off', 'away'], correctIndex: 1, explanation: 'Bear out means confirm or support a claim. The professional surveys provide evidence that supports the team’s initial confidence.' },
        { options: ['to', 'from', 'for', 'with'], correctIndex: 2, explanation: 'Account for means explain or allow for a factor. Different amounts of observation time must be considered before comparing report totals.' },
        { options: ['odds', 'ends', 'limits', 'risks'], correctIndex: 0, explanation: 'At odds with means conflicting with or inconsistent with something. The first conclusions do not agree with observations from nearby areas.' },
        { options: ['at', 'with', 'on', 'to'], correctIndex: 3, explanation: 'Jump to conclusions means decide too quickly without sufficient evidence. The team avoids this by collecting another season of records.' },
        { options: ['race', 'run', 'route', 'track'], correctIndex: 1, explanation: 'In the long run means over a long period or when the eventual effects are considered. Careful methods make the project more useful over time.' },
      ]),
      ...clozeQuestions(3, 8, cinema, [
        { options: ['means', 'methods', 'ways', 'manners'], correctIndex: 0, explanation: 'By no means means certainly not. The unexpected structural problems explain why restoring the cinema was not a simple task.' },
        { options: ['at', 'of', 'to', 'for'], correctIndex: 2, explanation: 'Bring something to light means reveal previously unknown information. The survey reveals wiring and roof problems.' },
        { options: ['to', 'of', 'on', 'with'], correctIndex: 3, explanation: 'In keeping with means consistent with or suitable for something. The repair work should respect the cinema’s original design.' },
        { options: ['fruitfulness', 'fruition', 'fruits', 'fruit'], correctIndex: 1, explanation: 'Come to fruition means become successfully realised. The reopening shows that the campaigners’ plans have finally become a reality.' },
        { options: ['step', 'stride', 'walk', 'march'], correctIndex: 0, explanation: 'Out of step with means not consistent with an approach or principle. Removing wheelchair spaces conflicts with the stated commitment to access.' },
        { options: ['low', 'less', 'short', 'small'], correctIndex: 2, explanation: 'Fall short of expectations means achieve less than was hoped. The cinema earns less income than the team had expected.' },
        { options: ['position', 'term', 'demand', 'condition'], correctIndex: 3, explanation: 'On condition that means provided that a requirement is met. Continued affordable screenings are the requirement attached to the support.' },
        { options: ['ear', 'eye', 'sight', 'look'], correctIndex: 1, explanation: 'Turn a blind eye to means deliberately ignore something. The team refuses to ignore safety problems simply because the cinema has reopened.' },
      ]),
    ],
  },
  {
    slug: 'c1-advanced-cloze-2', category: 'cambridge-use-of-english', level: 'C1',
    title: 'C1 Advanced (CAE) Use of English Part 1: Practice Test 2',
    description: 'Try 16 C1 Advanced multiple-choice cloze questions on work and historical evidence. Learn precise vocabulary, collocations and idioms with explanations.',
    duration: 20,
    learningGoals: ['Choose precise vocabulary for intention and evidence', 'Recognise idioms in formal discussion', 'Connect local word choices with the writer’s overall argument'],
    guide: [
      { heading: 'Check intention and consequence', body: 'Advanced vocabulary can distinguish what somebody meant to do from what actually happened. Read the next clause for evidence of intention before selecting an adverb.', example: 'An action done inadvertently is unintentional, even when its consequences are significant.' },
      { heading: 'Notice how an argument develops', body: 'Writers introduce examples, weigh competing claims and qualify conclusions. A phrase expressing balance or caution should fit that movement of ideas, not just the words immediately beside it.', example: 'On balance introduces a judgement made after considering advantages and disadvantages.' },
      { heading: 'Review the whole expression', body: 'After completing each eight-gap text, record the complete phrases you missed and use them in your own sentences. The suggested timer is for this practice exercise, not an official allowance for Part 1.', example: 'Take a claim with a grain of salt means treat it with some doubt rather than accept it completely.' },
    ],
    passages: [focus, archive],
    questions: [
      ...clozeQuestions(4, 0, focus, [
        { options: ['finger', 'thumb', 'hand', 'palm'], correctIndex: 1, explanation: 'A rule of thumb is a useful practical guideline rather than an exact rule. The sentence introduces a general principle about attention.' },
        { options: ['brightness', 'glow', 'shine', 'light'], correctIndex: 3, explanation: 'Shed light on means make something clearer or better understood. The research reveals how seldom uninterrupted work occurs.' },
        { options: ['inadvertently', 'deliberately', 'meticulously', 'assertively'], correctIndex: 0, explanation: 'Inadvertently means unintentionally. The text explicitly says that staff did not intend to cause a distraction.' },
        { options: ['notice', 'record', 'account', 'thought'], correctIndex: 2, explanation: 'Take something into account means consider it when making a judgement. The proposals recognise that different jobs need different communication arrangements.' },
        { options: ['weighing', 'balance', 'measure', 'scale'], correctIndex: 1, explanation: 'On balance introduces a judgement after weighing competing considerations. The text immediately mentions advantages and drawbacks.' },
        { options: ['consent', 'permission', 'approval', 'consensus'], correctIndex: 3, explanation: 'Reach a consensus means arrive at a shared agreement. Managers and employees agree on the arrangement they will try.' },
        { options: ['far', 'long', 'distant', 'remote'], correctIndex: 0, explanation: 'A far cry from means very different from something. Agreed quiet periods differ greatly from the previous expectation of instant replies.' },
        { options: ['president', 'precedence', 'precedent', 'predecessor'], correctIndex: 2, explanation: 'Set a precedent means establish an example that guides future actions. The trial creates a model for making later workplace decisions.' },
      ]),
      ...clozeQuestions(4, 8, archive, [
        { options: ['apart', 'away', 'together', 'off'], correctIndex: 2, explanation: 'Piece together means reconstruct something from separate pieces of information. Visitors use different letters to reconstruct the community’s history.' },
        { options: ['value', 'price', 'cost', 'worth'], correctIndex: 0, explanation: 'Take something at face value means accept it as it appears without questioning it. The curator warns that confident memories can still contain mistakes.' },
        { options: ['into', 'from', 'with', 'to'], correctIndex: 3, explanation: 'Call to mind means cause someone to remember or think of something. The letters remind readers of familiar stories about the storm.' },
        { options: ['suppress', 'acknowledge', 'distort', 'fabricate'], correctIndex: 1, explanation: 'Acknowledge means recognise or admit that something exists. The curator openly recognises the conflicts instead of hiding, altering or inventing them.' },
        { options: ['trout', 'salmon', 'herring', 'tuna'], correctIndex: 2, explanation: 'A red herring is an irrelevant detail that distracts attention from the main issue. The coat’s colour distracts readers from evidence about the rescue.' },
        { options: ['interpretation', 'interruption', 'intervention', 'interception'], correctIndex: 0, explanation: 'Open to interpretation means capable of being understood in more than one way. Comparison with other records has not removed all uncertainty about the documents.' },
        { options: ['direct', 'level', 'plain', 'straight'], correctIndex: 3, explanation: 'Set the record straight means correct inaccurate information. The exhibition can establish the correct dates, although motives remain uncertain.' },
        { options: ['pepper', 'salt', 'sugar', 'sand'], correctIndex: 1, explanation: 'Take something with a grain of salt means consider it with some scepticism. Visitors should not accept sweeping claims without questioning their support.' },
      ]),
    ],
  },
];
