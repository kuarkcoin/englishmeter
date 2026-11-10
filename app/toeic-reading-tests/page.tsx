import { ExamPracticeCategoryPage, getExamCategoryMetadata } from '@/components/ExamPracticePages';

export function generateMetadata() {
  return getExamCategoryMetadata('toeic-reading');
}

export default function ToeicReadingTestsPage() {
  return <ExamPracticeCategoryPage categoryId="toeic-reading" />;
}
