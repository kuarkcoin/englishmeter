import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from "next";

export const metadata: Metadata = buildSeoMetadata({
  "title": "English Quiz Race",
  "description": "Practise English grammar and vocabulary in a quiz race. Answer questions, track progress and challenge your knowledge.",
  "path": "/race"
});

export default function RaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rekabetçi, koyu gri/mavi tonlar
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {children}
    </div>
  );
}
