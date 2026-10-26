import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Admin Inbox",
  "description": "Personal learning session and account tools on EnglishMeter.",
  "path": "/admin",
  "noindex": true
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
