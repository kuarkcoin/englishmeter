import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';

/**
 * Daha kapsamlı YouTube ID ayıklayıcı (Shorts, Mobil, Desktop uyumlu)
 */
function extractYouTubeId(url: string) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    const videoId = extractYouTubeId(videoUrl);

    // 1. Link Kontrolü
    if (!videoId) {
      return NextResponse.json({ 
        error: "Geçersiz YouTube linki. Lütfen geçerli bir URL girdiğinizden emin olun." 
      }, { status: 400 });
    }

    try {
      // 2. Altyazıları Çek
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error("YouTube altyazı verisini boş gönderdi.");
      }

      const fullText = transcriptData
        .map(t => t.text)
        .join(' ')
        .replace(/&amp;#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();

      // 3. Video Bilgilerini Çek (Başlık ve Görsel)
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const info = oembedRes.ok ? await oembedRes.json() : null;

      return NextResponse.json({
        text: fullText,
        title: info?.title || "YouTube Video",
        thumbnail: info?.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        author: info?.author_name || "Bilinmeyen Kanal"
      });

    } catch (err: any) {
      // İSTEDİĞİN GÜNCEL HATA YAKALAMA KISMI BURASI
      console.error("Hata Detayı (Sunucu):", err);
      
      // Eğer hata mesajı boşsa genel bir mesaj yaz
      const errorMessage = err.message || "Bilinmeyen teknik bir hata oluştu";
      
      return NextResponse.json({ 
        error: `Hata: ${errorMessage}. YouTube erişimi engelledi veya video altyazı çekimine kısıtlı.` 
      }, { status: 404 });
    }

  } catch (error: any) {
    console.error("Genel Sistem Hatası:", error);
    return NextResponse.json({ error: "Sunucu tarafında kritik bir hata oluştu." }, { status: 500 });
  }
}
