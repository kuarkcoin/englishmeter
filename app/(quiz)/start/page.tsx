'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
// ARTIK GERÇEK YÖNETİCİYİ ÇAĞIRIYORUZ:
import { getQuestionsBySlug } from '@/lib/quizManager' 

function StartQuizLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const initQuiz = async () => {
      // 1. URL'den ne istendiğini al (Örn: level-a1, test-perfect-past)
      const slug = searchParams.get('testSlug') || 'quick-placement';

      console.log("Başlatılıyor:", slug);

      // 2. GERÇEK SORULARI ÇEK (Manager, senin JSON dosyalarını tarar)
      // A1 seçtiysen english_test_questions.json'dan A1 sorularını bulur getirir.
      const { title, questions } = getQuestionsBySlug(slug);

      // 3. Veriyi paketle
      const attemptData = {
        attemptId: `session-${Date.now()}`,
        test: {
          title: title,
          duration: 30 // Süre (dk)
        },
        questions: questions
      };

      // 4. Hafızaya yaz
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptData));

      // 5. Test sayfasına yönlendir
      setTimeout(() => {
        window.location.href = `/quiz/${attemptData.attemptId}`;
      }, 500);
    }

    initQuiz();
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-bold text-slate-800">Sınav Hazırlanıyor...</h1>
      <p className="text-slate-500 mt-2">Sorular veritabanından çekiliyor.</p>
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