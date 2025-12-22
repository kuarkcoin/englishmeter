import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) {
      return NextResponse.json({ error: "Geçersiz YouTube linki." }, { status: 400 });
    }

    console.log("İşlem başlatıldı. Video ID:", videoId);

    try {
      // 1. Altyazıyı Çek (Dili belirtmeden en uygununu çekmeye çalışır)
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error("Altyazı verisi boş döndü.");
      }

      const fullText = transcriptData
        .map(t => t.text)
        .join(' ')
        .replace(/&amp;#39;/g, "'") // Karakter düzeltme
        .replace(/&quot;/g, '"');

      // 2. Video Bilgilerini Çek
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const info = oembedRes.ok ? await oembedRes.json() : null;

      return NextResponse.json({
        text: fullText,
        title: info?.title || "YouTube Video",
        thumbnail: info?.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        author: info?.author_name || ""
      });

    } catch (err: any) {
      console.error("Kütüphane Hatası:", err.message);
      
      // Hata mesajına göre kullanıcıya bilgi veriyoruz
      let userFriendlyError = "Altyazı bulunamadı. Lütfen videoda altyazıların (CC) açık olduğundan emin olun.";
      
      if (err.message.includes('too many requests')) {
        userFriendlyError = "YouTube çok fazla istek gönderdiğimizi fark etti. Lütfen birkaç dakika sonra tekrar deneyin.";
      }

      return NextResponse.json({ error: userFriendlyError }, { status: 404 });
    }

  } catch (error: any) {
    console.error("Genel Sistem Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

function extractYouTubeId(url: string) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}
