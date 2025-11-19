// app/levels/[level]/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link';

// Bu sayfa, URL'den level bilgisini alır (örn: "A1")
export default async function LevelDetailPage({ params }: { params: { level: string } }) {

  // 1. URL'den gelen seviyeyi BÜYÜK harfe çevir (örn: "a1" -> "A1")
  const levelCode = params.level.toUpperCase();

  // 2. Veritabanından SADECE o seviyeye (levelCode) ait testleri bul
  const tests = await prisma.test.findMany({
    where: {
      level: levelCode as any,
      // (Quick testleri hariç tut, zaten buradalar)
      slug: { notIn: ['quick-placement', 'quick'] } 
    },
    orderBy: {
      slug: 'asc', // Testleri "test-1", "test-2" sırasına göre diz
    },
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Choose Your {levelCode} Test</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* 3. Bulunan 5 testi listele */}
        {tests.map((test) => (
          <a
            key={test.slug}
            // 4. ÖNEMLİ: Artık testi 'level' ile değil, 'testSlug' ile başlatıyoruz
            href={`/start?testSlug=${test.slug}`}
            className="px-6 py-4 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            {test.title}
          </a>
        ))}
      </div>

      <Link href="/" className="text-slate-600 hover:text-brand transition">
        ← Back to all levels
      </Link>
    </main>
  );
}