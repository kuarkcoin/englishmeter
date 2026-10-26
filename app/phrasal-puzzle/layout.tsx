import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from "next";

export const metadata: Metadata = buildSeoMetadata({
  "title": "English Phrasal Verb Puzzle",
  "description": "Match English verbs with their particles and meanings. Practise common phrasal verbs in an interactive puzzle.",
  "path": "/phrasal-puzzle"
});

export default function PhrasalPuzzleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Eğlenceli, canlı renkler (Fuchsia/Mor)
  return (
    <div className="min-h-screen bg-fuchsia-950 text-white">
      {children}
    </div>
  );
}
