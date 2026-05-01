import { Link } from "react-router-dom";
import Logo from "./Logo";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];
const legalLinks = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-and-conditions" },
];

const Footer = () => {
  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-bone/8 bg-ink">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(218,255,0,0.04) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-12 md:gap-8">
          <div className="col-span-2 md:col-span-5">
            <Logo variant="full" className="h-8 w-auto text-bone" />
            <p className="mt-6 max-w-[360px] text-sm leading-relaxed text-bone/55">
              A focused software studio. We design and build the tools your team actually
              needs — then ship them.
            </p>
            <a
              href="mailto:hello@kozai.ca"
              className="mt-8 inline-flex items-baseline gap-3 text-2xl text-bone hover-target"
            >
              <span className="label-stack">
                <span>hello@kozai.ca</span>
                <span className="text-signal">hello@kozai.ca</span>
              </span>
            </a>
          </div>

          <div className="col-span-1 md:col-span-3 md:col-start-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">
              Sitemap
            </div>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a className="hover-target inline-flex text-bone/85" href={l.href}>
                    <span className="label-stack text-base">
                      <span>{l.label}</span>
                      <span className="text-signal">{l.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">
              Studio
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-bone/85">
              <li>Toronto, ON · Canada</li>
              <li>Mon–Fri · 09–18 ET</li>
              <li>Accepting new projects</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-bone/8 pt-6 md:flex-row md:items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute">
            © 2026 Kozai · All rights reserved
          </div>
          <div className="flex gap-6">
            {legalLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute hover:text-bone"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">
            Built in-house · No frameworks were harmed
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
