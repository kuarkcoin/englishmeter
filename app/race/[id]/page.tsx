"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // useRouter silindi!
import Link from "next/link";
import questionsData from "@/data/race_questions.json";

// --- TYPES ---
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

const FAKE_NAMES = [
  "Jessica M.", "David B.", "Sarah K.", "Michael R.", "Emma W.",
  "Daniel P.", "Olivia S.", "James L.", "Sophia C.", "William H.",
  "Isabella F.", "Lucas G.", "Mia T.", "Benjamin D.", "Charlotte N.",
  "Henry A.", "Amelia V.", "Alexander J.", "Harper E.", "Sebastian O."
];

export default function RaceExamPage() {
  const params = useParams();
  const raceId = params?.id || "1";

  const [gameState, setGameState] = useState<"WELCOME" | "QUIZ" | "NAME_INPUT" | "RESULT">("WELCOME");
  const [userName, setUserName] = useState("");
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [topLeaderboard, setTopLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userResult, setUserResult] = useState<LeaderboardUser | null>(null);
  const [totalParticipants] = useState(3542);

  // START EXAM
  const startExam = () => {
    const formattedQuestions: Question[] = questionsData.map((q: any) => ({
      id: q.id,
      question: q.question_text,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      answer: String(q.correct_option).trim().toUpperCase()
    }));

    const selectedQuestions = formattedQuestions.length <= 50
      ? formattedQuestions
      : formattedQuestions.sort(() => 0.5 - Math.random()).slice(0, 50);

    setExamQuestions(selectedQuestions);
    setScore(0);
    setCurrentQIndex(0);
    setUserName("");
    setGameState("QUIZ");
    setTimeLeft(50 * 60);
  };

  // TIMER
  useEffect(() => {
    if (gameState !== "QUIZ" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    if (timeLeft === 0) setGameState("NAME_INPUT");
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // HANDLE ANSWER
  const handleAnswer = (selectedOption: string) => {
    const currentQ = examQuestions[currentQIndex];
    if (selectedOption === currentQ.answer) {
      setScore(prev => prev + 1);
    }

    if (currentQIndex < examQuestions.length - 1) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 200);
    } else {
      setTimeout(() => setGameState("NAME_INPUT"), 200);
    }
  };

  // SUBMIT NAME & SHOW RESULT
  const submitNameAndShowResult = () => {
    if (!userName.trim()) return alert("Please enter a name.");

    const topList: LeaderboardUser[] = [
      { name: "Alex K. (Champion)", score: 49, rank: 1, isRealUser: false },
      { name: "Sarah L.", score: 48, rank: 2, isRealUser: false },
      { name: "Mike T.", score: 47, rank: 3, isRealUser: false },
    ];

    for (let i = 0; i < 17; i++) {
      topList.push({
        name: FAKE_NAMES[i] || `Racer ${i + 4}`,
        score: Math.floor(Math.random() * 7) + 40,
        rank: 0,
        isRealUser: false
      });
    }

    topList.sort((a, b) => b.score - a.score);
    topList.forEach((u, i) => u.rank = i + 1);

    if (score >= 40) {
      topList.push({ name: userName, score, rank: 0, isRealUser: true });
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
    } else {
      const calculatedRank = Math.max(21, 3200 - score * 55 + Math.floor(Math.random() * 50));
      setTopLeaderboard(topList);
      setUserResult({ name: userName, score, rank: calculatedRank, isRealUser: true });
    }

    setGameState("RESULT");
  };

  // WELCOME SCREEN
  if (gameState === "WELCOME") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
            RACE #{raceId}
          </span>
          <h1 className="text-5xl font-black text-blue-600 mb-4">English Race</h1>
          <div className="text-6xl mb-6">Trophy</div>
          <p className="text-gray-600 mb-8 text-lg">
            50 Questions • 50 Minutes<br />
            <span className="text-sm font-bold text-green-600">Currently {totalParticipants} people racing...</span>
          </p>
          <button onClick={startExam} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-2xl hover:bg-blue-700 transition shadow-lg">
            START RACE
          </button>
          <Link href="/race" className="block mt-4 text-blue-600 hover:text-blue-800 font-bold text-lg">
            Back to Race Menu
          </Link>
        </div>
      </main>
    );
  }

  // NAME INPUT SCREEN
  if (gameState === "NAME_INPUT") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-2">Race Finished! Well done!</h2>
          <div className="bg-blue-100 p-4 rounded-xl my-6">
            <span className="block text-sm text-blue-600 font-bold uppercase">Your Score</span>
            <span className="text-5xl font-black text-blue-700">{score} / 50</span>
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Your Name..."
            value={userName}
            onChange={e => setUserName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitNameAndShowResult()}
            className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg focus:border-blue-500 outline-none"
          />
          <button onClick={submitNameAndShowResult} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700">
            SHOW RANKING Trophy
          </button>
        </div>
      </main>
    );
  }

  // RESULT SCREEN
  if (gameState === "RESULT") {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center">
            <span className="absolute top-4 left-4 bg-blue-800 text-xs px-2 py-1 rounded">RACE #{raceId}</span>
            <h2 className="text-3xl font-bold">Global Ranking</h2>
            <p>Total Participants: {totalParticipants}</p>
          </div>
          <div className="p-6">
            <div className="space-y-2 mb-6">
              {topLeaderboard.map(user => (
                <div key={user.rank} className={`flex justify-between p-3 rounded-xl border ${user.isRealUser ? "bg-yellow-50 border-yellow-400" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex-center font-bold text-sm ${user.rank <= 3 ? "bg-yellow-400 text-white" : "bg-gray-100"}`}>
                      {user.rank}
                    </span>
                    <span className="font-bold">{user.name} {user.isRealUser && "(You)"}</span>
                  </div>
                  <span className="font-bold text-blue-600">{user.score} P</span>
                </div>
              ))}
            </div>

            {userResult && (
              <div className="text-center my-8">
                <div className="text-xs text-gray-400 mb-2">... {userResult.rank - 21} racers hidden ...</div>
                <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex-center text-2xl font-bold">
                        {userResult.rank}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">{userResult.name} (You)</div>
                        <div className="text-sm text-blue-600">Your Rank</div>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-blue-700">{userResult.score} P</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button onClick={() => window.location.reload()} className="bg-gray-800 text-white py-4 rounded-xl font-bold">
                Retry Race
              </button>
              <Link href="/race" className="bg-blue-100 text-blue-700 py-4 rounded-xl font-bold text-center">
                Back to Race Menu
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // QUIZ SCREEN
  const currentQ = examQuestions[currentQIndex];
  if (!currentQ) return <div className="min-h-screen flex-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-3">
      <div className="w-full max-w-3xl flex justify-between items-center mb-5 bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <div className="text-xs text-gray-400 font-bold uppercase">Race #{raceId}</div>
          <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? "text-red-600 animate-pulse" : "text-gray-800"}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 font-bold uppercase">Question</div>
          <div className="text-xl font-bold text-blue-600">
            {currentQIndex + 1} <span className="text-gray-300">/ 50</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-2xl shadow-lg border">
        <h2 className="text-xl md:text-2xl font-bold mb-6 leading-relaxed">
          {currentQ.question}
        </h2>
        <div className="grid gap-3">
          {currentQ.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <button
                key={i}
                onClick={() => handleAnswer(letter)}
                className="w-full text-left p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition active:scale-99 group"
              >
                <div className="flex items-center">
                  <span className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 font-bold mr-4 flex-center group-hover:bg-blue-600 group-hover:text-white transition">
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
