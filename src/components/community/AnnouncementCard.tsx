import { Link } from "react-router-dom";
import { Post } from "@/lib/community/types";
import { profileById } from "@/lib/community/mock";
import { monoDate, relativeTime } from "@/lib/community/format";
import Avatar from "./Avatar";
import StaffBadge from "./StaffBadge";
import ReactionStrip from "./ReactionStrip";

interface AnnouncementCardProps {
  post: Post;
  /** Render in featured mode for the home page hero. */
  featured?: boolean;
}

const AnnouncementCard = ({ post, featured }: AnnouncementCardProps) => {
  const author = post.author ?? profileById(post.author_id);

  return (
    <article
      className={`group relative flex flex-col border border-paper/12 bg-ink/40 p-6 transition-colors hover:border-paper/30 md:p-8 ${
        featured ? "min-h-[260px]" : ""
      }`}
    >
      {post.pinned && (
        <div className="absolute -top-px left-0 h-px w-16 bg-signal" aria-hidden />
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
          {post.pinned && <span className="text-signal">⌁ Pinned</span>}
          <span>{monoDate(post.created_at)}</span>
        </div>
        <StaffBadge role={author.role} />
      </div>

      <Link
        to={`/community/p/${post.id}`}
        className="mt-4 block text-paper transition-colors group-hover:text-paper"
        style={{
          fontFamily: "Geist, system-ui, sans-serif",
          fontWeight: 600,
          fontSize: featured ? "clamp(1.5rem, 2.6vw, 2.4rem)" : "clamp(1.2rem, 1.8vw, 1.6rem)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
        }}
      >
        {post.title}
      </Link>

      <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.6] text-paper/65 md:text-[15px]">
        {post.excerpt ?? post.body_md.slice(0, 220)}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-paper/8 pt-4">
        <Link
          to={`/community/u/${author.handle}`}
          className="inline-flex items-center gap-2.5 text-[12px] text-paper/75 hover:text-paper"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar profile={author} size={24} />
          <span className="font-mono uppercase tracking-[0.18em]">{author.display_name}</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            ↘ {post.comment_count ?? 0} replies · {relativeTime(post.created_at)}
          </span>
          <ReactionStrip counts={post.reactions} />
        </div>
      </div>
    </article>
  );
};

export default AnnouncementCard;
