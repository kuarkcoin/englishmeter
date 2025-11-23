"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import questionsData from "@/data/race_questions.json";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function RacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 1. ADIM: Verileri güvenli şekilde dönüştür
  const allQuestions: Question[] = questionsData.map((q: any) => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    answer: q.correct_option
  }));

  // 2. ADIM: SORUNU BULMAK İÇİN KONSOLA YAZDIRIYORUZ
  // Tarayıcıda F12 -> Console sekmesinde bu yazıyı ara.
  console.log("Sistemdeki Toplam Soru Sayısı:", allQuestions.length);

  const currentId = Number(params.id);
  const index = currentId - 1;
  const question = allQuestions[index];

  // Eğer soru bulunamazsa (Yarış bitti veya ID hatalı)
  if (!question) {
    return (
      <main className="p-8 text-center mt-10 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Yarış Bitti! 🎉</h1>
        <p className="text-gray-600 mb-6">Tüm soruları tamamladın.</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold"
        >
          Ana Sayfaya Dön
        </button>
      </main>
    );
  }

  const handleOptionClick = (letter: string) => {
    if (selectedLetter) return; // Çift tıklamayı önle

    setSelectedLetter(letter);
    
    // Cevap kontrolü (Boşlukları temizle)
    const correct = letter === question.answer.trim();
    setIsCorrect(correct);

    // 1 saniye bekle ve yönlendir
    setTimeout(() => {
      router.push(`/race/${currentId + 1}`);
      // State'leri sıfırla (Yeni soruya temiz sayfa ile geç)
      setSelectedLetter(null);
      setIsCorrect(null);
    }, 1000);
  };

  const getButtonColor = (letter: string) => {
    if (selectedLetter === letter) {
      return isCorrect 
        ? "bg-green-500 text-white border-green-600 ring-2 ring-green-300" 
        : "bg-red-500 text-white border-red-600 ring-2 ring-red-300";
    }
    // Seçim yapıldıysa ama bu şık seçilmediyse soluklaştır
    if (selectedLetter) {
        return "bg-gray-50 text-gray-400 border-gray-200 opacity-50";
    }
    return "bg-white hover:bg-blue-50 border-gray-300 text-gray-800 hover:border-blue-300";
  };

  // İlerleme çubuğu hesaplaması
  const progressPercentage = (currentId / allQuestions.length) * 100;

  return (
    <main className="p-4 max-w-3xl mx-auto mt-8">
      {/* İlerleme Çubuğu */}
      <div className="mb-2 flex justify-between text-xs text-gray-500 font-semibold">
        <span>Soru {currentId}</span>
        <span>{allQuestions.length}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Soru Kartı */}
      <div className="bg-white border rounded-2xl p-6 md:p-10 shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold mb-8 text-gray-800 leading-relaxed">
          <span className="text-blue-600 mr-2">{params.id}.</span> 
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((optionText, i) => {
            const letter = String.fromCharCode(65 + i); // A, B, C, D
            return (
              <button
                key={i}
                onClick={() => handleOptionClick(letter)}
                disabled={!!selectedLetter}
                className={`w-full p-4 text-left text-lg font-medium border-2 rounded-xl transition-all duration-200 flex items-center ${getButtonColor(letter)}`}
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-sm font-bold mr-4 border group-hover:bg-white">
                    {letter}
                </span> 
                {optionText}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
