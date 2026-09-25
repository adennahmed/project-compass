import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = "hello@kozai.ca";
const INQUIRY_TYPES = new Set(["BUILD", "ROLE", "COLLAB", "SPEAKING", "OTHER"]);

const FONT = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const MONO = "ui-monospace,'SF Mono',Menlo,Monaco,Consolas,monospace";
const PAPER = "#F4F5F8";
const INK = "#080A0E";
const MUTE = "#6F7480";
const HAIR = "rgba(8,10,14,0.13)";
const SIGNAL = "#F4313A";

interface Inquiry {
  inquiryType: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  message: string;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char] ?? char);

const asText = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const label = (value: string, color = MUTE) =>
  `<span style="font-family:${MONO};font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:${color}">${value}</span>`;

const wordmark = () => `
  <span style="display:inline-block;font-family:${MONO};font-size:15px;font-weight:700;letter-spacing:.16em;color:${INK}">A/A</span>`;

const shell = (content: string, footer: string) => `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:${PAPER};color:${INK};font-family:${FONT}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:48px 20px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
        <tr><td style="padding-bottom:18px;border-bottom:1px solid ${HAIR}">
          <table role="presentation" width="100%"><tr><td>${wordmark()}</td><td align="right">${label("Portfolio channel")}</td></tr></table>
        </td></tr>
        ${content}
        <tr><td style="padding-top:60px">
          <div style="border-top:1px solid ${HAIR};padding-top:18px">${label(footer)}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const detailRow = (name: string, value: string) => value ? `
  <tr>
    <td style="width:130px;padding:15px 0;border-bottom:1px solid ${HAIR};vertical-align:top;font-family:${MONO};font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${MUTE}">${name}</td>
    <td style="padding:15px 0;border-bottom:1px solid ${HAIR};vertical-align:top;font-family:${FONT};font-size:14px;line-height:1.65;color:${INK}">${value}</td>
  </tr>` : "";

function ownerEmail(inquiry: Inquiry) {
  const firstName = escapeHtml(inquiry.firstName);
  const lastName = escapeHtml(inquiry.lastName);
  const email = escapeHtml(inquiry.email);
  const organization = escapeHtml(inquiry.organization);
  const message = escapeHtml(inquiry.message).replace(/\n/g, "<br>");

  return shell(`
    <tr><td style="padding:46px 0 12px">
      <div style="margin-bottom:14px">${label(`${escapeHtml(inquiry.inquiryType)} inquiry`, SIGNAL)}</div>
      <h1 style="margin:0;font-size:38px;line-height:1.02;letter-spacing:-.045em;font-weight:650">${firstName} ${lastName}</h1>
      <p style="margin:14px 0 0;font-size:15px;color:${MUTE}">${organization || "Independent inquiry"}</p>
    </td></tr>
    <tr><td style="padding-top:28px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Channel", escapeHtml(inquiry.inquiryType))}
        ${detailRow("Email", email)}
        ${detailRow("Organization", organization)}
        ${detailRow("Brief", message)}
      </table>
    </td></tr>
    <tr><td style="padding-top:32px">
      <a href="mailto:${email}" style="display:inline-block;background:${INK};color:${PAPER};padding:15px 26px;text-decoration:none;font-size:13px;font-weight:600">Reply to ${firstName} &nbsp;↗</a>
    </td></tr>`, `© ${new Date().getFullYear()} Aden Ahmed · Toronto, Canada`);
}

function receiptEmail(inquiry: Inquiry) {
  const firstName = escapeHtml(inquiry.firstName);
  const email = escapeHtml(inquiry.email);
  const organization = escapeHtml(inquiry.organization);
  const message = escapeHtml(inquiry.message).replace(/\n/g, "<br>");

  return shell(`
    <tr><td style="padding:52px 0 0">
      <div style="margin-bottom:16px">${label("Message delivered · 200 OK", SIGNAL)}</div>
      <h1 style="margin:0;font-size:40px;line-height:1.02;letter-spacing:-.045em;font-weight:650">Received,<br>${firstName}.</h1>
      <p style="max-width:48ch;margin:22px 0 0;font-size:16px;line-height:1.7;color:${MUTE}">
        Your note reached my portfolio inbox successfully. I read every inquiry and will reply directly to <span style="color:${INK}">${email}</span> after reviewing the details.
      </p>
    </td></tr>
    <tr><td style="padding-top:42px">
      <div style="margin-bottom:8px">${label("Transmission receipt")}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Channel", escapeHtml(inquiry.inquiryType))}
        ${detailRow("Organization", organization)}
        ${detailRow("Brief", message)}
      </table>
    </td></tr>
    <tr><td style="padding-top:34px">
      <p style="margin:0;font-family:${MONO};font-size:10px;line-height:1.7;letter-spacing:.12em;text-transform:uppercase;color:${MUTE}">Destination / hello@kozai.ca<br>Status / delivered</p>
    </td></tr>`, `© ${new Date().getFullYear()} Aden Ahmed · Portfolio inquiry receipt`);
}

interface VercelReq {
  method?: string;
  body?: unknown;
}

interface VercelRes {
  status: (code: number) => VercelRes;
  json: (body: unknown) => VercelRes;
  setHeader: (key: string, value: string) => VercelRes;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  let raw: Record<string, unknown>;
  try {
    raw = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as Record<string, unknown>);
    if (!raw || typeof raw !== "object") throw new Error("Invalid body");
  } catch {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // Quietly accept honeypot submissions so bots receive no useful signal.
  if (asText(raw.website, 200)) return res.status(200).json({ ok: true });

  const inquiry: Inquiry = {
    inquiryType: asText(raw.inquiryType, 20).toUpperCase(),
    firstName: asText(raw.firstName, 80),
    lastName: asText(raw.lastName, 80),
    email: asText(raw.email, 180).toLowerCase(),
    organization: asText(raw.organization, 160),
    message: asText(raw.message, 2000),
  };

  if (!INQUIRY_TYPES.has(inquiry.inquiryType)) inquiry.inquiryType = "OTHER";

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email);
  if (!inquiry.firstName || !inquiry.lastName || !emailValid || inquiry.message.length < 12 || raw.agreed !== true) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    const ownerResult = await resend.emails.send({
      from: "Aden Portfolio <inquiries@kozai.ca>",
      to: OWNER_EMAIL,
      replyTo: inquiry.email,
      subject: `Portfolio inquiry · ${inquiry.inquiryType} · ${inquiry.firstName} ${inquiry.lastName}`,
      html: ownerEmail(inquiry),
    });

    if (ownerResult.error) {
      console.error("[contact] owner send failed", ownerResult.error);
      return res.status(500).json({ error: "Failed to deliver message" });
    }

    const receiptResult = await resend.emails.send({
      from: "Aden Ahmed <hello@kozai.ca>",
      to: inquiry.email,
      subject: "Message received — Aden Ahmed",
      html: receiptEmail(inquiry),
    });

    if (receiptResult.error) console.error("[contact] receipt send failed", receiptResult.error);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[contact] resend exception", error);
    return res.status(500).json({ error: "Failed to deliver message" });
  }
}
