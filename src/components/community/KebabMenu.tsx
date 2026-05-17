import { useEffect, useRef, useState, ReactNode } from "react";

export interface KebabItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
  hidden?: boolean;
}

interface KebabMenuProps {
  items: KebabItem[];
  label?: string;
  className?: string;
  /** Override the trigger glyph. */
  trigger?: ReactNode;
}

const KebabMenu = ({ items, label = "More actions", className = "", trigger }: KebabMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const visible = items.filter((i) => !i.hidden);
  if (visible.length === 0) return null;

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-label={label}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
        className="inline-flex h-7 w-7 items-center justify-center font-mono text-[14px] leading-none text-paper/55 hover:text-paper"
      >
        {trigger ?? "⋯"}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 flex min-w-[160px] flex-col border border-paper/20 bg-ink p-1 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {visible.map((it) => (
            <button
              key={it.label}
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); it.onClick(); }}
              className={`px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-paper/5 ${
                it.destructive ? "text-signal" : "text-paper/85 hover:text-paper"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KebabMenu;
