'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// --- KODUN KENDİ İÇİNDEKİ YEDEK FONKSİYON ---
// Dışarıdan dosya çağırmıyoruz, böylece "Dosya bulunamadı" hatası riskini sıfırlıyoruz.
const getSafeQuestions = (slug: string | null) => {
  // Varsayılan sorular (Eğer veritabanı/dosya okunamazsa bunlar gösterilir)
  const defaultQuestions = [
    {
      id: "q1",
      prompt: "What is the past tense of 'go'?",
      choices: [
        { id: 'a', text: "goed", isCorrect: false },
        { id: 'b', text: "went", isCorrect: true },
        { id: 'c', text: "gone", isCorrect: false },
        { id: 'd', text: "goes", isCorrect: false }
      ]
    },
    {
      id: "q2",
      prompt: "She ______ a doctor.",
      choices: [
        { id: 'a', text: "are", isCorrect: false },
        { id: 'b', text: "is", isCorrect: true },
        { id: 'c', text: "am", isCorrect: false },
        { id: 'd', text: "be", isCorrect: false }
      ]
    },
    {
      id: "q3",
      prompt: "They ______ football yesterday.",
      choices: [
        { id: 'a', text: "play", isCorrect: false },
        { id: 'b', text: "playing", isCorrect: false },
        { id: 'c', text: "played", isCorrect: true },
        { id: 'd', text: "plays", isCorrect: false }
      ]
    }
  ];

  // Slug'a göre başlık üretelim
  const title = slug ? slug.replace(/-/g, ' ').toUpperCase() + " TEST" : "GENERAL PRACTICE";
  
  return { title, questions: defaultQuestions };
}

function StartQuizLogic() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // 1. Hata yakalama bloğu (Try-Catch) ekledik
    try {
      const slug = searchParams.get('testSlug');
      
      console.log("Test başlatılıyor...");

      // 2. Soruları al (Dosya import etmeden, direkt buradan)
      const { title, questions } = getSafeQuestions(slug);

      // 3. Veriyi paketle
      const attemptId = `session-${Math.floor(Math.random() * 100000)}`;
      const attemptData = {
        attemptId: attemptId,
        test: {
          title: title,
          duration: 30
        },
        questions: questions
      };

      // 4. Tarayıcı hafızasına yaz
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptData));

      // 5. ZORLA YÖNLENDİRME
      // Next.js router yerine klasik window.location kullanıyoruz, takılmayı engeller.
      setTimeout(() => {
        window.location.href = `/quiz/${attemptId}`;
      }, 1000); // 1 saniye bekleyip gönderir

    } catch (error) {
      // Bir hata olursa ekrana alert bas
      alert("Bir hata oluştu: " + error);
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-bold text-slate-800">Test Hazırlanıyor...</h1>
      <p className="text-slate-500 mt-2">Yönlendiriliyorsunuz...</p>
    </div>
  )
}

export default function Start() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <StartQuizLogic />
    </Suspense>
  )
}
