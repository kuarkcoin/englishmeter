import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function shuffle(array: any[]) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export async function POST(req: NextRequest) {
  const { testSlug } = await req.json() 
  const test = await prisma.test.findUnique({ 
    where: { slug: testSlug }, 
    include: { sections: true } 
  })

  if (!test) {
    return NextResponse.json({ error: `Test '${testSlug}' not found. Did you run seed?` }, { status: 404 })
  }

  let qids: string[] = []
  for (const s of test.sections) {
    const f = s.filters as any

    // YENİ FİLTRELEME MANTIĞI:
    // Artık level, type VE tags filtrelerini anlıyor
    const qs = await prisma.question.findMany({ 
        where: { 
          ...(f?.type ? { type: f.type } : {}), 
          ...(f?.level ? { level: f.level } : {}),
          // YENİ EKLENEN SATIR:
          ...(f?.tags ? { tags: { some: { tag: { name: { in: f.tags } } } } } : {})
        }, 
        include: { choices: true }, 
        take: s.count * 3 
      })

    shuffle(qs); qids.push(...qs.slice(0, s.count).map(q => q.id))
  }

  const attempt = await prisma.attempt.create({ data: { test: { connect: { id: test.id } }, answers: { create: qids.map(qid => ({ questionId: qid })) } } })
  const questions = await prisma.question.findMany({ where: { id: { in: qids } }, include: { choices: true } })
  const payload = questions.map(q => ({ ...q, choices: shuffle(q.choices) }))

  return NextResponse.json({ attemptId: attempt.id, test: { title: test.title, duration: test.duration }, questions: payload })
}