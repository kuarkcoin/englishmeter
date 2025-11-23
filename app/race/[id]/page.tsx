// app/race/[id]/page.tsx
import questionsData from "../../../data/race_questions.json";
import { useState } from "react";

export default function RacePage({ params }: { params: { id: string } }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const allQuestions = questionsData.map((q: any) => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    correct: q.correct_option, // "a" | "b" | "c" | "d"
  }));

  const currentId = Number(params.id);
  const question = allQuestions[currentId - 1];

  if (!question) {
    return <div className="p-20 text-center text-3xl">Soru bulunamadı!</div>;
  }

  const handleAnswer = (opt: string) => {
    setSelected(opt);
    setShowResult(true);
  };

  const isCorrect = selected === question.correct;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 text-indigo-800">
          Advanced Grammar Race
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="text-2xl font-semibold mb-8 text-gray-800">
            {currentId}. {question.question}
          </div>

          <div className="space-y-5">
            {question.options.map((opt: string, i: number) => {
              const letter = ["a", "b", "c", "d"][i];
              return (
                <button
                  key={i}
                  onClick={() => !showResult && handleAnswer(letter)}
                  disabled={showResult}
                  className={`w-full p-6 text-left text-xl rounded-2xl border-4 transition-all
                    ${showResult && letter === question.correct
                      ? "bg-green-500 text-white border-green-700"
                      : showResult && selected === letter
                      ? "bg-red-500 text-white border-red-700"
                      : "bg-gray-50 hover:bg-indigo-100 border-gray-300 hover:border-indigo-500"
                    } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="font-bold">{String.fromCharCode(65 + i)})</span> {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-10 text-center">
              <p className={`text-3xl font-bold mb-6 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "DOĞRU! 👏" : `YANLIŞ! Doğru cevap: ${question.correct.toUpperCase()}`}
              </p>
              <a
                href={`/race/${currentId + 1}`}
                className="inline-block px-10 py-5 bg-indigo-600 text-white text-xl font-bold rounded-full hover:bg-indigo-700 transition"
              >
                {currentId === 150 ? "Bitirdin! Tebrikler!" : "Sonraki Soru →"}
              </a>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-600">
          Soru {currentId} / 150
        </div>
      </div>
    </main>
  );
}
