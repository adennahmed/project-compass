import { useCallback, useEffect, useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import ThreadItem from "@/components/community/ThreadItem";
import EmptyState from "@/components/community/EmptyState";
import Tag from "@/components/community/Tag";
import PostComposer from "@/components/community/PostComposer";
import RulesGate from "@/components/community/RulesGate";
import { useAuth } from "@/lib/community/auth";
import { fetchChannels, fetchPosts } from "@/lib/community/queries";
import { Channel, Post } from "@/lib/community/types";
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

type Filter = "new" | "top" | "unanswered";

const SocialPage = () => {
  const { session, profile, loading: authLoading } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelSlug, setChannelSlug] = useState<string | "all">("all");
  const [filter, setFilter] = useState<Filter>("new");

  const load = useCallback(async () => {
    setLoading(true);
    const [chs, ps] = await Promise.all([
      fetchChannels(),
      fetchPosts({ excludeAnnouncements: true }),
    ]);
    setChannels(chs.filter((c) => c.kind === "discussion"));
    setPosts(ps);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Realtime: any post change triggers reload
  useEffect(() => {
    if (!supabase) return;
    const channel = db()
      .channel("social-posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => { void load(); })
      .subscribe();
    return () => { db().removeChannel(channel); };
  }, [load]);

  const filtered = useMemo(() => {
    let base = posts;
    if (channelSlug !== "all") base = base.filter((p) => p.channel?.slug === channelSlug);
    if (filter === "unanswered") base = base.filter((p) => (p.comment_count ?? 0) === 0);
    // 'top' and 'new' both fall back to created_at since we don't precompute reaction totals
    return base;
  }, [posts, channelSlug, filter]);

  const showRules = !!session && !authLoading && profile && !profile.community_rules_accepted_at;

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      {showRules && <RulesGate />}
      <div className="container-wide">
        <Reveal replay={false}>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ 03 — Social ]
          </div>
        </Reveal>

        <h1
          className="mt-5 text-paper"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
          }}
        >
          <CharReveal replay={false} stagger={26}>{"THE"}</CharReveal>{" "}
          <span className="italic-editorial text-signal">
            <CharReveal replay={false} stagger={26} delay={180}>{"ROOM"}</CharReveal>
          </span>{" "}
          <CharReveal replay={false} stagger={26} delay={360}>{"IS OPEN."}</CharReveal>
        </h1>

        <Reveal replay={false} delay={500}>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
            Threads, questions, demos. Pick a channel or read everything.
          </p>
        </Reveal>

        <Reveal replay={false} delay={140}>
          <div className="mt-10 flex flex-wrap items-center gap-1.5">
            <Tag active={channelSlug === "all"} onClick={() => setChannelSlug("all")}>
              All channels
            </Tag>
            {channels.map((c) => (
              <Tag key={c.id} active={channelSlug === c.slug} onClick={() => setChannelSlug(c.slug)}>
                {c.name}
              </Tag>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {(["new", "top", "unanswered"] as Filter[]).map((f) => (
              <Tag key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Tag>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <PostComposer
            channels={channels}
            defaultChannelSlug={channelSlug !== "all" ? channelSlug : undefined}
            onPosted={load}
          />
        </div>

        <Reveal replay={false} delay={200}>
          <div className="mt-8 border border-paper/12 bg-ink/40">
            {loading ? (
              <div className="p-8 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading threads…</div>
            ) : filtered.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="Quiet in here"
                  body="No threads match this filter yet. Try a different channel — or be the one to start something."
                />
              </div>
            ) : (
              filtered.map((p) => <ThreadItem key={p.id} post={p} />)
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SocialPage;
