import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const RULES = [
  ["Be useful.", "Posts should help someone — share what you're building, ask a real question, answer one well."],
  ["No spam, no self-promo dumps.", "Links to your own work are fine when relevant. Linktree-style drive-bys aren't."],
  ["Disagree on the work, not the person.", "Critique ideas hard. Critique people not at all."],
  ["No grift.", "No “I'll teach you to make $10k/mo” energy. No AI-generated filler posts."],
  ["Keep it on topic.", "This is a community for operators and people who build software for them. Politics and unrelated drama belong elsewhere."],
  ["Staff have the final call.", "If a post or comment gets removed, that's why. DM an admin if you think it was a mistake."],
];

/**
 * Shown once to a signed-in user the first time they hit the social page.
 * Writes profile.community_rules_accepted_at on acceptance.
 */
const RulesGate = ({ onAccepted }: { onAccepted?: () => void }) => {
  const { session, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);

  const accept = async () => {
    if (!supabase || !session?.user.id || busy) return;
    setBusy(true);
    await db().from("profiles")
      .update({ community_rules_accepted_at: new Date().toISOString() })
      .eq("id", session.user.id);
    await refreshProfile();
    setBusy(false);
    onAccepted?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-paper/15 bg-paper text-ink">
        <div className="border-b border-ink/10 px-6 py-5 md:px-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55">
            [ House rules ]
          </div>
          <h2
            className="mt-3 text-ink"
            style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Six things before you post.
          </h2>
        </div>
        <ol className="flex flex-col divide-y divide-ink/10">
          {RULES.map(([title, body], i) => (
            <li key={i} className="flex items-start gap-4 px-6 py-4 md:px-8">
              <span className="mt-0.5 w-6 shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-ink">{title}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-ink/65">{body}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex items-center justify-end gap-3 border-t border-ink/10 px-6 py-4 md:px-8">
          <button
            type="button"
            disabled={busy}
            onClick={accept}
            className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-signal hover:border-signal disabled:opacity-50"
          >
            {busy ? "Saving…" : "I agree ↘"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesGate;
