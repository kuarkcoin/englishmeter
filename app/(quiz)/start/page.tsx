'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getQuestionsBySlug } from '@/lib/quizManager';

// --- HELPER: SHUFFLE ARRAY (for randomizing correct option position) ---
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// --- HELPER: GET PROMPT TEXT SAFELY ---
function getPrompt(item: any): string {
  return (
    item.prompt ||
    item.question || // ALL LEVELS JSON'undaki field
    item.text ||
    ''
  );
}

function StartQuizLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const initQuiz = async () => {
      // 1. Get which test is requested from the URL
      const slug = searchParams.get('testSlug') || 'quick-placement';
      console.log('STARTING TEST:', slug);

      // 2. FETCH RAW QUESTIONS FROM YOUR JSON / QUIZ MANAGER
      const { title, questions: rawQuestions } = getQuestionsBySlug(slug);

      const safeQuestions = (rawQuestions || []) as any[];

      // 3. TRANSFORM DATA INTO A UNIFIED FORMAT FOR <Quiz />
      const formattedQuestions = safeQuestions
        .map((item: any, index: number) => {
          const prompt = getPrompt(item);

          // ------------- CASE 1: QUESTION + OPTIONS + CORRECT_OPTION -------------
          // Example (ALL LEVELS):
          // {
          //   question: "...",
          //   options: { A: "...", B: "...", C: "...", D: "..." },
          //   correct_option: "A"
          // }
          const correctKey =
            item.correct_option ?? item.correct ?? item.answer ?? null;

          if (item.options && correctKey) {
            const optionsObj = item.options as Record<string, string>;
            const labels = Object.keys(optionsObj).sort(); // ["A","B","C","D"] gibi

            const choices = labels.map((label) => ({
              id: label,
              text: optionsObj[label],
              isCorrect:
                String(label).trim().toUpperCase() ===
                String(correctKey).trim().toUpperCase(),
            }));

            return {
              id: item.id || `opt-${index}`,
              prompt,
              explanation: item.explanation,
              choices,
            };
          }

          // ------------- CASE 2: GRAMMAR A/B/C/D + correct -------------
          // Example:
          // { prompt/question: "...", A:"...", B:"...", C:"...", D:"...", correct:"A" }
          if ((item.A || item.B || item.C || item.D) && correctKey) {
            const labels = ['A', 'B', 'C', 'D'] as const;

            const choices = labels
              .filter((l) => item[l]) // sadece var olan şıkları al
              .map((label) => ({
                id: label,
                text: item[label],
                isCorrect:
                  String(label).trim().toUpperCase() ===
                  String(correctKey).trim().toUpperCase(),
              }));

            return {
              id: item.id || `g-${index}`,
              prompt,
              explanation: item.explanation,
              choices,
            };
          }

          // ------------- CASE 3: WORD / DEFINITION -------------
          // Example:
          // { word: "meticulous", definition: "showing great attention to detail" }
          if (item.word && item.definition) {
            // 1) Build base options (correct + dummy incorrects)
            const baseChoices = [
              {
                id: 'A',
                text: item.definition,
                isCorrect: true, // correct definition
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

            // 2) Shuffle them so the correct answer is not always A
            const shuffled = shuffleArray(baseChoices);

            // 3) Reassign IDs as A / B / C according to shuffled order
            const finalChoices = shuffled.map((choice, idx) => ({
              ...choice,
              id: String.fromCharCode(65 + idx), // 65 = 'A'
            }));

            return {
              id: item.id || `w-${index}`,
              prompt: `What is the definition of "<strong>${item.word}</strong>"?`,
              explanation: `${item.word}: ${item.definition}`,
              choices: finalChoices,
            };
          }

          // ------------- CASE 4: ALREADY-FORMATTED MCQ (choices[]) -------------
          // Example:
          // {
          //   id: "q1",
          //   prompt/question: "...",
          //   explanation: "...",
          //   choices: [
          //     { id:"A", text:"...", isCorrect:false },
          //     { id:"B", text:"...", isCorrect:true }
          //   ]
          // }
          if (item.choices && Array.isArray(item.choices)) {
            return {
              id: item.id || `q-${index}`,
              prompt,
              explanation: item.explanation,
              choices: item.choices.map((c: any, i: number) => ({
                id: c.id || String.fromCharCode(65 + i),
                text: c.text ?? c.label ?? '',
                isCorrect:
                  c.isCorrect === true ||
                  c.correct === true ||
                  c.is_correct === true,
              })),
            };
          }

          // Unknown format -> skip
          console.warn('Unknown question format, skipping item:', item);
          return null;
        })
        .filter(Boolean);

      console.log('FORMATTED QUESTIONS:', formattedQuestions);

      // 4. PACKAGE DATA FOR THE QUIZ PAGE
      const attemptData = {
        attemptId: `session-${Date.now()}`,
        test: {
          title: title,
          duration: 0, // Quiz.tsx will calculate "questionCount x 60s"
        },
        questions: formattedQuestions,
      };

      // 5. SAVE TO SESSION STORAGE
      sessionStorage.setItem('em_attempt_payload', JSON.stringify(attemptData));

      // 6. REDIRECT TO QUIZ PAGE
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
