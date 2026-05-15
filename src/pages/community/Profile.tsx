import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/community/Avatar";
import StaffBadge from "@/components/community/StaffBadge";
import ThreadItem from "@/components/community/ThreadItem";
import ResourceCard from "@/components/community/ResourceCard";
import EmptyState from "@/components/community/EmptyState";
import {
  MOCK_POSTS,
  MOCK_RESOURCES,
  profileByHandle,
} from "@/lib/community/mock";
import { dateStamp } from "@/lib/community/format";
import { useAuth } from "@/lib/community/auth";

type Tab = "posts" | "comments" | "resources";

const ProfilePage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { profile: me } = useAuth();
  const profile = handle ? profileByHandle(handle) : null;

  const isStaff = profile && profile.role !== "member";
  const tabs: Tab[] = ["posts", "comments", ...(isStaff ? (["resources"] as Tab[]) : [])];
  const [tab, setTab] = useState<Tab>("posts");

  const myPosts = useMemo(
    () => (profile ? MOCK_POSTS.filter((p) => p.author_id === profile.id) : []),
    [profile],
  );
  const myResources = useMemo(
    () => (profile ? MOCK_RESOURCES.filter((r) => r.author_id === profile.id) : []),
    [profile],
  );

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

  const isMe = me?.id === profile.id;

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ 06 — Profile ]
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-6 flex flex-col gap-6 border border-paper/12 bg-ink/40 p-6 md:flex-row md:items-center md:gap-10 md:p-10">
            <Avatar profile={profile} size={108} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="text-paper"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.05,
                  }}
                >
                  {profile.display_name}
                </h1>
                <StaffBadge role={profile.role} size="md" />
              </div>
              <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.22em] text-paper/55">
                @{profile.handle} · joined {dateStamp(profile.created_at)}
              </div>
              {profile.bio && (
                <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.6] text-paper/75">
                  {profile.bio}
                </p>
              )}
              {isMe && (
                <div className="mt-5">
                  <button
                    type="button"
                    className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75 hover:text-paper"
                  >
                    Edit profile ↘
                  </button>
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
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-signal"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "posts" && (
            myPosts.length === 0 ? (
              <EmptyState title="No posts yet" body="When this member starts a thread or announcement, it shows up here." />
            ) : (
              <div className="border border-paper/12 bg-ink/40">
                {myPosts.map((p) => <ThreadItem key={p.id} post={p} />)}
              </div>
            )
          )}
          {tab === "comments" && (
            <EmptyState title="No comments yet" body="Comment activity will be listed here as it accumulates." />
          )}
          {tab === "resources" && (
            myResources.length === 0 ? (
              <EmptyState title="No resources published" body="Staff resources will appear here once published." />
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {myResources.map((r) => <ResourceCard key={r.id} resource={r} />)}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
