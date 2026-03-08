'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type Tag = { id: string; label: string };
type Lesson = { id: string; title: string; unit_id: string; order_index: number };

type GuestAttempt = {
  content_id: string;
  unit_id: string;
  lesson_id: string;
  step: number;
  is_correct: boolean;
  time_spent_sec: number;
  created_at: string;
};

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function LearnPage() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();

  const unitId = params.get('u') ?? 'unit-1';
  const lessonId = params.get('l') ?? 'lesson-1';
  const step = Number(params.get('s') ?? '0');

  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('Loading lesson...');
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSessionUserId(data.user?.id ?? null));
  }, [supabase]);

  useEffect(() => {
    const load = async () => {
      const [{ data: lessons }, { data: tagRows }] = await Promise.all([
        supabase.from('lessons').select('id,title,unit_id,order_index').order('unit_id').order('order_index'),
        supabase.from('tags').select('id,label').order('label'),
      ]);

      if (lessons) {
        setAllLessons(lessons as Lesson[]);
        const found = lessons.find((l) => l.id === lessonId);
        setLessonTitle(found?.title ?? 'Demo Lesson');
      }
      if (tagRows) setTags(tagRows as Tag[]);
    };
    load();
  }, [supabase, lessonId]);

  const updateUrl = (nextStep: number, nextUnit = unitId, nextLesson = lessonId) => {
    router.replace(`/learn?u=${encodeURIComponent(nextUnit)}&l=${encodeURIComponent(nextLesson)}&s=${nextStep}`);
  };

  const saveGuest = (attempt: GuestAttempt, nextStep: number) => {
    const queue = JSON.parse(localStorage.getItem('em_attempt_queue') || '[]') as GuestAttempt[];
    queue.push(attempt);
    localStorage.setItem('em_attempt_queue', JSON.stringify(queue));
    localStorage.setItem(
      'em_progress',
      JSON.stringify({ unitId, lessonId, step: nextStep, updatedAt: new Date().toISOString() })
    );
  };

  const handleAttempt = async (isCorrect: boolean) => {
    const nextStep = step + 1;
    const contentId = `demo_${randomId()}`;
    const payloadBase = {
      content_id: contentId,
      unit_id: unitId,
      lesson_id: lessonId,
      step: nextStep,
      is_correct: isCorrect,
      time_spent_sec: 10 + Math.floor(Math.random() * 31),
      created_at: new Date().toISOString(),
    };

    if (!sessionUserId) {
      saveGuest(payloadBase, nextStep);
      updateUrl(nextStep);
      toast.success(`Saved locally (${isCorrect ? 'correct' : 'wrong'})`);
      return;
    }

    const { error: rpcError } = await supabase.rpc('register_demo_content', {
      p_content_id: contentId,
      p_content_type: 'mcq',
      p_title: 'Demo Question',
      p_lesson_id: lessonId,
      p_difficulty: 1 + Math.floor(Math.random() * 3),
      p_tag_ids: selectedTags,
    });

    if (rpcError) {
      toast.error(rpcError.message);
      return;
    }

    const { error } = await supabase.from('attempts').insert({ user_id: sessionUserId, ...payloadBase });
    if (error) return toast.error(error.message);

    updateUrl(nextStep);
    toast.success(isCorrect ? 'Correct saved' : 'Wrong saved');
  };

  const handleComplete = async () => {
    if (!sessionUserId) {
      toast.error('Login required to save completion');
      return;
    }

    const { error: completeError } = await supabase
      .from('lesson_completions')
      .upsert({ user_id: sessionUserId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });

    if (completeError) return toast.error(completeError.message);

    const current = allLessons.find((l) => l.id === lessonId);
    if (!current) return;

    let next = allLessons.find((l) => l.unit_id === current.unit_id && l.order_index === current.order_index + 1);
    if (!next) {
      const currentUnitNumeric = Number(String(current.unit_id).replace(/\D/g, '')) || 1;
      next = allLessons
        .filter((l) => {
          const n = Number(String(l.unit_id).replace(/\D/g, '')) || 1;
          return n > currentUnitNumeric;
        })
        .sort((a, b) => (a.unit_id + a.order_index).localeCompare(b.unit_id + b.order_index))[0];
    }

    if (!next) {
      toast.success('Course completed');
      return;
    }

    await supabase.from('user_progress').upsert({
      user_id: sessionUserId,
      current_unit_id: next.unit_id,
      current_lesson_id: next.id,
      current_step: 0,
    });

    updateUrl(0, next.unit_id, next.id);
    toast.success('Lesson completed. Moving on.');
  };

  const pickTag = (id: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const selectedLabels = useMemo(
    () => tags.filter((t) => selectedTags.includes(t.id)).map((t) => t.label),
    [tags, selectedTags]
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Learn</CardTitle>
            <p className="text-sm text-slate-600">Unit: {unitId} · Lesson: {lessonTitle} · Step: {step}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => handleAttempt(true)}>Correct</Button>
              <Button variant="destructive" onClick={() => handleAttempt(false)}>Wrong</Button>
              <Button variant="outline" onClick={handleComplete}>Mark lesson complete</Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Tag picker (max 2):</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => pickTag(tag.id)}
                    className={`px-3 py-1 rounded-full border text-xs ${selectedTags.includes(tag.id) ? 'bg-blue-100 border-blue-300' : 'bg-white border-slate-300'}`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {selectedLabels.map((label) => (
                  <Badge key={label}>{label}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
