import { NextResponse } from "next/server";

export const runtime = "nodejs";

function pickKey() {
  const keys = [
    process.env.GOOGLE_API_KEY,
    process.env.GOOGLE_KEY_2,
    process.env.GOOGLE_KEY_3,
    process.env.GOOGLE_KEY_4,
    process.env.GOOGLE_KEY_5,
  ].filter(Boolean) as string[];

  if (!keys.length) throw new Error("API Key bulunamadı.");
  return keys[Math.floor(Math.random() * keys.length)];
}

export async function POST(req: Request) {
  try {
    const { word, meaning } = await req.json();
    const apiKey = pickKey();

    // Modelin kafasını karıştırmayacak en kısa ve net prompt
    const prompt = `Return a JSON object for the English word "${word}" (Meaning: ${meaning}). 
    Format: {"en": "sentence", "tr": "çeviri", "note_tr": "not"}. 
    Output only raw JSON.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 300,
          responseMimeType: "application/json" 
        },
      }),
    });

    const data = await r.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // ✅ YENİ: Metnin içindeki JSON'ı cımbızla çekip alma (En güvenli yöntem)
    let parsed: any = null;
    try {
      // Önce doğrudan parse etmeyi dene
      parsed = JSON.parse(text);
    } catch {
      // Başarısız olursa metin içindeki { ... } bloğunu ara
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Regex parse hatası:", e);
        }
      }
    }

    // Eğer hala parse edilemediyse fallback (Hata göstermek yerine metni göster)
    if (!parsed) {
      return NextResponse.json({
        en: text.replace(/[\{\}]/g, "").slice(0, 150), // En azından gelen düz metni göster
        tr: "Format ayrıştırılamadı ama yukarıdaki metni inceleyin.",
        note_tr: "Hata oluştu"
      });
    }

    return NextResponse.json({
      en: String(parsed.en || ""),
      tr: String(parsed.tr || ""),
      note_tr: String(parsed.note_tr || ""),
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
