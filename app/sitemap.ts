// levelTests ve grammarTests dizilerini bir yerden import ettiğini veya burada tanımladığını varsayalım
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const grammarSlugs = [
  'test-perfect-past', 'test-conditionals', 'test-relatives', 
  'test-articles', 'test-tenses-mixed'
];

// ... (createSlug fonksiyonun kalsın)

// Rotaları şu şekilde genişlet:
const levelPages = levels.map(level => ({
  url: `${baseUrl}/levels/${level}`,
  lastModified: now,
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}));

const grammarPages = grammarSlugs.map(slug => ({
  url: `${baseUrl}/start?testSlug=${slug}`, // Veya /quiz/${slug}
  lastModified: now,
  changeFrequency: 'weekly' as const,
  priority: 0.7,
}));

return [
  ...corePages,
  ...levelPages,
  ...grammarPages,
  ...ydsExamTests,
  ...wordRoutes(vocab1, '/vocabulary', 0.4), // Kelimelerin önceliğini biraz daha düşürdük
  // ...
];
