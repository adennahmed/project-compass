/**
 * DashboardDiagram — fig.01 "Internal tools & dashboards".
 *
 * Mock dashboard: app shell with top bar, sidebar, KPI tiles with sparklines,
 * a table of rows, and an activity panel. Animations: cycling sparklines,
 * pulsing status dots, a horizontal scan bar drifting down the table.
 */

interface Props {
  playing: boolean;
}

const ROWS = [0, 1, 2, 3, 4, 5];
const ACTIVITY = [0, 1, 2, 3, 4];
const KPIS = [
  { n: "247", label: "ORDERS" },
  { n: "98.4", label: "UPTIME%" },
  { n: "12m", label: "LATENCY" },
];
const SPARKLINE_PATHS = [
  "M0 14 L8 10 L16 12 L24 6 L32 9 L40 4 L48 7",
  "M0 8 L8 11 L16 7 L24 9 L32 5 L40 8 L48 3",
  "M0 12 L8 8 L16 10 L24 11 L32 7 L40 6 L48 9",
];

const DashboardDiagram = ({ playing }: Props) => {
  return (
    <svg
      className="kz-diag"
      data-playing={playing}
      viewBox="0 0 360 240"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      style={{ color: "rgb(var(--ink) / 0.7)", maxWidth: 520 }}
      role="img"
      aria-label="Dashboard mockup"
    >
      {/* App shell */}
      <rect x="6" y="6" width="348" height="228" />
      {/* Top bar */}
      <line x1="6" y1="24" x2="354" y2="24" />
      <text x="14" y="18" fontFamily="Geist Mono, monospace" fontSize="7" letterSpacing="1" fill="currentColor" stroke="none">
        DASH · v3
      </text>
      <circle cx="320" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="326" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="332" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="345" cy="15" r="4" />

      {/* Sidebar */}
      <line x1="44" y1="24" x2="44" y2="234" />
      {/* Icons: home, list, gear, chart, bell */}
      <g transform="translate(15 38)" strokeLinecap="round">
        <path d="M0 6 L7 0 L14 6 V12 H0 Z" />
      </g>
      <g transform="translate(15 62)" strokeLinecap="round">
        <line x1="0" y1="2" x2="14" y2="2" />
        <line x1="0" y1="6" x2="14" y2="6" />
        <line x1="0" y1="10" x2="14" y2="10" />
      </g>
      <g transform="translate(15 86)">
        <circle cx="7" cy="6" r="5" />
        <circle cx="7" cy="6" r="1.5" fill="currentColor" stroke="none" />
      </g>
      <g transform="translate(15 110)" strokeLinecap="round">
        <polyline points="0,12 4,7 8,9 14,2" />
      </g>
      <g transform="translate(15 134)">
        <path d="M2 9 Q2 2 7 2 Q12 2 12 9 H2 Z" />
        <line x1="6" y1="11" x2="8" y2="11" />
      </g>

      {/* Right activity panel divider */}
      <line x1="248" y1="24" x2="248" y2="234" />

      {/* KPI strip (3 tiles) — left main area */}
      {KPIS.map((kpi, i) => {
        const x = 54 + i * 64;
        return (
          <g key={i}>
            <rect x={x} y="34" width="58" height="42" />
            <text x={x + 4} y="50" fontFamily="Geist, sans-serif" fontSize="14" fontWeight="600" fill="currentColor" stroke="none">
              {kpi.n}
            </text>
            <text x={x + 4} y="60" fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="1" fill="currentColor" fillOpacity="0.55" stroke="none">
              {kpi.label}
            </text>
            <path
              className="kz-anim"
              d={SPARKLINE_PATHS[i]}
              transform={`translate(${x + 4} 64)`}
              stroke="rgb(var(--signal))"
              strokeWidth="0.9"
              strokeDasharray="120"
              style={{
                animation: `kz-diag-sparkline ${4 + i * 0.4}s linear infinite`,
                animationDelay: `${i * 0.6}s`,
              }}
            />
          </g>
        );
      })}

      {/* Table — clip so the scan bar stays inside the table area */}
      <clipPath id="dashTableClip">
        <rect x="54" y="86" width="186" height="144" />
      </clipPath>
      <g clipPath="url(#dashTableClip)">
        {/* Header row */}
        <line x1="54" y1="86" x2="240" y2="86" />
        <text x="58" y="96" fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="1" fill="currentColor" fillOpacity="0.5" stroke="none">
          STATUS  ID  CUSTOMER  AMOUNT
        </text>
        <line x1="54" y1="100" x2="240" y2="100" />

        {/* Rows */}
        {ROWS.map((r) => {
          const y = 108 + r * 20;
          const isOrange = r === 1 || r === 4;
          return (
            <g key={r}>
              <circle
                cx="60"
                cy={y}
                r="2"
                className="kz-anim"
                fill={isOrange ? "rgb(var(--signal))" : "rgb(var(--ink) / 0.55)"}
                stroke="none"
                style={{
                  animation: `kz-diag-dot-pulse ${2.4}s ease-in-out infinite`,
                  animationDelay: `${r * 0.4}s`,
                }}
              />
              <line x1="70" y1={y} x2="92" y2={y} stroke="currentColor" strokeOpacity="0.35" />
              <line x1="100" y1={y} x2="160" y2={y} stroke="currentColor" strokeOpacity="0.35" />
              <line x1="170" y1={y} x2="200" y2={y} stroke="currentColor" strokeOpacity="0.35" />
              <line x1="210" y1={y} x2="232" y2={y} stroke="currentColor" strokeOpacity="0.35" />
              <line x1="54" y1={y + 6} x2="240" y2={y + 6} stroke="currentColor" strokeOpacity="0.08" />
            </g>
          );
        })}

        {/* Scan highlight bar */}
        <rect
          x="54"
          y="104"
          width="186"
          height="14"
          className="kz-anim"
          fill="rgb(var(--signal))"
          fillOpacity="0.18"
          stroke="none"
          style={{ animation: "kz-diag-scan 5s linear infinite" }}
        />
      </g>

      {/* Activity panel (right) */}
      <text x="256" y="40" fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="1" fill="currentColor" fillOpacity="0.55" stroke="none">
        ACTIVITY
      </text>
      <line x1="256" y1="46" x2="346" y2="46" strokeOpacity="0.3" />
      {ACTIVITY.map((a) => {
        const y = 60 + a * 26;
        return (
          <g key={a}>
            <circle cx="260" cy={y} r="2.2" fill="currentColor" stroke="none" fillOpacity={a === 0 ? 1 : 0.5} />
            <line x1="260" y1={y + 3} x2="260" y2={y + 22} strokeOpacity="0.2" />
            <line x1="270" y1={y - 2} x2="340" y2={y - 2} strokeOpacity="0.35" />
            <line x1="270" y1={y + 4} x2="320" y2={y + 4} strokeOpacity="0.18" />
          </g>
        );
      })}
    </svg>
  );
};

export default DashboardDiagram;
