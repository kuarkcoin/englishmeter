export type ChallengeCategory = 'grammar' | 'vocabulary' | 'reading';
export type ChallengeLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export interface ChallengeQuestion {
  id: string;
  category: ChallengeCategory;
  level: ChallengeLevel;
  prompt: string;
  options: [string, string, string, string, string];
  answer: number;
  explanation: string;
  passage?: { id: string; title: string; text: string };
}
export type PublicQuestion = Omit<ChallengeQuestion, 'answer' | 'explanation'>;
export interface ChallengeScore {
  correct: number;
  incorrect: number;
  unanswered: number;
  net: number;
  durationSeconds: number;
}
export interface ChallengeResult extends ChallengeScore {
  attemptId: string;
  day: string;
  ranked: boolean;
  nickname: string | null;
  rank: number | null;
  participants: number;
}
export interface ChallengeSession {
  attemptId: string;
  day: string;
  startedAt: string;
  deadlineAt: string;
  serverNow: string;
  questions: PublicQuestion[];
  answers: (number | null)[];
  revision: number;
  result: ChallengeResult | null;
}
export interface ChallengeLeaderboard {
  day: string;
  participants: number;
  entries: (ChallengeScore & { rank: number; nickname: string })[];
}
