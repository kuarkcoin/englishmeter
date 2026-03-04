import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, getAllVocabulary, slugifyWord } from '@/lib/vocabulary';

type PageProps = { params: { letter: string } };

export function generateStaticParams() {
  return 'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => ({ letter }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const letter = params.letter.toLowerCase();
  return {
    title: `Words starting with ${letter.toUpperCase()} | English Vocabulary Index`,
    description: `Browse English words that start with ${letter.toUpperCase()} and open each word page for meaning, examples, and synonyms.`,
    alternates: { canonical: `${SITE_URL}/vocabulary/letter/${letter}` },
  };
}

export default function LetterDetailPage({ params }: PageProps) {
  const letter = params.letter.toLowerCase();
  const filteredWords = getAllVocabulary()
    .filter((v) => v.word.toLowerCase().startsWith(letter))
    .sort((a, b) => a.word.localeCompare(b.word));

  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/vocabulary" className="text-blue-600 font-bold hover:underline">← Vocabulary Hub</Link>
          <h1 className="text-4xl font-black text-slate-900 mt-4 uppercase">Words starting with "{letter}"</h1>
          <p className="text-slate-500 mt-2">{filteredWords.length} words found.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 mb-10">
          {filteredWords.map((item) => (
            <Link
              key={item.word}
              href={`/vocabulary/${slugifyWord(item.word)}`}
              className="text-slate-700 hover:text-blue-600 font-medium border-b border-slate-100 py-1 transition-colors"
            >
              {item.word}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/flashcards" className="px-3 py-2 border rounded-lg hover:bg-slate-50">Flashcards</Link>
          <Link href="/vocabulary-tests" className="px-3 py-2 border rounded-lg hover:bg-slate-50">Vocabulary Tests</Link>
        </div>
      </div>
    </main>
  );
}
