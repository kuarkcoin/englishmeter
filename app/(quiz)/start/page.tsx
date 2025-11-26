'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getQuestionsBySlug } from '@/lib/quizManager' 

function StartQuizLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const initQuiz = async () => {
      // 1. URL'den ne istendiğini al
      const slug = searchParams.get('testSlug') || 'quick-placement';
      console.log("Başlatılıyor:", slug);

      // 2. HAM SORULARI ÇEK
      // Buradan gelen 'rawQuestions' senin JSON'daki ham halidir.
      const { title, questions: rawQuestions } = getQuestionsBySlug(slug);

      // 3. VERİYİ DÖNÜŞTÜR (Universal Adapter)
      // Bu kısım Gramer, Kelime veya Hazır soruların hepsini Quiz formatına çevirir.
      const formattedQuestions = rawQuestions.map((item: any, index: number) => {
        
        // DURUM A: Gramer Soruları (Flat Yapı: "A": "...", "correct": "B")
        if ('A' in item && 'correct' in item) {
          return {
            id: `q-${index}`,
            prompt: item.prompt,
            explanation: item.explanation,
            choices: [
              { id: 'A', text: item.A, isCorrect: item.correct === 'A' },
              { id: 'B', text: item.B, isCorrect: item.correct === 'B' },
              { id: 'C', text: item.C, isCorrect: item.correct === 'C' },
              { id: 'D', text: item.D, isCorrect: item.correct === 'D' }
            ]
          };
        }

        // DURUM B: Kelime Listesi (Word/Definition) - Basit Soruya Çevirme
        // Not: Çeldirici şık üretmek için tüm havuzu kullanmak gerekir ama 
        // basitlik adına burada sadece doğru cevabı verip Quiz'de hata vermesini engelliyoruz.
        // Eğer detaylı kelime testi algoritması istiyorsan önceki verdiğim o uzun kodu buraya gömmemiz gerekir.
        // Şimdilik hata vermemesi için standart formata sokuyoruz:
        if ('word' in item && 'definition' in item) {
           return {
             id: `w-${index}`,
             prompt: `What is the definition of "<strong>${item.word}</strong>"?`,
             explanation: `${item.word}: ${item.definition}`,
             choices: [
               { id: 'A', text: item.definition, isCorrect: true },
               // Geçici olarak rastgele yanlış şıklar (Kodun patlamaması için)
               { id: 'B', text: "Incorrect definition 1", isCorrect: false },
               { id: 'C', text: "Incorrect definition 2", isCorrect: false }
             ]
           };
        }

        // DURUM C: Zaten Hazır Sorular (choices dizisi var)
        if ('choices' in item) {
          return {
            id: item.id || `q-${index}`, // ID yoksa ekle
            prompt: item.prompt,
            explanation: item.explanation,
            choices: item.choices.map((c: any, i: number) => ({
              id: c.id || String.fromCharCode(65 + i), // ID yoksa A,B,C ver
              text: c.text,
              isCorrect: c.isCorrect
            }))
          };
        }

        return null;
      }).filter(Boolean); // Boş (null) dönenleri temizle

      // 4. SÜRE HESAPLAMASI (Soru Sayısı x 1 Dakika)
      // Quiz bileşeni 0 gönderirsek otomatik hesaplıyor ama burdan da gönderebiliriz.
      // Biz duration: 0 gönderelim, Quiz.tsx içindeki akıllı sayaç halletsin.
      
      const attemptData = {
        attemptId: `session-${Date.now()}`,
        test: {
          title: title,
          duration: 0 // Quiz bileşeni bunu görünce (Soru Sayısı * 60sn) yapacak.
        },
        questions: formattedQuestions
      };

      // 5. HAFIZAYA YAZ
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptData));

      // 6. YÖNLENDİR
      setTimeout(() => {
        router.push(`/quiz/${attemptData.attemptId}`);
      }, 500);
    }

    initQuiz();
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-bold text-slate-800">Preparing your test...</h1>
      <p className="text-slate-500 mt-2">Optimizing questions for your level.</p>
    </div>
  )
}

export default function Start() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartQuizLogic />
    </Suspense>
  )
}
