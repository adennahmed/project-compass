import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const NOTIFY_EMAIL = "adenah04@outlook.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

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

function buildConfirmationHtml(firstName: string) {
  return `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
    <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 24px; margin-bottom: 32px;">
      <h1 style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #1a1a1a; font-weight: 600; margin: 0;">Kozai</h1>
    </div>
    <h2 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 16px; line-height: 1.2;">
      Thank you, ${firstName}.
    </h2>
    <p style="font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 20px;">
      We've received your inquiry and a member of our team will be reviewing it shortly. We appreciate your interest in working with Kozai.
    </p>
    <p style="font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 32px;">
      We'll be in touch soon.
    </p>
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
      <p style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #999; margin: 0;">
        Kozai — Strategy. Systems. Scale.
      </p>
    </div>
  </div>`;
}

function buildNotificationHtml(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  role: string | null;
  message: string;
}) {
  const field = (label: string, value: string | null) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${value}</td></tr>` : "";

  return `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
    <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 24px; margin-bottom: 32px;">
      <h1 style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #1a1a1a; font-weight: 600; margin: 0;">Kozai — New Inquiry</h1>
    </div>
    <h2 style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0 0 24px; line-height: 1.2;">
      New inquiry from ${data.firstName} ${data.lastName}
    </h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      ${field("Name", `${data.firstName} ${data.lastName}`)}
      ${field("Email", data.email)}
      ${field("Phone", data.phone)}
      ${field("Role", data.role)}
      ${field("Business", data.businessName)}
      ${field("Type", data.businessType)}
    </table>
    ${data.message ? `
    <div style="margin-bottom:24px;">
      <p style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Message</p>
      <p style="font-size:14px;color:#1a1a1a;line-height:1.7;margin:0;padding:16px;background:#f9f8f6;border-radius:4px;">${data.message}</p>
    </div>` : ""}
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
      <p style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #999; margin: 0;">
        Kozai Inquiry System
      </p>
    </div>
  </div>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  const response = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: "Kozai <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      reply_to: NOTIFY_EMAIL,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Resend API failed [${response.status}]: ${JSON.stringify(result)}`);
  }
  return result;
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

    const { error: dbError } = await supabase.from("contact_submissions").insert({
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
      await sendEmail(
        email,
        "We've received your inquiry — Kozai",
        buildConfirmationHtml(firstName)
      );
    } catch (emailErr) {
      console.error("Confirmation email error:", emailErr);
    }

    // Send notification email to adenah04@outlook.com
    try {
      await sendEmail(
        NOTIFY_EMAIL,
        `New Inquiry from ${firstName} ${lastName}`,
        buildNotificationHtml({ firstName, lastName, email, phone, businessName, businessType, role: role || null, message })
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
