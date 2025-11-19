// app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { CEFR, QuestionType } from '@prisma/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_COOKIE_NAME = 'englishmeter_admin'

// ------- SERVER ACTION: LOGIN -------
async function loginAction(formData: FormData) {
  'use server'

  const password = formData.get('password')
  const adminPass = process.env.ADMIN_PASSWORD

  if (!adminPass) {
    throw new Error('ADMIN_PASSWORD .env dosyasında tanımlı değil.')
  }

  if (password === adminPass) {
    cookies().set(ADMIN_COOKIE_NAME, '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 saat
    })
  }

  redirect('/admin')
}

// ------- SERVER ACTION: YENİ SORU OLUŞTUR -------
async function createQuestionAction(formData: FormData) {
  'use server'

  const prompt = String(formData.get('prompt') ?? '').trim()
  const explanation = String(formData.get('explanation') ?? '').trim()

  const level = (formData.get('level') ?? 'B1') as CEFR
  const type = (formData.get('type') ?? 'MCQ') as QuestionType

  const difficulty = Number(formData.get('difficulty') ?? 0.5)

  const choicesRaw = [
    { text: String(formData.get('choice1') ?? ''), idx: '1' },
    { text: String(formData.get('choice2') ?? ''), idx: '2' },
    { text: String(formData.get('choice3') ?? ''), idx: '3' },
    { text: String(formData.get('choice4') ?? ''), idx: '4' },
  ].filter((c) => c.text.trim().length > 0)

  const correctIdx = String(formData.get('correctChoice') ?? '1')

  if (!prompt || choicesRaw.length < 2) return

  await prisma.question.create({
    data: {
      type,
      level,
      prompt,
      explanation: explanation || null,
      difficulty: isNaN(difficulty) ? 0.5 : difficulty,
      mediaUrl: null,
      choices: {
        create: choicesRaw.map((c) => ({
          text: c.text.trim(),
          isCorrect: c.idx === correctIdx,
        })),
      },
    },
  })

  redirect('/admin')
}

// ------- SERVER ACTION: EXPLANATION GÜNCELLE -------
async function updateExplanationAction(formData: FormData) {
  'use server'

  const id = String(formData.get('questionId'))
  const explanation = String(formData.get('explanation') ?? '').trim()

  if (!id) return

  await prisma.question.update({
    where: { id: id },
    data: { explanation: explanation || null },
  })

  redirect('/admin')
}

// ------- ASIL ADMIN SAYFASI -------
export default async function AdminPage() {
  const isAuthed = cookies().get(ADMIN_COOKIE_NAME)?.value === '1'

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                className="w-full rounded-md border px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  // VERİLERİ ÇEKELİM (Paralel olarak)
  const [questions, messages] = await Promise.all([
    prisma.question.findMany({
      orderBy: { id: 'desc' }, // En son eklenen sorular
      take: 20,
      include: { choices: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }, // En yeni mesajlar
      take: 50, // Son 50 mesajı göster
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-10 space-y-12">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <div className="text-sm text-slate-500">
            Logged in as Admin
          </div>
        </div>

        {/* --- BÖLÜM 1: GELEN KUTUSU (MESSAGES) --- */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
            📩 Inbox <span className="text-sm font-normal text-slate-500">({messages.length} messages)</span>
          </h2>
          
          <div className="grid gap-4">
            {messages.length === 0 ? (
              <p className="text-slate-500 italic">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline text-sm">
                        {msg.email}
                      </a>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <hr className="border-slate-300" />

        {/* --- BÖLÜM 2: YENİ SORU EKLEME --- */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-purple-600">➕ Add New Question</h2>
          <form action={createQuestionAction} className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
             {/* (Form içeriği aynı kaldı) */}
             <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select name="level" defaultValue="B1" className="w-full rounded-md border px-3 py-2">
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select name="type" defaultValue="MCQ" className="w-full rounded-md border px-3 py-2">
                  <option value="MCQ">MCQ</option>
                  <option value="CLOZE">CLOZE</option>
                  <option value="READING">READING</option>
                  <option value="LISTENING">LISTENING</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <input type="number" step="0.1" min="0" max="1" name="difficulty" defaultValue={0.5} className="w-full rounded-md border px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prompt</label>
              <textarea name="prompt" rows={2} className="w-full rounded-md border px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Explanation</label>
              <textarea name="explanation" rows={2} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><input type="text" name="choice1" placeholder="Choice 1" className="w-full rounded-md border px-3 py-2" required /></div>
              <div><input type="text" name="choice2" placeholder="Choice 2" className="w-full rounded-md border px-3 py-2" required /></div>
              <div><input type="text" name="choice3" placeholder="Choice 3" className="w-full rounded-md border px-3 py-2" /></div>
              <div><input type="text" name="choice4" placeholder="Choice 4" className="w-full rounded-md border px-3 py-2" /></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correct Choice</label>
              <select name="correctChoice" defaultValue="1" className="w-full max-w-xs rounded-md border px-3 py-2">
                <option value="1">Choice 1</option>
                <option value="2">Choice 2</option>
                <option value="3">Choice 3</option>
                <option value="4">Choice 4</option>
              </select>
            </div>
            <button type="submit" className="rounded-md bg-purple-600 text-white px-6 py-2 font-semibold hover:bg-purple-700">
              Save Question
            </button>
          </form>
        </section>

        <hr className="border-slate-300" />

        {/* --- BÖLÜM 3: SON EKLENEN SORULAR --- */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-700">📝 Last 20 Questions</h2>
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-sm text-slate-500">
                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{q.id}</span>
                  <span className="font-bold text-slate-700">{q.level} · {q.type}</span>
                </div>
                <p className="font-medium mb-3 text-lg">{q.prompt}</p>
                <ul className="list-disc list-inside text-sm mb-3 space-y-1">
                  {q.choices.map((c) => (
                    <li key={c.id} className={c.isCorrect ? 'text-green-700 font-bold' : 'text-slate-600'}>
                      {c.text} {c.isCorrect ? '✅' : ''}
                    </li>
                  ))}
                </ul>
                <form action={updateExplanationAction} className="mt-2 bg-slate-50 p-3 rounded-lg">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Explanation</label>
                  <div className="flex gap-2">
                    <input type="hidden" name="questionId" value={q.id} />
                    <input
                      name="explanation"
                      defaultValue={q.explanation ?? ''}
                      className="flex-1 rounded border px-2 py-1 text-sm"
                    />
                    <button type="submit" className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}