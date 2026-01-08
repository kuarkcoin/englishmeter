const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// 🔑 GitHub Codespace Secrets üzerinden 10 anahtarı çekiyoruz
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
  process.env.GOOGLE_KEY_10
].filter(key => key); // Sadece tanımlanmış olanları listeye al

let currentKeyIndex = 0;
const inputPath = "./data/yds_vocabulary.json";
const outputPath = "./data/yds_vocabulary_enriched.json";

// Anahtar kontrolü
if (apiKeys.length === 0) {
  console.error("❌ HATA: Hiç API anahtarı bulunamadı! Codespace Secrets ayarlarını kontrol et.");
  process.exit(1);
}

// Veriyi Yükle (Kaldığı yerden devam etme mantığı)
let vocabulary;
if (fs.existsSync(outputPath)) {
  vocabulary = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
  console.log("🔄 Mevcut ilerleme yüklendi, kalındığı yerden devam ediliyor...");
} else {
  vocabulary = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log("📂 Orijinal liste yüklendi.");
}

async function getAiContent(wordObj) {
  const genAI = new GoogleGenerativeAI(apiKeys[currentKeyIndex]);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Word: "${wordObj.word}" (Meaning: ${wordObj.meaning}). 
  Task: Write a high-level academic English sentence using this word and its Turkish translation.
  Return ONLY a valid JSON: {"s": "sentence", "t": "translation"}`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    // 429 veya limit hatalarında anahtar değiştir
    if (error.message.includes("429") || error.message.includes("limit")) {
      console.log(`⚠️ Key ${currentKeyIndex + 1} limiti doldu. Sıradakine geçiliyor...`);
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      await new Promise(r => setTimeout(r, 1000));
      return getAiContent(wordObj);
    }
    console.error(`❌ Hata (${wordObj.word}):`, error.message);
    return null;
  }
}

async function start() {
  console.log(`🚀 MEGA OPERASYON BAŞLADI! (${apiKeys.length} Anahtar Aktif)`);
  
  for (let i = 0; i < vocabulary.length; i++) {
    // Zaten s (sentence) ve t (translation) varsa bu kelimeyi atla
    if (vocabulary[i].s && vocabulary[i].t) continue;

    const result = await getAiContent(vocabulary[i]);
    
    if (result && result.s) {
      vocabulary[i].s = result.s;
      vocabulary[i].t = result.t;
      console.log(`✅ [${i + 1}/3850] ${vocabulary[i].word} (Key Index: ${currentKeyIndex})`);
    }

    // Her 10 kelimede bir dosyayı güncelle
    if (i % 10 === 0) {
      fs.writeFileSync(outputPath, JSON.stringify(vocabulary, null, 2));
    }

    await new Promise(r => setTimeout(r, 250)); // Hız ayarı
  }

  fs.writeFileSync(outputPath, JSON.stringify(vocabulary, null, 2));
  console.log("🏁 MÜJDE! Tüm kelimeler zenginleştirildi.");
}

start();
