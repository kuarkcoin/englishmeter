import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    attemptId,
    testSlug,
    nickname,
    correct,
    wrong,
    answered,
    total = 60,
    durationSeconds,
  } = body ?? {};

  if (!attemptId || !testSlug || !nickname) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const cleanNick = String(nickname).trim().replace(/\s+/g, " ").slice(0, 18);
  if (cleanNick.length < 3) {
    return NextResponse.json({ error: "Nickname too short" }, { status: 400 });
  }

  const c = Number(correct ?? 0);
  const w = Number(wrong ?? 0);
  const a = Number(answered ?? 0);
  const t = Number(total ?? 60);
  const dur = Number(durationSeconds ?? 0);

  // Skor mantığı: en basit (doğru sayısı)
  const score = c;

  const { error: insErr } = await supabaseAdmin.from("attempts").insert([
    {
      attempt_id: String(attemptId),
      test_slug: String(testSlug),
      nickname: cleanNick,
      correct: c,
      wrong: w,
      answered: a,
      total: t,
      score,
      duration_seconds: dur,
    },
  ]);

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  // Rank (All-time, test bazlı): score desc, duration asc
  const { count: betterCount, error: cErr } = await supabaseAdmin
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("test_slug", testSlug)
    .or(`score.gt.${score},and(score.eq.${score},duration_seconds.lt.${dur})`);

  if (cErr) {
    return NextResponse.json({ error: cErr.message }, { status: 500 });
  }

  const rank = (betterCount ?? 0) + 1;

  const { count: totalPlayers } = await supabaseAdmin
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("test_slug", testSlug);

  const { data: top10 } = await supabaseAdmin
    .from("attempts")
    .select("nickname,score,duration_seconds")
    .eq("test_slug", testSlug)
    .order("score", { ascending: false })
    .order("duration_seconds", { ascending: true })
    .limit(10);

  return NextResponse.json({
    rank,
    totalPlayers: totalPlayers ?? 0,
    top10: (top10 ?? []).map((x) => ({
      nickname: x.nickname,
      score: x.score,
      durationSeconds: x.duration_seconds,
    })),
  });
}
