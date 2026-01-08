const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// ✅ Codespace Secrets keys
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
let consecutiveLimitErrors = 0; // Üst üste gelen limit hatalarını sayar

const inputPath = path.join(process.cwd(), "data", "yds_vocabulary.json");
const outputPath = path.join(process.cwd(), "data", "yds_vocabulary_enriched.json");
const backupPath = path.join(process.cwd(), "data", "yds_vocabulary_raw.json");

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
    m.includes("resource_exhausted")
  );
}

function safeJsonParse(rawText) {
  let text = String(rawText || "").replace(/```json|```/g, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  const parsed = JSON.parse(text);
  return { s: String(parsed?.s || "").trim(), t: String(parsed?.t || "").trim() };
}

async function getAiContent(wordObj) {
  // Eğer tüm anahtarlar denendiyse ve hala hata alıyorsak mola ver
  if (consecutiveLimitErrors >= apiKeys.length) {
    console.log(`🛑 Tüm anahtarlar limit yedi. 65 saniye mola veriliyor (Soğuma modu)...`);
    await sleep(65000); 
    consecutiveLimitErrors = 0; // Sayacı sıfırla
  }

  const genAI = new GoogleGenerativeAI(apiKeys[currentKeyIndex]);
  // Model ismini en stabil olan 2.5-flash olarak güncelledim
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Word: "${wordObj.word}" (Meaning: ${wordObj.meaning}). 
Return ONLY JSON: {"s":"ONE high-level academic English sentence","t":"Turkish translation"}`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result?.response?.text?.() ?? "";
    const parsed = safeJsonParse(raw);
    
    consecutiveLimitErrors = 0; // Başarılı olursa hata sayacını sıfırla
    return parsed;
  } catch (error) {
    const msg = String(error?.message || error);

    if (isRateLimitError(msg)) {
      consecutiveLimitErrors++;
      console.log(`⚠️ Key ${currentKeyIndex + 1} limitlendi. (Hata: ${consecutiveLimitErrors}/${apiKeys.length})`);
      
      // Sıradaki anahtara geç
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      
      // Küçük bir nefes al ve tekrar dene
      await sleep(1500); 
      return getAiContent(wordObj);
    }

    console.error(`❌ Beklenmedik Hata (${wordObj.word}):`, msg);
    return null;
  }
}

async function start() {
  console.log(`🚀 ENRICH BAŞLADI! (${apiKeys.length} Anahtar ile Güvenli Mod)`);

  let vocabulary;
  if (fs.existsSync(outputPath)) {
    vocabulary = loadJson(outputPath);
    console.log("🔄 Kaldığı yerden (enriched) devam ediyor...");
  } else {
    vocabulary = loadJson(inputPath);
    console.log("📂 Orijinal liste yüklendi.");
  }

  const total = vocabulary.length;

  for (let i = 0; i < total; i++) {
    if (vocabulary[i].s && vocabulary[i].t) continue;

    const result = await getAiContent(vocabulary[i]);

    if (result && result.s) {
      vocabulary[i].s = result.s;
      vocabulary[i].t = result.t;
      console.log(`✅ [${i + 1}/${total}] ${vocabulary[i].word} (Key ${currentKeyIndex + 1})`);
    }

    // Her 10 kelimede bir yedekle
    if ((i + 1) % 10 === 0) {
      saveJson(outputPath, vocabulary);
    }

    // API'yi yormamak için hızı 1 saniyeye sabitledim (Daha güvenli)
    await sleep(1200); 
  }

  saveJson(outputPath, vocabulary);

  // Swap İşlemi
  try {
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log("🧷 Orijinal dosya yedeklendi.");
    }
    fs.copyFileSync(outputPath, inputPath);
    console.log("✅ SWAP TAMAM: yds_vocabulary.json güncellendi.");
  } catch (e) {
    console.log("⚠️ Swap hatası:", e.message);
  }

  console.log("🏁 İŞLEM TAMAMLANDI.");
}

start();
