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
    
    // ANAHTAR KONTROLÜ
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    if (!videoId) return NextResponse.json({ error: "Geçersiz YouTube linki." }, { status: 400 });
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "Yapılandırma Hatası: .env dosyasında veya Vercel'de anahtar tanımlanmamış." 
      }, { status: 500 });
    }

    // Senin paylaştığın curl formatına tam uyumlu URL
    const url = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}&lang=en`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'youtube-transcriptor.p.rapidapi.com',
        'x-rapidapi-key': apiKey
      },
      cache: 'no-store'
    });

    const result = await response.json();

    // API'den gelen veriyi işleme
    let fullText = "";
    if (Array.isArray(result)) {
      fullText = result.map((t: any) => t.text).join(' ');
    } else if (result.transcription) {
      fullText = result.transcription;
    } else if (result.message) {
      // API bir hata mesajı döndüyse (Örn: 'Video not found' veya 'Subtitles disabled')
      return NextResponse.json({ error: `API Mesajı: ${result.message}` }, { status: 404 });
    } else {
      // Beklenmedik bir veri gelirse
      return NextResponse.json({ error: "Altyazı formatı desteklenmiyor." }, { status: 404 });
    }

    // Video Bilgileri (OEmbed)
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const info = await oembedRes.json().catch(() => null);

    return NextResponse.json({
      text: fullText.replace(/\s+/g, ' ').trim(),
      title: info?.title || "YouTube Video",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Sunucu hatası: " + error.message }, { status: 500 });
  }
}
