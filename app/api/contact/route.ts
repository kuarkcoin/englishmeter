import { NextResponse } from "next/server";
import { Resend } from "resend";
import { archiveContactMessage } from "@/lib/contact-archive";

export const runtime = "nodejs";

const recipient = "muratot79@gmail.com";
const unavailable = `Message delivery is currently unavailable. Please email ${recipient} directly.`;

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Please send a valid contact form." }, { status: 400 });
  }

  const fields = body as Record<string, unknown>;
  if (fields.website !== undefined && fields.website !== "") {
    return NextResponse.json({ error: "Unable to submit this form." }, { status: 400 });
  }
  if (![fields.name, fields.email, fields.message].every((value) => typeof value === "string")) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  const name = (fields.name as string).trim();
  const email = (fields.email as string).trim().toLowerCase();
  const message = (fields.message as string).trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return NextResponse.json({ error: "Please shorten your name or message." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(name)) {
    return NextResponse.json({ error: "Please enter a valid name and email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ error: unavailable }, { status: 503 });
  }

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to: recipient,
      replyTo: email,
      subject: "EnglishMeter contact message",
      // Plain text keeps submitted HTML inert in the email.
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error || !data?.id) {
      console.error("Contact email was not accepted by the provider.");
      return NextResponse.json({ error: unavailable }, { status: 502 });
    }
  } catch {
    console.error("Contact email request failed.");
    return NextResponse.json({ error: unavailable }, { status: 502 });
  }

  // Keep the admin inbox when configured, but a database outage must not prevent email.
  if (process.env.DATABASE_URL) {
    const archived = await archiveContactMessage({ name, email, message });
    if (!archived) {
      console.error("Contact email accepted, but the admin inbox copy could not be saved.");
    }
  }

  // Provider acceptance is not a guarantee of delivery to the recipient's inbox.
  return NextResponse.json({ ok: true });
}
