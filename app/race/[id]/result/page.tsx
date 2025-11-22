import { Suspense } from "react";
import ResultClient from "./ResultClient";

// Bu sayfanın dinamik olarak (her istekte) oluşturulmasını sağlar
export const dynamic = "force-dynamic";

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-bold text-xl text-blue-600 animate-pulse">
          Loading Results...
        </div>
      }
    >
      <ResultClient raceId={params.id} />
    </Suspense>
  );
}
