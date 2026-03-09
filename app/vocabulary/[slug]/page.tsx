import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  SITE_URL,
  getAllVocabulary,
  getRelatedWords,
  getSentenceVariants,
  getSynonyms,
  getVocabularyMap,
  slugifyWord,
} from '@/lib/vocabulary';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return Array.from(getVocabularyMap().keys()).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = getVocabularyMap().get(params.slug);

  if (!item) {
    return {
      title: 'Word not found | EnglishMeter',
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/vocabulary/${params.slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${item.word} meaning | English definition, synonyms & examples`,
    description: `Learn the meaning of ${item.word}, example sentences, synonyms and how to use it in English.`,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${item.word} meaning | English definition, synonyms & examples`,
      description: `Learn the meaning of ${item.word}, example sentences, synonyms and how to use it in English.`,
      siteName: 'EnglishMeter',
    },
    twitter: {
      card: 'summary',
      title: `${item.word} meaning | English definition, synonyms & examples`,
      description: `Learn the meaning of ${item.word}, example sentences, synonyms and how to use it in English.`,
    },
  };
}

export default function VocabularyWordPage({ params }: PageProps) {
  const vocabMap = getVocabularyMap();
  const item = vocabMap.get(params.slug);

  if (!item) notFound();

  const pool = getAllVocabulary();
  const examples = getSentenceVariants(item).slice(0, 3);
  const synonyms = getSynonyms(item, pool);
  const relatedWords = getRelatedWords(item, pool);
  const canonical = `${SITE_URL}/vocabulary/${params.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: item.word,
    description: `${item.word} means: ${item.meaning}`,
    url: canonical,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'EnglishMeter Vocabulary',
      url: `${SITE_URL}/vocabulary`,
    },
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-4xl mx-auto">
        <nav className="mb-6 text-sm flex flex-wrap gap-2 text-slate-600">
          <Link href="/vocabulary" className="hover:text-blue-600">Vocabulary Hub</Link>
          <span>/</span>
          <Link href="/flashcards" className="hover:text-blue-600">Flashcards</Link>
          <span>/</span>
          <Link href="/vocabulary-tests" className="hover:text-blue-600">Vocabulary Tests</Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          {item.word} meaning and example sentences
        </h1>

        <p className="text-slate-700 leading-relaxed mb-8">
          Learning <strong>{item.word}</strong> in context helps you remember meaning, use natural sentence patterns, and improve academic English performance. On this page, you will find a clear definition, practical examples, synonyms, and related words so you can build stronger vocabulary connections for exams and daily communication.
        </p>

        <div className="grid gap-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-2">Definition</h2>
            <p className="text-lg text-slate-800"><strong>{item.word}</strong>: {item.meaning}</p>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-3">Example sentences</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              {examples.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-3">Synonyms</h2>
            <div className="flex flex-wrap gap-2">
              {synonyms.length ? (
                synonyms.map((syn) => (
                  <Link
                    key={syn}
                    href={`/vocabulary/${slugifyWord(syn)}`}
                    className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm hover:bg-blue-100"
                  >
                    {syn}
                  </Link>
                ))
              ) : (
                <span className="text-slate-600 text-sm">Synonym suggestions will expand as the dataset grows.</span>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-3">Related words</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relatedWords.map((word) => (
                <Link
                  key={word}
                  href={`/vocabulary/${slugifyWord(word)}`}
                  className="border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-400 hover:text-blue-700"
                >
                  {word}
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 p-6">
            <h2 className="text-xl font-bold mb-3">Practice section</h2>
            <p className="text-slate-700 mb-4">
              Reinforce <strong>{item.word}</strong> with active recall: review it in flashcards, then test yourself in timed vocabulary modes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/flashcards" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Practice in Flashcards</Link>
              <Link href="/vocabulary-tests" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Take Vocabulary Tests</Link>
              <Link href="/vocabulary" className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-semibold hover:bg-slate-100">Back to Vocabulary Hub</Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
