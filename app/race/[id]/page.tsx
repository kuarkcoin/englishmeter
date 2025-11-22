// app/race/[id]/result/page.tsx  ← TEK DOSYA, KESİN ÇALIŞIR

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function ResultPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const raceId = params.id;

  const myScore = Number(searchParams.get('score') || 0);
  const myUsername = searchParams.get('user') || 'Guest';
  const myTime = Number(searchParams.get('time') || 999999);

  const [topList, setTopList] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const rid = parseInt(raceId);

        const { data: topData } = await supabase
          .from('race_results')
          .select('*')
          .eq('race_id', rid)
          .order('score', { ascending: false })
          .order('time_seconds', { ascending: true })
          .limit(20);

        if (topData) setTopList(topData);

        const { count: better } = await supabase
          .from('race_results')
          .select('*', { count: 'exact', head: true })
          .eq('race_id', rid)
          .gt('score', myScore);

        const { count: sameFaster } = await supabase
          .from('race_results')
          .select('*', { count: 'exact', head: true })
          .eq('race_id', rid)
          .eq('score', myScore)
          .lt('time_seconds', myTime);

        const { count: total } = await supabase
          .from('race_results')
          .select('*', { count: 'exact', head: true })
          .eq('race_id', rid);

        const rank = (better || 0) + (sameFaster || 0) + 1;
        setMyRank(rank);
        setTotalParticipants(total || 0);
      } catch (err) {
        console.error('Supabase error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [raceId, myScore, myTime]);

  // Parametreler eksikse bile butonları göster
  if (!searchParams.get('score')) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-8 text-center px-4">
        <p className="text-2xl font-bold text-red-600">Sonuç bilgisi eksik!</p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/" className="px-12 py-5 bg-white border-4 border-gray-300 rounded-2xl font-black text-xl shadow-lg">
            HOME
          </Link>
          <Link href={`/race/${raceId}`} className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-2xl">
            RACE AGAIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {loading ? (
          <div className="min-h-screen flex items-center justify-center text-3xl font-black text-blue-600 animate-pulse">
            Calculating Rank...
          </div>
        ) : (
          <>
            {/* Sonuç kartı ve leaderboard aynı kalacak */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center mb-8">
              <h1 className="text-5xl font-black mb-4">
                {myRank === 1 ? 'LEGENDARY!' : 'RACE COMPLETED'}
              </h1>
              <div className="text-6xl font-black text-blue-600">{myScore}/50</div>
              <div className="text-4xl font-bold text-yellow-400 mt-4">#{myRank}</div>
              <p className="mt-4 text-lg">
                You ranked <strong>{getOrdinal(myRank || 0)}</strong> out of <strong>{totalParticipants}</strong>
              </p>
            </div>

            {/* BUTONLAR – HER ZAMAN GÖRÜNÜR */}
            <div className="flex flex-col sm:flex-row justify-center gap-8 mt-16 pb-20">
              <Link href="/" className="px-16 py-6 bg-white border-4 border-gray-300 hover:border-gray-500 rounded-3xl font-black text-2xl shadow-xl transition transform hover:-translate-y-2">
                HOME
              </Link>
              <Link 
                href={`/race/${raceId}`} 
                className="px-16 py-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl font-black text-2xl shadow-2xl transition transform hover:scale-110"
              >
                RACE AGAIN
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
