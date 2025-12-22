import { NextResponse } from "next/server";

export const runtime = "nodejs";          // Edge değil Node’da çalışsın
export const dynamic = "force-dynamic";   // cache yapmasın

type Track = { lang: string; name?: string; id?: string };

function getVideoId(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.replace("www.", "");

    // youtu.be/VIDEOID
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id?.length === 11 ? id : null;
    }

    // youtube.com/watch?v=VIDEOID
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      return id?.length === 11 ? id : null;
    }

    // youtube.com/shorts/VIDEOID
    if (u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/")[2];
      return id?.length === 11 ? id : null;
    }

    // youtube.com/embed/VIDEOID
    if (u.pathname.startsWith("/embed/")) {
      const id = u.pathname.split("/")[2];
      return id?.length === 11 ? id : null;
    }

    return null;
  } catch {
    return null;
  }
}

function decodeHtml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseTracks(listXml: string): Track[] {
  const tracks: Track[] = [];
  const re = /<track\b([^/>]*)\/>/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(listXml))) {
    const attrs = m[1];
    const getAttr = (k: string) => {
      const mm = new RegExp(`${k}="([^"]*)"`, "i").exec(attrs);
      return mm ? mm[1] : undefined;
    };

    const lang = getAttr("lang_code") || getAttr("lang") || "";
    const name = getAttr("name");
    const id = getAttr("id");

    if (lang) tracks.push({ lang, name, id });
  }

  return tracks;
}

function pickBestTrack(tracks: Track[], preferred: string[] = ["en", "tr"]): Track | null {
  if (!tracks.length) return null;

  // 1) tercih dillerinde “manual” (name != Automatic) olanı seç
  for (const lang of preferred) {
    const manual = tracks.find(t => t.lang === lang && (t.name || "").toLowerCase() !== "automatic");
    if (manual) return manual;
  }

  // 2) tercih dillerinde Automatic olanı seç
  for (const lang of preferred) {
    const auto = tracks.find(t => t.lang === lang);
    if (auto) return auto;
  }

  // 3) ilk track
  return tracks[0];
}

function parseTranscriptXml(transcriptXml: string): string {
  // <text ...>...</text> içeriklerini çek
  const re = /<text\b[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  const parts: string[] = [];

  while ((m = re.exec(transcriptXml))) {
    const raw = m[1] ?? "";
    const cleaned = decodeHtml(raw)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (cleaned) parts.push(cleaned);
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    const videoId = getVideoId(videoUrl || "");

    if (!videoId) {
      return NextResponse.json({ error: "Geçersiz YouTube linki (watch/shorts/embed/youtu.be desteklenir)." }, { status: 400 });
    }

    // 1) Track listesini çek
    const listUrl = `https://video.google.com/timedtext?type=list&v=${videoId}`;
    const listRes = await fetch(listUrl, { cache: "no-store" });
    const listXml = await listRes.text();

    const tracks = parseTracks(listXml);
    const chosen = pickBestTrack(tracks, ["en", "tr"]);

    if (!chosen) {
      return NextResponse.json(
        { error: "Bu videoda altyazı (CC) veya otomatik altyazı bulunamadı." },
        { status: 404 }
      );
    }

    // 2) Seçilen track’i çek
    const params = new URLSearchParams();
    params.set("type", "track");
    params.set("v", videoId);
    params.set("lang", chosen.lang);
    if (chosen.id) params.set("id", chosen.id);
    if (chosen.name) params.set("name", chosen.name);

    const trackUrl = `https://video.google.com/timedtext?${params.toString()}`;
    const trackRes = await fetch(trackUrl, { cache: "no-store" });
    const trackXml = await trackRes.text();

    const fullText = parseTranscriptXml(trackXml);
    if (!fullText) {
      return NextResponse.json(
        { error: "Altyazı track’i var ama metin boş döndü (YouTube kısıtı / video özel ayar olabilir)." },
        { status: 404 }
      );
    }

    // 3) Başlık/thumbnail için oEmbed
    const oembedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { cache: "no-store" }
    );
    const info = oembedResponse.ok ? await oembedResponse.json() : null;

    return NextResponse.json({
      text: fullText,
      title: info?.title || "YouTube Video",
      thumbnail: info?.thumbnail_url || "",
      author: info?.author_name || "",
      langPicked: chosen.lang,
      trackName: chosen.name || ""
    });

  } catch (err: any) {
    console.error("YouTube Transcript Error:", err);
    return NextResponse.json(
      { error: "Teknik hata: Transcript çekilemedi. Video CC kapalı olabilir veya YouTube isteği engelliyor olabilir." },
      { status: 500 }
    );
  }
}