import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Veritabanı (Prisma) kaldırıldığı için bu kod devre dışı bırakıldı.
  // Frontend hata almasın diye "Başarılı" cevabı dönüyoruz.
  
  try {
    const body = await request.json();
    console.log("İletişim Formu (Mock):", body); 
  } catch (error) {
    // Hata olursa yutuyoruz
  }

  return NextResponse.json({ success: true, message: "Mesajınız alındı (Mock Modu)" });
}