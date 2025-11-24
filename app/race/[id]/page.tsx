"use client";

import { useParams } from "next/navigation";
import RaceQuiz from "@/components/RaceQuiz";
import questionsData from "@/data/race_questions.json";

export default function RacePage() {
  const params = useParams();
  const rawId = (params?.id as string) || "1";
  const raceId = Number(rawId) || 1;

  const allQuestions = questionsData.filter(
    (q) => Number(q.race_id) === raceId
  );

  const totalTime = 50 * 60;

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <RaceQuiz
          questions={allQuestions}
          raceId={rawId}
          totalTime={totalTime}
        />
      </div>
    </main>
  );
}
