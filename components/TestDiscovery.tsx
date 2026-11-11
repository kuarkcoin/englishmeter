'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { PRIMARY_TEST_CATEGORIES, searchTests, type TestDiscoveryEntry } from '@/lib/test-discovery';

export default function TestDiscovery({ entries }: { entries: readonly TestDiscoveryEntry[] }) {
  const [query, setQuery] = useState('');
  const searchId = useId();
  const matches = useMemo(() => searchTests(entries, query), [entries, query]);
  const hasQuery = query.trim().length > 0;

  return (
    <section aria-labelledby="find-test-heading" className="mx-auto w-full max-w-6xl px-4 pb-10">
      <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-sm sm:p-6">
        <h2 id="find-test-heading" className="text-2xl font-black">Find your next test</h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">Choose a goal or search by topic, level or exam.</p>
        <nav aria-label="Main test categories" className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {PRIMARY_TEST_CATEGORIES.map((category) => (
            <Link key={category.href} href={category.href} prefetch={false}
              data-analytics-category={category.category} data-analytics-placement="home-discovery"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-center text-sm font-bold text-blue-800 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
              {category.title}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <label htmlFor={searchId} className="block text-sm font-bold">Search English tests</label>
          <input id={searchId} type="search" value={query} maxLength={100} onChange={(event) => setQuery(event.target.value)}
            placeholder="Try B1, conditionals, IELTS or reading" aria-controls={`${searchId}-results`}
            className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-base text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          <div id={`${searchId}-results`}>
            {hasQuery && <p role="status" className="mt-3 text-sm text-[rgb(var(--muted))]">
              {matches.length ? `${matches.length} matching ${matches.length === 1 ? 'test or category' : 'tests and categories'}${matches.length > 12 ? ' · Showing the first 12' : ''}` : 'No matches. Try a level such as A2 or a topic such as tenses.'}
            </p>}
            {hasQuery && matches.length > 0 && <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {matches.slice(0, 12).map((entry) => <li key={entry.href}>
                <Link href={entry.href} prefetch={false} data-analytics-category={entry.category} data-analytics-placement="home-search"
                  className="flex min-h-12 items-center rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-200 dark:hover:bg-blue-950">
                  {entry.title} <span aria-hidden="true" className="ml-auto pl-3">→</span>
                </Link>
              </li>)}
            </ul>}
          </div>
          <Link href="/english-tests" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-200">Browse the complete test directory →</Link>
        </div>
      </div>
    </section>
  );
}
