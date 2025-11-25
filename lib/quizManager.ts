// JSON verilerini içe aktarıyoruz
import grammarTests from '@/data/grammar_topic_tests.json';
import levelTests from '@/data/english_test_questions.json';
import vocabTests from '@/data/vocabulary_b1_c1_test.json'; // YENİ EKLENDİ

// Uygulamanın kullanacağı standart soru tipi
export interface StandardQuestion {
  id: string;
  prompt: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
}

export const getQuestionsBySlug = (slug: string): { title: string; questions: StandardQuestion[] } => {
  let rawQuestions: any[] = [];
  let title = "Practice Test";

  console.log("QuizManager çalıştı. Aranan Slug:", slug);

  // --- 1. LEVEL TESTLERİ (Örn: level-a1) ---
  // data/english_test_questions.json dosyasından çeker
  if (slug.includes('level-')) {
    const targetLevel = slug.replace('level-', '').toUpperCase(); // "a1" -> "A1"
    
    rawQuestions = (levelTests as any[]).filter((q: any) => q.level === targetLevel);
    
    if(rawQuestions.length > 20) rawQuestions = rawQuestions.slice(0, 20);
    title = `${targetLevel} LEVEL ASSESSMENT`;
  }

  // --- 2. VOCABULARY TESTLERİ (Örn: vocab-b1-c1-50) ---
  // data/vocabulary_b1_c1_test.json dosyasından çeker
  else if (slug.includes('vocab')) {
    // Tüm kelime sorularını alıp karıştırıyoruz
    rawQuestions = (vocabTests as any[]).sort(() => 0.5 - Math.random()).slice(0, 50);
    title = "VOCABULARY CHALLENGE (B1-C1)";
  }

  // --- 3. GRAMMAR TESTLERİ (Örn: test-perfect-past) ---
  // data/grammar_topic_tests.json dosyasından çeker
  else if (slug.includes('test-')) {
    const topicRaw = slug.replace('test-', ''); // "perfect-past"
    const searchTerms = topicRaw.split('-'); 

    rawQuestions = (grammarTests as any[]).filter((q: any) => {
      const content = JSON.stringify(q).toLowerCase();
      return searchTerms.some(term => content.includes(term));
    });

    if(rawQuestions.length > 15) rawQuestions = rawQuestions.slice(0, 15);
    title = topicRaw.replace(/-/g, ' ').toUpperCase() + " TEST";
  }
  
  // --- 4. QUICK PLACEMENT TEST (Örn: quick-placement) ---
  // Level testinden karma sorular alır
  else if (slug === 'quick-placement') {
     rawQuestions = (levelTests as any[]).sort(() => 0.5 - Math.random()).slice(0, 10);
     title = "QUICK PLACEMENT TEST";
  }

  // --- HATA ÖNLEME (Yedek) ---
  if (!rawQuestions || rawQuestions.length === 0) {
    console.warn(`"${slug}" için soru bulunamadı. Varsayılan sorular yükleniyor.`);
    rawQuestions = (levelTests as any[]).slice(0, 5);
    title = "GENERAL PRACTICE";
  }

  // --- FORMATLAMA ---
  const formattedQuestions: StandardQuestion[] = rawQuestions.map((q: any, index) => {
    const correctVal = q.correct_option ? String(q.correct_option).toLowerCase().trim() : 'a';

    return {
      id: q.id ? String(q.id) : `q-${index}`,
      prompt: q.question_text || q.question || "Question text missing...",
      choices: [
        { id: 'a', text: q.option_a || "Option A", isCorrect: correctVal === 'a' || correctVal.includes('option_a') },
        { id: 'b', text: q.option_b || "Option B", isCorrect: correctVal === 'b' || correctVal.includes('option_b') },
        { id: 'c', text: q.option_c || "Option C", isCorrect: correctVal === 'c' || correctVal.includes('option_c') },
        { id: 'd', text: q.option_d || "Option D", isCorrect: correctVal === 'd' || correctVal.includes('option_d') }
      ]
    };
  });

  return { title, questions: formattedQuestions };
};