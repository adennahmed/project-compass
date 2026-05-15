import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import ThreadItem from "@/components/community/ThreadItem";
import EmptyState from "@/components/community/EmptyState";
import Tag from "@/components/community/Tag";
import { MOCK_CHANNELS, MOCK_POSTS } from "@/lib/community/mock";
import { useAuth } from "@/lib/community/auth";
import { Link } from "react-router-dom";

type Filter = "new" | "top" | "unanswered";

const SocialPage = () => {
  const { session } = useAuth();
  const channels = MOCK_CHANNELS.filter((c) => c.kind === "discussion");
  const [channelSlug, setChannelSlug] = useState<string | "all">("all");
  const [filter, setFilter] = useState<Filter>("new");

  const posts = useMemo(() => {
    let base = MOCK_POSTS.filter((p) => p.type !== "announcement");
    if (channelSlug !== "all") {
      const ch = channels.find((c) => c.slug === channelSlug);
      if (ch) base = base.filter((p) => p.channel_id === ch.id);
    }
    if (filter === "top") {
      base = [...base].sort(
        (a, b) =>
          (Object.values(b.reactions ?? {}).reduce((s, n) => s + (n ?? 0), 0)) -
          (Object.values(a.reactions ?? {}).reduce((s, n) => s + (n ?? 0), 0)),
      );
    } else if (filter === "unanswered") {
      base = base.filter((p) => (p.comment_count ?? 0) === 0);
    } else {
      base = [...base].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return base;
  }, [channelSlug, filter, channels]);

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal>
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
          <CharReveal stagger={26}>{"THE"}</CharReveal>{" "}
          <span className="italic-editorial text-signal">
            <CharReveal stagger={26} delay={180}>{"ROOM"}</CharReveal>
          </span>{" "}
          <CharReveal stagger={26} delay={360}>{"IS OPEN."}</CharReveal>
        </h1>

        <Reveal delay={500}>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
            Threads, questions, demos. Pick a channel or read everything.
          </p>
        </Reveal>

        {/* Channel chips */}
        <Reveal delay={140}>
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

        {/* Filter chips + Composer button */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {(["new", "top", "unanswered"] as Filter[]).map((f) => (
              <Tag key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Tag>
            ))}
          </div>
          {session ? (
            <button
              type="button"
              className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
            >
              Start a thread ↘
            </button>
          ) : (
            <Link
              to="/community/auth"
              className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 hover:text-paper"
            >
              Sign in to post →
            </Link>
          )}
        </div>

        {/* Thread feed */}
        <Reveal delay={200}>
          <div className="mt-8 border border-paper/12 bg-ink/40">
            {posts.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="Quiet in here"
                  body="No threads match this filter yet. Try a different channel — or be the one to start something."
                />
              </div>
            ) : (
              posts.map((p) => <ThreadItem key={p.id} post={p} />)
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SocialPage;
