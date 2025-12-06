'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// --- İkonlar ---
const Clock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);
const XCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);
const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const BookOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

// --- Veri Tipi ---
type StandardQuestion = {
  question: string;
  options: string[];
  answer: string;
  solution: string;
};

export default function TestExamPage() {
  const params = useParams();
  const testId = params?.testId as string;

  // --- State ---
  const [questions, setQuestions] = useState<StandardQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [debugData, setDebugData] = useState<any>(null); // Hata ayıklama için
  
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [score, setScore] = useState({ correct: 0, incorrect: 0, empty: 0, net: 0 });

  // --- 1. Veri Çekme ---
  useEffect(() => {
    if (!testId) return;
    setLoading(true);

    // CACHE BUSTER: ?t=... ekleyerek tarayıcının eski dosyayı kullanmasını engelliyoruz
    fetch(`/data/tests/${testId}.json?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error("Dosya bulunamadı");
        return res.json();
      })
      .then(rawdata => {
        setDebugData(rawdata); // Ham veriyi debug için sakla

        let rawList: any[] = [];
        if (Array.isArray(rawdata)) rawList = rawdata;
        else if (rawdata.questions && Array.isArray(rawdata.questions)) rawList = rawdata.questions;
        else rawList = [];

        // --- GELİŞMİŞ VERİ DÖNÜŞTÜRÜCÜ ---
        const normalizedList: StandardQuestion[] = rawList.map(item => {
          let opts: string[] = [];

          // Tüm olası şık formatlarını kontrol et
          if (Array.isArray(item.options)) opts = item.options;
          else if (Array.isArray(item.secenekler)) opts = item.secenekler;
          else if (Array.isArray(item.sıklar)) opts = item.sıklar; // Türkçe karakter ihtimali
          
          // A,B,C,D,E key kontrolü (Büyük/Küçük harf duyarlı)
          else {
             const possibleKeys = ['A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e'];
             let tempOpts = [];
             // Sırayla bakıyoruz, eğer A varsa ekle, B varsa ekle...
             if(item.A || item.a) tempOpts.push(item.A || item.a);
             if(item.B || item.b) tempOpts.push(item.B || item.b);
             if(item.C || item.c) tempOpts.push(item.C || item.c);
             if(item.D || item.d) tempOpts.push(item.D || item.d);
             if(item.E || item.e) tempOpts.push(item.E || item.e);
             
             if (tempOpts.length > 0) opts = tempOpts;
          }
          
          // Nesne formatı kontrolü
          if (opts.length === 0 && typeof item.options === 'object' && item.options !== null) {
            opts = Object.values(item.options);
          }

          return {
            question: item.question || item.soru || "Soru metni bulunamadı.",
            options: opts.filter(o => o && o.toString().trim() !== ""), // Boş şıkları temizle
            answer: (item.answer || item.cevap || "").toString().trim().toUpperCase(),
            solution: item.solution || item.cozum || item.aciklama || ""
          };
        });
        
        setQuestions(normalizedList);

        if (normalizedList.length > 0) {
           setTimeLeft(normalizedList.length * 90);
        } else {
           // Veri geldi ama soru listesi boş çıktı
           setError(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Hata:", err);
        setError(true);
        setLoading(false);
      });
  }, [testId]);

  // --- 2. Sayaç ---
  useEffect(() => {
    if (loading || isExamFinished || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishExam(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, isExamFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionIndex: number, optionText: string) => {
    if (isExamFinished) return; 
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionText
    }));
  };

  // --- 3. Sınav Bitir & Kontrol ---
  const finishExam = () => {
    setIsExamFinished(true);
    let correct = 0;
    let incorrect = 0;
    
    questions.forEach((q, idx) => {
      const userAnswer = userAnswers[idx];
      if (userAnswer) {
        // İndeks bul (A=0, B=1...)
        const optionIndex = q.options.findIndex(opt => opt === userAnswer);
        const letterAnswer = String.fromCharCode(65 + optionIndex); // 0 -> "A"

        // Doğru mu? (Metin eşleşmesi VEYA Harf eşleşmesi)
        // Boşlukları sil ve küçük harfe çevirerek karşılaştır (Daha güvenli)
        const cleanUserText = userAnswer.toString().replace(/\s+/g, '').toLowerCase();
        const cleanCorrectText = q.answer.toString().replace(/\s+/g, '').toLowerCase();
        
        const isTextMatch = cleanUserText === cleanCorrectText;
        const isLetterMatch = letterAnswer === q.answer; // "A" === "A"

        if (isTextMatch || isLetterMatch) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const empty = questions.length - (correct + incorrect);
    const net = correct - (incorrect * 0.25); 
    setScore({ correct, incorrect, empty, net });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-500">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p>Yeni veriler yükleniyor (v3)...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-800">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Link>

          <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1 rounded-lg ${timeLeft < 300 && !isExamFinished ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-600'}`}>
            <Clock className="w-5 h-5" />
            {isExamFinished ? "Bitti" : formatTime(timeLeft)}
          </div>

          {!isExamFinished && (
            <button 
              onClick={finishExam}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
            >
              Bitir
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Sonuç Kartı */}
        {isExamFinished && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-100 animate-in slide-in-from-top-4">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Sınav Sonucu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-sm text-slate-500 font-semibold uppercase">Soru</div>
                <div className="text-2xl font-bold text-slate-900">{questions.length}</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-sm text-emerald-600 font-semibold uppercase">Doğru</div>
                <div className="text-2xl font-bold text-emerald-700">{score.correct}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="text-sm text-red-600 font-semibold uppercase">Yanlış</div>
                <div className="text-2xl font-bold text-red-700">{score.incorrect}</div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="text-sm text-indigo-600 font-semibold uppercase">Net</div>
                <div className="text-2xl font-bold text-indigo-700">{score.net.toFixed(2)}</div>
              </div>
            </div>
             <div className="mt-6 text-center">
               <button onClick={() => window.location.reload()} className="text-indigo-600 font-medium underline">Tekrar Çöz</button>
            </div>
          </div>
        )}

        {/* --- HATA MESAJI (Eğer sorular boşsa) --- */}
        {questions.length === 0 && !loading && (
             <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
                <p className="font-bold">Sorular yüklenemedi!</p>
                <p className="text-sm">Aşağıdaki DEBUG alanını kontrol edin.</p>
             </div>
        )}

        {/* Sorular */}
        {questions.map((q, qIndex) => {
          const userAnswer = userAnswers[qIndex];
          
          return (
            <div key={qIndex} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-700 font-bold rounded-xl">
                  {qIndex + 1}
                </div>
                <div className="flex-1 pt-1">
                   <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
                    {q.question}
                  </p>
                </div>
              </div>

              {/* Şıklar */}
              <div className="space-y-3 pl-0 md:pl-14">
                {q.options.map((opt, optIndex) => {
                  const letter = String.fromCharCode(65 + optIndex); // A, B, C...
                  
                  // --- RENKLENDİRME MANTIĞI ---
                  let styleClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600";
                  let circleClass = "bg-white text-slate-400 border-slate-200 group-hover:border-slate-400";
                  
                  // Doğru cevap kontrolü (Metin veya Harf)
                  const isActuallyCorrect = 
                      (q.answer === letter) || 
                      (q.answer.replace(/\s+/g, '').toLowerCase() === opt.replace(/\s+/g, '').toLowerCase());

                  if (!isExamFinished) {
                    // Sınav Devam Ederken
                    if (userAnswer === opt) {
                      styleClass = "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-500";
                      circleClass = "bg-indigo-600 text-white border-indigo-600";
                    }
                  } else {
                    // Sınav Bittiğinde
                    const isSelected = (userAnswer === opt);

                    if (isActuallyCorrect) {
                      // 1. DOĞRU CEVAP İSE -> YEŞİL (Seçilse de seçilmese de)
                      styleClass = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-500";
                      circleClass = "bg-emerald-500 text-white border-emerald-500";
                    } else if (isSelected) {
                      // 2. SEÇİLEN AMA YANLIŞ CEVAP -> KIRMIZI
                      styleClass = "border-red-500 bg-red-50 text-red-700 opacity-80";
                      circleClass = "bg-red-500 text-white border-red-500";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleOptionSelect(qIndex, opt)}
                      disabled={isExamFinished}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 group relative ${styleClass}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors flex-shrink-0 ${circleClass}`}>
                        {letter}
                      </div>
                      <span className="flex-1">{opt}</span>
                      
                      {/* Bitiş İkonları */}
                      {isExamFinished && isActuallyCorrect && <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 absolute right-4" />}
                      {isExamFinished && !isActuallyCorrect && userAnswer === opt && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 absolute right-4" />}
                    </button>
                  );
                })}
              </div>

              {/* --- ÇÖZÜM ALANI --- */}
              {isExamFinished && q.solution && (
                <div className="mt-6 ml-0 md:ml-14 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-800">Çözüm / Açıklama</span>
                  </div>
                  <p className="text-blue-900 text-sm leading-relaxed">
                    {q.solution}
                  </p>
                </div>
              )}

            </div>
          );
        })}
        
        {!isExamFinished && questions.length > 0 && (
          <div className="flex justify-center py-8">
            <button onClick={finishExam} className="w-full md:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
              Sınavı Tamamla
            </button>
          </div>
        )}
      </div>

      {/* --- DEBUG ALANI (Sayfanın en altı) --- */}
      <div className="max-w-3xl mx-auto mt-10 p-4 bg-black text-green-400 font-mono text-xs rounded-lg overflow-x-auto opacity-80">
        <p className="font-bold mb-2">--- DEBUG BİLGİSİ (Sadece Hata Varsa Bakın) ---</p>
        <p>Yüklenen Dosya: {testId}.json</p>
        <p>Soru Sayısı: {questions.length}</p>
        <p>Ham Veri Örneği (İlk Soru):</p>
        <pre>{JSON.stringify(debugData ? (Array.isArray(debugData) ? debugData[0] : debugData.questions?.[0]) : "Veri Yok", null, 2)}</pre>
      </div>

    </main>
  );
}
