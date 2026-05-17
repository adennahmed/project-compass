import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/community/auth";
import { NotificationRow } from "@/lib/community/types";
import { relativeTime } from "@/lib/community/format";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const KIND_VERB: Record<string, string> = {
  comment_on_post: "commented on your post",
  reply_to_comment: "replied to your comment",
  reaction_on_post: "reacted to your post",
  warning: "sent you a warning",
  mention: "mentioned you",
};

const NotificationsBell = () => {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    if (!supabase || !session?.user.id) return;
    const { data } = await db().from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setRows((data ?? []) as NotificationRow[]);
  };

  useEffect(() => {
    if (!session?.user.id) return;
    void load();
    if (!supabase) return;
    const ch = db().channel(`notifs-${session.user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${session.user.id}` }, () => { void load(); })
      .subscribe();
    return () => { db().removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!session) return null;

  const unread = rows.filter((r) => !r.read_at).length;

  const markAllRead = async () => {
    if (!supabase || !session?.user.id) return;
    await db().from("notifications").update({ read_at: new Date().toISOString() })
      .eq("user_id", session.user.id)
      .is("read_at", null);
    setRows((prev) => prev.map((r) => r.read_at ? r : { ...r, read_at: new Date().toISOString() }));
  };

  const linkFor = (n: NotificationRow): string => {
    const p = n.payload as Record<string, unknown>;
    if (n.kind === "warning") return "/community/settings";
    const postId = p.post_id as string | undefined;
    if (postId) return `/community/p/${postId}`;
    return "/community";
  };

  const renderRow = (n: NotificationRow) => {
    const p = n.payload as Record<string, unknown>;
    const verb = KIND_VERB[n.kind] ?? n.kind;
    const title = (p.post_title as string | undefined) ?? (p.note as string | undefined) ?? "";
    return (
      <Link
        to={linkFor(n)}
        key={n.id}
        onClick={() => setOpen(false)}
        className={`flex flex-col gap-1 border-b border-paper/8 px-3 py-2.5 text-left last:border-b-0 hover:bg-paper/5 ${
          n.read_at ? "" : "bg-signal/5"
        }`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75">
          {n.kind === "reaction_on_post" && <span>{(p.emoji as string) ?? "✦"}</span>}
          <span>{verb}</span>
        </div>
        {title && <div className="truncate text-[12px] text-paper/85">{title}</div>}
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45">
          {relativeTime(n.created_at)}
        </div>
      </Link>
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative inline-flex h-7 w-7 items-center justify-center text-paper/75 hover:text-paper"
      >
        <span className="text-[15px]">⌁</span>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center bg-signal px-1 font-mono text-[9px] font-medium text-paper">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full z-50 mt-2 flex w-[340px] flex-col border border-paper/15 bg-ink shadow-2xl">
            <div className="flex items-center justify-between border-b border-paper/10 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
                Notifications
              </span>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {rows.length === 0 ? (
                <div className="px-3 py-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                  Nothing new yet.
                </div>
              ) : (
                rows.map(renderRow)
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsBell;
