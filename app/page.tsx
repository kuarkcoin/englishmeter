import HomeClient from './HomeClient';
import { buildSeoMetadata, serializeJsonLd, SITE_URL } from '@/lib/seo';
import { HOME_FAQ } from '@/lib/home-faq';

export const metadata = buildSeoMetadata({
  title: 'Free English Level Test & YDS Vocabulary Practice',
  description: 'Estimate your English level from A1 to C2. Practice grammar, YDS vocabulary, daily English tests and flashcards with instant results and answer review.',
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
      <HomeClient />
    </main>
  );
}
