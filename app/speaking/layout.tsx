import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "English Speaking Practice",
  "description": "Practise spoken English with recording exercises and AI feedback. Review your answers and build confidence speaking English.",
  "path": "/speaking"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
