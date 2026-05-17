import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import AnnouncementCard from "@/components/community/AnnouncementCard";
import EmptyState from "@/components/community/EmptyState";
import PostComposer from "@/components/community/PostComposer";
import { fetchChannels, fetchPosts } from "@/lib/community/queries";
import { Channel, Post } from "@/lib/community/types";

const AnnouncementsPage = () => {
  const [items, setItems] = useState<Post[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [chs, ps] = await Promise.all([
      fetchChannels(),
      fetchPosts({ onlyAnnouncements: true }),
    ]);
    setChannels(chs);
    setItems(ps);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal replay={false}>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ 02 — Announcements ]
          </div>
        </Reveal>

        <h1
          className="mt-5 text-paper"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.6rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
          }}
        >
          <CharReveal replay={false} stagger={26}>{"FROM THE"}</CharReveal>{" "}
          <span className="italic-editorial text-signal">
            <CharReveal replay={false} stagger={26} delay={200}>{"KOZAI"}</CharReveal>
          </span>{" "}
          <CharReveal replay={false} stagger={26} delay={420}>{"TEAM."}</CharReveal>
        </h1>

        <Reveal replay={false} delay={500}>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
            Updates and releases from the studio. Members can join the conversation in
            the comments on each post.
          </p>
        </Reveal>

        <div className="mt-10">
          <PostComposer
            announcement
            channels={channels}
            lockedChannelSlug="announcements"
            defaultType="announcement"
            onPosted={load}
          />
        </div>

        <div className="mt-12 flex flex-col gap-6">
          {loading ? (
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading…</div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No announcements yet"
              body="The team hasn't posted anything yet. Check back soon."
            />
          ) : (
            items.map((p, i) => (
              <Reveal replay={false} key={p.id} delay={i * 70}>
                <AnnouncementCard post={p} featured={p.pinned} />
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsPage;
