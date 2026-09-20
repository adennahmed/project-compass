export type ProjectStatus = "Independent build" | "Systems prototype" | "Archive";

export interface PortfolioProject {
  id: string;
  number: string;
  name: string;
  strap: string;
  status: ProjectStatus;
  year: string;
  summary: string;
  thesis: string;
  stack: string[];
  capabilities: string[];
  architecture: Array<{ label: string; detail: string }>;
  decisions: Array<{ label: string; value: string }>;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "meridian",
    number: "01",
    name: "Meridian",
    strap: "An operations control plane for work that refuses to sit still.",
    status: "Independent build",
    year: "2026",
    summary:
      "Meridian turns fragmented operational events into one live command surface: exceptions, approvals, SLAs, ownership, and the exact action that should happen next.",
    thesis:
      "Most operations teams do not need another dashboard. They need a system that can understand an event, explain why it matters, and route the next decision to the right human.",
    stack: ["TypeScript", "Go", "Postgres", "NATS", "ClickHouse"],
    capabilities: ["Event ingestion", "Rules engine", "Live queues", "Audit replay"],
    architecture: [
      { label: "Ingress", detail: "Webhooks, CDC, scheduled pulls" },
      { label: "Normalize", detail: "Typed operational event envelope" },
      { label: "Decide", detail: "Rules, thresholds, ownership graph" },
      { label: "Act", detail: "Queues, alerts, approvals, automations" },
    ],
    decisions: [
      { label: "Model", value: "Event-first" },
      { label: "Target", value: "Sub-250ms views" },
      { label: "Failure mode", value: "Replayable" },
      { label: "Interface", value: "Keyboard-led" },
    ],
  },
  {
    id: "aegis",
    number: "02",
    name: "Aegis Graph",
    strap: "An evidence engine that shows its work.",
    status: "Systems prototype",
    year: "2026",
    summary:
      "Aegis ingests dense document collections, resolves claims into a traceable graph, and returns research answers with source-level evidence, conflicts, and confidence paths.",
    thesis:
      "Retrieval is not the hard part. Trust is. A useful research system must preserve provenance, expose contradictions, and let a person inspect every hop between question and answer.",
    stack: ["Python", "FastAPI", "pgvector", "Neo4j", "React"],
    capabilities: ["Hybrid retrieval", "Claim graph", "Contradiction scan", "Citation trace"],
    architecture: [
      { label: "Ingest", detail: "PDF, HTML, notes, structured data" },
      { label: "Resolve", detail: "Entities, claims, dates, references" },
      { label: "Retrieve", detail: "Sparse + dense + graph traversal" },
      { label: "Explain", detail: "Answer, evidence, conflicts, confidence" },
    ],
    decisions: [
      { label: "Retrieval", value: "Hybrid" },
      { label: "Unit", value: "Atomic claim" },
      { label: "Citations", value: "Mandatory" },
      { label: "Unknowns", value: "Visible" },
    ],
  },
  {
    id: "relay",
    number: "03",
    name: "Relay",
    strap: "Field operations that keep working when the network does not.",
    status: "Systems prototype",
    year: "2026",
    summary:
      "Relay is an offline-first coordination layer for field teams: dispatch, routes, forms, proof-of-work, and device telemetry that reconcile cleanly after hours without a connection.",
    thesis:
      "Offline mode cannot be a loading spinner with better copy. Field software needs an explicit local state model, deterministic merge rules, and interfaces that communicate uncertainty honestly.",
    stack: ["React Native", "Rust", "SQLite", "CRDTs", "WebSockets"],
    capabilities: ["Offline writes", "Conflict merge", "Route planning", "Device health"],
    architecture: [
      { label: "Capture", detail: "Local-first actions and evidence" },
      { label: "Journal", detail: "Append-only encrypted device log" },
      { label: "Reconcile", detail: "CRDT merge + domain conflict rules" },
      { label: "Coordinate", detail: "Dispatch state and route updates" },
    ],
    decisions: [
      { label: "Primary DB", value: "On-device" },
      { label: "Sync", value: "Op log" },
      { label: "Conflicts", value: "Domain-aware" },
      { label: "Connectivity", value: "Optional" },
    ],
  },
  {
    id: "kozai",
    number: "04",
    name: "Kozai",
    strap: "A software-studio chapter focused on operational interfaces.",
    status: "Archive",
    year: "2025–26",
    summary:
      "Kozai was an independent studio initiative through which I explored operational software, designed detailed product prototypes, built a community platform, and developed a distinct interface system.",
    thesis:
      "The experiment sharpened a point of view: software for serious work should feel legible, fast, and intentionally calm—even when the system underneath it is complex.",
    stack: ["React", "TypeScript", "Supabase", "Postgres", "Vercel"],
    capabilities: ["Product systems", "Community platform", "Ops prototypes", "Design language"],
    architecture: [
      { label: "Observe", detail: "Study operator decisions and friction" },
      { label: "Model", detail: "Turn workflows into explicit states" },
      { label: "Prototype", detail: "Build realistic interactive surfaces" },
      { label: "Reflect", detail: "Carry the lessons into new systems" },
    ],
    decisions: [
      { label: "Role", value: "Founder / builder" },
      { label: "Focus", value: "Operations" },
      { label: "Output", value: "Working systems" },
      { label: "State", value: "Archived" },
    ],
  },
];

export const PORTFOLIO_STACK = [
  "TypeScript",
  "React",
  "Go",
  "Rust",
  "Python",
  "Postgres",
  "Distributed systems",
  "Product design",
];
