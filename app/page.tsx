import Link from 'next/link';

// --- RACE SELECTOR COMPONENT (Database'siz çalışır) ---
function RaceSelector() {
  const races = [
    { id: 1, title: 'RACE #1', color: 'from-red-500 to-pink-600' },
    { id: 2, title: 'RACE #2', color: 'from-orange-500 to-yellow-500' },
    { id: 3, title: 'RACE #3', color: 'from-green-500 to-emerald-600' },
    { id: 4, title: 'RACE #4', color: 'from-blue-500 to-cyan-500' },
    { id: 5, title: 'RACE #5', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="w-full py-8 bg-white border-b border-slate-200 mb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            GLOBAL ADVANCED LEAGUE
          </h2>
          <span className="px-3 py-1 bg-black text-white text-xs md:text-sm font-bold rounded-full uppercase">
            C1-C2 Level
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {races.map((race) => (
            <Link
              href={`/race/${race.id}`}
              key={race.id}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${race.color}`}
            >
              <div className="p-4 md:p-6 text-center text-white relative z-10">
                <div className="text-[10px] md:text-xs uppercase opacity-80 font-bold tracking-wider mb-1 md:mb-2">
                  50 Questions
                </div>
                <div className="text-2xl md:text-3xl font-black">{race.title}</div>
                <div className="mt-3 md:mt-4 inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] md:text-xs text-xs font-bold group-hover:bg-white group-hover:text-gray-900 transition-colors">
                  START
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- DİĞER TESTLER (Statik Veri) ---
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
    <div className="min-h-screen bg-gray-50">
      {/* RACE BUTONLARI */}
      <RaceSelector />

      {/* DİĞER İÇERİKLER */}
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
            Find your real English level.
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            Take our quick placement test, check your grammar, or choose a level.
          </p>

          {/* 3 ANA BUTON */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link href="/start" className="flex items-center justify-center px-6 py-5 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
              {quickTest.title}
            </Link>

            <Link href={`/start?testSlug=${megaTest.slug}`} className="flex items-center justify-center px-6 py-5 rounded-2xl bg-purple-600 text-white text-lg font-bold shadow-lg hover:bg-purple-700 transition transform hover:-translate-y-1">
              {megaTest.title}
            </Link>

            <Link href={`/start?testSlug=${vocabTest.slug}`} className="flex items-center justify-center px-6 py-5 rounded-2xl bg-emerald-600 text-white text-lg font-bold shadow-lg hover:bg-emerald-700 transition transform hover:-translate-y-1">
              {vocabTest.title}
            </Link>
          </div>

          {/* Grammar Focus */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="bg-white px-4 py-1 rounded-full text-slate-500 font-semibold text-sm border border-slate-200 uppercase tracking-wider">Grammar Focus</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {grammarTests.map((test) => (
                <Link
                  key={test.slug}
                  href={`/start?testSlug=${test.slug}`}
                  className="px-4 py-3 rounded-xl bg-white text-indigo-700 font-medium shadow-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition text-sm flex items-center justify-center h-full"
                >
                  {test.title}
                </Link>
              ))}
            </div>
          </div>

          {/* All Levels */}
          <div>
            <div className="flex items-center justify-center mb-6">
              <span className="bg-white px-4 py-1 rounded-full text-slate-500 font-semibold text-sm border border-slate-200 uppercase tracking-wider">All Levels</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {levelTests.map((test) => (
                <Link
                  key={test.level}
                  href={`/levels/${test.level}`}
                  className="px-4 py-6 rounded-xl bg-white text-slate-700 font-bold text-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition"
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