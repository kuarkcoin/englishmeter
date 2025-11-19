import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function Result({ searchParams }:{ searchParams:{ id?: string } }){

  if (!searchParams.id) {
    return <div className="card text-red-600">Attempt ID not found.</div>
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id: searchParams.id },
    include: {
      answers: {
        orderBy: { questionId: 'asc' },
        include: {
          question: {
            include: {
              choices: true
            }
          }
        }
      }
    }
  })

  if (!attempt) {
    return <div className="card text-red-600">Attempt results not found.</div>
  }

  const score = attempt.score
  const level = attempt.levelGuess

  return <div className="grid lg:grid-cols-3 gap-6">

    <div className="lg:col-span-1 space-y-6">
      <div className="card">
        <div className="text-sm text-slate-500">Your Score</div>
        <div className="text-4xl font-extrabold">{score}<span className="text-slate-400 text-2xl">/100</span></div>
        <div className="text-sm text-slate-500 mt-4">Estimated CEFR</div>
        <div className="text-3xl font-extrabold text-brand">{level}</div>
      </div>
      <div className="card">
        <div className="text-sm text-slate-500 mb-2">Retake</div>
        <Link className="btn" href="/start">Start Again</Link>
      </div>
    </div>

    <div className="lg:col-span-2 card space-y-6">
      <h2 className="text-2xl font-bold">Detailed Report</h2>

      {attempt.answers.map((answer, idx) => {
        const question = answer.question;
        const userAnswerChoiceId = answer.choiceId;

        return (
          <div key={answer.id} className="border-b border-slate-200 pb-4">
            <div className="text-sm text-slate-500 mb-2">Question {idx + 1}</div>
            <div className="text-lg font-semibold mb-4" dangerouslySetInnerHTML={{ __html: question.prompt }} />

            <div className="grid gap-2">
              {question.choices.map((choice) => {
                let styles = 'border-slate-200';

                if (choice.isCorrect) {
                  styles = 'border-green-500 ring-2 ring-green-500/10 bg-green-50';
                } 
                else if (choice.id === userAnswerChoiceId) {
                  styles = 'border-red-500 ring-2 ring-red-500/10 bg-red-50';
                }

                return (
                  <label key={choice.id} className={`cursor-not-allowed rounded-xl border p-3 ${styles}`}>
                    <input type="radio" name={question.id} className="mr-2" checked={choice.id === userAnswerChoiceId} disabled />
                    {choice.text}
                  </label>
                )
              })}
            </div>

            {!answer.correct && question.explanation && (
              <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
                <span className="font-bold">Explanation:</span> {question.explanation}
              </div>
            )}
          </div>
        )
      })}
    </div>
  </div>
}