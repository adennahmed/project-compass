// ════════════════════════════════════════════════════════════════════════
// Edge Function: admin-delete-account
// ════════════════════════════════════════════════════════════════════════
// Hard-deletes an arbitrary user from auth.users when invoked by an admin.
//
// Flow:
//   1. Verify caller's bearer token resolves to an authenticated user.
//   2. Look up caller's profiles.role via service-role client. Must be admin.
//   3. Look up target's handle + email for the audit log.
//   4. Insert an audit_log row (action=admin_delete_user).
//   5. Call auth.admin.deleteUser(target_user_id) — cascade cleans the rest.
//
// Deploy:  supabase functions deploy admin-delete-account
// Invoke:  supabase.functions.invoke('admin-delete-account', { body: { user_id } })
// ════════════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE) {
      console.error("[admin-delete-account] missing env vars");
      return json(500, { error: "Service not configured" });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json(401, { error: "Missing Authorization header" });

    let body: { user_id?: string } = {};
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }
    const targetId = body.user_id?.trim();
    if (!targetId) return json(400, { error: "Missing user_id" });

    // 1. Authenticate caller
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json(401, { error: "Invalid session" });

    const callerId = userData.user.id;
    if (callerId === targetId) {
      return json(400, { error: "Use self-delete instead." });
    }

    // 2. Service-role client; verify caller is admin
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: callerProfile, error: cpErr } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", callerId)
      .maybeSingle();
    if (cpErr || !callerProfile) return json(403, { error: "Profile not found" });
    if (callerProfile.role !== "admin") return json(403, { error: "Admin only" });

    // 3. Resolve target details for the audit log
    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("handle")
      .eq("id", targetId)
      .maybeSingle();
    const { data: targetAuth } = await adminClient.auth.admin.getUserById(targetId);
    const deletedEmail = targetAuth?.user?.email ?? null;
    const deletedHandle = targetProfile?.handle ?? null;

    // 4. Audit
    await adminClient.from("audit_log").insert({
      actor_id: callerId,
      action: "admin_delete_user",
      target_type: "profile",
      target_id: targetId,
      meta: { deleted_email: deletedEmail, deleted_handle: deletedHandle },
    });

    // 5. Delete (cascade handles the rest)
    const { error: deleteErr } = await adminClient.auth.admin.deleteUser(targetId);
    if (deleteErr) {
      console.error("[admin-delete-account] admin.deleteUser failed:", deleteErr);
      return json(500, { error: deleteErr.message });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("[admin-delete-account] unexpected error:", err);
    return json(500, { error: "Unexpected error" });
  }
});
