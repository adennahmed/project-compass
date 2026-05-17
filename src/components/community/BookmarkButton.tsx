import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";

interface BookmarkButtonProps {
  targetType: "post" | "resource";
  targetId: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const BookmarkButton = ({ targetType, targetId, className = "" }: BookmarkButtonProps) => {
  const { session } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase || !session?.user.id) return;
    let cancel = false;
    (async () => {
      const { data } = await db().from("bookmarks").select("user_id")
        .eq("user_id", session.user.id)
        .eq("target_type", targetType)
        .eq("target_id", targetId)
        .maybeSingle();
      if (!cancel) setSaved(!!data);
    })();
    return () => { cancel = true; };
  }, [session?.user.id, targetType, targetId]);

  if (!session) return null;

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!supabase || !session?.user.id || busy) return;
    setBusy(true);
    const was = saved;
    setSaved(!was);
    try {
      if (was) {
        await db().from("bookmarks").delete()
          .eq("user_id", session.user.id)
          .eq("target_type", targetType)
          .eq("target_id", targetId);
      } else {
        await db().from("bookmarks").insert({
          user_id: session.user.id,
          target_type: targetType,
          target_id: targetId,
        });
      }
    } catch {
      setSaved(was);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove bookmark" : "Bookmark"}
      title={saved ? "Bookmarked" : "Bookmark"}
      className={`inline-flex items-center gap-1 font-mono text-[11px] leading-none uppercase tracking-[0.18em] transition-colors ${
        saved ? "text-signal" : "text-paper/55 hover:text-paper"
      } ${className}`}
    >
      <span className="text-[13px] leading-none">{saved ? "★" : "☆"}</span>
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default BookmarkButton;
