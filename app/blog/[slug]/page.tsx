// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogPosts';
import Link from 'next/link';
import { SITE_URL, buildSeoMetadata, serializeJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();
  const metadata = buildSeoMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph, type: 'article', publishedTime: post.date,
      images: [{ url: new URL(post.image, SITE_URL).href, width: 1024, height: 1536, alt: post.title }],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: new URL(post.image, SITE_URL).href,
      datePublished: post.date,
      mainEntityOfPage: canonical,
      url: canonical,
      inLanguage: 'en',
      publisher: { '@type': 'Organization', name: 'EnglishMeter', url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
      ],
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-blue-700">
        <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / <span>{post.title}</span>
      </nav>
      <img
        src={post.image}
        width={1024}
        height={1536}
        alt={post.title}
        className="rounded-xl w-full h-64 object-cover mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        <time dateTime={post.date}>{post.date}</time> • {post.readingTime}
      </p>

      <article
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </main>
  );
}