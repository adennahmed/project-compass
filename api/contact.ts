import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const STUDIO_EMAIL = "hello@kozai.ca";

// ─── Email HTML builders ──────────────────────────────────────────────────

/* ─── Shared style tokens ────────────────────────────────────────────── */
const FONT  = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const MONO  = "ui-monospace,'SF Mono',Menlo,Monaco,Consolas,monospace";
const PAPER = "#F5F2EC";
const INK   = "#0E0E10";
const MUTE  = "#6B6B70";
const HAIR  = "rgba(26,26,28,0.12)";
const SIG   = "#E84F1B";

const wordmark = (color: string) => `
  <span style="font-family:${FONT};font-weight:700;font-size:20px;letter-spacing:-0.04em;color:${color}">
    KOZAI
  </span>`;

const labelTag = (text: string, color = MUTE) => `
  <span style="font-family:${MONO};font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${color}">
    ${text}
  </span>`;

function adminEmail(f: Record<string, string>): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:14px 0;border-bottom:1px solid ${HAIR};font-family:${MONO};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${MUTE};width:130px;vertical-align:top">${label}</td>
          <td style="padding:14px 0;border-bottom:1px solid ${HAIR};font-family:${FONT};font-size:14px;line-height:1.55;color:${INK};vertical-align:top">${value}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT};color:${INK}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:56px 24px">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="width:100%;max-width:560px">

        <!-- Top bar: wordmark + label -->
        <tr><td style="padding-bottom:20px;border-bottom:1px solid ${HAIR}">
          <table width="100%"><tr>
            <td>${wordmark(INK)}</td>
            <td align="right">${labelTag("New inquiry")}</td>
          </tr></table>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:48px 0 8px">
          <div style="margin-bottom:14px">${labelTag(f.role, SIG)}</div>
          <h1 style="margin:0;font-family:${FONT};font-size:34px;font-weight:600;letter-spacing:-0.04em;line-height:1.05;color:${INK}">
            ${f.firstName} ${f.lastName}
          </h1>
          <p style="margin:14px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${MUTE}">
            ${f.businessName || "—"}${f.businessType ? ` · ${f.businessType}` : ""}
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:36px 0 0"><div style="height:1px;background:${HAIR}"></div></td></tr>

        <!-- Details -->
        <tr><td style="padding:24px 0 12px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row("Email",         f.email)}
            ${row("Phone",         f.phone)}
            ${row("Business",      f.businessName)}
            ${row("Business type", f.businessType)}
            ${row("Message",       (f.message || "—").replace(/\n/g, "<br>"))}
          </table>
        </td></tr>

        <!-- Reply CTA -->
        <tr><td style="padding:32px 0 0">
          <a href="mailto:${f.email}"
             style="display:inline-block;background:${INK};color:${PAPER};text-decoration:none;padding:15px 28px;font-family:${FONT};font-size:13px;font-weight:500;letter-spacing:0.01em">
            Reply to ${f.firstName} &nbsp;↘
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:64px 0 0">
          <div style="border-top:1px solid ${HAIR};padding-top:20px">
            ${labelTag(`© ${new Date().getFullYear()} Kozai Software Studio · Toronto, CA`)}
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function confirmationEmail(f: Record<string, string>): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:14px 0;border-bottom:1px solid ${HAIR};font-family:${MONO};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${MUTE};width:120px;vertical-align:top">${label}</td>
          <td style="padding:14px 0;border-bottom:1px solid ${HAIR};font-family:${FONT};font-size:14px;line-height:1.55;color:${INK};vertical-align:top">${value}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT};color:${INK}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:56px 24px">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="width:100%;max-width:560px">

        <!-- Top bar -->
        <tr><td style="padding-bottom:20px;border-bottom:1px solid ${HAIR}">
          <table width="100%"><tr>
            <td>${wordmark(INK)}</td>
            <td align="right">${labelTag("Inquiry received")}</td>
          </tr></table>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:56px 0 0">
          <h1 style="margin:0;font-family:${FONT};font-size:38px;font-weight:600;letter-spacing:-0.04em;line-height:1.02;color:${INK}">
            Hello,<br>${f.firstName}.
          </h1>
        </td></tr>

        <!-- Body copy -->
        <tr><td style="padding:24px 0 0">
          <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.6;color:${INK};opacity:0.7;max-width:46ch">
            We received your inquiry. Our team reviews every submission personally — you'll hear back from us within <span style="color:${INK};opacity:1">48 hours</span>, typically sooner.
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:48px 0 0"><div style="height:1px;background:${HAIR}"></div></td></tr>

        <!-- Submission summary -->
        <tr><td style="padding:32px 0 8px">
          <div style="margin-bottom:8px">${labelTag("Your submission")}</div>
        </td></tr>
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row("Role",     f.role)}
            ${row("Name",     `${f.firstName} ${f.lastName}`)}
            ${row("Business", f.businessName)}
            ${row("Type",     f.businessType)}
            ${f.message ? row("Message", f.message.replace(/\n/g, "<br>")) : ""}
          </table>
        </td></tr>

        <!-- What's next -->
        <tr><td style="padding:48px 0 0">
          <div style="margin-bottom:14px">${labelTag("What happens next")}</div>
          <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.7;color:${INK};opacity:0.7">
            A member of our team will review your submission and reach out directly to <span style="color:${INK};opacity:1">${f.email}</span>. If anything is urgent, you can always reach us at <a href="mailto:hello@kozai.ca" style="color:${INK};text-decoration:underline;text-underline-offset:3px;opacity:1">hello@kozai.ca</a>.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:64px 0 0">
          <div style="border-top:1px solid ${HAIR};padding-top:20px">
            <table width="100%"><tr>
              <td>${labelTag(`© ${new Date().getFullYear()} Kozai Software Studio · Toronto, CA`)}</td>
              <td align="right"><a href="https://kozai.ca" style="font-family:${MONO};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${MUTE};text-decoration:none">kozai.ca&nbsp;↗</a></td>
            </tr></table>
          </div>
        </td></tr>

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
    // Send notification to Kozai. Sending FROM hello@ TO hello@ on the same
    // domain often gets dropped as a self-send loop by the receiving server,
    // so we use the inquiries@ alias as the sender. (Resend allows any address
    // on a verified domain.)
    const adminRes = await resend.emails.send({
      from: `Kozai Inquiries <inquiries@kozai.ca>`,
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
