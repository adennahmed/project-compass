import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { format } from "date-fns";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/community/Avatar";
import EmptyState from "@/components/community/EmptyState";
import MarkdownBody from "@/components/community/MarkdownBody";
import StaffBadge from "@/components/community/StaffBadge";
import { useAuth } from "@/lib/community/auth";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/lib/community/types";
import { relativeTime } from "@/lib/community/format";

// ─── Types ───────────────────────────────────────────────────────────────
interface EventRow {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  capacity: number | null;
  host_id: string;
  cancelled_at: string | null;
  created_at: string;
  host?: Profile;
}

type RsvpStatus = "going" | "maybe" | "declined";

interface RsvpRow {
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  user?: Profile;
}

interface MessageRow {
  id: string;
  event_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author?: Profile;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const PANEL = "border border-paper/12 bg-ink/40";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55";

// ─── EventEditor (inline form) ──────────────────────────────────────────
const EventEditor = ({
  hostId,
  initial,
  onSaved,
  onCancel,
}: {
  hostId: string;
  initial?: EventRow | null;
  onSaved: () => void;
  onCancel: () => void;
}) => {
  const toLocal = (iso: string | null | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startsAt, setStartsAt] = useState(toLocal(initial?.starts_at));
  const [endsAt, setEndsAt] = useState(toLocal(initial?.ends_at));
  const [location, setLocation] = useState(initial?.location ?? "");
  const [capacity, setCapacity] = useState<string>(initial?.capacity != null ? String(initial.capacity) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!supabase || busy) return;
    if (!title.trim() || !startsAt) {
      setError("Title and start time are required.");
      return;
    }
    setBusy(true);
    setError(null);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      location: location.trim() || null,
      capacity: capacity.trim() ? Math.max(1, parseInt(capacity, 10) || 1) : null,
      host_id: hostId,
    };
    const query = initial
      ? db().from("events").update(payload).eq("id", initial.id)
      : db().from("events").insert(payload);
    const { error: err } = await query;
    setBusy(false);
    if (err) { setError(err.message); return; }
    onSaved();
  };

  return (
    <div className={`${PANEL} flex flex-col gap-3 p-4 md:p-5`}>
      <div className={LABEL}>{initial ? "Edit event" : "New event"}</div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-transparent text-[18px] font-medium text-paper placeholder:text-paper/35 focus:outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (markdown ok)"
        rows={3}
        className="w-full resize-y bg-transparent text-[14px] text-paper placeholder:text-paper/35 focus:outline-none"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Starts at</span>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="border border-paper/15 bg-ink px-2 py-1.5 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Ends at (optional)</span>
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="border border-paper/15 bg-ink px-2 py-1.5 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Zoom, HQ, URL…"
            className="border border-paper/15 bg-ink px-2 py-1.5 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Capacity (optional)</span>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Unlimited"
            className="border border-paper/15 bg-ink px-2 py-1.5 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
          />
        </label>
      </div>
      {error && <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">↘ {error}</div>}
      <div className="flex items-center justify-between gap-3 border-t border-paper/10 pt-3">
        <button onClick={onCancel} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Cancel</button>
        <button
          onClick={() => void submit()}
          disabled={busy || !title.trim() || !startsAt}
          className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Saving…" : initial ? "Save ↘" : "Create event ↘"}
        </button>
      </div>
    </div>
  );
};

