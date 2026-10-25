import { NextResponse } from "next/server";
import { Resend } from "resend";
import { archiveContactMessage } from "@/lib/contact-archive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const recipient = "muratot79@gmail.com";
const unavailable = `Message delivery is currently unavailable. Please email ${recipient} directly.`;

function deploymentEnvironment() {
  const environment = process.env.VERCEL_ENV;
  return environment === "production" || environment === "preview" || environment === "development"
    ? environment
    : "unknown";
}

function emailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const missing = [!apiKey && "RESEND_API_KEY", !from && "CONTACT_FROM_EMAIL"].filter(Boolean) as string[];
  return { apiKey, from, missing };
}

// Read-only configuration check: never returns key/sender values or sends mail.
// This only confirms settings are present, not provider authorization or delivery.
export async function GET() {
  const { missing } = emailConfiguration();
  return NextResponse.json({
    configured: missing.length === 0,
    missing,
    environment: deploymentEnvironment(),
  }, {
    status: missing.length ? 503 : 200,
    headers: { "Cache-Control": "no-store" },
  });
}

function providerFailure(error: { name: string; message: string } | null) {
  switch (error?.name.toLowerCase()) {
    case "missing_api_key":
    case "invalid_api_key":
    case "restricted_api_key":
      return "CONTACT_AUTH_FAILED";
    case "invalid_from_address":
      return "CONTACT_INVALID_SENDER";
    case "validation_error":
      if (/domain.*not verified/i.test(error.message)) return "CONTACT_SENDER_NOT_VERIFIED";
      if (/only send testing emails/i.test(error.message)) return "CONTACT_TESTING_RESTRICTION";
      return "CONTACT_PROVIDER_VALIDATION";
    case "rate_limit_exceeded":
    case "daily_quota_exceeded":
    case "monthly_quota_exceeded":
      return "CONTACT_PROVIDER_LIMIT";
    default:
      return "CONTACT_PROVIDER_UNAVAILABLE";
  }
}

function deliveryFailure(code: string, status: number, missing?: string[]) {
  // Fixed codes and variable names only; raw provider errors can contain private data.
  console.error("contact_email_error", { code, environment: deploymentEnvironment(), ...(missing ? { missing } : {}) });
  return NextResponse.json({ error: unavailable, code }, { status });
}

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

  const { apiKey, from, missing } = emailConfiguration();
  if (missing.length) {
    return deliveryFailure("CONTACT_NOT_CONFIGURED", 503, missing);
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
      return deliveryFailure(providerFailure(error), 502);
    }
  } catch {
    return deliveryFailure("CONTACT_PROVIDER_UNAVAILABLE", 502);
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
