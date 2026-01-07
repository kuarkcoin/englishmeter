// app/tests/[slug]/page.tsx
import { getTestDataBySlug } from '@/lib/quizManager';
import QuizClientWrapper from '@/components/QuizClientWrapper';

export default function TestPage({ params }: { params: { slug: string } }) {
  const testData = getTestDataBySlug(params.slug);

  if (!testData.questions.length) return <div>Test bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Google Botları Burayı Görür */}
      <div className="sr-only">
        <h1>{testData.title}</h1>
        <p>İngilizce seviyenizi ölçmek için {testData.questions.length} soruluk {testData.title} testini çözün.</p>
      </div>

      {/* Kullanıcı Burayı Görür */}
      <QuizClientWrapper initialData={testData} slug={params.slug} />
    </div>
  );
}
