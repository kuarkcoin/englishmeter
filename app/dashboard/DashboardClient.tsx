'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Daily = { stat_date: string; xp_earned: number; minutes_spent: number; attempts_count: number; accuracy_ratio: number };
type UnitCompletion = { unit_id: string; completion_ratio: number };
type TagPerf = {
  tag_label: string;
  attempts: number;
  accuracy_ratio: number;
  accuracy_ratio_7d: number;
  weighted_accuracy_ratio: number;
};

type Props = {
  email: string;
  resumeHref: string;
  summary: {
    overallAccuracy: number;
    last7Accuracy: number;
    streakDays: number;
    todayXp: number;
    todayMinutes: number;
    todayAttempts: number;
    completionRatio: number;
  };
  dailyStats: Daily[];
  unitCompletion: UnitCompletion[];
  tagPerformance: TagPerf[];
};

export default function DashboardClient({ email, resumeHref, summary, dailyStats, unitCompletion, tagPerformance }: Props) {
  const [importing, setImporting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const syncGuest = async () => {
      const raw = localStorage.getItem('em_attempt_queue');
      if (!raw) return;

      const queue = JSON.parse(raw);
      if (!Array.isArray(queue) || queue.length === 0) return;

      setImporting(true);
      const { error } = await supabase.rpc('import_guest_attempts', { p_attempts: queue });
      setImporting(false);

      if (error) {
        toast.error(`Import failed: ${error.message}`);
        return;
      }

      localStorage.removeItem('em_attempt_queue');
      toast.success(`Guest progress imported: ${queue.length}`);
      window.location.reload();
    };

    syncGuest();
  }, [supabase]);

  const chartData = useMemo(
    () => dailyStats.map((d) => ({ date: d.stat_date, xp: d.xp_earned, minutes: d.minutes_spent, attempts: d.attempts_count, accuracy: Math.round((d.accuracy_ratio || 0) * 100) })),
    [dailyStats]
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-3xl font-black">EnglishMeter Dashboard</h1>
            <p className="text-sm text-slate-600">{email}</p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
          >
            Logout
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Devam Et</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={resumeHref} className="inline-flex"><Button>Continue learning</Button></Link>
            {importing && <p className="text-sm text-slate-500 mt-2">Importing guest queue...</p>}
          </CardContent>
        </Card>

        <section className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Overall %</p><p className="text-2xl font-bold">{summary.overallAccuracy.toFixed(1)}%</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Last 7 %</p><p className="text-2xl font-bold">{summary.last7Accuracy.toFixed(1)}%</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Streak</p><p className="text-2xl font-bold">{summary.streakDays} days</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Today</p><p className="text-sm">XP {summary.todayXp} · {summary.todayMinutes}m · {summary.todayAttempts} attempts</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-slate-500 mb-2">Overall completion</p><Progress value={summary.completionRatio * 100} /><p className="text-sm mt-2">{(summary.completionRatio * 100).toFixed(1)}%</p></CardContent></Card>
        </section>

        <Card>
          <CardHeader><CardTitle>XP (Last 30 Days)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => {
                    if (name === 'xp') return [`${value} XP`, 'XP'];
                    return [String(value), String(name)];
                  }} labelFormatter={(label, payload) => {
                    const row = payload?.[0]?.payload;
                    return `${label} · ${row?.minutes ?? 0} min · ${row?.attempts ?? 0} attempts · ${row?.accuracy ?? 0}%`;
                  }} />
                  <Bar dataKey="xp" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Unit Completion</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unitCompletion.map((u) => (
              <div key={u.unit_id} className="rounded-lg border p-3 bg-white">
                <div className="flex justify-between mb-2"><Badge variant="secondary">{u.unit_id}</Badge><span className="text-sm">{(u.completion_ratio * 100).toFixed(1)}%</span></div>
                <Progress value={u.completion_ratio * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Topic Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="accuracy">
              <TabsList>
                <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                <TabsTrigger value="last7">Last 7 days</TabsTrigger>
                <TabsTrigger value="weighted">Weighted</TabsTrigger>
              </TabsList>

              <TabsContent value="accuracy" className="mt-4">
                {tagPerformance.map((t) => (
                  <div key={t.tag_label} className="py-2">
                    <div className="flex justify-between text-sm"><span>{t.tag_label} ({t.attempts})</span><span>{(t.accuracy_ratio * 100).toFixed(1)}%</span></div>
                    <Progress value={t.accuracy_ratio * 100} />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="last7" className="mt-4">
                {tagPerformance.map((t) => (
                  <div key={t.tag_label} className="py-2">
                    <div className="flex justify-between text-sm"><span>{t.tag_label} ({t.attempts})</span><span>{(t.accuracy_ratio_7d * 100).toFixed(1)}%</span></div>
                    <Progress value={t.accuracy_ratio_7d * 100} />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="weighted" className="mt-4">
                {tagPerformance.map((t) => (
                  <div key={t.tag_label} className="py-2">
                    <div className="flex justify-between text-sm"><span>{t.tag_label} ({t.attempts})</span><span>{(t.weighted_accuracy_ratio * 100).toFixed(1)}%</span></div>
                    <Progress value={t.weighted_accuracy_ratio * 100} />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            <Separator className="my-4" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
