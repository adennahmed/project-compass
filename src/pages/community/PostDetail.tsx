import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Reveal from "@/components/Reveal";
import MarkdownBody from "@/components/community/MarkdownBody";
import ReactionStrip from "@/components/community/ReactionStrip";
import Avatar from "@/components/community/Avatar";
import StaffBadge from "@/components/community/StaffBadge";
import EmptyState from "@/components/community/EmptyState";
import CommentComposer from "@/components/community/CommentComposer";
import { fetchComments, fetchPostById } from "@/lib/community/queries";
import { Comment, Post } from "@/lib/community/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";
import { monoDate, relativeTime } from "@/lib/community/format";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

interface CommentNode extends Comment {
  children: CommentNode[];
}

const buildTree = (rows: Comment[]): CommentNode[] => {
  const map = new Map<string, CommentNode>();
  rows.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: CommentNode[] = [];
  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
};

const CommentBlock = ({
  node,
  depth,
  postId,
  onChanged,
  canModerate,
  myId,
}: {
  node: CommentNode;
  depth: number;
  postId: string;
  onChanged: () => void;
  canModerate: boolean;
  myId?: string;
}) => {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(node.body_md);
  const author = node.author;
  const indent = Math.min(depth, 3) * 16;
  const isMine = author?.id === myId;
  const canEdit = isMine || canModerate;

  const remove = async () => {
    if (!supabase) return;
    await db().from("comments").update({ deleted_at: new Date().toISOString() }).eq("id", node.id);
    onChanged();
  };

  const saveEdit = async () => {
    if (!supabase || !body.trim()) return;
    await db().from("comments").update({ body_md: body.trim() }).eq("id", node.id);
    setEditing(false);
    onChanged();
  };

  return (
    <div style={{ marginLeft: indent }} className="border-l border-paper/10 pl-4">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
        {author && <Avatar profile={author} size={22} />}
        <span className="text-paper/85">{author?.display_name ?? "Unknown"}</span>
        {author && <StaffBadge role={author.role} />}
        <span className="text-paper/35">· {relativeTime(node.created_at)}</span>
      </div>
      {editing ? (
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full resize-y border border-paper/15 bg-ink/40 p-2 text-[14px] text-paper focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setEditing(false); setBody(node.body_md); }} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Cancel</button>
            <button onClick={saveEdit} className="border border-paper bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-signal hover:text-paper hover:border-signal">Save</button>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <MarkdownBody source={node.body_md} size="compact" />
        </div>
      )}
      <div className="mt-2 flex items-center gap-3">
        <ReactionStrip targetType="comment" targetId={node.id} />
        <button
          type="button"
          onClick={() => setReplying((v) => !v)}
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
        >
          {replying ? "Cancel" : "Reply"}
        </button>
        {canEdit && !editing && (
          <button onClick={() => setEditing(true)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Edit</button>
        )}
        {(isMine || canModerate) && (
          <button onClick={remove} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal">Delete</button>
        )}
      </div>
      {replying && (
        <div className="mt-3">
          <CommentComposer
            postId={postId}
            parentId={node.id}
            placeholder="Write a reply…"
            compact
            onSubmitted={() => { setReplying(false); onChanged(); }}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}
      {node.children.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {node.children.map((c) => (
            <CommentBlock
              key={c.id}
              node={c}
              depth={depth + 1}
              postId={postId}
              onChanged={onChanged}
              canModerate={canModerate}
              myId={myId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const isStaff = profile?.role === "staff" || profile?.role === "admin";
  const isAdmin = profile?.role === "admin";
  const isAuthor = post?.author_id === session?.user.id;
  const canEdit = isAuthor || isStaff;
  const canModerate = isStaff;

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    const [p, cs] = await Promise.all([fetchPostById(postId), fetchComments(postId)]);
    setPost(p);
    setComments(cs);
    if (p) {
      setEditTitle(p.title);
      setEditBody(p.body_md);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => { void load(); }, [load]);

  // Realtime: subscribe to comment changes for this post
  useEffect(() => {
    if (!supabase || !postId) return;
    const channel = db()
      .channel(`post-${postId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `post_id=eq.${postId}` }, () => {
        void load();
      })
      .subscribe();
    return () => { db().removeChannel(channel); };
  }, [postId, load]);

  const tree = useMemo(() => buildTree(comments), [comments]);

  const remove = async () => {
    if (!supabase || !post) return;
    await db().from("posts").update({ deleted_at: new Date().toISOString() }).eq("id", post.id);
    navigate(post.channel?.slug === "announcements" ? "/community/announcements" : "/community/social", { replace: true });
  };

  const togglePinned = async () => {
    if (!supabase || !post) return;
    await db().from("posts").update({ pinned: !post.pinned }).eq("id", post.id);
    void load();
  };
  const toggleLocked = async () => {
    if (!supabase || !post) return;
    await db().from("posts").update({ locked: !post.locked }).eq("id", post.id);
    void load();
  };

  const saveEdit = async () => {
    if (!supabase || !post) return;
    await db().from("posts").update({ title: editTitle.trim(), body_md: editBody.trim() }).eq("id", post.id);
    setEditingPost(false);
    void load();
  };

  if (loading) {
    return (
      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="container-wide font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
          ↘ Loading post…
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="container-wide">
          <EmptyState title="Post not found" body="It may have been removed, or the link is wrong." />
        </div>
      </section>
    );
  }

  const channel = post.channel;
  const author = post.author;
  const isAnn = channel?.slug === "announcements";
  const backHref = isAnn ? "/community/announcements" : "/community/social";

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide max-w-[860px]">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
          <Link to={backHref} className="link-wipe hover:text-paper">
            ← {isAnn ? "Announcements" : "Social"}
          </Link>
          {channel && <span className="text-paper/35"> · {channel.name}</span>}
          {post.pinned && <span className="ml-2 text-signal">⌁ Pinned</span>}
          {post.locked && <span className="ml-2 text-paper/55">⌁ Locked</span>}
        </div>

        <Reveal>
          {editingPost ? (
            <div className="mt-5 flex flex-col gap-3">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent text-[26px] font-semibold text-paper focus:outline-none"
              />
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={10}
                className="w-full resize-y border border-paper/15 bg-ink/40 p-3 text-[14px] text-paper focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingPost(false)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Cancel</button>
                <button onClick={saveEdit} className="border border-paper bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-signal hover:text-paper hover:border-signal">Save</button>
              </div>
            </div>
          ) : (
            <h1
              className="mt-5 text-paper"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}
            >
              {post.title}
            </h1>
          )}
        </Reveal>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-paper/10 py-4">
          {author && <Avatar profile={author} size={28} />}
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85">{author?.display_name ?? "Unknown"}</span>
          {author && <StaffBadge role={author.role} />}
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">{monoDate(post.created_at)}</span>
          <div className="ml-auto flex items-center gap-3">
            <ReactionStrip targetType="post" targetId={post.id} />
            {canEdit && !editingPost && (
              <button onClick={() => setEditingPost(true)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Edit</button>
            )}
            {canModerate && (
              <>
                <button onClick={togglePinned} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">{post.pinned ? "Unpin" : "Pin"}</button>
                <button onClick={toggleLocked} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">{post.locked ? "Unlock" : "Lock"}</button>
              </>
            )}
            {(isAuthor || isAdmin) && (
              <button onClick={remove} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal">Delete</button>
            )}
          </div>
        </div>

        {!editingPost && (
          <div className="mt-6">
            <MarkdownBody source={post.body_md} size="article" />
          </div>
        )}

        <div className="mt-12">
          <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ Comments · {comments.length} ]
          </div>
          {!post.locked && (
            <div className="mb-8">
              <CommentComposer postId={post.id} onSubmitted={load} />
            </div>
          )}
          {tree.length === 0 ? (
            <EmptyState title="No comments yet" body="Be the first to say something useful." />
          ) : (
            <div className="flex flex-col gap-6">
              {tree.map((n) => (
                <CommentBlock
                  key={n.id}
                  node={n}
                  depth={0}
                  postId={post.id}
                  onChanged={load}
                  canModerate={canModerate}
                  myId={session?.user.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
