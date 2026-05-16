import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";

/**
 * Handles every Supabase auth redirect:
 *   • OAuth completion (Google/GitHub/Apple)
 *   • Email-verification link clicks
 *
 * Supabase puts a fragment like #access_token=... into the URL; calling
 * `getSession()` here lets the SDK pick that up and persist the session.
 * Once the session is live, we route the user either to onboarding
 * (first-time profile setup) or to /community.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { session, profile, needsOnboarding, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Backend not configured.");
      return;
    }

    // Some Supabase auth callbacks (recovery, invite) carry a `type=...`
    // hash param that requires an explicit `exchangeCodeForSession` on
    // newer SDKs. getSession() is enough for OAuth + email confirm.
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (!data.session) {
          // No session in URL — likely user landed here directly.
          setError("No active session. Try signing in again.");
        }
      })
      .catch((err) => setError(err?.message ?? String(err)));
  }, []);

  // Once the session resolves through AuthProvider, route appropriately.
  useEffect(() => {
    if (loading || !session) return;
    if (needsOnboarding) {
      navigate("/community/onboarding", { replace: true });
    } else if (profile) {
      navigate("/community", { replace: true });
    }
  }, [loading, session, profile, needsOnboarding, navigate]);

  if (error) {
    return (
      <section className="px-6 py-24 md:px-10">
        <div className="container-wide max-w-xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-signal">
            ↘ Sign-in failed
          </div>
          <h1 className="mt-3 text-[24px] font-semibold text-paper">{error}</h1>
          <p className="mt-3 text-[14px] text-paper/65">
            Try signing in again — or send a fresh magic link / password reset.
          </p>
          <button
            type="button"
            onClick={() => navigate("/community/auth", { replace: true })}
            className="mt-6 border border-paper bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
          >
            Back to sign-in ↘
          </button>
        </div>
      </section>
    );
  }

  if (!loading && session && profile && !needsOnboarding) {
    return <Navigate to="/community" replace />;
  }

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 md:px-10">
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
        ↘ Finishing sign in…
      </div>
    </section>
  );
};

export default AuthCallback;
