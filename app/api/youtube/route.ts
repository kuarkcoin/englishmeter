import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) {
      return NextResponse.json({ error: "Geçersiz link." }, { status: 400 });
    }

    try {
      // YouTube'u kandırmak için sahte tarayıcı bilgileri (Headers)
      // Not: youtube-transcript kütüphanesi fetch seçeneklerini destekler
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        params: {
          lang: 'en', // Önce İngilizceyi zorla
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        }
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
      
      return NextResponse.json({ 
        error: "Vercel Sunucu Engeli: YouTube bu sunucunun (Vercel) altyazı çekmesini engelledi. Lütfen yerel bilgisayarınızda test edin veya bir Proxy kullanmayı düşünün." 
      }, { status: 403 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}

function extractYouTubeId(url: string) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}
