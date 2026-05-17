import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import { useAuth } from "@/lib/community/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Password-reset landing page. Supabase puts the recovery token in the URL
 * fragment; getSession() picks it up automatically. Once the user has a
 * recovery session, they can call updateUser({ password }) to set a new one.
 */
const AuthReset = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");

  useEffect(() => {
    if (!supabase) {
      setError("Backend not configured.");
      return;
    }
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!data.session) {
          setError("Reset link expired or invalid. Request a new one from the sign-in page.");
        }
        setReady(true);
      })
      .catch((err) => setError(err?.message ?? String(err)));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setState("submitting");
    const { error } = await updatePassword(password);
    if (error) {
      setError(error);
      setState("idle");
    } else {
      setState("done");
      setTimeout(() => navigate("/community", { replace: true }), 1400);
    }
  };

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide max-w-xl">
        <Reveal replay={false}>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ — Reset password ]
          </div>
        </Reveal>

        <h1
          className="mt-5 text-paper"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}
        >
          Set a new password.
        </h1>

        {!ready ? (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
            ↘ Validating link…
          </p>
        ) : state === "done" ? (
          <div className="mt-8 border border-signal/45 bg-signal/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">↘ Password updated</div>
            <div className="mt-1.5 text-[14px] text-paper/85">Redirecting you back to the community…</div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-5 border border-paper/15 bg-ink/40 p-7 md:p-8">
            <label className="kz-input kz-input--dark block">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">New password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="min 8 characters"
                autoComplete="new-password"
                className="mt-1.5 w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
              />
            </label>
            <label className="kz-input kz-input--dark block">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Confirm password</span>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="repeat it"
                autoComplete="new-password"
                className="mt-1.5 w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
              />
            </label>

            {error && (
              <div className="border-l-2 border-signal pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="self-start border border-paper bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "submitting" ? "Saving…" : "Save new password ↘"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default AuthReset;
