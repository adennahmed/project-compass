import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

/**
 * BeforeAfter — drag-to-compare block. Left: chaotic spreadsheet rendered as
 * an HTML table. Right: clean kozai-built dispatch console. Both halves are
 * fully rendered; a center handle reveals more of each via clip-path.
 *
 * Mobile (<768px): falls back to a tab toggle instead of drag, because the
 * drag interaction collapses to noise at phone widths.
 */

const ROWS = [
  ["SKU-1042", "Aurora 12pk",        "Northgate Distrib",  "ON",  "47",  "$1,284.50"],
  ["SKU-1043", "Aurora 24pk",        "Northgate Distrib",  "ON",  "12",  "$642.20"],
  ["SKU-2091", "Halcyon Tonic",      "Merrick Medical",    "QC",  "—",   "#ERR"],
  ["SKU-2092", "Halcyon Tonic L",    "Merrick Medical",    "QC",  "8",   "$214.00"],
  ["SKU-3310", "Ironwood Bracket",   "Ironwood Mfg",       "ON",  "184", "$3,941.60"],
  ["SKU-3311", "Ironwood Plate",     "Ironwood Mfg",       "ON",  "62",  "$1,302.40"],
  ["SKU-4001", "Atrium Filter",      "Atrium Partners",    "BC",  "—",   "#ERR"],
  ["SKU-4002", "Atrium Filter HD",   "Atrium Partners",    "BC",  "23",  "$1,012.50"],
  ["SKU-5512", "Harlan Pack",        "Harlan Foods",       "AB",  "401", "$8,422.00"],
  ["SKU-5513", "Harlan Pack XL",     "Harlan Foods",       "AB",  "98",  "$3,140.80"],
  ["SKU-6720", "Fairlane Strap",     "Fairlane Freight",   "ON",  "—",   "TBD"],
];

