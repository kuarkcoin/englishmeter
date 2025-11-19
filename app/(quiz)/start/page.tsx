'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function StartQuizLogic() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const startTest = async () => {

      // 1. DEĞİŞİKLİK: Artık 'level'ı değil, 'testSlug'ı okuyoruz
      const slugFromUrl = searchParams.get('testSlug')

      // 2. 'level' hesaplamasını sildik.
      // Slug URL'de varsa onu kullan, yoksa 'quick-placement' kullan
      const testSlug = slugFromUrl ? slugFromUrl : 'quick-placement'

      // 3. API'yi doğru test slug'ı ile çağır
      const res = await fetch('/api/attempts', { 
        method:'POST', 
        body: JSON.stringify({ testSlug: testSlug }) 
      })

      const data = await res.json()

      if (data.error) { 
        alert(`Test not found: ${data.error}. Did you run the seed script?`); 
        location.href = '/' // Hata olursa ana sayfaya yolla
        return; 
      }

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(data))
      location.href = `/quiz/${data.attemptId}`
    }
    startTest()
  }, [searchParams])

  return (
    <main>
      <h1 className="text-2xl font-bold">Preparing Your Test...</h1>
      <p className="text-slate-600 mt-2">Please wait, redirecting to the quiz...</p>
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