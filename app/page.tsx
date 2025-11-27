// lib/quizManager.ts

import grammarTopicTests from '@/data/grammar_topic_tests.json';
import levelTests from '@/data/english_test_questions.json';
import vocabTests from '@/data/vocabulary_b1_c1_test.json';
import ieltsGrammar from '@/data/ielts_grammar.json'; // 🔹 YENİ: IELTS soruları

export interface StandardQuestion {
  id: string;
  prompt: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
}

type AnyQuestion = any;

// GRAMMAR FOCUS SLUG → TAG EŞLEŞMESİ
const grammarSlugToTag: Record<string, string> = {
  'test-perfect-past': 'perfect_tenses',
  'test-conditionals': 'conditionals',
  'test-relatives': 'relative_clauses',
  'test-articles': 'articles',
  'test-tenses-mixed': 'mixed_tenses',
  'test-passive-voice': 'passive_voice_adv',
  'test-reported-speech': 'reported_speech',
  'test-gerunds-infinitives': 'gerunds_infinitives',
  'test-clauses-advanced': 'clauses_advanced',
  'test-modals-advanced': 'modals_advanced',
  'test-prepositions-advanced': 'prepositions_advanced',
};

const grammarTitleMap: Record<string, string> = {
  'test-perfect-past': 'Perfect Tenses',
  'test-conditionals': 'Conditionals',
  'test-relatives': 'Relative Clauses',
  'test-articles': 'Articles',
  'test-tenses-mixed': 'Mixed Tenses',
  'test-passive-voice': 'Passive Voice (Adv)',
  'test-reported-speech': 'Reported Speech (Adv)',
  'test-gerunds-infinitives': 'Gerunds & Infinitives',
  'test-clauses-advanced': 'Noun/Adj/Adv Clauses',
  'test-modals-advanced': 'Modal Verbs (Adv)',
  'test-prepositions-advanced': 'Prepositions (Adv)',
};

