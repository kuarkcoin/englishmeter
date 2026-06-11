import type { Metadata } from "next";

export const metadata: Metadata = {
  // Temel URL (Canonical yapısı için gerekli)
  metadataBase: new URL('https://englishmeter.net'),

  // Tarayıcı sekme başlığı
  title: "YDS & IELTS Yapay Zeka Destekli Kelime Kartları | EnglishMeter",
  
  // Google arama sonuçlarındaki açıklama
  description: "3850 akademik kelimeyi Gemini AI destekli örnek cümleler ve sesli telaffuzla öğrenin. YDS, YÖKDİL ve IELTS hazırlığı için en gelişmiş interaktif flaş kartlar.",
  
  // Anahtar kelimeler
  keywords: [
    "YDS kelime kartları", 
    "IELTS vocabulary flashcards", 
    "İngilizce kelime ezberleme", 
    "AI English learning", 
    "YÖKDİL kelime listesi",
    "akademik ingilizce kelimeler"
  ],

  // Google botlarına talimatlar
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Kopya içerik koruması
  alternates: {
    canonical: '/flashcards',
  },

  // Sosyal Medya Paylaşım Görünümü (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: "AI Destekli İngilizce Kelime Ezberleme 🧠",
    description: "Gemini AI ile her kelimeye özel örnek cümleler ve Türkçe çeviriler. EnglishMeter ile kelime hazineni uçur!",
    url: 'https://englishmeter.net/flashcards',
    siteName: 'EnglishMeter',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/flashcards/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'EnglishMeter AI Flashcards',
      },
    ],
  },

  // Twitter / X Kart Görünümü
  twitter: {
    card: 'summary_large_image',
    title: 'İngilizce Kelime Ezberlemede Yapay Zeka Devrimi',
    description: 'Kelimeyi gör, AI cümleyi kursun, sesli dinle ve kalıcı öğren!',
    images: ['/flashcards/opengraph-image'],
  },
};

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Göz yormayan, odaklanmayı artıran çalışma ortamı rengi (Emerald/Slate)
  return (
    <section className="min-h-screen bg-emerald-50 text-slate-800 selection:bg-emerald-200">
      {/* Buraya Header veya Navigasyon eklemek istersen ekleyebilirsin.
         Şu an sadece içeriği render ediyor.
      */}
      {children}
    </section>
  );
}
