import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "News Impact Tool",
  "description": "Personal learning session and account tools on EnglishMeter.",
  "path": "/tools/news-impact",
  "noindex": true
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
