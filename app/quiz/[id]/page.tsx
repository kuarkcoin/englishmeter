'use client'
import { useEffect, useState, useRef } from 'react'

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Quiz({ params }:{ params:{ id:string } }){
  const [data, setData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const isSubmitting = useRef(false);

  useEffect(()=>{
    const raw = sessionStorage.getItem('em_attempt_payload');
    if(raw){ 
      const parsedData = JSON.parse(raw);
      if (parsedData.attemptId === params.id || parsedData) {
          setData(parsedData);
          if (parsedData.test?.duration) {
            setTimeLeft(parsedData.test.duration * 60);
          }
      }
    } else { 
      setData({ error: 'Test data not found. Please start again.' }) 
    }
  },[params.id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft === 0 || showResult) return;
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime && prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    if (timeLeft <= 0) {
      clearInterval(timerId);
      submit();
    }
    return () => clearInterval(timerId);
  }, [timeLeft, showResult]);

  if(!data) return <div className="p-10 text-center text-lg text-slate-500">Loading Test...</div>;
  if(data.error) return <div className="p-10 text-center text-red-600 font-bold">{data.error}</div>;
  
  const { questions, attemptId, test } = data;
  
  // --- SUBMIT (PUANLAMA) ---
  const submit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    // SCENARIO A: Grammar Focus (Client-Side)
    if (attemptId && String(attemptId).startsWith('session-')) {
        let correctCount = 0;
        questions.forEach((q: any) => {
            // DÜZELTME BURADA: Cevap verilmiş mi kontrol et (answers[q.id] var mı?)
            if (answers[q.id] && answers[q.id] === q.correct) {
                correctCount++;
            }
        });

        setScore(correctCount);
        setShowResult(true);
        window.scrollTo(0, 0);
        isSubmitting.current = false;
        return;
    }

    // SCENARIO B: Real Tests (Server-Side)
    try {
        const res = await fetch(`/api/attempts/${attemptId}/submit`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers }) 
        });
        
        if(!res.ok) throw new Error("Submission Failed");
        const r = await res.json();
        sessionStorage.removeItem('em_attempt_payload');
        window.location.href = `/result?id=${r.attemptId}`;
    } catch (error: any) {
        alert("Error submitting test. Please try again.");
        isSubmitting.current = false;
    }
  }

  // --- RESULT SCREEN ---
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>
          <div className="flex justify-center items-center gap-6 mb-8 mt-6">
             <div className="flex flex-col">
                <span className="text-5xl font-black text-blue-600">{score}</span>
                <span className="text-sm font-bold text-slate-400 uppercase">Correct</span>
             </div>
             <div className="w-px h-16 bg-slate-200"></div>
             <div className="flex flex-col">
                <span className="text-5xl font-black text-slate-700">{questions.length}</span>
                <span className="text-sm font-bold text-slate-400 uppercase">Total</span>
             </div>
             <div className="w-px h-16 bg-slate-200"></div>
             <div className="flex flex-col">
                <span className={`text-5xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>{percentage}%</span>
                <span className="text-sm font-bold text-slate-400 uppercase">Score</span>
             </div>
          </div>
          <a href="/" className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">Back to Home</a>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-700 ml-2">Detailed Analysis</h2>
          {questions.map((q: any, idx: number) => {
            const userAnswer = answers[q.id];
            // DÜZELTME: Cevap yoksa false kabul et
            const isCorrect = userAnswer && (userAnswer === q.correct);
            const isSkipped = !userAnswer;
            
            return (
              <div key={q.id} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect ? 'bg-green-500' : (isSkipped ? 'bg-slate-400' : 'bg-red-500')}`}>
                    {isCorrect ? '✓' : (isSkipped ? '-' : '✕')}
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm text-slate-400 font-bold mb-2 uppercase">Question {idx + 1}</div>
                    <div className="text-lg font-medium text-slate-800 mb-4" dangerouslySetInnerHTML={{__html: q.prompt}} />
                    
                    <div className="grid gap-2">
                      {q.choices.map((c: any) => {
                        const isSelected = userAnswer === c.id;
                        const isTheCorrectAnswer = q.correct === c.id;
                        
                        let itemClass = "p-3 rounded-lg border flex items-center justify-between ";
                        if (isTheCorrectAnswer) {
                            itemClass += "bg-green-100 border-green-300 text-green-800 font-semibold"; 
                        } else if (isSelected && !isTheCorrectAnswer) {
                            itemClass += "bg-red-100 border-red-300 text-red-800"; 
                        } else {
                            itemClass += "bg-white border-slate-200 text-slate-500 opacity-60"; 
                        }

                        return (
                          <div key={c.id} className={itemClass}>
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${isTheCorrectAnswer ? 'border-green-500 bg-green-500 text-white' : (isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300')}`}>
                                    {c.id}
                                </div>
                                <span>{c.text}</span>
                            </div>
                            {isTheCorrectAnswer && <span className="text-green-600 text-sm font-bold">Correct Answer</span>}
                            {isSelected && !isTheCorrectAnswer && <span className="text-red-600 text-sm font-bold">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                            <span className="font-bold block mb-1">💡 Explanation:</span>
                            {q.explanation}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- QUIZ RENDER ---
  return (
  <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-10">
      <div className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{test?.title || 'Test'}</div>
      <div className={`text-lg font-bold px-4 py-2 rounded-lg border ${timeLeft !== null && timeLeft < 60 ? 'text-red-600 bg-red-50 border-red-200' : 'text-blue-600 bg-blue-50 border-blue-200'}`}>
        {timeLeft !== null ? formatTime(timeLeft) : '∞'}
      </div>
    </div>
    <div className="space-y-6">
        {questions.map((q:any, idx:number)=>(
        <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-400 font-bold mb-3 uppercase tracking-wide">Question {idx+1}</div>
            <div className="text-xl font-medium text-slate-800 mb-6 leading-relaxed" dangerouslySetInnerHTML={{__html: q.prompt}} />
            <div className="grid gap-3">
            {q.choices.map((c:any)=>(
                <label key={c.id} className={`group cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${answers[q.id]===c.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${answers[q.id]===c.id ? 'border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                    {answers[q.id]===c.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <input type="radio" name={q.id} className="hidden" checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({ ...a, [q.id]: c.id }))} />
                <span className={`text-lg ${answers[q.id]===c.id ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>{c.text}</span>
                </label>
            ))}
            </div>
        </div>
        ))}
    </div>
    <div className="pt-4 pb-12">
        <button onClick={submit} disabled={isSubmitting.current} className={`w-full py-4 rounded-xl text-white text-xl font-bold shadow-lg transition-all transform active:scale-95 ${isSubmitting.current ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}>
        {isSubmitting.current ? 'Processing Results...' : 'Finish Test'}
        </button>
    </div>
  </div>
  )
}
