import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import {
  supabase,
  isSupabaseConfigured,
} from "@/integrations/supabase/client";
import { Profile } from "./types";

/**
 * Auth provider for the community section.
 *
 * Uses the pre-existing Supabase client at @/integrations/supabase/client.
 * That client is null when the env vars are absent — we surface that state
 * via `isMock` so the UI can render an offline-friendly placeholder rather
 * than crashing.
 *
 * Exposes:
 *   • session      — current Supabase session (null when signed out)
 *   • profile      — joined profiles row for the signed-in user
 *   • loading      — true while we're resolving the initial session/profile
 *   • isMock       — true when no backend is configured
 *   • needsOnboarding — true when signed in but profile.onboarded_at is NULL
 *   • signInWithPassword, signUpWithPassword
 *   • signInWithOAuth (google | github | apple)
 *   • signInWithMagicLink, resetPassword
 *   • updatePassword (used by /community/auth/reset)
 *   • signOut
 *   • deleteAccount   (calls the delete-account Edge Function)
 *   • refreshProfile  (re-reads the profile row, e.g. after onboarding save)
 */
export type OAuthProvider = "google" | "github" | "apple";

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isMock: boolean;
  needsOnboarding: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error: string | null; needsVerification: boolean }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | null>(null);

const CALLBACK_URL = () =>
  `${window.location.origin}/community/auth/callback`;

const RESET_URL = () =>
  `${window.location.origin}/community/auth/reset`;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  // ─── Session bootstrap + change listener ────────────────────────────
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data?.session ?? null);
        if (!data?.session) setLoading(false);
      })
      .catch((err) => {
        console.error("[auth] getSession failed:", err);
        if (mounted) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ─── Profile fetch (whenever session changes) ───────────────────────
  const fetchProfile = useCallback(async (uid: string) => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();
    if (error) {
      console.error("[auth] profile load failed:", error);
      setProfile(null);
    } else {
      setProfile(data as unknown as Profile);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    void fetchProfile(session.user.id);
  }, [session, fetchProfile]);

  // ─── Mutators ───────────────────────────────────────────────────────
  const value = useMemo<AuthState>(
    () => ({
      session,
      profile,
      loading,
      isMock: !isSupabaseConfigured,
      needsOnboarding: !!session && !!profile && !profile.onboarded_at,

      signInWithPassword: async (email, password) => {
        if (!supabase) return { error: "Backend not configured." };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },

      signUpWithPassword: async (email, password) => {
        if (!supabase) return { error: "Backend not configured.", needsVerification: false };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: CALLBACK_URL() },
        });
        if (error) return { error: error.message, needsVerification: false };
        // Supabase returns session=null when email confirmation is required.
        return { error: null, needsVerification: !data.session };
      },

      signInWithOAuth: async (provider) => {
        if (!supabase) return { error: "Backend not configured." };
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: CALLBACK_URL() },
        });
        return { error: error?.message ?? null };
      },

      signInWithMagicLink: async (email) => {
        if (!supabase) return { error: "Backend not configured." };
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: CALLBACK_URL() },
        });
        return { error: error?.message ?? null };
      },

      resetPassword: async (email) => {
        if (!supabase) return { error: "Backend not configured." };
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: RESET_URL(),
        });
        return { error: error?.message ?? null };
      },

      updatePassword: async (newPassword) => {
        if (!supabase) return { error: "Backend not configured." };
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return { error: error?.message ?? null };
      },

      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },

      deleteAccount: async () => {
        if (!supabase) return { error: "Backend not configured." };
        const { error } = await supabase.functions.invoke("delete-account");
        if (error) return { error: error.message };
        await supabase.auth.signOut();
        return { error: null };
      },

      refreshProfile: async () => {
        if (session) await fetchProfile(session.user.id);
      },
    }),
    [session, profile, loading, fetchProfile],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
};
