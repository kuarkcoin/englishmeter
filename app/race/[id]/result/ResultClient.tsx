'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Yeni eklenen, Client'ta çalışır

// Supabase Client (Env yoksa boş string ile oluşur, hata vermez)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// 11, 12, 13 özel durumunu çözen getOrdinal fonksiyonu
const getOrdinal = (n: number) => {
  if (n >= 11 && n <= 13) return n + "th";
  switch (n % 10) {
    case 1: return n + "st";
    case 2: return n + "nd";
    case 3: return n + "rd";
    default: return n + "th";
  }
};

interface ResultClientProps {
  raceId: string;
  myScore: number;
  myUsername: string;
  myTime: number;
}

export default function ResultClient({ raceId, myScore, myUsername, myTime }: ResultClientProps) {

  // Bu verileri Server Component'tan prop olarak alıyoruz.
  // Bu nedenle useSearchParams'a burada gerek kalmadı.
  
  const [topList, setTopList] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const rid = Number(raceId);
        if (!Number.isFinite(rid)) return; 

        // 1. TOP 20 Listesini Çek
        const { data: topData } = await supabase
          .from('race_results')
          .select('*')
          .eq('race_id', rid)
          .order('score', { ascending: false })
          .order('time_seconds', { ascending: true })
          .limit(20);

        if (topData) setTopList(topData);

        // 2. Sıralamanı Hesapla
        const { count: betterScores } = await supabase
          .from('race_results')
          .select('*', { count: 'exact', head: true })
          .eq('race_id', rid)
          .gt('score', myScore);

        const { count: sameScoreBetterTime } = await supabase
          .from('race_results')
          .select('*', { count: 'exact', head: true })
          .eq('race_id', rid)
          .eq('score', myScore)
          .lt('time_seconds', myTime);

        const { count: totalCount } = await supabase
          .from('race_results')
          .select('*', { count: 'exact', head: true })
          .eq('race_id', rid);

        const rank = (betterScores || 0) + (sameScoreBetterTime || 0) + 1;
        
        setMyRank(rank);
        setTotalParticipants(totalCount || 0);

      } catch (err) {
        console.error("Supabase Veri Çekme Hatası:", err);
      } finally {
        setLoading(false); // Hata olsa da yüklemeyi bitir
      }
    }

    fetchResults();
  }, [raceId, myScore, myTime, myUsername]); 

  if (loading) {
    // page.tsx'in fallback'i bu ekranı gösterir
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-blue-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 pb-32">

        {/* Sonuç Kartı */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 text-center border border-gray-100">
          <div className={`p-8 ${myRank === 1 ? 'bg-yellow-400 text-black' : 'bg-blue-900 text-white'}`}>
            <h1 className="text-4xl font-black mb-2 uppercase tracking-widest">
              {myRank === 1 ? '👑 LEGENDARY!' : 'RACE COMPLETED'}
            </h1>
            
            <div className="flex justify-center items-center gap-8 md:gap-12 mt-6 mb-6">
              <div>
                <div className="text-5xl font-black">{myScore}<span className="text-2xl opacity-60">/50</span></div>
                <div className="text-xs uppercase opacity-80 font-bold">Correct Answers</div>
              </div>
              <div className={`w-px h-16 ${myRank === 1 ? 'bg-black/20' : 'bg-white/20'}`}></div>
              <div>
                <div className={`text-5xl font-black ${myRank === 1 ? 'text-white' : 'text-yellow-400'}`}>
                  {myRank ? `#${myRank}` : '-'}
                </div>
                <div className="text-xs uppercase opacity-80 font-bold">Global Rank</div>
              </div>
            </div>

            <div className={`inline-block px-6 py-2 rounded-xl text-lg font-medium ${myRank === 1 ? 'bg-black/10' : 'bg-blue-800/50 border border-blue-700'}`}>
               You ranked <strong>{getOrdinal(myRank || 0)}</strong> out of <strong>{totalParticipants}</strong> participants!
            </div>
          </div>
        </div>

        {/* Liderlik Tablosu */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-50 px-6 py-4 border-b font-bold text-gray-700 flex justify-between items-center">
            <span>🏆 TOP 20 LEADERBOARD</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE
            </span>
          </div>
          
          {topList.length > 0 ? (
            topList.map((user, i) => (
              <div key={i} className={`flex justify-between items-center px-6 py-4 border-b hover:bg-gray-50 ${user.username === myUsername ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                 <div className="flex items-center gap-4">
                   <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm 
                      ${i === 0 ? 'bg-yellow-400 text-black shadow-lg' : 
                        i === 1 ? 'bg-gray-300 text-black' : 
                        i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {i + 1}
                   </div>
                   <div className="font-bold text-gray-800">
                      {user.username} {user.username === myUsername && <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">YOU</span>}
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="font-bold text-blue-600">{user.score} pts</div>
                   <div className="text-xs text-gray-400">{Math.floor(user.time_seconds / 60)}m {user.time_seconds % 60}s</div>
                 </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No participants yet. You are the first! 🚀
            </div>
          )}
        </div>

      </div>

      {/* --- SABİT BUTONLAR (Sticky Footer) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex justify-center gap-4">
        <Link href="/" className="flex-1 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-bold text-center hover:bg-gray-200 transition text-lg">
          🏠 Home
        </Link>
        <Link href={`/race/${raceId}`} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-center hover:bg-blue-700 shadow-lg transition transform active:scale-95 text-lg">
          🔄 Race Again
        </Link>
      </div>

    </div>
  );
}
