import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "English Vocabulary Practice Test",
  "description": "Review English vocabulary through multiple-choice practice questions and check your answers as you study.",
  "path": "/vocab-finish"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
