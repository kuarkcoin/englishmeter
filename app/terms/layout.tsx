import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Terms of Service",
  "description": "Read the terms for using EnglishMeter English tests, vocabulary exercises and learning tools.",
  "path": "/terms"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
