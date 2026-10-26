import dailyData from '@/data/daily_en_es.json';

const entries = (dailyData as unknown[]).flatMap((value) => {
  if (!value || typeof value !== 'object' || !('word' in value) || typeof value.word !== 'string') return [];
  const item = value as Record<string, unknown>;
  const word = value.word.trim();
  const slug = word.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  if (!slug) return [];
  return [{
    word, slug,
    meaning: typeof item.meaning === 'string' ? item.meaning : '',
    s: typeof item.s === 'string' ? item.s : '',
    t: typeof item.t === 'string' ? item.t : '',
  }];
});

// Preserve the first entry for each URL, matching the existing detail-page lookup.
export const spanishVocabulary = Array.from(new Map(entries.slice().reverse().map((item) => [item.slug, item])).values())
  .sort((a, b) => a.word.localeCompare(b.word, 'en'));
