import PracticeBreadcrumbs from '@/components/PracticeBreadcrumbs';
import { serializeJsonLd, SITE_URL } from '@/lib/seo';
import type { StudyLink } from '@/lib/public-test-content';

export default function StudyHubStructuredData({ name, path, description, items }: { name: string; path: string; description: string; items: readonly StudyLink[] }) {
  const breadcrumbs = [{ name: 'Home', path: '/' }, { name, path }];
  const url = `${SITE_URL}${path}`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name, description, inLanguage: 'en', isAccessibleForFree: true, mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${SITE_URL}${item.path}` })) } },
    { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_URL}${item.path}` })) },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} /><PracticeBreadcrumbs items={breadcrumbs} /></>;
}
