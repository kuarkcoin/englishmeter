import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // edge değil

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function toUnixDay(d: Date) {
  return Math.floor(d.getTime() / 1000);
}

function dayStartUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticker = (searchParams.get('ticker') || '').trim().toUpperCase();
    if (!ticker) {
      return NextResponse.json({ error: 'Missing ticker' }, { status: 400 });
    }

    const key = process.env.FINNHUB_API_KEY;
    if (!key) {
      return NextResponse.json({ error: 'Missing FINNHUB_API_KEY' }, { status: 500 });
    }

    // last 35 days buffer (weekends)
    const now = new Date();
    const fromDate = new Date(now.getTime() - 35 * 24 * 3600 * 1000);

    const from = toUnixDay(fromDate);
    const to = toUnixDay(now);

    // 1) company news
    const newsUrl =
      `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(ticker)}` +
      `&from=${fromDate.toISOString().slice(0, 10)}&to=${now.toISOString().slice(0, 10)}&token=${key}`;

    const newsRes = await fetch(newsUrl, { next: { revalidate: 60 * 15 } }); // 15 min cache
    if (!newsRes.ok) throw new Error(`News fetch failed: ${newsRes.status}`);
    const newsRaw = (await newsRes.json()) as any[];

    // 2) daily candles
    const candlesUrl =
      `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(ticker)}` +
      `&resolution=D&from=${from}&to=${to}&token=${key}`;

    const cRes = await fetch(candlesUrl, { next: { revalidate: 60 * 60 * 24 } }); // 1 day cache
    if (!cRes.ok) throw new Error(`Candles fetch failed: ${cRes.status}`);
    const candles = await cRes.json();

    if (candles?.s !== 'ok' || !Array.isArray(candles?.t) || candles.t.length < 10) {
      return NextResponse.json({ error: 'No candle data' }, { status: 404 });
    }

    const tArr: number[] = candles.t; // unix seconds day
    const cArr: number[] = candles.c;

    // month change (first vs last close)
    const monthChange = cArr.length >= 2 ? cArr[cArr.length - 1] / cArr[0] - 1 : null;

    // helper: find candle index for a news time (closest same day or next available)
    const findIndexForNewsTime = (newsTimeSec: number) => {
      const d = dayStartUtc(new Date(newsTimeSec * 1000));
      const daySec = Math.floor(d.getTime() / 1000);

      // find first candle with t >= daySec
      let lo = 0,
        hi = tArr.length - 1,
        ans = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (tArr[mid] >= daySec) {
          ans = mid;
          hi = mid - 1;
        } else lo = mid + 1;
      }
      return ans; // may be -1
    };

    const items = (newsRaw || [])
      .slice(0, 60) // limit for UI
      .map((n) => {
        const headline = String(n.headline || '');
        const time = Number(n.datetime || 0);
        const url = n.url ? String(n.url) : undefined;

        const idx = findIndexForNewsTime(time);
        const base = idx >= 0 ? cArr[idx] : null;

        const ret1d =
          idx >= 0 && idx + 1 < cArr.length && base ? cArr[idx + 1] / base - 1 : null;
        const ret5d =
          idx >= 0 && idx + 5 < cArr.length && base ? cArr[idx + 5] / base - 1 : null;

        const strength =
          typeof ret5d === 'number' ? clamp(Math.round(Math.abs(ret5d) * 1000), 0, 100) : null;

        return { headline, time, url, ret1d, ret5d, strength };
      })
      .filter((x) => x.headline);

    return NextResponse.json({ ticker, monthChange, items });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
