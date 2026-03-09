'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectedFrom = params.get('redirectedFrom') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Logged in successfully');
    router.push(redirectedFrom);
    router.refresh();
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Account created. If email confirmation is enabled, check inbox.');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>EnglishMeter Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input className="em-input w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="em-input w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handleSignIn} disabled={loading} className="flex-1">Sign in</Button>
            <Button onClick={handleSignUp} variant="outline" disabled={loading} className="flex-1">Sign up</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
