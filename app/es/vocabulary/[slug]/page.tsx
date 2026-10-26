import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildSeoMetadata } from '@/lib/seo';
import { spanishVocabulary } from '../data';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = spanishVocabulary.find((entry) => entry.slug === params.slug);
  if (!item) notFound();
  return buildSeoMetadata({
    title: `${item.word}: significado en español y ejemplos`,
    description: `Aprende el significado de "${item.word}" en español: ${item.meaning}. Consulta una frase de ejemplo en inglés con su traducción.`,
    path: `/es/vocabulary/${item.slug}`,
    locale: 'es_ES',
  });
}

export async function generateStaticParams() {
  return spanishVocabulary.map(({ slug }) => ({ slug }));
}

export default function SpanishWordPage({ params }: { params: { slug: string } }) {
  const item = spanishVocabulary.find((entry) => entry.slug === params.slug);

  if (!item) notFound();

  return (
    <main lang="es" className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navigasyon */}
        <nav className="mb-8">
          <Link href="/es/vocabulary" className="text-blue-600 font-bold hover:underline">
            ← Diccionario de Inglés
          </Link>
        </nav>

        {/* Kelime Kartı */}
        <article className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h1 lang="en" className="text-6xl font-black text-slate-900 mb-6">{item.word}</h1>
          
          <div className="space-y-8">
            {/* Anlam Bölümü */}
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                Significado en español
              </h2>
              <p className="text-3xl font-bold text-blue-600">{item.meaning}</p>
            </section>

            {/* Örnek Cümle Bölümü */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                Ejemplo de uso
              </h2>
              <p lang="en" className="text-xl text-slate-800 font-medium italic mb-4 leading-relaxed">
                "{item.s}"
              </p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-slate-600">
                  <span className="font-bold text-slate-900 italic">Traducción:</span> {item.t}
                </p>
              </div>
            </section>
          </div>

          {/* Etkileşim Butonu */}
          <div className="mt-10">
            <Link 
              href="/race" 
              className="block w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-black hover:bg-black transition-all shadow-lg hover:shadow-xl"
            >
              ¡Practica con juegos!
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
