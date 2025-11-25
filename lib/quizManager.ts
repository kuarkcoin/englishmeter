// lib/quizManager.ts

import grammarTopicTests from '@/data/grammar_topic_tests.json';
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

  console.log('QuizManager → Gelen slug:', slug);

  // 1) GRAMMAR FOCUS – BURAYA EKSTRA DEBUG EKLİYORUZ
  if (slug.startsWith('test-')) {
    console.log('Grammar Focus testi algılandı!');

    // JSON'dan ilk 3 sorunun tag'lerini gösterelim
    console.log('JSON\'daki ilk 3 sorunun tag\'leri:', 
      (grammarTopicTests as any[]).slice(0, 3).map(q => ({ prompt: q.prompt, tags: q.tags }))
    );

    // Mevcut eşleşmeyi göster
    const expectedTag = slug === 'test-articles' ? 'articles' : 
                        slug === 'test-perfect-past' ? 'perfect_tenses' :
                        slug === 'test-conditionals' ? 'conditionals' : 'bilinmiyor';
    console.log('Aranan tag (bizim eşleşmeye göre):', expectedTag);

    // Gerçek filtreleme
    const filtered = (grammarTopicTests as AnyQuestion[]).filter((q: any) => 
      q.tags && q.tags.includes(expectedTag)
    );

    console.log(`"${expectedTag}" tag'i ile bulunan soru sayısı:`, filtered.length);

    if (filtered.length > 0) {
      rawQuestions = filtered.sort(() => Math.random() - 0.5).slice(0, 20);
      title = slug.replace('test-', '').replace(/-/g, ' ').toUpperCase() + ' TEST';
    } else {
      console.log('Hiç soru bulunamadı → fallback sorular yükleniyor');
      rawQuestions = (grammarTopicTests as AnyQuestion[]).slice(0, 20);
      title = 'GRAMMAR PRACTICE';
    }
  }
  // 2) Diğer testler (level, quick, mega vs.) – eskisi gibi
  else if (slug.includes('level-')) {
    const level = slug.replace('level-', '').toUpperCase();
    rawQuestions = (levelTests as any[]).filter(q => q.level === level).slice(0, 20);
    title = `${level} LEVEL TEST`;
  }
  else if (slug === 'quick-placement') {
    rawQuestions = (levelTests as any[]).slice(0, 10);
    title = 'QUICK PLACEMENT TEST';
  }
  else if (slug === 'grammar-mega-test-100') {
    rawQuestions = (grammarTopicTests as any[]).slice(0, 100);
    title = 'MEGA GRAMMAR TEST';
  }
  else if (slug.includes('vocab')) {
    rawQuestions = (vocabTests as any[]).slice(0, 50);
    title = 'VOCABULARY TEST';
  }
  else {
    rawQuestions = (levelTests as any[]).slice(0, 10);
    title = 'PRACTICE TEST';
  }

  // FORMATLAMA – A/B/C/D + correct formatını çevir
  const formattedQuestions: StandardQuestion[] = rawQuestions.map((q: any, i: number) => {
    const prompt = q.prompt || q.question || 'No question';

    let choices: { id: string; text: string; isCorrect: boolean }[] = [];

    if (q.A !== undefined && q.correct !== undefined) {
      const correct = String(q.correct).trim().toUpperCase();
      choices = ['A', 'B', 'C', 'D'].map(letter => ({
        id: letter.toLowerCase(),
        text: q[letter] || '-',
        isCorrect: correct === letter
      }));
    } else {
      choices = [
        { id: 'a', text: 'Option A', isCorrect: false },
        { id: 'b', text: 'Option B', isCorrect: false },
        { id: 'c', text: 'Option C', isCorrect: false },
        { id: 'd', text: 'Option D', isCorrect: false }
      ];
    }

    return {
      id: `${slug}-q${i + 1}`,
      prompt,
      choices
    };
  });

  console.log(`Toplam ${formattedQuestions.length} soru hazırlandı → ${title}`);
  return { title, questions: formattedQuestions };
};