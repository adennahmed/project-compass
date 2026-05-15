import { useState } from "react";
import { Navigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Tag from "@/components/community/Tag";
import StaffBadge from "@/components/community/StaffBadge";
import Avatar from "@/components/community/Avatar";
import EmptyState from "@/components/community/EmptyState";
import { useAuth } from "@/lib/community/auth";
import { MOCK_POSTS, MOCK_PROFILES } from "@/lib/community/mock";
import { monoDate, relativeTime } from "@/lib/community/format";

type Pane = "reports" | "members" | "posts" | "resources" | "audit";

const AdminPage = () => {
  const { profile, isMock } = useAuth();
  const [pane, setPane] = useState<Pane>("reports");

  // Gate: only staff/admin (mock mode always grants for design preview).
  const allowed = isMock || (profile && profile.role !== "member");
  if (!allowed) return <Navigate to="/community" replace />;

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
          {pane === "reports" && (
            <EmptyState
              title="No open reports"
              body="When members report a post or comment, it appears here for review. You'll be able to dismiss, hide, warn, or suspend from this surface."
            />
          )}

          {pane === "members" && (
            <div className="overflow-hidden border border-paper/12">
              <div className="grid grid-cols-12 gap-4 border-b border-paper/10 bg-ink/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                <div className="col-span-5">Member</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {MOCK_PROFILES.map((m) => (
                <div
                  key={m.id}
                  className="grid grid-cols-12 items-center gap-4 border-b border-paper/8 px-4 py-3 text-[13px] last:border-b-0"
                >
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <Avatar profile={m} size={28} />
                    <div className="min-w-0">
                      <div className="truncate text-paper">{m.display_name}</div>
                      <div className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">
                        @{m.handle}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <StaffBadge role={m.role} />
                    {m.role === "member" && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                        Member
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">
                    {relativeTime(m.created_at)}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75 hover:text-paper">
                      Promote ↗
                    </button>
                    <button className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal">
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pane === "posts" && (
            <div className="overflow-hidden border border-paper/12">
              <div className="grid grid-cols-12 gap-4 border-b border-paper/10 bg-ink/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                <div className="col-span-6">Title</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {MOCK_POSTS.map((p) => (
                <div key={p.id} className="grid grid-cols-12 items-center gap-4 border-b border-paper/8 px-4 py-3 text-[13px] last:border-b-0">
                  <div className="col-span-6 truncate text-paper">
                    {p.pinned && <span className="mr-2 text-signal">⌁</span>}
                    {p.title}
                  </div>
                  <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                    {p.type}
                  </div>
                  <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
                    {monoDate(p.created_at)}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75 hover:text-paper">
                      {p.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pane === "resources" && (
            <EmptyState
              title="Publishing queue is empty"
              body="Draft resources ready for review appear here. Staff can publish or send back for edits."
            />
          )}

          {pane === "audit" && (
            <EmptyState
              title="No actions recorded"
              body="Every admin action — pins, suspensions, role changes — is logged here with a before/after diff."
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
