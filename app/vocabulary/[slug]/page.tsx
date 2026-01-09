import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import vocab1 from '@/data/yds_vocabulary.json';
import vocab2 from '@/data/yds_vocabulary1.json';

// Veriyi tekilleştirme fonksiyonu (Build sırasında performans için dışarıda tanımlandı)
function getUniqueVocabMap() {
  const combined = [...vocab1, ...vocab2];
  const uniqueMap = new Map();
  
  combined.forEach((item: any) => {
    if (item && item.word) {
      // Kelimeyi URL dostu slug haline getiriyoruz
      const slug = item.word
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      if (!uniqueMap.has(slug)) {
        uniqueMap.set(slug, item);
      }
    }
  });
  return uniqueMap;
}

// 1. DİNAMİK METADATA
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vocabMap = getUniqueVocabMap();
  const item = vocabMap.get(params.slug);

  if (!item) return { title: 'Kelime Bulunamadı | EnglishMeter' };

  return {
    title: `${item.word} Ne Demek? Anlamı ve Cümle Çevirisi | EnglishMeter`,
    description: `${item.word} kelimesinin Türkçe anlamı: ${item.meaning}. YDS ve akademik sınavlar için örnek cümleler.`,
  };
}

// 2. STATIC PARAMS (8000 sayfanın yol haritası)
export async function generateStaticParams() {
  const vocabMap = getUniqueVocabMap();
  return Array.from(vocabMap.keys()).map((slug) => ({
    slug: slug,
  }));
}

export default function VocabularyDetailPage({ params }: { params: { slug: string } }) {
  const vocabMap = getUniqueVocabMap();
  const item = vocabMap.get(params.slug);

  if (!item) notFound();

  // JSON-LD (Google Arama Sonucu Zenginleştirme)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": item.word,
    "description": item.meaning,
    "inDefinedTermSet": "https://englishmeter.net/vocabulary",
    "termCode": item.word
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/vocabulary" className="text-sm font-bold text-blue-600 hover:underline">
            ← Kelime Dizini (A-Z)
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white">
            <h1 className="text-5xl font-black mb-2">{item.word}</h1>
            <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm">Akademik Kelime Veritabanı</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Anlam */}
            <section>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Türkçe Karşılığı</h2>
              <p className="text-3xl font-bold text-slate-800 leading-tight">
                {item.meaning}
              </p>
            </section>

            {/* Örnek Cümle - (Hem 's' hem 'sentence' keylerini kontrol eder) */}
            {(item.s || item.sentence) && (
              <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Cümle İçinde Kullanımı</h2>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <p className="text-xl text-blue-900 font-medium italic leading-relaxed">
                    "{item.s || item.sentence}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-blue-800">
                      <strong className="font-black">Çeviri:</strong> {item.t || item.translation}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Aksiyon Butonları */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
               <Link href="/race" className="flex-1 min-w-[200px] py-4 bg-emerald-600 text-white text-center rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                 Kelimelerle Yarış
               </Link>
               <Link href="/flashcards" className="flex-1 min-w-[200px] py-4 bg-slate-100 text-slate-800 text-center rounded-2xl font-black hover:bg-slate-200 transition-all">
                 Kartlarla Çalış
               </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
