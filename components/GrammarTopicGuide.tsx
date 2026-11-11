import Link from 'next/link';
import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import WorkedQuestionExamples from '@/components/WorkedQuestionExamples';
import { getQuestionsBySlug } from '@/lib/quizManager';
import { getPublicTestGuide } from '@/lib/public-test-content';
import { serializeJsonLd, SITE_URL } from '@/lib/seo';

export default function GrammarTopicGuide({ title, path, testSlug }: { title: string; path: string; testSlug: string }) {
  const test = getQuestionsBySlug(testSlug);
  const guide = getPublicTestGuide(testSlug);
  const breadcrumbs = [{ name: 'Home', path: '/' }, { name: 'Grammar tests', path: '/grammar' }, { name: title, path }];
  const url = `${SITE_URL}${path}`;
  const structuredData = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description: guide.focus, inLanguage: 'en', isAccessibleForFree: true },
    { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}` })) },
  ] };
  return <main className="em-page px-4 py-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
    <div className="mx-auto max-w-3xl">
      <PracticeBreadcrumbs items={breadcrumbs} />
      <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
      <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{guide.focus} Review the worked examples below, then try the {test.questions.length}-question practice test.</p>
      <Link href={`/start?testSlug=${testSlug}`} className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Start the {test.questions.length}-question test →</Link>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{test.duration} minutes in Exam mode · Untimed Practice mode available</p>
      <section aria-labelledby="grammar-guide-approach" className="em-card mt-8 rounded-2xl border border-[rgb(var(--border))] p-5">
        <h2 id="grammar-guide-approach" className="text-2xl font-bold">What to look for</h2>
        <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-200">{guide.approach}</p>
      </section>
      <WorkedQuestionExamples questions={test.questions} count={3} />
      <section aria-labelledby="grammar-guide-review" className="mt-8">
        <h2 id="grammar-guide-review" className="text-2xl font-bold">Use the explanation after each attempt</h2>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Try to explain the rule before opening the answer. After the test, compare your reasoning with the explanation and write a new sentence using the same structure. If you guessed correctly, include that question in your review too.</p>
      </section>
      <nav aria-label="Related grammar practice" className="mt-8 flex flex-wrap gap-3">
        <Link href={`/tests/${testSlug}`} className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 font-bold text-blue-700 dark:text-blue-300">Open the timed quiz</Link>
        {guide.related.filter((item) => item.path !== path).map((item) => <Link key={item.path} href={item.path} className="em-card rounded-xl border border-[rgb(var(--border))] px-4 py-3 font-bold text-blue-700 dark:text-blue-300">{item.name}</Link>)}
      </nav>
    </div>
  </main>;
}
