import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  "title": "Verb Sense: English Verb Practice",
  "description": "Choose natural English verbs in everyday sentences. Practise useful collocations and check your answers in Verb Sense.",
  "path": "/verbsense"
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
