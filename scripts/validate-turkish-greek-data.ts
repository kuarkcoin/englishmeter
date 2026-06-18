import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

interface TurkishGreekRecord {
  id: string | number;
  word: string;
  meaning: string;
  pronunciation: string;
  category: string;
  type: string;
}

const GREEK_RE = /[\u0370-\u03FF\u1F00-\u1FFF]/u;
const LATIN_RE = /[A-Za-zÇĞİÖŞÜçğıöşü]/u;
const GREEK_ONLY_RE = /^[\s\u0370-\u03FF\u1F00-\u1FFF\p{P}\p{S}\d]+$/u;

const defaultDataPaths = [
  'data/turkish-greek.json',
  'data/turkish_greek.json',
  'data/tr-el.json',
  'data/tr_el.json',
];

function normalizeText(value: string): string {
  return value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/\s+/gu, ' ');
}

function normalizePronunciation(value: string): string {
  return normalizeText(value).replace(/[^a-zçğıöşü\s-]/giu, '').replace(/\s+/gu, ' ').trim();
}

function formatRecord(record: Partial<TurkishGreekRecord>, index: number): string {
  const id = record.id === undefined || record.id === null || record.id === '' ? `index ${index}` : `id ${String(record.id)}`;
  const label = typeof record.word === 'string' && record.word.trim() ? ` (${record.word.trim()})` : '';
  return `${id}${label}`;
}

function readRecords(filePath: string): TurkishGreekRecord[] {
  const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
  const records = Array.isArray(parsed) ? parsed : Array.isArray((parsed as { data?: unknown }).data) ? (parsed as { data: unknown[] }).data : null;

  if (!records) {
    throw new Error(`${filePath} must contain an array or an object with a data array.`);
  }

  return records as TurkishGreekRecord[];
}

function getInputPath(args: string[]): string | undefined {
  const explicitPath = args.find((arg) => !arg.startsWith('--'));

  if (explicitPath) {
    return explicitPath;
  }

  return defaultDataPaths.find((candidate) => existsSync(candidate));
}

function getOptionValue(args: string[], option: string): string | undefined {
  const index = args.indexOf(option);
  return index >= 0 ? args[index + 1] : undefined;
}

function printUsage(): void {
  console.log(`Usage: npm run validate:tr-el -- <data-file> [--write-deduped <output-file>]\n\nValidates Turkish/Greek records shaped as:\n  { id, word, meaning, pronunciation, category, type }\n\nIf no data file is provided, the script looks for: ${defaultDataPaths.join(', ')}`);
}

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printUsage();
  process.exit(0);
}

const inputPath = getInputPath(args);
const dedupedOutputPath = getOptionValue(args, '--write-deduped');

if (!inputPath) {
  printUsage();
  process.exit(1);
}

if (!existsSync(inputPath)) {
  console.error(`Data file not found: ${inputPath}`);
  process.exit(1);
}

const records = readRecords(inputPath);
const errors: string[] = [];
const warnings: string[] = [];
const pronunciationOwners = new Map<string, TurkishGreekRecord[]>();
const validUniqueRecords: TurkishGreekRecord[] = [];
const duplicateKeys = new Set<string>();

records.forEach((record, index) => {
  const label = formatRecord(record, index);
  const word = typeof record.word === 'string' ? record.word : '';
  const meaning = typeof record.meaning === 'string' ? record.meaning : '';
  const pronunciation = typeof record.pronunciation === 'string' ? record.pronunciation : '';
  const normalizedMeaning = normalizeText(meaning);
  const normalizedPronunciation = normalizePronunciation(pronunciation);

  if (!pronunciation.trim()) {
    errors.push(`${label}: pronunciation is empty.`);
  }

  if (GREEK_RE.test(pronunciation)) {
    errors.push(`${label}: pronunciation contains Greek characters.`);
  }

  if (!LATIN_RE.test(pronunciation)) {
    errors.push(`${label}: pronunciation must contain at least one Latin/Turkish letter.`);
  }

  if (!GREEK_RE.test(meaning)) {
    errors.push(`${label}: meaning must contain at least one Greek character.`);
  }

  if (!word.trim()) {
    errors.push(`${label}: word is empty; it must be the Turkish meaning.`);
  } else if (GREEK_ONLY_RE.test(word.trim())) {
    errors.push(`${label}: word appears to be Greek; it must be the Turkish meaning.`);
  }

  if (meaning === pronunciation) {
    errors.push(`${label}: meaning and pronunciation are exactly the same.`);
  } else if (normalizedMeaning && normalizedPronunciation && normalizedMeaning === normalizedPronunciation) {
    warnings.push(`${label}: normalized meaning and pronunciation are the same; check for swapped/mixed fields.`);
  } else if (GREEK_RE.test(word) && LATIN_RE.test(meaning)) {
    warnings.push(`${label}: word contains Greek while meaning contains Latin letters; fields may be swapped.`);
  }

  if (normalizedPronunciation) {
    const existing = pronunciationOwners.get(normalizedPronunciation) ?? [];
    existing.push(record);
    pronunciationOwners.set(normalizedPronunciation, existing);
  }
});

for (const [normalizedPronunciation, owners] of pronunciationOwners.entries()) {
  if (owners.length > 1) {
    duplicateKeys.add(normalizedPronunciation);
    warnings.push(
      `Duplicate pronunciation "${normalizedPronunciation}" in ${owners
        .map((owner, ownerIndex) => formatRecord(owner, records.indexOf(owner) >= 0 ? records.indexOf(owner) : ownerIndex))
        .join(', ')}.`,
    );
  }
}

for (const record of records) {
  const normalizedPronunciation = normalizePronunciation(typeof record.pronunciation === 'string' ? record.pronunciation : '');
  if (!duplicateKeys.has(normalizedPronunciation)) {
    validUniqueRecords.push(record);
  }
}

console.log(`Validated ${records.length} records from ${inputPath}.`);
console.log(`Duplicate-normalized pronunciations: ${duplicateKeys.size}.`);
console.log(`Records available for duplicate-free test generation: ${validUniqueRecords.length}.`);

if (warnings.length > 0) {
  console.warn(`\nWarnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (dedupedOutputPath) {
  writeFileSync(dedupedOutputPath, `${JSON.stringify(validUniqueRecords, null, 2)}\n`);
  console.log(`Wrote duplicate-free records to ${dedupedOutputPath}.`);
}

if (errors.length > 0) {
  console.error(`\nErrors (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`${basename(inputPath)} passed Turkish/Greek validation.`);
