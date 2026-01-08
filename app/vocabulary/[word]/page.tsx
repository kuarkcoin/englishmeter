// app/vocabulary/[word]/page.tsx
import { Metadata } from 'next';
import ydsVocabulary from '@/data/yds_vocabulary.json'; // AI zenginleştirilmiş veri
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. Google İçin Dinamik Metadata (Her kelimeye özel başlık)
export async function generateMetadata({ params }: { params: { word: string } }): Promise<Metadata> {
  const wordData = ydsVocabulary.find(v => v.word.toLowerCase() === params.word.toLowerCase());
  if (!wordData) return { title: 'Word Not Found' };

  return {
    title: `${wordData.word} Ne Demek? Anlamı ve Cümle İçinde Kullanımı | EnglishMeter`,
    description: `${wordData.word} kelimesinin Türkçe anlamı: ${wordData.meaning}. YDS akademik örnek cümleleri, telaffuzu ve eş anlamlıları için tıklayın.`,
    keywords: `${wordData.word} anlamı, ${wordData.word} ne demek, ${wordData.word} örnek cümle, yds kelimeleri`,
  };
}

// 2. Performans İçin: Tüm sayfaları build anında oluştur (SSG)
export async function generateStaticParams() {
  return ydsVocabulary.slice(0, 3850).map((v) => ({
    word: v.word.toLowerCase(),
  }));
}

export default function WordPage({ params }: { params: { word: string } }) {
  const wordData = ydsVocabulary.find(v => v.word.toLowerCase() === params.word.toLowerCase());

  if (!wordData) notFound();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Kelime Başlığı */}
        <div className="bg-emerald-600 p-8 text-white text-center">
          <h1 className="text-5xl font-black mb-2">{wordData.word}</h1>
          <p className="text-emerald-100 text-xl font-medium tracking-wide">
            {wordData.meaning}
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* AI Örnek Cümle Bölümü (Google'ın en sevdiği kısım) */}
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Akademik Kullanım (AI)</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
              <p className="text-xl text-slate-800 font-medium leading-relaxed">
                "{wordData.sentence}"
              </p>
              <p className="mt-4 text-emerald-700 font-bold not-italic">
                → {wordData.translation}
              </p>
            </div>
          </section>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/flashcards"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
            >
              Flashcards ile Ezberle
            </Link>
            <Link 
              href="/"
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
            >
              YDS Testi Çöz
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
