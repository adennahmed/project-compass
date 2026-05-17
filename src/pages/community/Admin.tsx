import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Tag from "@/components/community/Tag";
import StaffBadge from "@/components/community/StaffBadge";
import Avatar from "@/components/community/Avatar";
import EmptyState from "@/components/community/EmptyState";
import { useAuth } from "@/lib/community/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  AuditEntry,
  Post,
  Profile,
  Report,
  Resource,
} from "@/lib/community/types";
import { relativeTime } from "@/lib/community/format";

type Pane = "reports" | "members" | "posts" | "resources" | "audit";
type ReportTab = "open" | "dismissed" | "resolved";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

// ─── Action prompts ──────────────────────────────────────────────────────
const muteDurations: { label: string; ms: number }[] = [
  { label: "1 hour", ms: 60 * 60 * 1000 },
  { label: "24 hours", ms: 24 * 60 * 60 * 1000 },
  { label: "7 days", ms: 7 * 24 * 60 * 60 * 1000 },
];

const promptMuteDuration = (): number | null => {
  const choice = window.prompt("Mute duration — type 1h, 24h, or 7d:", "24h");
  if (!choice) return null;
  const m = choice.trim().toLowerCase();
  const found = m === "1h" ? muteDurations[0]
    : m === "24h" || m === "1d" ? muteDurations[1]
    : m === "7d" ? muteDurations[2]
    : null;
  if (!found) { alert("Use 1h, 24h, or 7d."); return null; }
  return Date.now() + found.ms;
};

interface ModerationContext {
  actorId: string;
  refresh: () => void;
}

const insertModeration = async (
  ctx: ModerationContext,
  args: {
    targetUserId: string;
    kind: "warn" | "mute" | "ban" | "unban" | "unmute";
    note?: string;
    expiresAt?: number | null;
    relatedReportId?: string | null;
  },
) => {
  if (!supabase) return { error: "No backend" };
  const { error } = await db().from("moderation_actions").insert({
    actor_id: ctx.actorId,
    target_user_id: args.targetUserId,
    kind: args.kind,
    note: args.note ?? null,
    expires_at: args.expiresAt ? new Date(args.expiresAt).toISOString() : null,
    related_report_id: args.relatedReportId ?? null,
  });
  if (error) return { error: error.message };
  ctx.refresh();
  return { error: null };
};

