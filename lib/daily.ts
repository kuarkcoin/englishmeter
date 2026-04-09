// lib/daily.ts

// Gün anahtarı: YYYY-MM-DD
export function getDayKeyTR(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// 32'den 1'e dönen günlük test numarası (1..32)
export function getDailyTestNumber(d = new Date()) {
  const dayIndex = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  const mod = dayIndex % 32; // 0..31
  return 32 - mod; // 32..1
}

// yds-daily-YYYY-MM-DD-test-N
export function getDailySlug(d = new Date()) {
  const dayKey = getDayKeyTR(d);
  const num = getDailyTestNumber(d);
  return `yds-daily-${dayKey}-test-${num}`;
}
