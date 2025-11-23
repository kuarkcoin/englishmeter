import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Veritabanı (Prisma) kaldırıldığı için bu kod devre dışı bırakıldı.
  // Frontend hata almasın diye "Başarılı" cevabı dönüyoruz.
  
  try {
    const body = await request.json();
    console.log("API İsteği (Mock):", body); 
  } catch (error) {
    // Body okuma hatası olursa görmezden gel
  }

  // Frontend'in beklediği formatta sahte (boş) bir cevap dönüyoruz ki patlamasın.
  return NextResponse.json({ 
    success: true, 
    message: "Mock Modu: Kaydedildi",
    // Eğer frontend soru bekliyorsa boş liste dönüyoruz:
    questions: [], 
    attemptId: "mock-id-123" 
  });
}