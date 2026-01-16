import React from 'react';
import Link from 'next/link';
import dailyEnAr from '@/data/daily_en_ar.json';

export const metadata = {
  title: 'قاموس مفردات اللغة الإنجليزية اليومية | EnglishMeter',
  description: 'تعلم أهم الكلمات الإنجليزية الأكثر شيوعاً مع النطق والأمثلة والترجمة العربية.',
};

export default function ArabicHubPage() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    // 'dir="rtl"' Arapça için hayati önem taşır
    <main className="min-h-screen bg-slate-50 py-16 px-4 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Üst Bölüm (Hero Section) */}
        <header className="text-center mb-16">
          <div className="inline-flex px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-4">
            تعلم الإنجليزية مجاناً
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6">
            أهم 1000 كلمة في اللغة الإنجليزية
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            استكشف الكلمات الإنجليزية الأكثر استخداماً في الحياة اليومية مع معانيها باللغة العربية وأمثلة عملية لتحسين مستواك.
          </p>
        </header>

        {/* Hızlı Linkler / Quiz Yönlendirme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link href="/ar/vocabulary/quiz" className="flex items-center p-6 bg-gradient-to-l from-emerald-600 to-teal-700 rounded-3xl text-white shadow-xl hover:scale-105 transition-transform">
            <div className="text-4xl ml-6">📝</div>
            <div>
              <h3 className="text-xl font-bold">اختبار المفردات</h3>
              <p className="text-emerald-50 opacity-90">اختبر معلوماتك في الكلمات التي تعلمتها.</p>
            </div>
          </Link>
          <Link href="/flashcards" className="flex items-center p-6 bg-gradient-to-l from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl hover:scale-105 transition-transform">
            <div className="text-4xl ml-6">🗂️</div>
            <div>
              <h3 className="text-xl font-bold">بطاقات الذاكرة</h3>
              <p className="text-blue-50 opacity-90">احفظ الكلمات الجديدة بطريقة ذكية وسهلة.</p>
            </div>
          </Link>
        </div>

        {/* Alfabetik Gezinti (A-Z Navigation) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
          <h2 className="text-2xl font-black text-slate-800 mb-8 border-r-4 border-emerald-500 pr-4 italic">
            تصفح حسب الحرف (A-Z)
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
            {alphabet.map(letter => (
              <a 
                key={letter} 
                href={`#letter-${letter}`} 
                className="py-3 bg-slate-50 rounded-xl text-center font-bold text-slate-700 hover:bg-emerald-600 hover:text-white transition-all border border-slate-100"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        {/* Kelime Listesi (Grup Halinde) */}
        <div className="space-y-16">
          {alphabet.map(letter => {
            const words = (dailyEnAr as any[]).filter(w => w.word.toUpperCase().startsWith(letter));
            if (words.length === 0) return null;

            return (
              <section key={letter} id={`letter-${letter}`} className="scroll-mt-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-2xl text-2xl font-black">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {words.map((w, idx) => (
                    <Link 
                      key={idx} 
                      href={`/ar/vocabulary/${w.word.toLowerCase().replace(/\s+/g, '-')}`}
                      className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 hover:shadow-lg transition-all"
                    >
                      <span className="font-bold text-slate-800 text-lg group-hover:text-emerald-600">
                        {w.word}
                      </span>
                      <span className="text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg">
                        {w.meaning}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
