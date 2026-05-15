import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import AnnouncementCard from "@/components/community/AnnouncementCard";
import EmptyState from "@/components/community/EmptyState";
import { announcements } from "@/lib/community/mock";

const AnnouncementsPage = () => {
  const items = announcements();
  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal>
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
          <CharReveal stagger={26}>{"FROM THE"}</CharReveal>{" "}
          <span className="italic-editorial text-signal">
            <CharReveal stagger={26} delay={200}>{"KOZAI"}</CharReveal>
          </span>{" "}
          <CharReveal stagger={26} delay={420}>{"TEAM."}</CharReveal>
        </h1>

        <Reveal delay={500}>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
            Updates and releases from the studio. Members can join the conversation in
            the comments on each post.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-6">
          {items.length === 0 ? (
            <EmptyState
              title="No announcements yet"
              body="The team hasn't posted anything yet. Check back soon."
            />
          ) : (
            items.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
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
