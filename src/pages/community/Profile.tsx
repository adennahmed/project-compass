import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/community/Avatar";
import StaffBadge from "@/components/community/StaffBadge";
import EmptyState from "@/components/community/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { Post, Profile } from "@/lib/community/types";
import { dateStamp, relativeTime } from "@/lib/community/format";
import { useAuth } from "@/lib/community/auth";

type Tab = "posts" | "comments" | "resources" | "bookmarks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const ProfilePage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { profile: me } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("posts");

  useEffect(() => {
    if (!supabase || !handle) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("handle", handle)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error(error);
          setProfile(null);
        } else {
          setProfile(data as unknown as Profile | null);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [handle]);

  if (loading) {
    return (
      <section className="flex min-h-[40vh] items-center px-6 md:px-10">
        <div className="container-wide font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
          ↘ Loading profile…
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="px-6 py-24 md:px-10">
        <div className="container-wide">
          <EmptyState
            title="Member not found"
            body={`There's no one with the handle @${handle}.`}
            action={
              <Link
                to="/community/members"
                className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 hover:text-paper"
              >
                Browse all members →
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const isStaff = profile.role !== "member";
  const isMe = me?.id === profile.id;
  const tabs: Tab[] = [
    "posts",
    "comments",
    ...(isStaff ? (["resources"] as Tab[]) : []),
    ...(isMe ? (["bookmarks"] as Tab[]) : []),
  ];

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal replay={false}>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ 06 — Profile ]
          </div>
        </Reveal>

        <Reveal replay={false} delay={120}>
          <div className="mt-6 flex flex-col gap-6 border border-paper/12 bg-ink/40 p-6 md:flex-row md:items-center md:gap-10 md:p-10">
            <Avatar profile={profile} size={108} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="text-paper"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}
                >
                  {profile.display_name}
                </h1>
                <StaffBadge role={profile.role} size="md" />
              </div>
              <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.22em] text-paper/55">
                @{profile.handle} · joined {dateStamp(profile.created_at)}
              </div>
              {profile.bio && (
                <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.6] text-paper/75">{profile.bio}</p>
              )}
              {isMe && (
                <div className="mt-5">
                  <Link
                    to="/community/settings"
                    className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75 hover:text-paper"
                  >
                    Edit profile ↘
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Tabs */}
        <div className="mt-10 flex gap-1.5 border-b border-paper/10">
          {tabs.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`relative px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  active ? "text-paper" : "text-paper/55 hover:text-paper/85"
                }`}
              >
                {t}
                {active && <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-signal" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "bookmarks" ? (
            <BookmarksList userId={profile.id} />
          ) : (
            <EmptyState
              title={
                tab === "posts"     ? "No posts yet"
                : tab === "comments" ? "No comments yet"
                : "Nothing published yet"
              }
              body={
                tab === "posts"
                  ? "When this member starts a thread or announcement, it shows up here."
                  : tab === "comments"
                    ? "Comment activity will be listed here as it accumulates."
                    : "Staff resources will appear here once published."
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

interface BookmarkRow { target_type: "post" | "resource"; target_id: string; created_at: string }

const BookmarksList = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<(Post & { _bookmarked_at: string })[]>([]);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let cancel = false;
    (async () => {
      setLoading(true);
      const { data: bms } = await db().from("bookmarks")
        .select("target_type,target_id,created_at")
        .eq("user_id", userId)
        .eq("target_type", "post")
        .order("created_at", { ascending: false })
        .limit(50);
      const rows = (bms ?? []) as BookmarkRow[];
      if (rows.length === 0) {
        if (!cancel) { setPosts([]); setLoading(false); }
        return;
      }
      const ids = rows.map((r) => r.target_id);
      const { data: pdata } = await db().from("posts")
        .select("*, author:profiles!posts_author_id_fkey(*), channel:channels!posts_channel_id_fkey(*)")
        .in("id", ids)
        .is("deleted_at", null);
      const byId = new Map<string, Post>();
      for (const p of (pdata ?? []) as Post[]) byId.set(p.id, p);
      const merged: (Post & { _bookmarked_at: string })[] = [];
      for (const r of rows) {
        const p = byId.get(r.target_id);
        if (p) merged.push({ ...p, _bookmarked_at: r.created_at });
      }
      if (!cancel) { setPosts(merged); setLoading(false); }
    })();
    return () => { cancel = true; };
  }, [userId]);

  if (loading) return <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading bookmarks…</p>;
  if (posts.length === 0) return <EmptyState title="No bookmarks yet" body="Save posts with ☆ to find them again here." />;

  return (
    <div className="flex flex-col gap-2">
      {posts.map((p) => (
        <Link
          key={p.id}
          to={`/community/p/${p.id}`}
          className="block border border-paper/12 bg-ink/40 px-4 py-3 hover:border-paper/25"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
            <span>{p.channel?.name ?? ""}</span>
            <span className="text-paper/35">· saved {relativeTime(p._bookmarked_at)}</span>
          </div>
          <div className="mt-1 text-[15px] text-paper">{p.title}</div>
        </Link>
      ))}
    </div>
  );
};

export default ProfilePage;
