import { ExamPracticeTestPage, getExamTestMetadata, getExamTestStaticParams } from '@/components/ExamPracticePages';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getExamTestStaticParams('business-english');
}

export function generateMetadata({ params }: PageProps) {
  return getExamTestMetadata('business-english', params.slug);
}

export default function BusinessEnglishTestPage({ params }: PageProps) {
  return <ExamPracticeTestPage categoryId="business-english" slug={params.slug} />;
}
