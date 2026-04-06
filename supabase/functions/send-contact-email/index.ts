import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { z } from "https://esm.sh/zod@3.23.8";
import * as React from "https://esm.sh/react@18.3.1";
import { renderToStaticMarkup } from "https://esm.sh/react-dom@18.3.1/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const NOTIFY_EMAIL = "adenah04@outlook.com";
const SITE_NAME = "KOZAI";
const SENDER_DOMAIN = "notify.kozai.ca";
const FROM_DOMAIN = "kozai.ca";

const ContactSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  businessName: z.string().trim().max(200).optional().default(""),
  businessType: z.string().trim().max(200).optional().default(""),
  role: z.enum(["FOUNDER", "EXECUTIVE", "PARTNER", "OTHER"]).nullable().optional(),
  message: z.string().trim().max(2000).optional().default(""),
});

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildConfirmationHtml(firstName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#080808;">
    <div style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <table width="100%"><tr>
        <td><span style="font-size:16px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;">KOZAI</span></td>
        <td align="right"><span style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.3);">INQUIRY CONFIRMATION</span></td>
      </tr></table>
    </div>
    <div style="height:2px;background:linear-gradient(90deg,#C8A96E 0%,rgba(200,169,110,0.2) 100%);"></div>
    <div style="padding:48px 40px 40px;">
      <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C8A96E;margin:0 0 24px;">THANK YOU</p>
      <h1 style="font-size:28px;font-weight:700;color:#ffffff;margin:0 0 8px;text-transform:uppercase;line-height:1.15;">${firstName},</h1>
      <h2 style="font-size:28px;font-weight:300;color:rgba(255,255,255,0.7);margin:0 0 32px;text-transform:uppercase;line-height:1.15;">We've received your inquiry.</h2>
      <div style="width:60px;height:1px;background:rgba(255,255,255,0.12);margin:0 0 32px;"></div>
      <p style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;margin:0 0 24px;">A member of our team will be reviewing your submission and will be in touch. We appreciate your interest in working with Kozai.</p>
      <p style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;margin:0 0 40px;">In the meantime, feel free to reply directly to this email if you have any additional details to share.</p>
      <div style="display:inline-block;border:1px solid rgba(200,169,110,0.3);padding:12px 28px;">
        <a href="https://kozai.lovable.app" style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C8A96E;text-decoration:none;">Visit Kozai →</a>
      </div>
    </div>
    <div style="padding:24px 40px 32px;border-top:1px solid rgba(255,255,255,0.07);">
      <table width="100%"><tr>
        <td><span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.2);">© 2026 KOZAI</span></td>
        <td align="right"><span style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.15);">STRATEGY · SYSTEMS · SCALE</span></td>
      </tr></table>
    </div>
  </div>
