"use client"; // Bu satır etkileşim (tıklama) için şart!

import { useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "@/data/race_questions.json";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function RacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Veriyi dönüştür
  const allQuestions: Question[] = questionsData.map((q: any) => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    answer: q.correct_option
  }));

  const currentId = Number(params.id);
  const index = currentId - 1;
  const question = allQuestions[index];

  if (!question) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Yarış Bitti!</h1>
        <button 
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Ana Sayfaya Dön
        </button>
      </main>
    );
  }

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Zaten tıklandıysa tekrar tıklatmayalım

    setSelectedOption(option);
    
    // Doğru cevap kontrolü (Sondaki boşlukları temizleyerek kontrol et)
    const correct = option.trim() === question.answer.trim();
    setIsCorrect(correct);

    // 1 saniye sonra diğer soruya geç
    setTimeout(() => {
      router.push(`/race/${currentId + 1}`);
      setSelectedOption(null);
      setIsCorrect(null);
    }, 1000);
  };

  // Buton rengini belirleyen fonksiyon
  const getButtonColor = (option: string) => {
    if (selectedOption === option) {
      return isCorrect 
        ? "bg-green-500 text-white border-green-600" // Doğruysa Yeşil
        : "bg-red-500 text-white border-red-600";    // Yanlışsa Kırmızı
    }
    return "bg-gray-100 hover:bg-gray-200 border-gray-300"; // Normal hali
  };

  return (
    <main className="p-8 max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Advanced Grammar Race</h1>

      <div className="bg-white border rounded-xl p-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">
          {params.id}. {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption} // Seçim yapıldıysa butonları kilitle
              className={`w-full p-4 text-left text-lg font-medium border rounded-lg transition-all duration-200 ${getButtonColor(option)}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)})</span> 
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        Soru {currentId} / {allQuestions.length}
      </div>
    </main>
  );
}
