import questionsData from "@/data/race_questions.json";

type Question = {
  question: string;
  options: string[]; 
  answer: string;    
};

export default function RacePage({ params }: { params: { id: string } }) {
  // HATA ÇÖZÜMÜ BURADA:
  // Veriyi "map" ile senin istediğin formata çeviriyoruz.
  const allQuestions: Question[] = questionsData.map((q: any) => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    answer: q.correct_option
  }));

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
          {question.options.map((option, i) => (
             <button key={i} className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200 text-left">
               {String.fromCharCode(65 + i)}) {option}
             </button>
          ))}
        </div>
      </section>
    </main>
  );
}
