import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "YDS Vocabulary Mini Tests",
  "description": "Build your academic English vocabulary with short YDS practice tests, Turkish meanings and answer review.",
  "path": "/yds-3750"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
