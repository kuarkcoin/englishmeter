// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        name: name,
        email: email,
        message: message,
      },
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Error saving contact message:', error);
    // HATA DÜZELTİLDİ: "status 500" yerine "status: 500"
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}