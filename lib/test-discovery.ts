// Small navigation metadata only; this module must never import question banks.
export type TestDiscoveryEntry = { title: string; href: string; category: string };
export const PRIMARY_TEST_CATEGORIES: readonly TestDiscoveryEntry[] = [
  { title: 'English Level Test', href: '/english-level-test', category: 'placement' },
  { title: 'Grammar Tests', href: '/grammar', category: 'grammar' },
  { title: 'Vocabulary Practice', href: '/vocabulary-tests', category: 'vocabulary' },
  { title: 'IELTS Preparation', href: '/ielts-grammar-tests', category: 'ielts-grammar' },
  { title: 'YDS Preparation', href: '/yds-preparation', category: 'yds' },
];
export function searchTests(entries: readonly TestDiscoveryEntry[], query: string): TestDiscoveryEntry[] {
  const words = query.trim().toLocaleLowerCase('en').split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return entries.filter(({ title, category }) => {
    const text = `${title} ${category}`.toLocaleLowerCase('en');
    return words.every((word) => text.includes(word));
  });
}
