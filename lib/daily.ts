// lib/daily.ts
export function getDayKeyTR(now = new Date()) {
  // Istanbul gün anahtarı: YYYY-MM-DD
  return now.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}

export function getDailyTestNumber(now = new Date()) {
  // 32 -> 1 döngüsü için: gün sayısını alıp mod 32
  const dayKey = getDayKeyTR(now);
  const [y, m, d] = dayKey.split("-").map(Number);
  const utcMid = Date.UTC(y, (m ?? 1) - 1, d ?? 1);
  const days = Math.floor(utcMid / 86400000);

  const idx = days % 32;      // 0..31
  return 32 - idx;            // 32..1
}

export function getDailySlug(now = new Date()) {
  const dayKey = getDayKeyTR(now);
  const num = getDailyTestNumber(now);
  // Her gün slug değiştiği için leaderboard otomatik sıfırlanır ✅
  return `yds-daily-${dayKey}-test-${num}`;
}
