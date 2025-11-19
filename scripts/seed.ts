// scripts/seed.ts
import 'dotenv/config'
import { PrismaClient, Prisma, QuestionType, CEFR } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
})

type RawChoice = { text: string; isCorrect: boolean }
type RawQuestion = {
  type?: string
  level?: string
  prompt: string
  explanation?: string
  mediaUrl?: string | null
  difficulty?: number
  tags?: string[]
  choices: RawChoice[]
}

async function seedQuestionsFromFile(fileName: string, tagToApply?: string) {
  const filePath = path.join(process.cwd(), 'data', fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Uyarı: ${fileName} bulunamadı, atlanıyor.`);
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data: RawQuestion[] = JSON.parse(raw)
  console.log(`🌱 Reading ${data.length} questions from ${fileName}...`);

  for (const q of data) {
    const correctedType: QuestionType = (q.type && q.type !== 'MCG' && Object.values(QuestionType).includes(q.type as any))
      ? q.type as QuestionType
      : QuestionType.MCQ;

    let correctedLevel: CEFR = CEFR.B1 
    if (q.level && Object.values(CEFR).includes(q.level as any)) {
      correctedLevel = q.level as CEFR
    }
    
    let tagsToCreate: string[] = q.tags || [];
    if (tagToApply && !tagsToCreate.includes(tagToApply)) {
      tagsToCreate.push(tagToApply);
    }

    await prisma.question.upsert({
      where: { prompt: q.prompt },
      update: {},
      create: {
        type: correctedType,
        level: correctedLevel,
        prompt: q.prompt,
        explanation: q.explanation ?? null,
        mediaUrl: q.mediaUrl ?? null,
        difficulty: q.difficulty ?? 0.5,
        choices: {
          create: q.choices.map((c) => ({
            text: c.text,
            isCorrect: c.isCorrect
          }))
        },
        tags: tagsToCreate.length > 0
          ? {
              create: tagsToCreate.map((t) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: t },
                    create: { name: t }
                  }
                }
              }))
            }
          : undefined
      }
    })
  }
}

// --- DÜZELTME BURADA: Filtreler artık basit bir dizi bekliyor ---
const mcqFilter = (level?: CEFR): Prisma.InputJsonValue =>
  level ? ({ type: 'MCQ', level } as Prisma.InputJsonValue)
        : ({ type: 'MCQ' } as Prisma.InputJsonValue);

// Vocab testi için düzeltilmiş filtre:
const tagFilter = (tagName: string): Prisma.InputJsonValue =>
  ({ type: 'MCQ', tags: [tagName] } as Prisma.InputJsonValue);


async function main() {
  // 1) Soru Bankalarını Yükle
  await seedQuestionsFromFile('english_test_questions.json');
  await seedQuestionsFromFile('vocabulary_b1_c1_test.json', 'vocab-b1-c1');
  await seedQuestionsFromFile('grammar_topic_tests.json'); 

  // 2) Quick Placement Test (12 Soru -> 12 Dakika)
  await prisma.test.upsert({
    where: { slug: 'quick-placement' },
    update: { duration: 12, sections: { deleteMany: {}, create: [{ title: 'Mixed MCQ', count: 12, filters: mcqFilter() }] } },
    create: {
      slug: 'quick-placement',
      title: 'Quick CEFR Placement',
      level: 'A1', 
      duration: 12, // SÜRE GÜNCELLENDİ
      sections: { create: [{ title: 'Mixed MCQ', count: 12, filters: mcqFilter() }] },
    },
  });

  // 3) Seviye Testleri (Her soru 1 dakika)
  const levels: CEFR[] = ['A1','A2','B1','B2','C1','C2'];
  const testDifficulties = [
    { num: 1, name: 'Practice Test 1', count: 15 }, // 15 dk
    { num: 2, name: 'Practice Test 2', count: 15 }, // 15 dk
    { num: 3, name: 'Mixed Review', count: 20 },    // 20 dk
    { num: 4, name: 'Harder Challenge', count: 20 },// 20 dk
    { num: 5, name: 'Final Exam', count: 25 },      // 25 dk
    { num: 6, name: 'Mastery Test', count: 25 },    // 25 dk
  ];

  for (const lvl of levels) {
    for (const diffTest of testDifficulties) {
      const testSlug = `${lvl.toLowerCase()}-test-${diffTest.num}`; 
      await prisma.test.upsert({
        where: { slug: testSlug },
        update: { 
          duration: diffTest.count, // SÜRE GÜNCELLENDİ
          sections: { 
            deleteMany: {}, 
            create: [{ title: 'Mixed MCQ', count: diffTest.count, filters: mcqFilter(lvl) }]
          }
        },
        create: {
          slug: testSlug,
          title: `${lvl} - ${diffTest.name}`, 
          level: lvl,
          duration: diffTest.count, // SÜRE GÜNCELLENDİ
          sections: {
            create: [{ title: 'Mixed MCQ', count: diffTest.count, filters: mcqFilter(lvl) }],
          },
        },
      });
    }
  }
  
  // 4) MEGA TEST (100 Soru -> 100 Dakika)
  await prisma.test.upsert({
    where: { slug: 'grammar-mega-test-100' },
    update: { duration: 100, sections: { deleteMany: {}, create: [{ title: 'Grammar Mega Test', count: 100, filters: mcqFilter() }] } },
    create: {
      slug: 'grammar-mega-test-100',
      title: '📦 GRAMMAR MEGA TEST – 100 QUESTIONS',
      level: 'B2',
      duration: 100, // SÜRE GÜNCELLENDİ
      sections: { create: [{ title: 'Grammar Mega Test', count: 100, filters: mcqFilter() }] }, 
    },
  });
  
  // 5) VOCABULARY TEST (50 Soru -> 50 Dakika)
  await prisma.test.upsert({
    where: { slug: 'vocab-b1-c1-50' }, 
    update: { duration: 50, sections: { deleteMany: {}, create: [{ title: 'Vocabulary B1-C1', count: 50, filters: tagFilter('vocab-b1-c1') }] } },
    create: {
      slug: 'vocab-b1-c1-50',
      title: 'Vocabulary B1-C1 Test — 50 Questions',
      level: 'B1', 
      duration: 50, // SÜRE GÜNCELLENDİ
      sections: { create: [{ title: 'Vocabulary B1-C1', count: 50, filters: tagFilter('vocab-b1-c1') }] },
    },
  });

  // 6) YENİ 5 GRAMMAR KONU TESTİ (30 Soru -> 30 Dakika)
  const grammarTests = [
    { slug: 'test-perfect-past', title: 'Present Perfect vs Past Simple', tag: 'topic-perfect-past' },
    { slug: 'test-conditionals', title: 'Conditionals (All Types)', tag: 'topic-conditionals' },
    { slug: 'test-relatives', title: 'Relative Clauses', tag: 'topic-relatives' },
    { slug: 'test-articles', title: 'Articles (A/An/The/Zero)', tag: 'topic-articles' },
    { slug: 'test-tenses-mixed', title: 'All Tenses Mixed', tag: 'topic-tenses-mixed' },
  ];

  for (const gTest of grammarTests) {
    await prisma.test.upsert({
      where: { slug: gTest.slug },
      update: { duration: 30, sections: { deleteMany: {}, create: [{ title: gTest.title, count: 30, filters: tagFilter(gTest.tag) }] } },
      create: {
        slug: gTest.slug,
        title: gTest.title,
        level: 'B1', 
        duration: 30, // SÜRE GÜNCELLENDİ
        sections: { create: [{ title: gTest.title, count: 30, filters: tagFilter(gTest.tag) }] },
      },
    });
  }

  console.log('✅ Seed completed: Durations updated and Vocab test filter fixed.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());