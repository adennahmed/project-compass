import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase singleton.
 *
 * Activates the moment `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are
 * present in the env. When they're missing (design-only mode), `supabase` is
 * `null` and the data layer falls back to mock fixtures. This keeps the
 * community section fully renderable without a configured backend.
 */
const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  URL && KEY
    ? createClient(URL, KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export const isSupabaseConfigured = supabase !== null;
