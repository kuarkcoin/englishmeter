import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function cefr(score:number){ if(score<=20) return 'A1'; if(score<=35) return 'A2'; if(score<=55) return 'B1'; if(score<=75) return 'B2'; if(score<=88) return 'C1'; return 'C2' }

export async function POST(req: NextRequest, { params }:{ params:{ id:string } }) {
  const { answers } = await req.json() as { answers: Record<string,string> }
  const attempt = await prisma.attempt.findUnique({ where: { id: params.id }, include: { answers: true } })
  if (!attempt) return NextResponse.json({ error:'Attempt not found' }, { status:404 })

  let correctCount=0, total=attempt.answers.length
  for(const a of attempt.answers){
    const choiceId = answers[a.questionId]; if(!choiceId) continue
    const choice = await prisma.choice.findUnique({ where:{ id: choiceId } })

    const isCorrect = !!choice?.isCorrect; if(isCorrect) correctCount++

    await prisma.answer.update({ where:{ id:a.id }, data:{ choiceId, correct:isCorrect } })
  }

  const score = Math.round((correctCount/total)*100); 
  const level = cefr(score)

  await prisma.attempt.update({ where:{ id:attempt.id }, data:{ score, levelGuess: level as any, status:'SUBMITTED', submittedAt: new Date() } })

  // ÖNEMLİ: Artık sadece ID'yi döndürüyoruz
  return NextResponse.json({ attemptId: attempt.id })
}