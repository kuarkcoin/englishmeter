"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // EKLENDİ: ID ve Yönlendirme için
import Link from "next/link"; // EKLENDİ: Menüye dönüş için
import questionsData from "@/data/race_questions.json";

// --- TİPLER ---
type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

type LeaderboardUser = {
  name: string;
  score: number;
  rank: number;
  isRealUser: boolean;
};

// --- SANAL RAKİP İSİMLERİ ---
const FAKE_NAMES = [
  "Zeynep A.", "Burak O.", "Mert H.", "Pelin Su", "Kemal R.", 
  "Rick G.", "Morty S.", "Seda F.", "Barış M.", "Cemre K.", 
  "Derya T.", "Caner E.", "Elif S.", "David B.", "Sarah C.",
  "Oğuzhan K.", "Ayşe Y.", "Fatma N.", "Mustafa C.", "Hasan A."
];

export default function RaceExamPage() {
  // --- HOOKS ---
  const params = useParams(); // URL'den ID'yi çek (race/1 -> id:1)
  const router = useRouter();
  const raceId = params?.id || "1"; // ID yoksa 1 varsay

  // --- STATE'LER ---
  const [gameState, setGameState] = useState<"WELCOME" | "QUIZ" | "NAME_INPUT" | "RESULT">("WELCOME");
  const [userName, setUserName] = useState("");
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  
  // Tablo state'leri
  const [topLeaderboard, setTopLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userResult, setUserResult] = useState<LeaderboardUser | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(3542);

  // --- 1. SINAVI BAŞLAT ---
  const startExam = () => {
    // Soruları formatla
    const formattedQuestions: Question[] = questionsData.map((q: any) => ({
      id: q.id,
      question: q.question_text,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      answer: q.correct_option.trim()
    }));

    // Rastgele 50 soru seç (Her race için farklı kombinasyon gibi hissettirir)
    let selectedQuestions = [];
    if (formattedQuestions.length <= 50) {
      selectedQuestions = formattedQuestions; 
    } else {
      selectedQuestions = formattedQuestions.sort(() => 0.5 - Math.random()).slice(0, 50);
    }

    setExamQuestions(selectedQuestions);
    setScore(0); 
    setCurrentQIndex(0);
    setUserName("");
    setGameState("QUIZ");
    setTimeLeft(50 * 60); // Süreyi sıfırla
  };

  // --- 2. SAYAÇ ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "QUIZ" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === "QUIZ") {
      setGameState("NAME_INPUT");
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- 3. CEVAPLAMA ---
  const handleAnswer = (selectedOption: string) => {
    const currentQ = examQuestions[currentQIndex];
    const isCorrect = selectedOption === currentQ.answer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQIndex < examQuestions.length - 1) {
      setTimeout(() => setCurrentQIndex((prev) => prev + 1), 200);
    } else {
      setTimeout(() => setGameState("NAME_INPUT"), 200);
    }
  };

  // --- 4. SONUÇ HESAPLAMA ---
  const submitNameAndShowResult = () => {
    if (!userName.trim()) {
      alert("Lütfen bir isim giriniz.");
      return;
    }

    // A) Sanal Tablo Oluştur
    const topList: LeaderboardUser[] = [];
    
    // Şampiyonlar
    topList.push({ name: "Ahmet K. (Şampiyon)", score: 49, rank: 1, isRealUser: false });
    topList.push({ name: "Selin Y.", score: 48, rank: 2, isRealUser: false });
    topList.push({ name: "Mehmet T.", score: 47, rank: 3, isRealUser: false });

    // Rastgele botlar
    for (let i = 0; i < 17; i++) {
      topList.push({
        name: FAKE_NAMES[i] || `Yarışmacı ${i}`,
        score: Math.floor(Math.random() * 7) + 40,
        rank: 0,
        isRealUser: false
      });
    }

    topList.sort((a, b) => b.score - a.score);
    topList.forEach((u, i) => u.rank = i + 1);

    // B) Kullanıcıyı Yerleştir
    let calculatedRank = 0;

    if (score >= 40) {
      topList.push({ name: userName, score: score, rank: 0, isRealUser: true });
      topList.sort((a, b) => b.score - a.score);
      topList.forEach((u, i) => u.rank = i + 1);
      
      const userIndex = topList.findIndex(u => u.isRealUser);
      if (userIndex < 20) {
         setTopLeaderboard(topList.slice(0, 20));
         setUserResult(null);
      } else {
         setTopLeaderboard(topList.slice(0, 20));
         setUserResult(topList[userIndex]);
      }
    } 
    else {
      const maxRank = 3200; 
      const rankGainPerPoint = 55; 
      const randomFactor = Math.floor(Math.random() * 50); 
      calculatedRank = maxRank - (score * rankGainPerPoint) + randomFactor;
      if (calculatedRank < 21) calculatedRank = 21;

      setTopLeaderboard(topList);
      setUserResult({
        name: userName,
        score: score,
        rank: calculatedRank,
        isRealUser: true
      });
    }

    setGameState("RESULT");
  };

  // ================= EKRANLAR =================

  // 1. HOŞGELDİN EKRANI
  if (gameState === "WELCOME") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
            RACE #{raceId}
          </span>
          <h1 className="text-5xl font-black text-blue-600 mb-4">English Race</h1>
          <div className="text-6xl mb-6">🏁</div>
          <p className="text-gray-600 mb-8 text-lg">
            50 Soru • 50 Dakika<br/>
            <span className="text-sm font-bold text-green-600">Şu an {totalParticipants} kişi yarışıyor...</span>
          </p>
          <div className="flex flex-col gap-3">
            <button 
                onClick={startExam}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-2xl hover:bg-blue-700 transition shadow-lg transform hover:scale-105 active:scale-95"
            >
                YARIŞA BAŞLA
            </button>
            <Link href="/race" className="text-gray-400 hover:text-gray-600 text-sm font-medium mt-2">
                ← Başka Bir Yarış Seç
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. İSİM GİRME EKRANI
  if (gameState === "NAME_INPUT") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sınav Bitti! 👏</h2>
          <div className="bg-blue-100 p-4 rounded-xl mb-6 mt-4">
            <span className="block text-sm text-blue-600 font-bold uppercase">Doğru Sayın</span>
            <span className="text-5xl font-black text-blue-700">{score} / 50</span>
          </div>
          <p className="text-left text-sm font-bold text-gray-700 mb-2 ml-1">Sıralamayı görmek için isim gir:</p>
          <input
            type="text"
            autoFocus
            placeholder="Adınız Soyadınız..."
            className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitNameAndShowResult()}
          />
          <button 
            onClick={submitNameAndShowResult}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg"
          >
            SONUCU GÖSTER 🏆
          </button>
        </div>
      </main>
    );
  }

  // 3. SONUÇ TABLOSU
  if (gameState === "RESULT") {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-blue-600 p-8 text-white text-center relative">
            <span className="absolute top-4 left-4 bg-blue-800 text-xs px-2 py-1 rounded">RACE #{raceId}</span>
            <h2 className="text-3xl font-bold mb-2">Türkiye Geneli Sıralama</h2>
            <p className="opacity-90">Katılımcı Sayısı: {totalParticipants}</p>
          </div>

          <div className="p-6">            
            {/* TABLO */}
            <div className="space-y-2 mb-6">
              {topLeaderboard.map((user, i) => (
                <div 
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    user.isRealUser 
                      ? "bg-yellow-50 border-yellow-400 ring-1 ring-yellow-300 scale-[1.02]" 
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                      user.rank === 1 ? "bg-yellow-400 text-white" :
                      user.rank <= 3 ? "bg-gray-300 text-white" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {user.rank}
                    </span>
                    <span className={`font-bold ${user.isRealUser ? "text-black" : "text-gray-600"}`}>
                      {user.name} {user.isRealUser && "(Sen)"}
                    </span>
                  </div>
                  <div className="font-bold text-blue-600">{user.score} D</div>
                </div>
              ))}
            </div>

            {/* KULLANICI LİSTE DIŞINDAYSA */}
            {userResult && (
              <div className="mb-8">
                 <div className="py-2 text-center text-xs text-gray-400">...</div>
                 <div className="flex items-center justify-between p-4 rounded-xl border-2 border-blue-500 bg-blue-50 shadow-lg transform scale-105">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md">
                      {userResult.rank}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-black text-lg">{userResult.name} (Sen)</span>
                      <span className="text-xs text-blue-600 font-semibold">Sıralaman</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-blue-700">{userResult.score} D</div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <button 
                onClick={() => window.location.reload()}
                className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2"
                >
                🔄 Aynı Yarışı Tekrarla
                </button>
                
                <Link 
                href="/race"
                className="w-full bg-blue-100 text-blue-700 py-4 rounded-xl font-bold hover:bg-blue-200 transition flex items-center justify-center gap-2"
                >
                ⬅️ Yarış Menüsü
                </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 4. QUIZ EKRANI
  const currentQ = examQuestions[currentQIndex];
  if(!currentQ) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Race #{raceId}</span>
            <span className={`text-2xl font-mono font-bold ${timeLeft < 60 ? "text-red-600 animate-pulse" : "text-gray-800"}`}>
                {formatTime(timeLeft)}
            </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Soru</span>
          <div className="text-xl font-bold text-blue-600">
            {currentQIndex + 1} <span className="text-gray-300 text-base">/ 50</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="grid gap-4">
          {currentQ.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <button
                key={i}
                onClick={() => handleAnswer(letter)}
                className="group relative w-full text-left p-5 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 active:scale-[0.99]"
              >
                <div className="flex items-center">
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 font-bold rounded-lg mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors border">
                    {letter}
                  </span>
                  <span className="text-lg font-medium text-gray-700 group-hover:text-blue-700">
                    {opt}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
                  }
