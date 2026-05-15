import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase singleton.
 *
 * Activates the moment `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are
 * present in the env. When they're missing (design-only mode), `supabase` is
 * `null` and the data layer falls back to mock fixtures. This keeps the
 * community section fully renderable without a configured backend.
 *
 * Construction is wrapped in try/catch so a malformed URL or other init
 * error never blanks the whole site — we degrade to mock mode instead and
 * log the underlying error to the console.
 */
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

let _client: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    // Basic URL validation — surfaces a clear error early instead of letting
    // a malformed value blow up deep inside the SDK.
    new URL(SUPABASE_URL);
    _client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error(
      "[supabase] Failed to initialize client — falling back to mock mode.",
      err,
    );
    _client = null;
  }
}

export const supabase: SupabaseClient | null = _client;
export const isSupabaseConfigured = _client !== null;
