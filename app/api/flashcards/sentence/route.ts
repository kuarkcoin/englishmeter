import { NextResponse } from "next/server";

export const runtime = "nodejs";

function pickKey() {
  const keys = [
    process.env.GOOGLE_KEY_2,
    process.env.GOOGLE_KEY_3,
    process.env.GOOGLE_KEY_4,
    process.env.GOOGLE_KEY_5,
    process.env.GOOGLE_API_KEY,
  ].filter(Boolean) as string[];

  if (!keys.length) {
    throw new Error("Google API key bulunamadı (GOOGLE_KEY_1..5 veya GOOGLE_API_KEY).");
  }
  return keys[Math.floor(Math.random() * keys.length)];
}

export async function POST(req: Request) {
  try {
    const { word, meaning } = await req.json();

    if (!word || !meaning) {
      return NextResponse.json({ error: "word/meaning gerekli" }, { status: 400 });
    }

    const apiKey = pickKey();

    const prompt = `
Bilingual English teacher.
Create ONE short, natural English sentence using the exact word: "${word}".
Then give Turkish translation.
Also give a very short usage note in Turkish (optional).

Return STRICT JSON ONLY:
{"en":"...","tr":"...","note_tr":"..."}

Turkish meaning reference: "${meaning}"
`.trim();

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey);

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 220 },
      }),
    });

    const data = await r.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { en: text?.slice(0, 200) ?? "", tr: "", note_tr: "" };
    }

    return NextResponse.json({
      en: String(parsed.en || ""),
      tr: String(parsed.tr || ""),
      note_tr: String(parsed.note_tr || ""),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "server error" },
      { status: 500 }
    );
  }
}