const Spreadsheet = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FBFAF6] font-mono text-[11px] text-ink/85">
      {/* Faux Excel toolbar */}
      <div className="flex items-center gap-3 border-b border-ink/15 bg-[#E8E4D8] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink/55">
        <span>inventory_2026_05_v17_FINAL_v2.xlsx</span>
        <span className="ml-auto text-ink/40">— Excel</span>
      </div>
      <div className="flex items-center gap-2 border-b border-ink/10 bg-[#F3EFE3] px-3 py-1 text-[10px] text-ink/60">
        <span>A1</span>
        <span className="text-ink/30">|</span>
        <span className="text-ink/55">fx</span>
        <span className="text-ink/40">=SUM(F2:F47)</span>
      </div>
      <div className="overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#EDE8D9] text-[10px] uppercase tracking-[0.14em] text-ink/55">
              {["A · SKU", "B · Item", "C · Client", "D · Prov", "E · Qty", "F · Value"].map((h) => (
                <th key={h} className="border border-ink/15 px-2 py-1 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-[#FBFAF6]" : "bg-[#F6F2E6]"}>
                {r.map((cell, ci) => {
                  const isErr = cell === "#ERR";
                  const isTbd = cell === "TBD";
                  return (
                    <td
                      key={ci}
                      className="border border-ink/10 px-2 py-[3px] tabular-nums"
                      style={{
                        color: isErr ? "#B5321A" : isTbd ? "#A85B12" : undefined,
                        background: isErr ? "rgba(181,50,26,0.08)" : undefined,
                      }}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-[#EFEAD9]">
              <td className="border border-ink/15 px-2 py-1 text-ink/55" colSpan={4}>
                Σ Row totals
              </td>
              <td className="border border-ink/15 px-2 py-1 tabular-nums text-ink/70">835</td>
              <td className="border border-ink/15 px-2 py-1 tabular-nums text-ink/70">$19,960</td>
            </tr>
            <tr>
              <td className="border border-ink/10 px-2 py-1 text-[10px] text-ink/45" colSpan={6}>
                ! 2 errors in column F — VLOOKUP returning #N/A for SKU-2091, SKU-4001
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 border-t border-ink/15 bg-[#E8E4D8] px-3 py-1 text-[9px] uppercase tracking-[0.14em] text-ink/55">
        <span>Sheet1</span>
        <span>Sheet2</span>
        <span>backup_2025-12-03 (3)</span>
        <span>do_not_delete</span>
        <span className="ml-auto text-[#B5321A]">2 errors</span>
      </div>
    </div>
  );
};

const KozaiConsole = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-paper">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-hairline/15 px-5 py-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
            Dispatch · Inventory
          </div>
          <div className="mt-1 text-[15px] font-semibold text-ink">Stock on hand</div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-ink px-4 py-2 text-[12px] font-medium text-paper"
        >
          New dispatch <span aria-hidden>↘</span>
        </button>
      </div>
      <div className="flex items-center gap-4 border-b border-hairline/10 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        <span className="text-ink">All · 11</span>
        <span>Out of stock · 2</span>
        <span>Pending · 1</span>
        <span className="ml-auto">May 17, 2026</span>
      </div>
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="text-mute">
            {["SKU", "Item", "Client", "Region", "Qty", "Value"].map((h) => (
              <th key={h} className="border-b border-hairline/15 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.slice(0, 8).map((r, i) => {
            const flagged = r[4] === "—";
            return (
              <tr key={i} className="border-b border-hairline/10 last:border-b-0">
                <td className="px-5 py-2.5 font-mono text-[12px] text-ink/85">{r[0]}</td>
                <td className="px-5 py-2.5 text-ink">{r[1]}</td>
                <td className="px-5 py-2.5 text-ink/75">{r[2]}</td>
                <td className="px-5 py-2.5 text-mute">{r[3]}</td>
                <td className="px-5 py-2.5 tabular-nums text-ink">
                  {flagged ? (
                    <span className="inline-flex items-center gap-1.5 text-signal">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      reorder
                    </span>
                  ) : (
                    r[4]
                  )}
                </td>
                <td className="px-5 py-2.5 tabular-nums text-ink">{flagged ? "—" : r[5]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-hairline/15 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        <span>↘ 11 items · 2 need reorder</span>
        <span className="text-ink">$19,960 on hand</span>
      </div>
    </div>
  );
};

const BeforeAfter = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50); // percent
  const [dragging, setDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<"before" | "after">("before");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 4));
  };

  return (
    <section
      id="before-after"
      data-snap
      className="relative px-6 py-24 md:px-10 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ ✦ — Before / After ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[26ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}
              >
                The spreadsheet you have.
                <span className="text-mute"> The screen you could have.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {isMobile ? (
          <div>
            <div className="mb-3 inline-flex border border-hairline/20">
              {(["before", "after"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMobileTab(t)}
                  className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] ${
                    mobileTab === t ? "bg-ink text-paper" : "text-mute"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative h-[520px] border border-hairline/15">
              {mobileTab === "before" ? <Spreadsheet /> : <KozaiConsole />}
            </div>
          </div>
        ) : (
          <div
            ref={wrapRef}
            className="relative h-[520px] select-none overflow-hidden border border-hairline/15"
            onPointerDown={(e) => {
              setDragging(true);
              setFromClientX(e.clientX);
            }}
          >
            {/* After (full background) */}
            <div className="absolute inset-0">
              <KozaiConsole />
            </div>
            {/* Before (clipped over the top) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Spreadsheet />
            </div>

            {/* Handle */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Before / after compare slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              onKeyDown={onKeyDown}
              className="absolute top-0 z-10 h-full w-px bg-signal"
              style={{ left: `calc(${pos}% - 0.5px)`, cursor: "ew-resize" }}
            >
              <span
                className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-signal bg-paper font-mono text-[12px] text-signal"
                aria-hidden
              >
                ⇆
              </span>
              <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
                before
              </span>
              <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-signal -translate-x-full">
                after
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span>[ ✦ — Before / After ] · {isMobile ? "Toggle to compare." : "Drag to compare."}</span>
          <span className="hidden md:inline">fig.05 — same data, two surfaces</span>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
