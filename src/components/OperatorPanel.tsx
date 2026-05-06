import { useEffect, useRef, useState } from "react";

/**
 * OperatorPanel — the hero's anchor visual.
 *
 * A hand-built canvas dashboard. Three live elements:
 *   1. A primary sparkline that breathes (sinewave-driven, real-feel)
 *   2. A bar histogram beside it
 *   3. Three status pills with mono labels and changing values
 *
 * Pure 2D canvas — no Three.js. Cheap to render, sharp on retina, themeable
 * via CSS custom properties pulled at mount.
 *
 * The panel is *the brand*: this is what Kozai sells, in miniature.
 */

interface OperatorPanelProps {
  className?: string;
}

const OperatorPanel = ({ className = "" }: OperatorPanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    revenue: "$184,210",
    incidents: "−83%",
    uptime: "99.98%",
    eventsPerSec: 2147,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Source colors from CSS variables so the panel re-themes for free.
    const css = getComputedStyle(document.documentElement);
    const ink = `rgb(${css.getPropertyValue("--ink").trim()})`;
    const mute = `rgb(${css.getPropertyValue("--mute").trim()})`;
    const signal = `rgb(${css.getPropertyValue("--signal").trim()})`;
    const hairline = `rgba(${css.getPropertyValue("--hairline").trim()} / 0.15)`;

    let raf = 0;
    const start = performance.now();

    // Sparkline data — 80 points, scrolling buffer
    const points = new Array(80).fill(0).map((_, i) => 0.5 + Math.sin(i * 0.18) * 0.18);

    const tick = () => {
      const t = (performance.now() - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Layout: left 60% sparkline, right 40% bar histogram
      const padding = 24 * dpr;
      const sparkX = padding;
      const sparkY = padding;
      const sparkW = w * 0.6 - padding * 1.5;
      const sparkH = h - padding * 2;

      const barX = w * 0.6 + padding * 0.5;
      const barY = padding;
      const barW = w * 0.4 - padding * 1.5;
      const barH = h - padding * 2;

      // Background hairline grid for sparkline
      ctx.strokeStyle = hairline;
      ctx.lineWidth = 1 * dpr;
      for (let i = 0; i <= 4; i++) {
        const y = sparkY + (sparkH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(sparkX, y);
        ctx.lineTo(sparkX + sparkW, y);
        ctx.stroke();
      }

      // Update sparkline buffer
      points.shift();
      const newPt = 0.5 + Math.sin(t * 0.9) * 0.22 + Math.sin(t * 2.4) * 0.06 + (Math.random() - 0.5) * 0.04;
      points.push(Math.max(0.08, Math.min(0.92, newPt)));

      // Draw sparkline area (filled to baseline) + line
      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY + sparkH);
      points.forEach((p, i) => {
        const x = sparkX + (sparkW / (points.length - 1)) * i;
        const y = sparkY + sparkH * (1 - p);
        if (i === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(sparkX + sparkW, sparkY + sparkH);
      ctx.closePath();
      ctx.fillStyle = `rgba(${css.getPropertyValue("--ink").trim()} / 0.06)`;
      ctx.fill();

      // Sparkline stroke
      ctx.beginPath();
      points.forEach((p, i) => {
        const x = sparkX + (sparkW / (points.length - 1)) * i;
        const y = sparkY + sparkH * (1 - p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      // Latest point dot — vermilion
      const last = points[points.length - 1];
      const lastX = sparkX + sparkW;
      const lastY = sparkY + sparkH * (1 - last);
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.5 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = signal;
      ctx.fill();
      // Pulse ring
      const pulseR = 3.5 * dpr + ((t * 60) % 18) * dpr * 0.3;
      const pulseAlpha = Math.max(0, 1 - ((t * 60) % 18) / 18);
      ctx.strokeStyle = `rgba(${css.getPropertyValue("--signal").trim()} / ${pulseAlpha * 0.5})`;
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.arc(lastX, lastY, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      // Bar histogram — 12 vertical bars, animated heights
      const bars = 12;
      const gap = 4 * dpr;
      const bWidth = (barW - gap * (bars - 1)) / bars;
      for (let i = 0; i < bars; i++) {
        const phase = t * 0.6 + i * 0.45;
        const norm = 0.4 + Math.sin(phase) * 0.25 + Math.sin(phase * 1.7) * 0.12 + i * 0.015;
        const value = Math.max(0.1, Math.min(0.95, norm));
        const x = barX + i * (bWidth + gap);
        const yTop = barY + barH * (1 - value);
        ctx.fillStyle = i === bars - 1 ? signal : ink;
        ctx.fillRect(x, yTop, bWidth, barY + barH - yTop);
      }

      // Sparkline label (top-left of panel — drawn on canvas for crispness)
      ctx.fillStyle = mute;
      ctx.font = `${10 * dpr}px Geist Mono, ui-monospace, monospace`;
      ctx.textBaseline = "top";
      ctx.fillText("REVENUE — last 30 days", sparkX, sparkY - 16 * dpr);

      ctx.fillText("EVENTS — by hour", barX, barY - 16 * dpr);

      if (!reduced) raf = requestAnimationFrame(tick);
    };
    if (reduced) tick();
    else raf = requestAnimationFrame(tick);

    // Update stat numbers every couple of seconds for life-like feel
    const statTimer = window.setInterval(() => {
      setStats((s) => ({
        ...s,
        eventsPerSec: 1900 + Math.floor(Math.random() * 600),
      }));
    }, 1800);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.clearInterval(statTimer);
    };
  }, []);

  return (
    <div className={`kz-panel ${className}`}>
      {/* Header strip */}
      <header className="flex items-center justify-between border-b border-hairline/15 px-5 py-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            ops · meridian-dashboard
          </span>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:block">
          live · 04 / 06 panels
        </div>
      </header>

      {/* Canvas — ratio 2:1 */}
      <div ref={wrapRef} className="relative aspect-[2/1] w-full">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 border-t border-hairline/15 sm:grid-cols-4">
        <Stat label="Revenue · MTD" value={stats.revenue} />
        <Stat label="Incidents" value={stats.incidents} accent />
        <Stat label="Uptime" value={stats.uptime} />
        <Stat label="Events / sec" value={stats.eventsPerSec.toLocaleString()} live />
      </div>
    </div>
  );
};

const Stat = ({
  label,
  value,
  accent,
  live,
}: {
  label: string;
  value: string;
  accent?: boolean;
  live?: boolean;
}) => (
  <div className="border-l border-hairline/15 px-5 py-4 first:border-l-0">
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
      {label}
      {live && (
        <span aria-hidden className="inline-block h-1 w-1 animate-pulse rounded-full bg-signal" />
      )}
    </div>
    <div
      className={`mt-2 font-mono text-[20px] font-medium tabular-nums ${
        accent ? "text-signal" : "text-ink"
      }`}
    >
      {value}
    </div>
  </div>
);

export default OperatorPanel;
