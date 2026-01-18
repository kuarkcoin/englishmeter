import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthed(req: Request) {
  const key = req.headers.get("x-admin-key");
  return !!key && key === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";

  const items = await prisma.contactMessage.findMany({
    where: status === "all" ? {} : { status },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");
  const status = String(body?.status ?? "");

  if (!id || !["new", "read", "replied", "spam"].includes(status)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const updated = await prisma.contactMessage.update({ where: { id }, data: { status } });
  return NextResponse.json({ item: updated });
}

export async function DELETE(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}