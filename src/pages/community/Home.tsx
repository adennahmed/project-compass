import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CharReveal from "@/components/CharReveal";
import Reveal from "@/components/Reveal";
import AnnouncementCard from "@/components/community/AnnouncementCard";
import ResourceCard from "@/components/community/ResourceCard";
import ThreadItem from "@/components/community/ThreadItem";
import {
  MOCK_PROFILES,
  MOCK_RESOURCES,
  announcements,
  recentThreads,
} from "@/lib/community/mock";

/**
 * Counter that ticks from 0 → target on mount. Mirrors the loader's
 * easing language so the community home opens with the same visual cadence
 * as the main site.
 */
const CountTicker = ({ to, duration = 1600 }: { to: number; duration?: number }) => {
  const [v, setV] = useState(0);
  const started = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (started.current == null) started.current = now;
      const t = Math.min(1, (now - started.current) / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setV(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(3, "0")}</span>;
};

const CommunityHome = () => {
  const pinned = announcements()[0];
  const otherAnn = announcements().slice(1, 3);
  const threads = recentThreads(5);
  const featuredResource = MOCK_RESOURCES[0];

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-paper/10 bg-ink px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20">
        <div className="container-wide">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
              [ 01 — Hub ]
            </div>
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-10 md:mt-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-8">
              <h1
                className="display text-paper"
                style={{
                  fontSize: "clamp(2.4rem, 6.6vw, 5.5rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.045em",
                  lineHeight: "0.98",
                }}
              >
                <CharReveal stagger={26} delay={0}>{"JOIN THE"}</CharReveal>
                <br />
                <span className="italic-editorial text-signal mr-3">
                  <CharReveal stagger={26} delay={260}>{"KOZAI"}</CharReveal>
                </span>
                <CharReveal stagger={26} delay={520}>{"COMMUNITY."}</CharReveal>
              </h1>

              <Reveal delay={700}>
                <p className="mt-7 max-w-[58ch] text-[16px] leading-[1.65] text-paper/70 md:text-[17px]">
                  A working room for operators, founders, and engineers who care about
                  the tools their teams depend on. Announcements, deep-dives, and the
                  occasional war story — open to read, free to join.
                </p>
              </Reveal>

              <Reveal delay={840}>
                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <Link
                    to="/community/auth"
                    className="border border-paper bg-paper px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
                  >
                    Join the community ↘
                  </Link>
                  <Link
                    to="/community/resources"
                    className="link-wipe inline-flex items-center gap-2 px-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/75 hover:text-paper"
                  >
                    Browse resources →
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Live stats column — counter-driven, mirrors loader aesthetic */}
            <div className="md:col-span-4">
              <Reveal delay={400}>
                <div className="flex flex-col gap-6 border border-paper/12 bg-ink/40 p-6 md:p-7">
                  <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/55">
                    ↘ Live signal
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/45">
                      Members
                    </div>
                    <div
                      className="mt-1 font-mono font-medium text-paper"
                      style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
                    >
                      <CountTicker to={MOCK_PROFILES.length + 489} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-paper/10 pt-4">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/45">Posts</div>
                      <div className="mt-1 font-mono text-[18px] text-paper">
                        <CountTicker to={132} duration={1300} />
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/45">Resources</div>
                      <div className="mt-1 font-mono text-[18px] text-paper">
                        <CountTicker to={MOCK_RESOURCES.length} duration={1100} />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-paper/10 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                    ⌁ Updated continuously
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pinned announcement ───────────────────────────────────────── */}
      {pinned && (
        <section className="border-b border-paper/10 px-6 py-16 md:px-10 md:py-20">
          <div className="container-wide">
            <Reveal>
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
                    [ 02 — Pinned ]
                  </div>
                  <h2 className="mt-3 text-[22px] font-semibold text-paper md:text-[26px]">From the Kozai team</h2>
                </div>
                <Link
                  to="/community/announcements"
                  className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
                >
                  All announcements →
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <AnnouncementCard post={pinned} featured />
            </Reveal>

            {otherAnn.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {otherAnn.map((p, i) => (
                  <Reveal key={p.id} delay={200 + i * 80}>
                    <AnnouncementCard post={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Featured resource + recent threads (two-col) ──────────────── */}
      <section className="border-b border-paper/10 px-6 py-16 md:px-10 md:py-20">
        <div className="container-wide grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          {/* Featured resource */}
          <div className="md:col-span-5">
            <Reveal>
              <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
                [ 03 — Featured resource ]
              </div>
            </Reveal>
            <Reveal delay={120}>
              {featuredResource && <ResourceCard resource={featuredResource} variant="featured" />}
            </Reveal>
          </div>

          {/* Recent activity */}
          <div className="md:col-span-7">
            <Reveal>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
                  [ 04 — Recent activity ]
                </div>
                <Link
                  to="/community/social"
                  className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
                >
                  Go to social →
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="border border-paper/12 bg-ink/40">
                {threads.map((t) => (
                  <ThreadItem key={t.id} post={t} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Community guidelines tease ────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="container-wide grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
              [ 05 — House rules ]
            </div>
            <h2
              className="mt-4 text-paper"
              style={{ fontFamily: "Geist", fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}
            >
              Operators first.{" "}
              <span className="italic-editorial text-signal">No grift.</span>{" "}
              Show your work.
            </h2>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.65] text-paper/65">
              Three rules, mostly. Be useful, be specific, credit prior work. Self-promotion is fine if it's something you actually shipped. Hiring posts go in Hiring. Sales pitches go in someone else's community.
            </p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <Link
              to="/community/auth"
              className="border border-paper bg-paper px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
            >
              Join the community ↘
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunityHome;
