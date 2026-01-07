import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * .env dosyasındaki API anahtarlarından birini rastgele seçer.
 * Bu sayede kota limitlerine takılma ihtimali azalır.
 */
function pickKey() {
  const keys = [
    process.env.GOOGLE_KEY_2,
    process.env.GOOGLE_KEY_3,
    process.env.GOOGLE_KEY_4,
    process.env.GOOGLE_KEY_5,
    process.env.GOOGLE_API_KEY,
  ].filter(Boolean) as string[];

  if (!keys.length) {
    throw new Error("Google API key bulunamadı.");
  }
  return keys[Math.floor(Math.random() * keys.length)];
}

export async function POST(req: Request) {
  try {
    const { word, meaning } = await req.json();

    if (!word || !meaning) {
      return NextResponse.json({ error: "Kelime veya anlam eksik." }, { status: 400 });
    }

    const apiKey = pickKey();

    // Modelin sadece JSON dönmesi için sistem talimatı ve formatı
    const prompt = `You are a bilingual English teacher.
Create ONE natural, short English sentence using the word: "${word}".
The sentence should be relevant to its Turkish meaning: "${meaning}".

Return ONLY a JSON object in this format:
{
  "en": "the english sentence",
  "tr": "turkish translation",
  "note_tr": "very short usage note (optional)"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 300,
          // ✅ ÖNEMLİ: Modelin cevabı kod bloğu (```json) olmadan saf JSON dönmesini sağlar
          responseMimeType: "application/json" 
        },
      }),
    });

    if (!r.ok) {
      const errorData = await r.json();
      throw new Error(errorData?.error?.message || "Gemini API hatası");
    }

    const data = await r.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // ✅ EKSTRA GÜVENLİK: Eğer model responseMimeType'a rağmen backtick eklerse temizle
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      console.error("JSON Ayrıştırma Hatası. Ham Metin:", text);
      // JSON bozuksa metni en azından 'en' kısmına yerleştirip gönderiyoruz
      parsed = { 
        en: text.slice(0, 200), 
        tr: "Çeviri yapılamadı (Format Hatası)", 
        note_tr: "" 
      };
    }

    return NextResponse.json({
      en: String(parsed.en || ""),
      tr: String(parsed.tr || ""),
      note_tr: String(parsed.note_tr || ""),
    });

  } catch (e: any) {
    console.error("API Route Hatası:", e.message);
    return NextResponse.json(
      { error: e?.message ?? "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
