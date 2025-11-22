import RaceQuiz from '@/components/RaceQuiz';
import questionsData from '@/data/questions.json';

export const dynamic = 'force-dynamic';

// Gelen JSON verisinin tipi
type RawQuestion = {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
};

export default function RacePage({ params }: { params: { id: string } }) {
  
  // 1. JSON verisini al (Tip güvenli olarak)
  const rawQuestions = questionsData as RawQuestion[];

  if (!rawQuestions || rawQuestions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-red-500 mb-4">No Questions Found</h1>
        <p className="text-gray-600 text-lg mb-2">Could not load questions from JSON file.</p>
      </div>
    );
  }

  // 2. Soruları Karıştır (Shuffle)
  const shuffled = [...rawQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // 3. İlk 50 soruyu al
  const examQuestions = shuffled.slice(0, 50);

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-8 flex justify-between items-end">
            <div>
                <div className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-1">Global Advanced League</div>
                <h1 className="text-4xl font-black text-slate-900">RACE #{params.id}</h1>
            </div>
            <div className="text-right hidden md:block">
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-semibold text-gray-600">
                    Target: Top 20 🏆
                </div>
            </div>
        </div>

        {/* Quiz Motorunu Başlat */}
        <RaceQuiz 
          questions={examQuestions} 
          raceId={params.id} 
          totalTime={50 * 60} // 50 Dakika
        />

      </div>
    </div>
  );
}
