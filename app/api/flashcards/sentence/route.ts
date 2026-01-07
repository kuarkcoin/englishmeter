import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { word, meaning } = await req.json();

    // 1. Tüm 10 anahtarı bir listeye alıyoruz
    const allKeys = [
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

    if (allKeys.length === 0) {
      return NextResponse.json({ error: "API anahtarları bulunamadı." }, { status: 500 });
    }

    // 2. Anahtarları her istekte karıştırıyoruz (Load Balancing)
    // Böylece hep ilk anahtara yüklenip onu hemen bitirmeyiz.
    const shuffledKeys = allKeys.sort(() => Math.random() - 0.5);

    const prompt = `You are a bilingual English teacher. 
    Create ONE short, natural English sentence using: "${word}" (Meaning: ${meaning}).
    Return STRICT JSON: {"en": "...", "tr": "...", "note_tr": "..."}`;

    // 3. SIRAYLA DENE (Failover Mantığı)
    for (const apiKey of shuffledKeys) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const r = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
              temperature: 0.7, 
              maxOutputTokens: 250,
              responseMimeType: "application/json" 
            },
          }),
        });

        // Eğer kota dolmuşsa (429) veya başka bir hata varsa, bu anahtarı atla ve bir sonrakini dene
        if (!r.ok) {
          console.warn(`Bir API anahtarı hata verdi (${r.status}), sıradakine geçiliyor...`);
          continue; 
        }

        const data = await r.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        // JSON temizleme ve parse
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);

        // Başarılı sonucu döndür ve döngüden çık
        return NextResponse.json({
          en: String(parsed.en || ""),
          tr: String(parsed.tr || ""),
          note_tr: String(parsed.note_tr || ""),
        });

      } catch (err) {
        // Teknik bir hata (network vb.) olursa sıradaki anahtara geç
        console.error("Anahtar denemesinde teknik hata:", err);
        continue;
      }
    }

    // Eğer döngü biter ve hiçbir anahtar çalışmazsa
    return NextResponse.json({ error: "Şu an tüm limitler dolu, lütfen az sonra tekrar deneyin." }, { status: 429 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
