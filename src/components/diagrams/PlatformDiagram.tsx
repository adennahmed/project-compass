/**
 * PlatformDiagram — fig.03 "Client-facing platforms".
 *
 * Stacked layer cards (Customer UI / API Layer / Infrastructure). Cursor
 * clicks loop on the top card; orange "request" dots travel up the
 * connecting lines between layers; endpoint lines flash when a dot passes.
 */

interface Props {
  playing: boolean;
}

const METHODS = [
  { m: "GET", label: "/api/orders" },
  { m: "POST", label: "/api/orders" },
  { m: "PATCH", label: "/api/orders/:id" },
  { m: "GET", label: "/api/customers" },
  { m: "POST", label: "/api/billing/charge" },
];

const PlatformDiagram = ({ playing }: Props) => {
  return (
    <svg
      className="kz-diag"
      data-playing={playing}
      viewBox="0 0 400 260"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      style={{ color: "rgb(var(--ink) / 0.7)", maxWidth: 520 }}
      role="img"
      aria-label="Platform stack"
    >
      {/* === BOTTOM CARD: INFRASTRUCTURE === */}
      <g transform="translate(0 170)">
        <rect x="6" y="0" width="320" height="64" />
        <text x="14" y="14" fontFamily="Geist Mono, monospace" fontSize="7" letterSpacing="1.6" fill="currentColor" stroke="none">
          INFRASTRUCTURE
        </text>
        {/* postgres cylinder */}
        <g transform="translate(20 26)">
          <ellipse cx="14" cy="4" rx="14" ry="3.5" />
          <path d="M0 4 V26 Q0 30 14 30 Q28 30 28 26 V4" />
          <path d="M0 14 Q0 18 14 18 Q28 18 28 14" />
        </g>
        {/* server */}
        <g transform="translate(70 26)">
          <rect x="0" y="0" width="34" height="10" />
          <rect x="0" y="14" width="34" height="10" />
          <circle cx="4" cy="5" r="1" fill="currentColor" stroke="none" />
          <circle cx="4" cy="19" r="1" fill="currentColor" stroke="none" />
        </g>
        {/* cloud */}
        <g transform="translate(118 28)">
          <path d="M4 18 Q-2 18 0 12 Q0 6 8 6 Q10 0 18 2 Q26 0 28 8 Q34 8 32 16 Q32 20 26 20 H4 Z" />
        </g>
        <text x="160" y="34" fontFamily="Geist Mono, monospace" fontSize="6" letterSpacing="1" fill="currentColor" fillOpacity="0.55" stroke="none">
          postgres · fly.io · cloudflare
        </text>
      </g>

      {/* === MIDDLE CARD: API LAYER === */}
      <g transform="translate(20 90)">
        <rect x="6" y="0" width="320" height="70" />
        <text x="14" y="14" fontFamily="Geist Mono, monospace" fontSize="7" letterSpacing="1.6" fill="currentColor" stroke="none">
          API LAYER
        </text>
        {METHODS.map((ep, i) => {
          const y = 24 + i * 9;
          const tagWidth = ep.m === "PATCH" ? 22 : ep.m === "POST" ? 18 : 14;
          return (
            <g key={i}>
              <rect x="14" y={y - 5} width={tagWidth} height="7" stroke="currentColor" strokeOpacity="0.6" />
              <text x={14 + tagWidth / 2} y={y + 0.5} fontFamily="Geist Mono, monospace" fontSize="5" textAnchor="middle" fill="currentColor" stroke="none">
                {ep.m}
              </text>
              <line
                x1={14 + tagWidth + 6}
                y1={y - 1.5}
                x2="300"
                y2={y - 1.5}
                className="kz-anim"
                stroke="currentColor"
                strokeOpacity="0.4"
                style={{
                  animation: `kz-diag-node-flash 4s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
              <text x={20 + tagWidth + 6} y={y + 0.5} fontFamily="Geist Mono, monospace" fontSize="5" fill="currentColor" fillOpacity="0.5" stroke="none">
                {ep.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* === TOP CARD: CUSTOMER UI === */}
      <g transform="translate(40 10)">
        <rect x="6" y="0" width="320" height="70" />
        <text x="14" y="14" fontFamily="Geist Mono, monospace" fontSize="7" letterSpacing="1.6" fill="currentColor" stroke="none">
          CUSTOMER UI
        </text>
        {/* Browser frame */}
        <g transform="translate(14 20)">
          <rect x="0" y="0" width="300" height="44" />
          <line x1="0" y1="8" x2="300" y2="8" />
          <circle cx="4" cy="4" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="9" cy="4" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="14" cy="4" r="1.3" fill="currentColor" stroke="none" />
          {/* Mini screen — header bar + two columns */}
          <rect x="6" y="12" width="288" height="6" fill="currentColor" fillOpacity="0.1" stroke="none" />
          <line x1="6" y1="24" x2="140" y2="24" strokeOpacity="0.35" />
          <line x1="6" y1="29" x2="120" y2="29" strokeOpacity="0.2" />
          <line x1="6" y1="34" x2="130" y2="34" strokeOpacity="0.2" />
          <line x1="6" y1="39" x2="100" y2="39" strokeOpacity="0.2" />
          <line x1="160" y1="24" x2="294" y2="24" strokeOpacity="0.35" />
          <line x1="160" y1="29" x2="280" y2="29" strokeOpacity="0.2" />
          <line x1="160" y1="34" x2="270" y2="34" strokeOpacity="0.2" />
          {/* Button area */}
          <rect x="6" y="38" width="40" height="6" stroke="currentColor" strokeOpacity="0.7" />
          {/* Cursor + click ripple */}
          <g transform="translate(24 36)">
            <path d="M0 0 L0 9 L2.5 7 L4 10 L6 9 L4 6 L7 6 Z" stroke="currentColor" strokeWidth="0.8" fill="rgb(var(--paper))" />
            <circle
              cx="2"
              cy="6"
              r="3"
              className="kz-anim"
              fill="none"
              stroke="rgb(var(--signal))"
              strokeWidth="0.8"
              style={{
                animation: "kz-diag-cursor-click 4s ease-in-out infinite",
                transformOrigin: "2px 6px",
              }}
            />
          </g>
        </g>
      </g>

      {/* === CONNECTING LINES with traveling dots === */}
      {/* Connect API layer (middle) to UI (top) */}
      {[110, 180, 250].map((x, i) => (
        <g key={`u-${i}`}>
          <line x1={x} y1="80" x2={x} y2="110" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 3" />
          <circle
            cx={x}
            cy="110"
            r="2"
            className="kz-anim"
            fill="rgb(var(--signal))"
            stroke="none"
            style={{
              animation: `kz-diag-flow-up 3s linear infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        </g>
      ))}
      {/* Connect infrastructure (bottom) to API (middle) */}
      {[110, 180, 250].map((x, i) => (
        <g key={`l-${i}`}>
          <line x1={x} y1="160" x2={x} y2="190" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 3" />
          <circle
            cx={x}
            cy="190"
            r="2"
            className="kz-anim"
            fill="rgb(var(--signal))"
            stroke="none"
            style={{
              animation: `kz-diag-flow-up 3s linear infinite`,
              animationDelay: `${0.3 + i * 0.7}s`,
            }}
          />
        </g>
      ))}
    </svg>
  );
};

export default PlatformDiagram;
