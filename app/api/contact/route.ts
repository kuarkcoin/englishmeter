import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend("re_YACiupUF_Fom8wPFexcUzV9jAQup66sb9");

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "EnglishMeter Contact <onboarding@resend.dev>",
      to: "muratot79@gmail.com",
      subject: "📩 New Contact Form Message – EnglishMeter",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <br>
          <hr>
          <p style="font-size: 12px; color: #666;">Sent via EnglishMeter Contact Form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}