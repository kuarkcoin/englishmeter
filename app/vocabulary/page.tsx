import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, getAllVocabulary, slugifyWord } from '@/lib/vocabulary';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'English Vocabulary Hub | Meanings, examples and exam-focused word practice',
  description:
    'Explore English vocabulary with A-Z word pages, meanings, examples, synonyms, and links to flashcards and vocabulary tests.',
  alternates: { canonical: `${SITE_URL}/vocabulary` },
  openGraph: {
    title: 'English Vocabulary Hub | EnglishMeter',
    description:
      'Discover vocabulary pages with definitions, examples, related words, and practice links for long-term retention.',
    url: `${SITE_URL}/vocabulary`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'English Vocabulary Hub | EnglishMeter',
    description: 'A-Z vocabulary hub with definitions, examples, synonyms, and practice pathways.',
  },
};

export default function VocabularyHubPage() {
  const words = getAllVocabulary();
  const popularWords = words.slice(0, 18);

  const categoryGroups = {
    'YDS Academic Focus': words.slice(0, 8),
    'High-Frequency Academic Words': words.slice(8, 16),
    'Advanced Exam Vocabulary': words.slice(16, 24),
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-4">English Vocabulary Hub</h1>
        <p className="text-slate-700 mb-8 max-w-3xl">
          Build your vocabulary with a hub-and-spoke structure: start from this hub, open individual word pages, and continue through related words for deeper retention. Each vocabulary page includes meaning, examples, synonyms, and practice routes.
        </p>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Alphabet filter</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-8 gap-3">
            {alphabet.map((letter) => (
              <Link
                key={letter}
                href={`/vocabulary/letter/${letter.toLowerCase()}`}
                className="text-center py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 font-bold"
              >
                {letter}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(categoryGroups).map(([title, items]) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-lg font-bold mb-3">{title}</h2>
              <ul className="space-y-2 text-sm">
                {items.map((item) => (
                  <li key={item.word}>
                    <Link href={`/vocabulary/${slugifyWord(item.word)}`} className="hover:text-blue-700">
                      {item.word}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular vocabulary pages</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularWords.map((item) => (
              <Link
                key={item.word}
                href={`/vocabulary/${slugifyWord(item.word)}`}
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-400"
              >
                <div className="font-bold text-slate-900">{item.word}</div>
                <div className="text-sm text-slate-600 mt-1">{item.meaning}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-3">Vocabulary cluster links</h2>
          <p className="text-slate-700 mb-4">Move through this cluster to strengthen topical authority and user pathways.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/vocabulary" className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-semibold">Vocabulary Hub</Link>
            <Link href="/flashcards" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">Flashcards</Link>
            <Link href="/vocabulary-tests" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Vocabulary Tests</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
