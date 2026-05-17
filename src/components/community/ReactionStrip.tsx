import { useEffect, useState } from "react";
import { ReactionKind } from "@/lib/community/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";

interface ReactionStripProps {
  /** Live mode: pass targetType + targetId to wire to DB. */
  targetType?: "post" | "comment";
  targetId?: string;
  /** Static mode: pass precomputed counts (used by list cards). */
  counts?: Partial<Record<ReactionKind, number>>;
  className?: string;
}

const KINDS: ReactionKind[] = ["like", "insightful", "fire"];

const ICONS: Record<ReactionKind, string> = {
  like: "♡",
  insightful: "✦",
  fire: "▲",
};

const LABELS: Record<ReactionKind, string> = {
  like: "Like",
  insightful: "Insightful",
  fire: "Fire",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const ReactionStrip = ({ targetType, targetId, counts: staticCounts, className = "" }: ReactionStripProps) => {
  const { session } = useAuth();
  const live = !!targetType && !!targetId;
  const [counts, setCounts] = useState<Record<ReactionKind, number>>({
    like: staticCounts?.like ?? 0,
    insightful: staticCounts?.insightful ?? 0,
    fire: staticCounts?.fire ?? 0,
  });
  const [mine, setMine] = useState<Record<ReactionKind, boolean>>({
    like: false,
    insightful: false,
    fire: false,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!live || !supabase || !targetId || !targetType) return;
    let cancelled = false;
    (async () => {
      const { data } = await db()
        .from("reactions")
        .select("kind,user_id")
        .eq("target_type", targetType)
        .eq("target_id", targetId);
      if (cancelled) return;
      const c: Record<ReactionKind, number> = { like: 0, insightful: 0, fire: 0 };
      const m: Record<ReactionKind, boolean> = { like: false, insightful: false, fire: false };
      for (const r of (data ?? []) as { kind: ReactionKind; user_id: string }[]) {
        c[r.kind] = (c[r.kind] ?? 0) + 1;
        if (session?.user.id && r.user_id === session.user.id) m[r.kind] = true;
      }
      setCounts(c);
      setMine(m);
    })();
    return () => { cancelled = true; };
  }, [live, targetId, targetType, session?.user.id]);

  const toggle = async (k: ReactionKind) => {
    if (!live || !supabase || !session?.user.id || !targetId || !targetType || busy) return;
    setBusy(true);
    const had = mine[k];
    // Optimistic
    setMine((s) => ({ ...s, [k]: !had }));
    setCounts((c) => ({ ...c, [k]: Math.max(0, c[k] + (had ? -1 : 1)) }));
    try {
      if (had) {
        await db().from("reactions").delete()
          .eq("user_id", session.user.id)
          .eq("target_type", targetType)
          .eq("target_id", targetId)
          .eq("kind", k);
      } else {
        await db().from("reactions").insert({
          user_id: session.user.id,
          target_type: targetType,
          target_id: targetId,
          kind: k,
        });
      }
    } catch {
      // Reconcile on failure
      setMine((s) => ({ ...s, [k]: had }));
      setCounts((c) => ({ ...c, [k]: Math.max(0, c[k] + (had ? 1 : -1)) }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {KINDS.map((k) => {
        const n = counts[k] ?? 0;
        const isMine = mine[k];
        return (
          <button
            key={k}
            type="button"
            aria-label={LABELS[k]}
            onClick={live ? (e) => { e.preventDefault(); e.stopPropagation(); void toggle(k); } : undefined}
            disabled={live && !session}
            className={`group inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              isMine
                ? "border-signal/70 text-signal"
                : "border-paper/15 text-paper/65 hover:border-signal/60 hover:text-signal"
            } ${live && !session ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span className="text-[11px] leading-none">{ICONS[k]}</span>
            {n > 0 && <span>{n}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionStrip;
