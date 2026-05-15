import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import { useAuth } from "@/lib/community/auth";

const AuthPage = () => {
  const { session, signInWithEmail, isMock } = useAuth();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (session) return <Navigate to="/community" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setError(null);
    const { error } = await signInWithEmail(email.trim());
    if (error) {
      setError(error);
      setState("error");
    } else {
      setState("sent");
    }
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
            <CharReveal stagger={26}>{"ONE LINK."}</CharReveal>
            <br />
            <span className="italic-editorial text-signal">
              <CharReveal stagger={26} delay={220}>{"NO PASSWORD."}</CharReveal>
            </span>
          </h1>

          <Reveal delay={500}>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
              We'll email you a one-time sign-in link. No password to remember, no
              friction, no marketing list. You can browse the whole community
              without signing in — joining unlocks commenting, threads, and your profile.
            </p>
          </Reveal>

          <Reveal delay={620}>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {[
                ["Free", "Always."],
                ["Public read", "Sign-in only to post."],
                ["No tracking", "Nothing sold downstream."],
              ].map(([k, v]) => (
                <div key={k} className="border-l border-paper/15 pl-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/45">
                    {k}
                  </div>
                  <div className="mt-1 text-[14px] text-paper/85">{v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <div className="md:col-span-5">
          <Reveal delay={300}>
            <form
              onSubmit={submit}
              className="flex flex-col gap-6 border border-paper/15 bg-ink/40 p-7 md:p-9"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
                  ↘ Sign in or sign up
                </div>
                <h2 className="mt-2 text-[20px] font-semibold text-paper">
                  Email me a sign-in link
                </h2>
              </div>

              <label className="kz-input kz-input--dark block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={state === "sending" || state === "sent"}
                  placeholder="you@studio.com"
                  className="mt-1.5 w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
                />
              </label>

              {error && (
                <div className="border-l-2 border-signal pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                  {error}
                </div>
              )}

              {state === "sent" ? (
                <div className="border border-signal/45 bg-signal/10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">
                    ↘ Check your inbox
                  </div>
                  <div className="mt-1.5 text-[14px] text-paper/85">
                    We sent a sign-in link to <strong className="text-paper">{email}</strong>. It expires in 1 hour.
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="border border-paper bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === "sending" ? "Sending…" : "Send me the link ↘"}
                </button>
              )}

              {isMock && (
                <p className="font-mono text-[10px] uppercase leading-[1.6] tracking-[0.18em] text-paper/40">
                  ↯ Preview mode — Supabase env vars not detected. Sign-in is
                  disabled until <code className="text-paper/70">VITE_SUPABASE_URL</code>{" "}
                  and <code className="text-paper/70">VITE_SUPABASE_ANON_KEY</code> are set.
                </p>
              )}

              <div className="border-t border-paper/10 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                By continuing, you agree to our{" "}
                <Link to="/terms-and-conditions" className="text-paper/70 hover:text-paper">
                  terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-paper/70 hover:text-paper">
                  privacy policy
                </Link>
                .
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
