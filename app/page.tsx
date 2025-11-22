// app/page.tsx  → ANA SAYFA (kopyala-yapıştır yap, bitti!)

import Link from 'next/link';

// ——— RACE BUTONLARI ———
function RaceSelector() {
  const races = [
    { id: 1, title: 'RACE #1', color: 'from-red-500 to-pink-600' },
    { id: 2, title: 'RACE #2', color: 'from-orange-500 to-yellow-500' },
    { id: 3, title: 'RACE #3', color: 'from-green-500 to-emerald-600' },
    { id: 4, title: 'RACE #4', color: 'from-blue-500 to-cyan-500' },
    { id: 5, title: 'RACE #5', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="w-full py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
            GLOBAL ADVANCED LEAGUE
          </h2>
          <span className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full uppercase tracking-wider">
            C1–C2 Level
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {races.map((race) => (
            <Link
              key={race.id}
              href={`/race/${race.id}`}
              className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br ${race.color}`}
            >
              <div className="p-8 text-center text-white">
                <div className="text-xs md:text-sm uppercase opacity-80 font-bold mb-2">
                  50 Questions • 50 Minutes
                </div>
                <div className="text-3xl md:text-4xl font-black mb-4">
                  {race.title}
                </div>
                <div className="inline-block bg-white/20 backdrop-blur px-6 py-2 rounded-full font-bold text-sm md:text-base group-hover:bg-white group-hover:text-gray-900 transition">
                  START
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ——— ANA SAYFA ———
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. RACE BÖLÜMÜ (en üstte) */}
      <RaceSelector />

      {/* 2. DİĞER TESTLER */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-6">
          Find your real English level.
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Quick placement test, mega grammar test, vocabulary challenges and more.
        </p>

        {/* Ana 3 büyük buton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link
            href="/start"
            className="p-8 bg-blue-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:bg-blue-700 transition transform hover:-translate-y-2"
          >
            Quick Placement Test
          </Link>

          <Link
            href="/start?testSlug=grammar-mega-test-100"
            className="p-8 bg-purple-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:bg-purple-700 transition transform hover:-translate-y-2"
          >
            Grammar Mega Test (100Q)
          </Link>

          <Link
            href="/start?testSlug=vocab-b1-c1-50"
            className="p-8 bg-emerald-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:bg-emerald-700 transition transform hover:-translate-y-2"
          >
            Vocabulary B1–C1 (50Q)
          </Link>
        </div>

        {/* Alt bilgi */}
        <p className="text-gray-500">
          More grammar topics and level tests coming soon…
        </p>
      </div>
    </div>
  );
}
