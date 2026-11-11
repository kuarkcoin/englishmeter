import HomeClient from './HomeClient';
import { getHomeTestSummary } from '@/lib/home-test-summary';
import { buildSeoMetadata, serializeJsonLd, SITE_URL } from '@/lib/seo';
import { HOME_FAQ } from '@/lib/home-faq';

export const metadata = buildSeoMetadata({
  title: 'Free English Tests – Level, Grammar & Exam Practice',
  description: 'Check your English level and practise grammar, vocabulary, reading, IELTS, TOEIC and Business English. Free online tests with answers and explanations.',
  path: '/',
});

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
        name: 'EnglishMeter', url: `${SITE_URL}/`, inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
        name: 'EnglishMeter', url: `${SITE_URL}/`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: HOME_FAQ.map(({ question, answer }) => ({
          '@type': 'Question', name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <HomeClient summary={getHomeTestSummary()} />
    </main>
  );
}
