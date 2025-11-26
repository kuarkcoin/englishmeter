'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getQuestionsBySlug } from '@/lib/quizManager';

// --- HELPER: SHUFFLE ARRAY (for randomizing choices) ---
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// --- HELPER: SAFE PROMPT FIELD ---
function getPrompt(item: any): string {
  return (
    item.prompt ||
    item.question || // ALL LEVELS format
    item.text ||
    ''
  );
}

type Choice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

function StartQuizLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const initQuiz = async () => {
      const slug = searchParams.get('testSlug') || 'quick-placement';
      console.log('STARTING TEST:', slug);

      const { title, questions: rawQuestions } = getQuestionsBySlug(slug);
      const safeQuestions = (rawQuestions || []) as any[];

      const formattedQuestions = safeQuestions
        .map((item: any, index: number) => {
          const prompt = getPrompt(item);

          let choices: Choice[] | null = null;

          // ------------- CASE 1: question + options + correct_option -------------
          // {
          //   question: "...",
          //   options: { A:"...", B:"...", C:"...", D:"..." },
          //   correct_option: "A"
          // }
          const correctKey =
            item.correct_option ?? item.correct ?? item.answer ?? null;

          if (item.options && typeof item.options === 'object') {
            const optionsObj = item.options as Record<string, string>;
            const labels = Object.keys(optionsObj); // A,B,C,D...

            choices = labels.map((label) => ({
              id: label, // GEÇİCİ id (sonra override edeceğiz)
              text: optionsObj[label],
              isCorrect:
                correctKey &&
                String(label).trim().toUpperCase() ===
                  String(correctKey).trim().toUpperCase(),
            }));
          }

          // ------------- CASE 2: A/B/C/D alanları olan grammar -------------
          // { question/prompt: "...", A:"...", B:"...", C:"...", D:"...", correct:"A" }
          if (!choices && (item.A || item.B || item.C || item.D)) {
            const labels: string[] = ['A', 'B', 'C', 'D'];
            choices = labels
              .filter((l) => item[l]) // sadece var olan şıkları al
              .map((label) => ({
                id: label,
                text: item[label],
                isCorrect:
                  correctKey &&
                  String(label).trim().toUpperCase() ===
                    String(correctKey).trim().toUpperCase(),
              }));
          }

          // ------------- CASE 3: word + definition seviye soruları -------------
          if (!choices && item.word && item.definition) {
            const baseChoices: Choice[] = [
              {
                id: 'A',
                text: item.definition,
                isCorrect: true,
              },
              {
                id: 'B',
                text: 'Incorrect definition example 1',
                isCorrect: false,
              },
              {
                id: 'C',
                text: 'Incorrect definition example 2',
                isCorrect: false,
              },
            ];
            choices = baseChoices;
          }

          // ------------- CASE 4: zaten choices[] olan MCQ -------------
          if (!choices && Array.isArray(item.choices)) {
            choices = item.choices.map((c: any, i: number) => ({
              id: c.id || String.fromCharCode(65 + i),
              text: c.text ?? c.label ?? '',
              isCorrect:
                c.isCorrect === true ||
                c.correct === true ||
                c.is_correct === true,
            }));
          }

          if (!choices || choices.length === 0) {
            console.warn('Unknown question format, skipping item:', item);
            return null;
          }

          // --- ORTAK: TÜM SORULARDA ŞIKLARI KARIŞTIR + ID'LERİ A/B/C/D YAP ---
          const shuffled = shuffleArray(choices);
          const normalizedChoices: Choice[] = shuffled.map((c, idx) => ({
            ...c,
            id: String.fromCharCode(65 + idx), // 65 = 'A'
          }));

          return {
            id: item.id || `q-${index}`,
            prompt,
            explanation: item.explanation,
            choices: normalizedChoices,
          };
        })
        .filter(Boolean);

      console.log('FORMATTED QUESTIONS (AFTER SHUFFLE):', formattedQuestions);

      const attemptData = {
        attemptId: `session-${Date.now()}`,
        test: {
          title: title,
          duration: 0, // Quiz.tsx will use questionCount * 60s
        },
        questions: formattedQuestions,
      };

      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptData));

      router.push(`/quiz/${attemptData.attemptId}`);
    };

    initQuiz();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-2xl font-bold text-slate-800">Your test is starting...</h1>
      <p className="text-slate-500 mt-2">
        Please wait while we prepare your questions.
      </p>
    </div>
  );
}

export default function Start() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartQuizLogic />
    </Suspense>
  );
}
