// app/api/speaking/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SpeakingRequest = {
  scenario: string;         // "Coffee Shop"
  npc_line: string;         // NPC's last line
  user_said: string;        // transcript
  level?: "A1" | "A2" | "B1" | "B2" | "C1";
};

type SpeakingResponse = {
  understood: boolean;
  meaning_score: number;     // 0-100
  fluency_score: number;     // 0-100
  grammar_fixes: string[];   // kısa düzeltmeler
  natural_reply: string;     // daha doğal cevap
  next_npc_line: string;     // bir sonraki soru/tepki
  notes: string;             // 1 cümle motivasyon
};

function getRandomKey() {
  const keys = [
    process.env.GOOGLE_API_KEY,
    process.env.GOOGLE_KEY_2,
    process.env.GOOGLE_KEY_3,
    process.env.GOOGLE_KEY_4,
    process.env.GOOGLE_KEY_5,
  ].filter(Boolean) as string[];
  return keys.length ? keys[Math.floor(Math.random() * keys.length)] : null;
}

function safeJsonParse<T>(text: string): T | null {
  try {
    const clean = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(clean) as T;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = getRandomKey();
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key missing" }, { status: 500 });
    }

    const body = (await req.json()) as SpeakingRequest;

    const scenario = (body.scenario || "").slice(0, 80);
    const npc_line = (body.npc_line || "").slice(0, 240);
    const user_said = (body.user_said || "").slice(0, 400);
    const level = body.level ?? "B1";

    if (!scenario || !npc_line || !user_said) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 350,
      },
    });

    const prompt = `
You are a friendly speaking coach for everyday English.
Return ONLY valid JSON (no markdown, no extra text).

Scenario: ${scenario}
NPC said: "${npc_line}"
Learner level: ${level}
User said (transcript): "${user_said}"

Rules:
- Be supportive, short, practical.
- If user_said is empty/too short/irrelevant, understood=false and ask a simpler next_npc_line.
- grammar_fixes: max 3 short bullet-like strings
- natural_reply: a better version of what user wanted to say (1 sentence)
- next_npc_line: continue the scenario (1 sentence)
Return schema:
{
  "understood": boolean,
  "meaning_score": number,
  "fluency_score": number,
  "grammar_fixes": string[],
  "natural_reply": string,
  "next_npc_line": string,
  "notes": string
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = safeJsonParse<SpeakingResponse>(text);
    if (!parsed) {
      // fallback (JSON patlarsa)
      const fallback: SpeakingResponse = {
        understood: true,
        meaning_score: 70,
        fluency_score: 65,
        grammar_fixes: ["Try shorter sentences.", "Add 'please' to sound polite."],
        natural_reply: user_said,
        next_npc_line: "Great. Anything else?",
        notes: "Nice try—keep going!",
      };
      return NextResponse.json(fallback);
    }

    // min clamp
    parsed.meaning_score = Math.max(0, Math.min(100, Number(parsed.meaning_score ?? 0)));
    parsed.fluency_score = Math.max(0, Math.min(100, Number(parsed.fluency_score ?? 0)));
    parsed.grammar_fixes = Array.isArray(parsed.grammar_fixes) ? parsed.grammar_fixes.slice(0, 3) : [];

    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
