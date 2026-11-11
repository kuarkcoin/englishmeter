import Link from 'next/link';
import { getStudyRecommendations } from '@/lib/study-recommendations';

export default function StudyRecommendations(props: Parameters<typeof getStudyRecommendations>[0]) {
  const { guidance, links } = getStudyRecommendations(props);
  return <section className="em-card rounded-3xl p-6 sm:p-8" aria-labelledby="next-practice-heading">
    <h2 id="next-practice-heading" className="text-xl font-bold">What to practise next</h2>
    <p className="mt-3 text-slate-600 dark:text-slate-300">{guidance}</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{links.map((link) => <Link prefetch={false} key={link.href} href={link.href} className="rounded-xl border border-blue-200 p-4 font-semibold text-blue-700 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-300 dark:hover:bg-slate-800">{link.title}</Link>)}</div>
    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Study suggestions are based on this practice set, not a certified CEFR assessment.</p>
  </section>;
}
