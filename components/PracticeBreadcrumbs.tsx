import Link from 'next/link';
import type { PracticeBreadcrumb } from '@/lib/practice-catalog';

export default function PracticeBreadcrumbs({ items }: { items: readonly PracticeBreadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-600 dark:text-slate-300">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={item.path} className="inline-flex max-w-full items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page" className="break-words">{item.name}</span>
            ) : (
              <Link href={item.path} className="font-semibold text-blue-700 dark:text-blue-300 hover:underline">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
