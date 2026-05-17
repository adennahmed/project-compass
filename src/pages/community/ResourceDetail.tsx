import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownBody from "@/components/community/MarkdownBody";
import EmptyState from "@/components/community/EmptyState";
import Avatar from "@/components/community/Avatar";
import StaffBadge from "@/components/community/StaffBadge";
import { fetchResourceBySlug } from "@/lib/community/queries";
import { Resource, RESOURCE_KIND_LABEL } from "@/lib/community/types";
import { dateStamp } from "@/lib/community/format";
import { useAuth } from "@/lib/community/auth";

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { session, profile } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoading(true);
      setResource(await fetchResourceBySlug(slug));
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="container-wide font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
          ↘ Loading…
        </div>
      </section>
    );
  }

  if (!resource) {
    return (
      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="container-wide">
          <EmptyState title="Resource not found" body="It may have been unpublished, or the link is wrong." />
        </div>
      </section>
    );
  }

  const isAuthor = resource.author_id === session?.user.id;
  const isStaff = profile?.role === "staff" || profile?.role === "admin";
  const canEdit = isAuthor || isStaff;

  return (
    <article className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide max-w-[820px]">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
          <Link to="/community/resources" className="link-wipe hover:text-paper">← Resources</Link>
          <span className="text-paper/35"> · </span>
          <span className="text-signal">{RESOURCE_KIND_LABEL[resource.kind]}</span>
        </div>

        <h1
          className="mt-6 text-paper"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}
        >
          {resource.title}
        </h1>

        <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.6] text-paper/70 md:text-[17px]">
          {resource.summary}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-paper/10 py-4">
          {resource.author && <Avatar profile={resource.author} size={28} />}
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85">
            {resource.author?.display_name ?? "Kozai"}
          </span>
          {resource.author && <StaffBadge role={resource.author.role} />}
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            {resource.published_at ? dateStamp(resource.published_at) : "Draft"}
          </span>
          {canEdit && (
            <Link
              to={`/community/resources/${resource.slug}/edit`}
              className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
            >
              Edit →
            </Link>
          )}
        </div>

        {resource.hero_image_url && (
          <div className="my-8 border border-paper/12 bg-ink/40">
            <img src={resource.hero_image_url} alt="" className="block w-full" />
          </div>
        )}

        <div className="mt-2">
          <MarkdownBody source={resource.body_md} size="article" />
        </div>

        {resource.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-paper/10 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
            <span className="text-paper/35">tags ·</span>
            {resource.tags.map((t) => (
              <span key={t} className="border border-paper/15 px-2 py-1">{t}</span>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/community/resources"
            className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
          >
            ← Back to resources
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ResourceDetail;
