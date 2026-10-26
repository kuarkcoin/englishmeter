import type { Metadata } from 'next';
import Link from 'next/link';
import { buildSeoMetadata } from '@/lib/seo';
import { spanishVocabulary } from './data';

export const metadata: Metadata = buildSeoMetadata({
  title: 'Diccionario inglés-español con ejemplos',
  description: `Explora ${spanishVocabulary.length} palabras y expresiones en inglés con significado en español, frases de ejemplo y traducciones para practicar cada día.`,
  path: '/es/vocabulary',
  locale: 'es_ES',
});

export default function SpanishVocabularyPage() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return (
    <main lang="es" className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black sm:text-4xl">Diccionario inglés-español</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Aprende {spanishVocabulary.length} palabras y expresiones en inglés. Elige una palabra para consultar su significado,
          una frase de ejemplo y su traducción al español.
        </p>
        <Link href="/vocab-es" className="mt-4 inline-block font-bold text-blue-600 hover:underline">Practicar vocabulario →</Link>
        <nav aria-label="Índice alfabético" className="my-8 flex flex-wrap gap-2">
          {letters.filter((letter) => spanishVocabulary.some((item) => item.word.toUpperCase().startsWith(letter))).map((letter) => (
            <a key={letter} href={`#letter-${letter}`} className="rounded-lg border bg-white px-3 py-2 font-bold hover:border-blue-500">{letter}</a>
          ))}
        </nav>
        <div className="space-y-10">
          {letters.map((letter) => {
            const words = spanishVocabulary.filter((item) => item.word.toUpperCase().startsWith(letter));
            if (!words.length) return null;
            return (
              <section key={letter} id={`letter-${letter}`} aria-labelledby={`heading-${letter}`} className="scroll-mt-6">
                <h2 id={`heading-${letter}`} className="mb-4 text-2xl font-black">{letter}</h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {words.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/es/vocabulary/${item.slug}`} className="flex h-full flex-col gap-1 rounded-xl border bg-white p-4 hover:border-blue-500">
                        <span lang="en" className="font-bold text-blue-700">{item.word}</span>
                        <span className="text-slate-600">{item.meaning}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
