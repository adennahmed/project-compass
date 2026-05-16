// ════════════════════════════════════════════════════════════════════════
// Edge Function: delete-account
// ════════════════════════════════════════════════════════════════════════
// Hard-deletes the calling user from auth.users. The cascade defined on
// public.profiles (and downstream tables) cleans up every row associated
// with that user.
//
// Why this needs to be a server-side function: deleting from auth.users
// requires the SERVICE_ROLE key. The browser only carries the anon key.
// This function uses both:
//   • Verifies the caller's identity with their bearer token (anon key
//     can validate user sessions but not modify auth tables).
//   • Then uses the service role to actually issue the deleteUser call.
//
// Deploy:
//   supabase functions deploy delete-account
//
// Invoke from the client:
//   await supabase.functions.invoke('delete-account')
// ════════════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE) {
      console.error("[delete-account] missing env vars");
      return new Response(
        JSON.stringify({ error: "Service not configured" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    // 1. Authenticate the caller via the bearer token they sent.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const userId = userData.user.id;

    // 2. Use the service role to hard-delete from auth.users. The cascade
    //    on public.profiles cleans up the rest.
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: deleteErr } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteErr) {
      console.error("[delete-account] admin.deleteUser failed:", deleteErr);
      return new Response(
        JSON.stringify({ error: deleteErr.message }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[delete-account] unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