</body>
</html>`;
}

function buildNotificationHtml(data: {
  firstName: string; lastName: string; email: string;
  phone: string; businessName: string; businessType: string;
  role: string | null; message: string;
}) {
  const field = (label: string, value: string | null) =>
    value ? `<tr>
      <td style="padding:10px 16px 10px 0;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.12em;vertical-align:top;white-space:nowrap;border-bottom:1px solid rgba(255,255,255,0.04);">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:rgba(255,255,255,0.8);border-bottom:1px solid rgba(255,255,255,0.04);">${value}</td>
    </tr>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#080808;">
    <div style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <table width="100%"><tr>
        <td><span style="font-size:16px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;">KOZAI</span></td>
        <td align="right"><span style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#C8A96E;">NEW INQUIRY</span></td>
      </tr></table>
    </div>
    <div style="height:2px;background:linear-gradient(90deg,#C8A96E 0%,rgba(200,169,110,0.2) 100%);"></div>
    <div style="padding:48px 40px 40px;">
      <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 6px;text-transform:uppercase;line-height:1.15;">${data.firstName} ${data.lastName}</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.4);margin:0 0 32px;">submitted an inquiry through the website</p>
      <div style="width:60px;height:1px;background:rgba(200,169,110,0.3);margin:0 0 28px;"></div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        ${field("Name", `${data.firstName} ${data.lastName}`)}
        ${field("Email", data.email)}
        ${field("Phone", data.phone)}
        ${field("Role", data.role)}
        ${field("Business", data.businessName)}
        ${field("Type", data.businessType)}
      </table>
      ${data.message ? `<div style="margin-bottom:32px;">
        <p style="font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.12em;margin:0 0 12px;">Message</p>
        <div style="padding:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:4px;">
          <p style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8;margin:0;">${data.message}</p>
        </div>
      </div>` : ""}
      <div style="display:inline-block;border:1px solid rgba(200,169,110,0.3);padding:12px 28px;">
        <a href="mailto:${data.email}" style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C8A96E;text-decoration:none;">Reply to ${data.firstName} →</a>
      </div>
    </div>
    <div style="padding:24px 40px 32px;border-top:1px solid rgba(255,255,255,0.07);">
      <table width="100%"><tr>
        <td><span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.2);">© 2026 KOZAI</span></td>
        <td align="right"><span style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.15);">INQUIRY SYSTEM</span></td>
      </tr></table>
    </div>
  </div>
</body>
</html>`;
}

async function enqueueEmail(
  supabase: ReturnType<typeof createClient>,
  to: string,
  subject: string,
  html: string,
  plainText: string,
  templateName: string,
  idempotencyKey: string,
) {
  const messageId = crypto.randomUUID();
  const normalizedEmail = to.toLowerCase();

  // Get or create unsubscribe token
  let unsubscribeToken: string;
  const { data: existingToken } = await supabase
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token;
  } else if (!existingToken) {
    unsubscribeToken = generateToken();
    await supabase
      .from("email_unsubscribe_tokens")
      .upsert({ token: unsubscribeToken, email: normalizedEmail }, { onConflict: "email", ignoreDuplicates: true });
    // Re-read in case of race
    const { data: stored } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalizedEmail)
      .maybeSingle();
    unsubscribeToken = stored?.token || unsubscribeToken;
  } else {
    unsubscribeToken = generateToken(); // fallback
  }

  // Log pending
  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: to,
    status: "pending",
  });

  const { error } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text: plainText,
      purpose: "transactional",
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error("Failed to enqueue email", { error, templateName, to });
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: to,
      status: "failed",
      error_message: "Failed to enqueue email",
    });
    throw error;
  }

  console.log("Email enqueued", { templateName, to });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input.", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { firstName, lastName, email, phone, businessName, businessType, role, message } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database
    const submissionId = crypto.randomUUID();
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      id: submissionId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      business_name: businessName || null,
      business_type: businessType || null,
      role: role || null,
      message: message || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save submission." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send confirmation email to the person who submitted
    try {
      await enqueueEmail(
        supabase,
        email,
        "We've received your inquiry — Kozai",
        buildConfirmationHtml(firstName),
        `Thank you ${firstName}, we've received your inquiry. A member of our team will be in touch soon. — Kozai`,
        "inquiry-confirmation",
        `inquiry-confirm-${submissionId}`,
      );
    } catch (emailErr) {
      console.error("Confirmation email error:", emailErr);
    }

    // Send notification email to admin
    try {
      await enqueueEmail(
        supabase,
        NOTIFY_EMAIL,
        `New Inquiry from ${firstName} ${lastName}`,
        buildNotificationHtml({ firstName, lastName, email, phone, businessName, businessType, role: role || null, message }),
        `New inquiry from ${firstName} ${lastName} (${email}). Phone: ${phone || "N/A"}. Business: ${businessName || "N/A"}. Message: ${message || "N/A"}`,
        "inquiry-notification",
        `inquiry-notify-${submissionId}`,
      );
    } catch (emailErr) {
      console.error("Notification email error:", emailErr);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Inquiry submitted successfully." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
