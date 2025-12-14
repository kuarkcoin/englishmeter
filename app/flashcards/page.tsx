// app/flashcards/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 3000 kelimelik listeni buradan çekiyoruz
import fullWordList from '@/data/yds_vocabulary.json'; 

export default function FlashcardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);

  // Sayfa açılınca kelimeleri karıştır
  useEffect(() => {
    const shuffled = [...fullWordList].sort(() => 0.5 - Math.random());
    setCards(shuffled);
  }, []);

  const handleNext = () => {
    setIsFlipped(false); // Önce kartı düzelt
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setViewedCount((prev) => prev + 1);
    }, 200); // Dönme animasyonu bitince değiştir
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 200);
    }
  };

  if (cards.length === 0) return <div className="min-h-screen bg-emerald-50 flex items-center justify-center">Loading...</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Üst Bilgi Barı */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 px-2">
        <Link href="/" className="text-slate-500 hover:text-emerald-600 font-bold flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Exit
        </Link>
        <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
          Card {viewedCount + 1} / 3000
        </div>
      </div>

      {/* --- KART ALANI (3D FLIP EFFECT) --- */}
      <div 
        className="group w-full max-w-md h-96 perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* ÖN YÜZ (İngilizce) */}
          <div className="absolute w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col items-center justify-center backface-hidden p-8">
            <span className="absolute top-6 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">English</span>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mb-6 text-emerald-600">
              🇬🇧
            </div>
            <h2 className="text-4xl font-black text-slate-800 text-center leading-tight">
              {currentCard.word}
            </h2>
            <p className="absolute bottom-6 text-slate-400 text-sm animate-pulse">
              Tap to flip ↻
            </p>
          </div>

          {/* ARKA YÜZ (Türkçe) */}
          <div className="absolute w-full h-full bg-emerald-600 rounded-3xl shadow-2xl border border-emerald-500 flex flex-col items-center justify-center backface-hidden rotate-y-180 p-8 text-white">
            <span className="absolute top-6 left-6 text-xs font-bold text-emerald-200 uppercase tracking-widest">Turkish</span>
             <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-3xl mb-6 text-white">
              🇹🇷
            </div>
            <h2 className="text-4xl font-black text-center leading-tight">
              {currentCard.meaning}
            </h2>
            <p className="absolute bottom-6 text-emerald-200 text-sm">
              Tap to see English ↻
            </p>
          </div>

        </div>
      </div>

      {/* Kontrol Butonları */}
      <div className="flex gap-4 mt-10 w-full max-w-md">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          disabled={currentIndex === 0}
          className="flex-1 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
        >
          ← Prev
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="flex-[2] py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30 active:scale-95"
        >
          Next Card →
        </button>
      </div>

      {/* CSS STYLE (Tailwind config değiştirmemek için buraya ekliyoruz) */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
