// @ts-ignore
import { getSubtitles } from 'youtube-captions-scraper';
import { NextResponse } from 'next/server';

function extractYouTubeId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) {
      return NextResponse.json({ error: "Geçersiz YouTube linki." }, { status: 400 });
    }

    let captions;
    try {
      // DENEME 1: Önce İngilizceyi dene
      captions = await getSubtitles({ videoID: videoId, lang: 'en' });
    } catch (e) {
      try {
        // DENEME 2: İngilizce yoksa Türkçeyi dene (EnglishMeter kullanıcıları için önemli)
        captions = await getSubtitles({ videoID: videoId, lang: 'tr' });
      } catch (e2) {
        // DENEME 3: Hiçbiri olmazsa hata fırlat
        throw new Error("Altyazı bulunamadı.");
      }
    }

    const fullText = captions.map((c: any) => c.text).join(' ').replace(/\s+/g, ' ').trim();

    const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const info = await oembedResponse.ok ? await oembedResponse.json() : null;

    return NextResponse.json({
      text: fullText,
      title: info?.title || "YouTube Video",
      thumbnail: info?.thumbnail_url || "",
      author: info?.author_name || ""
    });

  } catch (error: any) {
    console.error("Scraper Error:", error);
    return NextResponse.json({ 
      error: "Bu videonun altyazısı teknik nedenlerle çekilemedi. Lütfen videoda CC (Altyazı) seçeneğinin açık olduğundan emin olun." 
    }, { status: 404 });
  }
}
