export type UserRole = "member" | "staff" | "admin";
export type ChannelKind = "announcements" | "discussion" | "resources";
export type PostType = "announcement" | "thread" | "question";
export type ReactionKind = "like" | "insightful" | "fire";
export type ResourceKind = "guide" | "deep_dive" | "case_study" | "glossary";

export interface Profile {
  id: string;
  handle: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
}

export interface Channel {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  kind: ChannelKind;
  staff_only_post: boolean;
  sort_order: number;
}

export interface Post {
  id: string;
  author_id: string;
  channel_id: string;
  type: PostType;
  title: string;
  body_md: string;
  pinned: boolean;
  locked: boolean;
  created_at: string;
  updated_at: string;
  // Joined / computed
  author?: Profile;
  channel?: Channel;
  comment_count?: number;
  reactions?: Partial<Record<ReactionKind, number>>;
  excerpt?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  body_md: string;
  created_at: string;
  author?: Profile;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body_md: string;
  hero_image_url: string | null;
  tags: string[];
  kind: ResourceKind;
  author_id: string;
  published_at: string | null;
  author?: Profile;
  read_minutes?: number;
}

export const RESOURCE_KIND_LABEL: Record<ResourceKind, string> = {
  guide: "Guide",
  deep_dive: "Deep Dive",
  case_study: "Case Study",
  glossary: "Glossary",
};
