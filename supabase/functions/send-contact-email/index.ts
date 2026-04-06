import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const NOTIFY_EMAIL = "adenah04@outlook.com";

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

    // Helper to call send-transactional-email via HTTP
    const sendEmail = async (templateName: string, recipientEmail: string, idempotencyKey: string, templateData: Record<string, unknown>) => {
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "";
      const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": anonKey,
        },
        body: JSON.stringify({ templateName, recipientEmail, idempotencyKey, templateData }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`send-transactional-email [${res.status}]: ${text}`);
      }
      return res.json();
    };

    // Send confirmation email to the person who submitted
    try {
      await sendEmail("inquiry-confirmation", email, `inquiry-confirm-${submissionId}`, { firstName });
    } catch (emailErr) {
      console.error("Confirmation email error:", emailErr);
    }

    // Send notification email to admin
    try {
      await sendEmail("inquiry-notification", NOTIFY_EMAIL, `inquiry-notify-${submissionId}`, {
        firstName, lastName, email, phone, businessName, businessType, role: role || null, message,
      });
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
