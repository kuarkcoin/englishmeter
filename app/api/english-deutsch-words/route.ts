import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

type EnglishDeutschWord = {
  word: string;
  meaning: string;
};

function parseWordList(raw: string): EnglishDeutschWord[] {
  const words: EnglishDeutschWord[] = [];
  const lines = raw.split(/\r?\n/);

  let currentWord = '';
  let currentMeaning = '';

  const extractQuotedValue = (line: string) => {
    const firstQuote = line.indexOf('"', line.indexOf(':') + 1);
    const lastQuote = line.lastIndexOf('"');
    if (firstQuote === -1 || lastQuote === -1 || lastQuote <= firstQuote) return '';
    return line.slice(firstQuote + 1, lastQuote).trim();
  };

  for (const line of lines) {
    if (line.includes('"word"')) {
      currentWord = extractQuotedValue(line);
    }
    if (line.includes('"meaning"')) {
      currentMeaning = extractQuotedValue(line);
    }

    if (currentWord && currentMeaning) {
      words.push({ word: currentWord, meaning: currentMeaning });
      currentWord = '';
      currentMeaning = '';
    }
  }

  return words;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'german');
    const raw = await readFile(filePath, 'utf8');
    const words = parseWordList(raw);
    return NextResponse.json(words);
  } catch {
    return NextResponse.json([]);
  }
}
