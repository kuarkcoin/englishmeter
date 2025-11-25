'use client';
import React from 'react';
// Next.js projenizde "Link" bileşeni çalışıyorsa aşağıdaki yorumu kaldırıp <a> etiketlerini <Link> ile değiştirebilirsiniz.
// import Link from 'next/link';

// --- DATA ---
const quickTest = { title: "Quick Placement Test", slug: "quick-placement" };
const megaTest = { title: "Grammar Mega Test (100Q)", slug: "grammar-mega-test-100" };
const vocabTest = { title: "Vocabulary B1-C1 (50Q)", slug: "vocab-b1-c1-50" };

// MEVCUT + YENİ EKLENEN GRAMER KONULARI
// Not: Buradaki 'slug' değerleri (örn: 'test-passive-voice'), sizin json dosyanızdaki başlıklarla birebir aynı olmalı.
const grammarTests = [
  // Mevcut 5 Konu
  { title: "Perfect Tenses", slug: "test-perfect-past" },
  { title: "Conditionals", slug: "test-conditionals" },
  { title: "Relative Clauses", slug: "test-relatives" },
  { title: "Articles", slug: "test-articles" },
  { title: "Mixed Tenses", slug: "test-tenses-mixed" },
  
  // Yeni Eklenen 6 Advanced Konu
  { title: "Passive Voice (Adv)", slug: "test-passive-voice" },
  { title: "Reported Speech (Adv)", slug: "test-reported-speech" },
  { title: "Gerunds & Infinitives", slug: "test-gerunds-infinitives" },
  { title: "Noun/Adj/Adv Clauses", slug: "test-clauses-advanced" },
  { title: "Modal Verbs (Adv)", slug: "test-modals-advanced" },
  { title: "Prepositions (Adv)", slug: "test-prepositions-advanced" },
];

const levelTests = [
  { level: "A1" }, { level: "A2" }, { level: "B1" },
  { level: "B2" }, { level: "C1" }, { level: "C2" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* --- ÜST KISIM (HEADER / HERO) --- */}
      {/* Arena kaldırıldı, yerine sade bir karşılama metni bırakıldı */}
      <div className="bg-slate-900 pt-16 pb-20 px-4 text-center rounded-b-[3rem] shadow-2xl mb-12 relative overflow-hidden">
         {/* Arka plan deseni */}
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

         <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
               GLOBAL ENGLISH TESTS
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
               Find your real English level with our advanced grammar, vocabulary, and placement tests.
            </p>
         </div>
      </div>

      {/* --- TEST BUTONLARI --- */}
      <div className="flex flex-col items-center justify-center px-4 pb-24 -mt-10">
        <div className="w-full max-w-6xl mx-auto text-center">
          
          {/* 3 ANA BUTON (Quick, Mega, Vocab) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 relative z-20">
            <a href="/start" className="flex items-center justify-center px-6 py-8 rounded-2xl bg-blue-600 text-white text-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              🚀 {quickTest.title}
            </a>

            <a href={`/start?testSlug=${megaTest.slug}`} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-purple-600 text-white text-xl font-bold shadow-xl shadow-purple-900/20 hover:bg-purple-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              📦 {megaTest.title}
            </a>

            <a href={`/start?testSlug=${vocabTest.slug}`} className="flex items-center justify-center px-6 py-8 rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              📚 {vocabTest.title}
            </a>
          </div>

          {/* Grammar Focus Bölümü */}
          <div className="mb-20">
            <div className="flex items-center justify-center mb-8">
              <span className="bg-white px-8 py-3 rounded-full text-slate-500 font-bold text-sm border border-slate-200 uppercase tracking-widest shadow-sm">
                Grammar Focus
              </span>
            </div>
            
            {/* Grid Yapısı: Mobilde 1, Tablette 2, Masaüstünde 4 sütun */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grammarTests.map((test) => (
                <a
                  key={test.slug}
                  href={`/start?testSlug=${test.slug}`}
                  className="group px-4 py-5 rounded-xl bg-white text-indigo-700 font-bold shadow-sm border border-indigo-50 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-sm flex items-center justify-center min-h-[70px]"
                >
                  <span className="group-hover:scale-105 transition-transform">
                    {test.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* All Levels Bölümü */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <span className="bg-white px-8 py-3 rounded-full text-slate-500 font-bold text-sm border border-slate-200 uppercase tracking-widest shadow-sm">
                All Levels
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {levelTests.map((test) => (
                <a
                  key={test.level}
                  href={`/levels/${test.level}`}
                  className="px-4 py-10 rounded-2xl bg-white text-slate-700 font-black text-3xl shadow-sm border border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  {test.level}
                </a>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
