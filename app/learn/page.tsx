import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LearnClient = nextDynamic(() => import('./LearnClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-slate-50" />,
});

export default function LearnPage() {
  return <LearnClient />;
}
