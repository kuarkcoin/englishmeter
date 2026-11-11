import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildSeoMetadata, serializeJsonLd } from '@/lib/seo';
import { getVocabularyLanguageAlternates, getVocabularyWordStructuredData } from '@/lib/vocabulary-locales';
import { arabicVocabulary } from '../data';

export async function generateStaticParams() {
  return arabicVocabulary.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = arabicVocabulary.find((entry) => entry.slug === params.slug);
  if (!item) notFound();
  return buildSeoMetadata({
    title: `${item.word}: المعنى بالعربية وأمثلة`,
    description: `تعرّف على معنى كلمة ${item.word} بالعربية: ${item.meaning}. اقرأ مثالًا باللغة الإنجليزية مع ترجمته العربية.`,
    path: `/ar/vocabulary/${item.slug}`,
    locale: 'ar_AR',
    languages: getVocabularyLanguageAlternates('ar', item.slug),
  });
}

export default function ArabicWordPage({ params }: { params: { slug: string } }) {
  // Params'ı bulurken güvenlik kontrolü
  const item = arabicVocabulary.find((entry) => entry.slug === params.slug);

  if (!item) {
    notFound();
  }
  const languages = getVocabularyLanguageAlternates('ar', item.slug);

  return (
    <main lang="ar" dir="rtl" className="max-w-4xl mx-auto p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getVocabularyWordStructuredData('ar', item)) }} />
      <Link href="/ar/vocabulary" className="mb-5 inline-block font-bold text-blue-600 hover:underline">العودة إلى القاموس ←</Link>
      {languages?.es && (
        <nav aria-label="لغات هذه الكلمة" className="mb-6 text-sm">
          <a href={languages.es} hrefLang="es" lang="es" dir="ltr" className="font-semibold text-blue-600 hover:underline">Español</a>
        </nav>
      )}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 lang="en" dir="ltr" className="break-words text-4xl sm:text-5xl font-bold mb-2">{item.word}</h1>
          <p className="text-xl opacity-90">مفردات إنجليزية مع المعاني العربية</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-sm text-gray-500 uppercase tracking-widest">الكلمة الإنجليزية</span>
              <h2 lang="en" dir="ltr" className="text-3xl font-semibold text-gray-800">{item.word}</h2>
            </div>
            
            <div className="text-center md:text-right" dir="rtl">
              <span className="text-sm text-gray-500 uppercase tracking-widest">المعنى بالعربية</span>
              <h2 className="text-4xl font-bold text-blue-600 leading-relaxed">{item.meaning}</h2>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-700 border-l-4 border-blue-500 pl-3">مثال على الاستخدام</h3>
            <div lang="en" dir="ltr" className="bg-gray-50 p-6 rounded-lg italic text-gray-700 text-lg">&quot;{item.s}&quot;</div>
            <div className="bg-blue-50 p-6 rounded-lg text-right text-blue-900 text-xl font-medium" dir="rtl">&quot;{item.t}&quot;</div>
          </div>
        </div>
      </div>
    </main>
  );
}
