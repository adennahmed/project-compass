import { Link } from "react-router-dom";
import { Resource, RESOURCE_KIND_LABEL } from "@/lib/community/types";
import { profileById } from "@/lib/community/mock";
import { dateStamp } from "@/lib/community/format";

interface ResourceDeckProps {
  resources: Resource[];
}

/**
 * Resource "deck" — a horizontal hand of cards on desktop, vertical stack
 * on mobile.
 *
 * Behavior:
 *   • At rest, every card is the same width with a slight alternating tilt
 *     so the row looks like a fanned hand.
 *   • Hovering any card flex-grows it to roughly 2.4× its neighbors, lifts
 *     it forward, unrotates it, and fades in the summary copy.
 *   • Siblings shrink, tilt slightly more, and dim — so the active card
 *     reads as the one you've "pulled from the deck".
 *
 * The flex/rotation choreography is CSS-only; React just renders the slot
 * indices so we can stagger rotations and tweak per-card variables.
 */
const ResourceDeck = ({ resources }: ResourceDeckProps) => {
  if (resources.length === 0) return null;

  return (
    <div className="resource-deck">
      {resources.map((r, i) => {
        const author = r.author ?? profileById(r.author_id);
        return (
          <Link
            key={r.id}
            to={`/community/resources/${r.slug}`}
            className="resource-deck__card"
            style={
              {
                "--idx": i,
                "--total": resources.length,
              } as React.CSSProperties
            }
          >
            {/* Inner inset so the outer link gets the hover transform
                while the inner content gets the border/background. */}
            <div className="resource-deck__inner">
              <div className="resource-deck__top">
                <span className="resource-deck__kind">
                  {RESOURCE_KIND_LABEL[r.kind]}
                </span>
                <span className="resource-deck__read">
                  {r.read_minutes ?? 6} min
                </span>
              </div>

              <h3 className="resource-deck__title">{r.title}</h3>

              <p className="resource-deck__summary">{r.summary}</p>

              <div className="resource-deck__bottom">
                <span className="resource-deck__author">
                  {author.display_name}
                </span>
                <span className="resource-deck__date">
                  {r.published_at ? dateStamp(r.published_at) : "Draft"}
                </span>
              </div>

              {/* Index "card #" mark — small flourish, like a playing card. */}
              <span aria-hidden className="resource-deck__index">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Hover affordance — signal-orange edge that draws in. */}
              <span aria-hidden className="resource-deck__edge" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ResourceDeck;
