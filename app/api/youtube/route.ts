import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    
    // Video ID ayıklama
    const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
    
    if (!videoId) throw new Error("Invalid Video ID");

    // 1. Transkripti çek
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const fullText = transcript.map(t => t.text).join(' ');

    // 2. Video bilgilerini çek (Thumbnail ve Başlık için)
    const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const info = await oembedResponse.json();

    return NextResponse.json({ 
      text: fullText,
      title: info.title,
      thumbnail: info.thumbnail_url,
      author: info.author_name
    });

  } catch (error: any) {
    console.error("YouTube Error:", error);
    return NextResponse.json({ error: "Could not fetch transcript. Check if captions are enabled." }, { status: 500 });
  }
}
