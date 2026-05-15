import {
  Channel,
  Comment,
  Post,
  Profile,
  Resource,
} from "./types";

/**
 * Mock fixtures used while VITE_SUPABASE_URL is unset. Lets the entire
 * community section render with realistic content for design polish.
 */

const now = Date.now();
const days = (n: number) => new Date(now - n * 86_400_000).toISOString();
const hours = (n: number) => new Date(now - n * 3_600_000).toISOString();

export const MOCK_PROFILES: Profile[] = [
  {
    id: "u-aden",
    handle: "aden",
    display_name: "Aden Ahmed",
    avatar_url: null,
    bio: "Principal Engineer & Founder. Builds operational platforms mid-market teams depend on.",
    role: "admin",
    created_at: days(420),
  },
  {
    id: "u-muhammad",
    handle: "muhammad",
    display_name: "Muhammad Khan",
    avatar_url: null,
    bio: "Senior Systems Engineer. Distributed systems, reliability, edge cases.",
    role: "staff",
    created_at: days(390),
  },
  {
    id: "u-elena",
    handle: "elena_w",
    display_name: "Elena Whitfield",
    avatar_url: null,
    bio: "Operations lead at a logistics startup. Rebuilding our dispatch stack.",
    role: "member",
    created_at: days(82),
  },
  {
    id: "u-marcus",
    handle: "marcus.t",
    display_name: "Marcus Tan",
    avatar_url: null,
    bio: "CTO. Currently fighting a 9-year-old Java monolith.",
    role: "member",
    created_at: days(67),
  },
  {
    id: "u-priya",
    handle: "priya_dev",
    display_name: "Priya Raman",
    avatar_url: null,
    bio: "Founding engineer. Healthcare ops. Postgres maximalist.",
    role: "member",
    created_at: days(41),
  },
  {
    id: "u-jonas",
    handle: "jonas",
    display_name: "Jonas Lindqvist",
    avatar_url: null,
    bio: "Product manager rediscovering shell scripts. It's going well.",
    role: "member",
    created_at: days(22),
  },
  {
    id: "u-sara",
    handle: "saraf",
    display_name: "Sara Fadel",
    avatar_url: null,
    bio: "Internal tools at a marketplace. Lover of boring technology.",
    role: "member",
    created_at: days(11),
  },
];

export const profileById = (id: string) =>
  MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0];
export const profileByHandle = (h: string) =>
  MOCK_PROFILES.find((p) => p.handle === h);

export const MOCK_CHANNELS: Channel[] = [
  { id: "c-ann",  slug: "announcements", name: "Announcements", description: "Updates and releases from the Kozai team.", kind: "announcements", staff_only_post: true,  sort_order: 10 },
  { id: "c-gen",  slug: "general",       name: "General",       description: "Open conversation — say hello, share what you're working on.", kind: "discussion", staff_only_post: false, sort_order: 20 },
  { id: "c-show", slug: "show-and-tell", name: "Show & Tell",   description: "Share something you built. Demos welcome.", kind: "discussion", staff_only_post: false, sort_order: 30 },
  { id: "c-hire", slug: "hiring",        name: "Hiring",        description: "Who's hiring, who's looking, how to think about it.", kind: "discussion", staff_only_post: false, sort_order: 40 },
  { id: "c-ops",  slug: "ops-talk",      name: "Ops Talk",      description: "Operational software, internal tools, the messy middle.", kind: "discussion", staff_only_post: false, sort_order: 50 },
  { id: "c-ask",  slug: "ask-kozai",     name: "Ask Kozai",     description: "Ask the Kozai team anything. Engineering, business, process.", kind: "discussion", staff_only_post: false, sort_order: 60 },
];

