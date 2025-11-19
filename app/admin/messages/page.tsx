// app/admin/messages/page.tsx
import { prisma } from '@/lib/prisma'

async function deleteMessageAction(formData: FormData) {
  'use server'

  const id = String(formData.get('id') ?? '').trim()
  if (!id) return

  await prisma.contactMessage.delete({
    where: { id },
  })
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <a
            href="/admin"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Admin
          </a>
        </div>

        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">Henüz hiç mesaj yok.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
                  <span>{m.id}</span>
                  <span>
                    {new Date(m.createdAt)
                      .toISOString()
                      .slice(0, 16)
                      .replace('T', ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-sm">{m.name}</div>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {m.email}
                    </a>
                  </div>

                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="text-xs rounded-md border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>

                <p className="text-sm text-slate-800 whitespace-pre-line">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
