// app/race/[id]/page.tsx
import RaceQuiz from '@/components/RaceQuiz';
import questionsData from '@/data/race-questions.json';

export const dynamic = 'force-dynamic';

export default function RacePage({ params }: { params: { id: string } }) {
  // JSON yapısını RaceQuiz component'inin beklediği formata dönüştür
  const transformedQuestions = questionsData.map(q => ({
    id: q.id,
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    answer: q.correct_option
  }));

  const shuffled = [...transformedQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const examQuestions = shuffled.slice(0, 50);

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
