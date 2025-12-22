import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) return NextResponse.json({ error: "Geçersiz link." }, { status: 400 });

    // RAPIDAPI ÜZERİNDEN ALTYAZI ÇEKME
    // 'subtitles-for-youtube' veya 'youtube-transcript' araması yaparak bir API seçebilirsiniz
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'SENIN_RAPIDAPI_ANAHTARIN', // Buraya anahtarınızı yazacaksınız
        'X-RapidAPI-Host': 'youtube-transcript3.p.rapidapi.com'
      }
    };

    const response = await fetch(`https://youtube-transcript3.p.rapidapi.com/api/transcript-with-timestamps?video_id=${videoId}`, options);
    const result = await response.json();

    if (!response.ok) throw new Error("API hatası veya altyazı yok.");

    // Gelen veriyi birleştir
    const fullText = result.transcript.map((item: any) => item.text).join(' ');

    return NextResponse.json({
      text: fullText,
      title: "YouTube Video", // Veya oembed ile çekilebilir
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    });

  } catch (error: any) {
    return NextResponse.json({ error: "YouTube engeline takıldık. Lütfen RapidAPI anahtarını kontrol edin veya daha sonra deneyin." }, { status: 403 });
  }
}

function extractYouTubeId(url: string) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}
