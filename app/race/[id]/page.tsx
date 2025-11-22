// app/race/[id]/page.tsx
import RaceQuiz from '@/components/RaceQuiz';
import questionsData from '@/data/race-questions.json';

export const dynamic = 'force-dynamic';

export default function RacePage({ params }: { params: { id: string } }) {
  // JSON'daki soruları doğrudan kullan - RaceQuiz zaten doğru formatı bekliyor
  const allQuestions = questionsData;

  // Soruları karıştır ve ilk 50'yi al
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const examQuestions = shuffled.slice(0, 50);

  // Hata kontrolü
  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Questions Not Found</h1>
        <p className="text-gray-600 text-lg mb-2">No questions available for this race.</p>
        <p className="text-sm text-gray-400">
          Please check the questions data file.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-1">
              Global Advanced League
            </div>
            <h1 className="text-4xl font-black text-slate-900">RACE #{params.id}</h1>
          </div>
          <div className="text-right hidden md:block">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-semibold text-gray-600">
              Questions: {examQuestions.length} | Target: Top 20 🏆
            </div>
          </div>
        </div>

        <RaceQuiz
          questions={examQuestions}
          raceId={params.id}
          totalTime={50 * 60}
        />
      </div>
    </div>
  );
}