// ─── Reports pane ────────────────────────────────────────────────────────
const ReportsPane = ({ actorId }: { actorId: string }) => {
  const [tab, setTab] = useState<ReportTab>("open");
  const [rows, setRows] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    db().from("reports")
      .select("*, reporter:profiles!reporter_id(*)")
      .eq("status", tab)
      .order("created_at", { ascending: false })
      .then(({ data, error }: { data: Report[] | null; error: { message: string } | null }) => {
        if (error) console.error(error);
        setRows((data ?? []) as Report[]);
        setLoading(false);
      });
  }, [tab, tick]);

  const ctx: ModerationContext = { actorId, refresh };

  const setStatus = async (id: string, status: "dismissed" | "resolved", note?: string) => {
    if (!supabase) return;
    await db().from("reports").update({
      status,
      resolver_id: actorId,
      resolution_note: note ?? null,
      resolved_at: new Date().toISOString(),
    }).eq("id", id);
    await db().from("audit_log").insert({
      actor_id: actorId,
      action: `report.${status}`,
      target_type: "report",
      target_id: id,
    });
    refresh();
  };

  const targetLink = (r: Report): string => {
    if (r.target_type === "post") return `/community/p/${r.target_id}`;
    if (r.target_type === "profile") return `/community/members`;
    return `/community`;
  };

  const fetchTargetAuthor = async (r: Report): Promise<string | null> => {
    if (!supabase) return null;
    if (r.target_type === "post") {
      const { data } = await db().from("posts").select("author_id").eq("id", r.target_id).maybeSingle();
      return data?.author_id ?? null;
    }
    if (r.target_type === "comment") {
      const { data } = await db().from("comments").select("author_id").eq("id", r.target_id).maybeSingle();
      return data?.author_id ?? null;
    }
    if (r.target_type === "profile") return r.target_id;
    return null;
  };

  const hideContent = async (r: Report) => {
    if (!supabase) return;
    if (r.target_type === "post" || r.target_type === "comment") {
      await db().from(r.target_type === "post" ? "posts" : "comments")
        .update({ deleted_at: new Date().toISOString() }).eq("id", r.target_id);
      await db().from("audit_log").insert({
        actor_id: actorId,
        action: `${r.target_type}.hidden`,
        target_type: r.target_type,
        target_id: r.target_id,
        meta: { report_id: r.id },
      });
    }
    await setStatus(r.id, "resolved", "Content hidden");
  };

  const warnUser = async (r: Report) => {
    const target = await fetchTargetAuthor(r);
    if (!target) { alert("Couldn't resolve target user."); return; }
    const note = window.prompt("Warning message (sent to user):");
    if (!note) return;
    const res = await insertModeration(ctx, { targetUserId: target, kind: "warn", note, relatedReportId: r.id });
    if (res.error) { alert(res.error); return; }
    await setStatus(r.id, "resolved", "Warning sent");
  };

  const muteUser = async (r: Report) => {
    const target = await fetchTargetAuthor(r);
    if (!target) return;
    const expiresAt = promptMuteDuration();
    if (!expiresAt) return;
    const res = await insertModeration(ctx, { targetUserId: target, kind: "mute", expiresAt, relatedReportId: r.id });
    if (res.error) { alert(res.error); return; }
    await setStatus(r.id, "resolved", "User muted");
  };

  const banUser = async (r: Report) => {
    const target = await fetchTargetAuthor(r);
    if (!target) return;
    if (!window.confirm("Ban this user? They will be blocked from posting/commenting.")) return;
    const res = await insertModeration(ctx, { targetUserId: target, kind: "ban", relatedReportId: r.id });
    if (res.error) { alert(res.error); return; }
    await setStatus(r.id, "resolved", "User banned");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-1.5">
        {(["open","dismissed","resolved"] as ReportTab[]).map((t) => (
          <Tag key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Tag>
        ))}
      </div>

      {loading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title={tab === "open" ? "No open reports" : `Nothing ${tab}`}
          body="When members report content, items appear here for review."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 border border-paper/12 bg-ink/40 p-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                <span className="border border-paper/15 px-2 py-0.5 text-paper/85">{r.target_type}</span>
                <span className="border border-signal/40 px-2 py-0.5 text-signal">{r.reason_category}</span>
                <span className="text-paper/45">· {relativeTime(r.created_at)}</span>
                {r.reporter && (
                  <span className="ml-auto text-paper/65">@{r.reporter.handle}</span>
                )}
              </div>
              {r.reason && (
                <div className="text-[13px] text-paper/80 whitespace-pre-wrap">{r.reason}</div>
              )}
              <div className="flex flex-wrap items-center gap-3 border-t border-paper/10 pt-3">
                <Link to={targetLink(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:text-paper">
                  View target →
                </Link>
                {tab === "open" && (
                  <div className="ml-auto flex flex-wrap items-center gap-3">
                    <button onClick={() => setStatus(r.id, "dismissed")} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Dismiss</button>
                    <button onClick={() => hideContent(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:text-signal">Hide content</button>
                    <button onClick={() => warnUser(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:text-paper">Warn user</button>
                    <button onClick={() => muteUser(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:text-paper">Mute user</button>
                    <button onClick={() => banUser(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal hover:text-signal">Ban user</button>
                  </div>
                )}
                {r.resolution_note && (
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">{r.resolution_note}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Members pane ────────────────────────────────────────────────────────
const MembersPane = ({
  members,
  loading,
  promote,
  actorId,
  refresh,
  meId,
}: {
  members: Profile[];
  loading: boolean;
  promote: (id: string, role: "staff" | "admin" | "member") => Promise<void>;
  actorId: string;
  refresh: () => void;
  meId?: string;
}) => {
  const ctx: ModerationContext = { actorId, refresh };

  const warn = async (m: Profile) => {
    const note = window.prompt(`Warn @${m.handle}:`);
    if (!note) return;
    const r = await insertModeration(ctx, { targetUserId: m.id, kind: "warn", note });
    if (r.error) alert(r.error);
  };
  const mute = async (m: Profile) => {
    const expiresAt = promptMuteDuration();
    if (!expiresAt) return;
    const r = await insertModeration(ctx, { targetUserId: m.id, kind: "mute", expiresAt });
    if (r.error) alert(r.error);
  };
  const ban = async (m: Profile) => {
    if (!window.confirm(`Ban @${m.handle}?`)) return;
    const r = await insertModeration(ctx, { targetUserId: m.id, kind: "ban" });
    if (r.error) alert(r.error);
  };
  const unban = async (m: Profile) => {
    const r = await insertModeration(ctx, { targetUserId: m.id, kind: "unban" });
    if (r.error) alert(r.error);
  };
  const unmute = async (m: Profile) => {
    const r = await insertModeration(ctx, { targetUserId: m.id, kind: "unmute" });
    if (r.error) alert(r.error);
  };

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading members…</p>;
  }
  if (members.length === 0) {
    return <EmptyState title="No members yet" body="When users sign up they'll show up here." />;
  }
  return (
    <div className="overflow-hidden border border-paper/12">
      <div className="grid grid-cols-12 gap-4 border-b border-paper/10 bg-ink/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
        <div className="col-span-5">Member</div>
        <div className="col-span-3">Role</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {members.map((m) => {
        const isMuted = m.mute_until && new Date(m.mute_until).getTime() > Date.now();
        const isBanned = !!m.banned_at;
        const warnings = m.warning_count ?? 0;
        return (
          <div
            key={m.id}
            className="grid grid-cols-12 items-center gap-4 border-b border-paper/8 px-4 py-3 text-[13px] last:border-b-0"
          >
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <Avatar profile={m} size={28} />
              <div className="min-w-0">
                <Link to={`/community/u/${m.handle}`} className="truncate text-paper hover:text-signal">{m.display_name}</Link>
                <div className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">@{m.handle}</div>
              </div>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <StaffBadge role={m.role} />
              {m.role === "member" && (
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Member</span>
              )}
            </div>
            <div className="col-span-2 flex flex-wrap items-center gap-1.5">
              {isBanned && <span className="border border-signal/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-signal">Banned</span>}
              {isMuted && <span className="border border-yellow-500/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-yellow-300">Muted</span>}
              {warnings > 0 && <span className="border border-yellow-500/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-yellow-300">⚠ {warnings}</span>}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2 text-right">
              <details className="relative">
                <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Actions ▾</summary>
                <div className="absolute right-0 top-full z-30 mt-1 flex w-44 flex-col border border-paper/20 bg-ink p-1 shadow-2xl">
                  <Link to={`/community/u/${m.handle}`} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">View profile</Link>
                  {m.role === "member" && (
                    <button onClick={() => promote(m.id, "staff")} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">→ Staff</button>
                  )}
                  {m.role === "staff" && (
                    <>
                      <button onClick={() => promote(m.id, "admin")} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">→ Admin</button>
                      <button onClick={() => promote(m.id, "member")} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">Demote</button>
                    </>
                  )}
                  {m.role === "admin" && m.id !== meId && (
                    <button onClick={() => promote(m.id, "staff")} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">→ Staff</button>
                  )}
                  <span className="my-1 block h-px bg-paper/10" />
                  <button onClick={() => warn(m)} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">Warn</button>
                  {isMuted
                    ? <button onClick={() => unmute(m)} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">Unmute</button>
                    : <button onClick={() => mute(m)} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">Mute…</button>
                  }
                  {isBanned
                    ? <button onClick={() => unban(m)} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5">Unban</button>
                    : <button onClick={() => ban(m)} className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-signal hover:bg-paper/5">Ban</button>
                  }
                </div>
              </details>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Posts pane ──────────────────────────────────────────────────────────
const PostsPane = ({ actorId, isAdmin }: { actorId: string; isAdmin: boolean }) => {
  const [rows, setRows] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    db().from("posts")
      .select("*, author:profiles!posts_author_id_fkey(*), channel:channels!posts_channel_id_fkey(*)")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }: { data: Post[] | null }) => {
        setRows((data ?? []) as Post[]);
        setLoading(false);
      });
  }, [tick]);

  const togglePin = async (p: Post) => {
    await db().from("posts").update({ pinned: !p.pinned }).eq("id", p.id);
    await db().from("audit_log").insert({ actor_id: actorId, action: p.pinned ? "post.unpin" : "post.pin", target_type: "post", target_id: p.id });
    refresh();
  };
  const toggleLock = async (p: Post) => {
    await db().from("posts").update({ locked: !p.locked }).eq("id", p.id);
    await db().from("audit_log").insert({ actor_id: actorId, action: p.locked ? "post.unlock" : "post.lock", target_type: "post", target_id: p.id });
    refresh();
  };
  const softDelete = async (p: Post) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isDeleted = !!(p as any).deleted_at;
    await db().from("posts").update({ deleted_at: isDeleted ? null : new Date().toISOString() }).eq("id", p.id);
    await db().from("audit_log").insert({ actor_id: actorId, action: isDeleted ? "post.restore" : "post.soft_delete", target_type: "post", target_id: p.id });
    refresh();
  };
  const hardDelete = async (p: Post) => {
    if (!window.confirm("PERMANENTLY delete this post? This cannot be undone.")) return;
    await db().from("posts").delete().eq("id", p.id);
    await db().from("audit_log").insert({ actor_id: actorId, action: "post.hard_delete", target_type: "post", target_id: p.id });
    refresh();
  };

  if (loading) return <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading…</p>;
  if (rows.length === 0) return <EmptyState title="No posts" body="Nothing to moderate yet." />;

  return (
    <div className="overflow-hidden border border-paper/12">
      <div className="grid grid-cols-12 gap-4 border-b border-paper/10 bg-ink/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Author</div>
        <div className="col-span-2">Channel</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {rows.map((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const deleted = !!(p as any).deleted_at;
        return (
          <div key={p.id} className="grid grid-cols-12 items-center gap-4 border-b border-paper/8 px-4 py-3 text-[13px] last:border-b-0">
            <div className="col-span-5 min-w-0">
              <Link to={`/community/p/${p.id}`} className="block truncate text-paper hover:text-signal">{p.title}</Link>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">{p.type}</div>
            </div>
            <div className="col-span-2 truncate font-mono text-[11px] uppercase tracking-[0.18em] text-paper/75">
              @{p.author?.handle ?? "?"}
            </div>
            <div className="col-span-2 truncate font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">
              {p.channel?.name ?? "?"}
            </div>
            <div className="col-span-1 flex flex-wrap items-center gap-1">
              {p.pinned && <span className="border border-signal/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-signal">Pin</span>}
              {p.locked && <span className="border border-paper/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/55">Lock</span>}
              {deleted && <span className="border border-signal/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-signal">Del</span>}
              {!p.pinned && !p.locked && !deleted && <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45">Live</span>}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <button onClick={() => togglePin(p)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">{p.pinned ? "Unpin" : "Pin"}</button>
              <button onClick={() => toggleLock(p)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">{p.locked ? "Unlock" : "Lock"}</button>
              <button onClick={() => softDelete(p)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal">{deleted ? "Restore" : "Del"}</button>
              {isAdmin && <button onClick={() => hardDelete(p)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal hover:text-signal">×</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Resources pane ──────────────────────────────────────────────────────
const ResourcesPane = ({ actorId }: { actorId: string }) => {
  const [rows, setRows] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    db().from("resources")
      .select("*, author:profiles!resources_author_id_fkey(*)")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: Resource[] | null }) => {
        setRows((data ?? []) as Resource[]);
        setLoading(false);
      });
  }, [tick]);

  const unpublish = async (r: Resource) => {
    await db().from("resources").update({ published_at: null }).eq("id", r.id);
    await db().from("audit_log").insert({ actor_id: actorId, action: "resource.unpublish", target_type: "resource", target_id: r.id });
    refresh();
  };
  const publish = async (r: Resource) => {
    await db().from("resources").update({ published_at: new Date().toISOString() }).eq("id", r.id);
    await db().from("audit_log").insert({ actor_id: actorId, action: "resource.publish", target_type: "resource", target_id: r.id });
    refresh();
  };
  const del = async (r: Resource) => {
    if (!window.confirm(`Delete resource "${r.title}"? This cannot be undone.`)) return;
    await db().from("resources").delete().eq("id", r.id);
    await db().from("audit_log").insert({ actor_id: actorId, action: "resource.delete", target_type: "resource", target_id: r.id });
    refresh();
  };

  if (loading) return <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading…</p>;
  if (rows.length === 0) return <EmptyState title="No resources" body="Nothing published or in draft." />;

  return (
    <div className="overflow-hidden border border-paper/12">
      <div className="grid grid-cols-12 gap-4 border-b border-paper/10 bg-ink/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Author</div>
        <div className="col-span-2">Kind</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {rows.map((r) => (
        <div key={r.id} className="grid grid-cols-12 items-center gap-4 border-b border-paper/8 px-4 py-3 text-[13px] last:border-b-0">
          <div className="col-span-5 min-w-0">
            <Link to={`/community/resources/${r.slug}`} className="block truncate text-paper hover:text-signal">{r.title}</Link>
            <div className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">{r.slug}</div>
          </div>
          <div className="col-span-2 truncate font-mono text-[11px] uppercase tracking-[0.18em] text-paper/75">@{r.author?.handle ?? "?"}</div>
          <div className="col-span-2 truncate font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">{r.kind}</div>
          <div className="col-span-1">
            {r.published_at
              ? <span className="border border-signal/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-signal">Live</span>
              : <span className="border border-paper/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/55">Draft</span>}
          </div>
          <div className="col-span-2 flex items-center justify-end gap-2">
            <Link to={`/community/resources/${r.slug}/edit`} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Edit</Link>
            {r.published_at
              ? <button onClick={() => unpublish(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Unpub</button>
              : <button onClick={() => publish(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Publish</button>
            }
            <button onClick={() => del(r)} className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal hover:text-signal">×</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Audit pane ──────────────────────────────────────────────────────────
const AuditPane = () => {
  const [rows, setRows] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    db().from("audit_log")
      .select("*, actor:profiles!actor_id(*)")
      .order("created_at", { ascending: false })
      .range(page * pageSize, page * pageSize + pageSize - 1)
      .then(({ data }: { data: AuditEntry[] | null }) => {
        setRows((data ?? []) as AuditEntry[]);
        setLoading(false);
      });
  }, [page]);

  if (loading) return <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading…</p>;
  if (rows.length === 0 && page === 0) return <EmptyState title="No actions yet" body="Admin and moderation actions will appear here." />;

  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.id} className="border border-paper/12 bg-ink/40 px-4 py-3 text-[13px]">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
            <span className="text-paper/45">{relativeTime(r.created_at)}</span>
            {r.actor && <span className="text-paper/85">@{r.actor.handle}</span>}
            <span className="border border-paper/15 px-1.5 py-0.5 text-paper/85">{r.action}</span>
            {r.target_type && r.target_id && (
              <span className="text-paper/55">
                {r.target_type === "post"
                  ? <Link to={`/community/p/${r.target_id}`} className="text-paper/85 hover:text-signal">{r.target_type}:{r.target_id.slice(0, 8)}</Link>
                  : <span>{r.target_type}:{r.target_id.slice(0, 8)}</span>
                }
              </span>
            )}
          </div>
          {r.meta && Object.keys(r.meta).length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">meta ▾</summary>
              <pre className="mt-1 overflow-x-auto border border-paper/10 bg-ink/60 p-2 font-mono text-[11px] text-paper/75">{JSON.stringify(r.meta, null, 2)}</pre>
            </details>
          )}
        </div>
      ))}
      <div className="mt-2 flex items-center justify-end gap-3">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper disabled:opacity-40"
        >
          ← Prev
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Page {page + 1}</span>
        <button
          disabled={rows.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ─── Main page ───────────────────────────────────────────────────────────
const AdminPage = () => {
  const { profile, isMock, refreshProfile } = useAuth();
  const [pane, setPane] = useState<Pane>("reports");
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [memberTick, setMemberTick] = useState(0);

  const allowed = isMock || (profile && profile.role !== "member");
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (!supabase || !allowed) return;
    if (pane !== "members") return;
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setMembers((data ?? []) as unknown as Profile[]);
        setLoading(false);
      });
  }, [pane, allowed, memberTick]);

  const promote = async (id: string, role: "staff" | "admin" | "member") => {
    if (!supabase) return;
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) { alert(error.message); return; }
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    if (id === profile?.id) await refreshProfile();
    setMemberTick((n) => n + 1);
  };

  if (!allowed) return <Navigate to="/community" replace />;

  const actorId = profile?.id ?? "";

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal>
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
              [ ✦ — Admin console ]
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
              Staff only
            </span>
          </div>
        </Reveal>

        <h1
          className="mt-5 text-paper"
          style={{
            fontSize: "clamp(1.8rem, 4.4vw, 3rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          Moderation console.
        </h1>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap items-center gap-1.5">
            {(["reports", "members", "posts", "resources", "audit"] as Pane[]).map((p) => (
              <Tag key={p} active={pane === p} onClick={() => setPane(p)}>
                {p}
              </Tag>
            ))}
          </div>
        </Reveal>

        <div className="mt-8">
          {pane === "reports" && <ReportsPane actorId={actorId} />}
          {pane === "members" && (
            <MembersPane
              members={members}
              loading={loading}
              promote={promote}
              actorId={actorId}
              refresh={() => setMemberTick((n) => n + 1)}
              meId={profile?.id}
            />
          )}
          {pane === "posts" && <PostsPane actorId={actorId} isAdmin={!!isAdmin} />}
          {pane === "resources" && <ResourcesPane actorId={actorId} />}
          {pane === "audit" && <AuditPane />}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
