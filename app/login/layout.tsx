import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Sign In",
  "description": "Personal learning session and account tools on EnglishMeter.",
  "path": "/login",
  "noindex": true
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
