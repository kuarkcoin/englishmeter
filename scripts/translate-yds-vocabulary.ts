import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { copyFile, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type LanguageCode = 'tr' | 'de' | 'es' | 'it' | 'fr';

type VocabularyItem = {
  word: string;
  meaning: string;
  meanings?: Partial<Record<LanguageCode, string>>;
  [key: string]: unknown;
};

type TranslationResponseItem = {
  index: number;
} & Partial<Record<Exclude<LanguageCode, 'tr'>, string>>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');
const vocabularyPath = path.join(rootDir, 'data', 'yds_vocabulary.json');
const backupPath = path.join(rootDir, 'data', 'yds_vocabulary.backup.json');
const tempPath = path.join(rootDir, 'data', 'yds_vocabulary.json.tmp');

const TARGET_LANGUAGES = ['de', 'es', 'it', 'fr'] as const;
const DEFAULT_BATCH_SIZE = 20;

const envConfig = dotenv.config({ path: envPath });

function getEnvValue(key: string) {
  return envConfig.parsed?.[key];
}

function getApiKey() {
  const key = getEnvValue('GOOGLE_API_KEY') || getEnvValue('GEMINI_API_KEY');
  if (!key) {
    throw new Error(
      'Missing translation API key in .env.local. Add GOOGLE_API_KEY (or GEMINI_API_KEY) before running scripts/translate-yds-vocabulary.ts.'
    );
  }
  return key;
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeItem(item: VocabularyItem): VocabularyItem {
  return {
    ...item,
    meanings: {
      ...(item.meanings || {}),
      tr: item.meaning,
    },
  };
}

function missingTargetLanguages(item: VocabularyItem) {
  return TARGET_LANGUAGES.filter((language) => !hasText(item.meanings?.[language]));
}

function extractJsonArray(text: string): TranslationResponseItem[] {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Translation API did not return a JSON array. Response: ${text.slice(0, 500)}`);
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as TranslationResponseItem[];
  if (!Array.isArray(parsed)) {
    throw new Error('Translation API response JSON is not an array.');
  }

  return parsed;
}

function buildPrompt(batch: Array<{ index: number; word: string; meaning: string; missing: readonly LanguageCode[] }>) {
  return `Translate the Turkish vocabulary meanings for an English exam word list.\n\nRules:\n- Return ONLY valid JSON.\n- Return a JSON array.\n- Keep each input index exactly.\n- Translate only the requested missing language codes for each item.\n- Requested codes: de = German, es = Spanish, it = Italian, fr = French.\n- Do not translate the English word field; translate only the Turkish meaning.\n- Do not add markdown, explanations, or extra keys.\n- Output shape example when de and fr are requested: [{"index":0,"de":"...","fr":"..."}]\n\nItems:\n${JSON.stringify(batch, null, 2)}`;
}

async function translateBatch(
  model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
  batch: Array<{ index: number; word: string; meaning: string; missing: readonly LanguageCode[] }>
) {
  const result = await model.generateContent(buildPrompt(batch));
  const text = result.response.text();
  return extractJsonArray(text);
}

async function main() {
  const apiKey = getApiKey();
  const batchSize = Math.max(1, Number(getEnvValue('YDS_TRANSLATE_BATCH_SIZE') || DEFAULT_BATCH_SIZE) || DEFAULT_BATCH_SIZE);
  const modelName = getEnvValue('GEMINI_TRANSLATION_MODEL') || 'gemini-1.5-flash';
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
  const pending = vocabulary
    .map((item, index) => ({ index, word: item.word, meaning: item.meaning, missing: missingTargetLanguages(item) }))
    .filter((item) => hasText(item.word) && hasText(item.meaning) && item.missing.length > 0);

  await copyFile(vocabularyPath, backupPath);

  let translatedWords = 0;
  let translatedFields = 0;

  for (let offset = 0; offset < pending.length; offset += batchSize) {
    const batch = pending.slice(offset, offset + batchSize);
    const translations = await translateBatch(model, batch);
    const byIndex = new Map(translations.map((item) => [item.index, item]));

    for (const pendingItem of batch) {
      const item = vocabulary[pendingItem.index];
      const translated = byIndex.get(pendingItem.index);
      if (!translated) {
        throw new Error(`Translation API response is missing index ${pendingItem.index} (${pendingItem.word}).`);
      }

      let changedThisWord = false;
      item.meanings = { ...(item.meanings || {}), tr: item.meaning };

      for (const language of pendingItem.missing) {
        const value = translated[language];
        if (!hasText(value)) {
          throw new Error(`Translation API response is missing ${language} for index ${pendingItem.index} (${pendingItem.word}).`);
        }

        item.meanings[language] = value.trim();
        translatedFields += 1;
        changedThisWord = true;
      }

      if (changedThisWord) translatedWords += 1;
    }

    console.log(`Translated ${Math.min(offset + batch.length, pending.length)} / ${pending.length} pending words...`);
  }

  await writeFile(tempPath, `${JSON.stringify(vocabulary, null, 2)}\n`, 'utf8');
  await rename(tempPath, vocabularyPath);

  const skippedWords = vocabulary.length - translatedWords;
  console.log('YDS vocabulary translation complete.');
  console.log(`Total words: ${vocabulary.length}`);
  console.log(`Translated words: ${translatedWords}`);
  console.log(`Translated fields: ${translatedFields}`);
  console.log(`Skipped words: ${skippedWords}`);
  console.log(`Backup: ${path.relative(rootDir, backupPath)}`);
  console.log(`Updated: ${path.relative(rootDir, vocabularyPath)}`);
}

main().catch((error: unknown) => {
  console.error('YDS vocabulary translation failed. data/yds_vocabulary.json was not overwritten unless all translation steps completed.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
