import { NextResponse } from "next/server";

export const runtime = "nodejs";

function extractJson(text: string) {
  if (!text) return null;

  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/[“”]/g, '"')
    .replace(/,\s*}/g, "}")
    .trim();

  // Önce direkt dene
  try {
    return JSON.parse(cleaned);
  } catch {}

  // Sonra içinden {...} cımbızla
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { word, meaning } = await req.json();

    const keys = [
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_KEY_2,
      process.env.GOOGLE_KEY_3,
      process.env.GOOGLE_KEY_4,
      process.env.GOOGLE_KEY_5,
      process.env.GOOGLE_KEY_6,
      process.env.GOOGLE_KEY_7,
      process.env.GOOGLE_KEY_8,
      process.env.GOOGLE_KEY_9,
      process.env.GOOGLE_KEY_10,
    ].filter(Boolean) as string[];

    if (!keys.length) {
      return NextResponse.json(
        { error: "API anahtarı bulunamadı." },
        { status: 500 }
      );
    }

    const shuffledKeys = keys.sort(() => Math.random() - 0.5);

    const prompt =
      `Return ONLY raw JSON. ` +
      `Create one short English sentence using "${word}". ` +
      `Meaning: "${meaning}". ` +
      `Format: {"en":"...","tr":"...","note_tr":"..."}`;

    for (let i = 0; i < shuffledKeys.length; i++) {
      const apiKey = shuffledKeys[i];

      try {
        const url =
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

        const r = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 220,
              responseMimeType: "application/json",
            },
          }),
        });

        if (r.status === 429) continue;
        if (!r.ok) continue;

        const data = await r.json();

        const text =
          data?.candidates?.[0]?.content?.parts
            ?.map((p: any) => p?.text ?? "")
            .join("") ?? "";

        const parsed = extractJson(text);
        if (!parsed?.en) continue;

        return NextResponse.json({
          en: String(parsed.en),
          tr: String(parsed.tr || ""),
          note_tr: String(parsed.note_tr || ""),
        });
      } catch {
        continue;
      }
    }

    return NextResponse.json(
      { error: "Tüm API anahtarlarının limiti dolu." },
      { status: 429 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Sunucu hatası" },
      { status: 500 }
    );
  }
}
