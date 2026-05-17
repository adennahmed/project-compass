/**
 * WorkflowDiagram — fig.02 "Workflow automation".
 *
 * Directed graph of labelled nodes, with one branching point. A traveling
 * orange token (and a forked sibling at the branch) flows along the edges
 * continuously while playing=true. Uses CSS offset-path for path animation.
 */

interface Props {
  playing: boolean;
}

// Layout: x,y of node top-left; each node is 60x24.
const NODES: Array<{ id: string; label: string; x: number; y: number; trigger?: boolean }> = [
  { id: "intake", label: "INTAKE", x: 8, y: 100, trigger: true },
  { id: "validate", label: "VALIDATE", x: 78, y: 100 },
  { id: "enrich", label: "ENRICH", x: 148, y: 100 },
  { id: "branch", label: "BRANCH", x: 218, y: 100, trigger: true },
  { id: "approve", label: "APPROVE", x: 288, y: 60 },
  { id: "skip", label: "SKIP", x: 288, y: 140 },
  { id: "notify", label: "NOTIFY", x: 358, y: 60 },
  { id: "log", label: "LOG", x: 358, y: 140 },
  { id: "done", label: "DONE", x: 428, y: 100 },
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

const centerRight = (id: string) => {
  const n = byId(id);
  return { x: n.x + 60, y: n.y + 12 };
};
const centerLeft = (id: string) => {
  const n = byId(id);
  return { x: n.x, y: n.y + 12 };
};

// Smooth Bezier between two points horizontally.
const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
};

// Pre-compute paths between consecutive edges.
const PATH_MAIN =
  curve(centerRight("intake"), centerLeft("validate")) +
  " " +
  curve(centerRight("validate"), centerLeft("enrich")) +
  " " +
  curve(centerRight("enrich"), centerLeft("branch")) +
  " " +
  curve(centerRight("branch"), centerLeft("approve")) +
  " " +
  curve(centerRight("approve"), centerLeft("notify")) +
  " " +
  curve(centerRight("notify"), { x: byId("done").x + 30, y: byId("done").y }) +
  " " +
  `L ${byId("done").x + 30} ${byId("done").y + 12}`;

const PATH_BRANCH =
  curve(centerRight("branch"), centerLeft("skip")) +
  " " +
  curve(centerRight("skip"), centerLeft("log")) +
  " " +
  curve(centerRight("log"), { x: byId("done").x + 30, y: byId("done").y + 24 }) +
  " " +
  `L ${byId("done").x + 30} ${byId("done").y + 12}`;

const EDGES: Array<[string, string]> = [
  ["intake", "validate"],
  ["validate", "enrich"],
  ["enrich", "branch"],
  ["branch", "approve"],
  ["branch", "skip"],
  ["approve", "notify"],
  ["skip", "log"],
  ["notify", "done"],
  ["log", "done"],
];

const WorkflowDiagram = ({ playing }: Props) => {
  return (
    <svg
      className="kz-diag"
      data-playing={playing}
      viewBox="0 0 500 220"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      style={{ color: "rgb(var(--ink) / 0.7)", maxWidth: 520 }}
      role="img"
      aria-label="Workflow graph"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" stroke="none" />
        </marker>
      </defs>

      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const pa = centerRight(a);
        const pb = centerLeft(b);
        return (
          <path
            key={i}
            d={curve(pa, pb)}
            stroke="currentColor"
            strokeOpacity="0.55"
            markerEnd="url(#arrow)"
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const isBranch = n.id === "branch";
        return (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width="60"
              height="24"
              className={isBranch || n.id === "approve" || n.id === "log" ? "kz-anim" : undefined}
              stroke="currentColor"
              strokeOpacity="0.7"
              style={
                isBranch || n.id === "approve" || n.id === "log"
                  ? {
                      animation: `kz-diag-node-flash 6s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }
                  : undefined
              }
            />
            <text
              x={n.x + 30}
              y={n.y + 16}
              fontFamily="Geist Mono, monospace"
              fontSize="7"
              letterSpacing="1.4"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
            >
              {n.label}
            </text>
            {n.trigger && (
              <circle cx={n.x + 56} cy={n.y + 4} r="2" fill="rgb(var(--signal))" stroke="none" />
            )}
          </g>
        );
      })}

      {/* Hidden paths for token offset-path */}
      <path id="wf-main" d={PATH_MAIN} fill="none" stroke="none" />
      <path id="wf-branch" d={PATH_BRANCH} fill="none" stroke="none" />

      {/* Traveling tokens — use offset-path */}
      <circle
        className="kz-anim"
        r="3.5"
        fill="rgb(var(--signal))"
        stroke="none"
        style={{
          offsetPath: `path('${PATH_MAIN}')`,
          // @ts-expect-error vendor
          WebkitOffsetPath: `path('${PATH_MAIN}')`,
          animation: "kz-diag-token 6s linear infinite",
        }}
      />
      <circle
        className="kz-anim"
        r="3.5"
        fill="rgb(var(--signal))"
        fillOpacity="0.75"
        stroke="none"
        style={{
          offsetPath: `path('${PATH_BRANCH}')`,
          // @ts-expect-error vendor
          WebkitOffsetPath: `path('${PATH_BRANCH}')`,
          animation: "kz-diag-token 6s linear infinite",
          animationDelay: "1.6s",
        }}
      />
    </svg>
  );
};

export default WorkflowDiagram;
