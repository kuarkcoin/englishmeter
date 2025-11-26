'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getQuestionsBySlug } from '@/lib/quizManager' 

function StartQuizLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const initQuiz = async () => {
      const slug = searchParams.get('testSlug') || 'quick-placement';
      console.log("TEST BAŞLATILIYOR:", slug);

      // 1. HAM SORULARI ÇEK
      const { title, questions: rawQuestions } = getQuestionsBySlug(slug);

      // 2. VERİYİ DÖNÜŞTÜR (BURASI KRİTİK NOKTA)
      // Gramer sorularını yakalayıp Quiz formatına çevireceğiz.
      const formattedQuestions = rawQuestions.map((item: any, index: number) => {
        
        // --- SENARYO 1: ZATEN HAZIR SORULAR (Vocabulary, Placement vb.) ---
        // Eğer sorunun içinde "choices" dizisi varsa, zaten hazırdır. Dokunma.
        if (item.choices && Array.isArray(item.choices)) {
          return {
            id: item.id || `q-${index}`,
            prompt: item.prompt,
            explanation: item.explanation,
            choices: item.choices.map((c: any, i: number) => ({
              id: c.id || String.fromCharCode(65 + i), // ID yoksa A,B,C ata
              text: c.text,
              isCorrect: c.isCorrect // Burası zaten true/false geliyor
            }))
          };
        }

        // --- SENARYO 2: GRAMER SORULARI (Dönüştürme Gerekiyor) ---
        // Eğer "choices" YOKSA ama "correct" ve "A" varsa, bu bir Gramer sorusudur.
        if (item.correct && item.A) {
          console.log(`Gramer sorusu dönüştürülüyor: ${index + 1}`);
          
          return {
            id: `g-${index}`,
            prompt: item.prompt,
            explanation: item.explanation,
            choices: [
              // Şıkları manuel oluşturuyoruz ve doğru olanı işaretliyoruz
              { id: 'A', text: item.A, isCorrect: item.correct === 'A' },
              { id: 'B', text: item.B, isCorrect: item.correct === 'B' },
              { id: 'C', text: item.C, isCorrect: item.correct === 'C' },
              { id: 'D', text: item.D, isCorrect: item.correct === 'D' }
            ]
          };
        }

        // --- SENARYO 3: KELİME LİSTESİ (Sadece word/definition varsa) ---
        if (item.word && item.definition) {
            return {
             id: `w-${index}`,
             prompt: `What is the definition of "<strong>${item.word}</strong>"?`,
             explanation: `${item.word}: ${item.definition}`,
             choices: [
               { id: 'A', text: item.definition, isCorrect: true },
               { id: 'B', text: "Incorrect definition example 1", isCorrect: false },
               { id: 'C', text: "Incorrect definition example 2", isCorrect: false }
             ]
           };
        }

        return null;
      }).filter(Boolean); // Boş verileri temizle

      console.log("DÖNÜŞTÜRÜLMÜŞ SORULAR:", formattedQuestions);

      // 3. PAKETLE
      const attemptData = {
        attemptId: `session-${Date.now()}`,
        test: {
          title: title,
          duration: 0 // Quiz.tsx bunu görünce otomatik süre hesaplar
        },
        questions: formattedQuestions
      };

      // 4. KAYDET
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptData));

      // 5. YÖNLENDİR
      setTimeout(() => {
        router.push(`/quiz/${attemptData.attemptId}`);
      }, 500);
    }

    initQuiz();
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-bold text-slate-800">Test Hazırlanıyor...</h1>
      <p className="text-slate-500 mt-2">Sorular formatlanıyor, lütfen bekleyin.</p>
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
