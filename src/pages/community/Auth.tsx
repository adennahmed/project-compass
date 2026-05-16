import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import { OAuthProvider, useAuth } from "@/lib/community/auth";

type Mode = "signin" | "signup" | "forgot";

const OAUTH_BUTTONS: { provider: OAuthProvider; label: string; icon: string }[] = [
  { provider: "google", label: "Continue with Google", icon: "G" },
  { provider: "github", label: "Continue with GitHub", icon: "▲" },
  { provider: "apple",  label: "Continue with Apple",  icon: "" },
];

const AuthPage = () => {
  const { session, isMock, signInWithPassword, signUpWithPassword, signInWithOAuth, resetPassword } = useAuth();
  const [params] = useSearchParams();
  const initialMode = (params.get("mode") as Mode) || "signin";
  const [mode, setMode] = useState<Mode>(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "verify" | "reset_sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (session) return <Navigate to="/community" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("submitting");

    if (mode === "signin") {
      const { error } = await signInWithPassword(email.trim(), password);
      if (error) { setError(error); setState("error"); return; }
      // Successful sign-in triggers AuthProvider session change; redirect via render.
    } else if (mode === "signup") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        setState("error");
        return;
      }
      const { error, needsVerification } = await signUpWithPassword(email.trim(), password);
      if (error) { setError(error); setState("error"); return; }
      if (needsVerification) {
        setState("verify");
      }
    } else {
      const { error } = await resetPassword(email.trim());
      if (error) { setError(error); setState("error"); return; }
      setState("reset_sent");
    }
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    setError(null);
    const { error } = await signInWithOAuth(provider);
    if (error) setError(error);
    // OAuth flow handles its own redirect.
  };

  return (
    <section className="relative min-h-[78vh] px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Left: copy */}
        <div className="md:col-span-7">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
              [ 00 — Join ]
            </div>
          </Reveal>

          <h1
            className="mt-5 text-paper"
            style={{
              fontSize: "clamp(2.2rem, 5.6vw, 4rem)",
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
            }}
          >
            <CharReveal stagger={26}>{"COME"}</CharReveal>{" "}
            <span className="italic-editorial text-signal">
              <CharReveal stagger={26} delay={220}>{"INSIDE."}</CharReveal>
            </span>
          </h1>

          <Reveal delay={500}>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
              Sign in or create an account to start posting, commenting, and
              building a profile. Reading is always public — no account needed.
            </p>
          </Reveal>

          <Reveal delay={620}>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {[
                ["Free", "Always."],
                ["Email verified", "We send a one-time code."],
                ["No tracking", "Nothing sold downstream."],
              ].map(([k, v]) => (
                <div key={k} className="border-l border-paper/15 pl-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/45">{k}</div>
                  <div className="mt-1 text-[14px] text-paper/85">{v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: form card */}
        <div className="md:col-span-5">
          <Reveal delay={300}>
            <div className="flex flex-col gap-6 border border-paper/15 bg-ink/40 p-7 md:p-9">
              {/* Mode switcher */}
              <div className="flex items-center gap-1.5">
                {(["signin", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setError(null); setState("idle"); }}
                    className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                      mode === m ? "text-paper" : "text-paper/45 hover:text-paper/85"
                    }`}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                    {mode === m && (
                      <span aria-hidden className="ml-1 inline-block h-px w-4 align-middle bg-signal" />
                    )}
                  </button>
                ))}
              </div>

              {state === "verify" ? (
                <div className="border border-signal/45 bg-signal/10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">↘ Check your inbox</div>
                  <div className="mt-1.5 text-[14px] text-paper/85">
                    We sent a confirmation link to <strong className="text-paper">{email}</strong>. Click it
                    to verify your email and finish setting up your account. The link expires in 1 hour.
                  </div>
                </div>
              ) : state === "reset_sent" ? (
                <div className="border border-signal/45 bg-signal/10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">↘ Reset link sent</div>
                  <div className="mt-1.5 text-[14px] text-paper/85">
                    If an account exists for <strong className="text-paper">{email}</strong>, you'll get a
                    password-reset email shortly.
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMode("signin"); setState("idle"); }}
                    className="mt-3 link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 hover:text-paper"
                  >
                    ← Back to sign in
                  </button>
                </div>
              ) : (
                <>
                  {/* OAuth buttons */}
                  <div className="flex flex-col gap-2">
                    {OAUTH_BUTTONS.map((b) => (
                      <button
                        key={b.provider}
                        type="button"
                        onClick={() => handleOAuth(b.provider)}
                        className="group inline-flex items-center justify-center gap-3 border border-paper/20 bg-ink/30 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85 transition-colors hover:border-paper/45 hover:bg-ink/60 hover:text-paper"
                      >
                        <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center border border-paper/25 text-[11px] text-paper/80 group-hover:border-paper/55">
                          {b.icon}
                        </span>
                        {b.label}
                      </button>
                    ))}
                  </div>

                  {/* Separator */}
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="h-px flex-1 bg-paper/10" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/40">
                      or with email
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-paper/10" />
                  </div>

                  {/* Email/password form */}
                  <form onSubmit={submit} className="flex flex-col gap-5">
                    <label className="kz-input kz-input--dark block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Email</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={state === "submitting"}
                        placeholder="you@studio.com"
                        autoComplete="email"
                        className="mt-1.5 w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
                      />
                    </label>

                    {mode !== "forgot" && (
                      <label className="kz-input kz-input--dark block">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Password</span>
                          {mode === "signin" && (
                            <button
                              type="button"
                              onClick={() => { setMode("forgot"); setError(null); }}
                              className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
                            >
                              Forgot?
                            </button>
                          )}
                        </div>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={state === "submitting"}
                          placeholder={mode === "signup" ? "min 8 characters" : "your password"}
                          autoComplete={mode === "signup" ? "new-password" : "current-password"}
                          className="mt-1.5 w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
                        />
                      </label>
                    )}

                    {error && (
                      <div className="border-l-2 border-signal pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={state === "submitting"}
                      className="border border-paper bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {state === "submitting"
                        ? "Working…"
                        : mode === "signin"
                          ? "Sign in ↘"
                          : mode === "signup"
                            ? "Create account ↘"
                            : "Send reset link ↘"}
                    </button>

                    {mode === "forgot" && (
                      <button
                        type="button"
                        onClick={() => { setMode("signin"); setError(null); }}
                        className="link-wipe self-start font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
                      >
                        ← Back to sign in
                      </button>
                    )}
                  </form>
                </>
              )}

              {isMock && (
                <p className="font-mono text-[10px] uppercase leading-[1.6] tracking-[0.18em] text-paper/40">
                  ↯ Backend not configured. Add your Supabase env vars in
                  Vercel to enable account creation.
                </p>
              )}

              <div className="border-t border-paper/10 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                By continuing, you agree to our{" "}
                <Link to="/terms-and-conditions" className="text-paper/70 hover:text-paper">terms</Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-paper/70 hover:text-paper">privacy policy</Link>.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
