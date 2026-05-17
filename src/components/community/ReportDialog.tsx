import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";
import { ReportCategory } from "@/lib/community/types";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  targetType: "post" | "comment" | "profile";
  targetId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const CATEGORIES: { value: ReportCategory; label: string; hint: string }[] = [
  { value: "spam", label: "Spam", hint: "Repeated promo, link dumps, off-topic ads" },
  { value: "harassment", label: "Harassment", hint: "Targeted abuse, insults, threats" },
  { value: "off-topic", label: "Off-topic", hint: "Doesn't belong in the community" },
  { value: "illegal", label: "Illegal content", hint: "Anything unlawful — we review fast" },
  { value: "other", label: "Other", hint: "Something else — explain below" },
];

const ReportDialog = ({ open, onClose, targetType, targetId }: ReportDialogProps) => {
  const { session } = useAuth();
  const [category, setCategory] = useState<ReportCategory>("spam");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!supabase || !session?.user.id) {
      setError("You need to sign in to report.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await db().from("reports").insert({
      target_type: targetType,
      target_id: targetId,
      reporter_id: session.user.id,
      reason: reason.trim() || `(${category})`,
      reason_category: category,
      status: "open",
    });
    setBusy(false);
    if (err) {
      if (/policy|violates row-level/i.test(err.message)) {
        setError("You can't report your own content.");
      } else {
        setError(err.message);
      }
      return;
    }
    setDone(true);
    setTimeout(() => {
      onClose();
      setDone(false);
      setReason("");
      setCategory("spam");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="w-full max-w-[480px] border border-paper/20 bg-ink p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
            Report {targetType}
          </div>
          <button onClick={onClose} className="font-mono text-[11px] text-paper/55 hover:text-paper">✕</button>
        </div>
        {done ? (
          <div className="mt-6 border border-signal/40 bg-signal/5 p-4 font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            ↘ Reported. The Kozai team will review it.
          </div>
        ) : (
          <>
            <div className="mt-5 flex flex-col gap-2">
              {CATEGORIES.map((c) => (
                <label
                  key={c.value}
                  className={`flex cursor-pointer items-start gap-3 border px-3 py-2 transition-colors ${
                    category === c.value
                      ? "border-signal/70 bg-signal/5"
                      : "border-paper/12 hover:border-paper/25"
                  }`}
                >
                  <input
                    type="radio"
                    name="report-category"
                    value={c.value}
                    checked={category === c.value}
                    onChange={() => setCategory(c.value)}
                    className="mt-1 accent-signal"
                  />
                  <span className="flex flex-col">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper">{c.label}</span>
                    <span className="mt-0.5 text-[12px] text-paper/55">{c.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                Details (optional, {reason.length}/500)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Anything that helps us review…"
                className="mt-1.5 w-full resize-y border border-paper/15 bg-ink/40 p-2 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
              />
            </div>
            {error && (
              <div className="mt-3 border border-signal/60 p-2 font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
                ↘ {error}
              </div>
            )}
            <div className="mt-5 flex items-center justify-end gap-3 border-t border-paper/10 pt-4">
              <button onClick={onClose} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={busy}
                className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:opacity-50"
              >
                {busy ? "Submitting…" : "Submit report ↘"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportDialog;
