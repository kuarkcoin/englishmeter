// app/tests/[slug]/page.tsx
import { getQuestionsBySlug } from '@/lib/quizManager';
import QuizClientWrapper from '@/components/QuizClientWrapper';
import type { Metadata } from 'next';

type PageProps = { params: { slug: string } };

// ✅ SEO: Her slug için dinamik title/description
export function generateMetadata({ params }: PageProps): Metadata {
  const data = getQuestionsBySlug(params.slug);

  const title = data?.title ? `${data.title} | TestDunya` : 'Test | TestDunya';
  const qCount = data?.questions?.length ?? 0;
  const desc =
    qCount > 0
      ? `${qCount} soruluk ${data.title} testini çözerek seviyeni ölç. Ücretsiz online İngilizce testi.`
      : 'Ücretsiz online İngilizce testleri.';

  return {
    title,
    description: desc,
    alternates: { canonical: `/tests/${params.slug}` },
  };
}

export default function TestPage({ params }: PageProps) {
  const testData = getQuestionsBySlug(params.slug);

  if (!testData || !testData.questions || testData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl bg-white shadow p-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Test bulunamadı</h1>
          <p className="mt-2 text-slate-600">
            Bu slug ile eşleşen bir test yok: <span className="font-mono">{params.slug}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ✅ Google Botları JS çalıştırmasa bile başlık + açıklama görsün */}
      <div className="sr-only">
        <h1>{testData.title}</h1>
        <p>
          İngilizce seviyenizi ölçmek için {testData.questions.length} soruluk {testData.title} testini çözün.
          Test süresi {testData.duration} dakikadır.
        </p>

        {/* ✅ İstersen burada ilk 10 soruyu da metin olarak render edebiliriz (SEO daha da güçlenir) */}
      </div>

      {/* ✅ Kullanıcı etkileşimli quiz UI */}
      <QuizClientWrapper initialData={testData} slug={params.slug} />
    </div>
  );
}