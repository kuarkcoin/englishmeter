export type PracticeCategory = 'reading' | 'vocabulary' | 'word-formation' | 'kids';
export type PracticeLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'Starter';

export type PracticeQuestion = {
  id: string;
  prompt: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  passageId?: string;
};

export type PracticePassage = {
  id: string;
  title: string;
  text: string;
};

export type PracticeTest = {
  slug: string;
  category: PracticeCategory;
  level: PracticeLevel;
  title: string;
  description: string;
  duration: number;
  learningGoals: readonly string[];
  passages?: readonly PracticePassage[];
  questions: readonly PracticeQuestion[];
};
