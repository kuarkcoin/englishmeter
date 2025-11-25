'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getQuestionsBySlug } from '@/lib/quizManager' // Yeni yazdığımız fonksiyonu import et

function StartQuizLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const startTest = async () => {
      // 1. URL'den slug'ı al (örn: test-perfect-past veya level-a1)
      const testSlug = searchParams.get('testSlug') || 'general-mix'
      
      console.log("Test başlatılıyor, Slug:", testSlug);

      // 2. YENİ: Gerçek JSON dosyalarından soruları çek
      const { title, questions } = getQuestionsBySlug(testSlug);

      // Eğer soru gelmediyse hata vermemek için kontrol
      if (!questions || questions.length === 0) {
        alert("Sorry, no questions found for this category yet.");
        router.push('/');
        return;
      }

      // 3. Payload oluştur
      const attemptPayload = {
        attemptId: `session-${Date.now()}`, // Rastgele ID
        test: {
          title: title,
          duration: 20 // Standart 20 dk (istersen parametreye göre değiştirebiliriz)
        },
        questions: questions
      }

      // 4. Veriyi tarayıcı hafızasına kaydet (Quiz sayfası buradan okuyacak)
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptPayload))

      // 5. Quiz sayfasına yönlendir
      setTimeout(() => {
        router.push(`/quiz/${attemptPayload.attemptId}`)
      }, 500)
    }

    startTest()
  }, [searchParams, router])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center border border-gray-100">
        <h1 className="text-3xl font-black text-blue-600 mb-4">Setting Up Your Test</h1>
        
        <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <p className="text-slate-500 text-lg">Loading questions from our database...</p>
        <p className="text-slate-400 text-sm mt-2">Preparing logic for: <span className="font-mono bg-gray-100 px-2 py-1 rounded">Offline Mode</span></p>
      </div>
    </main>
  )
}

export default function Start() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading interface...</div>}>
      <StartQuizLogic />
    </Suspense>
  )
}
