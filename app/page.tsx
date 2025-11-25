'use client';
import Link from 'next/link';

// --- DATA (Linkler Aynen Korundu) ---
const quickTest = { title: "Quick Placement Test", slug: "quick-placement" };
const megaTest = { title: "Grammar Mega Test (100Q)", slug: "grammar-mega-test-100" };
const vocabTest = { title: "Vocabulary B1-C1 (50Q)", slug: "vocab-b1-c1-50" };

const grammarTests = [
  { title: "Perfect Tenses", slug: "test-perfect-past" },
  { title: "Conditionals", slug: "test-conditionals" },
  { title: "Relative Clauses", slug: "test-relatives" },
  { title: "Articles", slug: "test-articles" },
  { title: "Mixed Tenses", slug: "test-tenses-mixed" },
];

const levelTests = [
  { level: "A1" }, { level: "A2" }, { level: "B1" },
  { level: "B2" }, { level: "C1" }, { level: "C2" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* --- ARENA BÖLÜMÜ (Sayaç Kaldırıldı) --- */}
      <div className="bg-slate-900 pt-10 pb-14 px-4 text-center rounded-b-[3rem] shadow-2xl mb-12 relative overflow-hidden">
         
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

         <h1 className="text-3xl md:text-5xl font-black text-white mb-3 relative z-10 tracking-tight">
            GLOBAL ENGLISH ARENA
         </h1>
         <p className="text-blue-200 mb-8 relative z-10 text-sm md:text-base font-medium">
            Compete live with thousands of students worldwide.
         </p>

         <Link href="/race" className="group relative z-10 inline-flex items-center justify-center gap-3 px-8 py-4 md:px-12 md:py-5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-yellow-500 to-red-600 rounded-2xl hover:scale-105 hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] focus:outline-none ring-offset-2 focus:ring-4 ring-yellow-400">
            <span className="text-3xl animate-bounce">⚔️</span>
            <div className="text-left">
              <span className="block text-[10px] md:text-xs uppercase text-yellow-100 tracking-wider font-bold">Join Live Race</span>
              <span className="block text-xl md:text-2xl font-black">ENTER THE ARENA</span>
            </div>
         </Link>
      </div>


      {/* --- DİĞER TESTLER --- */}
      <div className="flex flex-col items-center justify-center py-8 px-4 pb-20">
        <div className="w-full max-w-6xl mx-auto text-center">
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-600 mb-4">
            Find your real English level.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Take our quick placement test, check your grammar, or choose a level directly below.
          </p>

          {/* 3 ANA BUTON */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <Link href="/start" className="flex items-center justify-center px-6 py-6 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              🚀 {quickTest.title}
            </Link>

            <Link href={`/start?testSlug=${megaTest.slug}`} className="flex items-center justify-center px-6 py-6 rounded-2xl bg-purple-600 text-white text-lg font-bold shadow-xl shadow-purple-200 hover:bg-purple-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              📦 {megaTest.title}
            </Link>

            <Link href={`/start?testSlug=${vocabTest.slug}`} className="flex items-center justify-center px-6 py-6 rounded-2xl bg-emerald-600 text-white text-lg font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              📚 {vocabTest.title}
            </Link>
          </div>

          {/* Grammar Focus */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <span className="bg-white px-6 py-2 rounded-full text-slate-500 font-bold text-sm border border-slate-200 uppercase tracking-wider shadow-sm">
                Grammar Focus
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {grammarTests.map((test) => (
                <Link
                  key={test.slug}
                  href={`/start?testSlug=${test.slug}`}
                  className="px-4 py-4 rounded-xl bg-white text-indigo-700 font-bold shadow-sm border border-indigo-50 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition text-sm flex items-center justify-center h-full"
                >
                  {test.title}
                </Link>
              ))}
            </div>
          </div>

          {/* All Levels */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <span className="bg-white px-6 py-2 rounded-full text-slate-500 font-bold text-sm border border-slate-200 uppercase tracking-wider shadow-sm">
                All Levels
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {levelTests.map((test) => (
                <Link
                  key={test.level}
                  href={`/levels/${test.level}`}
                  className="px-4 py-8 rounded-2xl bg-white text-slate-700 font-black text-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg hover:-translate-y-1 transition"
                >
                  {test.level}
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}