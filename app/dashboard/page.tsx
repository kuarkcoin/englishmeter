import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [
    { data: progress },
    { data: overall },
    { data: last7 },
    { data: daily },
    { data: streakData },
    { data: completion },
    { data: unitCompletion },
    { data: tagPerformance },
  ] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('v_user_overall_accuracy').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('v_user_last7_accuracy').select('*').eq('user_id', user.id).maybeSingle(),
    supabase
      .from('user_daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .gte('stat_date', new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10))
      .order('stat_date', { ascending: true }),
    supabase.rpc('get_user_streak_days', { p_user_id: user.id }),
    supabase.from('v_user_completion').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('v_user_unit_completion').select('*').eq('user_id', user.id),
    supabase.from('v_user_tag_performance').select('*').eq('user_id', user.id).limit(30),
  ]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const today = (daily ?? []).find((d: any) => d.stat_date === todayStr);
  const resumeHref = `/learn?u=${encodeURIComponent(progress?.current_unit_id ?? 'unit-1')}&l=${encodeURIComponent(progress?.current_lesson_id ?? 'lesson-1')}&s=${progress?.current_step ?? 0}`;

  return (
    <DashboardClient
      email={user.email ?? 'unknown'}
      resumeHref={resumeHref}
      summary={{
        overallAccuracy: Number((overall as any)?.accuracy_ratio ?? 0) * 100,
        last7Accuracy: Number((last7 as any)?.accuracy_ratio_7d ?? 0) * 100,
        streakDays: Number(streakData ?? 0),
        todayXp: Number((today as any)?.xp_earned ?? 0),
        todayMinutes: Number((today as any)?.minutes_spent ?? 0),
        todayAttempts: Number((today as any)?.attempts_count ?? 0),
        completionRatio: Number((completion as any)?.completion_ratio ?? 0),
      }}
      dailyStats={(daily ?? []) as any}
      unitCompletion={(unitCompletion ?? []) as any}
      tagPerformance={(tagPerformance ?? []) as any}
    />
  );
}
