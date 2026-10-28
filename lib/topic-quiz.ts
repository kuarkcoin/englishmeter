export type TopicQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// A stable seed gives the server and browser the same order. A new attempt
// changes that order without changing which option is correct.
export function prepareTopicQuestions<T extends TopicQuestion>(
  questions: readonly T[],
  attempt = 0
): T[] {
  return questions.map((question) => {
    let state = 2166136261;
    for (const character of `${question.id}:${attempt}`) {
      state = Math.imul(state ^ character.charCodeAt(0), 16777619) >>> 0;
    }
    const options = question.options.map((text, originalIndex) => ({ text, originalIndex }));
    for (let i = options.length - 1; i > 0; i--) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const j = Math.floor((state / 4294967296) * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      ...question,
      options: options.map(({ text }) => text),
      correctIndex: options.findIndex(({ originalIndex }) => originalIndex === question.correctIndex),
    };
  });
}
