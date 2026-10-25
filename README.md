# EnglishMeter Starter
Ready-to-run Next.js 14 + Prisma + Tailwind project for a CEFR English test (A1→C2).

## Quick Start
1. Install deps
```
npm install
```
2. Create `.env` from `.env.example` and set `DATABASE_URL` (Supabase/Postgres).
3. Generate Prisma client & create tables
```
npx prisma migrate dev
```
4. Seed questions/tests
```
npx ts-node scripts/seed.ts
```
5. Run
```
npm run dev
```
Open http://localhost:3000

© 2025 EnglishMeter

## Contact email configuration

The contact form sends messages to `muratot79@gmail.com` through Resend. The visitor's
email is used as Reply-To so replying in Gmail reaches the visitor. The sender must
be an address on a domain verified in Resend.

1. Verify a sending domain in Resend and create a sending API key.
2. In your production hosting project's environment settings, securely set
   `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (for example,
   `EnglishMeter <contact@your-verified-domain.com>`). Do not commit real values.
3. Redeploy after changing these variables. Codex cloud environment settings do
   not configure the production host.
4. Submit a test message through `/contact`, then check the Resend delivery status
   and the recipient's inbox/spam folder. A successful form response means Resend
   accepted the email; it does not guarantee final inbox delivery.

`DATABASE_URL` is optional for email delivery. If supplied, the app also attempts
to archive the message in the existing Prisma `ContactMessage` table for `/admin`.
Configure a valid Postgres URL and generate the Prisma client after schema changes
(`npx prisma generate`). Existing tables/data must be preserved; no database
migration is included in this change. An archive failure is logged but does not
change an accepted email into a failed submission. The response waits at most two
seconds for archiving; a timed-out copy is not guaranteed to be saved. Without a database, messages
arrive by email only and will not appear in the admin inbox.

Missing email settings return HTTP 503; a provider rejection returns HTTP 502.
The form retains the message and offers a direct email link on failure. The
honeypot and field limits are basic spam controls; configure shared rate limiting
or a challenge at the hosting edge before sustained public traffic.

Run the contact tests with `npx tsx --test tests/contact.test.ts`. Provider requests
are intercepted locally; this suite does not send real email. Full live delivery
verification requires the production credentials and verified sender above.

### If the contact form says delivery is unavailable

Open `/api/contact` on the **same deployment** that showed the error. This GET
request never sends email and returns only configuration presence, missing variable
names and the Vercel environment (`preview`, `production`, or `unknown`). It is
not cached. `configured: true` confirms values are present, not that the key or
sender is authorized by Resend.

If `missing` contains `RESEND_API_KEY` or `CONTACT_FROM_EMAIL`, add those variables
to that Vercel environment and redeploy. Variables configured only for Production
are not available to Preview deployments. Copy values without surrounding quotes;
leading/trailing whitespace is trimmed by the application.

If the settings are present but sending fails, inspect the failed POST request in
Vercel's runtime logs. Search for `contact_email_error`. Logs contain a fixed code
and deployment scope, never the API key, sender value or message contents:

| Code | Action |
| --- | --- |
| `CONTACT_NOT_CONFIGURED` | Set the missing variables in the reported environment and redeploy. |
| `CONTACT_AUTH_FAILED` | Check the Resend API key is active and permitted to send from the intended domain. |
| `CONTACT_INVALID_SENDER` | Use a valid sender address on your verified domain in `CONTACT_FROM_EMAIL`. |
| `CONTACT_SENDER_NOT_VERIFIED` | Finish verifying the sender domain in the Resend account that owns the key. |
| `CONTACT_TESTING_RESTRICTION` | Use a verified domain sender; Resend's testing sender restricts recipients. |
| `CONTACT_PROVIDER_LIMIT` | Check the Resend rate limit/quota before retrying. |
| `CONTACT_PROVIDER_VALIDATION` | Review the Resend account's sending configuration. |
| `CONTACT_PROVIDER_UNAVAILABLE` | Check Resend service availability and outbound connectivity. |

Never paste API keys into chat or commit them to the repository. Cloud environment
bindings and Vercel environment variables are separate settings.
