import { ExamPracticeCategoryPage, getExamCategoryMetadata } from '@/components/ExamPracticePages';

export function generateMetadata() {
  return getExamCategoryMetadata('business-english');
}

export default function BusinessEnglishTestsPage() {
  return <ExamPracticeCategoryPage categoryId="business-english" />;
}
