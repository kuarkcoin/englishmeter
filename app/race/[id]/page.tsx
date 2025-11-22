import questionsData from "@/data/race_questions.json";

// JSON’daki gerçek yapıyı tanımlıyoruz
type RawQuestion = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
};

// Bizim kullanmak istediğimiz temiz yapı
type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function RacePage({ params }: { params: { id: string } }) {
  // BURASI ÇOK ÖNEMLİ → .map ile veriyi gerçekten dönüştürüyoruz!
  const allQuestions: Question[] = questionsData.map((q: RawQuestion) => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    answer:
      q.correct_option === "a" ? q.option_a :
      q.correct_option === "b" ? q.option_b :
      q.correct_option === "c" ? q.option_c :
      q.option_d
  }));

  const index = Number(params.id) - 1;
  const question = allQuestions[index];

  if (!question) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Soru Bulunamadı</h1>
        <p>ID: {params.id} için soru yok.</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
        Advanced Grammar Race
      </h1>

      <section className="bg-white border-rounded-xl p-8 shadow-xl">
        <p className="text-xl font-semibold mb-8 leading-relaxed">
          {params.id}. {question.question}
        </p>

        <div className="space-y-4">
          {question.options.map((option, i) => (
            <button
              key={i}
              className="w-full p-5 text-left text-lg border-2 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all font-medium"
            >
              {String.fromCharCode(65 + i)}) {option}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
