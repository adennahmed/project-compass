import { Link } from "react-router-dom";
import { RESOURCE_KIND_LABEL, Resource } from "@/lib/community/types";
import { profileById } from "@/lib/community/mock";
import { dateStamp } from "@/lib/community/format";

interface ResourceCardProps {
  resource: Resource;
  variant?: "default" | "featured";
}

const ResourceCard = ({ resource, variant = "default" }: ResourceCardProps) => {
  const author = resource.author ?? profileById(resource.author_id);
  const isFeatured = variant === "featured";

  return (
    <Link
      to={`/community/resources/${resource.slug}`}
      className={`group relative flex flex-col border border-paper/12 bg-ink/40 p-6 transition-colors hover:border-paper/30 md:p-7 ${
        isFeatured ? "md:p-10" : ""
      }`}
    >
      {/* hairline tag bar */}
      <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
        <span className="text-signal">{RESOURCE_KIND_LABEL[resource.kind]}</span>
        <span className="text-paper/45">{resource.read_minutes ?? 6} min read</span>
      </div>

      <h3
        className="mt-5 text-paper transition-colors group-hover:text-paper"
        style={{
          fontFamily: "Geist, system-ui, sans-serif",
          fontWeight: 600,
          fontSize: isFeatured
            ? "clamp(1.65rem, 2.4vw, 2.1rem)"
            : "clamp(1.15rem, 1.65vw, 1.4rem)",
          letterSpacing: "-0.025em",
          lineHeight: 1.12,
        }}
      >
        {resource.title}
      </h3>

      <p
        className={`mt-3 max-w-[60ch] leading-[1.6] text-paper/65 ${
          isFeatured ? "text-[15px] md:text-[16px]" : "text-[13.5px] md:text-[14px]"
        }`}
      >
        {resource.summary}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
        <span className="text-paper/75">{author.display_name}</span>
        <span>{resource.published_at ? dateStamp(resource.published_at) : "Draft"}</span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-3 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100"
      />
    </Link>
  );
};

export default ResourceCard;
