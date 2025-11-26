'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getQuestionsBySlug } from '@/lib/quizManager' 

function StartQuizLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const initQuiz = async () => {
      // 1. URL'den hangi testin istendiğini al
      const slug = searchParams.get('testSlug') || 'quick-placement';
      console.log("TEST BAŞLATILIYOR:", slug);

      // 2. HAM SORULARI ÇEK
      // getQuestionsBySlug fonksiyonu senin JSON dosyandan veriyi ham haliyle getirir.
      const { title, questions: rawQuestions } = getQuestionsBySlug(slug);

      // 3. VERİYİ DÖNÜŞTÜR (SORUNU ÇÖZEN KISIM BURASI)
      const formattedQuestions = rawQuestions.map((item: any, index: number) => {
        
        // --- DURUM A: GRAMER SORULARI (Sorunun Kaynağı Burasıydı) ---
        // Eğer soruda "correct" ve "A" şıkkı varsa, bu bir Gramer sorusudur.
        // Biz bunu Quiz bileşeninin anlayacağı "choices" yapısına çeviriyoruz.
        if (item.correct && item.A) {
          return {
            id: `g-${index}`,
            prompt: item.prompt,
            explanation: item.explanation,
            choices: [
              // Şıkları oluşturup, doğru olanın içine "isCorrect: true" koyuyoruz.
              // item.correct 'A' ise, A şıkkı true olur.
              { id: 'A', text: item.A, isCorrect: item.correct === 'A' },
              { id: 'B', text: item.B, isCorrect: item.correct === 'B' },
              { id: 'C', text: item.C, isCorrect: item.correct === 'C' },
              { id: 'D', text: item.D, isCorrect: item.correct === 'D' }
            ]
          };
        }

        // --- DURUM B: KELİME LİSTESİ (Word/Definition) ---
        // Sadece kelime ve anlam varsa basit soruya çeviriyoruz.
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

        // --- DURUM C: ZATEN HAZIR SORULAR (Vocabulary Testi Gibi) ---
        // Bunlar zaten çalışıyordu, aynen geçiriyoruz.
        if (item.choices) {
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

        return null;
      }).filter(Boolean); // Boş verileri temizle

      console.log("DÖNÜŞTÜRÜLMÜŞ VERİ:", formattedQuestions);

      // 4. VERİYİ PAKETLE
      const attemptData = {
        attemptId: `session-${Date.now()}`,
        test: {
          title: title,
          duration: 0 // Quiz.tsx bunu görünce "Soru Sayısı x 60sn" yapacak.
        },
        questions: formattedQuestions
      };

      // 5. TARAYICI HAFIZASINA KAYDET
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptData));

      // 6. QUIZ SAYFASINA GİT
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
