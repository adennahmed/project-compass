import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const STUDIO_EMAIL = "hello@kozai.ca";

// ─── Email HTML builders ──────────────────────────────────────────────────

function adminEmail(f: Record<string, string>): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #e9e5db;font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b70;width:140px;vertical-align:top">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e9e5db;font-size:14px;color:#0e0e10;vertical-align:top">${value}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f2ec;font-family:'Geist',system-ui,sans-serif;color:#0e0e10">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ec;padding:48px 24px">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto">

        <!-- Header -->
        <tr>
          <td style="border-bottom:1px solid rgba(26,26,28,0.12);padding-bottom:24px;margin-bottom:32px">
            <span style="font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#6b6b70">
              Kozai · New inquiry
            </span>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:32px 0 8px">
            <h1 style="margin:0;font-size:28px;font-weight:600;letter-spacing:-0.035em;line-height:1.1;color:#0e0e10">
              New inquiry from ${f.firstName} ${f.lastName}
            </h1>
            <p style="margin:8px 0 0;font-family:'Geist Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#e84f1b">
              ${f.role}
            </p>
          </td>
        </tr>

        <!-- Details table -->
        <tr>
          <td style="padding:24px 0">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Name",          `${f.firstName} ${f.lastName}`)}
              ${row("Email",         f.email)}
              ${row("Phone",         f.phone)}
              ${row("Business",      f.businessName)}
              ${row("Business type", f.businessType)}
              ${row("Message",       f.message || "—")}
            </table>
          </td>
        </tr>

        <!-- Reply CTA -->
        <tr>
          <td style="padding-top:16px">
            <a href="mailto:${f.email}"
               style="display:inline-block;background:#0e0e10;color:#f5f2ec;text-decoration:none;padding:14px 28px;font-size:13px;font-weight:500;letter-spacing:0.02em">
              Reply to ${f.firstName} ↘
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:48px;border-top:1px solid rgba(26,26,28,0.12);margin-top:48px">
            <span style="font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b70">
              © ${new Date().getFullYear()} Kozai Software Studio
            </span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function confirmationEmail(f: Record<string, string>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f2ec;font-family:'Geist',system-ui,sans-serif;color:#0e0e10">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ec;padding:48px 24px">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto">

        <!-- Header -->
        <tr>
          <td style="border-bottom:1px solid rgba(26,26,28,0.12);padding-bottom:24px">
            <span style="font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#6b6b70">
              Kozai · Inquiry received
            </span>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:36px 0 0">
            <h1 style="margin:0 0 16px;font-size:30px;font-weight:600;letter-spacing:-0.035em;line-height:1.1;color:#0e0e10">
              We received your inquiry, ${f.firstName}.
            </h1>
            <p style="margin:0;font-size:15px;line-height:1.65;color:rgba(14,14,16,0.65)">
              Our team reviews every submission personally. You'll hear back from us within
              <strong style="color:#0e0e10">48 hours</strong>, typically sooner.
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:32px 0"><div style="height:1px;background:rgba(26,26,28,0.12)"></div></td></tr>

        <!-- Summary -->
        <tr>
          <td>
            <p style="margin:0 0 16px;font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#6b6b70">
              Your submission
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e9e5db;font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b70;width:130px">Role</td>
                <td style="padding:10px 0;border-bottom:1px solid #e9e5db;font-size:13px;color:#0e0e10">${f.role}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e9e5db;font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b70">Business</td>
                <td style="padding:10px 0;border-bottom:1px solid #e9e5db;font-size:13px;color:#0e0e10">${f.businessName}</td>
              </tr>
              ${f.message ? `<tr>
                <td style="padding:10px 0;font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b70;vertical-align:top">Message</td>
                <td style="padding:10px 0;font-size:13px;color:#0e0e10;line-height:1.6">${f.message}</td>
              </tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:32px 0"><div style="height:1px;background:rgba(26,26,28,0.12)"></div></td></tr>

        <!-- What's next -->
        <tr>
          <td>
            <p style="margin:0 0 16px;font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#6b6b70">
              What happens next
            </p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(14,14,16,0.65)">
              A member of our team will review your submission and reach out directly to
              <strong style="color:#0e0e10">${f.email}</strong>. If anything is urgent,
              you can always reach us at
              <a href="mailto:hello@kozai.ca" style="color:#0e0e10;text-decoration:underline;text-underline-offset:3px">hello@kozai.ca</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:48px;border-top:1px solid rgba(26,26,28,0.12);margin-top:48px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b70">
                    © ${new Date().getFullYear()} Kozai Software Studio · Toronto, CA
                  </span>
                </td>
                <td align="right">
                  <a href="https://kozai.ca" style="font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b70;text-decoration:none">
                    kozai.ca
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────
// Vercel Node.js runtime: req.body is auto-parsed when Content-Type is JSON.
// Using a loose type signature so we don't need @vercel/node as a dep.

interface VercelReq {
  method?: string;
  body?: Record<string, string> | string;
  headers?: Record<string, string | string[] | undefined>;
}
interface VercelRes {
  status: (code: number) => VercelRes;
  json: (body: unknown) => VercelRes;
  send: (body: unknown) => VercelRes;
  setHeader: (key: string, value: string) => VercelRes;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  // Body comes in pre-parsed on Node runtime; fall back to JSON.parse if it's a string.
  let body: Record<string, string> = {};
  try {
    if (typeof req.body === "string") body = JSON.parse(req.body);
    else if (req.body && typeof req.body === "object") body = req.body as Record<string, string>;
  } catch (err) {
    console.error("[contact] body parse failed:", err);
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { firstName, lastName, email } = body;

  if (!firstName || !lastName || !email) {
    console.error("[contact] missing required fields", { firstName, lastName, email });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Send notification to Kozai
    const adminRes = await resend.emails.send({
      from: `Kozai Inquiries <hello@kozai.ca>`,
      to: STUDIO_EMAIL,
      replyTo: email,
      subject: `New inquiry · ${firstName} ${lastName} (${body.role ?? "—"}) · ${body.businessName ?? ""}`,
      html: adminEmail(body),
    });
    if (adminRes.error) {
      console.error("[contact] admin send error:", adminRes.error);
      return res.status(500).json({ error: "Failed to send admin email", detail: adminRes.error });
    }

    // Send confirmation to the submitter
    const confirmRes = await resend.emails.send({
      from: `Kozai <hello@kozai.ca>`,
      to: email,
      subject: `We received your inquiry — Kozai`,
      html: confirmationEmail(body),
    });
    if (confirmRes.error) {
      console.error("[contact] confirmation send error:", confirmRes.error);
      // Admin email already sent; still treat overall as success but log it.
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] Resend exception:", err);
    return res.status(500).json({ error: "Failed to send email", detail: String(err) });
  }
}
