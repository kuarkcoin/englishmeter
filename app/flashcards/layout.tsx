import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from "next";

export const metadata: Metadata = buildSeoMetadata({
  "title": "English Vocabulary Flashcards",
  "description": "Study English vocabulary with meanings, pronunciation and example sentences. Review academic words for YDS, YÖKDİL and IELTS practice.",
  "path": "/flashcards",
  "image": "/flashcards/opengraph-image"
});

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Göz yormayan, odaklanmayı artıran çalışma ortamı rengi (Emerald/Slate)
  return (
    <section className="min-h-screen bg-emerald-50 text-slate-800 selection:bg-emerald-200">
      <header className="mx-auto max-w-2xl px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">English Vocabulary Flashcards</h1>
        <p className="mt-3 text-slate-600">
          Review English words and their Turkish meanings. Tap a card to reveal its
          meaning, listen to pronunciation and continue through your saved deck.
        </p>
        <a href="/vocabulary" className="mt-3 inline-block font-semibold text-emerald-700 underline">
          Browse the vocabulary dictionary
        </a>
      </header>
      {/* Buraya Header veya Navigasyon eklemek istersen ekleyebilirsin.
         Şu an sadece içeriği render ediyor.
      */}
      {children}
    </section>
  );
}
