import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Your Test Results",
  "description": "Personal learning session and account tools on EnglishMeter.",
  "path": "/result",
  "noindex": true
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
