import { ExamPracticeTestPage, getExamTestMetadata, getExamTestStaticParams } from '@/components/ExamPracticePages';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getExamTestStaticParams('cambridge-use-of-english');
}

export function generateMetadata({ params }: PageProps) {
  return getExamTestMetadata('cambridge-use-of-english', params.slug);
}

export default function CambridgeEnglishTestPage({ params }: PageProps) {
  return <ExamPracticeTestPage categoryId="cambridge-use-of-english" slug={params.slug} />;
}
