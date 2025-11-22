import questionsData from "@/data/race_questions.json";

type Question = {
  question: string;
  options: string[]; // [A,B,C,D]
  answer: string;    // "A" | "B" | "C" | "D"
};

export default function RacePage({ params }: { params: { id: string } }) {
  const allQuestions = questionsData as Question[];

  const index = Number(params.id) - 1;
  const question = allQuestions[index];

  if (!question) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Question Not Found</h1>
        <p>No question exists for id: {params.id}</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Advanced Grammar Race</h1>

      <section className="border rounded-lg p-6 shadow">
        <p className="text-lg font-semibold mb-4">
          {params.id}. {question.question}
        </p>

        <div className="space-y-3">
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200">
            A) {question.options[0]}
          </button>
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200">
            B) {question.options[1]}
          </button>
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200">
            C) {question.options[2]}
          </button>
          <button className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200">
            D) {question.options[3]}
          </button>
        </div>
      </section>
    </main>
  );
}
