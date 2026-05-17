import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";

interface CommentComposerProps {
  postId: string;
  parentId?: string | null;
  placeholder?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const CommentComposer = ({ postId, parentId = null, placeholder, onSubmitted, onCancel, compact }: CommentComposerProps) => {
  const { session, profile } = useAuth();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="border border-paper/12 bg-ink/40 p-4 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
        ↘ Sign in to reply
      </div>
    );
  }

  if (profile?.banned_at) {
    return (
      <div className="border border-signal/40 bg-signal/5 p-4 font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
        ↘ Your account is suspended.
      </div>
    );
  }
  const muteTs = profile?.mute_until ? new Date(profile.mute_until).getTime() : 0;
  if (muteTs > Date.now()) {
    return (
      <div className="border border-paper/15 bg-ink/40 p-4 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/75">
        ↘ You're muted until {new Date(muteTs).toLocaleString()}.
      </div>
    );
  }

  const submit = async () => {
    if (!supabase || !body.trim() || busy) return;
    setBusy(true);
    setError(null);
    const { error: err } = await db().from("comments").insert({
      post_id: postId,
      parent_id: parentId,
      author_id: session.user.id,
      body_md: body.trim(),
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setBody("");
    onSubmitted?.();
  };

  return (
    <div className={`flex flex-col gap-3 border border-paper/12 bg-ink/40 ${compact ? "p-3" : "p-4"}`}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder ?? "Write a reply…"}
        rows={compact ? 3 : 4}
        className="w-full resize-y bg-transparent text-[14px] text-paper placeholder:text-paper/35 focus:outline-none"
      />
      {error && (
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">↘ {error}</div>
      )}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={busy || !body.trim()}
          onClick={submit}
          className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Posting…" : parentId ? "Post reply ↘" : "Post comment ↘"}
        </button>
      </div>
    </div>
  );
};

export default CommentComposer;
