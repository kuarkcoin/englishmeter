'use client';



import { useEffect, useState } from 'react';

import Link from 'next/link';



// --- TYPES ---

interface Choice {

  id: string;

  text: string;

  isCorrect?: boolean;

}



interface Question {

  id: string;

  prompt: string;

  choices: Choice[];

  explanation?: string;

  correctChoiceId?: string;

  correct?: string;

  correct_option?: string;

  answer?: string;

}



interface TestInfo {

  title: string;

  duration?: number;

}



interface QuizData {

  attemptId: string;

  test: TestInfo;

  questions: Question[];

  error?: string;

}



// --- HELPER: FORMAT TIME MM:SS ---

function formatTime(seconds: number): string {

  const m = Math.floor(seconds / 60);

  const s = seconds % 60;

  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

}



// --- HELPER: DOĞRU ŞIK ID'SİNİ BUL ---

function getCorrectChoiceId(q: Question): string | undefined {

  const flagged = (q.choices || []).find((c) => c.isCorrect);

  if (flagged) return String(flagged.id).trim();



  const anyQ = q as any;

  const candidate =

    q.correctChoiceId ??

    q.correct ??

    q.correct_option ??

    q.answer ??

    anyQ.correctAnswerId ??

    anyQ.correctAnswer;



  if (candidate != null) return String(candidate).trim();

  return undefined;

}



// --- HELPER: EQUAL ---

function idsEqual(a?: string | null, b?: string | null): boolean {

  if (a == null || b == null) return false;

  return String(a).trim().toUpperCase() === String(b).trim().toUpperCase();

}



// --- HELPER: TEXT FORMATTER (BADGE & CLEAN QUOTES) ---

function formatText(text: string) {

  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*)/g);

  

  return parts.map((part, index) => {

    if (part.startsWith('**') && part.endsWith('**')) {

      let content = part.slice(2, -2);

      // Tırnak işaretlerini temizle

      content = content.replace(/^['"]+|['"]+$/g, '');

      return (

        <span 

          key={index} 

          className="bg-blue-100 text-blue-700 font-extrabold px-3 py-1 rounded-lg mx-1 border border-blue-200 shadow-sm inline-block transform -translate-y-0.5 tracking-wide"

        >

          {content}

        </span>

      );

    }

    return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;

  });

}



export default function Quiz({ params }: { params: { id: string } }) {

  const [data, setData] = useState<QuizData | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [showResult, setShowResult] = useState(false);

  const [score, setScore] = useState(0);



  // 1) LOAD DATA

  useEffect(() => {

    if (typeof window === 'undefined') return;

    const raw = sessionStorage.getItem('em_attempt_payload');

    if (!raw) {

      setData({

        attemptId: '',

        test: { title: 'Error', duration: 0 },

        questions: [],

        error: 'Test data not found. Please start again.',

      });

      return;

    }

    try {

      const parsed: QuizData = JSON.parse(raw);

      setData(parsed);

      const qCount = parsed.questions?.length || 0;

      let duration = qCount * 60; 

      if (duration === 0) duration = 30 * 60;

      setTimeLeft(duration);

    } catch (err) {

      setData({ attemptId: '', test: { title: 'Error', duration: 0 }, questions: [], error: 'Data corrupted.' });

    }

  }, [params.id]);



  // 2) TIMER

  useEffect(() => {

    if (timeLeft === null || showResult) return;

    if (timeLeft <= 0) { handleSubmit(); return; }

    const timerId = setInterval(() => setTimeLeft((p) => (p !== null && p > 0 ? p - 1 : 0)), 1000);

    return () => clearInterval(timerId);

  }, [timeLeft, showResult]);



  // 3) SUBMIT & SAVE MISTAKES (DÜZELTİLMİŞ MANTIK)

  const handleSubmit = () => {

    if (!data) return;



    const { questions } = data;

    let correctCount = 0;



    // Önce mevcut hataları çekelim

    const existingMistakesRaw = localStorage.getItem('my_mistakes');

    let mistakeList: any[] = existingMistakesRaw ? JSON.parse(existingMistakesRaw) : [];



    questions.forEach((q) => {

      const userAnswerId = answers[q.id];

      const correctChoiceId = getCorrectChoiceId(q);

      const isCorrect = idsEqual(userAnswerId, correctChoiceId);



      // Skoru hesapla (Boş da olsa yanlış da olsa skor artmaz)

      if (isCorrect) {

        correctCount++;

      }



      // --- HATA KAYIT MANTIĞI ---

      

      // Sadece cevap verilmişse işlem yap (Boşları atla)

      if (userAnswerId) {

        if (isCorrect) {

          // DOĞRU CEVAP:

          // Eğer bu soru daha önce hata listesinde varsa, artık öğrenildiği için SİL.

          mistakeList = mistakeList.filter((m) => m.id !== q.id);

        } else {

          // YANLIŞ CEVAP:

          // Listeye ekle (Eğer zaten yoksa)

          const alreadyExists = mistakeList.find((m) => m.id === q.id);

          if (!alreadyExists) {

            mistakeList.push({

              ...q,

              myWrongAnswer: userAnswerId,

              savedAt: new Date().toISOString(),

              testTitle: data.test.title

            });

          }

        }

      }

      // Eğer userAnswerId yoksa (boşsa), mistakeList'e dokunma.

    });



    // Güncellenmiş listeyi kaydet

    localStorage.setItem('my_mistakes', JSON.stringify(mistakeList));



    setScore(correctCount);

    setShowResult(true);

    window.scrollTo(0, 0);

    sessionStorage.removeItem('em_attempt_payload');

  };



  if (!data) return <div className="p-10 text-center animate-pulse">Loading...</div>;

  if (data.error) return <div className="p-10 text-red-600">{data.error}</div>;



  const { questions, test } = data;



  // --- RESULT SCREEN ---

  if (showResult) {

    const total = questions.length || 1;

    const percentage = Math.round((score / total) * 100);



    return (

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* SCORE CARD */}

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center relative overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />

          <h1 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h1>

          

          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 mt-6">

            {/* CORRECT */}

            <div className="flex flex-col">

              <span className="text-4xl font-black text-blue-600">{score}</span>

              <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>

            </div>

            

            <div className="w-px h-12 bg-slate-200" />



            {/* TOTAL */}

            <div className="flex flex-col">

              <span className="text-4xl font-black text-slate-700">{questions.length}</span>

              <span className="text-xs font-bold text-slate-400 uppercase">Total</span>

            </div>



            <div className="w-px h-12 bg-slate-200" />



            {/* SCORE */}

            <div className="flex flex-col">

              <span className={`text-4xl font-black ${percentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>

                {percentage}%

              </span>

              <span className="text-xs font-bold text-slate-400 uppercase">Score</span>

            </div>

          </div>



          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <a href="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">

              Back to Home

            </a>

            <Link href="/mistakes" className="px-6 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors border border-red-200 flex items-center justify-center gap-2">

              <span>📕</span> My Mistakes

            </Link>

          </div>

        </div>



       
