import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import vocab1 from '@/data/yds_vocabulary.json';
import vocab2 from '@/data/yds_vocabulary1.json';

// Veriyi tekilleştirme fonksiyonu
function getUniqueVocab() {
  const combined = [...vocab1, ...vocab2];
  const uniqueMap = new Map();
  combined.forEach((item: any) => {
    if (item?.word) uniqueMap.set(item.word.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), item);
  });
  return uniqueMap;
}

// 1. DİNAMİK METADATA (Google Başlığı)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vocabMap = getUniqueVocab();
  const item = vocabMap.get(params.slug);
  const word = item?.word || params.slug;

  return {
    title: `${word} Ne Demek? Anlamı ve Örnek Cümleler | EnglishMeter`,
    description: `${word} kelimesinin Türkçe anlamı, YDS/YÖKDİL çalışma notları ve akademik örnek cümle çevirileri. EnglishMeter ile İngilizce öğrenin.`,
  };
}

// 2. STATIC PARAMS (Hız İçin Build Sırasında Üretim)
export async function generateStaticParams() {
  const vocabMap = getUniqueVocab();
  return Array.from(vocabMap.keys()).map((slug) => ({ slug }));
}

export default function VocabularyDetailPage({ params }: { params: { slug: string } }) {
  const vocabMap = getUniqueVocab();
  const item = vocabMap.get(params.slug);

  if (!item) return <div className="p-10 text-center">Kelime bulunamadı.</div>;

  // Google için Yapılandırılmış Veri (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": item.word,
    "description": item.meaning,
    "inDefinedTermSet": "https://englishmeter.net/vocabulary",
    "termCode": item.word
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/vocabulary" className="text-sm font-bold text-blue-600 hover:underline">
            ← Kelime Dizini
          </Link>
        </div>

        {/* Kelime Kartı */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <header className="border-b border-slate-100 pb-6 mb-6">
            <h1 className="text-5xl font-black text-slate-900 mb-2">{item.word}</h1>
            <div className="inline-flex items-center px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm">
              Akademik Kelime
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Türkçe Anlamı</h2>
            <p className="text-2xl font-bold text-slate-800 leading-relaxed">
              {item.meaning}
            </p>
          </section>

          {/* Örnek Cümle Bölümü */}
          {item.s && (
            <section className="space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cümle İçinde Kullanımı</h2>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xl text-slate-700 font-medium italic mb-4">
                  "{item.s}"
                </p>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-slate-600">
                    <strong className="text-slate-900">Çeviri:</strong> {item.t}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* CTA - Kullanıcıyı Sitede Tutma */}
          <div className="mt-10 pt-8 border-t border-slate-100">
             <Link href="/race" className="block w-full py-4 bg-blue-600 text-white text-center rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
               Bu Kelimeyi Oyunla Pekiştir!
             </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
