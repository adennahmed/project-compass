import { ReactionKind } from "@/lib/community/types";

interface ReactionStripProps {
  counts?: Partial<Record<ReactionKind, number>>;
  className?: string;
}

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

const ReactionStrip = ({ counts = {}, className = "" }: ReactionStripProps) => {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {(Object.keys(ICONS) as ReactionKind[]).map((k) => {
        const n = counts[k] ?? 0;
        return (
          <button
            key={k}
            type="button"
            aria-label={LABELS[k]}
            className="group inline-flex items-center gap-1.5 border border-paper/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/65 transition-colors hover:border-signal/60 hover:text-signal"
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
