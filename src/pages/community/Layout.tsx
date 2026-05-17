import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import CommunitySubNav from "@/components/community/CommunitySubNav";
import StaffBadge from "@/components/community/StaffBadge";
import Avatar from "@/components/community/Avatar";
import NotificationsBell from "@/components/community/NotificationsBell";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/community/auth";

/**
 * Top-level shell for every /community/* page. Owns:
 *   • Lenis smooth-scroll lifecycle (the main site's hero loader runs Lenis
 *     too; community pages get their own short init so direct deep-links work)
 *   • A dark, ink-themed nav bar with wordmark, sub-nav, and session controls
 *   • Outlet for the page body
 */
const CommunityLayout = () => {
  const { session, profile, signOut, isMock, needsOnboarding } = useAuth();
  const isStaff = profile?.role === "staff" || profile?.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Redirect first-time visitors to onboarding (unless they're already
  // on an auth/onboarding/settings page where it doesn't apply).
  useEffect(() => {
    if (!needsOnboarding) return;
    const exempt =
      location.pathname.startsWith("/community/onboarding") ||
      location.pathname.startsWith("/community/auth");
    if (!exempt) {
      navigate("/community/onboarding", { replace: true });
    }
  }, [needsOnboarding, location.pathname, navigate]);

  // Close the user menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* Primary header bar — dark, full-width, hairline border at bottom */}
      <header className="community-header">
        <div className="container-wide flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              to="/"
              className="inline-flex items-center text-paper transition-colors hover:text-signal"
              aria-label="Back to Kozai"
            >
              <Logo size={18} variant="white" />
            </Link>
            <span className="h-4 w-px bg-paper/15" aria-hidden />
            <Link
              to="/community"
              className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/85"
            >
              Community
            </Link>
            {isMock && (
              <span
                className="hidden border border-paper/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-paper/55 md:inline"
                title="No Supabase env vars detected — content is mock data."
              >
                Preview · Mock
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {session && profile ? (
              <>
              <NotificationsBell />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 text-paper/85 hover:text-paper"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <Avatar profile={profile} size={26} />
                  <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] md:inline">
                    @{profile.handle}
                  </span>
                  <StaffBadge role={profile.role} />
                  <span aria-hidden className="font-mono text-[10px] text-paper/55">▾</span>
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                      aria-hidden
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-50 mt-2 flex w-56 flex-col border border-paper/15 bg-ink p-1.5 shadow-2xl"
                    >
                      <Link
                        to={`/community/u/${profile.handle}`}
                        className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5 hover:text-paper"
                      >
                        View profile
                      </Link>
                      <Link
                        to="/community/settings"
                        className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5 hover:text-paper"
                      >
                        Settings
                      </Link>
                      {isStaff && (
                        <Link
                          to="/community/admin"
                          className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85 hover:bg-paper/5 hover:text-paper"
                        >
                          Admin
                        </Link>
                      )}
                      <span className="my-1 block h-px bg-paper/10" aria-hidden />
                      <button
                        type="button"
                        onClick={async () => { await signOut(); navigate("/community", { replace: true }); }}
                        className="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 hover:bg-paper/5 hover:text-signal"
                      >
                        Sign out ↗
                      </button>
                    </div>
                  </>
                )}
              </div>
              </>
            ) : (
              <Link
                to="/community/auth"
                className="border border-paper bg-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper"
              >
                Join the community ↘
              </Link>
            )}
          </div>
        </div>
        <CommunitySubNav isStaff={isStaff} />
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-paper/10">
        <div className="container-wide flex flex-col items-start justify-between gap-3 py-8 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45 md:flex-row md:items-center">
          <span>Kozai Community · Toronto · est. 2025</span>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-paper">↗ Main site</Link>
            <Link to="/privacy-policy" className="hover:text-paper">Privacy</Link>
            <Link to="/terms-and-conditions" className="hover:text-paper">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityLayout;
