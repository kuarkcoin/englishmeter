// app/blog/page.tsx
import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'English Grammar Guides and Practice Tips',
  description: 'Study English grammar with explained examples, short practice exercises and guides to advanced structures, IELTS writing and prepositions.',
  path: '/blog',
});

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">EnglishMeter Blog</h1>

      <p className="mb-8 text-slate-600">Read practical grammar explanations, try the exercises and follow the links to continue practising.</p>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="border rounded-xl p-4 hover:shadow-md transition">
              <img
                src={post.image}
                width={1024}
                height={1536}
                alt={post.title}
                loading="lazy"
                className="rounded-lg w-full h-48 object-cover mb-4"
              />

              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{post.description}</p>

              <p className="text-gray-400 text-sm mt-2">
                {post.date} • {post.readingTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}