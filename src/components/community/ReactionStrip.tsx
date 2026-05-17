import { useEffect, useRef, useState } from "react";
import { ReactionKind } from "@/lib/community/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";

interface ReactionStripProps {
  /** Live mode: pass targetType + targetId to wire to DB. */
  targetType?: "post" | "comment";
  targetId?: string;
  /** Static mode: pass precomputed counts (used by list cards — legacy). */
  counts?: Partial<Record<ReactionKind, number>>;
  className?: string;
}

const PICKER_REACT = ["👍","❤️","🔥","💡","🎯","👀","🙏","😂","🤔","💯","🚀","✨"];
const PICKER_FEEDBACK = ["🙌","👏","💪","😅","🤝","🫡","🧠","⚡","🎉","👌","🤯","🙈"];

// Legacy fallback icons for static mode (used by list cards).
const LEGACY_ICONS: Record<ReactionKind, string> = {
  like: "👍",
  insightful: "💡",
  fire: "🔥",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

interface RawReaction { emoji: string; user_id: string }

interface AggChip {
  emoji: string;
  count: number;
  mine: boolean;
  userIds: string[];
}

const ReactionStrip = ({ targetType, targetId, counts: staticCounts, className = "" }: ReactionStripProps) => {
  const { session } = useAuth();
  const live = !!targetType && !!targetId;
  const [rows, setRows] = useState<RawReaction[]>([]);
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tooltipNames, setTooltipNames] = useState<Record<string, string[]>>({});
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!live || !supabase || !targetId || !targetType) return;
    let cancelled = false;
    (async () => {
      const { data } = await db()
        .from("reactions")
        .select("emoji,user_id")
        .eq("target_type", targetType)
        .eq("target_id", targetId);
      if (cancelled) return;
      setRows((data ?? []) as RawReaction[]);
    })();
    return () => { cancelled = true; };
  }, [live, targetId, targetType]);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [pickerOpen]);

  // Build aggregated chips
  const chips: AggChip[] = (() => {
    if (live) {
      const map = new Map<string, AggChip>();
      for (const r of rows) {
        const existing = map.get(r.emoji);
        if (existing) {
          existing.count += 1;
          existing.userIds.push(r.user_id);
          if (r.user_id === session?.user.id) existing.mine = true;
        } else {
          map.set(r.emoji, {
            emoji: r.emoji,
            count: 1,
            mine: r.user_id === session?.user.id,
            userIds: [r.user_id],
          });
        }
      }
      return Array.from(map.values()).sort((a, b) => b.count - a.count);
    }
    // Static fallback (legacy list cards)
    const out: AggChip[] = [];
    for (const k of ["like","insightful","fire"] as ReactionKind[]) {
      const n = staticCounts?.[k] ?? 0;
      if (n > 0) out.push({ emoji: LEGACY_ICONS[k], count: n, mine: false, userIds: [] });
    }
    return out;
  })();

  const ensureTooltipNames = async (emoji: string, userIds: string[]) => {
    if (tooltipNames[emoji] || !supabase || userIds.length === 0) return;
    const ids = userIds.slice(0, 5);
    const { data } = await db().from("profiles").select("id,display_name,handle").in("id", ids);
    const names = (data ?? []).map((p: { display_name: string; handle: string }) => p.display_name || `@${p.handle}`);
    setTooltipNames((m) => ({ ...m, [emoji]: names }));
  };

  const toggle = async (emoji: string) => {
    if (!live || !supabase || !session?.user.id || !targetId || !targetType || busy) return;
    setBusy(true);
    const had = rows.some((r) => r.emoji === emoji && r.user_id === session.user.id);
    // Optimistic
    setRows((prev) => had
      ? prev.filter((r) => !(r.emoji === emoji && r.user_id === session.user.id))
      : [...prev, { emoji, user_id: session.user.id }],
    );
    try {
      if (had) {
        await db().from("reactions").delete()
          .eq("user_id", session.user.id)
          .eq("target_type", targetType)
          .eq("target_id", targetId)
          .eq("emoji", emoji);
      } else {
        await db().from("reactions").insert({
          user_id: session.user.id,
          target_type: targetType,
          target_id: targetId,
          emoji,
        });
      }
    } catch {
      // Revert on failure
      setRows((prev) => had
        ? [...prev, { emoji, user_id: session.user.id }]
        : prev.filter((r) => !(r.emoji === emoji && r.user_id === session.user.id)),
      );
    } finally {
      setBusy(false);
    }
  };

  const pick = (emoji: string) => {
    setPickerOpen(false);
    void toggle(emoji);
  };

  const showPlus = live && !!session;

  return (
    <div ref={wrapRef} className={`relative inline-flex flex-wrap items-center gap-1 ${className}`}>
      {chips.map((chip) => {
        const title = tooltipNames[chip.emoji]
          ? tooltipNames[chip.emoji].join(", ") + (chip.count > tooltipNames[chip.emoji].length ? ` +${chip.count - tooltipNames[chip.emoji].length}` : "")
          : `${chip.count} reaction${chip.count === 1 ? "" : "s"}`;
        return (
          <button
            key={chip.emoji}
            type="button"
            title={title}
            onMouseEnter={() => void ensureTooltipNames(chip.emoji, chip.userIds)}
            onClick={live ? (e) => { e.preventDefault(); e.stopPropagation(); void toggle(chip.emoji); } : undefined}
            disabled={live && !session}
            className={`inline-flex items-center gap-1 border px-1.5 py-[3px] font-mono text-[11px] leading-none transition-colors ${
              chip.mine
                ? "border-signal/70 bg-signal/10 text-signal"
                : "border-paper/15 text-paper/70 hover:border-paper/35 hover:text-paper"
            } ${live && !session ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span className="text-[13px] leading-none">{chip.emoji}</span>
            <span>{chip.count}</span>
          </button>
        );
      })}
      {showPlus && (
        <button
          type="button"
          aria-label="Add reaction"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPickerOpen((v) => !v); }}
          className="inline-flex h-[22px] items-center justify-center border border-paper/15 px-1.5 font-mono text-[12px] leading-none text-paper/55 hover:border-paper/35 hover:text-paper"
        >
          +
        </button>
      )}
      {pickerOpen && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-50 flex w-[260px] flex-col gap-1.5 border border-paper/20 bg-ink p-2 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45">Reactions</div>
          <div className="flex flex-wrap gap-1">
            {PICKER_REACT.map((e) => (
              <button
                key={e}
                type="button"
                onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); pick(e); }}
                className="h-7 w-7 border border-transparent text-[16px] leading-none hover:border-paper/25 hover:bg-paper/5"
              >
                {e}
              </button>
            ))}
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45">Feedback</div>
          <div className="flex flex-wrap gap-1">
            {PICKER_FEEDBACK.map((e) => (
              <button
                key={e}
                type="button"
                onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); pick(e); }}
                className="h-7 w-7 border border-transparent text-[16px] leading-none hover:border-paper/25 hover:bg-paper/5"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionStrip;
