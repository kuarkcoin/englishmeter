import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type Top10Row = {
  nickname: string | null;
  score: number | null;
  duration_seconds: number | null;
};

export async function POST(req: Request) {
  const body = await req.json();

  const {
    attemptId,
    testSlug,
    nickname,
    correct,
    wrong,
    answered,
    total,
    durationSeconds,
  } = body ?? {};

  if (!attemptId || !testSlug || !nickname) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const cleanNick = String(nickname).trim().slice(0, 18);
  if (cleanNick.length < 3) {
    return NextResponse.json({ error: "Nickname too short" }, { status: 400 });
  }

  if (!supabaseServer) {
    return NextResponse.json(
      { success: false, message: "Supabase not configured" },
      { status: 500 }
    );
  }

  const score = Number(correct ?? 0); // veya accuracy*100

  // 1) Insert attempt
  const { error: insErr } = await supabaseServer.from("attempts").insert([
    {
      attempt_id: String(attemptId),
      test_slug: String(testSlug),
      nickname: cleanNick,
      correct: Number(correct ?? 0),
      wrong: Number(wrong ?? 0),
      answered: Number(answered ?? 0),
      total: Number(total ?? 60),
      score,
      duration_seconds: Number(durationSeconds ?? 0),
    },
  ]);

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  // 2) Rank hesapla (test bazlı ALL-TIME)
  // rank = senden daha yüksek score + eşit score olup daha kısa süre + 1
  const { count: betterCount, error: cErr } = await supabaseServer
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("test_slug", testSlug)
    .or(`score.gt.${score},and(score.eq.${score},duration_seconds.lt.${Number(durationSeconds ?? 0)})`);

  if (cErr) {
    return NextResponse.json({ error: cErr.message }, { status: 500 });
  }

  const rank = (betterCount ?? 0) + 1;

  // 3) Total players
  const { count: totalPlayers } = await supabaseServer
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("test_slug", testSlug);

  // 4) Top 10
  const { data: top10 }: { data: Top10Row[] | null } = await supabaseServer
    .from("attempts")
    .select("nickname,score,duration_seconds,finished_at")
    .eq("test_slug", testSlug)
    .order("score", { ascending: false })
    .order("duration_seconds", { ascending: true })
    .limit(10);

  return NextResponse.json({
    rank,
    totalPlayers: totalPlayers ?? 0,
    top10: (top10 ?? []).map((x: Top10Row) => ({
      nickname: x.nickname,
      score: x.score,
      durationSeconds: x.duration_seconds,
    })),
  });
}
