export type MeaningLanguageCode = 'tr' | 'de' | 'es' | 'it' | 'fr';
export type HomeTestSummary = {
  searchTests: import('./test-discovery').TestDiscoveryEntry[];
  globalVocabularyWords: number;
  turkishGreekWords: number;
  dailyEnglishWords: number;
  examQuestionCounts: Record<string, number>;
  grammarQuestionCounts: Record<string, number>;
  advancedQuestionRange: string;
};
