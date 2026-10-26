import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Privacy Policy",
  "description": "Read how EnglishMeter handles personal information, cookies, analytics and advertising when you use the website.",
  "path": "/privacy"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
