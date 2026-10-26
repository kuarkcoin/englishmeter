import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "English–Arabic Vocabulary Practice",
  "description": "Review everyday English words with Arabic meanings in short vocabulary quizzes with answer feedback.",
  "path": "/vocab-finish-ar"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
