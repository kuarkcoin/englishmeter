import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LoginClient = nextDynamic(() => import('./LoginClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-slate-50" />,
});

export default function LoginPage() {
  return <LoginClient />;
}
