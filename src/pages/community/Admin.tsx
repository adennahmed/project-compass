import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Tag from "@/components/community/Tag";
import StaffBadge from "@/components/community/StaffBadge";
import Avatar from "@/components/community/Avatar";
import EmptyState from "@/components/community/EmptyState";
import { useAuth } from "@/lib/community/auth";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/lib/community/types";
import { relativeTime } from "@/lib/community/format";

type Pane = "reports" | "members" | "posts" | "resources" | "audit";

const AdminPage = () => {
  const { profile, isMock, refreshProfile } = useAuth();
  const [pane, setPane] = useState<Pane>("reports");
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  // Gate: only staff/admin (mock mode always grants for design preview).
  const allowed = isMock || (profile && profile.role !== "member");

  useEffect(() => {
    if (!supabase || !allowed) return;
    if (pane !== "members") return;
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setMembers((data ?? []) as unknown as Profile[]);
        setLoading(false);
      });
  }, [pane, allowed]);

  const promote = async (id: string, role: "staff" | "admin" | "member") => {
    if (!supabase) return;
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) { alert(error.message); return; }
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    if (id === profile?.id) await refreshProfile();
  };

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
            loading ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading members…</p>
            ) : members.length === 0 ? (
              <EmptyState title="No members yet" body="When users sign up they'll show up here." />
            ) : (
              <div className="overflow-hidden border border-paper/12">
                <div className="grid grid-cols-12 gap-4 border-b border-paper/10 bg-ink/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                  <div className="col-span-5">Member</div>
                  <div className="col-span-3">Role</div>
                  <div className="col-span-2">Joined</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="grid grid-cols-12 items-center gap-4 border-b border-paper/8 px-4 py-3 text-[13px] last:border-b-0"
                  >
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <Avatar profile={m} size={28} />
                      <div className="min-w-0">
                        <div className="truncate text-paper">{m.display_name}</div>
                        <div className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">@{m.handle}</div>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <StaffBadge role={m.role} />
                      {m.role === "member" && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Member</span>
                      )}
                    </div>
                    <div className="col-span-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">
                      {relativeTime(m.created_at)}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      {m.role === "member" && (
                        <button
                          onClick={() => promote(m.id, "staff")}
                          className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75 hover:text-paper"
                        >
                          → Staff
                        </button>
                      )}
                      {m.role === "staff" && (
                        <>
                          <button
                            onClick={() => promote(m.id, "admin")}
                            className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75 hover:text-paper"
                          >
                            → Admin
                          </button>
                          <button
                            onClick={() => promote(m.id, "member")}
                            className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal"
                          >
                            Demote
                          </button>
                        </>
                      )}
                      {m.role === "admin" && m.id !== profile?.id && (
                        <button
                          onClick={() => promote(m.id, "staff")}
                          className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal"
                        >
                          → Staff
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {pane === "posts" && (
            <EmptyState title="No posts yet" body="When members start posting, you'll be able to moderate them from here." />
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
