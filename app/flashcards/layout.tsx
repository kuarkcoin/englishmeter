import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3750 Words Flashcards | YDS & IELTS Vocabulary",
  description: "Master the most common 3750 academic English words with interactive flashcards. Perfect for YDS, YÖKDİL, and IELTS preparation.",
  keywords: ["English Flashcards", "YDS kelime ezberleme", "IELTS vocabulary cards", "Study mode", "Academic words"],
  openGraph: {
    title: "Free English Vocabulary Flashcards 🧠",
    description: "Flip, learn, and memorize 3750 essential words.",
    type: "website",
  },
};

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Odaklanmayı artıran, göz yormayan, çalışma masası hissi (Yeşil/Slate)
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800">
      {children}
    </div>
  );
}
