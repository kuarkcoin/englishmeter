// app/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface Test {
  slug: string;
  title: string;
  level: string;
}

export default async function Home() {
  
  const [quickTest, megaTest, vocabTest, grammarTests, levelTests] = await Promise.all([
    prisma.test.findUnique({
      where: { slug: 'quick-placement' },
      select: { slug: true, title: true, level: true }
    }),
    prisma.test.findUnique({
      where: { slug: 'grammar-mega-test-100' },
      select: { slug: true, title: true, level: true }
    }),
    prisma.test.findUnique({
      where: { slug: 'vocab-b1-c1-50' },
      select: { slug: true, title: true, level: true }
    }),
    prisma.test.findMany({
      where: {
        slug: {
          in: ['test-perfect-past', 'test-conditionals', 'test-relatives', 'test-articles', 'test-tenses-mixed']
        }
      },
      orderBy: { title: 'asc' },
      select: { slug: true, title: true, level: true }
    }),
    prisma.test.findMany({
      where: {
        slug: {
          contains: '-test-1', 
          notIn: ['quick-placement', 'quick', 'grammar-mega-test-100', 'vocab-b1-c1-50'],
        },
      },
      orderBy: { slug: 'asc' },
      select: { slug: true, title: true, level: true }
    })
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto text-center">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
          Find your real English level.
        </h1>
        <p className="text-lg text-slate-600 mb-10">
          Take our quick placement test, check your grammar, or choose a level.
        </p>

        {/* --- BÖLÜM 1: ANA TESTLER (YAN YANA GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Quick Test */}
          {quickTest ? (
            <Link 
              href="/start" 
              className="flex items-center justify-center px-6 py-5 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
            >
              🚀 {quickTest.title}
            </Link>
          ) : <div className="p-5 bg-slate-200 rounded-2xl">Loading...</div>}
          
          {/* Mega Test */}
          {megaTest && (
            <Link 
              href={`/start?testSlug=${megaTest.slug}`} 
              className="flex items-center justify-center px-6 py-5 rounded-2xl bg-purple-600 text-white text-lg font-bold shadow-lg hover:bg-purple-700 transition transform hover:-translate-y-1"
            >
              📦 {megaTest.title}
            </Link>
          )}

          {/* Vocab Test */}
          {vocabTest && (
            <Link 
              href={`/start?testSlug=${vocabTest.slug}`} 
              className="flex items-center justify-center px-6 py-5 rounded-2xl bg-emerald-600 text-white text-lg font-bold shadow-lg hover:bg-emerald-700 transition transform hover:-translate-y-1"
            >
              📚 {vocabTest.title}
            </Link>
          )}
        </div>

        {/* --- BÖLÜM 2: GRAMER KONULARI --- */}
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

        {/* --- BÖLÜM 3: SEVİYELER --- */}
        <div>
          <div className="flex items-center justify-center mb-6">
             <span className="bg-white px-4 py-1 rounded-full text-slate-500 font-semibold text-sm border border-slate-200 uppercase tracking-wider">All Levels</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {levelTests.map((test) => (
              <Link
                key={test.slug}
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
  );
}