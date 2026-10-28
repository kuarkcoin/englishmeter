export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CEFRLevel = (typeof CEFR_LEVELS)[number];

export const PLACEMENT_QUESTIONS_PER_LEVEL = 5;
export const PLACEMENT_PASS_PERCENTAGE = 80;
export const PLACEMENT_METHOD = 'This practice estimate requires at least 4 of 5 correct answers at every level up to the level shown. Complete all 30 questions. It covers grammar and vocabulary, not listening, speaking or writing, and is not an official CEFR assessment.';

function normalizeLevel(level?: string): CEFRLevel | undefined {
  const normalized = level?.trim().toUpperCase();
  return CEFR_LEVELS.find((candidate) => candidate === normalized);
}

/** Keep all entry points on the same balanced, reproducible set of questions. */
export function selectPlacementQuestions<T extends { level?: string }>(
  questions: readonly T[],
  perLevel = PLACEMENT_QUESTIONS_PER_LEVEL,
): T[] {
  if (!Number.isInteger(perLevel) || perLevel < 1) {
    throw new Error('Placement questions per level must be a positive integer.');
  }

  return CEFR_LEVELS.flatMap((level, levelIndex) => {
    const pool = questions.filter((question) => normalizeLevel(question.level) === level);
    if (pool.length < perLevel) {
      throw new Error(`Placement requires at least ${perLevel} questions for ${level}.`);
    }

    // Fisher–Yates with a fixed seed avoids selecting only the start of each bank.
    let state = (0x51f15e + levelIndex * 1009) >>> 0;
    for (let index = pool.length - 1; index > 0; index--) {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      const other = Math.floor((state / 0x100000000) * (index + 1));
      [pool[index], pool[other]] = [pool[other], pool[index]];
    }
    return pool.slice(0, perLevel);
  });
}

export type PlacementQuestion = {
  id: string;
  level?: string;
  choices: readonly { id: string; isCorrect?: boolean }[];
};

export type PlacementLevelScore = {
  level: CEFRLevel;
  correct: number;
  answered: number;
  total: number;
  percentage: number;
};

export type PlacementResult = {
  estimatedLevel: CEFRLevel | null;
  recommendedLevel: CEFRLevel;
  levelScores: PlacementLevelScore[];
  isComplete: boolean;
  hasBalancedQuestions: boolean;
};

export function scorePlacement(
  questions: readonly PlacementQuestion[],
  answers: Readonly<Record<string, string>>,
): PlacementResult {
  const levelScores = CEFR_LEVELS.map((level): PlacementLevelScore => {
    const group = questions.filter((question) => normalizeLevel(question.level) === level);
    let correct = 0;
    let answered = 0;
    for (const question of group) {
      const selected = question.choices.find((choice) => choice.id === answers[question.id]);
      if (selected) answered++;
      if (selected?.isCorrect === true) correct++;
    }
    return {
      level,
      correct,
      answered,
      total: group.length,
      percentage: group.length ? Math.round((correct / group.length) * 100) : 0,
    };
  });

  const hasBalancedQuestions =
    questions.length === CEFR_LEVELS.length * PLACEMENT_QUESTIONS_PER_LEVEL &&
    new Set(questions.map((question) => question.id)).size === questions.length &&
    levelScores.every((score) => score.total === PLACEMENT_QUESTIONS_PER_LEVEL) &&
    questions.every((question) =>
      question.choices.length >= 2 &&
      new Set(question.choices.map((choice) => choice.id)).size === question.choices.length &&
      question.choices.filter((choice) => choice.isCorrect === true).length === 1,
    );
  const isComplete = hasBalancedQuestions && levelScores.every((score) => score.answered === score.total);
  let estimatedLevel: CEFRLevel | null = null;
  if (isComplete) {
    for (const score of levelScores) {
      if (score.percentage < PLACEMENT_PASS_PERCENTAGE) break;
      estimatedLevel = score.level;
    }
  }

  const recommendedLevel = levelScores.find(
    (score) => score.total !== PLACEMENT_QUESTIONS_PER_LEVEL || score.percentage < PLACEMENT_PASS_PERCENTAGE,
  )?.level ?? 'C2';

  return { estimatedLevel, recommendedLevel, levelScores, isComplete, hasBalancedQuestions };
}
