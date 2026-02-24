import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Body = {
  roomSlug?: string;
  username?: string;
  text?: string;
};

// Basit in-memory rate limit (Vercel serverless’ta “best-effort”)
// Daha sağlamı için Upstash/Vercel KV ekleriz.
const buckets = new Map<string, { count: number; resetAt: number; lastMsg?: string }>();

function getIP(req: Request) {
  // Vercel/Proxy için
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = getIP(req);
    const now = Date.now();
    const body = (await req.json()) as Body;

    const roomSlug = (body.roomSlug || "general").slice(0, 50);
    const username = (body.username || "Anon").trim().slice(0, 20);
    const text = (body.text || "").trim();

    if (!text || text.length < 1) {
      return NextResponse.json({ ok: false, error: "Mesaj boş olamaz." }, { status: 400 });
    }
    if (text.length > 300) {
      return NextResponse.json({ ok: false, error: "Mesaj çok uzun (max 300)." }, { status: 400 });
    }

    // Rate limit: 10 saniyede max 3 mesaj
    const windowMs = 10_000;
    const maxCount = 3;

    const b = buckets.get(ip);
    if (!b || now > b.resetAt) {
      buckets.set(ip, { count: 1, resetAt: now + windowMs, lastMsg: text });
    } else {
      // flood engeli: aynı mesajı tekrar atamasın
      if (b.lastMsg === text) {
        return NextResponse.json({ ok: false, error: "Aynı mesajı tekrar gönderemezsin." }, { status: 429 });
      }

      b.count += 1;
      b.lastMsg = text;

      if (b.count > maxCount) {
        return NextResponse.json({ ok: false, error: "Çok hızlı mesaj atıyorsun. 10 sn bekle." }, { status: 429 });
      }
      buckets.set(ip, b);
    }

    // Basit küfür/spam filtresi (istersen genişletiriz)
    const banned = ["amk", "aq", "orospu", "piç", "siktir"];
    const lower = text.toLowerCase();
    if (banned.some((w) => lower.includes(w))) {
      return NextResponse.json({ ok: false, error: "Uygunsuz içerik algılandı." }, { status: 400 });
    }

    const sb = supabaseServer();

    const { error } = await sb.from("messages").insert({
      room_slug: roomSlug,
      username,
      text,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
