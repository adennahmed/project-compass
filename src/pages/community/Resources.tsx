import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import ResourceCard from "@/components/community/ResourceCard";
import Tag from "@/components/community/Tag";
import EmptyState from "@/components/community/EmptyState";
import { MOCK_RESOURCES } from "@/lib/community/mock";
import { RESOURCE_KIND_LABEL, ResourceKind } from "@/lib/community/types";

type KindFilter = "all" | ResourceKind;

const ResourcesPage = () => {
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    let list = MOCK_RESOURCES.filter((r) => r.published_at);
    if (kind !== "all") list = list.filter((r) => r.kind === kind);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [kind, query]);

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ 04 — Resources ]
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
          <CharReveal stagger={26}>{"WHAT WE'VE"}</CharReveal>{" "}
          <span className="italic-editorial text-signal">
            <CharReveal stagger={26} delay={220}>{"LEARNED"}</CharReveal>
          </span>{" "}
          <CharReveal stagger={26} delay={420}>{"BUILDING."}</CharReveal>
        </h1>

        <Reveal delay={500}>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
            Guides, deep-dives, case studies. Written by the Kozai team. Free to read, no email gate.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag active={kind === "all"} onClick={() => setKind("all")}>All</Tag>
              {(Object.keys(RESOURCE_KIND_LABEL) as ResourceKind[]).map((k) => (
                <Tag key={k} active={kind === k} onClick={() => setKind(k)}>
                  {RESOURCE_KIND_LABEL[k]}
                </Tag>
              ))}
            </div>
            <div className="kz-input kz-input--dark flex w-full items-center md:w-72">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                ↘ Search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="topic, tag, keyword"
                className="ml-3 w-full bg-transparent text-[14px] text-paper placeholder:text-paper/35 focus:outline-none"
              />
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState
              title="No resources match"
              body="Try clearing the filter or searching for something else."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {featured && (
                <Reveal delay={140}>
                  <div className="md:col-span-12">
                    <ResourceCard resource={featured} variant="featured" />
                  </div>
                </Reveal>
              )}
              {rest.map((r, i) => (
                <Reveal key={r.id} delay={180 + i * 70}>
                  <div className="md:col-span-6">
                    <ResourceCard resource={r} />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResourcesPage;
