/**
 * AnalyticsDiagram — fig.04 "Data & decision support".
 *
 * Left half: stacked area chart (3 layers, different stroke patterns) with
 * X-axis month labels and a sliding marker on the top edge. Right half:
 * "current value" callout (with bobbing up-arrow), horizontal bar chart
 * (longest bar = signal orange, breathing animation), data quality dots.
 */

interface Props {
  playing: boolean;
}

// Pre-computed smooth curves across ~30 sample positions, three stacked layers.
// Coordinates are within the left-half viewBox region (x: 0–180, y: 0–160).
const LAYER_BASE_Y = 130;

// Generate three smooth-ish lines with sample points.
const makeLayer = (offset: number, amplitude: number, phase: number) => {
  const pts: string[] = [];
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 170 + 10;
    const y =
      LAYER_BASE_Y -
      offset -
      Math.sin(i * 0.4 + phase) * amplitude -
      Math.cos(i * 0.22 + phase * 0.7) * (amplitude * 0.55);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};

const LAYER_1 = makeLayer(0, 14, 0.3); // bottom, solid
const LAYER_2 = makeLayer(22, 12, 1.1); // middle, dashed
const LAYER_3 = makeLayer(46, 10, 2.0); // top, dotted

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];

const BARS = [
  { label: "Region A", w: 86, orange: false },
  { label: "Region B", w: 112, orange: false },
  { label: "Region C", w: 140, orange: true }, // longest
  { label: "Region D", w: 70, orange: false },
  { label: "Region E", w: 54, orange: false },
];

const QUALITY = ["FRESHNESS", "COMPLETENESS", "VARIANCE"];

const AnalyticsDiagram = ({ playing }: Props) => {
  return (
    <svg
      className="kz-diag"
      data-playing={playing}
      viewBox="0 0 400 240"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      style={{ color: "rgb(var(--ink) / 0.75)", maxWidth: 520 }}
      role="img"
      aria-label="Analytics view"
    >
      {/* === LEFT HALF: stacked area chart === */}
      <g transform="translate(6 16)">
        {/* Frame */}
        <line x1="6" y1="0" x2="6" y2="142" strokeOpacity="0.4" />
        <line x1="6" y1="142" x2="186" y2="142" strokeOpacity="0.4" />
        {/* Y-axis ticks */}
        {[0, 1, 2, 3, 4].map((t) => (
          <g key={t}>
            <line x1="3" y1={t * 30 + 10} x2="6" y2={t * 30 + 10} strokeOpacity="0.4" />
            <line x1="6" y1={t * 30 + 10} x2="186" y2={t * 30 + 10} strokeOpacity="0.07" strokeDasharray="1 2" />
          </g>
        ))}
        {/* Layers */}
        <path d={LAYER_1} stroke="currentColor" strokeOpacity="0.55" />
        <path d={LAYER_2} stroke="currentColor" strokeOpacity="0.5" strokeDasharray="4 2" />
        <path d={LAYER_3} stroke="currentColor" strokeOpacity="0.45" strokeDasharray="1 2" />
        {/* X-axis labels (with one cycling-bold via animation delays) */}
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={20 + i * 30}
            y="154"
            fontFamily="Geist Mono, monospace"
            fontSize="6"
            letterSpacing="1.4"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            className="kz-anim"
            style={{
              animation: `kz-diag-tick-bold 8s linear infinite`,
              animationDelay: `${(i / MONTHS.length) * 8}s`,
            }}
          >
            {m}
          </text>
        ))}
        {/* Sliding marker dot on top edge */}
        <g
          className="kz-anim"
          style={{
            animation: "kz-diag-marker-slide 8s linear infinite",
            transformOrigin: "0 0",
          }}
        >
          <line x1="22" y1="6" x2="22" y2="142" stroke="rgb(var(--signal))" strokeOpacity="0.35" strokeDasharray="1 3" />
          <circle cx="22" cy="6" r="2.5" fill="rgb(var(--signal))" stroke="none" />
        </g>
      </g>

      {/* === RIGHT HALF === */}
      {/* Current value callout */}
      <g transform="translate(210 18)">
        <text x="0" y="18" fontFamily="Geist, sans-serif" fontSize="22" fontWeight="600" fill="currentColor" stroke="none" letterSpacing="-0.5">
          427
        </text>
        <g
          transform="translate(48 4)"
          className="kz-anim"
          style={{
            animation: "kz-diag-bob 2s ease-in-out infinite",
          }}
        >
          <path d="M0 8 L4 0 L8 8 Z" fill="rgb(var(--signal))" stroke="none" />
          <text x="12" y="8" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="0.5" fill="rgb(var(--signal))" stroke="none">
            +12%
          </text>
        </g>
        <text x="0" y="30" fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="1.4" fill="currentColor" fillOpacity="0.55" stroke="none">
          ACTIVE CUSTOMERS · 7D
        </text>
        <line x1="0" y1="38" x2="170" y2="38" strokeOpacity="0.18" />
      </g>

      {/* Bar chart */}
      <g transform="translate(210 64)">
        <text x="0" y="0" fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="1.4" fill="currentColor" fillOpacity="0.55" stroke="none">
          BY REGION
        </text>
        {BARS.map((b, i) => {
          const y = 10 + i * 16;
          return (
            <g key={b.label}>
              <text x="0" y={y + 6} fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="0.8" fill="currentColor" fillOpacity="0.6" stroke="none">
                {b.label.toUpperCase()}
              </text>
              <rect
                x="42"
                y={y}
                width={b.w}
                height="8"
                className="kz-anim"
                fill={b.orange ? "rgb(var(--signal))" : "rgb(var(--ink))"}
                fillOpacity={b.orange ? 0.85 : 0.4}
                stroke="none"
                style={{
                  transformOrigin: "42px center",
                  animation: `kz-diag-bar-breathe 4s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
              <text x={42 + b.w + 4} y={y + 6} fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="0.5" fill="currentColor" fillOpacity="0.5" stroke="none">
                {Math.round(b.w * 1.4)}
              </text>
            </g>
          );
        })}
      </g>

      {/* Data quality */}
      <g transform="translate(210 188)">
        <text x="0" y="0" fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="1.4" fill="currentColor" fillOpacity="0.55" stroke="none">
          DATA QUALITY
        </text>
        {QUALITY.map((q, i) => (
          <g key={q} transform={`translate(${i * 60} 10)`}>
            <circle cx="3" cy="3" r="3" fill="currentColor" fillOpacity="0.75" stroke="none" />
            <text x="10" y="6" fontFamily="Geist Mono, monospace" fontSize="5" letterSpacing="1.2" fill="currentColor" fillOpacity="0.6" stroke="none">
              {q}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default AnalyticsDiagram;
