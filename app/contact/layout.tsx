import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Contact EnglishMeter",
  "description": "Send questions, feedback or suggestions to EnglishMeter about English tests, vocabulary practice and learning tools.",
  "path": "/contact"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
