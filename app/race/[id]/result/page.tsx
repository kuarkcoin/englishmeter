import { Suspense } from "react";
import ResultClient from "./ResultClient"; // DİKKAT: Aynı klasördeki ResultClient'ı çağırır

export const dynamic = "force-dynamic";

export default function ResultPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { score?: string; user?: string; time?: string };
}) {
  const raceId = params.id;
  const myScore = parseInt(searchParams.score || '0');
  const myUsername = searchParams.user || 'Guest';
  const myTime = parseInt(searchParams.time || '0');

  // URL'den gelen verileri Server'da okuduk, şimdi Client'a yolluyoruz.
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center font-bold text-xl text-blue-600 animate-pulse">
          Calculating Global Rank...
        </div>
      }
    >
      <ResultClient
        raceId={raceId}
        myScore={myScore}
        myUsername={myUsername}
        myTime={myTime}
      />
    </Suspense>
  );
}
