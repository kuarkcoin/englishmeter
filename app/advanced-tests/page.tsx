import Link from 'next/link';
import AdvancedTestsClient from '@/components/AdvancedTestsClient';
import StudyHubStructuredData from '@/components/StudyHubStructuredData';
import { ADVANCED_TEST_CATALOG, ADVANCED_QUESTION_RANGE } from '@/lib/advanced-tests';

export default function AdvancedTestsPage() {
  return <AdvancedTestsClient tests={ADVANCED_TEST_CATALOG} questionRange={ADVANCED_QUESTION_RANGE}>
    <div className="[&_nav]:text-slate-200 [&_a]:text-indigo-200"><StudyHubStructuredData name="Advanced English tests" path="/advanced-tests" description="Ten mixed grammar and vocabulary practice tests for B2–C1 learners." items={ADVANCED_TEST_CATALOG.map((test) => ({ name: `Advanced English test ${test.id}`, path: `/?restart=adv-test-${test.id}` }))} /></div>
    <section aria-label="Advanced practice study plan" className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-5">
      <p className="leading-relaxed text-slate-100">Use these longer mixed sets to review grammar and vocabulary together. After checking your answers, choose a focused topic for your weakest area. Best and latest results are saved on this browser; they are practice feedback, not a CEFR certificate.</p>
      <nav aria-label="Focused advanced practice" className="mt-4 flex flex-wrap gap-4 font-bold text-indigo-200">
        <Link href="/levels/b2" className="underline underline-offset-4">B2 grammar topics</Link>
        <Link href="/levels/c1" className="underline underline-offset-4">C1 grammar topics</Link>
        <Link href="/levels/c2" className="underline underline-offset-4">C2 proficiency practice</Link>
        <Link href="/practice/word-formation" className="underline underline-offset-4">Word formation</Link>
      </nav>
    </section>
  </AdvancedTestsClient>;
}
