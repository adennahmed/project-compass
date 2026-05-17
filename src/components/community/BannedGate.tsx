import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";
import { dateStamp } from "@/lib/community/format";

/**
 * BannedGate — full-bleed cream panel shown when the signed-in user's
 * profile.banned_at is set. Non-dismissable; only options are a mailto
 * appeal or sign-out. Mounted by CommunityRoot which short-circuits the
 * rest of the community UI when this gate is active.
 */
const BannedGate = () => {
  const { profile, session, signOut } = useAuth();
  const [reason, setReason] = useState<string | null>(null);

  // Pull the most recent ban's note (if any) to surface the moderator's reason.
  useEffect(() => {
    if (!supabase || !profile?.id) return;
    let cancelled = false;
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as unknown as any)
        .from("moderation_actions")
        .select("note, created_at")
        .eq("target_user_id", profile.id)
        .eq("kind", "ban")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (data?.note) setReason(data.note);
    })();
    return () => { cancelled = true; };
  }, [profile?.id]);

  const handle = profile?.handle ?? "unknown";
  const email = session?.user?.email ?? "";
  const since = profile?.banned_at ? dateStamp(profile.banned_at) : "unknown";

  const subject = `Account review · @${handle}`;
  const bodyLines = [
    "Hi Kozai team,",
    "",
    `Account: @${handle}${email ? ` (${email})` : ""}`,
    `Suspended on: ${since}`,
    "",
    "<Reason for review here...>",
    "",
    "Thank you.",
  ];
  const mailto = `mailto:hello@kozai.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="kz-banned-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10 md:px-10"
      style={{
        background: "#F1EEE5",
        color: "#0F0F12",
        animation: "kz-banned-fade 320ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <style>{`
        @keyframes kz-banned-fade {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="alertdialog"] { animation: none !important }
        }
      `}</style>
      <div className="w-full max-w-[640px]">
        <div
          className="font-mono uppercase"
          style={{
            color: "#F5803E",
            fontSize: 11,
            letterSpacing: "0.32em",
          }}
        >
          [ ✦ — Account suspended ]
        </div>
        <h1
          id="kz-banned-title"
          className="mt-6"
          style={{
            fontFamily: "Geist, system-ui, sans-serif",
            fontSize: "clamp(1.9rem, 4.6vw, 3rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          This account has been suspended.
        </h1>
        <p
          className="mt-5 max-w-[58ch]"
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(15,15,18,0.65)",
          }}
        >
          Posting, commenting, and member features are disabled while the
          Kozai team reviews this account. Every appeal is read by a person —
          we usually respond within a couple of business days.
        </p>
        {reason && (
          <p
            className="mt-4 max-w-[58ch] border-l px-4 py-2"
            style={{
              borderColor: "rgba(15,15,18,0.18)",
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(15,15,18,0.75)",
            }}
          >
            <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(15,15,18,0.55)" }}>
              Reason provided ·
            </span>{" "}
            {reason}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <a
            href={mailto}
            className="inline-flex items-center border px-5 py-3 font-mono uppercase transition-colors"
            style={{
              background: "#0F0F12",
              color: "#F1EEE5",
              borderColor: "#0F0F12",
              fontSize: 11,
              letterSpacing: "0.22em",
            }}
          >
            Request review → hello@kozai.ca
          </a>
          <button
            type="button"
            onClick={() => { void signOut(); }}
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "rgba(15,15,18,0.55)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem 0.25rem",
            }}
          >
            Sign out ↗
          </button>
        </div>

        <div
          className="mt-10 font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            color: "rgba(15,15,18,0.45)",
          }}
        >
          Kozai Community · Suspension active
        </div>
      </div>
    </div>
  );
};

export default BannedGate;
