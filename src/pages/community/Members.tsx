import { useEffect, useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import MemberCard from "@/components/community/MemberCard";
import Tag from "@/components/community/Tag";
import EmptyState from "@/components/community/EmptyState";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { Profile } from "@/lib/community/types";

type RoleFilter = "all" | "staff" | "member";

const MembersPage = () => {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<RoleFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .order("role", { ascending: true })           // admin/staff first
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
        } else {
          setMembers((data ?? []) as unknown as Profile[]);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const list = useMemo(() => {
    let items = members;
    if (role !== "all") {
      items = items.filter((p) =>
        role === "staff" ? p.role !== "member" : p.role === "member",
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.display_name.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          (p.bio?.toLowerCase().includes(q) ?? false),
      );
    }
    return items;
  }, [members, role, query]);

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal replay={false}>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ 05 — Members ]
          </div>
        </Reveal>

        <h1
          className="mt-5 text-paper"
          style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.02 }}
        >
          <CharReveal replay={false} stagger={26}>{"WHO'S IN"}</CharReveal>{" "}
          <span className="italic-editorial text-signal">
            <CharReveal replay={false} stagger={26} delay={200}>{"THE ROOM."}</CharReveal>
          </span>
        </h1>

        <Reveal replay={false} delay={500}>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
            Operators, engineers, founders. The Kozai team and the people building alongside us.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal replay={false} delay={120}>
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag active={role === "all"} onClick={() => setRole("all")}>All</Tag>
              <Tag active={role === "staff"} onClick={() => setRole("staff")}>Kozai team</Tag>
              <Tag active={role === "member"} onClick={() => setRole("member")}>Members</Tag>
            </div>
            <div className="kz-input kz-input--dark flex w-full items-center md:w-72">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">↘ Find</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="name, handle, bio"
                className="ml-3 w-full bg-transparent text-[14px] text-paper placeholder:text-paper/35 focus:outline-none"
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-10">
          {loading ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">↘ Loading members…</p>
          ) : error ? (
            <EmptyState title="Couldn't load members" body={error} />
          ) : list.length === 0 ? (
            <EmptyState
              title={members.length === 0 ? "No members yet" : "No matches"}
              body={
                members.length === 0
                  ? "Be the first — create an account and your profile will appear here."
                  : "Try clearing the filter."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              {list.map((p, i) => (
                <Reveal replay={false} key={p.id} delay={i * 50}>
                  <MemberCard profile={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MembersPage;
