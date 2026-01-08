// app/vocabulary/[word]/page.tsx
import { Metadata } from 'next';
import ydsVocabularyRaw from '@/data/yds_vocabulary.json'; // Ham veriyi al
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. TİP TANIMLAMASI (Hatayı çözen kısım)
interface VocabItem {
  word: string;
  meaning: string;
  sentence?: string;    // Opsiyonel yaptık çünkü henüz tümünde olmayabilir
  translation?: string; // Opsiyonel
}

// Veriyi tipimize uygun hale getiriyoruz
const ydsVocabulary = ydsVocabularyRaw as VocabItem[];

export async function generateMetadata({ params }: { params: { word: string } }): Promise<Metadata> {
  const wordData = ydsVocabulary.find(v => v.word.toLowerCase() === params.word.toLowerCase());
  if (!wordData) return { title: 'Word Not Found' };

  return {
    title: `${wordData.word} Ne Demek? Anlamı ve Cümle İçinde Kullanımı | EnglishMeter`,
    description: `${wordData.word} kelimesinin Türkçe anlamı: ${wordData.meaning}.`,
  };
}

export async function generateStaticParams() {
  // Sadece ilk 1000 kelimeyi build anında oluşturup kalanı isteğe bağlı bırakmak build'i hızlandırır
  // Ama hepsini istersen slice'ı kaldırabilirsin
  return ydsVocabulary.map((v) => ({
    word: v.word.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function WordPage({ params }: { params: { word: string } }) {
  const wordData = ydsVocabulary.find(v => v.word.toLowerCase() === params.word.toLowerCase());

  if (!wordData) notFound();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-emerald-600 p-8 text-white text-center">
          <h1 className="text-5xl font-black mb-2">{wordData.word}</h1>
          <p className="text-emerald-100 text-xl font-medium">{wordData.meaning}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Cümle ve Çeviri varsa göster, yoksa AI aşamasında olduğunu belirt */}
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Akademik Kullanım</h2>
            {wordData.sentence ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                <p className="text-xl text-slate-800 font-medium leading-relaxed">"{wordData.sentence}"</p>
                <p className="mt-4 text-emerald-700 font-bold not-italic">→ {wordData.translation}</p>
              </div>
            ) : (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-700">
                <p>✨ Bu kelime için yapay zeka tarafından hazırlanan akademik örnek cümle yakında eklenecek.</p>
              </div>
            )}
          </section>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/flashcards" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
              Flashcards ile Ezberle
            </Link>
            <Link href="/" className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition">
              Testlere Dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
