import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { copyFile, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type LanguageCode = 'tr' | 'de' | 'es' | 'it' | 'fr';
type TargetLanguageCode = Exclude<LanguageCode, 'tr'>;

type VocabularyItem = {
  word: string;
  meaning: string;
  meanings?: Partial<Record<LanguageCode, string>>;
  [key: string]: unknown;
};

type TranslationResult = Partial<Record<TargetLanguageCode, string>>;

type PendingItem = {
  index: number;
  word: string;
  meaning: string;
  missing: TargetLanguageCode[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const vocabularyPath = path.join(rootDir, 'data', 'yds_vocabulary.json');
const backupPath = path.join(rootDir, 'data', 'yds_vocabulary.backup.json');
const tempPath = path.join(rootDir, 'data', 'yds_vocabulary.json.tmp');

const TARGET_LANGUAGES: TargetLanguageCode[] = ['de', 'es', 'it', 'fr'];
const SAVE_EVERY_WORDS = 50;
const DEFAULT_RATE_LIMIT_DELAY_MS = 350;

dotenv.config({ path: envPath });

function assertLocalRuntime() {
  if (process.env.VERCEL) {
    throw new Error('This translation script is for local/Codespace use only. Do not run it in Vercel runtime.');
  }
}

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Missing GEMINI_API_KEY. Add it to your Codespace/local environment or .env.local before running npm run translate:yds.');
  }
  return key;
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeItem(item: VocabularyItem): VocabularyItem {
  return {
    ...item,
    word: item.word,
    meaning: item.meaning,
    meanings: {
      ...(item.meanings || {}),
      tr: item.meaning,
    },
  };
}

function missingTargetLanguages(item: VocabularyItem): TargetLanguageCode[] {
  return TARGET_LANGUAGES.filter((language) => !hasText(item.meanings?.[language]));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeSaveVocabulary(vocabulary: VocabularyItem[]) {
  await writeFile(tempPath, `${JSON.stringify(vocabulary, null, 2)}\n`, 'utf8');
  await rename(tempPath, vocabularyPath);
}

function extractJsonObject(text: string): TranslationResult | null {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as TranslationResult;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function buildPrompt(item: PendingItem) {
  return `Translate the Turkish meaning of an English YDS vocabulary item.\n\nReturn ONLY valid JSON. No markdown. No explanation.\nTranslate only the requested missing language codes.\nRequested codes: ${item.missing.join(', ')}.\nLanguage codes: de = German, es = Spanish, it = Italian, fr = French.\nDo not translate the English word. Translate only the Turkish meaning.\nJSON shape example: {"de":"...","es":"...","it":"...","fr":"..."}\n\nInput:\n${JSON.stringify(
    {
      word: item.word,
      meaning: item.meaning,
      missing: item.missing,
    },
    null,
    2
  )}`;
}

async function translateOne(
  model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
  item: PendingItem
): Promise<TranslationResult | null> {
  const result = await model.generateContent(buildPrompt(item));
  return extractJsonObject(result.response.text());
}

async function main() {
  assertLocalRuntime();

  const apiKey = getGeminiApiKey();
  const modelName = process.env.GEMINI_TRANSLATION_MODEL || 'gemini-1.5-flash';
  const rateLimitDelayMs = Math.max(
    0,
    Number(process.env.YDS_TRANSLATE_DELAY_MS || DEFAULT_RATE_LIMIT_DELAY_MS) || DEFAULT_RATE_LIMIT_DELAY_MS
  );

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json', temperature: 0 },
  });

  const raw = await readFile(vocabularyPath, 'utf8');
  const parsed = JSON.parse(raw) as VocabularyItem[];
  if (!Array.isArray(parsed)) {
    throw new Error('data/yds_vocabulary.json must contain a JSON array.');
  }

  const vocabulary = parsed.map(normalizeItem);
  const pending: PendingItem[] = vocabulary
    .map((item, index) => ({
      index,
      word: item.word,
      meaning: item.meaning,
      missing: missingTargetLanguages(item),
    }))
    .filter((item) => hasText(item.word) && hasText(item.meaning) && item.missing.length > 0);

  await copyFile(vocabularyPath, backupPath);
  console.log(`Backup created: ${path.relative(rootDir, backupPath)}`);
  console.log(`Pending words: ${pending.length}`);

  let translatedWords = 0;
  let translatedFields = 0;
  let skippedAlreadyComplete = vocabulary.length - pending.length;
  let skippedBadResponse = 0;
  let processedSinceSave = 0;

  for (const pendingItem of pending) {
    const item = vocabulary[pendingItem.index];

    try {
      const translated = await translateOne(model, pendingItem);
      if (!translated) {
        skippedBadResponse += 1;
        console.warn(`Skipping ${pendingItem.word}: Gemini returned invalid JSON.`);
      } else {
        const hasAllRequestedTranslations = pendingItem.missing.every((language) => hasText(translated[language]));

        if (!hasAllRequestedTranslations) {
          skippedBadResponse += 1;
          console.warn(`Skipping ${pendingItem.word}: Gemini JSON did not include all requested translations.`);
        } else {
          item.meanings = { ...(item.meanings || {}), tr: item.meaning };

          for (const language of pendingItem.missing) {
            item.meanings[language] = translated[language]!.trim();
            translatedFields += 1;
          }

          translatedWords += 1;
        }
      }
    } catch (error) {
      skippedBadResponse += 1;
      console.warn(
        `Skipping ${pendingItem.word}: ${error instanceof Error ? error.message : 'Unknown Gemini translation error.'}`
      );
    }

    processedSinceSave += 1;
    if (processedSinceSave >= SAVE_EVERY_WORDS) {
      await safeSaveVocabulary(vocabulary);
      processedSinceSave = 0;
      console.log(`Safely saved progress after ${translatedWords + skippedBadResponse} processed pending words.`);
    }

    if (rateLimitDelayMs > 0) {
      await sleep(rateLimitDelayMs);
    }
  }

  await safeSaveVocabulary(vocabulary);

  console.log('YDS vocabulary translation complete.');
  console.log(`Total words: ${vocabulary.length}`);
  console.log(`Translated words: ${translatedWords}`);
  console.log(`Translated fields: ${translatedFields}`);
  console.log(`Skipped already complete words: ${skippedAlreadyComplete}`);
  console.log(`Skipped invalid/error words: ${skippedBadResponse}`);
  console.log(`Backup: ${path.relative(rootDir, backupPath)}`);
  console.log(`Updated: ${path.relative(rootDir, vocabularyPath)}`);
}

main().catch((error: unknown) => {
  console.error('YDS vocabulary translation failed. Atomic writes prevent partial JSON corruption; backup remains available.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
