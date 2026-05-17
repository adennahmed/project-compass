import { Link } from "react-router-dom";
import { Post, Profile } from "@/lib/community/types";
import { relativeTime } from "@/lib/community/format";
import Avatar from "./Avatar";
import StaffBadge from "./StaffBadge";

interface ThreadItemProps {
  post: Post;
}

const FALLBACK_AUTHOR: Profile = {
  id: "",
  handle: "unknown",
  display_name: "Unknown",
  avatar_url: null,
  bio: null,
  role: "member",
  created_at: "",
};

const ThreadItem = ({ post }: ThreadItemProps) => {
  const author = post.author ?? FALLBACK_AUTHOR;
  const channel = post.channel;
  const isAnn = channel?.slug === "announcements";
  const to = isAnn ? `/community/announcements/${post.id}` : `/community/social/${post.id}`;

  return (
    <Link
      to={to}
      className="group flex items-start gap-4 border-b border-paper/8 px-4 py-5 transition-colors hover:bg-paper/[0.02] md:px-6"
    >
      <Avatar profile={author} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
          <span className="text-paper/85">{author.display_name}</span>
          <StaffBadge role={author.role} />
          {channel && (
            <span className="text-paper/45">· in {channel.name}</span>
          )}
          <span className="text-paper/35">· {relativeTime(post.created_at)}</span>
        </div>
        <h3
          className="mt-2 text-paper transition-colors group-hover:text-paper"
          style={{
            fontWeight: 500,
            fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
            letterSpacing: "-0.015em",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 max-w-[68ch] text-[13.5px] leading-[1.55] text-paper/60">
          {post.excerpt ?? post.body_md}
        </p>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-1 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 md:flex">
        <span className="text-paper/80">{post.comment_count ?? 0} replies</span>
        <span className="text-paper/40">last · {relativeTime(post.updated_at)}</span>
      </div>
    </Link>
  );
};

export default ThreadItem;