// ─── Event chat ─────────────────────────────────────────────────────────
const EventChat = ({
  eventId,
  meId,
  isStaff,
  canRead,
  canWrite,
  onQuickRsvp,
}: {
  eventId: string;
  meId: string;
  isStaff: boolean;
  canRead: boolean;
  canWrite: boolean;
  onQuickRsvp: () => Promise<void>;
}) => {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!supabase || !canRead) { setLoading(false); return; }
    setLoading(true);
    const { data } = await db()
      .from("event_messages")
      .select("*, author:profiles!event_messages_author_id_fkey(*)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true })
      .limit(50);
    setMessages((data ?? []) as MessageRow[]);
    setLoading(false);
  }, [eventId, canRead]);

  useEffect(() => { void reload(); }, [reload]);

  // Realtime subscribe
  useEffect(() => {
    if (!supabase || !canRead) return;
    const channel = supabase
      .channel(`event-messages-${eventId}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "event_messages", filter: `event_id=eq.${eventId}` }, () => {
        void reload();
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [eventId, canRead, reload]);

  const send = async () => {
    if (!supabase || !body.trim() || busy) return;
    setBusy(true);
    setError(null);
    const { error: err } = await db().from("event_messages").insert({
      event_id: eventId,
      author_id: meId,
      body: body.trim(),
    });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setBody("");
    void reload();
  };

  const del = async (id: string) => {
    if (!supabase) return;
    await db().from("event_messages").delete().eq("id", id);
    void reload();
  };

  if (!canRead) {
    return (
      <div className={`${PANEL} flex items-center justify-between gap-3 p-4`}>
        <span className={LABEL}>↘ RSVP to join the conversation.</span>
        <button
          onClick={() => void onQuickRsvp()}
          className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
        >
          RSVP going ↘
        </button>
      </div>
    );
  }

  return (
    <div className={`${PANEL} flex flex-col`}>
      <div className="border-b border-paper/10 px-4 py-3">
        <span className={LABEL}>[ ✦ — Event chat ]</span>
      </div>
      <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto p-4">
        {loading ? (
          <span className={LABEL}>↘ Loading…</span>
        ) : messages.length === 0 ? (
          <span className={LABEL}>Be the first to say something.</span>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="group flex items-start gap-3">
              {m.author && <Avatar profile={m.author} size={26} />}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                  <span className="text-paper/85">@{m.author?.handle ?? "user"}</span>
                  <span>· {relativeTime(m.created_at)}</span>
                  {(m.author_id === meId || isStaff) && (
                    <button
                      onClick={() => void del(m.id)}
                      className="ml-auto opacity-0 transition-opacity hover:text-signal group-hover:opacity-100"
                      title="Delete"
                    >×</button>
                  )}
                </div>
                <div className="mt-0.5 whitespace-pre-wrap text-[13px] text-paper/85">{m.body}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {canWrite ? (
        <div className="flex items-end gap-2 border-t border-paper/10 p-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a message…"
            rows={2}
            className="flex-1 resize-none bg-transparent text-[13px] text-paper placeholder:text-paper/35 focus:outline-none"
          />
          <button
            onClick={() => void send()}
            disabled={busy || !body.trim()}
            className="border border-paper bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "…" : "Send ↘"}
          </button>
        </div>
      ) : (
        <div className="border-t border-paper/10 px-4 py-3">
          <span className={LABEL}>↘ You can't post (muted or suspended).</span>
        </div>
      )}
      {error && <div className="px-4 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-signal">↘ {error}</div>}
    </div>
  );
};

// ─── Event row ──────────────────────────────────────────────────────────
const EventRowView = ({
  event,
  meId,
  myStatus,
  rsvps,
  isStaff,
  isMutedOrBanned,
  onRsvp,
  onChangeRsvp,
  onClearRsvp,
  onEdit,
  onDelete,
  expanded,
  onToggle,
}: {
  event: EventRow;
  meId: string;
  myStatus: RsvpStatus | null;
  rsvps: RsvpRow[];
  isStaff: boolean;
  isMutedOrBanned: boolean;
  onRsvp: (eventId: string, status: RsvpStatus) => Promise<void>;
  onChangeRsvp: (eventId: string, status: RsvpStatus) => Promise<void>;
  onClearRsvp: (eventId: string) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const starts = new Date(event.starts_at);
  const going = rsvps.filter((r) => r.status === "going");
  const maybe = rsvps.filter((r) => r.status === "maybe");

  const setStatus = async (s: RsvpStatus, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isMutedOrBanned) return;
    if (myStatus === s) await onClearRsvp(event.id);
    else if (myStatus) await onChangeRsvp(event.id, s);
    else await onRsvp(event.id, s);
  };

  const canChat = isStaff || !!myStatus;

  return (
    <div className={`${PANEL} ${event.cancelled_at ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-stretch gap-4 px-4 py-4 text-left transition-colors hover:bg-paper/3 md:gap-6 md:px-5"
      >
        {/* Date column */}
        <div className="flex w-[68px] shrink-0 flex-col items-start border-r border-paper/10 pr-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">{format(starts, "MMM")}</div>
          <div
            className="text-paper"
            style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            {format(starts, "d")}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45">{format(starts, "EEE · HH:mm")}</div>
        </div>
        {/* Main */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
            {event.host && <span className="text-paper/85">@{event.host.handle}</span>}
            {event.location && <span>· {event.location}</span>}
            {event.capacity != null && <span>· cap {going.length}/{event.capacity}</span>}
            {event.cancelled_at && <span className="text-signal">· cancelled</span>}
          </div>
          <div className="mt-1 truncate text-[16px] font-medium text-paper">{event.title}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
            {going.length} going{maybe.length > 0 && ` · ${maybe.length} maybe`}
          </div>
        </div>
        {/* RSVP toggles */}
        <div className="hidden shrink-0 items-center gap-1 self-center md:flex">
          {(["going", "maybe", "declined"] as RsvpStatus[]).map((s) => {
            const active = myStatus === s;
            return (
              <span
                key={s}
                role="button"
                tabIndex={0}
                onClick={(e) => void setStatus(s, e)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); void setStatus(s); } }}
                className={`cursor-pointer border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                  active ? "border-signal bg-signal text-ink" : "border-paper/20 text-paper/65 hover:border-paper/40 hover:text-paper"
                } ${isMutedOrBanned ? "pointer-events-none opacity-40" : ""}`}
              >
                {s === "going" ? "Going" : s === "maybe" ? "Maybe" : "Decline"}
              </span>
            );
          })}
        </div>
      </button>

      {/* Mobile RSVP row */}
      <div className="flex items-center gap-1 border-t border-paper/10 px-4 py-2 md:hidden">
        {(["going", "maybe", "declined"] as RsvpStatus[]).map((s) => {
          const active = myStatus === s;
          return (
            <button
              key={s}
              onClick={() => void setStatus(s)}
              disabled={isMutedOrBanned}
              className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                active ? "border-signal bg-signal text-ink" : "border-paper/20 text-paper/65"
              } disabled:opacity-40`}
            >
              {s === "going" ? "Going" : s === "maybe" ? "Maybe" : "Decline"}
            </button>
          );
        })}
      </div>

      {expanded && (
        <div className="border-t border-paper/10 px-4 py-4 md:px-5">
          {event.description && (
            <div className="mb-5">
              <MarkdownBody source={event.description} size="compact" />
            </div>
          )}
          {isStaff && (
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button onClick={onEdit} className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper">Edit event</button>
              <button onClick={onDelete} className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal hover:text-signal">Delete event</button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className={LABEL}>Going ({going.length})</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {going.length === 0 ? <span className={LABEL}>—</span> : going.map((r) => r.user && (
                  <Link key={r.user_id} to={`/community/u/${r.user.handle}`} className="inline-flex items-center gap-2 border border-paper/15 px-2 py-1 hover:border-paper/35">
                    <Avatar profile={r.user} size={20} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85">@{r.user.handle}</span>
                    <StaffBadge role={r.user.role} />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className={LABEL}>Maybe ({maybe.length})</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {maybe.length === 0 ? <span className={LABEL}>—</span> : maybe.map((r) => r.user && (
                  <Link key={r.user_id} to={`/community/u/${r.user.handle}`} className="inline-flex items-center gap-2 border border-paper/15 px-2 py-1 hover:border-paper/35">
                    <Avatar profile={r.user} size={20} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85">@{r.user.handle}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <EventChat
              eventId={event.id}
              meId={meId}
              isStaff={isStaff}
              canRead={canChat}
              canWrite={canChat && !isMutedOrBanned}
              onQuickRsvp={() => onRsvp(event.id, "going")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main page ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const { session, profile, isMock } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null);

  const isStaff = profile?.role === "staff" || profile?.role === "admin";
  const meId = profile?.id ?? "";
  const isMutedOrBanned =
    !!profile?.banned_at ||
    !!(profile?.mute_until && new Date(profile.mute_until).getTime() > Date.now());

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!supabase || isMock) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [{ data: eData }, { data: rData }] = await Promise.all([
        db()
          .from("events")
          .select("*, host:profiles!events_host_id_fkey(*)")
          .order("starts_at", { ascending: true }),
        db()
          .from("event_rsvps")
          .select("*, user:profiles!event_rsvps_user_id_fkey(*)"),
      ]);
      if (cancelled) return;
      setEvents((eData ?? []) as EventRow[]);
      setRsvps((rData ?? []) as RsvpRow[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [tick, isMock]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return events.filter((e) => new Date(e.starts_at).getTime() >= now - 60 * 60 * 1000);
  }, [events]);

  const myRsvpByEvent = useMemo(() => {
    const m = new Map<string, RsvpStatus>();
    rsvps.filter((r) => r.user_id === meId).forEach((r) => m.set(r.event_id, r.status));
    return m;
  }, [rsvps, meId]);

  const rsvpsByEvent = useMemo(() => {
    const m = new Map<string, RsvpRow[]>();
    rsvps.forEach((r) => {
      const list = m.get(r.event_id) ?? [];
      list.push(r);
      m.set(r.event_id, list);
    });
    return m;
  }, [rsvps]);

  const myUpcoming = useMemo(
    () => upcoming.filter((e) => {
      const s = myRsvpByEvent.get(e.id);
      return s === "going" || s === "maybe";
    }),
    [upcoming, myRsvpByEvent],
  );

  const setRsvp = useCallback(async (eventId: string, status: RsvpStatus) => {
    if (!supabase || !meId) return;
    await db().from("event_rsvps").insert({ event_id: eventId, user_id: meId, status });
    refresh();
  }, [meId, refresh]);

  const changeRsvp = useCallback(async (eventId: string, status: RsvpStatus) => {
    if (!supabase || !meId) return;
    await db().from("event_rsvps").update({ status }).eq("event_id", eventId).eq("user_id", meId);
    refresh();
  }, [meId, refresh]);

  const clearRsvp = useCallback(async (eventId: string) => {
    if (!supabase || !meId) return;
    await db().from("event_rsvps").delete().eq("event_id", eventId).eq("user_id", meId);
    refresh();
  }, [meId, refresh]);

  const deleteEvent = useCallback(async (id: string) => {
    if (!supabase) return;
    if (!window.confirm("Delete this event? RSVPs and chat will be removed.")) return;
    await db().from("events").delete().eq("id", id);
    refresh();
  }, [refresh]);

  if (!session && !isMock) return <Navigate to="/community/auth" replace />;
  if (!profile && !isMock) {
    return (
      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="container-wide">
          <span className={LABEL}>↘ Loading…</span>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal replay={false}>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ ✦ — Member dashboard ]
          </div>
        </Reveal>

        <h1
          className="mt-5 text-paper"
          style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.02 }}
        >
          Your dashboard.
        </h1>
        <Reveal replay={false} delay={120}>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
            Upcoming events, RSVPs, and event chat — all in one place.
          </p>
        </Reveal>

        {/* ─── Your RSVPs ───────────────────────────────────────────── */}
        <Reveal replay={false} delay={180}>
          <div className="mt-12">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div className={LABEL}>[ 01 — Your RSVPs ]</div>
              {!loading && (
                <span className={LABEL}>{myUpcoming.length} upcoming</span>
              )}
            </div>
            {loading ? (
              <span className={LABEL}>↘ Loading…</span>
            ) : myUpcoming.length === 0 ? (
              <EmptyState title="No RSVPs yet" body="When you RSVP to an event, it'll show up here." />
            ) : (
              <div className="flex flex-col gap-3">
                {myUpcoming.map((e) => (
                  <EventRowView
                    key={`my-${e.id}`}
                    event={e}
                    meId={meId}
                    myStatus={myRsvpByEvent.get(e.id) ?? null}
                    rsvps={rsvpsByEvent.get(e.id) ?? []}
                    isStaff={isStaff}
                    isMutedOrBanned={isMutedOrBanned}
                    onRsvp={setRsvp}
                    onChangeRsvp={changeRsvp}
                    onClearRsvp={clearRsvp}
                    onEdit={() => { setEditingEvent(e); setShowEditor(true); }}
                    onDelete={() => void deleteEvent(e.id)}
                    expanded={expanded === `my-${e.id}`}
                    onToggle={() => setExpanded((x) => x === `my-${e.id}` ? null : `my-${e.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* ─── Upcoming events ──────────────────────────────────────── */}
        <Reveal replay={false} delay={220}>
          <div className="mt-14">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div className={LABEL}>[ 02 — Upcoming events ]</div>
              {isStaff && !showEditor && (
                <button
                  onClick={() => { setEditingEvent(null); setShowEditor(true); }}
                  className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
                >
                  + New event
                </button>
              )}
            </div>

            {isStaff && showEditor && (
              <div className="mb-4">
                <EventEditor
                  hostId={meId}
                  initial={editingEvent}
                  onSaved={() => { setShowEditor(false); setEditingEvent(null); refresh(); }}
                  onCancel={() => { setShowEditor(false); setEditingEvent(null); }}
                />
              </div>
            )}

            {loading ? (
              <span className={LABEL}>↘ Loading events…</span>
            ) : upcoming.length === 0 ? (
              <EmptyState
                title="No upcoming events"
                body={isStaff ? "Create the first one — click '+ New event' above." : "Check back soon — the Kozai team posts new sessions regularly."}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {upcoming.map((e) => (
                  <EventRowView
                    key={e.id}
                    event={e}
                    meId={meId}
                    myStatus={myRsvpByEvent.get(e.id) ?? null}
                    rsvps={rsvpsByEvent.get(e.id) ?? []}
                    isStaff={isStaff}
                    isMutedOrBanned={isMutedOrBanned}
                    onRsvp={setRsvp}
                    onChangeRsvp={changeRsvp}
                    onClearRsvp={clearRsvp}
                    onEdit={() => { setEditingEvent(e); setShowEditor(true); }}
                    onDelete={() => void deleteEvent(e.id)}
                    expanded={expanded === e.id}
                    onToggle={() => setExpanded((x) => x === e.id ? null : e.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Dashboard;
