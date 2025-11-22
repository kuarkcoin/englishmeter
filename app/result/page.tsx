import Link from 'next/link'

// ---------------------------------------------------------
// TÜM SORULAR (HARDCODED)
// Veritabanı yerine soruları buraya statik olarak ekledik.
// ---------------------------------------------------------
const ALL_QUESTIONS = [
  {
    id: '1',
    prompt: "Only after the final variables had been recalibrated ____ a pattern begin to emerge.",
    choices: [
      { id: 'a', text: "did", isCorrect: true },
      { id: 'b', text: "had", isCorrect: false },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "would", isCorrect: false }
    ]
  },
  {
    id: '2',
    prompt: "Hardly ____ revising the report when the board demanded another rewrite.",
    choices: [
      { id: 'a', text: "had she finished", isCorrect: true },
      { id: 'b', text: "she finished", isCorrect: false },
      { id: 'c', text: "she had been finishing", isCorrect: false },
      { id: 'd', text: "she has finished", isCorrect: false }
    ]
  },
  {
    id: '3',
    prompt: "No sooner ____ the new policy announced than tensions rose.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '4',
    prompt: "Under no circumstances ____ the encrypted file shared outside the department.",
    choices: [
      { id: 'a', text: "will be", isCorrect: false },
      { id: 'b', text: "should be", isCorrect: false },
      { id: 'c', text: "must be", isCorrect: true },
      { id: 'd', text: "should", isCorrect: false }
    ]
  },
  {
    id: '5',
    prompt: "Were he to have acknowledged the discrepancy earlier, the fallout ____ less damaging.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '6',
    prompt: "Scarcely ____ to question the premise when counterarguments appeared.",
    choices: [
      { id: 'a', text: "had they begun", isCorrect: true },
      { id: 'b', text: "they began", isCorrect: false },
      { id: 'c', text: "were they beginning", isCorrect: false },
      { id: 'd', text: "they had begun", isCorrect: false }
    ]
  },
  {
    id: '7',
    prompt: "Only by cross-verifying external datasets ____ the anomaly explained.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "could", isCorrect: true },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "had been", isCorrect: false }
    ]
  },
  {
    id: '8',
    prompt: "Should the negotiations ____ unexpectedly, alternative strategies must be deployed.",
    choices: [
      { id: 'a', text: "collapse", isCorrect: true },
      { id: 'b', text: "collapsed", isCorrect: false },
      { id: 'c', text: "be collapsing", isCorrect: false },
      { id: 'd', text: "have collapsed", isCorrect: false }
    ]
  },
  {
    id: '9',
    prompt: "Had the committee acted sooner, the crisis ____ entirely.",
    choices: [
      { id: 'a', text: "would avoid", isCorrect: false },
      { id: 'b', text: "would have been avoided", isCorrect: true },
      { id: 'c', text: "was avoided", isCorrect: false },
      { id: 'd', text: "would be avoided", isCorrect: false }
    ]
  },
  {
    id: '10',
    prompt: "Not until the results were reanalyzed ____ how flawed the assumptions were.",
    choices: [
      { id: 'a', text: "the team realized", isCorrect: false },
      { id: 'b', text: "did the team realize", isCorrect: true },
      { id: 'c', text: "had the team realized", isCorrect: false },
      { id: 'd', text: "was the team realizing", isCorrect: false }
    ]
  },
  {
    id: '11',
    prompt: "Rarely ____ a correlation as complex as the one identified.",
    choices: [
      { id: 'a', text: "has there appeared", isCorrect: true },
      { id: 'b', text: "does appear", isCorrect: false },
      { id: 'c', text: "is appearing", isCorrect: false },
      { id: 'd', text: "appeared", isCorrect: false }
    ]
  },
  {
    id: '12',
    prompt: "Only when combined with qualitative evidence ____ the findings gain significance.",
    choices: [
      { id: 'a', text: "the findings gain", isCorrect: false },
      { id: 'b', text: "do the findings gain", isCorrect: true },
      { id: 'c', text: "the findings gained", isCorrect: false },
      { id: 'd', text: "gained the findings", isCorrect: false }
    ]
  },
  {
    id: '13',
    prompt: "Had it not been for her intervention, the project ____ indefinitely.",
    choices: [
      { id: 'a', text: "might stall", isCorrect: false },
      { id: 'b', text: "might have stalled", isCorrect: true },
      { id: 'c', text: "might be stalled", isCorrect: false },
      { id: 'd', text: "should have stalled", isCorrect: false }
    ]
  },
  {
    id: '14',
    prompt: "Little ____ that his statement would be cited for years.",
    choices: [
      { id: 'a', text: "he expected", isCorrect: false },
      { id: 'b', text: "did he expect", isCorrect: true },
      { id: 'c', text: "he had expected", isCorrect: false },
      { id: 'd', text: "was he expecting", isCorrect: false }
    ]
  },
  {
    id: '15',
    prompt: "At no point ____ the research team aware of the hidden variables.",
    choices: [
      { id: 'a', text: "was", isCorrect: true },
      { id: 'b', text: "were", isCorrect: false },
      { id: 'c', text: "had been", isCorrect: false },
      { id: 'd', text: "are", isCorrect: false }
    ]
  },
  {
    id: '16',
    prompt: "Hardly ____ the conference ended when participants began debating online.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '17',
    prompt: "Were the experiment to have been replicated, the results ____ more credible.",
    choices: [
      { id: 'a', text: "would become", isCorrect: false },
      { id: 'b', text: "would have become", isCorrect: true },
      { id: 'c', text: "will become", isCorrect: false },
      { id: 'd', text: "become", isCorrect: false }
    ]
  },
  {
    id: '18',
    prompt: "Not only ____ the hypothesis flawed, but it also contradicted earlier data.",
    choices: [
      { id: 'a', text: "was", isCorrect: true },
      { id: 'b', text: "were", isCorrect: false },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "had been", isCorrect: false }
    ]
  },
  {
    id: '19',
    prompt: "Only with a more rigorous sampling method ____ statistically valid conclusions.",
    choices: [
      { id: 'a', text: "can we draw", isCorrect: true },
      { id: 'b', text: "we can draw", isCorrect: false },
      { id: 'c', text: "we draw", isCorrect: false },
      { id: 'd', text: "we can have drawn", isCorrect: false }
    ]
  },
  {
    id: '20',
    prompt: "Were she not so meticulous, the inconsistencies ____ unnoticed.",
    choices: [
      { id: 'a', text: "might go", isCorrect: false },
      { id: 'b', text: "might have gone", isCorrect: true },
      { id: 'c', text: "would go", isCorrect: false },
      { id: 'd', text: "will go", isCorrect: false }
    ]
  },
  {
    id: '21',
    prompt: "No sooner ____ the findings published than peers demanded replication.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "have", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '22',
    prompt: "Should the assumptions ____ incorrect, the entire model collapses.",
    choices: [
      { id: 'a', text: "prove", isCorrect: true },
      { id: 'b', text: "proved", isCorrect: false },
      { id: 'c', text: "are proving", isCorrect: false },
      { id: 'd', text: "have proved", isCorrect: false }
    ]
  },
  {
    id: '23',
    prompt: "Only after examining the logs ____ the breach originated earlier.",
    choices: [
      { id: 'a', text: "they realized", isCorrect: false },
      { id: 'b', text: "did they realize", isCorrect: true },
      { id: 'c', text: "they had realized", isCorrect: false },
      { id: 'd', text: "was realized", isCorrect: false }
    ]
  },
  {
    id: '24',
    prompt: "Had the auditors looked more carefully, the discrepancies ____ detected sooner.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "would be", isCorrect: false },
      { id: 'c', text: "would have been", isCorrect: true },
      { id: 'd', text: "may be", isCorrect: false }
    ]
  },
  {
    id: '25',
    prompt: "Seldom ____ a theory revised so drastically after peer review.",
    choices: [
      { id: 'a', text: "does", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '26',
    prompt: "Under no condition ____ external consultants allowed access to raw datasets.",
    choices: [
      { id: 'a', text: "are", isCorrect: false },
      { id: 'b', text: "should be", isCorrect: true },
      { id: 'c', text: "must", isCorrect: false },
      { id: 'd', text: "should", isCorrect: false }
    ]
  },
  {
    id: '27',
    prompt: "Little ____ how significantly the policy would reshape the sector.",
    choices: [
      { id: 'a', text: "was anticipated", isCorrect: false },
      { id: 'b', text: "did they anticipate", isCorrect: true },
      { id: 'c', text: "they anticipated", isCorrect: false },
      { id: 'd', text: "they have anticipated", isCorrect: false }
    ]
  },
  {
    id: '28',
    prompt: "Only when recontextualized ____ the data reveal underlying biases.",
    choices: [
      { id: 'a', text: "do", isCorrect: true },
      { id: 'b', text: "did", isCorrect: false },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "had", isCorrect: false }
    ]
  },
  {
    id: '29',
    prompt: "Had the variables been isolated, the causal link ____ confirmed.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "could be", isCorrect: false },
      { id: 'd', text: "should have been", isCorrect: false }
    ]
  },
  {
    id: '30',
    prompt: "Hardly ____ the simulations completed when hardware failures occurred.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "have been", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '31',
    prompt: "Were he to reassess his stance, the negotiations ____ new momentum.",
    choices: [
      { id: 'a', text: "gain", isCorrect: false },
      { id: 'b', text: "gained", isCorrect: false },
      { id: 'c', text: "would gain", isCorrect: true },
      { id: 'd', text: "would have gained", isCorrect: false }
    ]
  },
  {
    id: '32',
    prompt: "No sooner ____ the networks synchronized than latency issues reappeared.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "were", isCorrect: false },
      { id: 'd', text: "has", isCorrect: false }
    ]
  },
  {
    id: '33',
    prompt: "Only by interpreting the data longitudinally ____ meaningful conclusions.",
    choices: [
      { id: 'a', text: "are we deriving", isCorrect: false },
      { id: 'b', text: "can we derive", isCorrect: true },
      { id: 'c', text: "we derive", isCorrect: false },
      { id: 'd', text: "we had derived", isCorrect: false }
    ]
  },
  {
    id: '34',
    prompt: "Rarely ____ evidence this compelling in behavioral research.",
    choices: [
      { id: 'a', text: "has there been", isCorrect: true },
      { id: 'b', text: "there has been", isCorrect: false },
      { id: 'c', text: "is there", isCorrect: false },
      { id: 'd', text: "was there", isCorrect: false }
    ]
  },
  {
    id: '35',
    prompt: "Had she been fully briefed, she ____ a different recommendation.",
    choices: [
      { id: 'a', text: "would make", isCorrect: false },
      { id: 'b', text: "would have made", isCorrect: true },
      { id: 'c', text: "made", isCorrect: false },
      { id: 'd', text: "would be making", isCorrect: false }
    ]
  },
  {
    id: '36',
    prompt: "Not until the metrics were normalized ____ accurate comparisons possible.",
    choices: [
      { id: 'a', text: "were", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "are", isCorrect: false },
      { id: 'd', text: "have been", isCorrect: false }
    ]
  },
  {
    id: '37',
    prompt: "Scarcely ____ the algorithm deployed when anomalies appeared.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "have been", isCorrect: false }
    ]
  },
  {
    id: '38',
    prompt: "Only when the context was broadened ____ the trend become visible.",
    choices: [
      { id: 'a', text: "does", isCorrect: false },
      { id: 'b', text: "did", isCorrect: true },
      { id: 'c', text: "had", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '39',
    prompt: "Were the findings to contradict expectations, the model ____ reassessed.",
    choices: [
      { id: 'a', text: "is", isCorrect: false },
      { id: 'b', text: "will be", isCorrect: false },
      { id: 'c', text: "would be", isCorrect: true },
      { id: 'd', text: "would have been", isCorrect: false }
    ]
  },
  {
    id: '40',
    prompt: "At no stage ____ the correlation statistically significant.",
    choices: [
      { id: 'a', text: "was", isCorrect: true },
      { id: 'b', text: "has been", isCorrect: false },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "had been", isCorrect: false }
    ]
  },
  {
    id: '41',
    prompt: "Had conditions been optimal, the results ____ even more robust.",
    choices: [
      { id: 'a', text: "will become", isCorrect: false },
      { id: 'b', text: "would become", isCorrect: false },
      { id: 'c', text: "would have become", isCorrect: true },
      { id: 'd', text: "became", isCorrect: false }
    ]
  },
  {
    id: '42',
    prompt: "Hardly ____ verifying the data when contradictory values surfaced.",
    choices: [
      { id: 'a', text: "did they finish", isCorrect: false },
      { id: 'b', text: "had they finished", isCorrect: true },
      { id: 'c', text: "they finished", isCorrect: false },
      { id: 'd', text: "they had been finishing", isCorrect: false }
    ]
  },
  {
    id: '43',
    prompt: "Only by triangulating independent sources ____ objectivity established.",
    choices: [
      { id: 'a', text: "can be", isCorrect: false },
      { id: 'b', text: "can", isCorrect: true },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "could be", isCorrect: false }
    ]
  },
  {
    id: '44',
    prompt: "No sooner ____ the new protocol implemented than compatibility issues emerged.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "were", isCorrect: false }
    ]
  },
  {
    id: '45',
    prompt: "Were he not constrained by deadlines, he ____ further refinements.",
    choices: [
      { id: 'a', text: "will attempt", isCorrect: false },
      { id: 'b', text: "would attempt", isCorrect: true },
      { id: 'c', text: "would have attempted", isCorrect: false },
      { id: 'd', text: "is attempting", isCorrect: false }
    ]
  },
  {
    id: '46',
    prompt: "Under no circumstances ____ analysts modify the raw figures.",
    choices: [
      { id: 'a', text: "are", isCorrect: false },
      { id: 'b', text: "should", isCorrect: true },
      { id: 'c', text: "must be", isCorrect: false },
      { id: 'd', text: "were", isCorrect: false }
    ]
  },
  {
    id: '47',
    prompt: "Scarcely ____ the error corrected when another occurred.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '48',
    prompt: "Only after several iterations ____ the output stabilize.",
    choices: [
      { id: 'a', text: "does", isCorrect: false },
      { id: 'b', text: "did", isCorrect: true },
      { id: 'c', text: "had", isCorrect: false },
      { id: 'd', text: "would", isCorrect: false }
    ]
  },
  {
    id: '49',
    prompt: "Rarely ____ peer reviewers agree so unanimously.",
    choices: [
      { id: 'a', text: "do", isCorrect: true },
      { id: 'b', text: "have", isCorrect: false },
      { id: 'c', text: "are", isCorrect: false },
      { id: 'd', text: "had", isCorrect: false }
    ]
  },
  {
    id: '50',
    prompt: "Had the sample size been larger, the confidence interval ____ narrower.",
    choices: [
      { id: 'a', text: "will be", isCorrect: false },
      { id: 'b', text: "would be", isCorrect: false },
      { id: 'c', text: "would have been", isCorrect: true },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '51',
    prompt: "Only after revisiting historical datasets ____ the predictive model show improvement.",
    choices: [
      { id: 'a', text: "did", isCorrect: true },
      { id: 'b', text: "had", isCorrect: false },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "would", isCorrect: false }
    ]
  },
  {
    id: '52',
    prompt: "Had the committee not intervened, the proposal ____ prematurely.",
    choices: [
      { id: 'a', text: "might be withdrawn", isCorrect: false },
      { id: 'b', text: "might have been withdrawn", isCorrect: true },
      { id: 'c', text: "was withdrawn", isCorrect: false },
      { id: 'd', text: "is withdrawn", isCorrect: false }
    ]
  },
  {
    id: '53',
    prompt: "Under no circumstances ____ unauthorized personnel be granted temporary access.",
    choices: [
      { id: 'a', text: "shall", isCorrect: false },
      { id: 'b', text: "should", isCorrect: true },
      { id: 'c', text: "must", isCorrect: false },
      { id: 'd', text: "ought", isCorrect: false }
    ]
  },
  {
    id: '54',
    prompt: "Hardly ____ the hypothesis formed when contradictory evidence surfaced.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "have been", isCorrect: false }
    ]
  },
  {
    id: '55',
    prompt: "No sooner ____ initial success reported than doubts were raised about methodology.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '56',
    prompt: "Were the assumptions to prove accurate, the implications ____ far-reaching.",
    choices: [
      { id: 'a', text: "will be", isCorrect: false },
      { id: 'b', text: "would be", isCorrect: true },
      { id: 'c', text: "would have been", isCorrect: false },
      { id: 'd', text: "are", isCorrect: false }
    ]
  },
  {
    id: '57',
    prompt: "Only by assessing longitudinal data ____ subtle patterns emerge.",
    choices: [
      { id: 'a', text: "did", isCorrect: false },
      { id: 'b', text: "do", isCorrect: false },
      { id: 'c', text: "can", isCorrect: true },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '58',
    prompt: "Seldom ____ researchers encounter variables so resistant to isolation.",
    choices: [
      { id: 'a', text: "are", isCorrect: false },
      { id: 'b', text: "have", isCorrect: false },
      { id: 'c', text: "do", isCorrect: true },
      { id: 'd', text: "did", isCorrect: false }
    ]
  },
  {
    id: '59',
    prompt: "Had the early warnings been acknowledged, resources ____ allocated more effectively.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "could be", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '60',
    prompt: "Not until additional trials were conducted ____ the phenomenon replicable.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "were", isCorrect: false },
      { id: 'c', text: "did they deem", isCorrect: true },
      { id: 'd', text: "had they deemed", isCorrect: false }
    ]
  },
  {
    id: '61',
    prompt: "Rarely ____ a peer review process proceed without significant revisions.",
    choices: [
      { id: 'a', text: "does", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "did", isCorrect: false }
    ]
  },
  {
    id: '62',
    prompt: "Scarcely ____ the algorithm calibrated when new inconsistencies emerged.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "had", isCorrect: true },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '63',
    prompt: "Were it not for the unforeseen variables, the outcome ____ predictable.",
    choices: [
      { id: 'a', text: "would be", isCorrect: true },
      { id: 'b', text: "would have been", isCorrect: false },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '64',
    prompt: "Only by employing stricter controls ____ margin of error reduced.",
    choices: [
      { id: 'a', text: "was the", isCorrect: false },
      { id: 'b', text: "could the", isCorrect: true },
      { id: 'c', text: "had the", isCorrect: false },
      { id: 'd', text: "has the", isCorrect: false }
    ]
  },
  {
    id: '65',
    prompt: "No sooner ____ the abstract published than critiques appeared online.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "has been", isCorrect: false }
    ]
  },
  {
    id: '66',
    prompt: "Had the correlation been linear, the projection ____ more reliable.",
    choices: [
      { id: 'a', text: "will be", isCorrect: false },
      { id: 'b', text: "would be", isCorrect: false },
      { id: 'c', text: "would have been", isCorrect: true },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '67',
    prompt: "At no point ____ the analysts deviate from standardized protocols.",
    choices: [
      { id: 'a', text: "do", isCorrect: false },
      { id: 'b', text: "did", isCorrect: true },
      { id: 'c', text: "have", isCorrect: false },
      { id: 'd', text: "had", isCorrect: false }
    ]
  },
  {
    id: '68',
    prompt: "Hardly ____ the keynote address concluded when questions poured in.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '69',
    prompt: "Only when contextual factors were considered ____ the anomaly explained.",
    choices: [
      { id: 'a', text: "could be", isCorrect: false },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "could", isCorrect: true },
      { id: 'd', text: "was being", isCorrect: false }
    ]
  },
  {
    id: '70',
    prompt: "Were the department to implement the new framework, efficiency ____ immediately.",
    choices: [
      { id: 'a', text: "would improve", isCorrect: true },
      { id: 'b', text: "will improve", isCorrect: false },
      { id: 'c', text: "would have improved", isCorrect: false },
      { id: 'd', text: "has improved", isCorrect: false }
    ]
  },
  {
    id: '71',
    prompt: "Scarcely ____ to evaluate the impact when new variables were introduced.",
    choices: [
      { id: 'a', text: "had we begun", isCorrect: true },
      { id: 'b', text: "we began", isCorrect: false },
      { id: 'c', text: "were we beginning", isCorrect: false },
      { id: 'd', text: "we have begun", isCorrect: false }
    ]
  },
  {
    id: '72',
    prompt: "Not until more rigorous criteria were applied ____ the findings validated.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "did they get", isCorrect: false },
      { id: 'c', text: "did they become", isCorrect: true },
      { id: 'd', text: "had been", isCorrect: false }
    ]
  },
  {
    id: '73',
    prompt: "Rarely ____ an entire dataset reclassified after publication.",
    choices: [
      { id: 'a', text: "is", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "does", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '74',
    prompt: "Only by reconstructing the dataset manually ____ the missing entries identified.",
    choices: [
      { id: 'a', text: "they could", isCorrect: false },
      { id: 'b', text: "could they", isCorrect: true },
      { id: 'c', text: "can they", isCorrect: false },
      { id: 'd', text: "they can", isCorrect: false }
    ]
  },
  {
    id: '75',
    prompt: "Had he not misinterpreted the trend, he ____ a vastly different conclusion.",
    choices: [
      { id: 'a', text: "would draw", isCorrect: false },
      { id: 'b', text: "would have drawn", isCorrect: true },
      { id: 'c', text: "drew", isCorrect: false },
      { id: 'd', text: "will draw", isCorrect: false }
    ]
  },
  {
    id: '76',
    prompt: "No sooner ____ the meeting adjourned than stakeholders demanded clarifications.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "were", isCorrect: false },
      { id: 'd', text: "has", isCorrect: false }
    ]
  },
  {
    id: '77',
    prompt: "Were she to challenge the prevailing theory, her work ____ substantial attention.",
    choices: [
      { id: 'a', text: "will gain", isCorrect: false },
      { id: 'b', text: "would gain", isCorrect: true },
      { id: 'c', text: "would have gained", isCorrect: false },
      { id: 'd', text: "gained", isCorrect: false }
    ]
  },
  {
    id: '78',
    prompt: "Hardly ____ the final parameters adjusted when the system crashed.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "have been", isCorrect: false },
      { id: 'd', text: "has been", isCorrect: false }
    ]
  },
  {
    id: '79',
    prompt: "Only after aggregating multiple surveys ____ a consistent pattern visible.",
    choices: [
      { id: 'a', text: "is", isCorrect: false },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "did they find", isCorrect: true },
      { id: 'd', text: "had they found", isCorrect: false }
    ]
  },
  {
    id: '80',
    prompt: "At no stage ____ the trial considered ethically questionable.",
    choices: [
      { id: 'a', text: "was", isCorrect: true },
      { id: 'b', text: "is", isCorrect: false },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "had", isCorrect: false }
    ]
  },
  {
    id: '81',
    prompt: "Had the forecast been accurate, the team ____ alternative actions.",
    choices: [
      { id: 'a', text: "would take", isCorrect: false },
      { id: 'b', text: "would have taken", isCorrect: true },
      { id: 'c', text: "might take", isCorrect: false },
      { id: 'd', text: "was taking", isCorrect: false }
    ]
  },
  {
    id: '82',
    prompt: "Rarely ____ interdisciplinary cooperation proceed this smoothly.",
    choices: [
      { id: 'a', text: "has", isCorrect: false },
      { id: 'b', text: "does", isCorrect: true },
      { id: 'c', text: "did", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '83',
    prompt: "Under no circumstances ____ the data interpreted without proper citations.",
    choices: [
      { id: 'a', text: "should", isCorrect: true },
      { id: 'b', text: "are", isCorrect: false },
      { id: 'c', text: "must", isCorrect: false },
      { id: 'd', text: "shall", isCorrect: false }
    ]
  },
  {
    id: '84',
    prompt: "Scarcely ____ she present her findings when counterclaims surfaced.",
    choices: [
      { id: 'a', text: "did", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "has", isCorrect: false }
    ]
  },
  {
    id: '85',
    prompt: "Only by refining the predictive algorithm ____ major inaccuracies avoided.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "can be", isCorrect: false },
      { id: 'c', text: "could be", isCorrect: true },
      { id: 'd', text: "had been", isCorrect: false }
    ]
  },
  {
    id: '86',
    prompt: "No sooner ____ the funding approved than the project was expanded.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had been", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '87',
    prompt: "Had the sampling error been detected earlier, the dataset ____ recalibrated.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "could be", isCorrect: false }
    ]
  },
  {
    id: '88',
    prompt: "Not until the secondary analysis was complete ____ the model stable.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "did they find", isCorrect: true },
      { id: 'c', text: "had they found", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '89',
    prompt: "Seldom ____ researchers confront such contradictory evidence.",
    choices: [
      { id: 'a', text: "have", isCorrect: false },
      { id: 'b', text: "do", isCorrect: true },
      { id: 'c', text: "are", isCorrect: false },
      { id: 'd', text: "did", isCorrect: false }
    ]
  },
  {
    id: '90',
    prompt: "Only when contextualized properly ____ meaningful insight.",
    choices: [
      { id: 'a', text: "does the data yield", isCorrect: true },
      { id: 'b', text: "the data yields", isCorrect: false },
      { id: 'c', text: "has the data yielded", isCorrect: false },
      { id: 'd', text: "did yield", isCorrect: false }
    ]
  },
  {
    id: '91',
    prompt: "Were it not for his skepticism, critical flaws ____ overlooked.",
    choices: [
      { id: 'a', text: "might be", isCorrect: false },
      { id: 'b', text: "might have been", isCorrect: true },
      { id: 'c', text: "would be", isCorrect: false },
      { id: 'd', text: "are", isCorrect: false }
    ]
  },
  {
    id: '92',
    prompt: "Hardly ____ the new framework implemented when unforeseen issues arose.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "has been", isCorrect: false },
      { id: 'c', text: "had been", isCorrect: true },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '93',
    prompt: "No sooner ____ the simulation restarted than error logs populated.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '94',
    prompt: "Only after a revised methodology was proposed ____ renewed interest.",
    choices: [
      { id: 'a', text: "was there", isCorrect: true },
      { id: 'b', text: "there was", isCorrect: false },
      { id: 'c', text: "were there", isCorrect: false },
      { id: 'd', text: "there were", isCorrect: false }
    ]
  },
  {
    id: '95',
    prompt: "Were the criteria to shift again, the predictive model ____ significant adaptation.",
    choices: [
      { id: 'a', text: "will require", isCorrect: false },
      { id: 'b', text: "would require", isCorrect: true },
      { id: 'c', text: "would have required", isCorrect: false },
      { id: 'd', text: "requires", isCorrect: false }
    ]
  },
  {
    id: '96',
    prompt: "Scarcely ____ the researchers prepare for publication when new data arrived.",
    choices: [
      { id: 'a', text: "did", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "were", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '97',
    prompt: "Not until independent replication occurred ____ the theory widely accepted.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "did", isCorrect: true },
      { id: 'c', text: "had", isCorrect: false },
      { id: 'd', text: "has been", isCorrect: false }
    ]
  },
  {
    id: '98',
    prompt: "Had the preliminary signals been stronger, investors ____ more swiftly.",
    choices: [
      { id: 'a', text: "would act", isCorrect: false },
      { id: 'b', text: "would have acted", isCorrect: true },
      { id: 'c', text: "acted", isCorrect: false },
      { id: 'd', text: "will act", isCorrect: false }
    ]
  },
  {
    id: '99',
    prompt: "Under no condition ____ analysts disclose draft reports to the press.",
    choices: [
      { id: 'a', text: "must", isCorrect: false },
      { id: 'b', text: "are", isCorrect: false },
      { id: 'c', text: "should", isCorrect: true },
      { id: 'd', text: "may", isCorrect: false }
    ]
  },
  {
    id: '100',
    prompt: "Only by creating a broader comparative framework ____ subtle distinctions detected.",
    choices: [
      { id: 'a', text: "could be", isCorrect: false },
      { id: 'b', text: "could", isCorrect: true },
      { id: 'c', text: "were", isCorrect: false },
      { id: 'd', text: "are", isCorrect: false }
    ]
  },
  {
    id: '101',
    prompt: "Only after the external auditors intervened ____ systemic flaws uncovered.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "did", isCorrect: true },
      { id: 'c', text: "had", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '102',
    prompt: "Scarcely ____ the dataset updated when the software generated new warnings.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '103',
    prompt: "No sooner ____ the manuscript submitted than the reviewers demanded revisions.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "has been", isCorrect: false }
    ]
  },
  {
    id: '104',
    prompt: "Under no circumstances ____ researchers base conclusions on unverified sources.",
    choices: [
      { id: 'a', text: "must", isCorrect: false },
      { id: 'b', text: "should", isCorrect: true },
      { id: 'c', text: "may", isCorrect: false },
      { id: 'd', text: "shall", isCorrect: false }
    ]
  },
  {
    id: '105',
    prompt: "Were the projections to deviate further, the economic model ____ reconsideration.",
    choices: [
      { id: 'a', text: "will require", isCorrect: false },
      { id: 'b', text: "would require", isCorrect: true },
      { id: 'c', text: "would have required", isCorrect: false },
      { id: 'd', text: "requires", isCorrect: false }
    ]
  },
  {
    id: '106',
    prompt: "Only by re-running the simulations ____ the inconsistencies resolved.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "could", isCorrect: true },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "had", isCorrect: false }
    ]
  },
  {
    id: '107',
    prompt: "Had the previous administration implemented reforms, the crisis ____ mitigated.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "might be", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '108',
    prompt: "Seldom ____ institutions reverse decisions after public backlash.",
    choices: [
      { id: 'a', text: "do", isCorrect: true },
      { id: 'b', text: "are", isCorrect: false },
      { id: 'c', text: "have", isCorrect: false },
      { id: 'd', text: "did", isCorrect: false }
    ]
  },
  {
    id: '109',
    prompt: "Hardly ____ the protocol finalized when regulatory changes arrived.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "have been", isCorrect: false }
    ]
  },
  {
    id: '110',
    prompt: "Not until the final audit was completed ____ the budget approved.",
    choices: [
      { id: 'a', text: "did", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "were", isCorrect: false },
      { id: 'd', text: "has been", isCorrect: false }
    ]
  },
  {
    id: '111',
    prompt: "Rarely ____ evidence this fragmented considered admissible.",
    choices: [
      { id: 'a', text: "is", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "should be", isCorrect: false }
    ]
  },
  {
    id: '112',
    prompt: "Only when benchmarked against global standards ____ measurable progress.",
    choices: [
      { id: 'a', text: "did we observe", isCorrect: true },
      { id: 'b', text: "we observed", isCorrect: false },
      { id: 'c', text: "has been observed", isCorrect: false },
      { id: 'd', text: "was observed", isCorrect: false }
    ]
  },
  {
    id: '113',
    prompt: "Were they to broaden the eligibility criteria, applications ____ dramatically.",
    choices: [
      { id: 'a', text: "will increase", isCorrect: false },
      { id: 'b', text: "would increase", isCorrect: true },
      { id: 'c', text: "would have increased", isCorrect: false },
      { id: 'd', text: "are increasing", isCorrect: false }
    ]
  },
  {
    id: '114',
    prompt: "No sooner ____ the committee convened than heated debates broke out.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "were", isCorrect: false },
      { id: 'd', text: "has", isCorrect: false }
    ]
  },
  {
    id: '115',
    prompt: "Had the parameters been properly defined, the model ____ significantly more accurate.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '116',
    prompt: "Little ____ that his assumptions would later undermine the entire study.",
    choices: [
      { id: 'a', text: "did he realize", isCorrect: true },
      { id: 'b', text: "he realized", isCorrect: false },
      { id: 'c', text: "had he realized", isCorrect: false },
      { id: 'd', text: "was he realizing", isCorrect: false }
    ]
  },
  {
    id: '117',
    prompt: "Under no condition ____ staff members alter protocol without authorization.",
    choices: [
      { id: 'a', text: "should", isCorrect: true },
      { id: 'b', text: "must", isCorrect: false },
      { id: 'c', text: "are to", isCorrect: false },
      { id: 'd', text: "may", isCorrect: false }
    ]
  },
  {
    id: '118',
    prompt: "Only after reconciling all discrepancies ____ the system declared stable.",
    choices: [
      { id: 'a', text: "has", isCorrect: false },
      { id: 'b', text: "had", isCorrect: false },
      { id: 'c', text: "was", isCorrect: true },
      { id: 'd', text: "were", isCorrect: false }
    ]
  },
  {
    id: '119',
    prompt: "Were the research climate less constrained, collaboration ____ easier.",
    choices: [
      { id: 'a', text: "would be", isCorrect: true },
      { id: 'b', text: "will be", isCorrect: false },
      { id: 'c', text: "would have been", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '120',
    prompt: "Not until the manuscript was fully revised ____ acceptance guaranteed.",
    choices: [
      { id: 'a', text: "had", isCorrect: false },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "did they secure", isCorrect: true },
      { id: 'd', text: "has", isCorrect: false }
    ]
  },
  {
    id: '121',
    prompt: "Scarcely ____ the new criteria announced when the guidelines were updated again.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "have been", isCorrect: false }
    ]
  },
  {
    id: '122',
    prompt: "Rarely ____ a dataset demand such extensive cleaning.",
    choices: [
      { id: 'a', text: "does", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "did", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '123',
    prompt: "Only when tested across multiple environments ____ the algorithm reliable.",
    choices: [
      { id: 'a', text: "is", isCorrect: false },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "did it become", isCorrect: true },
      { id: 'd', text: "has become", isCorrect: false }
    ]
  },
  {
    id: '124',
    prompt: "Had he adhered to the methodology, his conclusions ____ defensible.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "may be", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '125',
    prompt: "No sooner ____ the platform launched than traffic overwhelmed the servers.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "were", isCorrect: false }
    ]
  },
  {
    id: '126',
    prompt: "Were the assumptions less rigid, alternative interpretations ____ plausible.",
    choices: [
      { id: 'a', text: "would be", isCorrect: true },
      { id: 'b', text: "will be", isCorrect: false },
      { id: 'c', text: "would have been", isCorrect: false },
      { id: 'd', text: "are", isCorrect: false }
    ]
  },
  {
    id: '127',
    prompt: "Only by adjusting for confounders ____ a legitimate causal link inferred.",
    choices: [
      { id: 'a', text: "is", isCorrect: false },
      { id: 'b', text: "can", isCorrect: false },
      { id: 'c', text: "could", isCorrect: true },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '128',
    prompt: "Hardly ____ the proposal submitted when funding was reduced.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '129',
    prompt: "Seldom ____ scholars revise their frameworks so drastically.",
    choices: [
      { id: 'a', text: "do", isCorrect: true },
      { id: 'b', text: "have", isCorrect: false },
      { id: 'c', text: "had", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '130',
    prompt: "Not until indirect variables were accounted for ____ the model statistically sound.",
    choices: [
      { id: 'a', text: "did they deem", isCorrect: true },
      { id: 'b', text: "was deemed", isCorrect: false },
      { id: 'c', text: "had been deemed", isCorrect: false },
      { id: 'd', text: "is deemed", isCorrect: false }
    ]
  },
  {
    id: '131',
    prompt: "Were the trial extended, the long-term effects ____ clearer.",
    choices: [
      { id: 'a', text: "would be", isCorrect: true },
      { id: 'b', text: "will be", isCorrect: false },
      { id: 'c', text: "would have been", isCorrect: false },
      { id: 'd', text: "are", isCorrect: false }
    ]
  },
  {
    id: '132',
    prompt: "Only once the anomalies were categorized ____ further analysis possible.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "is", isCorrect: false },
      { id: 'c', text: "did they find", isCorrect: true },
      { id: 'd', text: "had they found", isCorrect: false }
    ]
  },
  {
    id: '133',
    prompt: "Had the survey included marginalized groups, the findings ____ more representative.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "could be", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '134',
    prompt: "Under no circumstances ____ inaccurate data be reported as conclusive.",
    choices: [
      { id: 'a', text: "shall", isCorrect: false },
      { id: 'b', text: "should", isCorrect: true },
      { id: 'c', text: "must", isCorrect: false },
      { id: 'd', text: "may", isCorrect: false }
    ]
  },
  {
    id: '135',
    prompt: "Rarely ____ such divergent theories reconciled in a single framework.",
    choices: [
      { id: 'a', text: "are", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "were", isCorrect: false }
    ]
  },
  {
    id: '136',
    prompt: "Only through continuous calibration ____ the model maintain accuracy.",
    choices: [
      { id: 'a', text: "can", isCorrect: true },
      { id: 'b', text: "does", isCorrect: false },
      { id: 'c', text: "will", isCorrect: false },
      { id: 'd', text: "could", isCorrect: false }
    ]
  },
  {
    id: '137',
    prompt: "No sooner ____ the revised draft circulated than new objections surfaced.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has been", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '138',
    prompt: "Were he to reconsider his methodology, the outcome ____ radically different.",
    choices: [
      { id: 'a', text: "would be", isCorrect: true },
      { id: 'b', text: "will be", isCorrect: false },
      { id: 'c', text: "would have been", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '139',
    prompt: "Scarcely ____ the constraints relaxed when further limitations emerged.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "have been", isCorrect: false },
      { id: 'd', text: "has", isCorrect: false }
    ]
  },
  {
    id: '140',
    prompt: "Not until alternative hypotheses were evaluated ____ genuine progress made.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: false },
      { id: 'c', text: "did they make", isCorrect: true },
      { id: 'd', text: "were", isCorrect: false }
    ]
  },
  {
    id: '141',
    prompt: "Had the early indicators been stronger, the downturn ____ predictable.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "might be", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '142',
    prompt: "Seldom ____ experts agree on the reliability of preliminary data.",
    choices: [
      { id: 'a', text: "do", isCorrect: true },
      { id: 'b', text: "are", isCorrect: false },
      { id: 'c', text: "have", isCorrect: false },
      { id: 'd', text: "did", isCorrect: false }
    ]
  },
  {
    id: '143',
    prompt: "Only by employing deeper statistical modeling ____ latent variables detected.",
    choices: [
      { id: 'a', text: "had", isCorrect: false },
      { id: 'b', text: "could", isCorrect: true },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '144',
    prompt: "Were the funding to lapse, several long-term studies ____ jeopardized.",
    choices: [
      { id: 'a', text: "will be", isCorrect: false },
      { id: 'b', text: "would be", isCorrect: true },
      { id: 'c', text: "would have been", isCorrect: false },
      { id: 'd', text: "are", isCorrect: false }
    ]
  },
  {
    id: '145',
    prompt: "Hardly ____ the framework validated when contradictory findings emerged.",
    choices: [
      { id: 'a', text: "has", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "was", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '146',
    prompt: "No sooner ____ the database migrated than integrity checks failed.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "were", isCorrect: false }
    ]
  },
  {
    id: '147',
    prompt: "Only when the transparency protocols improved ____ public trust rise.",
    choices: [
      { id: 'a', text: "did", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "would", isCorrect: false }
    ]
  },
  {
    id: '148',
    prompt: "Were new ethical guidelines adopted, research standards ____ significantly.",
    choices: [
      { id: 'a', text: "will rise", isCorrect: false },
      { id: 'b', text: "would rise", isCorrect: true },
      { id: 'c', text: "would have risen", isCorrect: false },
      { id: 'd', text: "rise", isCorrect: false }
    ]
  },
  {
    id: '149',
    prompt: "Scarcely ____ the publication embargo lifted when excerpts leaked online.",
    choices: [
      { id: 'a', text: "had", isCorrect: true },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "have", isCorrect: false }
    ]
  },
  {
    id: '150',
    prompt: "Not until the automated checks were bypassed ____ the breach detected.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "did", isCorrect: true },
      { id: 'c', text: "had", isCorrect: false },
      { id: 'd', text: "is", isCorrect: false }
    ]
  },
  {
    id: '151',
    prompt: "Had the organization diversified sooner, market volatility ____ less damaging.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "might be", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '152',
    prompt: "Under no circumstances ____ internal drafts forwarded to external reviewers.",
    choices: [
      { id: 'a', text: "are", isCorrect: false },
      { id: 'b', text: "must", isCorrect: false },
      { id: 'c', text: "should", isCorrect: true },
      { id: 'd', text: "may", isCorrect: false }
    ]
  },
  {
    id: '153',
    prompt: "Only by integrating behavioral data ____ a comprehensive profile constructed.",
    choices: [
      { id: 'a', text: "can", isCorrect: true },
      { id: 'b', text: "will", isCorrect: false },
      { id: 'c', text: "could have", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '154',
    prompt: "Rarely ____ policy shifts occur so abruptly.",
    choices: [
      { id: 'a', text: "do", isCorrect: true },
      { id: 'b', text: "has", isCorrect: false },
      { id: 'c', text: "is", isCorrect: false },
      { id: 'd', text: "will", isCorrect: false }
    ]
  },
  {
    id: '155',
    prompt: "Had the redundancy protocols worked, system downtime ____ avoided.",
    choices: [
      { id: 'a', text: "would be", isCorrect: false },
      { id: 'b', text: "would have been", isCorrect: true },
      { id: 'c', text: "may be", isCorrect: false },
      { id: 'd', text: "was", isCorrect: false }
    ]
  },
  {
    id: '156',
    prompt: "Only after triangulating all sources ____ the claims considered credible.",
    choices: [
      { id: 'a', text: "were", isCorrect: false },
      { id: 'b', text: "was", isCorrect: false },
      { id: 'c', text: "did they find", isCorrect: true },
      { id: 'd', text: "had been", isCorrect: false }
    ]
  },
  {
    id: '157',
    prompt: "No sooner ____ the ethics committee approve the study than public criticism erupted.",
    choices: [
      { id: 'a', text: "was", isCorrect: false },
      { id: 'b', text: "had", isCorrect: true },
      { id: 'c', text: "has", isCorrect: false },
      { id: 'd', text: "were", isCorrect: false }
    ]
  }
];

export default function Result({ searchParams }: { searchParams: { score?: string, level?: string } }) {

  // Veritabanı olmadığı için artık ID ile çekemeyiz. 
  // Skoru ve Seviyeyi URL parametrelerinden veya varsayılan olarak alıyoruz.
  const score = searchParams.score ? parseInt(searchParams.score) : 0; // Varsayılan 0
  const level = searchParams.level || "A1"; // Varsayılan seviye

  return (
    <div className="grid lg:grid-cols-3 gap-6">

      <div className="lg:col-span-1 space-y-6">
        <div className="card">
          <div className="text-sm text-slate-500">Your Score</div>
          <div className="text-4xl font-extrabold">{score}<span className="text-slate-400 text-2xl">/100</span></div>
          <div className="text-sm text-slate-500 mt-4">Estimated CEFR</div>
          <div className="text-3xl font-extrabold text-brand">{level}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500 mb-2">Retake</div>
          <Link className="btn" href="/start">Start Again</Link>
        </div>
      </div>

      <div className="lg:col-span-2 card space-y-6">
        <h2 className="text-2xl font-bold">Answer Key</h2>
        <p className="text-slate-500 text-sm">Since the database is offline, we are showing the correct answer key for study purposes.</p>

        {ALL_QUESTIONS.map((question, idx) => {
          return (
            <div key={question.id} className="border-b border-slate-200 pb-4">
              <div className="text-sm text-slate-500 mb-2">Question {idx + 1}</div>
              <div className="text-lg font-semibold mb-4" dangerouslySetInnerHTML={{ __html: question.prompt }} />

              <div className="grid gap-2">
                {question.choices.map((choice) => {
                  let styles = 'border-slate-200';

                  // Sadece doğru cevabı yeşil yapıyoruz
                  if (choice.isCorrect) {
                    styles = 'border-green-500 ring-2 ring-green-500/10 bg-green-50';
                  } 

                  return (
                    <label key={choice.id} className={`cursor-not-allowed rounded-xl border p-3 ${styles}`}>
                      <input type="radio" name={question.id} className="mr-2" checked={choice.isCorrect} disabled />
                      {choice.text}
                      {choice.isCorrect && <span className="ml-2 text-green-700 font-bold">(Correct Answer)</span>}
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
