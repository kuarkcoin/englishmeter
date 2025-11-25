// lib/quizManager.ts

// JSON verilerini içe aktarıyoruz
import grammarTests from '@/data/grammar_topic_tests.json';
import levelTests from '@/data/english_test_questions.json';
import vocabTests from '@/data/vocabulary_b1_c1_test.json';

export interface StandardQuestion {
  id: string;
  prompt: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
}

type AnyQuestion = any;

export const getQuestionsBySlug = (
  slug: string
): { title: string; questions: StandardQuestion[] } => {
  let rawQuestions: AnyQuestion[] = [];
  let title = 'Practice Test';

  console.log('QuizManager çalıştı. Aranan Slug:', slug);

  // 1) LEVEL TESTLERİ (level-a1, level-b2 ...)
  if (slug.includes('level-')) {
    const targetLevel = slug.replace('level-', '').toUpperCase(); // "a1" -> "A1"
    rawQuestions = (levelTests as AnyQuestion[]).filter(
      (q) => q.level === targetLevel
    );
    if (rawQuestions.length > 20) rawQuestions = rawQuestions.slice(0, 20);
    title = `${targetLevel} LEVEL ASSESSMENT`;
  }
  // 2) GRAMMAR MEGA TEST (100 soru)
  else if (slug === 'grammar-mega-test-100') {
    rawQuestions = (grammarTests as AnyQuestion[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 100);
    title = 'GRAMMAR MEGA TEST (100Q)';
  }
  // 3) VOCABULARY TESTLERİ (vocab-b1-c1-50)
  else if (slug.includes('vocab')) {
    rawQuestions = (vocabTests as AnyQuestion[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 50);
    title = 'VOCABULARY CHALLENGE (B1-C1)';
  }
  // 4) GRAMMAR TOPIC TESTLERİ (test-perfect-past, test-passive-voice ...)
  else if (slug.includes('test-')) {
    const topicRaw = slug.replace('test-', ''); // "perfect-past"
    const searchTerms = topicRaw.split('-'); // ["perfect","past"]

    rawQuestions = (grammarTests as AnyQuestion[]).filter((q) => {
      const content = JSON.stringify(q).toLowerCase();
      return searchTerms.some((term) => content.includes(term));
    });

    if (rawQuestions.length > 50) rawQuestions = rawQuestions.slice(0, 50);
    title = topicRaw.replace(/-/g, ' ').toUpperCase() + ' TEST';
  }
  // 5) QUICK PLACEMENT
  else if (slug === 'quick-placement') {
    rawQuestions = (levelTests as AnyQuestion[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    title = 'QUICK PLACEMENT TEST';
  }

  // HİÇBİR ŞEYE GİRMEDİYSE / BOŞSA YEDEK
  if (!rawQuestions || rawQuestions.length === 0) {
    console.warn(
      `"${slug}" için soru bulunamadı. Varsayılan sorular yükleniyor.`
    );
    rawQuestions = (levelTests as AnyQuestion[]).slice(0, 5);
    title = 'GENERAL PRACTICE';
  }

  // --- FORMATLAMA: Farklı JSON formatlarını tek tip StandardQuestion'a çevir ---
  const formattedQuestions: StandardQuestion[] = rawQuestions.map(
    (q: AnyQuestion, index: number) => {
      const id = q.id ? String(q.id) : `q-${index}`;

      // 1) Soru metni
      const prompt: string =
        q.prompt ||
        q.question_text ||
        q.question ||
        'Question text missing...';

      let choices: { id: string; text: string; isCorrect: boolean }[] = [];

      // 2) Yeni format: choices[] içinde text + isCorrect
      if (Array.isArray(q.choices) && q.choices.length > 0) {
        const labels = ['a', 'b', 'c', 'd'];
        choices = q.choices.slice(0, 4).map((choice: any, idx: number) => ({
          id: labels[idx] || String(idx),
          text:
            choice.text ??
            `Option ${labels[idx] ? labels[idx].toUpperCase() : ''}`,
          isCorrect: !!choice.isCorrect,
        }));
      }
      // 3) 550 soruluk grammar formatı: A/B/C/D + correct
      else if (q.A || q.B || q.C || q.D) {
        const correctLetter = (q.correct || 'A')
          .toString()
          .trim()
          .toUpperCase();
        const letters = ['A', 'B', 'C', 'D'];
        const texts: any = { A: q.A, B: q.B, C: q.C, D: q.D };

        choices = letters.map((letter) => ({
          id: letter.toLowerCase(),
          text: texts[letter] || `Option ${letter}`,
          isCorrect: correctLetter === letter,
        }));
      }
      // 4) Eski format: option_a/option_b + correct_option
      else {
        const correctVal = (
          q.correct_option ? String(q.correct_option) : 'a'
        )
          .toLowerCase()
          .trim();

        choices = [
          {
            id: 'a',
            text: q.option_a || 'Option A',
            isCorrect:
              correctVal === 'a' || correctVal.includes('option_a'),
          },
          {
            id: 'b',
            text: q.option_b || 'Option B',
            isCorrect:
              correctVal === 'b' || correctVal.includes('option_b'),
          },
          {
            id: 'c',
            text: q.option_c || 'Option C',
            isCorrect:
              correctVal === 'c' || correctVal.includes('option_c'),
          },
          {
            id: 'd',
            text: q.option_d || 'Option D',
            isCorrect:
              correctVal === 'd' || correctVal.includes('option_d'),
          },
        ];
      }

      return { id, prompt, choices };
    }
  );

  return { title, questions: formattedQuestions };
};