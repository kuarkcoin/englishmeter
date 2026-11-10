import { ExamPracticeTestPage, getExamTestMetadata, getExamTestStaticParams } from '@/components/ExamPracticePages';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getExamTestStaticParams('toeic-reading');
}

export function generateMetadata({ params }: PageProps) {
  return getExamTestMetadata('toeic-reading', params.slug);
}

export default function ToeicReadingTestPage({ params }: PageProps) {
  return <ExamPracticeTestPage categoryId="toeic-reading" slug={params.slug} />;
}
