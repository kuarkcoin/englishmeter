import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Advanced English Practice Tests",
  "description": "Practise advanced English grammar and vocabulary with focused tests, instant scores and answer review.",
  "path": "/advanced-tests"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
