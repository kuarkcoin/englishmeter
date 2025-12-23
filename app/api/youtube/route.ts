import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID eksik' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    const html = await response.text();
    
    // 1. YouTube'un tüm video datalarını içeren objeyi bulmaya çalışıyoruz
    const regex = /ytInitialPlayerResponse\s*=\s*({.+?});/s;
    const match = html.match(regex);

    if (!match || !match[1]) {
      throw new Error('Video verisi ayrıştırılamadı. YouTube erişimi kısıtlamış olabilir.');
    }

    // 2. JSON parse işlemini hata ihtimaline karşı güvenli yapıyoruz
    let playerResponse;
    try {
      playerResponse = JSON.parse(match[1]);
    } catch (e) {
      throw new Error('JSON verisi bozuk geldi (Unexpected end of input).');
    }

    const tracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!tracks || tracks.length === 0) {
      throw new Error('Bu videoda altyazı bulunmuyor.');
    }

    // Türkçe öncelikli, yoksa İngilizce, yoksa ilkini al
    const track = tracks.find((t: any) => t.languageCode === 'tr') || 
                  tracks.find((t: any) => t.languageCode === 'en') || 
                  tracks[0];

    const transcriptRes = await fetch(track.baseUrl);
    const xml = await transcriptRes.text();

    // XML içindeki metinleri temizleme
    const cleanText = xml
      .match(/text="([^"]*)"/g)
      ?.map(m => m.slice(6, -1)
        .replace(/&amp;#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
      ).join(' ');

    return NextResponse.json({ text: cleanText || 'Metin ayrıştırılamadı.' });

  } catch (error: any) {
    console.error('Sistem Hatası:', error.message);
    // Frontend'in JSON hatası almaması için her zaman JSON dönüyoruz
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
