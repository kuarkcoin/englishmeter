const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// ✅ Codespace Secrets keys (senin mevcut isimlerinle uyumlu)
const apiKeys = [
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
].filter(Boolean);

let currentKeyIndex = 0;

// ✅ absolute path güvenliği
const inputPath = path.join(process.cwd(), "data", "yds_vocabulary.json");
const outputPath = path.join(process.cwd(), "data", "yds_vocabulary_enriched.json");
const backupPath = path.join(process.cwd(), "data", "yds_vocabulary_raw.json");

// --- Guards ---
if (apiKeys.length === 0) {
  console.error("❌ HATA: Hiç API anahtarı bulunamadı! Codespace Secrets ayarlarını kontrol et.");
  process.exit(1);
}
if (!fs.existsSync(inputPath)) {
  console.error("❌ HATA: input dosyası yok:", inputPath);
  process.exit(1);
}

// --- Helpers ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}
function saveJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function isRateLimitError(msg) {
  const m = String(msg || "").toLowerCase();
  return (
    m.includes("429") ||
    m.includes("limit") ||
    m.includes("quota") ||
    m.includes("too many") ||
    m.includes("resource_exhausted") ||
    m.includes("rate") ||
    m.includes("exceeded")
  );
}

// ✅ Gemini bazen JSON dışı metin ekler -> gövdeyi ayıkla
function safeJsonParse(rawText) {
  let text = String(rawText || "")
    .replace(/```json|```/g, "")
    .trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);

  const parsed = JSON.parse(text);

  const s = String(parsed?.s ?? "").trim();
  const t = String(parsed?.t ?? "").trim();
  if (!s || !t) throw new Error("Invalid JSON: missing s/t");

  return { s, t };
}

async function getAiContent(wordObj) {
  const genAI = new GoogleGenerativeAI(apiKeys[currentKeyIndex]);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Word: "${wordObj.word}" (Meaning: ${wordObj.meaning}).
Task:
1) Write ONE high-level academic English sentence using the word naturally.
2) Write Turkish translation of that sentence.
Return ONLY valid JSON:
{"s":"...","t":"..."}`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result?.response?.text?.() ?? "";
    return safeJsonParse(raw);
  } catch (error) {
    const msg = String(error?.message || error);

    if (isRateLimitError(msg)) {
      console.log(`⚠️ Key ${currentKeyIndex + 1} limit/quota. Sıradaki key'e geçiliyor...`);
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      await sleep(1200);
      return getAiContent(wordObj);
    }

    console.error(`❌ Hata (${wordObj.word}):`, msg);
    return null;
  }
}

async function start() {
  console.log(`🚀 ENRICH BAŞLADI! (${apiKeys.length} Anahtar Aktif)`);

  // ✅ Resume mantığı
  let vocabulary;
  if (fs.existsSync(outputPath)) {
    vocabulary = loadJson(outputPath);
    console.log("🔄 Enriched bulundu, kaldığı yerden devam...");
  } else {
    vocabulary = loadJson(inputPath);
    console.log("📂 Orijinal liste yüklendi.");
  }

  // ✅ normalize
  vocabulary = (vocabulary || []).map((x) => ({
    word: String(x?.word ?? "").trim(),
    meaning: String(x?.meaning ?? "").trim(),
    s: x?.s ?? null,
    t: x?.t ?? null,
  }));

  // boş kayıtları at (güvenlik)
  vocabulary = vocabulary.filter((x) => x.word && x.meaning);

  const total = vocabulary.length;
  console.log(`📌 Toplam kelime: ${total}`);

  for (let i = 0; i < total; i++) {
    if (vocabulary[i].s && vocabulary[i].t) continue;

    const result = await getAiContent(vocabulary[i]);

    if (result?.s) {
      vocabulary[i].s = result.s;
      vocabulary[i].t = result.t;
      console.log(`✅ [${i + 1}/${total}] ${vocabulary[i].word} (Key ${currentKeyIndex + 1})`);
    }

    // ✅ Her 10 kelimede bir kaydet (i=0 yazmasın)
    if ((i + 1) % 10 === 0) {
      saveJson(outputPath, vocabulary);
    }

    await sleep(250);
  }

  // final write
  saveJson(outputPath, vocabulary);
  console.log("🏁 Enriched tamam:", outputPath);

  // ✅ Backup + Swap
  try {
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log("🧷 Backup alındı:", backupPath);
    }
    fs.copyFileSync(outputPath, inputPath);
    console.log("✅ Swap tamam: yds_vocabulary.json artık s/t içeriyor.");
  } catch (e) {
    console.log("⚠️ Swap yapılamadı:", e?.message || e);
  }

  console.log("✅ BİTTİ.");
}

start();
