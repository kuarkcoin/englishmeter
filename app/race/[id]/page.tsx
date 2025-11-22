import questionsData from "@/data/race_questions.json";

// 1. Doğru tip tanımı (JSON’daki gerçek alan isimlerine göre)
type RawQuestion = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string; // burada "a" | "b" | "c" | "d" gibi harf geliyor
};

// 2. Bizim component’te kullanmak istediğimiz temiz tip
type Question = {
  question: string;
  options: string[];
  answer: string; // doğru cevabın tam metni olacak (örneğin "Paris is the capital of France.")
};

export default function RacePage({ params }: { params: { id: string } }) {
  // 3. Veriyi güzelce dönüştürüyoruz → artık TypeScript hiçbir şeye itiraz edemez
  const allQuestions: Question[] = questionsData.map((q: RawQuestion) => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    // correct_option "a" ise → option_a’yı, "b" ise option_b’yi alıyor
    answer:
      q.correct_option === "a"
        ? q.option_a
        : q.correct_option === "b"
        ? q.option_b
        : q.correct_option === "c"
        ? q.option_c
        : q.option_d,
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
      <h1 className="text-3xl font-bold mb-8 text-center">
        Advanced Grammar Race
      </h1>

      <section className="border rounded-xl p-8 shadow-lg bg-white">
        <p className="text-xl font-semibold mb-8">
          {params.id}. {question.question}
        </p>

        <div className="grid gap-4">
          {question.options.map((option, i) => (
            <button
              key={i}
              className="w-full p-4 text-left text-lg border-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition font-medium"
            >
              {String.fromCharCode(65 + i)}) {option}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
