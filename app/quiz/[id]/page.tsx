'use client'
import { useEffect, useState, useRef } from 'react'

// 1. Kalan süreyi (saniye) MM:SS formatına çeviren yardımcı fonksiyon
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Quiz({ params }:{ params:{ id:string } }){
  const [data, setData] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string,string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const isSubmitting = useRef(false);

  useEffect(()=>{
    const raw = sessionStorage.getItem('em_attempt_payload')
    if(raw){ 
      const parsedData = JSON.parse(raw);
      setData(parsedData);
      
      if (parsedData.test?.duration) {
        setTimeLeft(parsedData.test.duration * 60);
      }
      
    } else { 
      setData({ error: 'No attempt payload. Go to Start.' }) 
    }
  },[])

  // Sayaç için useEffect hook'u
  useEffect(() => {
    if (timeLeft === null || timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime ? prevTime - 1 : 0));
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timerId);
      alert("Time is up! Your test will be submitted automatically."); // Burayı da İngilizce'ye çevirdim
      submit();
    }

    return () => clearInterval(timerId);
    
  }, [timeLeft]);


  if(!data) return <div>Loading…</div>
  if(data.error) return <div className="text-red-600">{data.error}</div>
  
  const { questions, attemptId, test } = data
  
  const submit = async()=>{
    if (isSubmitting.current) return;
    isSubmitting.current = true; 

    const res = await fetch(`/api/attempts/${attemptId}/submit`, { method:'POST', body: JSON.stringify({ answers }) })
    const r = await res.json()
    
    sessionStorage.removeItem('em_attempt_payload');
    
    location.href = `/result?id=${r.attemptId}`
  }
  
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-600">Test: {test?.title}</div>
      
      {/* 8. DEĞİŞİKLİK: Sayacı (Timer) İngilizce yaptık */}
      <div className="text-lg font-bold text-blue-600 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200">
        Time Left: {timeLeft !== null ? formatTime(timeLeft) : '...'}
      </div>
    </div>
    
    {questions.map((q:any, idx:number)=>(
      <div key={q.id} className="card">
        <div className="text-sm text-slate-500 mb-2">Question {idx+1}</div>
        <div className="text-lg font-semibold mb-4" dangerouslySetInnerHTML={{__html: q.prompt}} />
        <div className="grid gap-2">
          {q.choices.map((c:any)=>(
            <label key={c.id} className={`cursor-pointer rounded-xl border p-3 ${answers[q.id]===c.id? 'border-brand ring-2 ring-brand/10 bg-blue-50':'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name={q.id} className="mr-2" checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({ ...a, [q.id]: c.id }))} />
              {c.text}
            </label>
          ))}
        </div>
      </div>
    ))}
    <button onClick={submit} disabled={isSubmitting.current} className="btn btn-primary disabled:opacity-50">
      {isSubmitting.current ? 'Submitting...' : 'Finish'}
    </button>
  </div>
}