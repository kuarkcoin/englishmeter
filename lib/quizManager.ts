// lib/quizManager.ts

// JSON verilerini içe aktarıyoruz
import grammarTests from '@/data/grammar_topic_tests.json';
import levelTests from '@/data/english_test_questions.json';

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
  if (slug.includes('level-')) {
    const targetLevel = slug.replace('level-', '').toUpperCase(); // "a1" -> "A1"
    
    // JSON'da "level" alanı eşleşenleri filtrele
    rawQuestions = (levelTests as any[]).filter((q: any) => q.level === targetLevel);
    
    // Çok soru varsa 20 tanesini al
    if(rawQuestions.length > 20) rawQuestions = rawQuestions.slice(0, 20);
    
    title = `${targetLevel} LEVEL ASSESSMENT`;
  }

  // --- 2. GRAMMAR TESTLERİ (Örn: test-perfect-past) ---
  else if (slug.includes('test-')) {
    const topicRaw = slug.replace('test-', ''); // "perfect-past"
    // Kelimeleri ayır: "perfect past"
    const searchTerms = topicRaw.split('-'); 

    // Basit bir arama algoritması:
    // JSON'daki sorunun içinde bu kelimeler geçiyor mu? (Tags veya topic alanı olmadığı için text araması yapıyoruz)
    rawQuestions = (grammarTests as any[]).filter((q: any) => {
      const content = JSON.stringify(q).toLowerCase();
      // Aranan kelimelerden en az biri geçiyorsa al (daha esnek olması için)
      return searchTerms.some(term => content.includes(term));
    });

    // 15 soruyla sınırla
    if(rawQuestions.length > 15) rawQuestions = rawQuestions.slice(0, 15);

    title = topicRaw.replace(/-/g, ' ').toUpperCase() + " TEST";
  }

  // --- 3. HATA ÖNLEME (Hiç soru bulunamazsa) ---
  if (!rawQuestions || rawQuestions.length === 0) {
    console.warn(`"${slug}" için soru bulunamadı. Varsayılan sorular yükleniyor.`);
    // Boş sayfa hatası vermemek için rastgele 5 soru verelim
    rawQuestions = (levelTests as any[]).slice(0, 5);
    title = "GENERAL PRACTICE (Fallback)";
  }

  // --- 4. FORMATLAMA (Uygulamanın beklediği formata çevir) ---
  const formattedQuestions: StandardQuestion[] = rawQuestions.map((q: any, index) => {
    // Doğru şıkkı normalize et (bazen "A", bazen "option_a" olabilir)
    const correctVal = q.correct_option ? String(q.correct_option).toLowerCase().trim() : 'a';

    return {
      id: q.id ? String(q.id) : `q-${index}`,
      // JSON'da soru metni "question_text" veya "question" olabilir
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
