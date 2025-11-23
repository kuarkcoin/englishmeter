"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "@/data/race_questions.json";

type Question = {
  question: string;
  options: string[];
  answer: string; // Veritabanında "A", "B" vs. olarak kayıtlı
};

export default function RacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Verileri hazırla
  const allQuestions: Question[] = questionsData.map((q: any) => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    answer: q.correct_option // Örneğin: "A" veya "B"
  }));

  const currentId = Number(params.id);
  const index = currentId - 1;
  const question = allQuestions[index];

  if (!question) {
    return (
      <main className="p-8 text-center mt-10">
        <h1 className="text-2xl font-bold mb-4">Yarış Bitti! 🎉</h1>
        <button 
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Ana Sayfaya Dön
        </button>
      </main>
    );
  }

  const handleOptionClick = (letter: string) => {
    if (selectedLetter) return; // Zaten tıklandıysa işlem yapma

    setSelectedLetter(letter);
    
    // Cevap kontrolü: Tıklanan harf (A) === Doğru Cevap (A) mı?
    // Hem gelen veriyi hem cevabı garanti olsun diye temizleyip (trim) kontrol ediyoruz.
    const correct = letter === question.answer.trim();
    setIsCorrect(correct);

    // 1 saniye bekle sonra diğer soruya geç
    setTimeout(() => {
      router.push(`/race/${currentId + 1}`);
      setSelectedLetter(null);
      setIsCorrect(null);
    }, 1000);
  };

  const getButtonColor = (letter: string) => {
    if (selectedLetter === letter) {
      return isCorrect 
        ? "bg-green-500 text-white border-green-600" 
        : "bg-red-500 text-white border-red-600";
    }
    return "bg-white hover:bg-gray-100 border-gray-300 text-gray-800";
  };

  return (
    <main className="p-4 max-w-3xl mx-auto mt-8">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${(currentId / allQuestions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white border rounded-xl p-6 md:p-10 shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-8 text-gray-800">
          {params.id}. {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((optionText, i) => {
            const letter = String.fromCharCode(65 + i); // 0->A, 1->B, 2->C...
            return (
              <button
                key={i}
                onClick={() => handleOptionClick(letter)}
                disabled={!!selectedLetter}
                className={`w-full p-4 text-left text-lg font-medium border-2 rounded-xl transition-all duration-200 ${getButtonColor(letter)}`}
              >
                <span className="font-bold mr-3">{letter})</span> 
                {optionText}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
