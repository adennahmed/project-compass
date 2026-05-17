import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

/**
 * BeforeAfter — drag-to-compare block.
 * LEFT (Before):  chaotic spreadsheet.
 * RIGHT (After):  kozai-built dispatch operator console.
 * Drag the handle right to reveal more of After.
 *
 * Mobile (<768px): tab toggle.
 */

const SHEET_ROWS = [
  ["SKU-1042", "Aurora 12pk",        "Northgate Distrib",  "ON",  "47",   "$1,284.50"],
  ["SKU-1043", "Aurora 24pk",        "Northgate Distrib",  "ON",  "12",   "$642.20"],
  ["SKU-2091", "Halcyon Tonic",      "Merrick Medical",    "QC",  "—",    "#REF!"],
  ["SKU-2092", "Halcyon Tonic L",    "Merrick Medical",    "QC",  "8",    "$214.00"],
  ["SKU-3310", "Ironwood Bracket",   "Ironwood Mfg",       "ON",  "184",  "$3,941.60"],
  ["SKU-3311", "Ironwood Plate",     "Ironwood Mfg",       "ON",  "62",   "$1,302.40"],
  ["SKU-4001", "Atrium Filter",      "Atrium Partners",    "BC",  "—",    "#ERROR!"],
  ["SKU-4002", "Atrium Filter HD",   "Atrium Partners",    "BC",  "23",   "$1,012.50"],
  ["SKU-5512", "Harlan Pack",        "Harlan Foods",       "AB",  "401",  "$8,422.00"],
  ["SKU-5513", "Harlan Pack XL",     "Harlan Foods",       "AB",  "98",   "$3,140.80"],
  ["SKU-6720", "Fairlane Strap",     "Fairlane Freight",   "ON",  "??",   "TBD"],
  ["SKU-6721", "Fairlane Strap XL",  "fairlane freight",   "on",  "44",   "#N/A"],
];

