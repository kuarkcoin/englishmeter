import type { Metadata } from 'next';
import Link from 'next/link';
import { buildSeoMetadata } from '@/lib/seo';
import { arabicVocabulary } from './data';

export const metadata: Metadata = buildSeoMetadata({
  title: 'قاموس إنجليزي عربي مع أمثلة',
  description: `تعلّم ${arabicVocabulary.length} كلمة وتعبيرًا باللغة الإنجليزية مع المعاني العربية والجمل التوضيحية وترجمتها. تصفح الكلمات حسب الحروف.`,
  path: '/ar/vocabulary',
  locale: 'ar_AR',
});

export default function ArabicHubPage() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return (
    <main lang="ar" dir="rtl" className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black sm:text-4xl">قاموس إنجليزي عربي</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          تصفح {arabicVocabulary.length} كلمة وتعبيرًا باللغة الإنجليزية. اختر كلمة لقراءة معناها بالعربية مع جملة توضيحية وترجمتها.
        </p>
        <nav aria-label="فهرس الحروف" dir="ltr" className="my-8 flex flex-wrap gap-2">
          {alphabet.filter((letter) => arabicVocabulary.some((item) => item.word.toUpperCase().startsWith(letter))).map((letter) => (
            <a key={letter} href={`#letter-${letter}`} className="rounded-lg border bg-white px-3 py-2 font-bold hover:border-emerald-500">{letter}</a>
          ))}
        </nav>
        <div className="space-y-10">
          {alphabet.map((letter) => {
            const words = arabicVocabulary.filter((item) => item.word.toUpperCase().startsWith(letter));
            if (!words.length) return null;
            return (
              <section key={letter} id={`letter-${letter}`} aria-labelledby={`heading-${letter}`} className="scroll-mt-6">
                <h2 id={`heading-${letter}`} lang="en" className="mb-4 text-2xl font-black">{letter}</h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {words.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/ar/vocabulary/${item.slug}`} className="flex h-full flex-col gap-1 rounded-xl border bg-white p-4 hover:border-emerald-500">
                        <span lang="en" dir="ltr" className="font-bold text-emerald-700">{item.word}</span>
                        <span className="text-slate-600">{item.meaning || '—'}</span>
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
