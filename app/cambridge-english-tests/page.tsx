import { ExamPracticeCategoryPage, getExamCategoryMetadata } from '@/components/ExamPracticePages';

export function generateMetadata() {
  return getExamCategoryMetadata('cambridge-use-of-english');
}

export default function CambridgeEnglishTestsPage() {
  return <ExamPracticeCategoryPage categoryId="cambridge-use-of-english" />;
}
