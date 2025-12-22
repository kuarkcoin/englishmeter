import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';

function extractYouTubeId(url: string) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) {
      return NextResponse.json({ error: "Geçersiz link." }, { status: 400 });
    }

    try {
      // TypeScript hatasını düzeltmek için config objesini sadeleştirdik
      // 'params' takısını kaldırdık, doğrudan 'lang' kullanıyoruz
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: 'en' 
      });

      const fullText = transcript.map(t => t.text).join(' ');

      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const info = oembedRes.ok ? await oembedRes.json() : null;

      return NextResponse.json({
        text: fullText,
        title: info?.title || "YouTube Video",
        thumbnail: info?.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });

    } catch (err: any) {
      console.error("Vercel IP Engeli Hatası:", err.message);
      
      // Daha açıklayıcı bir hata mesajı
      let errorMessage = "YouTube bu videonun altyazılarını vermeyi reddetti.";
      if (err.message.includes('Transcript is disabled')) {
        errorMessage = "Bu videoda altyazı bulunamadı veya Vercel sunucu IP'si YouTube tarafından engellendi.";
      }

      return NextResponse.json({ 
        error: `Hata: ${errorMessage}` 
      }, { status: 403 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Sistem hatası oluştu." }, { status: 500 });
  }
}
