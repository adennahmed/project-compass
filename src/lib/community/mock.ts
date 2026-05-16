import {
  Channel,
  Comment,
  Post,
  Profile,
  Resource,
} from "./types";

/**
 * Mock fixtures.
 *
 * Empty by default — the social network is meant to be populated by real
 * users. We keep the channel definitions because they're structural
 * metadata that must exist for the UI to render at all (the social page
 * shows the channel chips even before any post is created).
 *
 * If you want to demo the unsigned-in state with sample content, set
 * `import.meta.env.VITE_COMMUNITY_DEMO = "true"` and re-introduce
 * fixtures here.
 */
export const MOCK_PROFILES: Profile[] = [];
export const MOCK_POSTS: Post[] = [];
export const MOCK_COMMENTS: Comment[] = [];
export const MOCK_RESOURCES: Resource[] = [];

// Structural metadata — kept so the social page UI can still render its
// channel chips before any real posts exist.
export const MOCK_CHANNELS: Channel[] = [
  { id: "c-ann",  slug: "announcements", name: "Announcements", description: "Updates and releases from the Kozai team.", kind: "announcements", staff_only_post: true,  sort_order: 10 },
  { id: "c-gen",  slug: "general",       name: "General",       description: "Open conversation — say hello, share what you're working on.", kind: "discussion", staff_only_post: false, sort_order: 20 },
  { id: "c-show", slug: "show-and-tell", name: "Show & Tell",   description: "Share something you built. Demos welcome.", kind: "discussion", staff_only_post: false, sort_order: 30 },
  { id: "c-hire", slug: "hiring",        name: "Hiring",        description: "Who's hiring, who's looking, how to think about it.", kind: "discussion", staff_only_post: false, sort_order: 40 },
  { id: "c-ops",  slug: "ops-talk",      name: "Ops Talk",      description: "Operational software, internal tools, the messy middle.", kind: "discussion", staff_only_post: false, sort_order: 50 },
  { id: "c-ask",  slug: "ask-kozai",     name: "Ask Kozai",     description: "Ask the Kozai team anything. Engineering, business, process.", kind: "discussion", staff_only_post: false, sort_order: 60 },
];

// Empty-set fallback helpers used by pages that haven't yet been wired
// to live data. They all return [] so the UI just renders empty states.
const empty = <T,>(): T[] => [];

export const profileById = (_id: string): Profile | undefined => undefined;
export const profileByHandle = (_h: string): Profile | undefined => undefined;
export const channelBySlug = (slug: string): Channel | null =>
  MOCK_CHANNELS.find((c) => c.slug === slug) ?? null;
export const postsByChannel = (_channelId: string) => empty<Post>();
export const announcements = () => empty<Post>();
export const recentThreads = (_limit = 12) => empty<Post>();
