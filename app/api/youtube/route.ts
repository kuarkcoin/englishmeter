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
      // DENEME 1: Otomatik Dil Çekimi
      let transcript = await YoutubeTranscript.fetchTranscript(videoId);
      
      const fullText = transcript.map(t => t.text).join(' ');

      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const info = oembedRes.ok ? await oembedRes.json() : null;

      return NextResponse.json({
        text: fullText,
        title: info?.title || "YouTube Video",
        thumbnail: info?.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });

    } catch (err: any) {
      console.error("Detaylı Hata:", err.message);

      // Çözüm Önerisi: Eğer hata "disabled" ise, bu genellikle bot engelidir.
      if (err.message.includes('disabled')) {
        return NextResponse.json({ 
          error: "YouTube bu videonun verilerini botlara kapattı. Bu genellikle Vercel IP'sinin engellenmesinden kaynaklanır. Lütfen farklı bir video deneyin veya bir süre bekleyin." 
        }, { status: 403 });
      }

      return NextResponse.json({ error: `Hata: ${err.message}` }, { status: 404 });
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
