'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Supabase Client (Hata önleyici boşluk kontrolü ile)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function ResultPage({ params }: { params: { id: string } }) {
  // Params ve SearchParams güvenli erişim
  const raceId = params?.id || '1';
  const searchParams = useSearchParams();
  
  const myScore = parseInt(searchParams.get('score') || '0');
  const myUsername = searchParams.get('user') || 'Guest';
  const myTime = parseInt(searchParams.get('time') || '0');

  const [topList, setTopList] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!raceId) return;

      // 1. TOP 20 Listesini Çek
      const { data: topData } = await supabase
        .from('race_results')
        .select('*')
        .eq('race_id', parseInt(raceId))
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(20);

      if (topData) setTopList(topData);

      // 2. Sıralamanı Hesapla
      const { count: betterScores } = await supabase
        .from('race_results')
        .select('*', { count: 'exact', head: true })
        .eq('race_id', parseInt(raceId))
        .gt('score', myScore);

      const { count: sameScoreBetterTime } = await supabase
        .from('race_results')
        .select('*', { count: 'exact', head: true })
        .eq('race_id', parseInt(raceId))
        .eq('score', myScore)
        .lt('time_seconds', myTime);
      
      const { count: totalCount } = await supabase
        .from('race_results')
        .select('*', { count: 'exact', head: true })
        .eq('race_id', parseInt(raceId));

      const rank = (betterScores || 0) + (sameScoreBetterTime || 0) + 1;
      
      setMyRank(rank);
      setTotalParticipants(totalCount || 0);
      setLoading(false);
    }

    fetchResults();
  }, [raceId, myScore, myTime]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-blue-600 animate-pulse">Calculating Global Rank...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
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
                <div className={`text-5xl font-black ${myRank === 1 ? 'text-white' : 'text-yellow-400'}`}>#{myRank}</div>
                <div className="text-xs uppercase opacity-80 font-bold">Global Rank</div>
              </div>
            </div>

            <div className={`inline-block px-6 py-2 rounded-xl text-lg font-medium ${myRank === 1 ? 'bg-black/10' : 'bg-blue-800/50 border border-blue-700'}`}>
               You ranked <strong>{getOrdinal(myRank || 0)}</strong> out of <strong>{totalParticipants}</strong> participants!
            </div>
          </div>
        </div>

        {/* Liderlik Tablosu */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b font-bold text-gray-700 flex justify-between items-center">
            <span>🏆 TOP 20 LEADERBOARD</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE
            </span>
          </div>
          
          {topList.map((user, i) => (
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
          ))}
        </div>

        {/* Butonlar */}
        <div className="mt-8 flex justify-center gap-4 pb-10">
          <Link href="/" className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold transition">
            Home
          </Link>
          <Link href={`/race/${raceId}`} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition hover:-translate-y-1">
            Race Again 🔄
          </Link>
        </div>

      </div>
    </div>
  );
}

// Force Vercel Rebuild - Cache Temizleme 1