const Spreadsheet = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FBFAF6] font-mono text-[11px] text-ink/85">
      {/* Faux Excel toolbar */}
      <div className="flex items-center gap-3 border-b border-ink/15 bg-[#E8E4D8] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink/55">
        <span>inventory_2026_05_v17_FINAL_v2 (copy)(jen-edits).xlsx</span>
        <span className="ml-auto text-ink/40">— Excel</span>
      </div>
      <div className="flex items-center gap-2 border-b border-ink/10 bg-[#F3EFE3] px-3 py-1 text-[10px] text-ink/60">
        <span>F12</span>
        <span className="text-ink/30">|</span>
        <span className="text-ink/55">fx</span>
        <span className="text-ink/40">=IFERROR(VLOOKUP(A12,prices!A:C,3,FALSE),"#REF!")</span>
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
            {SHEET_ROWS.map((r, i) => {
              const highlight = i === 4 ? "rgba(252,211,77,0.35)" : i === 8 ? "rgba(134,239,172,0.30)" : undefined;
              return (
                <tr key={i} className={i % 2 ? "bg-[#FBFAF6]" : "bg-[#F6F2E6]"}>
                  {r.map((cell, ci) => {
                    const isErr = cell === "#REF!" || cell === "#ERROR!" || cell === "#N/A";
                    const isTbd = cell === "TBD" || cell === "??";
                    return (
                      <td
                        key={ci}
                        className="border border-ink/15 px-2 py-[3px] tabular-nums"
                        style={{
                          color: isErr ? "#B5321A" : isTbd ? "#A85B12" : undefined,
                          background: isErr ? "rgba(181,50,26,0.10)" : ci === 0 ? undefined : highlight,
                          fontWeight: isErr ? 600 : undefined,
                        }}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* merged-looking totals row */}
            <tr className="bg-[#EFEAD9]">
              <td className="border border-ink/15 px-2 py-1 text-ink/55" colSpan={4}>
                Σ Row totals (manual — fix later)
              </td>
              <td className="border border-ink/15 px-2 py-1 tabular-nums text-ink/70">879?</td>
              <td className="border border-ink/15 px-2 py-1 tabular-nums" style={{ color: "#B5321A" }}>#REF!</td>
            </tr>
            <tr className="bg-[#FBFAF6]">
              <td className="border border-ink/10 px-2 py-1 text-[10px] text-ink/55" colSpan={3}>
                =SUMIF(D:D,"ON",F:F)
              </td>
              <td className="border border-ink/10 px-2 py-1 tabular-nums text-ink/55" colSpan={3}>
                $15,183 (excl. errors)
              </td>
            </tr>
            <tr>
              <td className="border border-ink/10 px-2 py-1 text-[10px] text-ink/45" colSpan={6}>
                ! 3 errors in col F · VLOOKUP returning #N/A for SKU-2091, SKU-4001, SKU-6721 · case mismatch row 13
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
        <span>prices_OLD</span>
        <span className="ml-auto text-[#B5321A]">3 errors · unsaved 14m</span>
      </div>
    </div>
  );
};

const DISPATCHES = [
  { route: "RT-2841", customer: "Northgate Distribution", vehicle: "TRK-12", status: "in transit", eta: "ETA 2:14p" },
  { route: "RT-2842", customer: "Merrick Medical", vehicle: "TRK-04", status: "scheduled", eta: "Depart 1:30p" },
  { route: "RT-2843", customer: "Ironwood Mfg", vehicle: "TRK-09", status: "delivered", eta: "Done 12:48p" },
  { route: "RT-2844", customer: "Atrium Partners", vehicle: "TRK-15", status: "in transit", eta: "ETA 3:02p" },
  { route: "RT-2845", customer: "Harlan Foods", vehicle: "TRK-21", status: "scheduled", eta: "Depart 2:45p" },
  { route: "RT-2846", customer: "Fairlane Freight", vehicle: "TRK-07", status: "delivered", eta: "Done 11:32a" },
];

const statusColor = (s: string) => {
  if (s === "in transit") return { color: "#F5803E", bg: "rgba(245,128,62,0.10)" };
  if (s === "delivered") return { color: "#3E8F5A", bg: "rgba(62,143,90,0.10)" };
  return { color: "rgba(15,15,18,0.55)", bg: "rgba(15,15,18,0.05)" };
};

const KozaiConsole = () => {
  const selected = DISPATCHES[0];
  return (
    <div className="relative h-full w-full overflow-hidden bg-paper">
      {/* Top bar */}
      <div className="flex items-center gap-4 border-b border-ink/12 px-5 py-2.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">DISPATCH · v2.1</div>
        <div className="relative mx-auto w-[280px]">
          <input
            disabled
            value="Search route, customer, vehicle…"
            className="w-full border border-ink/12 bg-paper px-3 py-1.5 font-mono text-[11px] text-mute/70"
            readOnly
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 border border-ink/15 bg-ink/5 flex items-center justify-center font-mono text-[10px] text-ink/70">JR</div>
          <div className="leading-tight">
            <div className="text-[11px] text-ink">Jen Reyes</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Lead dispatcher</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-ink/10 px-5 py-2">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="border border-ink/20 px-2 py-1 text-ink">Today · All · Pending · 6</span>
          <span className="border border-ink/15 px-2 py-1 text-mute">Region · GTA-West</span>
          <span className="border border-ink/15 px-2 py-1 text-mute">Status · Active</span>
        </div>
        <button
          type="button"
          className="ml-auto px-3 py-1.5 text-[12px] font-medium"
          style={{ background: "#F5803E", color: "#F1EEE5" }}
        >
          + New dispatch
        </button>
      </div>

      {/* Split body */}
      <div className="flex" style={{ height: "calc(100% - 96px - 28px)" }}>
        {/* LEFT 60% — dispatch rows */}
        <div className="w-[60%] border-r border-ink/10 overflow-hidden">
          <ul>
            {DISPATCHES.map((d, i) => {
              const isActive = i === 0;
              const sc = statusColor(d.status);
              return (
                <li
                  key={d.route}
                  className="flex items-center gap-3 border-b border-ink/08 px-4 py-2.5"
                  style={{
                    borderLeft: isActive ? "2px solid #F5803E" : "2px solid transparent",
                    background: isActive ? "rgba(245,128,62,0.04)" : undefined,
                  }}
                >
                  <div className="font-mono text-[11px] text-ink/85 w-[60px]">{d.route}</div>
                  <div className="flex-1 text-[13px] text-ink truncate">{d.customer}</div>
                  <div className="font-mono text-[10px] text-mute w-[54px]">{d.vehicle}</div>
                  <div
                    className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5"
                    style={{ color: sc.color, background: sc.bg }}
                  >
                    {d.status}
                  </div>
                  <div className="font-mono text-[10px] text-ink/70 w-[78px] text-right">{d.eta}</div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT 40% — detail panel */}
        <div className="w-[40%] flex flex-col">
          <div className="border-b border-ink/10 px-4 py-2.5">
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute">Selected · {selected.route}</div>
            <div className="mt-0.5 text-[14px] font-semibold text-ink">{selected.customer}</div>
          </div>
          <div className="px-4 py-3 space-y-2.5 text-[12px] text-ink/80 leading-[1.5]">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute mb-0.5">Address</div>
              <div>418 Industrial Pkwy, Hamilton ON</div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute mb-0.5">Contact</div>
              <div>Marcus Hale · (905) 555-0142</div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute mb-0.5">Notes</div>
              <div className="text-ink/70">Dock B · ring bell twice. Avoid 10–11a shift change.</div>
            </div>
          </div>

          {/* Tiny route map */}
          <div className="mx-4 mb-3 border border-ink/10 bg-ink/02 p-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute mb-1">Route</div>
            <svg viewBox="0 0 200 50" width="100%" height="40" aria-hidden>
              <path
                d="M 8 35 Q 40 10, 70 30 T 130 22 T 192 14"
                fill="none"
                stroke="#0F0F12"
                strokeOpacity="0.65"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="8" cy="35" r="2.5" fill="#0F0F12" />
              <circle cx="70" cy="30" r="2.5" fill="#0F0F12" />
              <circle cx="130" cy="22" r="2.5" fill="#0F0F12" />
              <circle cx="192" cy="14" r="3" fill="#F5803E" />
            </svg>
          </div>

          <button
            type="button"
            className="mx-4 mb-4 mt-auto px-3 py-2 text-[12px] font-medium border border-ink"
            style={{ background: "#0F0F12", color: "#F1EEE5" }}
          >
            Mark delivered
          </button>
        </div>
      </div>

      {/* Bottom status */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-ink/12 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        <span>[ ✦ — synced 12s ago ]</span>
        <span className="text-ink/70">6 active · 2 delivered today</span>
      </div>
    </div>
  );
};

const BeforeAfter = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50); // percent — width of LEFT (Before) pane
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
            <div className="relative h-[560px] border border-hairline/15">
              {mobileTab === "before" ? <Spreadsheet /> : <KozaiConsole />}
            </div>
          </div>
        ) : (
          <div
            ref={wrapRef}
            className="relative h-[560px] select-none overflow-hidden border border-hairline/15"
            onPointerDown={(e) => {
              setDragging(true);
              setFromClientX(e.clientX);
            }}
          >
            {/* After (right, full background) */}
            <div className="absolute inset-0">
              <KozaiConsole />
            </div>
            {/* Before (clipped from left — visible from 0 to pos%) */}
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
              {/* "before" label — sits LEFT of handle, over the spreadsheet */}
              <span className="absolute right-3 top-3 -translate-x-full whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
                before
              </span>
              {/* "after" label — sits RIGHT of handle, over the console */}
              <span className="absolute left-3 top-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
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
