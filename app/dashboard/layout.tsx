import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Your Learning Dashboard",
  "description": "Personal learning session and account tools on EnglishMeter.",
  "path": "/dashboard",
  "noindex": true
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
