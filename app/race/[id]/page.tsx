// app/race/[id]/page.tsx

import questionsData from "@/data/race_questions.json";

type Question = {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
};

export default function RacePage({ params }: { params: { id: string } }) {
  const allQuestions = questionsData as Question[];

  const questionIndex = parseInt(params.id, 10) - 1;
  const question = allQuestions[questionIndex];

  if (!question) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-2xl font-bold">Question Not Found</h1>
        <p>No question exists for ID {params.id}</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Advanced Grammar Race</h1>

      <section className="border rounded-lg p-6 shadow">
        <p className="text-lg font-semibold mb-4">
          {params.id}. {question.question_text}
        </p>

        <div className="space-y-3">
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200">
            A) {question.option_a}
          </button>
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200">
            B) {question.option_b}
          </button>
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200">
            C) {question.option_c}
          </button>
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200}>
            D) {question.option_d}
          </button>
        </div>
      </section>
    </main>
  );
}
