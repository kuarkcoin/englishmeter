import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from "next";

export const metadata: Metadata = buildSeoMetadata({
  "title": "English Vocabulary Speedrun",
  "description": "Test your English vocabulary against the clock. Choose word meanings and review your score in the speedrun challenge.",
  "path": "/speedrun"
});

export default function SpeedRunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Oyunun atmosferine uygun koyu/enerjik bir arka plan
  return (
    <div className="min-h-screen bg-indigo-950 text-white selection:bg-yellow-500 selection:text-black">
      {children}
    </div>
  );
}
