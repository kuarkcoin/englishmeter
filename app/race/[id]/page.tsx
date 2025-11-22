// app/race/[id]/page.tsx

import { createClient } from '@supabase/supabase-js';
import RaceQuiz from '@/components/RaceQuiz';

// Her ziyaretçi farklı sorular görsün diye
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase env vars on Vercel.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function RacePage({ params }: { params: { id: string } }) {
  // 1. Veritabanından TÜM soruları çek
  const { data: allQuestions, error } = await supabase
    .from('race_questions')
    .select('*');

  // Hata veya Boş Veri Kontrolü
  if (error || !allQuestions || allQuestions.length === 0) {
    console.error("Supabase Error:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-red-500 mb-4">System Error</h1>
        <p className="text-gray-600 text-lg mb-2">Could not load the questions.</p>
        <p className="text-sm text-gray-400">Please check Supabase 'race_questions' table.</p>
      </div>
    );
  }

  // 2. Soruları Karıştır (Fisher-Yates Shuffle)
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3. İlk 50 soruyu al
  const examQuestions = shuffled.slice(0, 50);

  // BURAYA DİKKAT: return fonksiyonun İÇİNDE olmalı!
  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-1">
              Global Advanced League
            </div>
            <h1 className="text-4xl font-black text-slate-900">RACE #{params.id}</h1>
          </div>
          <div className="text-right hidden md:block">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-semibold text-gray-600">
              Target: Top 20
            </div>
          </div>
        </div>

        {/* Quiz Motorunu Başlat */}
        <RaceQuiz
          questions={examQuestions}
          raceId={params.id}
          totalTime={50 * 60} // 50 dakika
        />
      </div>
    </div>
  );
}
// FONKSİYON BURADA BİTER
