/**
 * Thin query helpers for the community feature.
 *
 * Every helper guards on `supabase` being null (env not configured) and
 * returns a safe empty/null shape so pages can render without crashing.
 *
 * Tables aren't in the generated Database types, so we cast through
 * `(supabase as any)` here in one place rather than littering page code.
 */
import { supabase } from "@/integrations/supabase/client";
import { Channel, Comment, Post, Profile, Resource } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const POSTS_SELECT =
  "*, author:profiles!posts_author_id_fkey(*), channel:channels!posts_channel_id_fkey(*)";

export async function fetchChannels(): Promise<Channel[]> {
  if (!supabase) return [];
  const { data, error } = await db()
    .from("channels")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as Channel[];
}

export async function fetchPosts(opts: {
  channelSlug?: string;
  excludeAnnouncements?: boolean;
  onlyAnnouncements?: boolean;
  limit?: number;
} = {}): Promise<Post[]> {
  if (!supabase) return [];
  let q = db()
    .from("posts")
    .select(POSTS_SELECT)
    .is("deleted_at", null)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) return [];
  let rows = (data ?? []) as Post[];
  if (opts.channelSlug) rows = rows.filter((p) => p.channel?.slug === opts.channelSlug);
  if (opts.excludeAnnouncements) rows = rows.filter((p) => p.channel?.slug !== "announcements");
  if (opts.onlyAnnouncements) rows = rows.filter((p) => p.channel?.slug === "announcements");
  return rows;
}

export async function fetchPostById(id: string): Promise<Post | null> {
  if (!supabase) return null;
  const { data, error } = await db()
    .from("posts")
    .select(POSTS_SELECT)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) return null;
  return (data ?? null) as Post | null;
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  if (!supabase) return [];
  const { data, error } = await db()
    .from("comments")
    .select("*, author:profiles!comments_author_id_fkey(*)")
    .eq("post_id", postId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as Comment[];
}

export async function fetchResources(opts: { publishedOnly?: boolean; limit?: number } = {}): Promise<Resource[]> {
  if (!supabase) return [];
  let q = db()
    .from("resources")
    .select("*, author:profiles!resources_author_id_fkey(*)")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (opts.publishedOnly) q = q.not("published_at", "is", null);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) return [];
  return (data ?? []) as Resource[];
}

export async function fetchResourceBySlug(slug: string): Promise<Resource | null> {
  if (!supabase) return null;
  const { data, error } = await db()
    .from("resources")
    .select("*, author:profiles!resources_author_id_fkey(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return (data ?? null) as Resource | null;
}

export async function countProfiles(): Promise<number> {
  if (!supabase) return 0;
  const { count } = await db().from("profiles").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function countPosts(): Promise<number> {
  if (!supabase) return 0;
  const { count } = await db()
    .from("posts")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);
  return count ?? 0;
}

export async function countResources(): Promise<number> {
  if (!supabase) return 0;
  const { count } = await db()
    .from("resources")
    .select("*", { count: "exact", head: true })
    .not("published_at", "is", null);
  return count ?? 0;
}

export async function fetchProfiles(): Promise<Profile[]> {
  if (!supabase) return [];
  const { data, error } = await db().from("profiles").select("*");
  if (error) return [];
  return (data ?? []) as Profile[];
}
