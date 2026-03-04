import vocabA from '@/data/yds_vocabulary.json';
import vocabB from '@/data/yds_vocabulary1.json';

export type VocabItem = {
  word: string;
  meaning: string;
  s?: string;
  t?: string;
  sentence?: string;
  translation?: string;
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://englishmeter.net';

export function slugifyWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getAllVocabulary(): VocabItem[] {
  const map = new Map<string, VocabItem>();
  [...(vocabA as VocabItem[]), ...(vocabB as VocabItem[])].forEach((item) => {
    if (!item?.word || !item?.meaning) return;
    const slug = slugifyWord(item.word);
    if (!slug) return;
    if (!map.has(slug)) {
      map.set(slug, item);
      return;
    }

    const prev = map.get(slug)!;
    map.set(slug, {
      ...prev,
      ...item,
      s: prev.s || item.s,
      t: prev.t || item.t,
      sentence: prev.sentence || item.sentence,
      translation: prev.translation || item.translation,
    });
  });

  return Array.from(map.values()).sort((a, b) => a.word.localeCompare(b.word));
}

export function getVocabularyMap() {
  const map = new Map<string, VocabItem>();
  getAllVocabulary().forEach((item) => map.set(slugifyWord(item.word), item));
  return map;
}

export function getSentenceVariants(item: VocabItem): string[] {
  const baseSentence = item.s || item.sentence;
  const baseTranslation = item.t || item.translation;

  const generated = [
    `${item.word} is often used in academic and exam-focused English contexts when discussing "${item.meaning}".`,
    `If you want to improve your vocabulary depth, try to use ${item.word} naturally in your own sentence writing practice.`,
  ];

  if (!baseSentence) return generated;

  const lines = [baseSentence];
  if (baseTranslation) {
    lines.push(`${baseSentence} (${baseTranslation})`);
  }

  return [
    ...lines,
    `In an exam setting, you can paraphrase ideas by replacing simpler words with ${item.word} when the meaning is "${item.meaning}".`,
  ];
}

export function getSynonyms(item: VocabItem, pool: VocabItem[]): string[] {
  const meaningTokens = item.meaning
    .toLowerCase()
    .split(/[;,/]|\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 3);

  const byMeaning = pool
    .filter((p) => p.word !== item.word)
    .filter((p) => meaningTokens.some((token) => p.meaning.toLowerCase().includes(token)))
    .map((p) => p.word);

  const byPrefix = pool
    .filter((p) => p.word !== item.word)
    .filter((p) => p.word[0]?.toLowerCase() === item.word[0]?.toLowerCase())
    .map((p) => p.word);

  return Array.from(new Set([...byMeaning, ...byPrefix])).slice(0, 6);
}

export function getRelatedWords(item: VocabItem, pool: VocabItem[]): string[] {
  const currentSlug = slugifyWord(item.word);

  return pool
    .map((p) => ({ ...p, slug: slugifyWord(p.word) }))
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => a.word.localeCompare(b.word))
    .filter((p) => p.word[0]?.toLowerCase() === item.word[0]?.toLowerCase())
    .slice(0, 5)
    .map((p) => p.word);
}
