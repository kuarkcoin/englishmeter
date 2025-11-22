// app/race/[id]/result/page.tsx  ← TEK DOSYA, EN SAĞLAM ÇÖZÜM

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function ResultPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams = useSearchParams();
  const raceId = params.id;

  const myScore = parseInt(searchParams.get('score') || '0');
  const myUsername = searchParams.get('user') || 'Guest';
  const myTime = parseInt(searchParams.get('time') || '0');

  const [topList, setTopList] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const rid = parseInt(raceId);

      const { data: topData } = await supabase
        .from('race_results')
        .select('*')
        .eq('race_id', rid)
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(20);

      if (topData) setTopList(topData);

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
      setLoading(false);
    }

    fetchResults();
  }, [raceId, myScore, myTime]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-blue-600 animate-pulse">
        Calculating Global Rank...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Sonuç kartı vs. tüm JSX aynı kalacak */}

        {/* BUTONLAR KESİNLİKLE GÖZÜKECEK */}
        <div className="mt-12 flex justify-center gap-6 pb-20">
          <Link href="/" className="px-10 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-2xl font-bold text-lg transition shadow-md">
            Home
          </Link>
          <Link href={`/race/${raceId}`} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1">
            Race Again
          </Link>
        </div>

      </div>
    </div>
  );
}