export const MOCK_POSTS: Post[] = [
  // Announcements
  {
    id: "p-ann-1",
    author_id: "u-aden",
    channel_id: "c-ann",
    type: "announcement",
    title: "Kozai Community is live",
    body_md:
      "We started Kozai to build the operational tools serious teams depend on — and to do it in the open. This is the front room. Drop in, introduce yourself, and tell us what you're working on.\n\nWe'll post engineering deep-dives, hiring notes, and the occasional war story here. Members can start their own threads in Social.\n\nWelcome.",
    pinned: true,
    locked: false,
    created_at: hours(36),
    updated_at: hours(36),
    excerpt: "We started Kozai to build the operational tools serious teams depend on — and to do it in the open. This is the front room.",
    comment_count: 14,
    reactions: { like: 42, fire: 9, insightful: 6 },
  },
  {
    id: "p-ann-2",
    author_id: "u-muhammad",
    channel_id: "c-ann",
    type: "announcement",
    title: "New deep-dive: how we replaced a 9-year-old job queue",
    body_md:
      "Just shipped a long-form writeup of a recent project — replacing an embedded job queue that had been quietly losing 0.3% of jobs for years. Postgres, advisory locks, and a hard look at what 'reliable' actually means under load.\n\nFind it under Resources.",
    pinned: false,
    locked: false,
    created_at: days(2),
    updated_at: days(2),
    excerpt: "Replacing an embedded job queue that had been quietly losing 0.3% of jobs for years.",
    comment_count: 8,
    reactions: { like: 27, insightful: 11 },
  },
  {
    id: "p-ann-3",
    author_id: "u-aden",
    channel_id: "c-ann",
    type: "announcement",
    title: "We're taking on two more retainers in Q3",
    body_md:
      "We keep the roster small on purpose. Two slots opening up after July — operational platforms, internal tools, data infrastructure. If that's you or someone you trust, reach out.",
    pinned: false,
    locked: false,
    created_at: days(6),
    updated_at: days(6),
    excerpt: "Two slots opening up after July — operational platforms, internal tools, data infrastructure.",
    comment_count: 3,
    reactions: { like: 14 },
  },

  // Social
  {
    id: "p-soc-1",
    author_id: "u-elena",
    channel_id: "c-ops",
    type: "thread",
    title: "What does your dispatch dashboard actually show?",
    body_md:
      "We're rebuilding ours from scratch. Currently throwing every signal at the screen and dispatchers tune it out. Curious what the minimum useful surface looks like in other ops setups.",
    pinned: false,
    locked: false,
    created_at: hours(5),
    updated_at: hours(5),
    excerpt: "We're rebuilding ours from scratch. Currently throwing every signal at the screen and dispatchers tune it out.",
    comment_count: 12,
    reactions: { insightful: 7, like: 4 },
  },
  {
    id: "p-soc-2",
    author_id: "u-marcus",
    channel_id: "c-general",
    type: "thread",
    title: "Hello from a recovering monolith owner",
    body_md:
      "Inherited a 9-year-old Java service. The previous team is gone, the docs are vibes, and the tests are decorative. Looking for any pattern that survived a similar excavation.",
    pinned: false,
    locked: false,
    created_at: hours(11),
    updated_at: hours(11),
    excerpt: "Inherited a 9-year-old Java service. The previous team is gone, the docs are vibes, and the tests are decorative.",
    comment_count: 23,
    reactions: { fire: 5, like: 18, insightful: 12 },
  },
  {
    id: "p-soc-3",
    author_id: "u-priya",
    channel_id: "c-show",
    type: "thread",
    title: "Show & tell: scheduler we built in two weekends",
    body_md:
      "Small thing — replaced an old internal scheduler with a Postgres-backed one. The fun part was making it readable for non-engineers. Posting a screencast and the schema.",
    pinned: false,
    locked: false,
    created_at: days(1),
    updated_at: days(1),
    excerpt: "Small thing — replaced an old internal scheduler with a Postgres-backed one.",
    comment_count: 6,
    reactions: { like: 21, fire: 4 },
  },
  {
    id: "p-soc-4",
    author_id: "u-jonas",
    channel_id: "c-ask",
    type: "question",
    title: "How do you decide when to build vs. buy for internal tools?",
    body_md:
      "Genuine question. Every SaaS solves 80% and the last 20% is the part we actually need. Where do you draw the line?",
    pinned: false,
    locked: false,
    created_at: days(2),
    updated_at: days(2),
    excerpt: "Every SaaS solves 80% and the last 20% is the part we actually need.",
    comment_count: 19,
    reactions: { insightful: 14, like: 9 },
  },
  {
    id: "p-soc-5",
    author_id: "u-sara",
    channel_id: "c-hire",
    type: "thread",
    title: "Hiring: senior full-stack engineer for marketplace ops",
    body_md:
      "Remote-friendly, TypeScript + Postgres + a healthy amount of customer-facing thinking. DM me if interested.",
    pinned: false,
    locked: false,
    created_at: days(3),
    updated_at: days(3),
    excerpt: "Remote-friendly, TypeScript + Postgres + a healthy amount of customer-facing thinking.",
    comment_count: 4,
    reactions: { like: 7 },
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c-1",
    post_id: "p-ann-1",
    parent_id: null,
    author_id: "u-elena",
    body_md: "Welcome to the room. Excited this exists.",
    created_at: hours(33),
  },
  {
    id: "c-2",
    post_id: "p-ann-1",
    parent_id: null,
    author_id: "u-priya",
    body_md: "Plus one — looking forward to the deep-dives.",
    created_at: hours(31),
  },
  {
    id: "c-3",
    post_id: "p-ann-1",
    parent_id: "c-2",
    author_id: "u-aden",
    body_md: "One landing tomorrow — should be relevant to your scheduler work.",
    created_at: hours(28),
  },
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: "r-1",
    slug: "replacing-a-nine-year-old-job-queue",
    title: "Replacing a Nine-Year-Old Job Queue",
    summary:
      "How we migrated an embedded job queue that had been quietly losing 0.3% of jobs for years — without taking the system down.",
    body_md: "",
    hero_image_url: null,
    tags: ["postgres", "reliability", "migration"],
    kind: "deep_dive",
    author_id: "u-muhammad",
    published_at: days(2),
    read_minutes: 14,
  },
  {
    id: "r-2",
    slug: "internal-tools-readme",
    title: "An Operational README for Internal Tools",
    summary:
      "The minimum a useful internal tool needs to ship with — and the questions to ask before you write any code.",
    body_md: "",
    hero_image_url: null,
    tags: ["internal-tools", "process", "design"],
    kind: "guide",
    author_id: "u-aden",
    published_at: days(11),
    read_minutes: 9,
  },
  {
    id: "r-3",
    slug: "logistics-dispatch-rebuild",
    title: "Case: Rebuilding Dispatch for a Logistics Operator",
    summary:
      "Eight weeks, two engineers, and what we kept from the old system. A study in restraint.",
    body_md: "",
    hero_image_url: null,
    tags: ["logistics", "dashboards", "case-study"],
    kind: "case_study",
    author_id: "u-aden",
    published_at: days(22),
    read_minutes: 11,
  },
  {
    id: "r-4",
    slug: "what-we-mean-by-operator",
    title: "What We Mean By 'Operator'",
    summary:
      "A short glossary of the people we build for — dispatchers, schedulers, billing leads, account managers — and what they need from software.",
    body_md: "",
    hero_image_url: null,
    tags: ["glossary", "philosophy"],
    kind: "glossary",
    author_id: "u-aden",
    published_at: days(31),
    read_minutes: 5,
  },
  {
    id: "r-5",
    slug: "postgres-as-a-job-queue",
    title: "Postgres as a Job Queue (Without Tears)",
    summary:
      "When `SELECT ... FOR UPDATE SKIP LOCKED` is the only primitive you need.",
    body_md: "",
    hero_image_url: null,
    tags: ["postgres", "queues"],
    kind: "guide",
    author_id: "u-muhammad",
    published_at: days(44),
    read_minutes: 7,
  },
  {
    id: "r-6",
    slug: "dashboards-that-people-actually-read",
    title: "Dashboards That People Actually Read",
    summary:
      "Five principles, mostly about subtraction. With examples of what we removed and why.",
    body_md: "",
    hero_image_url: null,
    tags: ["dashboards", "design", "ops"],
    kind: "deep_dive",
    author_id: "u-aden",
    published_at: days(58),
    read_minutes: 12,
  },
];

export const channelBySlug = (slug: string) =>
  MOCK_CHANNELS.find((c) => c.slug === slug) ?? null;

export const postsByChannel = (channelId: string) =>
  MOCK_POSTS.filter((p) => p.channel_id === channelId);

export const announcements = () =>
  MOCK_POSTS.filter((p) => p.type === "announcement").sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.created_at.localeCompare(a.created_at);
  });

export const recentThreads = (limit = 12) =>
  MOCK_POSTS.filter((p) => p.type !== "announcement")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit);
