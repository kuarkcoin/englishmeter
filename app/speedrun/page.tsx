'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 3000 kelimelik dosyanı çekiyoruz
// Dosya yolu: data/yds_vocabulary.json
import fullWordList from '@/data/yds_vocabulary.json'; 

export default function SpeedRunPage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // JSON formatın "word" ve "meaning" olduğu için state'i ona göre ayarladık
  const [currentWord, setCurrentWord] = useState<any>({ word: '', meaning: '' });
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('englishmeter_speedrun_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Zamanlayıcı
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateQuestion();
  };

  const endGame = () => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('englishmeter_speedrun_highscore', score.toString());
    }
  };

  // --- SORU ÜRETME MOTORU (GÜNCELLENDİ) ---
  const generateQuestion = () => {
    // 1. Rastgele kelime seç
    const randomIndex = Math.floor(Math.random() * fullWordList.length);
    const randomWord = fullWordList[randomIndex];
    
    // 2. Yanlış şıkları seç
    const distractors: string[] = [];
    while (distractors.length < 3) {
        const randIdx = Math.floor(Math.random() * fullWordList.length);
        const wrongWord = fullWordList[randIdx];
        
        // DÜZELTME: Senin JSON yapına göre "word" ve "meaning" kullanıyoruz
        if (wrongWord.word !== randomWord.word && !distractors.includes(wrongWord.meaning)) {
            distractors.push(wrongWord.meaning);
        }
    }

    // 3. Şıkları karıştır (Doğru cevap + Yanlışlar)
    const allOptions = [...distractors, randomWord.meaning].sort(() => 0.5 - Math.random());

    setCurrentWord(randomWord);
    setOptions(allOptions);
  };

  const handleAnswer = (selectedMeaning: string) => {
    // DÜZELTME: "meaning" ile kontrol ediyoruz
    if (selectedMeaning === currentWord.meaning) {
      // DOĞRU
      setScore(prev => prev + 10);
      setTimeLeft(prev => prev + 2); 
      generateQuestion();
    } else {
      // YANLIŞ
      setTimeLeft(prev => (prev > 5 ? prev - 5 : 0)); 
      generateQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-yellow-400 selection:text-indigo-900">
      
      {/* MENU EKRANI */}
      {gameState === 'menu' && (
        <div className="text-center max-w-md w-full bg-indigo-900/80 p-10 rounded-3xl shadow-2xl border border-indigo-800 backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6 shadow-lg shadow-yellow-400/20 text-4xl animate-bounce">
            ⚡
          </div>
          <h1 className="text-6xl font-black mb-2 text-white tracking-tighter">
            Speed<span className="text-yellow-400">Run</span>
          </h1>
          <p className="text-indigo-300 mb-8 font-medium">
            3000 Words Challenge.<br/>How fast are you?
          </p>
          
          <div className="bg-indigo-950/60 p-6 rounded-2xl mb-8 border border-indigo-800/50">
            <p className="text-xs text-indigo-400 uppercase font-bold tracking-widest mb-1">BEST SCORE</p>
            <p className="text-4xl font-mono text-yellow-400 font-bold">{highScore}</p>
          </div>

          <button 
            onClick={startGame}
            className="w-full py-5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-indigo-950 font-black rounded-2xl text-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-orange-500/20"
          >
            START GAME
          </button>
          
          <Link href="/" className="block mt-8 text-indigo-400 hover:text-white text-sm font-semibold transition-colors">
            ← Return to Main Menu
          </Link>
        </div>
      )}

      {/* OYUN EKRANI */}
      {gameState === 'playing' && (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
          {/* Üst Panel */}
          <div className="flex justify-between items-center mb-6 bg-indigo-900/60 p-4 rounded-2xl backdrop-blur-md border border-indigo-800/50">
            <div>
              <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">TIME</div>
              <div className={`text-4xl font-black font-mono leading-none ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}<span className="text-lg text-indigo-400 ml-1">s</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">SCORE</div>
              <div className="text-4xl font-black text-yellow-400 font-mono leading-none">{score}</div>
            </div>
          </div>

          {/* Soru Kartı */}
          <div className="bg-white text-indigo-950 p-12 rounded-[2rem] shadow-2xl mb-6 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            <p className="text-indigo-400 text-xs font-bold uppercase mb-3 tracking-widest">TRANSLATE</p>
            {/* DÜZELTME: currentWord.word kullanıyoruz */}
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight break-words group-hover:scale-105 transition-transform duration-300">
              {currentWord.word}
            </h2>
          </div>

          {/* Şıklar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="py-5 px-4 bg-indigo-800/80 hover:bg-indigo-600 border-b-4 border-indigo-950 hover:border-indigo-800 rounded-2xl text-lg font-bold text-indigo-100 transition-all active:translate-y-1 active:border-b-0 backdrop-blur-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME OVER EKRANI */}
      {gameState === 'gameover' && (
        <div className="text-center max-w-md w-full bg-indigo-900/90 p-10 rounded-3xl shadow-2xl border border-indigo-800 backdrop-blur-md animate-in slide-in-from-bottom-10 duration-500">
          <h2 className="text-5xl font-black text-white mb-2 tracking-tight">Time's Up!</h2>
          <p className="text-indigo-300 mb-8">Great effort! Keep practicing.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="py-6 bg-indigo-950/80 rounded-2xl border border-indigo-800">
                <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest mb-1">SCORE</p>
                <p className="text-4xl font-black text-white">{score}</p>
             </div>
             <div className="py-6 bg-indigo-950/80 rounded-2xl border border-indigo-800">
                <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest mb-1">BEST</p>
                <p className={`text-4xl font-black ${score >= highScore ? 'text-green-400' : 'text-yellow-400'}`}>
                    {highScore}
                </p>
             </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={startGame}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black rounded-xl text-lg transition-transform active:scale-95 shadow-lg"
            >
              PLAY AGAIN ↻
            </button>
            <Link href="/" className="w-full py-4 bg-indigo-800 hover:bg-indigo-700 rounded-xl font-bold text-indigo-200 transition-colors">
              Exit to Menu
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
