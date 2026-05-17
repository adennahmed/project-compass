import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";
import { Channel, PostType } from "@/lib/community/types";

interface PostComposerProps {
  channels: Channel[];
  defaultChannelSlug?: string;
  /** Restrict the channel selector to a single one (used by Announcements). */
  lockedChannelSlug?: string;
  defaultType?: PostType;
  onPosted?: () => void;
  /** Staff-only mode hides type selector and forces 'announcement'. */
  announcement?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const PostComposer = ({
  channels,
  defaultChannelSlug,
  lockedChannelSlug,
  defaultType = "thread",
  onPosted,
  announcement,
}: PostComposerProps) => {
  const { session, profile } = useAuth();
  const usable = channels.filter((c) => {
    if (lockedChannelSlug) return c.slug === lockedChannelSlug;
    if (announcement) return c.slug === "announcements";
    return c.slug !== "announcements";
  });
  const [open, setOpen] = useState(false);
  const [channelId, setChannelId] = useState<string>(
    usable.find((c) => c.slug === defaultChannelSlug)?.id ?? usable[0]?.id ?? "",
  );
  const [type, setType] = useState<PostType>(announcement ? "announcement" : defaultType);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStaff = profile?.role === "staff" || profile?.role === "admin";

  if (!session) {
    return (
      <div className="flex items-center justify-between gap-3 border border-paper/12 bg-ink/40 p-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
          ↘ Sign in to post
        </span>
        <Link
          to="/community/auth"
          className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
        >
          Sign in →
        </Link>
      </div>
    );
  }

  if (announcement && !isStaff) {
    return (
      <div className="border border-paper/12 bg-ink/40 p-4 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
        ↘ Only the Kozai team can post announcements
      </div>
    );
  }

  const submit = async () => {
    if (!supabase || !title.trim() || !body.trim() || !channelId || busy) return;
    setBusy(true);
    setError(null);
    const { data, error: err } = await db().from("posts").insert({
      author_id: session.user.id,
      channel_id: channelId,
      type,
      title: title.trim(),
      body_md: body.trim(),
    }).select("id").maybeSingle();
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setTitle("");
    setBody("");
    setOpen(false);
    onPosted?.();
    void data;
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border border-paper/15 bg-ink/40 px-4 py-4 text-left font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 transition-colors hover:border-paper/35 hover:text-paper"
      >
        ↘ {announcement ? "Post an announcement…" : "Start a thread…"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 border border-paper/15 bg-ink/40 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {!announcement && (
          <>
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="border border-paper/15 bg-ink px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper focus:border-paper/35 focus:outline-none"
            >
              {usable.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PostType)}
              className="border border-paper/15 bg-ink px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper focus:border-paper/35 focus:outline-none"
            >
              <option value="thread">Thread</option>
              <option value="question">Question</option>
            </select>
          </>
        )}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-transparent text-[18px] font-medium text-paper placeholder:text-paper/35 focus:outline-none"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something. Markdown is supported."
        rows={6}
        className="w-full resize-y bg-transparent text-[14px] text-paper placeholder:text-paper/35 focus:outline-none"
      />
      {error && (
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">↘ {error}</div>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-paper/10 pt-3">
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null); }}
          className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy || !title.trim() || !body.trim()}
          onClick={submit}
          className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Posting…" : "Post ↘"}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
