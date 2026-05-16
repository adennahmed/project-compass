import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/community/Avatar";
import StaffBadge from "@/components/community/StaffBadge";
import EmptyState from "@/components/community/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/lib/community/types";
import { dateStamp } from "@/lib/community/format";
import { useAuth } from "@/lib/community/auth";

type Tab = "posts" | "comments" | "resources";

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
  const tabs: Tab[] = ["posts", "comments", ...(isStaff ? (["resources"] as Tab[]) : [])];
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
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
