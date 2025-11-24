'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// ÖRNEK SORULAR (Veritabanı olmadığı için buraya ekliyoruz)
const MOCK_QUESTIONS = [
  {
    id: "q1",
    prompt: "I ______ to the cinema yesterday.",
    choices: [
      { id: "a", text: "go" },
      { id: "b", text: "went" }, // Doğru cevap
      { id: "c", text: "gone" },
      { id: "d", text: "have gone" }
    ]
  },
  {
    id: "q2",
    prompt: "She ______ a book right now.",
    choices: [
      { id: "a", text: "reads" },
      { id: "b", text: "is reading" }, // Doğru cevap
      { id: "c", text: "read" },
      { id: "d", text: "reading" }
    ]
  },
  {
    id: "q3",
    prompt: "If I ______ you, I would accept the offer.",
    choices: [
      { id: "a", text: "was" },
      { id: "b", text: "were" }, // Doğru cevap
      { id: "c", text: "am" },
      { id: "d", text: "be" }
    ]
  }
];

function StartQuizLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const startTest = async () => {
      // URL'den slug'ı al (örn: test-perfect-past)
      const testSlug = searchParams.get('testSlug') || 'quick-placement'
      
      // --- API ÇAĞRISI İPTAL EDİLDİ ---
      // Veritabanı olmadığı için elle veri oluşturuyoruz:
      
      const mockPayload = {
        attemptId: 'offline-session-' + Date.now(), // Rastgele bir ID
        test: {
          title: testSlug.replace(/-/g, ' ').toUpperCase(), // Slug'ı başlığa çevir
          duration: 30 // Dakika
        },
        questions: MOCK_QUESTIONS // Yukarıdaki soruları kullan
      }

      // Veriyi tarayıcı hafızasına kaydet (Quiz sayfası buradan okuyacak)
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(mockPayload))

      // Quiz sayfasına yönlendir (Sonsuz döngüyü kırmak için 1 saniye bekletiyoruz)
      setTimeout(() => {
        router.push(`/quiz/${mockPayload.attemptId}`)
      }, 1000)
    }

    startTest()
  }, [searchParams, router])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Preparing Your Test...</h1>
        <p className="text-slate-600">Setting up the environment without database...</p>
        <div className="mt-4 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </main>
  )
}

export default function Start() {
  return (
    <Suspense fallback={<main><h1>Loading...</h1></main>}>
      <StartQuizLogic />
    </Suspense>
  )
}
