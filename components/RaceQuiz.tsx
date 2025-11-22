'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Supabase Client Bağlantısı (Hata almamak için boş string kontrolü ekledik)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  // TypeScript'in şıklara dinamik erişimine izin ver
  [key: string]: any;
}

interface RaceQuizProps {
  questions: Question[];
  raceId: string;
  totalTime: number;
}

export default function RaceQuiz({ questions, raceId, totalTime }: RaceQuizProps) {
  const router = useRouter();
  
  // State Tanımları
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isFinished, setIsFinished] = useState(false);

  // Geri Sayım Sayacı
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish(); // Süre biterse otomatik bitir
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Şık Seçme
  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  // Sınavı Bitirme
  const handleFinish = async () => {
    setIsFinished(true);
    
    // 1. Puanı Hesapla
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_option) {
        score++;
      }
    });

    // 2. Geçen Süre
    const timeSpent = totalTime - timeLeft;

    // 3. Kullanıcıdan İsim İste
    let nickname = '';
    if (typeof window !== 'undefined') {
      nickname = window.prompt(`🏁 TIME'S UP!\nScore: ${score}/50\nEnter your nickname for the Global Leaderboard:`) || '';
    }
    
    if (!nickname || nickname.trim() === "") {
      nickname = `Guest-${Math.floor(Math.random() * 10000)}`;
    }

    try {
      // 4. Kaydet
      const { error } = await supabase
        .from('race_results')
        .insert({
          username: nickname,
          race_id: parseInt(raceId),
          score: score,
          time_seconds: timeSpent
        });

      if (error) throw error;

      // 5. Sonuç Sayfasına Git
      router.push(`/race/${raceId}/result?score=${score}&time=${timeSpent}&user=${encodeURIComponent(nickname)}`);

    } catch (err) {
      console.error('Error saving result:', err);
      router.push(`/race/${raceId}/result?score=${score}&time=${timeSpent}&user=${encodeURIComponent(nickname)}`);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (isFinished) return <div className="p-20 text-center text-xl font-bold text-blue-600 animate-pulse">Calculating Results... 🚀</div>;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      
      {/* Üst Bilgi */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-lg">Question {currentIndex + 1} / {questions.length}</div>
        <div className={`font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* İlerleme Çubuğu */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-600 h-2 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Soru Alanı */}
      <div className="p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.question_text}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {['a', 'b', 'c', 'd'].map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionSelect(opt)}
              className={`
                text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group
                ${answers[currentIndex] === opt 
                  ? 'border-blue-600 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border
                ${answers[currentIndex] === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-300 group-hover:border-blue-400'}
              `}>
                {opt.toUpperCase()}
              </div>
              <div className="text-lg font-medium text-gray-700">
                {currentQuestion[`option_${opt}`]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Alt Butonlar */}
      <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-2 text-gray-600 font-bold hover:text-gray-900 disabled:opacity-30"
        >
          ← Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleFinish}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transform hover:scale-105 transition"
          >
            FINISH EXAM ✅
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:translate-x-1 transition"
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
}
