import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "English–Spanish Vocabulary Practice",
  "description": "Practise English vocabulary with Spanish meanings through multiple-choice questions and instant answer feedback.",
  "path": "/vocab-es"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
