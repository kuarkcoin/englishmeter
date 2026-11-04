import type { ChallengeQuestion, PublicQuestion } from './types';
import { ChallengeError } from './errors';

export const CHALLENGE_DURATION_SECONDS = 40 * 60;

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Istanbul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** The challenge resets at midnight in Istanbul, independently of server time zone. */
export function challengeDay(date = new Date()): string {
  const parts = dayFormatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function validateDay(value: string): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Only explicit unanswered values or one of the five option indices are accepted. */
export function validateAnswers(value: unknown, count = 50): (number | null)[] {
  if (!Number.isInteger(count) || count < 1 || !Array.isArray(value) || value.length !== count) {
    throw new ChallengeError(`Provide exactly ${count} answers.`);
  }
  const answers: (number | null)[] = [];
  for (let index = 0; index < count; index++) {
    const answer: unknown = value[index];
    if (answer === null) {
      answers.push(null);
      continue;
    }
    if (typeof answer !== 'number' || !Number.isInteger(answer) || answer < 0 || answer > 4) {
      throw new ChallengeError('Each answer must be an option from 0 to 4, or null.');
    }
    answers.push(answer);
  }
  return answers;
}

export function scoreChallenge(questions: readonly ChallengeQuestion[], value: readonly (number | null)[]) {
  const answers = validateAnswers(value, questions.length);
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  questions.forEach((question, index) => {
    if (answers[index] === null) unanswered++;
    else if (answers[index] === question.answer) correct++;
    else incorrect++;
  });
  // Integer quarters preserve exact, consistent leaderboard comparisons.
  const netQuarter = correct * 4 - incorrect;
  return { correct, incorrect, unanswered, net: netQuarter / 4, netQuarter };
}

export function normalizeNickname(value: unknown): string {
  if (typeof value !== 'string' || /[\p{Cc}\p{Cf}]/u.test(value)) {
    throw new ChallengeError('Use a nickname with 2–20 letters, numbers, spaces, underscores or hyphens.');
  }
  const nickname = value.normalize('NFC').trim().replace(/ +/g, ' ');
  const length = Array.from(nickname).length;
  if (length < 2 || length > 20 || !/^[\p{L}\p{N} _-]+$/u.test(nickname) || !/[\p{L}\p{N}]/u.test(nickname)) {
    throw new ChallengeError('Use a nickname with 2–20 letters, numbers, spaces, underscores or hyphens.');
  }
  return nickname;
}

/** Explicit allowlist: answer keys, explanations and future private fields never cross the API. */
export function publicQuestions(questions: readonly ChallengeQuestion[]): PublicQuestion[] {
  return questions.map(question => ({
    id: question.id,
    category: question.category,
    level: question.level,
    prompt: question.prompt,
    options: [...question.options],
    ...(question.passage ? {
      passage: {
        id: question.passage.id,
        title: question.passage.title,
        text: question.passage.text,
      },
    } : {}),
  }));
}
