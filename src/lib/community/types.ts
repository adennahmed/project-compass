export type UserRole = "member" | "staff" | "admin";
export type ChannelKind = "announcements" | "discussion" | "resources";
export type PostType = "announcement" | "thread" | "question";
/** Legacy enum — kept for backward compat with old static counts. New reactions are free-form emoji strings. */
export type ReactionKind = "like" | "insightful" | "fire";
export type ModerationActionKind = "warn" | "mute" | "ban" | "unban" | "unmute";
export type NotificationKind = "comment_on_post" | "reply_to_comment" | "reaction_on_post" | "warning" | "mention";
export type ReportCategory = "spam" | "harassment" | "off-topic" | "illegal" | "other";
export type ReportStatus = "open" | "dismissed" | "resolved";
export type ResourceKind = "guide" | "deep_dive" | "case_study" | "glossary";

export interface Profile {
  id: string;
  handle: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
  onboarded_at?: string | null;
  community_rules_accepted_at?: string | null;
  mute_until?: string | null;
  banned_at?: string | null;
  warning_count?: number;
}

export interface Reaction {
  user_id: string;
  target_type: "post" | "comment";
  target_id: string;
  emoji: string;
  created_at: string;
  user?: Profile;
}

export interface Report {
  id: string;
  target_type: "post" | "comment" | "profile";
  target_id: string;
  reporter_id: string | null;
  reason: string;
  reason_category: ReportCategory;
  status: ReportStatus;
  resolver_id: string | null;
  resolution_note: string | null;
  created_at: string;
  resolved_at: string | null;
  reporter?: Profile;
}

export interface ModerationAction {
  id: string;
  target_user_id: string;
  actor_id: string | null;
  kind: ModerationActionKind;
  note: string | null;
  expires_at: string | null;
  related_report_id: string | null;
  created_at: string;
}

export interface AuditEntry {
  id: number;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  actor?: Profile;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  kind: NotificationKind;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export interface Bookmark {
  user_id: string;
  target_type: "post" | "resource";
  target_id: string;
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