export const getQuestionsBySlug = (
  slug: string
): { title: string; questions: StandardQuestion[] } => {
  let rawQuestions: AnyQuestion[] = [];
  let title = 'Practice Test';

  console.log('QuizManager → Slug:', slug);

  // 1) GRAMMAR FOCUS TESTLERİ
  if (grammarSlugToTag[slug]) {
    const tag = grammarSlugToTag[slug];
    rawQuestions = (grammarTopicTests as AnyQuestion[])
      .filter((q: any) => q.tags?.includes(tag))
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);

    title =
      (grammarTitleMap[slug] ||
        slug.replace('test-', '').replace(/-/g, ' ').toUpperCase()) + ' TEST';

    if (rawQuestions.length === 0) {
      rawQuestions = (grammarTopicTests as AnyQuestion[]).slice(0, 20);
      title = 'Grammar Practice';
    }
  }
  // 2) LEVEL TESTLERİ (A1–C2)
  else if (slug.includes('level-')) {
    const targetLevel = slug.replace('level-', '').toUpperCase();
    rawQuestions = (levelTests as AnyQuestion[]).filter(
      (q) => q.level === targetLevel
    );
    if (rawQuestions.length > 20) rawQuestions = rawQuestions.slice(0, 20);
    title = `${targetLevel} LEVEL ASSESSMENT`;
  }
  // 3) IELTS GRAMMAR TEST
  else if (slug === 'ielts-grammar') {
    rawQuestions = (ieltsGrammar as AnyQuestion[]);
    title = 'IELTS GRAMMAR (ADVANCED)';
  }
  // 4) MEGA TEST
  else if (slug === 'grammar-mega-test-100') {
    rawQuestions = (grammarTopicTests as AnyQuestion[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 100);
    title = 'GRAMMAR MEGA TEST (100Q)';
  }
  // 5) VOCAB TEST
  else if (slug.includes('vocab')) {
    rawQuestions = (vocabTests as AnyQuestion[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 50);
    title = 'VOCABULARY CHALLENGE (B1-C1)';
  }
  // 6) QUICK PLACEMENT
  else if (slug === 'quick-placement') {
    rawQuestions = (levelTests as AnyQuestion[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    title = 'QUICK PLACEMENT TEST';
  }
  // 7) Fallback
  else {
    rawQuestions = (levelTests as AnyQuestion[]).slice(0, 10);
    title = 'GENERAL PRACTICE';
  }

  // --- FORMATLAMA: HER ŞEYİ StandardQuestion FORMATINA ÇEVİR ---
  const formattedQuestions: StandardQuestion[] = rawQuestions.map(
    (q: AnyQuestion, index: number) => {
      const id = q.id ? String(q.id) : `${slug}-q${index + 1}`;
      const prompt =
        q.prompt || q.question || q.question_text || 'Question missing';

      let choices: { id: string; text: string; isCorrect: boolean }[] = [];

      // 1) grammar_topic_tests.json → A,B,C,D + correct
      if (q.A !== undefined && q.correct !== undefined) {
        const correctLetter = String(q.correct).trim().toUpperCase();
        choices = ['A', 'B', 'C', 'D'].map((letter) => ({
          id: letter.toLowerCase(),
          text: (q as any)[letter] || `Option ${letter}`,
          isCorrect: correctLetter === letter,
        }));
      }
      // 2) vocabulary veya başka JSON → choices array
      else if (Array.isArray(q.choices)) {
        const labels = ['a', 'b', 'c', 'd'];
        choices = q.choices.slice(0, 4).map((c: any, i: number) => ({
          id: labels[i],
          text: c.text || c.option || `Option ${labels[i].toUpperCase()}`,
          isCorrect: !!c.isCorrect,
        }));
      }
      // 3) IELTS tipi: options = { A: '...', B: '...', C: '...', D: '...' }
      else if (q.options && !Array.isArray(q.options)) {
        const labelsUpper = ['A', 'B', 'C', 'D'];
        const labelsLower = ['a', 'b', 'c', 'd'];
        const rawAnswer = q.correct_option ?? q.correct;

        const correctIdx =
          typeof rawAnswer === 'string'
            ? labelsUpper.indexOf(rawAnswer.toUpperCase())
            : -1;

        choices = labelsUpper.map((letter, idx) => ({
          id: labelsLower[idx],
          text: q.options[letter] || `Option ${letter}`,
          isCorrect: idx === correctIdx,
        }));
      }
      // 4) levelTests → options[] + answer
      else if (Array.isArray(q.options)) {
        const labels = ['a', 'b', 'c', 'd'];
        const opts = q.options.slice(0, 4);
        const rawAnswer = q.answer ?? q.correct_option ?? q.correct;

        let correctIndex = -1;
        if (typeof rawAnswer === 'number') {
          correctIndex = rawAnswer;
        } else if (typeof rawAnswer === 'string') {
          const byLetter = ['A', 'B', 'C', 'D'].indexOf(
            rawAnswer.toUpperCase()
          );
          if (byLetter !== -1) {
            correctIndex = byLetter;
          } else {
            correctIndex = opts.findIndex((opt: any) => opt === rawAnswer);
          }
        }

        choices = opts.map((opt: any, i: number) => ({
          id: labels[i],
          text: opt,
          isCorrect: i === correctIndex,
        }));
      }
      // 5) En eski fallback
      else {
        choices = [
          { id: 'a', text: q.option_a || q.A || 'A', isCorrect: false },
          { id: 'b', text: q.option_b || q.B || 'B', isCorrect: false },
          { id: 'c', text: q.option_c || q.C || 'C', isCorrect: false },
          { id: 'd', text: q.option_d || q.D || 'D', isCorrect: false },
        ];
        const correct = String(q.correct_option || q.correct || 'a').toLowerCase();
        const correctIdx = ['a', 'b', 'c', 'd'].indexOf(correct);
        if (correctIdx !== -1) choices[correctIdx].isCorrect = true;
      }

      return { id, prompt, choices };
    }
  );

  return { title, questions: formattedQuestions };
};