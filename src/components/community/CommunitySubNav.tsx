import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ITEMS = [
  { label: "Home",          to: "/community" },
  { label: "Announcements", to: "/community/announcements" },
  { label: "Social",        to: "/community/social" },
  { label: "Resources",     to: "/community/resources" },
  { label: "Members",       to: "/community/members" },
];

/**
 * Horizontal community sub-nav with sliding signal-orange indicator.
 * Echoes the role-selector pattern in the inquiry drawer so the language
 * stays consistent across the site.
 */
const CommunitySubNav = ({ isStaff = false }: { isStaff?: boolean }) => {
  const { pathname } = useLocation();
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Pick the deepest-matching item (longest `to` that prefixes pathname).
  const activeIdx = (() => {
    let best = 0;
    let bestLen = -1;
    const items = isStaff ? [...ITEMS, { label: "Admin", to: "/community/admin" }] : ITEMS;
    items.forEach((it, i) => {
      const match = pathname === it.to || pathname.startsWith(it.to + "/");
      if (match && it.to.length > bestLen) {
        best = i;
        bestLen = it.to.length;
      }
    });
    return best;
  })();

  const items = isStaff ? [...ITEMS, { label: "Admin", to: "/community/admin" }] : ITEMS;
  const activeKey = items[activeIdx]?.to;

  useLayoutEffect(() => {
    const el = activeKey ? refs.current[activeKey] : null;
    const track = trackRef.current;
    if (!el || !track) return;
    const t = track.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({ left: r.left - t.left, width: r.width });
  }, [activeKey, pathname]);

  // Resize-resilient
  useEffect(() => {
    const onResize = () => {
      const el = activeKey ? refs.current[activeKey] : null;
      const track = trackRef.current;
      if (!el || !track) return;
      const t = track.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setIndicator({ left: r.left - t.left, width: r.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeKey]);

  return (
    <div className="community-subnav">
      <div className="container-wide">
        <div ref={trackRef} className="relative flex items-center gap-1 overflow-x-auto py-3">
          {items.map((it) => {
            const isActive = it.to === activeKey;
            return (
              <Link
                key={it.to}
                ref={(el) => (refs.current[it.to] = el)}
                to={it.to}
                className={`relative whitespace-nowrap px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  isActive ? "text-paper" : "text-paper/55 hover:text-paper/90"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
          <span
            aria-hidden
            className="community-subnav__indicator"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunitySubNav;
