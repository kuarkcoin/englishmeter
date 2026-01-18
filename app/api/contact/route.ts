import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // mini email kontrolü (istersen zod ekleriz)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact POST:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}