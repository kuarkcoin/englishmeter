import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Verb Sense Session",
  "description": "Personal learning session and account tools on EnglishMeter.",
  "path": "/verbsense/play",
  "noindex": true
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
