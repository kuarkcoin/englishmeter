import { Suspense } from "react";
import ResultClient from "./ResultClient";
import { notFound } from 'next/navigation';

// Bu ayar, sayfanın statik olarak oluşturulmasını engeller ve canlı veri çeker (Çok Önemli)
export const dynamic = "force-dynamic";

// Bu dosya Server Component'tur
export default async function ResultPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { score?: string; user?: string; time?: string };
}) {
  
  // URL'den gelen verileri al ve kontrol et
  const raceId = params.id;
  const myScore = parseInt(searchParams.score || '0');
  const myUsername = searchParams.user || 'Guest';
  const myTime = parseInt(searchParams.time || '0');

  // Geçersiz veri kontrolü
  if (!raceId || isNaN(myScore) || isNaN(myTime)) {
    // 404 sayfasına yönlendir (veya hata mesajı göster)
    // notFound(); 
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-xl text-red-600">
        Invalid race parameters. Please try again.
      </div>
    );
  }

  // ResultClient bileşenine verileri prop olarak gönder
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
