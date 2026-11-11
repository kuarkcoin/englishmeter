import { spanishVocabulary } from '@/app/es/vocabulary/data';
import { arabicVocabulary } from '@/app/ar/vocabulary/data';
import { SITE_URL } from '@/lib/seo';

type VocabularyLocale = 'es' | 'ar';
type VocabularyEntry = (typeof spanishVocabulary)[number];

const normalize = (text: string) => text.trim().replace(/\s+/g, ' ').toLowerCase();
const entriesByLocale = {
  es: new Map(spanishVocabulary.map((entry) => [entry.slug, entry])),
  ar: new Map(arabicVocabulary.map((entry) => [entry.slug, entry])),
};

// A matching headword alone is not enough: different meanings can share a word.
// The same original example, with an actual translation in both dictionaries,
// gives us a conservative set of genuine language equivalents.
function translationKey(entry: VocabularyEntry): string | null {
  if (!entry.s.trim() || !entry.meaning.trim() || !entry.t.trim()) return null;
  return `${normalize(entry.word)}\n${normalize(entry.s)}`;
}

const equivalentEntries = {
  es: new Map(spanishVocabulary.flatMap((entry) => {
    const key = translationKey(entry);
    return key ? [[key, entry] as const] : [];
  })),
  ar: new Map(arabicVocabulary.flatMap((entry) => {
    const key = translationKey(entry);
    return key ? [[key, entry] as const] : [];
  })),
};

export function getVocabularyLanguageAlternates(locale: VocabularyLocale, slug: string): Record<string, string> | undefined {
  const entry = entriesByLocale[locale].get(slug);
  const key = entry && translationKey(entry);
  if (!key) return undefined;
  const spanish = equivalentEntries.es.get(key);
  const arabic = equivalentEntries.ar.get(key);
  if (!spanish || !arabic) return undefined;
  return {
    es: `${SITE_URL}/es/vocabulary/${spanish.slug}`,
    ar: `${SITE_URL}/ar/vocabulary/${arabic.slug}`,
  };
}

export function getVocabularyWordStructuredData(locale: VocabularyLocale, entry: VocabularyEntry) {
  const dictionaryName = locale === 'es' ? 'Diccionario inglés-español' : 'قاموس إنجليزي عربي';
  const dictionaryUrl = `${SITE_URL}/${locale}/vocabulary`;
  const url = `${dictionaryUrl}/${entry.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTerm',
        name: entry.word,
        description: entry.meaning,
        url,
        inDefinedTermSet: { '@type': 'DefinedTermSet', name: dictionaryName, url: dictionaryUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'EnglishMeter', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: dictionaryName, item: dictionaryUrl },
          { '@type': 'ListItem', position: 3, name: entry.word, item: url },
        ],
      },
    ],
  };
}
