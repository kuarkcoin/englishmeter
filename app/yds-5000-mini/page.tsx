import type { Metadata } from 'next';
import Link from 'next/link';
import ydsVocabulary from '@/data/yds_vocabulary.json';

const SUPPORTED_LANGUAGES = ['tr', 'de', 'es', 'it', 'fr'] as const;
type MeaningLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type PageProps = {
  searchParams?: { lang?: string };
};

const LANGUAGE_LABELS: Record<MeaningLanguage, string> = {
  tr: 'Turkish',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  fr: 'French',
};

const LANGUAGE_DESCRIPTIONS: Record<MeaningLanguage, string> = {
  tr: 'Practice YDS 5000 Mini Tests with Turkish meanings. Solve 100 vocabulary mini tests with stable question sets and instant review on EnglishMeter.',
  de: 'Practice YDS 5000 Mini Tests with German meanings. Solve multilingual English vocabulary questions with stable mini-test sets on EnglishMeter.',
  es: 'Practice YDS 5000 Mini Tests with Spanish meanings. Build English exam vocabulary with multilingual answer choices and instant review.',
  it: 'Practice YDS 5000 Mini Tests with Italian meanings. Study English YDS vocabulary through multilingual mini tests and stable question sets.',
  fr: 'Practice YDS 5000 Mini Tests with French meanings. Improve English exam vocabulary with localized answer choices and instant review.',
};

function normalizeLanguage(value?: string): MeaningLanguage {
  return SUPPORTED_LANGUAGES.includes(value as MeaningLanguage) ? (value as MeaningLanguage) : 'tr';
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const lang = normalizeLanguage(searchParams?.lang);
  const label = LANGUAGE_LABELS[lang];

  return {
    title: `YDS 5000 Mini Tests (${label} Meanings) | EnglishMeter`,
    description: LANGUAGE_DESCRIPTIONS[lang],
    alternates: {
      canonical: `/yds-5000-mini?lang=${lang}`,
      languages: {
        'tr-TR': '/yds-5000-mini?lang=tr',
        'de-DE': '/yds-5000-mini?lang=de',
        'es-ES': '/yds-5000-mini?lang=es',
        'it-IT': '/yds-5000-mini?lang=it',
        'fr-FR': '/yds-5000-mini?lang=fr',
      },
    },
    openGraph: {
      title: `YDS 5000 Mini Tests (${label} Meanings)`,
      description: LANGUAGE_DESCRIPTIONS[lang],
      url: `/yds-5000-mini?lang=${lang}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `YDS 5000 Mini Tests (${label} Meanings)`,
      description: LANGUAGE_DESCRIPTIONS[lang],
    },
  };
}

export default function Yds5000MiniPage({ searchParams }: PageProps) {
  const lang = normalizeLanguage(searchParams?.lang);
  const label = LANGUAGE_LABELS[lang];
  const totalWords = Array.isArray(ydsVocabulary) ? ydsVocabulary.length : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-xl md:p-10">
          <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-orange-700">
            SEO-friendly YDS vocabulary hub
          </div>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                YDS 5000 Mini Tests with {label} Meanings
              </h1>
              <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600 md:text-lg">
                Choose a mini test and practice English vocabulary with {label.toLowerCase()} answer choices.
                Each test keeps the existing YDS mini-test flow while the selected language stays in the URL.
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-500">
                {totalWords} vocabulary items loaded · 100 mini tests · 50 questions per test · 25 minutes
              </p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-orange-700">Meaning Language</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {SUPPORTED_LANGUAGES.map((code) => {
                  const active = code === lang;
                  return (
                    <Link
                      key={code}
                      href={`/yds-5000-mini?lang=${code}`}
                      className={`rounded-xl px-3 py-2 text-center text-sm font-black transition ${
                        active
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-white text-orange-700 hover:bg-orange-100'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {LANGUAGE_LABELS[code]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Start a YDS 5000 Mini Test</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">
                These links keep <span className="font-black">lang={lang}</span> so questions and answer choices use {label}.
              </p>
            </div>
            <Link href={`/?lang=${lang}`} className="text-sm font-black text-orange-700 hover:text-orange-800">
              Open main test dashboard →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
            {Array.from({ length: 100 }, (_, index) => {
              const testNo = index + 1;
              return (
                <Link
                  key={testNo}
                  href={`/tests/yds-5000-mini-${testNo}?lang=${lang}`}
                  className="rounded-2xl border border-orange-100 bg-orange-50 px-3 py-4 text-center text-sm font-black text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-100"
                >
                  Test {testNo}
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-orange-500">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
