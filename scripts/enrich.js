const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// 🔑 10 ADET API KEY'İNİ BURAYA DİZ
const apiKeys = [
"AIzaSyASUe1kZ4vO3JMQUnVfDjDthPXc4C4NKGg", "AIzaSyCWlNknsqG1lTSALC1WhtGKabRnz73CCi8", "AIzaSyCnWPz5hNwlcbih5drdf-GN0umPJC5dp8U", "AIzaSyCmMxmNuCqhKfhyLPTvVPuwEBbmIGJ4XYg", "AIzaSyCH_sbt_A3KSxzK6Nxt45j9g6eIdZ3d58M",
"AIzaSyBGw4kjHlF7OLihEaq_QXNBUk0VobU47g8", "AIzaSyD6GohYmLf6CHMWQ5RYesCA-_tLm7LfHwo", "AIzaSyAYLakMvfS5ahEYV20fzek0az5zbdJKG5g", "AIzaSyDaw475DX73eR2c1maMRdV9Bfi2EyagE2M", "AIzaSyCHFnHaITzFu7HjANsRm4XwLUv2dPqTkdQ"
];

let currentKeyIndex = 0;
const inputPath = "./data/yds_vocabulary.json"; // SENİN MEVCUT DOSYAN
const outputPath = "./data/yds_vocabulary_enriched.json"; // YENİ OLUŞACAK DOSYA

// Veriyi Yükle
let vocabulary;
try {
  // Eğer daha önce çalıştırdıysan ve yarıda kaldıysa, yeni dosyadan devam et
  if (fs.existsSync(outputPath)) {
    vocabulary = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    console.log("🔄 Enriched dosyası bulundu, kalındığı yerden devam ediliyor...");
  } else {
    // İlk defa çalışıyorsa orijinal dosyayı oku
    vocabulary = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
    console.log("📂 Orijinal yds_vocabulary.json yüklendi.");
  }
} catch (err) {
  console.error("❌ Dosya okuma hatası! Lütfen yds_vocabulary.json dosyasını kontrol et.");
  process.exit(1);
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
    if (error.message.includes("429") || error.message.includes("limit")) {
      console.log(`⚠️ Key ${currentKeyIndex + 1} limiti doldu. Sonrakine geçiliyor...`);
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      return getAiContent(wordObj);
    }
    console.error(`❌ Hata (${wordObj.word}):`, error.message);
    return null;
  }
}

async function start() {
  console.log(`🚀 10 API Key ile Operasyon Başladı! Hedef: 3850 Kelime`);
  
  for (let i = 0; i < vocabulary.length; i++) {
    // Eğer bu kelimeye daha önce cümle (s) ve çeviri (t) eklenmişse atla
    if (vocabulary[i].s && vocabulary[i].t) continue;

    const result = await getAiContent(vocabulary[i]);
    
    if (result && result.s) {
      vocabulary[i].s = result.s;
      vocabulary[i].t = result.t;
      console.log(`✅ [${i + 1}/3850] ${vocabulary[i].word} işlendi (Key: ${currentKeyIndex + 1})`);
    }

    // Her 10 kelimede bir dosyayı kaydet (Güvenlik)
    if (i % 10 === 0) {
      fs.writeFileSync(outputPath, JSON.stringify(vocabulary, null, 2));
    }

    // 10 key olduğu için bekleme süresini 200ms yaptık (Süper hızlı)
    await new Promise(r => setTimeout(r, 200)); 
  }

  // Final Kaydı
  fs.writeFileSync(outputPath, JSON.stringify(vocabulary, null, 2));
  console.log("🏁 MÜJDE! Tüm kelimeler zenginleştirildi ve yds_vocabulary_enriched.json dosyasına kaydedildi.");
}

start();
