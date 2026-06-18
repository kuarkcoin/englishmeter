import { NextResponse } from 'next/server';
import words from '@/data/turkish_greek.json';

type TurkishGreekWord = {
  greek: string;
  pronunciation: string;
};

export async function GET() {
  const cleaned = ((words as TurkishGreekWord[]) || [])
    .map((item) => ({
      greek: String(item?.greek ?? '').trim(),
      pronunciation: String(item?.pronunciation ?? '').trim(),
    }))
    .filter((item) => item.greek && item.pronunciation);

  return NextResponse.json(cleaned);
}
