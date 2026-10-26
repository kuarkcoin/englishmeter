import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "English Vocabulary Matching Game",
  "description": "Match English words with their meanings and practise vocabulary recognition with an interactive matching game.",
  "path": "/matching"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
