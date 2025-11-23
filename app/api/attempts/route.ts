import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Veritabanı (Prisma) kaldırıldığı için bu kod devre dışı bırakıldı.
  // Frontend hata almasın diye "Başarılı" cevabı dönüyoruz.
  
  try {
    const body = await request.json();
    console.log("Test sonucu (Mock):", body); // Gelen veriyi konsola yazar
  } catch (error) {
    // Body okuma hatası olursa görmezden gel
  }

  return NextResponse.json({ success: true, message: "Kaydedildi (Mock Modu)" });
}