import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Your Learning Session",
  "description": "Personal learning session and account tools on EnglishMeter.",
  "path": "/learn",
  "noindex": true
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
